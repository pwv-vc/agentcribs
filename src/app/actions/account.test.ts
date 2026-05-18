import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock cloudflare:workers
const mockKV = {
  put: vi.fn(),
  get: vi.fn(),
};
const mockQueue = {
  send: vi.fn(),
};

vi.mock("cloudflare:workers", () => ({
  env: {
    AGENTCRIBS_KV: mockKV,
    ACCOUNT_LOGIN_QUEUE: mockQueue,
  },
}));

// rwsdk — pass through serverAction
vi.mock("rwsdk/worker", () => ({
  serverAction: (fn: Function) => fn,
  requestInfo: { ctx: { session: {} } },
  ErrorResponse: class extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  },
}));

// Mock drizzle-orm
vi.mock("drizzle-orm", () => ({
  eq: () => "eq_marker",
  sql: () => "sql_marker",
  desc: () => "desc_marker",
  and: (...args: unknown[]) => args,
}));

// Mock db/schema
vi.mock("@/db/schema", () => ({
  accounts: { id: "accounts.id", email: "accounts.email" },
  profiles: {},
  documents: {},
}));

// Mock queue actions
const mockEnqueueBackfillJob = vi.fn();
vi.mock("@/app/actions/queue", () => ({
  enqueueBackfillJob: mockEnqueueBackfillJob,
  enqueueBackfillJobs: vi.fn(),
}));

// Mock application
vi.mock("@/app/actions/application", () => ({
  kvKey: (id: string) => `app:${id}`,
  r2Meta: () => ({}),
  emailIndexKey: (email: string) => `email:${email}`,
}));

// Mock url
vi.mock("@/app/lib/url", () => ({
  getAppUrl: () => "http://localhost:5173",
}));

// Mock document-import
vi.mock("@/app/lib/document-import", () => ({
  scanAndImportDirectoryDocs: vi.fn(),
}));

// Mock db module
let dbAccountResult: unknown[] = [];
const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
};

vi.mock("@/db/db", () => ({
  db: mockDb,
}));

const { initiateAccountLogin } = await import("@/app/actions/account");

describe("initiateAccountLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbAccountResult = [];
  });

  function formDataWith(email: string): FormData {
    const fd = new FormData();
    fd.set("email", email);
    return fd;
  }

  function stubAccountQuery(rows: { id: string }[]) {
    dbAccountResult = rows;
    const chain: Record<string, unknown> = {};
    chain.select = vi.fn(() => chain);
    chain.from = vi.fn(() => chain);
    chain.where = vi.fn(() => chain);
    chain.limit = vi.fn(() => chain);
    // Drizzle query builders are thenable — await resolves to rows
    chain.then = (resolve: Function) => Promise.resolve(resolve(dbAccountResult));
    mockDb.select.mockReturnValue(chain);
    mockDb.insert.mockReturnValue({
      values: vi.fn(() => Promise.resolve()),
    });
  }

  it("returns 400 when email is empty", async () => {
    const response = await initiateAccountLogin(new FormData());
    expect(response.status).toBe(400);
  });

  it("sends magic link when account exists", async () => {
    const email = "existing@example.com";
    stubAccountQuery([{ id: "usr_abc123" }]);

    const response = await initiateAccountLogin(formDataWith(email));

    expect(mockKV.put).toHaveBeenCalledWith(
      expect.stringMatching(/^login:/),
      expect.stringContaining(email),
      { expirationTtl: 900 },
    );
    expect(mockQueue.send).toHaveBeenCalledWith(
      expect.objectContaining({ email }),
    );
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/login?sent=true");
  });

  it("auto-backfills when no account but email index exists in KV", async () => {
    const email = "prior-applicant@example.com";
    const applicationId = "app_test_01KQHZRVWCE7P1S4T70Z";

    stubAccountQuery([]);
    mockKV.get.mockResolvedValue(applicationId);

    const response = await initiateAccountLogin(formDataWith(email));

    expect(mockKV.get).toHaveBeenCalledWith(`email:${email}`);
    expect(mockEnqueueBackfillJob).toHaveBeenCalledWith(applicationId);
    expect(mockKV.put).toHaveBeenCalledWith(
      expect.stringMatching(/^login:/),
      expect.stringContaining(email),
      { expirationTtl: 900 },
    );
    expect(mockQueue.send).toHaveBeenCalledWith(
      expect.objectContaining({ email }),
    );
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/login?sent=true");
  });

  it("silently succeeds when no account and no email index", async () => {
    const email = "unknown@example.com";

    stubAccountQuery([]);
    mockKV.get.mockResolvedValue(null);

    const response = await initiateAccountLogin(formDataWith(email));

    expect(mockKV.get).toHaveBeenCalledWith(`email:${email}`);
    expect(mockEnqueueBackfillJob).not.toHaveBeenCalled();
    expect(mockKV.put).not.toHaveBeenCalled();
    expect(mockQueue.send).not.toHaveBeenCalled();
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/login?sent=true");
  });
});

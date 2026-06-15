import { DurableObject } from "cloudflare:workers";

interface SessionData {
  accountId: string | null;
  applicationId: string | null;
}

export class UserSession extends DurableObject<Env> {
  private storage: DurableObjectStorage;
  private session: SessionData | undefined;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.storage = state.storage;
  }

  async fetch(_request: Request): Promise<Response> {
    return new Response("UserSession DO — use RPC", { status: 405 });
  }

  async getSession() {
    if (!this.session) {
      this.session = (await this.storage.get<SessionData>("session")) ?? {
        accountId: null,
        applicationId: null,
      };
    }
    return { value: this.session };
  }

  async saveSession(data: Partial<SessionData>) {
    const existing = await this.getSession();
    this.session = {
      accountId: data.accountId ?? existing.value.accountId,
      applicationId: data.applicationId ?? existing.value.applicationId,
    };
    await this.storage.put("session", this.session);
    return this.session;
  }

  async revokeSession() {
    await this.storage.delete("session");
    this.session = undefined;
  }
}

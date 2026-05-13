"use server";

import { serverAction, requestInfo, ErrorResponse } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import { db } from "@/db/db";
import { accounts, profiles, documents } from "@/db/schema";
import { kvKey, r2Meta } from "@/app/actions/application";
import { eq } from "drizzle-orm";
import { enqueueBackfillJobs } from "@/app/actions/queue";

function requireAccountId(): string {
  const accountId = requestInfo.ctx.session?.accountId;
  if (!accountId) {
    throw new ErrorResponse(401, "Authentication required");
  }
  return accountId;
}

export const getAccount = serverAction(async () => {
  const accountId = requireAccountId();

  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, accountId))
    .limit(1);

  if (!account) {
    throw new ErrorResponse(404, "Account not found");
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.account_id, accountId))
    .limit(1);

  return { account, profile: profile ?? null };
});

export const updateProfile = serverAction(async (data: {
  first_name?: string;
  last_name?: string;
  nickname?: string;
  bio?: string;
  avatar_url?: string;
}) => {
  const accountId = requireAccountId();

  const now = new Date().toISOString();

  await db
    .insert(profiles)
    .values({
      account_id: accountId,
      first_name: data.first_name ?? null,
      last_name: data.last_name ?? null,
      nickname: data.nickname ?? null,
      bio: data.bio ?? null,
      avatar_url: data.avatar_url ?? null,
      updated_at: now,
    })
    .onConflictDoUpdate({
      target: profiles.account_id,
      set: {
        first_name: data.first_name ?? null,
        last_name: data.last_name ?? null,
        nickname: data.nickname ?? null,
        bio: data.bio ?? null,
        avatar_url: data.avatar_url ?? null,
        updated_at: now,
      },
    });

  return { success: true };
});

export const uploadDocument = serverAction(async (formData: FormData) => {
  const accountId = requireAccountId();

  const file = formData.get("file") as File | null;
  const applicationId = formData.get("applicationId") as string | null;
  const documentType =
    (formData.get("documentType") as string) ?? "application";

  if (!file) {
    throw new ErrorResponse(400, "No file provided");
  }

  const arrayBuffer = await file.arrayBuffer();
  const r2Key = `accounts/${accountId}/documents/${crypto.randomUUID()}/${file.name}`;

  await env.AGENTCRIBS_R2.put(r2Key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });

  const [doc] = await db
    .insert(documents)
    .values({
      account_id: accountId,
      application_id: applicationId ?? null,
      document_type: documentType,
      filename: file.name,
      content_type: file.type,
      size_bytes: file.size,
      r2_key: r2Key,
    })
    .returning();

  return { document: doc };
});

export const getDocuments = serverAction(async () => {
  const accountId = requireAccountId();

  const docs = await db
    .select()
    .from(documents)
    .where(eq(documents.account_id, accountId))
    .orderBy(documents.created_at);

  return { documents: docs };
});

/** Admin: create an account from an existing application. */
export const backfillAccount = serverAction(
  async (applicationId: string) => {
    const appRaw = await env.AGENTCRIBS_KV.get(kvKey(applicationId));
    if (!appRaw) {
      throw new ErrorResponse(404, "Application not found");
    }

    const app = JSON.parse(appRaw);
    const email = app.email;
    const name = `${app.firstName} ${app.lastName}`;

    const [existing] = await db
      .select({ id: accounts.id })
      .from(accounts)
      .where(eq(accounts.email, email))
      .limit(1);

    let accountId: string;
    if (existing) {
      accountId = existing.id;
    } else {
      const [created] = await db
        .insert(accounts)
        .values({ email })
        .returning({ id: accounts.id });
      accountId = created.id;
    }

    const now = new Date().toISOString();
    await db
      .insert(profiles)
      .values({
        account_id: accountId,
        first_name: app.firstName ?? null,
        last_name: app.lastName ?? null,
        github_handle: app.githubHandle ?? null,
        github_id: app.githubId ?? null,
        avatar_url: app.githubAvatarUrl ?? null,
        updated_at: now,
      })
      .onConflictDoUpdate({
        target: profiles.account_id,
        set: {
          first_name: app.firstName ?? null,
          last_name: app.lastName ?? null,
          github_handle: app.githubHandle ?? null,
          github_id: app.githubId ?? null,
          avatar_url: app.githubAvatarUrl ?? null,
          updated_at: now,
        },
      });

    // Link application to account
    app.accountId = accountId;
    app.updatedAt = now;
    const serialized = JSON.stringify(app);

    // Save application JSON as a document the user can see/download
    const docR2Key = `accounts/${accountId}/documents/${applicationId}.json`;
    await Promise.all([
      env.AGENTCRIBS_KV.put(kvKey(applicationId), serialized),
      env.AGENTCRIBS_R2.put(
        `applications/${applicationId}.json`,
        serialized,
        r2Meta(app),
      ),
      env.AGENTCRIBS_R2.put(docR2Key, serialized, {
        httpMetadata: { contentType: "application/json" },
      }),
      db.insert(documents).values({
        account_id: accountId,
        application_id: applicationId,
        document_type: "application",
        filename: `application-${applicationId}.json`,
        content_type: "application/json",
        size_bytes: new TextEncoder().encode(serialized).length,
        r2_key: docR2Key,
      }),
    ]);

    return { accountId, email, name };
  },
);

/** Admin: enqueue all applications without accounts for backfill processing. */
export const backfillAllAccounts = serverAction(async () => {
  const count = await enqueueBackfillJobs();
  return { enqueued: count };
});

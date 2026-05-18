import type { RouteMiddleware } from "rwsdk/router";
import { env } from "cloudflare:workers";
import { kvKey, r2Meta } from "@/app/actions/application";
import type { ApplicationData } from "@/app/actions/application";
import { db } from "@/db/db";
import { accounts, documents } from "@/db/schema";
import { eq } from "drizzle-orm";

export const handleVerificationCallback: RouteMiddleware = async (
  requestInfo,
) => {
  const url = new URL(requestInfo.request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/apply/verify/error" },
    });
  }

  const raw = await env.AGENTCRIBS_KV.get(`verify:${token}`);
  if (!raw) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/apply/verify/error" },
    });
  }

  const { applicationId } = JSON.parse(raw);
  const appRaw = await env.AGENTCRIBS_KV.get(kvKey(applicationId));
  if (!appRaw) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/apply/verify/error" },
    });
  }

  const now = new Date().toISOString();
  const app: ApplicationData = JSON.parse(appRaw);

  // Guard: only verify if the application is still unverified.
  // If admin already accepted/rejected, don't revert their decision.
  if (app.status !== "unverified") {
    await env.AGENTCRIBS_KV.delete(`verify:${token}`);
    return new Response(null, {
      status: 302,
      headers: { Location: "/apply/verify/success" },
    });
  }

  app.status = "pending";
  app.updatedAt = now;

  // Create or link account on verification so applicant can access /my/profile.
  const [existingAccount] = await db
    .select({ id: accounts.id })
    .from(accounts)
    .where(eq(accounts.email, app.email))
    .limit(1);

  if (existingAccount) {
    app.accountId = existingAccount.id;
    await db
      .update(accounts)
      .set({ updated_at: now })
      .where(eq(accounts.id, existingAccount.id));
  } else {
    const [newAccount] = await db
      .insert(accounts)
      .values({ email: app.email })
      .returning({ id: accounts.id });
    app.accountId = newAccount.id;
  }

  const serialized = JSON.stringify(app);

  // Save application JSON as a document the user can see/download
  const docR2Key = `accounts/${app.accountId}/documents/${applicationId}.json`;
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
      account_id: app.accountId!,
      application_id: applicationId,
      document_type: "application",
      filename: `application-${applicationId}.json`,
      content_type: "application/json",
      size_bytes: new TextEncoder().encode(serialized).length,
      r2_key: docR2Key,
    }),
    env.AGENTCRIBS_KV.delete(`verify:${token}`),
  ]);

  // Notify user their application is pending review, and notify admin
  await env.NOTIFICATION_QUEUE.send({
    type: "pending-review",
    email: app.email,
    name: `${app.firstName} ${app.lastName}`,
    applicationId,
  });

  return new Response(null, {
    status: 302,
    headers: { Location: "/apply/verify/success" },
  });
};

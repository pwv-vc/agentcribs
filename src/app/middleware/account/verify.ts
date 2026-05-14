import type { RouteMiddleware } from "rwsdk/router";
import { env } from "cloudflare:workers";
import { db } from "@/db/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionStore } from "@/app/lib/session";

/**
 * Handles the account login magic link verification at /login/verify?token=xxx.
 * Looks up the one-time token in KV, finds the account in D1,
 * persists the session to a signed cookie, and redirects to /my/profile.
 */
export const handleAccountVerification: RouteMiddleware = async (
  requestInfo,
) => {
  const url = new URL(requestInfo.request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  // Look up the one-time login token in KV
  const raw = await env.AGENTCRIBS_KV.get(`login:${token}`);
  if (!raw) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login?expired=true" },
    });
  }

  const { email } = JSON.parse(raw) as { email: string };

  // Find the account — should exist since login action only creates
  // tokens for known accounts
  const [account] = await db
    .select({ id: accounts.id, email: accounts.email })
    .from(accounts)
    .where(eq(accounts.email, email))
    .limit(1);

  // Delete the one-time token regardless of outcome
  await env.AGENTCRIBS_KV.delete(`login:${token}`);

  if (!account) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  // Set session in context + persist to signed cookie via session store
  requestInfo.ctx.session = {
    ...requestInfo.ctx.session,
    accountId: account.id,
    email: account.email,
  };

  // Persist session to cookie
  const sessionStore = getSessionStore();
  const headers = new Headers();
  await sessionStore.save(headers, { accountId: account.id });
  headers.set("Location", "/my/profile");

  return new Response(null, { status: 302, headers });
};

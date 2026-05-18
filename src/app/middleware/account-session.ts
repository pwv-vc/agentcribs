import type { RouteMiddleware } from "rwsdk/router";
import { db } from "@/db/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { gravatarUrl } from "@/app/lib/gravatar";
import { getSessionStore } from "@/app/lib/session";

/**
 * Loads the account session from the signed cookie, hydrates ctx.session
 * with account data from D1, or redirects to /login if no valid session.
 *
 * Dev mode: supports ?as=email to bypass the login flow.
 */
export const accountSessionMiddleware: RouteMiddleware = async ({
  request,
  ctx,
}) => {
  let accountId: string | undefined;
  let email: string | undefined;

  // Dev mode: ?as=email@test.com simulates authenticated account
  const devEmail = getDevEmail(request);
  if (devEmail) {
    email = devEmail;
    const [existing] = await db
      .select({ id: accounts.id })
      .from(accounts)
      .where(eq(accounts.email, devEmail))
      .limit(1);

    if (existing) {
      accountId = existing.id;
    } else {
      const [created] = await db
        .insert(accounts)
        .values({ email: devEmail })
        .returning({ id: accounts.id });
      accountId = created.id;
    }
  } else {
    // Load session from signed cookie
    const sessionStore = getSessionStore();
    const sessionData = await sessionStore.load(request);
    if (!sessionData?.accountId) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }
    accountId = sessionData.accountId as string;

    // Verify account still exists in D1 and get email
    const [account] = await db
      .select({ email: accounts.email })
      .from(accounts)
      .where(eq(accounts.id, accountId))
      .limit(1);

    if (!account) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }
    email = account.email;
  }

  const avatar = await gravatarUrl(email);

  ctx.session = {
    ...ctx.session,
    email,
    accountId,
    avatarUrl: avatar,
  };

  // Only set devEmail when impersonating; pages use this to conditionally
  // add ?as= to links — should not leak the real email into query params.
  ctx.devEmail = devEmail ?? undefined;
};

function getDevEmail(request: Request): string | null {
  if (!import.meta.env.DEV) return null;
  const url = new URL(request.url);
  const raw =
    url.searchParams.get("as") ?? request.headers.get("x-dev-email");
  if (!raw) return null;
  // URLSearchParams decodes + as space, but emails can have + in them.
  return raw.replace(/ /g, "+");
}

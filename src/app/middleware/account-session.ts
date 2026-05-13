import type { RouteMiddleware } from "rwsdk/router";
import { ErrorResponse } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import { db } from "@/db/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyAccessToken } from "@/app/lib/access-jwt";
import { gravatarUrl } from "@/app/lib/gravatar";

function getDevEmail(request: Request): string | null {
  if (!import.meta.env.DEV) return null;
  const url = new URL(request.url);
  const raw = url.searchParams.get("as") ?? request.headers.get("x-dev-email");
  if (!raw) return null;
  // URLSearchParams decodes + as space, but emails can have + in them.
  // Since valid emails never contain spaces, restore + from any decoded spaces.
  return raw.replace(/ /g, "+");
}

async function resolveDevAccount(email: string) {
  const [existing] = await db
    .select({ id: accounts.id, email: accounts.email })
    .from(accounts)
    .where(eq(accounts.email, email))
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(accounts)
    .values({ email })
    .returning({ id: accounts.id, email: accounts.email });

  return created;
}

/**
 * Hydrates ctx.session from Cloudflare Access JWT + D1 account lookup.
 * In dev, supports ?as=email query param or x-dev-email header to simulate auth.
 */
export const accountSessionMiddleware: RouteMiddleware = async ({
  request,
  ctx,
}) => {
  let email: string | undefined;
  let sub: string | undefined;

  const devEmail = getDevEmail(request);
  if (devEmail) {
    email = devEmail;
    sub = "dev-user";
  } else {
    const identity = await verifyAccessToken(
      request,
      env.CF_ACCESS_TEAM_DOMAIN,
      env.CF_ACCESS_AUD,
    );
    if (!identity) {
      throw new ErrorResponse(401, "Authentication required");
    }
    email = identity.email;
    sub = identity.sub;
  }

  const account = await resolveDevAccount(email);

  const avatar = await gravatarUrl(email);

  ctx.session = {
    ...ctx.session,
    email,
    sub,
    accountId: account.id,
    avatarUrl: avatar,
  };
};

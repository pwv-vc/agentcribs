import type { RouteMiddleware } from "rwsdk/router";
import { env } from "cloudflare:workers";
import { verifyAccessToken } from "@/app/lib/access-jwt";

function getDevEmail(request: Request): string | null {
  if (!import.meta.env.DEV) return null;
  const url = new URL(request.url);
  const raw = url.searchParams.get("as") ?? request.headers.get("x-dev-email");
  if (!raw) return null;
  return raw.replace(/ /g, "+");
}

/**
 * Hydrates ctx.session from Cloudflare Access JWT.
 * In dev, supports ?as=email to simulate authentication.
 */
export const cloudflareSessionMiddleware: RouteMiddleware = async ({
  request,
  ctx,
}) => {
  const devEmail = getDevEmail(request);
  if (devEmail) {
    ctx.session = { email: devEmail, sub: "dev-user" };
    return;
  }

  const identity = await verifyAccessToken(
    request,
    env.CF_ACCESS_TEAM_DOMAIN,
    env.CF_ACCESS_AUD,
  );

  if (identity) {
    ctx.session = identity;
  }
};

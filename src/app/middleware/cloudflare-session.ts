import type { RouteMiddleware } from "rwsdk/router";

/**
 * Hydrates ctx.session from Cloudflare Access headers.
 * Runs on every request to populate session context for downstream middleware and pages.
 */
export const cloudflareSessionMiddleware: RouteMiddleware = ({
  request,
  ctx,
}) => {
  const email = request.headers.get("cf-access-authenticated-user-email");

  if (email) {
    ctx.session = {
      email,
      sub:
        request.headers.get("cf-access-authenticated-user-id") ?? "",
    };
  }
};

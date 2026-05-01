/**
 * Hydrates ctx.session from Cloudflare Access headers.
 * Runs on every request to populate session context for downstream middleware and pages.
 */
export const cloudflareSessionMiddleware = ({
  request,
  ctx,
}: {
  request: Request;
  ctx: { session?: { email: string; sub: string } };
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

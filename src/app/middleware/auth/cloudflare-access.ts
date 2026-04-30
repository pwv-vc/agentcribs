import type { RouteMiddleware } from "rwsdk/router";

export const requireCloudflareAccess = (): RouteMiddleware => {
  return (requestInfo) => {
    const email = requestInfo.request.headers.get(
      "cf-access-authenticated-user-email",
    );

    if (email) {
      // note: sub is not populated. would have to fetch jwt, verify, and get sub
      requestInfo.ctx.session = {
        email,
        sub:
          requestInfo.request.headers.get("cf-access-authenticated-user-id") ??
          "",
      };
    }
  };
};

import type { RouteMiddleware } from "rwsdk/router";
import { getSessionStore } from "@/app/lib/session";

/**
 * Handles account logout at /logout.
 * Clears the session cookie via sessionStore.remove, then redirects to /login.
 */
export const handleAccountLogout: RouteMiddleware = async (requestInfo) => {
  const sessionStore = getSessionStore();
  const headers = new Headers();
  await sessionStore.remove(requestInfo.request, headers);
  headers.set("Location", "/login");

  return new Response(null, { status: 302, headers });
};

import type { RouteMiddleware } from "rwsdk/router";
import { env } from "cloudflare:workers";
import { extractRelevantHeaders } from "@c15t/react/server";
import { C15T_ROUTE_PREFIX } from "@/app/shared/c15t";

// Proxies c15t consent API calls to the configured backend.
// Strips all headers except geo/locale/forwarding signals needed by c15t,
// injecting Cloudflare's real client IP as X-Forwarded-For.
export const handleC15tRewrite: RouteMiddleware = async ({ request }) => {
  const backendURL = env.C15T_BACKEND_URL?.trim();
  if (!backendURL) {
    return new Response("C15T_BACKEND_URL not configured", { status: 500 });
  }

  // Build the target URL by replacing the route prefix with the backend path
  const requestURL = new URL(request.url);
  const targetURL = new URL(backendURL);
  const routePath = requestURL.pathname.slice(C15T_ROUTE_PREFIX.length);

  targetURL.pathname = joinPaths(targetURL.pathname, routePath);
  targetURL.search = requestURL.search;

  // Inject Cloudflare's real client IP onto a mutable header copy
  const reqHeaders = new Headers(request.headers);
  const cfIp = request.headers.get("CF-Connecting-IP");
  if (cfIp) {
    reqHeaders.set("X-Forwarded-For", cfIp);
  }

  // Keep only the headers c15t needs for geo/locale consent decisions
  const relevant = extractRelevantHeaders(reqHeaders);
  const headers = new Headers(relevant);
  headers.set("Accept", "application/json");

  const rewrittenRequest = new Request(targetURL.toString(), {
    method: request.method,
    headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : request.body,
    signal: AbortSignal.timeout(10_000),
  });

  return fetch(rewrittenRequest).catch((err) => {
    console.error(
      "c15t rewrite error:",
      err instanceof Error ? err.message : err,
    );
    return new Response("c15t backend unavailable", { status: 502 });
  });
};

function joinPaths(basePath: string, routePath: string) {
  const base = basePath === "/" ? "" : basePath.replace(/\/+$/, "");
  const route = routePath.replace(/^\/+/, "");

  if (!route) {
    return base || "/";
  }

  return `${base}/${route}`;
}

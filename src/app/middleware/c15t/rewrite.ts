import type { RouteMiddleware } from "rwsdk/router";
import { env } from "cloudflare:workers";

const C15T_ROUTE_PREFIX = "/api/c15t";
const HOP_BY_HOP_HEADERS = [
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];

export const handleC15tRewrite: RouteMiddleware = async ({ request }) => {
  const backendURL = env.C15T_BACKEND_URL?.trim();
  if (!backendURL) {
    return new Response("C15T_BACKEND_URL not configured", { status: 500 });
  }

  const requestURL = new URL(request.url);
  const targetURL = new URL(backendURL);
  const routePath = requestURL.pathname.slice(C15T_ROUTE_PREFIX.length);

  targetURL.pathname = joinPaths(targetURL.pathname, routePath);
  targetURL.search = requestURL.search;

  const headers = new Headers(request.headers);
  for (const header of HOP_BY_HOP_HEADERS) {
    headers.delete(header);
  }

  const cfIp = request.headers.get("CF-Connecting-IP");
  if (cfIp) {
    const forwardedFor = headers.get("X-Forwarded-For");
    headers.set(
      "X-Forwarded-For",
      forwardedFor ? `${forwardedFor}, ${cfIp}` : cfIp,
    );
  }

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

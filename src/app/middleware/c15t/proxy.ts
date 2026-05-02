import type { RouteMiddleware } from "rwsdk/router";
import { env } from "cloudflare:workers";

/**
 * Proxies /api/c15t/* requests to the c15t backend.
 * Same-origin proxying cuts DNS/TLS overhead, making init ~2x faster on cold loads.
 */
export const c15tProxy: RouteMiddleware = async ({ request }) => {
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/api/c15t")) {
    return;
  }

  const backendURL = env.C15T_BACKEND_URL;
  if (!backendURL) {
    return new Response("C15T_BACKEND_URL not configured", { status: 500 });
  }

  const target = new URL(backendURL);
  target.pathname = url.pathname.replace("/api/c15t", "");
  target.search = url.search;

  const proxyHeaders = new Headers(request.headers);
  const cfIp = request.headers.get("CF-Connecting-IP");
  if (cfIp) {
    proxyHeaders.set("X-Forwarded-For", cfIp);
  }

  const proxyRequest = new Request(target.toString(), {
    method: request.method,
    headers: proxyHeaders,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
  });

  const response = await fetch(proxyRequest);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};

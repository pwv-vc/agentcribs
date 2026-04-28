import type { RouteMiddleware } from "rwsdk/router";
import { env } from "cloudflare:workers";
import { kvKey } from "@/app/actions/application";
import type { ApplicationData } from "@/app/actions/application";

export const handleVerificationCallback: RouteMiddleware = async (
  requestInfo,
) => {
  const url = new URL(requestInfo.request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/apply/verify/error" },
    });
  }

  const raw = await env.AGENTCRIBS_KV.get(`verify:${token}`);
  if (!raw) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/apply/verify/error" },
    });
  }

  const { applicationId } = JSON.parse(raw);
  const appRaw = await env.AGENTCRIBS_KV.get(kvKey(applicationId));
  if (!appRaw) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/apply/verify/error" },
    });
  }

  const now = new Date().toISOString();
  const app: ApplicationData = JSON.parse(appRaw);
  app.status = "pending";
  app.updatedAt = now;

  const serialized = JSON.stringify(app);
  await Promise.all([
    env.AGENTCRIBS_KV.put(kvKey(applicationId), serialized),
    env.AGENTCRIBS_R2.put(
      `applications/${applicationId}.json`,
      serialized,
    ),
    env.AGENTCRIBS_KV.delete(`verify:${token}`),
  ]);

  return new Response(null, {
    status: 302,
    headers: { Location: "/apply/verify/success" },
  });
};

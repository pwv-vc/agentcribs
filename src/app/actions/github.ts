"use server";

import { env } from "cloudflare:workers";

interface OAuthState {
  email: string;
  createdAt: string;
}

interface VerificationResult {
  githubHandle: string;
  githubId: number;
  githubAvatarUrl: string;
  githubProfile: Record<string, unknown>;
  email: string;
}

function log(...args: unknown[]) {
  console.log("[github/actions]", ...args.map((a) =>
    typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)
  ));
}

function authorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: env.GITHUB_CALLBACK_URL,
    scope: "read:user,user:email",
    state,
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}

export async function startGitHubOAuth(email: string): Promise<string> {
  log("startGitHubOAuth called", { email });

  if (!email) {
    throw new Error("Email is required to start GitHub verification.");
  }

  const nonce = crypto.randomUUID();
  const state: OAuthState = { email, createdAt: new Date().toISOString() };

  await env.AGENTCRIBS_KV.put(
    `oauth:state:${nonce}`,
    JSON.stringify(state),
    { expirationTtl: 600 },
  );

  const url = authorizeUrl(nonce);
  log("state stored in KV, returning authorize URL", { nonce: nonce.slice(0, 8) });
  return url;
}

export async function getGitHubVerification(
  nonce: string,
): Promise<VerificationResult | null> {
  log("getGitHubVerification called", { nonce: nonce.slice(0, 8) });
  const raw = await env.AGENTCRIBS_KV.get(`oauth:verify:${nonce}`);
  if (!raw) {
    log("no verification found in KV for nonce");
    return null;
  }
  const result = JSON.parse(raw) as VerificationResult;
  log("verification found", { handle: result.githubHandle });
  return result;
}

export async function consumeGitHubVerification(
  nonce: string,
): Promise<VerificationResult | null> {
  log("consumeGitHubVerification called", { nonce: nonce.slice(0, 8) });
  const raw = await env.AGENTCRIBS_KV.get(`oauth:verify:${nonce}`);
  if (!raw) {
    log("no verification found in KV for nonce (may have expired)");
    return null;
  }
  await env.AGENTCRIBS_KV.delete(`oauth:verify:${nonce}`);
  const result = JSON.parse(raw) as VerificationResult;
  log("verification consumed", { handle: result.githubHandle });
  return result;
}

// Save form state to KV so it survives cross-origin GitHub OAuth redirect
export async function saveOAuthFormState(
  formId: string,
  state: Record<string, unknown>,
): Promise<void> {
  log("saveOAuthFormState", { formId });
  await env.AGENTCRIBS_KV.put(
    `oauth:form:${formId}`,
    JSON.stringify(state),
    { expirationTtl: 600 },
  );
}

export async function restoreOAuthFormState(
  formId: string,
): Promise<Record<string, unknown> | null> {
  log("restoreOAuthFormState", { formId });
  const raw = await env.AGENTCRIBS_KV.get(`oauth:form:${formId}`);
  if (!raw) return null;
  await env.AGENTCRIBS_KV.delete(`oauth:form:${formId}`);
  return JSON.parse(raw);
}

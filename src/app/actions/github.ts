"use server";

import { env } from "cloudflare:workers";

interface OAuthState {
  email: string;
  createdAt: string;
  formStateId?: string;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

interface VerificationResult {
  githubHandle: string;
  githubId: number;
  githubAvatarUrl: string;
  githubProfile: Record<string, unknown>;
  email: string;
  githubEmails: GitHubEmail[];
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

export async function startGitHubOAuth(
  email: string,
  formState?: Record<string, unknown>,
): Promise<string> {
  if (!email) {
    throw new Error("Email is required to start GitHub verification.");
  }

  const nonce = crypto.randomUUID();
  let formStateId: string | undefined;

  // Save form state to KV so it survives cross-origin redirect through GitHub
  if (formState) {
    formStateId = crypto.randomUUID();
    await saveOAuthFormState(formStateId, formState);
  }

  const state: OAuthState = {
    email,
    createdAt: new Date().toISOString(),
    ...(formStateId ? { formStateId } : {}),
  };

  await env.AGENTCRIBS_KV.put(
    `oauth:state:${nonce}`,
    JSON.stringify(state),
    { expirationTtl: 600 },
  );

  const url = authorizeUrl(nonce);
  return url;
}

export async function getGitHubVerification(
  nonce: string,
): Promise<VerificationResult | null> {
  const raw = await env.AGENTCRIBS_KV.get(`oauth:verify:${nonce}`);
  if (!raw) {
    return null;
  }
  const result = JSON.parse(raw) as VerificationResult;
  return result;
}

export async function consumeGitHubVerification(
  nonce: string,
): Promise<VerificationResult | null> {
  const raw = await env.AGENTCRIBS_KV.get(`oauth:verify:${nonce}`);
  if (!raw) {
    return null;
  }
  await env.AGENTCRIBS_KV.delete(`oauth:verify:${nonce}`);
  const result = JSON.parse(raw) as VerificationResult;
  return result;
}

// Save form state to KV so it survives cross-origin GitHub OAuth redirect
export async function saveOAuthFormState(
  formId: string,
  state: Record<string, unknown>,
): Promise<void> {
  await env.AGENTCRIBS_KV.put(
    `oauth:form:${formId}`,
    JSON.stringify(state),
    { expirationTtl: 600 },
  );
}

export async function restoreOAuthFormState(
  formId: string,
): Promise<Record<string, unknown> | null> {
  const raw = await env.AGENTCRIBS_KV.get(`oauth:form:${formId}`);
  if (!raw) return null;
  await env.AGENTCRIBS_KV.delete(`oauth:form:${formId}`);
  return JSON.parse(raw);
}

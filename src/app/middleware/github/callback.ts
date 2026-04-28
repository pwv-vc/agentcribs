import type { RouteMiddleware } from "rwsdk/router";
import { env } from "cloudflare:workers";

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

async function exchangeCode(code: string, redirectUri: string) {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const text = await res.text();
  log("token exchange response status", res.status);
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text);
  } catch {
    log("token exchange response body (not JSON)", text);
    throw new Error(`Token exchange failed: ${res.status} — non-JSON response`);
  }

  log("token exchange response body", parsed);

  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status} — ${JSON.stringify(parsed)}`);
  }

  if (!parsed.access_token) {
    throw new Error(`Token exchange error: ${parsed.error || "No access token in response"} — ${JSON.stringify(parsed)}`);
  }

  return parsed.access_token as string;
}

async function fetchPrimaryVerifiedEmail(token: string): Promise<string | null> {
  const res = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "User-Agent": "agentcribs/1.0",
    },
  });

  const text = await res.text();
  log("emails response status", res.status);
  if (!res.ok) {
    log("emails response body", text);
    throw new Error(`Failed to fetch emails: ${res.status} — ${text}`);
  }

  const emails = JSON.parse(text) as GitHubEmail[];
  log("emails count", emails.length);
  const verified = emails.find((e) => e.primary && e.verified);
  log("primary verified email", verified?.email ?? "none found");
  return verified?.email ?? null;
}

async function fetchUser(token: string): Promise<GitHubUser> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "User-Agent": "agentcribs/1.0",
    },
  });

  const text = await res.text();
  log("user response status", res.status);
  if (!res.ok) {
    log("user response body", text);
    throw new Error(`Failed to fetch user: ${res.status} — ${text}`);
  }

  return JSON.parse(text) as GitHubUser;
}

function log(...args: unknown[]) {
  console.log("[github/callback]", ...args.map((a) =>
    typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)
  ));
}

export const handleGitHubCallback: RouteMiddleware = async (requestInfo) => {
  const url = new URL(requestInfo.request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  log("callback received", { code: code?.slice(0, 8), state: state?.slice(0, 8) });

  if (!code || !state) {
    log("missing code or state param");
    return Response.redirect(
      `${url.origin}/apply?github_error=api_error`,
      303,
    );
  }

  // Validate state nonce
  const stateRaw = await env.AGENTCRIBS_KV.get(`oauth:state:${state}`);
  if (!stateRaw) {
    log("state nonce not found in KV (may have expired)");
    return Response.redirect(
      `${url.origin}/apply?github_error=expired`,
      303,
    );
  }

  const { email: storedEmail, formStateId } = JSON.parse(stateRaw);
  log("state valid", { storedEmail });

  try {
    // Exchange code for access token
    log("exchanging code for access token...");
    const token = await exchangeCode(code, env.GITHUB_CALLBACK_URL);
    log("access token obtained", { tokenPrefix: token.slice(0, 8) });

    // Fetch the user's primary verified email
    log("fetching verified emails...");
    const verifiedEmail = await fetchPrimaryVerifiedEmail(token);
    log("verified email result", { verifiedEmail });
    if (!verifiedEmail) {
      log("no verified primary email found on GitHub account");
      await env.AGENTCRIBS_KV.delete(`oauth:state:${state}`);
      return Response.redirect(
        `${url.origin}/apply?github_error=no_verified_email`,
        303,
      );
    }

    // Check that emails match
    if (verifiedEmail.toLowerCase() !== storedEmail.toLowerCase()) {
      log("email mismatch", { stored: storedEmail, github: verifiedEmail });
      await env.AGENTCRIBS_KV.delete(`oauth:state:${state}`);
      return Response.redirect(
        `${url.origin}/apply?github_error=email_mismatch`,
        303,
      );
    }
    log("email match confirmed");

    // Fetch user profile
    log("fetching GitHub user profile...");
    const user = await fetchUser(token);
    log("user profile obtained", { login: user.login });

    // Store verification result with full profile
    const verifyNonce = crypto.randomUUID();
    const verification = {
      githubHandle: user.login,
      githubId: user.id,
      githubAvatarUrl: user.avatar_url,
      githubProfile: {
        name: user.name,
        company: user.company,
        blog: user.blog,
        location: user.location,
        bio: user.bio,
        twitter_username: user.twitter_username,
        public_repos: user.public_repos,
        public_gists: user.public_gists,
        followers: user.followers,
        following: user.following,
        created_at: user.created_at,
      },
      email: verifiedEmail,
    };
    await env.AGENTCRIBS_KV.put(
      `oauth:verify:${verifyNonce}`,
      JSON.stringify(verification),
      { expirationTtl: 600 },
    );

    // Clean up state
    await env.AGENTCRIBS_KV.delete(`oauth:state:${state}`);

    log("verification stored, redirecting to apply with state", { verifyNonce: verifyNonce.slice(0, 8) });

    const redirectUrl = formStateId
      ? `${url.origin}/apply?github_state=${verifyNonce}&form_state=${formStateId}`
      : `${url.origin}/apply?github_state=${verifyNonce}`;

    return Response.redirect(redirectUrl, 303);
  } catch (err) {
    log("error during GitHub OAuth callback:", err);
    await env.AGENTCRIBS_KV.delete(`oauth:state:${state}`);
    return Response.redirect(
      `${url.origin}/apply?github_error=api_error`,
      303,
    );
  }
};

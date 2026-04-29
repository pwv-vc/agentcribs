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
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Token exchange failed: ${res.status} — non-JSON response`);
  }

  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status} — ${JSON.stringify(parsed)}`);
  }

  if (!parsed.access_token) {
    throw new Error(`Token exchange error: ${parsed.error || "No access token in response"} — ${JSON.stringify(parsed)}`);
  }

  return parsed.access_token as string;
}

async function fetchGitHubEmails(token: string): Promise<GitHubEmail[]> {
  const res = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "User-Agent": "agentcribs/1.0",
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Failed to fetch emails: ${res.status} — ${text}`);
  }

  const emails = JSON.parse(text) as GitHubEmail[];
  return emails;
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
  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status} — ${text}`);
  }

  return JSON.parse(text) as GitHubUser;
}

export const handleGitHubCallback: RouteMiddleware = async (requestInfo) => {
  const url = new URL(requestInfo.request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return Response.redirect(
      `${url.origin}/apply?github_error=api_error`,
      303,
    );
  }

  // Validate state nonce
  const stateRaw = await env.AGENTCRIBS_KV.get(`oauth:state:${state}`);
  if (!stateRaw) {
    return Response.redirect(
      `${url.origin}/apply?github_error=expired`,
      303,
    );
  }

  const { email: storedEmail, formStateId } = JSON.parse(stateRaw);

  try {
    // Exchange code for access token
    const token = await exchangeCode(code, env.GITHUB_CALLBACK_URL);

    // Fetch the user's GitHub emails (all of them — verified, primary, etc.)
    const githubEmails = await fetchGitHubEmails(token);
    const primaryVerified = githubEmails.find((e) => e.primary && e.verified);
    if (!primaryVerified) {
      await env.AGENTCRIBS_KV.delete(`oauth:state:${state}`);
      return Response.redirect(
        `${url.origin}/apply?github_error=no_verified_email`,
        303,
      );
    }

    // Fetch user profile
    const user = await fetchUser(token);

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
      email: primaryVerified.email,
      githubEmails,
    };
    await env.AGENTCRIBS_KV.put(
      `oauth:verify:${verifyNonce}`,
      JSON.stringify(verification),
      { expirationTtl: 600 },
    );

    // Clean up state
    await env.AGENTCRIBS_KV.delete(`oauth:state:${state}`);

    const redirectUrl = formStateId
      ? `${url.origin}/apply?github_state=${verifyNonce}&form_state=${formStateId}`
      : `${url.origin}/apply?github_state=${verifyNonce}`;

    return Response.redirect(redirectUrl, 303);
  } catch (err) {
    await env.AGENTCRIBS_KV.delete(`oauth:state:${state}`);
    return Response.redirect(
      `${url.origin}/apply?github_error=api_error`,
      303,
    );
  }
};

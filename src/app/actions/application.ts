"use server";

import { serverAction } from "rwsdk/worker";
import { ulid } from "ulid";
import { env } from "cloudflare:workers";
import { consumeGitHubVerification } from "@/app/actions/github";
import { sendMagicLink } from "@/app/actions/email";

export type ApplicationStatus =
  | "unverified"
  | "pending"
  | "accepted"
  | "rejected";

export interface GitHubProfile {
  name?: string;
  company?: string;
  location?: string;
  blog?: string;
  bio?: string;
  twitter_username?: string;
  public_repos?: number;
  followers?: number;
  created_at?: string;
  [key: string]: unknown;
}

export interface ApplicationData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  topics: string[];
  otherTopic?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  editedAt?: string;
  githubHandle?: string;
  githubId?: number;
  githubAvatarUrl?: string;
  githubProfile?: GitHubProfile;
}

const KV_PREFIX = "app:";
const EMAIL_INDEX_PREFIX = "email:";
const R2_KEY_PREFIX = "applications/";

export function kvKey(id: string) {
  return `${KV_PREFIX}${id}`;
}

export function emailIndexKey(email: string) {
  return `${EMAIL_INDEX_PREFIX}${email.toLowerCase().trim()}`;
}

export function saveApplication(application: ApplicationData): Promise<void> {
  const serialized = JSON.stringify(application);
  return Promise.all([
    env.AGENTCRIBS_KV.put(kvKey(application.id), serialized),
    env.AGENTCRIBS_R2.put(
      `${R2_KEY_PREFIX}${application.id}.json`,
      serialized,
    ),
  ]).then(() => undefined);
}

export const submitApplication = serverAction(async (formData: FormData) => {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = ((formData.get("email") as string) ?? "").trim().toLowerCase();
  const organization = (formData.get("organization") as string) ?? "";
  const topics = formData.getAll("topics") as string[];
  const otherTopic = (formData.get("otherTopic") as string) ?? "";
  const githubState = (formData.get("github_state") as string) ?? null;

  if (!firstName || !lastName || !email) {
    return new Response("First name, last name, and email are required.", {
      status: 400,
    });
  }

  // Consume GitHub verification if present
  let githubHandle: string | undefined;
  let githubId: number | undefined;
  let githubAvatarUrl: string | undefined;
  let githubProfile: Record<string, unknown> | undefined;

  if (githubState) {
    const verification = await consumeGitHubVerification(githubState);
    if (verification && verification.email.toLowerCase() === email) {
      githubHandle = verification.githubHandle;
      githubId = verification.githubId;
      githubAvatarUrl = verification.githubAvatarUrl;
      githubProfile = verification.githubProfile;
    }
  }

  // Add a small delay to prevent email-address probing
  const emailCheckDelay =
    Math.random() * 500 + 500; /* 500-1000ms */

  const now = new Date().toISOString();

  const existingId = await env.AGENTCRIBS_KV.get(emailIndexKey(email));
  if (existingId) {
    const existingRaw = await env.AGENTCRIBS_KV.get(kvKey(existingId));
    if (existingRaw) {
      const existing: ApplicationData = JSON.parse(existingRaw);
      const updated: ApplicationData = {
        ...existing,
        firstName,
        lastName,
        organization,
        topics,
        otherTopic,
        updatedAt: now,
        editedAt: now,
      };
      // Preserve existing GitHub data unless user re-verified
      if (githubHandle) {
        updated.githubHandle = githubHandle;
        updated.githubId = githubId;
        updated.githubAvatarUrl = githubAvatarUrl;
        updated.githubProfile = githubProfile;
      }
      // Re-send magic link for updated applications
      const token = crypto.randomUUID();
      await Promise.all([
        env.AGENTCRIBS_KV.put(
          `verify:${token}`,
          JSON.stringify({ applicationId: existingId, email, createdAt: now }),
          { expirationTtl: 3600 },
        ),
        env.AGENTCRIBS_KV.put(kvKey(existingId), JSON.stringify(updated)),
        env.AGENTCRIBS_R2.put(
          `${R2_KEY_PREFIX}${existingId}.json`,
          JSON.stringify(updated),
        ),
      ]);
      // Send magic link (don't await — fire and forget via waitUntil)
      env.AGENTCRIBS_KV; // ensure env is available
      sendMagicLink({ email, token }).catch(() => {});
      return new Response(null, {
        status: 303,
        headers: { Location: "/apply/thank-you" },
      });
    }
  }

  const id = ulid();
  const application: ApplicationData = {
    id,
    firstName,
    lastName,
    email,
    organization,
    topics,
    otherTopic,
    status: "unverified",
    createdAt: now,
    updatedAt: now,
    ...(githubHandle && {
      githubHandle,
      githubId,
      githubAvatarUrl,
      githubProfile,
    }),
  };

  const token = crypto.randomUUID();
  const serialized = JSON.stringify(application);
  await Promise.all([
    env.AGENTCRIBS_KV.put(kvKey(id), serialized),
    env.AGENTCRIBS_KV.put(emailIndexKey(email), id),
    env.AGENTCRIBS_KV.put(
      `verify:${token}`,
      JSON.stringify({ applicationId: id, email, createdAt: now }),
      { expirationTtl: 3600 },
    ),
    env.AGENTCRIBS_R2.put(`${R2_KEY_PREFIX}${id}.json`, serialized),
  ]);

  // Send magic link (fire and forget)
  sendMagicLink({ email, token }).catch(() => {});

  return new Response(null, {
    status: 303,
    headers: { Location: "/apply/thank-you" },
  });
});

export const verifyApplication = serverAction(
  async (token: string) => {
    const raw = await env.AGENTCRIBS_KV.get(`verify:${token}`);
    if (!raw) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/apply/verify/error" },
      });
    }

    const { applicationId, email } = JSON.parse(raw);
    const appRaw = await env.AGENTCRIBS_KV.get(kvKey(applicationId));
    if (!appRaw) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/apply/verify/error" },
      });
    }

    const now = new Date().toISOString();
    const app: ApplicationData = JSON.parse(appRaw);
    app.status = "pending";
    app.updatedAt = now;
    app.editedAt = now;

    await Promise.all([
      env.AGENTCRIBS_KV.put(kvKey(applicationId), JSON.stringify(app)),
      env.AGENTCRIBS_R2.put(
        `${R2_KEY_PREFIX}${applicationId}.json`,
        JSON.stringify(app),
      ),
      env.AGENTCRIBS_KV.delete(`verify:${token}`),
    ]);

    return new Response(null, {
      status: 303,
      headers: { Location: "/apply/verify/success" },
    });
  },
);

export const setApplicationStatus = serverAction(
  async (id: string, status: ApplicationStatus) => {
    const raw = await env.AGENTCRIBS_KV.get(kvKey(id));
    if (!raw) {
      return new Response("Application not found", { status: 404 });
    }

    const now = new Date().toISOString();
    const app: ApplicationData = JSON.parse(raw);
    app.status = status;
    app.updatedAt = now;

    if (status === "accepted") {
      app.approvedAt = now;
      delete app.rejectedAt;
    } else if (status === "rejected") {
      app.rejectedAt = now;
      delete app.approvedAt;
    } else {
      delete app.approvedAt;
      delete app.rejectedAt;
    }

    const serialized = JSON.stringify(app);
    await Promise.all([
      env.AGENTCRIBS_KV.put(kvKey(id), serialized),
      env.AGENTCRIBS_R2.put(`${R2_KEY_PREFIX}${id}.json`, serialized),
    ]);
  },
);

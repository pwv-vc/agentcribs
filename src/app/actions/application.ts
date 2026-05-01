"use server";

import { serverAction } from "rwsdk/worker";
import { ulid } from "ulid";
import { env } from "cloudflare:workers";
import { consumeGitHubVerification } from "@/app/actions/github";

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

export interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

export interface ApplicationData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  topics: string[];
  story?: string;
  summary?: string;
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
  githubEmailMismatch?: boolean;
  githubEmails?: GitHubEmail[];
  termsAcceptedAt?: string;
  verifiedAt?: string;
  location?: string;
  howHeard?: string;
}

export interface ApplicationPayload {
  type: "process-application";
  kvKey: string;
  email: string;
  token: string;
  isUpdate: boolean;
}

const KV_PREFIX = "app:";
const EMAIL_INDEX_PREFIX = "email:";
export const R2_KEY_PREFIX = "applications/";

export function kvKey(id: string) {
  return `${KV_PREFIX}${id}`;
}

export function emailIndexKey(email: string) {
  return `${EMAIL_INDEX_PREFIX}${email.toLowerCase().trim()}`;
}

/** Build R2 custom metadata for browse-ability in the Cloudflare dashboard. */
export function r2Meta(app: {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  githubHandle?: string;
  location?: string;
  howHeard?: string;
}) {
  return {
    customMetadata: {
      name: `${app.firstName} ${app.lastName}`,
      email: app.email,
      status: app.status,
      created: app.createdAt,
      updated: app.updatedAt,
      ...(app.githubHandle ? { github: app.githubHandle } : {}),
      ...(app.location ? { location: app.location } : {}),
      ...(app.howHeard ? { howHeard: app.howHeard } : {}),
    },
  };
}

export const submitApplication = serverAction(async (formData: FormData) => {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = ((formData.get("email") as string) ?? "").trim().toLowerCase();
  const organization = (formData.get("organization") as string) ?? "";
  const location = (formData.get("location") as string) ?? "";
  const howHeard = (formData.get("howHeard") as string) ?? "";
  const topics = formData.getAll("topics") as string[];
  const story = (formData.get("story") as string) ?? "";
  const summary = (formData.get("summary") as string) ?? "";
  const githubState = (formData.get("github_state") as string) ?? null;
  const acceptedTerms = formData.get("acceptedTerms") === "on";

  if (!firstName || !lastName || !email || !story) {
    return new Response("First name, last name, and email are required.", {
      status: 400,
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return new Response("Please provide a valid email address.", {
      status: 400,
    });
  }

  // Consume GitHub verification if present
  let githubHandle: string | undefined;
  let githubId: number | undefined;
  let githubAvatarUrl: string | undefined;
  let githubProfile: Record<string, unknown> | undefined;
  let githubEmailMismatch: boolean | undefined;
  let githubEmails: GitHubEmail[] | undefined;

  if (githubState) {
    const verification = await consumeGitHubVerification(githubState);
    if (verification) {
      githubHandle = verification.githubHandle;
      githubId = verification.githubId;
      githubAvatarUrl = verification.githubAvatarUrl;
      githubProfile = verification.githubProfile;
      githubEmailMismatch = verification.email.toLowerCase() !== email;
      githubEmails = verification.githubEmails;
    }
  }

  // Add a small delay to prevent email-address probing
  const emailCheckDelay =
    Math.random() * 500 + 500; /* 500-1000ms */

  const now = new Date().toISOString();
  const token = crypto.randomUUID();

  let id: string;
  let isUpdate = false;

  const existingId = await env.AGENTCRIBS_KV.get(emailIndexKey(email));
  if (existingId) {
    const existingRaw = await env.AGENTCRIBS_KV.get(kvKey(existingId));
    if (existingRaw) {
      const existing: ApplicationData = JSON.parse(existingRaw);

      // Status-based guard: prevent overwriting accepted applications
      if (existing.status === "accepted") {
        return new Response(
          "Your application has already been accepted and cannot be modified.",
          { status: 403 },
        );
      }

      // For rejected applications, treat as a fresh re-application
      const resetRejection = existing.status === "rejected";

      const updated: ApplicationData = {
        ...existing,
        firstName,
        lastName,
        organization,
        location,
        howHeard,
        topics,
        story,
        summary,
        updatedAt: now,
        editedAt: now,
        status: resetRejection ? "unverified" : existing.status,
        ...(acceptedTerms && !existing.termsAcceptedAt && { termsAcceptedAt: now }),
      };

      // If resetting from rejected, clear status timestamps
      if (resetRejection) {
        delete updated.rejectedAt;
        delete updated.verifiedAt;
        delete updated.approvedAt;
      }

      if (githubHandle) {
        updated.githubHandle = githubHandle;
        updated.githubId = githubId;
        updated.githubAvatarUrl = githubAvatarUrl;
        updated.githubProfile = githubProfile;
        updated.githubEmailMismatch = githubEmailMismatch;
        updated.githubEmails = githubEmails;
      }
      id = existingId;
      isUpdate = true;

      // Store updated application + verify token in KV (fast path)
      await Promise.all([
        env.AGENTCRIBS_KV.put(kvKey(id), JSON.stringify(updated)),
        env.AGENTCRIBS_KV.put(
          `verify:${token}`,
          JSON.stringify({ applicationId: id, email, createdAt: now }),
          { expirationTtl: 3600 },
        ),
      ]);
    } else {
      // Index points to a non-existent KV entry — treat as new
      id = ulid();
      const application: ApplicationData = {
        id,
        firstName,
        lastName,
        email,
        organization,
        location,
        howHeard,
        topics,
        story,
        status: "unverified",
        createdAt: now,
        updatedAt: now,
        summary,
        ...(acceptedTerms && { termsAcceptedAt: now }),
        ...(githubHandle && { githubHandle, githubId, githubAvatarUrl, githubProfile, githubEmailMismatch, githubEmails }),
      };
      await Promise.all([
        env.AGENTCRIBS_KV.put(kvKey(id), JSON.stringify(application)),
        env.AGENTCRIBS_KV.put(
          `verify:${token}`,
          JSON.stringify({ applicationId: id, email, createdAt: now }),
          { expirationTtl: 3600 },
        ),
      ]);
    }
  } else {
    id = ulid();
    const application: ApplicationData = {
      id,
      firstName,
      lastName,
      email,
      organization,
      location,
      howHeard,
      topics,
      story,
      status: "unverified",
      createdAt: now,
      updatedAt: now,
      summary,
      ...(acceptedTerms && { termsAcceptedAt: now }),
      ...(githubHandle && { githubHandle, githubId, githubAvatarUrl, githubProfile, githubEmailMismatch, githubEmails }),
    };
    await Promise.all([
      env.AGENTCRIBS_KV.put(kvKey(id), JSON.stringify(application)),
      env.AGENTCRIBS_KV.put(
        `verify:${token}`,
        JSON.stringify({ applicationId: id, email, createdAt: now }),
        { expirationTtl: 3600 },
      ),
    ]);
  }

  // Enqueue background tasks: save to R2, set email index, send email
  const payload: ApplicationPayload = {
    type: "process-application",
    kvKey: kvKey(id),
    email,
    token,
    isUpdate,
  };
  await env.PROCESS_APPLICATION_QUEUE.send(payload);

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

    // Guard: only verify if the application is still unverified.
    // If admin already accepted/rejected, don't revert their decision.
    if (app.status !== "unverified") {
      await env.AGENTCRIBS_KV.delete(`verify:${token}`);
      return new Response(null, {
        status: 303,
        headers: { Location: "/apply/verify/success" },
      });
    }

    app.status = "pending";
    app.verifiedAt = now;
    app.updatedAt = now;
    app.editedAt = now;

    await Promise.all([
      env.AGENTCRIBS_KV.put(kvKey(applicationId), JSON.stringify(app)),
      env.AGENTCRIBS_R2.put(
        `${R2_KEY_PREFIX}${applicationId}.json`,
        JSON.stringify(app),
        r2Meta(app),
      ),
      env.AGENTCRIBS_KV.delete(`verify:${token}`),
    ]);

    // Notify user their application is pending review, and notify admin
    await env.NOTIFICATION_QUEUE.send({
      type: "pending-review",
      email,
      name: `${app.firstName} ${app.lastName}`,
      applicationId,
    });

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

    // Enqueue notification email
    if (status === "accepted" || status === "rejected") {
      await env.NOTIFICATION_QUEUE.send({
        type: status as "accepted" | "rejected",
        email: app.email,
        name: `${app.firstName} ${app.lastName}`,
        applicationId: id,
      });
    }
  },
);

export const resendVerificationEmail = serverAction(
  async (id: string) => {
    const raw = await env.AGENTCRIBS_KV.get(kvKey(id));
    if (!raw) {
      return new Response("Application not found", { status: 404 });
    }

    const app: ApplicationData = JSON.parse(raw);
    if (app.status !== "unverified") {
      return new Response("Application is already verified", { status: 400 });
    }

    const now = new Date().toISOString();
    const token = crypto.randomUUID();

    await env.AGENTCRIBS_KV.put(
      `verify:${token}`,
      JSON.stringify({ applicationId: id, email: app.email, createdAt: now }),
      { expirationTtl: 3600 },
    );

    await env.SEND_EMAIL_QUEUE.send({
      type: "application",
      email: app.email,
      token,
      applicationId: id,
    });

    return new Response(null, { status: 200 });
  },
);

export const resendNotificationEmail = serverAction(
  async (id: string) => {
    const raw = await env.AGENTCRIBS_KV.get(kvKey(id));
    if (!raw) {
      return new Response("Application not found", { status: 404 });
    }

    const app: ApplicationData = JSON.parse(raw);

    const typeMap: Record<string, "pending-review" | "accepted" | "rejected"> = {
      pending: "pending-review",
      accepted: "accepted",
      rejected: "rejected",
    };

    const queueType = typeMap[app.status];
    if (!queueType) {
      return new Response("No notification email available for this status", { status: 400 });
    }

    await env.NOTIFICATION_QUEUE.send({
      type: queueType,
      email: app.email,
      name: `${app.firstName} ${app.lastName}`,
      applicationId: id,
    });

    return new Response(null, { status: 200 });
  },
);

export const updateApplication = serverAction(
  async (
    id: string,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      location: string;
    },
  ) => {
    const { firstName, lastName, email, location } = data;

    // Validation
    if (!firstName || !lastName || !email) {
      return new Response("First name, last name, and email are required.", {
        status: 400,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return new Response("Please provide a valid email address.", {
        status: 400,
      });
    }

    const raw = await env.AGENTCRIBS_KV.get(kvKey(id));
    if (!raw) {
      return new Response("Application not found", { status: 404 });
    }

    const app: ApplicationData = JSON.parse(raw);
    const now = new Date().toISOString();

    // Update fields
    app.firstName = firstName.trim();
    app.lastName = lastName.trim();
    app.email = email.trim().toLowerCase();
    app.location = location?.trim() || undefined;
    app.updatedAt = now;
    app.editedAt = now;

    const serialized = JSON.stringify(app);
    await Promise.all([
      env.AGENTCRIBS_KV.put(kvKey(id), serialized),
      env.AGENTCRIBS_R2.put(
        `${R2_KEY_PREFIX}${id}.json`,
        serialized,
        r2Meta(app),
      ),
    ]);

    return new Response(null, {
      status: 303,
      headers: { Location: `/admin/applications/${id}` },
    });
  },
);

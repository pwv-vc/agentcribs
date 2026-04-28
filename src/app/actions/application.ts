"use server";

import { serverAction } from "rwsdk/worker";
import { ulid } from "ulid";
import { env } from "cloudflare:workers";

export type ApplicationStatus = "pending" | "accepted" | "rejected";

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
}

const KV_PREFIX = "app:";
const EMAIL_INDEX_PREFIX = "email:";
const R2_KEY_PREFIX = "applications/";

function kvKey(id: string) {
  return `${KV_PREFIX}${id}`;
}

function emailIndexKey(email: string) {
  return `${EMAIL_INDEX_PREFIX}${email.toLowerCase().trim()}`;
}

export const submitApplication = serverAction(async (formData: FormData) => {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = ((formData.get("email") as string) ?? "").trim().toLowerCase();
  const organization = (formData.get("organization") as string) ?? "";
  const topics = formData.getAll("topics") as string[];
  const otherTopic = (formData.get("otherTopic") as string) ?? "";

  if (!firstName || !lastName || !email) {
    return new Response("First name, last name, and email are required.", {
      status: 400,
    });
  }

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
      const serialized = JSON.stringify(updated);
      await Promise.all([
        env.AGENTCRIBS_KV.put(kvKey(existingId), serialized),
        env.AGENTCRIBS_R2.put(`${R2_KEY_PREFIX}${existingId}.json`, serialized),
      ]);
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
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const serialized = JSON.stringify(application);
  await Promise.all([
    env.AGENTCRIBS_KV.put(kvKey(id), serialized),
    env.AGENTCRIBS_KV.put(emailIndexKey(email), id),
    env.AGENTCRIBS_R2.put(`${R2_KEY_PREFIX}${id}.json`, serialized),
  ]);

  return new Response(null, {
    status: 303,
    headers: { Location: "/apply/thank-you" },
  });
});

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

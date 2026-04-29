"use server";

import { serverQuery } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import { allTopics } from "content-collections";
import type { ApplicationData } from "../actions/application";

type Topic = (typeof allTopics)[number];

const KV_PREFIX = "app:";

function kvKey(id: string) {
  return `${KV_PREFIX}${id}`;
}

export const getApplication = serverQuery(
  async (id: string): Promise<ApplicationData | null> => {
    const raw = await env.AGENTCRIBS_KV.get(kvKey(id));
    if (!raw) return null;
    return JSON.parse(raw) as ApplicationData;
  },
);

export const listApplications = serverQuery(
  async (): Promise<ApplicationData[]> => {
    const list = await env.AGENTCRIBS_KV.list({ prefix: KV_PREFIX });
    if (list.keys.length === 0) return [];

    const results = await Promise.all(
      list.keys.map((key) => env.AGENTCRIBS_KV.get(key.name)),
    );

    return results
      .filter((r): r is string => r !== null)
      .map((r) => JSON.parse(r) as ApplicationData)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  },
);

export const getTopics = serverQuery(
  async (): Promise<Topic[]> => {
    return [...allTopics].sort((a, b) => a.label.localeCompare(b.label));
  },
);

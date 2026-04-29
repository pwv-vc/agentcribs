"use server";

import { serverQuery } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import { allTopics } from "content-collections";
import type { ApplicationData, ApplicationStatus } from "../actions/application";
import { allPlaylists } from "content-collections";

type Topic = (typeof allTopics)[number];

const KV_PREFIX = "app:";
const PAGE_SIZE = 3;

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

export interface ApplicationsFilter {
  status?: ApplicationStatus;
  sort?: "asc" | "desc";
  page?: number;
}

export interface ApplicationsPage {
  items: ApplicationData[];
  total: number;
  page: number;
  totalPages: number;
}

export const queryApplications = serverQuery(
  async (filter: ApplicationsFilter = {}): Promise<ApplicationsPage> => {
    const list = await env.AGENTCRIBS_KV.list({ prefix: KV_PREFIX });
    if (list.keys.length === 0) {
      return { items: [], total: 0, page: 1, totalPages: 1 };
    }

    const results = await Promise.all(
      list.keys.map((key) => env.AGENTCRIBS_KV.get(key.name)),
    );

    let applications = results
      .filter((r): r is string => r !== null)
      .map((r) => JSON.parse(r) as ApplicationData);

    // filter by status
    if (filter.status) {
      applications = applications.filter((a) => a.status === filter.status);
    }

    // sort by createdAt
    const dir = filter.sort ?? "desc";
    applications.sort((a, b) => {
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return dir === "asc" ? -diff : diff;
    });

    const total = applications.length;
    const pageSize = PAGE_SIZE;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(Math.max(1, filter.page ?? 1), totalPages);
    const start = (page - 1) * pageSize;
    const items = applications.slice(start, start + pageSize);

    return { items, total, page, totalPages };
  },
);

export const getTopics = serverQuery(
  async (): Promise<Topic[]> => {
    return [...allTopics].sort((a, b) => a.label.localeCompare(b.label));
  },
);

export type PlaylistData = (typeof allPlaylists)[number];

export const getPlaylist = serverQuery(
  async (): Promise<PlaylistData | null> => {
    const list = allPlaylists[0];
    return list ?? null;
  },
);

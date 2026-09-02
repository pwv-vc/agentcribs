"use server";
import { serverQuery } from "rwsdk/worker";
import { allPodcasts } from "content-collections";

export type Podcast = (typeof allPodcasts)[number];
export type PodcastSeason = Podcast["seasons"][number];
export type PodcastEpisode = PodcastSeason["episodes"][number];
export type PodcastHost = Podcast["hosts"][number];

export const getPodcasts = serverQuery(async (): Promise<Podcast[]> => {
  return [...allPodcasts].sort((a, b) => a.name.localeCompare(b.name));
});

export const getPodcast = serverQuery(
  async (id: string): Promise<Podcast | null> => {
    return allPodcasts.find((p) => p.id === id) ?? null;
  },
);

export const getFeaturedPodcast = serverQuery(
  async (): Promise<Podcast | null> => {
    return allPodcasts.find((p) => p.isFeatured) ?? allPodcasts[0] ?? null;
  },
);

"use server";

import { serverQuery } from "rwsdk/worker";
import { allPlaylists } from "content-collections";

export type PlaylistData = (typeof allPlaylists)[number];

export const getPlaylist = serverQuery(
  async (): Promise<PlaylistData | null> => {
    const list = allPlaylists[0];
    if (!list) return null;
    return {
      ...list,
      videos: [...list.videos].sort(
        (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
      ),
    };
  },
);

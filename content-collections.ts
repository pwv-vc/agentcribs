import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import { z } from "zod";

// for more information on configuration, visit:
// https://www.content-collections.dev/docs/configuration

const topics = defineCollection({
  name: "topics",
  directory: "content/topics",
  include: "*.md",
  schema: z.object({
    id: z.string(),
    label: z.string(),
    content: z.string(),
  }),
});

const playlistSchema = z.object({
  title: z.string(),
  description: z.string(),
  channel: z.string(),
  thumbnail: z.string(),
});

const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  thumbnail: z.string(),
  published: z.string(),
});

const playlistFileSchema = z.object({
  playlist: playlistSchema,
  videos: z.array(videoSchema),
});

const playlist = defineCollection({
  name: "playlist",
  directory: "content/playlist",
  include: "*.json",
  parser: "json",
  schema: playlistFileSchema,
  transform(data) {
    return {
      playlist: data.playlist,
      videos: data.videos,
      totalVideos: data.videos.length,
    };
  },
});

export default defineConfig({
  content: [topics, playlist],
});

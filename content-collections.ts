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

const events = defineCollection({
  name: "events",
  directory: "content/events",
  include: "*.md",
  schema: z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    location: z.string(),
    status: z.enum(["upcoming", "past", "current"]),
    isFeatured: z.boolean().default(false),
    speakers: z.array(
      z.object({
        name: z.string(),
        affiliation: z.string().optional(),
      }),
    ),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document);
    return { ...document, content: html };
  },
});

export default defineConfig({
  content: [topics, playlist, events],
});

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
    timezone: z.string().default("America/New_York"),
    format: z.enum(["in-person", "remote", "hybrid"]).default("remote"),
    isFeatured: z.boolean().default(false),
    lumaEventUrl: z.string().url().optional(),
    waitlist: z.boolean().default(false),
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
    const now = new Date();
    const eventDate = new Date(document.date);

    // Compare using the event's own timezone date to determine status
    const tz = document.timezone;
    const nowInTz = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);
    const eventDateInTz = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(eventDate);

    let status: "upcoming" | "current" | "past";
    if (nowInTz === eventDateInTz) {
      status = "current";
    } else if (eventDate < now) {
      status = "past";
    } else {
      status = "upcoming";
    }

    return { ...document, content: html, status };
  },
});

const podcastEpisodeSchema = z.object({
  number: z.string(),
  guest: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  imageAlt: z.string(),
});

const podcastHostSchema = z.object({
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  image: z.string(),
  imageAlt: z.string(),
});

const podcastSeasonSchema = z.object({
  number: z.number(),
  title: z.string().optional(),
  episodes: z.array(podcastEpisodeSchema),
});

const podcasts = defineCollection({
  name: "podcasts",
  directory: "content/podcasts",
  include: "*.md",
  schema: z.object({
    id: z.string(),
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    url: z.string().url(),
    logo: z.string().optional(),
    logoAlt: z.string().optional(),
    sponsor: z.string().optional(),
    trailer: z
      .object({
        videoId: z.string(),
        label: z.string().optional(),
      })
      .optional(),
    isFeatured: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageWidth: z.number().optional(),
    imageHeight: z.number().optional(),
    hosts: z.array(podcastHostSchema),
    seasons: z.array(podcastSeasonSchema),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document);
    const totalEpisodes = document.seasons.reduce(
      (sum, season) => sum + season.episodes.length,
      0,
    );
    return { ...document, content: html, totalEpisodes };
  },
});

const faqs = defineCollection({
  name: "faqs",
  directory: "content/faqs",
  include: "*.md",
  schema: z.object({
    id: z.string(),
    question: z.string(),
    order: z.number().default(0),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document);
    return { ...document, content: html };
  },
});

export default defineConfig({
  content: [topics, playlist, events, podcasts, faqs],
});

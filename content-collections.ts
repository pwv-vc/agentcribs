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

// Platforms where a podcast, trailer, or episode can be watched or listened to.
// Each present field renders as an icon + label pill on the podcast page.
const platformLinksSchema = z.object({
  apple: z.string().url().optional(), // Apple Podcasts
  spotify: z.string().url().optional(), // Spotify
  youtube: z.string().url().optional(), // YouTube video/channel
});

// Social profiles for a person (podcast host or episode guest).
const personLinksSchema = z.object({
  linkedin: z.string().url().optional(), // LinkedIn profile
  x: z.string().url().optional(), // X (Twitter)
});

// Links for the podcast itself: platforms, show homepage, and show socials.
const podcastLinksSchema = platformLinksSchema
  .extend({ show: z.string().url().optional() }) // the show homepage
  .extend(personLinksSchema.shape);

const podcastEpisodeSchema = z.object({
  number: z.string(),
  guest: z.object({
    name: z.string(),
    links: personLinksSchema.optional(),
  }),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  links: platformLinksSchema.optional(),
});

const podcastHostSchema = z.object({
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  links: personLinksSchema.optional(),
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
        links: platformLinksSchema.optional(),
      })
      .optional(),
    links: podcastLinksSchema.optional(),
    isFeatured: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageWidth: z.number().optional(),
    imageHeight: z.number().optional(),
    // Social share (Open Graph / Twitter) image overrides. Falls back to image.
    ogImage: z.string().optional(),
    ogImageAlt: z.string().optional(),
    ogImageWidth: z.number().optional(),
    ogImageHeight: z.number().optional(),
    // Bump to cache-bust all podcast images after replacing files.
    imagesVersion: z.number().default(1),
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

    const bust = (src?: string) =>
      src ? `${src}${src.includes("?") ? "&" : "?"}v=${document.imagesVersion}` : src;

    return {
      ...document,
      content: html,
      totalEpisodes,
      image: bust(document.image),
      logo: bust(document.logo),
      hosts: document.hosts.map((host) => ({ ...host, image: bust(host.image) })),
      seasons: document.seasons.map((season) => ({
        ...season,
        episodes: season.episodes.map((episode) => ({
          ...episode,
          image: bust(episode.image),
        })),
      })),
    };
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

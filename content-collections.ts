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

export default defineConfig({
  content: [topics],
});

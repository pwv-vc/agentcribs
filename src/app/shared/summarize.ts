"use server";

import { summarizeStory as summarize } from "@/app/lib/ai";

export async function summarizeStory(story: string) {
  const textStream = summarize(story);

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of textStream) {
        const data = JSON.stringify({ text: chunk });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

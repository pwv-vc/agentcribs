import { env } from "cloudflare:workers";
import { createAiGateway } from "ai-gateway-provider";
import { createUnified } from "ai-gateway-provider/providers/unified";
import { streamText } from "ai";

const defaultModel = "workers-ai/@cf/meta/llama-4-scout-17b-16e-instruct";

function createClient(modelName?: string) {
  const aigateway = createAiGateway({
    accountId: env.CLOUDFLARE_ACCOUNT_ID,
    gateway: env.AI_GATEWAY_NAME,
    apiKey: env.CF_AIG_TOKEN,
  });
  const unified = createUnified();
  return { model: aigateway(unified(modelName ?? defaultModel)) };
}

export function streamMessage(prompt: string, modelName?: string) {
  const { model } = createClient(modelName);
  const result = streamText({ model, prompt });
  return result.textStream;
}

export function summarizeStory(story: string) {
  const { model } = createClient();
  const result = streamText({
    model,
    system:
      "You are a friendly, encouraging assistant reviewing applicant stories for AgentCribs. " +
      "If the applicant shares a genuine story about what they're building with AI agents, their interest in AI, or why they want to join AgentCribs, respond with a short encouraging message (1 sentence) followed by a distilled 20-30 word summary of their story. " +
      "Format your response like:\n" +
      "[Encouraging intro sentence] Summary: [20-30 word summary of what they said]\n\n" +
      "If the applicant didn't really explain what they're building, their interest in AI agents, or why they want to join AgentCribs — if there's not enough substance to understand them — respond with only a short friendly prompt suggesting what they could tell us instead. Skip the summary. " +
      "Keep it helpful and warm, not critical.",
    prompt: story,
  });
  return result.textStream;
}

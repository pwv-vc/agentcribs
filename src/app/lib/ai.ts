import { env } from "cloudflare:workers";
import { createAiGateway } from "ai-gateway-provider";
import { createUnified } from "ai-gateway-provider/providers/unified";
import { streamText } from "ai";

const defaultModel = "workers-ai/@cf/meta/llama-4-scout-17b-16e-instruct";
const analysisModel = "workers-ai/@cf/meta/llama-3.3-70b-instruct-fp8-fast";

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

async function collectStream(stream: AsyncIterable<string>): Promise<string> {
  let text = "";
  for await (const chunk of stream) {
    text += chunk;
  }
  return text;
}

function extractJson(text: string): string {
  const trimmed = text.trim();

  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }

  const firstBracket = trimmed.indexOf("[");
  const lastBracket = trimmed.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    return trimmed.slice(firstBracket, lastBracket + 1);
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function repairJson(json: string): string {
  let repaired = json
    .replace(/"category":"([^"]+),count":/g, '"category":"$1","count":')
    .replace(/"theme":"([^"]+),count":/g, '"theme":"$1","count":')
    .replace(/"description":"([^"]+),count":/g, '"description":"$1","count":')
    .replace(/"count"\s*:\s*,/g, '"count": 1,')
    .replace(/"count"\s*:\s*}/g, '"count": 1}')
    .replace(/"count"\s*:\s*\]/g, '"count": 1]')
    .replace(/"count"\s*:\s*$/g, '"count": 1');

  repaired = repaired.replace(/"category:([^,"}]+)/g, '"category":"$1"');
  repaired = repaired.replace(/"examples:([^"]*)"/g, '"examples":[$1]"');
  repaired = repaired.replace(/"examples"\s*:\s*\[([^\]]*)\]/g, (_match, inner) => {
    const items = inner
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
      .map((s: string) => `"${s.replace(/^"|"$/g, "")}"`);
    return `"examples":[${items.join(",")}]`;
  });

  return repaired;
}

const howHeardSchema = `{
  "type": "object",
  "properties": {
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "category": { "type": "string" },
          "count": { "type": "number" },
          "examples": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["category", "count", "examples"]
      }
    }
  },
  "required": ["results"]
}`;

export async function analyzeHowHeard(entries: string[]) {
  console.log(`[analyzeHowHeard] model=${analysisModel}, entries=${entries.length}`);

  if (entries.length === 0) {
    console.log("[analyzeHowHeard] no entries to analyze, returning []");
    return [];
  }

  try {
    const { model } = createClient(analysisModel);
    const sample = entries.slice(0, 200);
    console.log(`[analyzeHowHeard] sending ${sample.length} samples to AI`);

    const result = streamText({
      model,
      response_format: { type: "json_object" },
      system: `You are a data analyst. Below are free-text responses to "How did you hear about AgentCribs?".

Group them into common categories/sources. Merge trivial variations (Twitter/X/x.com = "Twitter").

Respond with ONLY a valid JSON object matching this schema — no markdown, no code fences, no other text:

${howHeardSchema}

Sort by count descending. Example:
{"results":[{"category":"Twitter","count":12,"examples":["via X","saw on Twitter"]}]}`,
      prompt: sample.join("\n"),
    });

    const text = await collectStream(result.textStream);
    console.log(`[analyzeHowHeard] raw AI response (${text.length} chars): ${text.slice(0, 500)}`);

    const json = repairJson(extractJson(text));
    console.log(`[analyzeHowHeard] repaired JSON: ${json.slice(0, 500)}`);

    try {
      const parsed = JSON.parse(json);
      const results = parsed.results ?? parsed;
      const sorted = Array.isArray(results)
        ? [...results].sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
        : [];
      console.log(`[analyzeHowHeard] parsed ${sorted.length} categories`);
      return sorted;
    } catch (parseError) {
      console.error("[analyzeHowHeard] JSON parse failed:", parseError);
      console.error("[analyzeHowHeard] attempted to parse:", json);
      return [];
    }
  } catch (err) {
    console.error("[analyzeHowHeard] AI call failed:", err);
    return [];
  }
}

const storyThemesSchema = `{
  "type": "object",
  "properties": {
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "theme": { "type": "string" },
          "description": { "type": "string" },
          "count": { "type": "number" }
        },
        "required": ["theme", "description", "count"]
      }
    }
  },
  "required": ["results"]
}`;

export async function analyzeStoryThemes(
  stories: { story: string }[],
) {
  console.log(`[analyzeStoryThemes] model=${analysisModel}, stories=${stories.length}`);

  if (stories.length === 0) {
    console.log("[analyzeStoryThemes] no stories to analyze, returning []");
    return [];
  }

  try {
    const { model } = createClient(analysisModel);
    const sample = stories.slice(0, 50);
    console.log(`[analyzeStoryThemes] sending ${sample.length} samples to AI`);

    const result = streamText({
      model,
      response_format: { type: "json_object" },
      system: `You are a data analyst. Below are startup founder applications describing what they're building with AI agents.

Identify 5-10 broad themes/categories.

Respond with ONLY a valid JSON object matching this schema — no markdown, no code fences, no other text:

${storyThemesSchema}

Sort by count descending. Example:
{"results":[{"theme":"Developer Tools","description":"AI-powered coding assistants and dev tooling","count":8}]}`,
      prompt: sample.map((s) => s.story).join("\n---\n"),
    });

    const text = await collectStream(result.textStream);
    console.log(`[analyzeStoryThemes] raw AI response (${text.length} chars): ${text.slice(0, 500)}`);

    const json = repairJson(extractJson(text));
    console.log(`[analyzeStoryThemes] repaired JSON: ${json.slice(0, 500)}`);

    try {
      const parsed = JSON.parse(json);
      const results = parsed.results ?? parsed;
      const sorted = Array.isArray(results)
        ? [...results].sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
        : [];
      console.log(`[analyzeStoryThemes] parsed ${sorted.length} themes`);
      return sorted;
    } catch (parseError) {
      console.error("[analyzeStoryThemes] JSON parse failed:", parseError);
      console.error("[analyzeStoryThemes] attempted to parse:", json);
      return [];
    }
  } catch (err) {
    console.error("[analyzeStoryThemes] AI call failed:", err);
    return [];
  }
}

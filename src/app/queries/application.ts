"use server";

import { serverQuery } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import type { ApplicationData } from "../actions/application";

const KV_PREFIX = "app:";

function kvKey(id: string) {
  return `${KV_PREFIX}${id}`;
}

export const getApplication = serverQuery(
  async (id: string): Promise<ApplicationData | null> => {
    const raw = await env.AGENTCRIBS_KV.get(kvKey(id));
    if (!raw) return null;
    return JSON.parse(raw) as ApplicationData;
  },
);

export const listApplications = serverQuery(
  async (): Promise<ApplicationData[]> => {
    const list = await env.AGENTCRIBS_KV.list({ prefix: KV_PREFIX });
    if (list.keys.length === 0) return [];

    const results = await Promise.all(
      list.keys.map((key) => env.AGENTCRIBS_KV.get(key.name)),
    );

    return results
      .filter((r): r is string => r !== null)
      .map((r) => JSON.parse(r) as ApplicationData)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  },
);

export interface Topic {
  id: string;
  label: string;
}

export const getTopics = serverQuery(
  async (): Promise<Topic[]> => {
    return [
      { id: "code-generation", label: "AI Code Generation (Cursor, Copilot, Codeium)" },
      { id: "agentic-coding", label: "Agentic Coding Tools (Devin, Factory, Augment)" },
      { id: "cli-agents", label: "CLI Agents & Terminal Workflows" },
      { id: "rag-patterns", label: "RAG Patterns & Knowledge Retrieval" },
      { id: "fine-tuning", label: "Fine-Tuning & Custom Models" },
      { id: "ai-workflows", label: "AI Agents for CI/CD, DevOps & Internal Tooling" },
      { id: "ai-products", label: "Building AI-Native Products" },
      { id: "prompt-engineering", label: "Prompt Engineering & Chain-of-Thought" },
      { id: "evaluation", label: "Evaluation & Testing of AI Outputs" },
      { id: "safety", label: "AI Safety, Alignment & Guardrails" },
      { id: "infrastructure", label: "Infrastructure for AI (GPUs, Inference, Vector DBs)" },
      { id: "open-source", label: "Open Source AI & Community Models" },
      { id: "multi-agent", label: "Multi-Agent Systems & Orchestration" },
      { id: "ai-design", label: "AI-Assisted Design & Prototyping" },
      { id: "other", label: "Something else (tell us below)" },
    ].sort((a, b) => a.label.localeCompare(b.label));
  },
);

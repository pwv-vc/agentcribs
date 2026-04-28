export interface Topic {
  id: string;
  label: string;
}

export const topics: Topic[] = [
  { id: "ai-design", label: "AI-Assisted Design & Prototyping" },
  { id: "ai-products", label: "Building AI-Native Products" },
  { id: "ai-workflows", label: "AI Agents for CI/CD, DevOps & Internal Tooling" },
  { id: "agentic-coding", label: "Agentic Coding Tools (Devin, Factory, Augment)" },
  { id: "code-generation", label: "AI Code Generation (Cursor, Copilot, Codeium)" },
  { id: "cli-agents", label: "CLI Agents & Terminal Workflows" },
  { id: "evaluation", label: "Evaluation & Testing of AI Outputs" },
  { id: "fine-tuning", label: "Fine-Tuning & Custom Models" },
  { id: "infrastructure", label: "Infrastructure for AI (GPUs, Inference, Vector DBs)" },
  { id: "multi-agent", label: "Multi-Agent Systems & Orchestration" },
  { id: "open-source", label: "Open Source AI & Community Models" },
  { id: "prompt-engineering", label: "Prompt Engineering & Chain-of-Thought" },
  { id: "rag-patterns", label: "RAG Patterns & Knowledge Retrieval" },
  { id: "safety", label: "AI Safety, Alignment & Guardrails" },
  { id: "other", label: "Something else (tell us below)" },
];

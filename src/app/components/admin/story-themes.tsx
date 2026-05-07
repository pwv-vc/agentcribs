"use client";

import { useState, useTransition } from "react";
import { analyzeStoryThemes } from "@/app/actions/dashboard";
import { SparkleIcon } from "@/app/components/icons";

interface StoryTheme {
  theme: string;
  description: string;
  count: number;
}

export function StoryThemes({ stories }: { stories: { story: string }[] }) {
  const [results, setResults] = useState<StoryTheme[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await analyzeStoryThemes(stories);
        setResults(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Analysis failed");
      }
    });
  };

  return (
    <div className="rounded-xl border border-border bg-bg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-xl font-bold tracking-tight">
            Story Themes
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            AI-powered categorization of what applicants are building
          </p>
        </div>
        {stories.length > 0 && (!results || results.length === 0) && (
          <button
            onClick={handleAnalyze}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/5 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10 dark:border-accent/60 dark:hover:bg-accent/15 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SparkleIcon className="size-3.5" />
            {isPending ? "Analyzing..." : "Analyze with AI"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-status-rejected-text mb-4">{error}</p>
      )}

      {isPending && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-bg-muted rounded" />
          ))}
        </div>
      )}

      {results && results.length > 0 && (
        <div className="space-y-3">
          {results.map((item) => (
            <div
              key={item.theme}
              className="border-b border-border pb-3 last:border-0"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-text">
                  {item.theme}
                </span>
                <span className="shrink-0 rounded-full bg-accent/10 dark:bg-accent/25 px-2.5 py-0.5 text-xs font-semibold text-accent">
                  {item.count}
                </span>
              </div>
              {item.description && (
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {results && results.length === 0 && (
        <p className="text-sm text-text-secondary">
          AI analysis returned no results. Try again?
        </p>
      )}

      {(!results || results.length === 0) && !isPending && stories.length === 0 && (
        <p className="text-sm text-text-secondary">No stories to analyze yet.</p>
      )}
      {!results && !isPending && stories.length > 0 && (
        <p className="text-sm text-text-secondary">
          {stories.length} stories ready to analyze.
        </p>
      )}
    </div>
  );
}

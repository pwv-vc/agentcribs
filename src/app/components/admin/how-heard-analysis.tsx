"use client";

import { useState, useTransition } from "react";
import { analyzeHowHeard } from "@/app/actions/dashboard";
import { SparkleIcon } from "@/app/components/icons";

interface HowHeardCategory {
  category: string;
  count: number;
  examples: string[];
}

export function HowHeardAnalysis({ entries }: { entries: string[] }) {
  const [results, setResults] = useState<HowHeardCategory[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await analyzeHowHeard(entries);
        setResults(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Analysis failed");
      }
    });
  };

  return (
    <div className="rounded-xl border border-border bg-bg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-bold tracking-tight">
          How They Heard
        </h2>
        {entries.length > 0 && !results && (
          <button
            onClick={handleAnalyze}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/5 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10 dark:border-accent/60 dark:hover:bg-accent/15 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SparkleIcon className="size-3.5" />
            {isPending ? "Analyzing..." : "Analyze with AI"}
          </button>
        )}
        {(results?.length === 0 || error) && entries.length > 0 && (
          <button
            onClick={handleAnalyze}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/5 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10 dark:border-accent/60 dark:hover:bg-accent/15 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SparkleIcon className="size-3.5" />
            {isPending ? "Analyzing..." : "Retry"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-status-rejected-text mb-4">{error}</p>
      )}

      {isPending && (
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-bg-muted rounded" />
          ))}
        </div>
      )}

      {results && results.length > 0 && (
        <div className="space-y-3">
          {results.map((item) => (
            <div
              key={item.category}
              className="flex items-start justify-between gap-4 border-b border-border pb-2 last:border-0"
            >
              <div>
                <span className="text-sm font-medium text-text">
                  {item.category}
                </span>
                {item.examples.length > 0 && (
                  <p className="text-xs text-text-secondary mt-0.5">
                    e.g. {item.examples.join(", ")}
                  </p>
                )}
              </div>
              <span className="shrink-0 rounded-full bg-accent/10 dark:bg-accent/25 px-2.5 py-0.5 text-xs font-semibold text-accent dark:text-accent">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}

      {results && results.length === 0 && (
        <p className="text-sm text-text-secondary">
          AI analysis returned no results. Try again?
        </p>
      )}

      {(!results || results.length === 0) && !isPending && entries.length === 0 && (
        <p className="text-sm text-text-secondary">No "how heard" data yet.</p>
      )}
      {!results && !isPending && entries.length > 0 && (
        <p className="text-sm text-text-secondary">
          {entries.length} responses ready to analyze.
        </p>
      )}
    </div>
  );
}
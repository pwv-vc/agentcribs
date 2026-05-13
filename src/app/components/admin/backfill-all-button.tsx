"use client";

import { useState, useTransition } from "react";
import { backfillAllAccounts } from "@/app/actions/account";

export function BackfillAllButton() {
  const [isPending, startTransition] = useTransition();
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState<{ enqueued: number } | null>(null);

  const handleBackfill = () => {
    startTransition(async () => {
      const r = await backfillAllAccounts();
      setResult(r);
    });
  };

  if (result) {
    return (
      <span className="text-xs text-accent">
        Enqueued {result.enqueued} jobs. Refresh to see progress.
      </span>
    );
  }

  if (!confirmed) {
    return (
      <button
        onClick={() => setConfirmed(true)}
        className="rounded-md border border-border bg-bg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-muted hover:text-text"
      >
        Backfill All
      </button>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <span className="text-xs text-text-secondary">Are you sure?</span>
      <button
        onClick={handleBackfill}
        disabled={isPending}
        className="rounded-md border border-accent bg-accent px-3 py-1.5 text-xs font-medium text-accent-text transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {isPending ? "Running..." : "Confirm"}
      </button>
      <button
        onClick={() => setConfirmed(false)}
        disabled={isPending}
        className="rounded-md border border-border bg-bg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-muted"
      >
        Cancel
      </button>
    </span>
  );
}

"use client";

import { useState, useTransition } from "react";
import { backfillAccount } from "@/app/actions/account";

export function BackfillButton({ applicationId }: { applicationId: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  const handleBackfill = () => {
    startTransition(async () => {
      const r = await backfillAccount(applicationId);
      setResult(`Created account for ${r.email}`);
    });
  };

  if (result) {
    return <span className="text-xs text-accent">{result}</span>;
  }

  return (
    <button
      onClick={handleBackfill}
      disabled={isPending}
      className="rounded-md border border-border bg-bg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-muted hover:text-text disabled:opacity-50"
    >
      {isPending ? "Creating..." : "Create Account"}
    </button>
  );
}

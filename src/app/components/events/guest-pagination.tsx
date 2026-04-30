export function GuestPagination({
  count,
  hasMore,
  cursor,
  nextCursor,
  buildHref,
}: {
  count: number;
  hasMore: boolean;
  cursor: string | undefined;
  nextCursor: string | undefined;
  buildHref: (overrides: Record<string, string>) => string;
}) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-text-secondary">
        Showing {count} guest{count === 1 ? "" : "s"}
        {hasMore ? "+" : ""}
      </span>
      <div className="flex gap-2">
        {cursor && (
          <a
            href={buildHref({ guest_cursor: "" })}
            className="rounded-lg border border-border bg-bg-soft px-3 py-1.5 text-xs font-medium text-text no-underline transition-colors hover:bg-bg-muted"
          >
            &larr; Previous page
          </a>
        )}
        {hasMore && nextCursor && (
          <a
            href={buildHref({ guest_cursor: nextCursor })}
            className="rounded-lg border border-border bg-bg-soft px-3 py-1.5 text-xs font-medium text-text no-underline transition-colors hover:bg-bg-muted"
          >
            Next page &rarr;
          </a>
        )}
      </div>
    </div>
  );
}

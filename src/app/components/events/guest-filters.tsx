import type { GuestApprovalStatus } from "@/app/lib/luma";

const FILTERS = [
  "",
  "approved",
  "session",
  "pending_approval",
  "invited",
  "declined",
  "waitlist",
] as const;

export function GuestFilters({
  current,
  buildHref,
}: {
  current: GuestApprovalStatus | undefined;
  buildHref: (overrides: Record<string, string>) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((s) => {
        const active = current === s || (!current && !s);
        return (
          <a
            key={s}
            href={buildHref({ guest_status: s, guest_cursor: "" })}
            className={
              "rounded-full px-3 py-1 text-xs font-medium no-underline " +
              (active
                ? "bg-accent text-white"
                : "border border-border bg-bg text-text-secondary hover:bg-bg-muted")
            }
          >
            {s || "All"}
          </a>
        );
      })}
    </div>
  );
}

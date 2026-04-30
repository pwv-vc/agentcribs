import type { CalendarListEventsEntry } from "@/app/lib/luma";
import type { GuestCounts } from "@/app/lib/events";
import { link } from "@/app/shared/links";

function formatDate(iso?: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EventsTable({
  items,
  guestCounts,
}: {
  items: CalendarListEventsEntry[];
  guestCounts?: Record<string, GuestCounts>;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-bg-soft">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-4 font-semibold">Name</th>
            <th className="px-6 py-4 font-semibold">Date</th>
            {guestCounts && (
              <th className="px-6 py-4 font-semibold">Guests</th>
            )}
          </tr>
        </thead>
        {items.map((entry, idx) => {
          const e = entry.event;
          const counts = guestCounts?.[e.api_id];
          const total = counts
            ? Object.values(counts).reduce((a, b) => a + b, 0)
            : undefined;
          const rowBg = idx % 2 === 0 ? "bg-bg" : "bg-bg-soft";
          return (
            <tbody
              key={e.api_id}
              className={`${rowBg} transition-colors hover:bg-bg-muted/50`}
            >
              <tr>
                <td className="px-6 py-5 align-middle">
                  <a
                    href={link("/admin/events/:id", { id: e.api_id })}
                    className="font-medium text-text no-underline underline-offset-2 transition-colors hover:text-accent hover:underline"
                  >
                    {e.cover_url && (
                      <img
                        src={e.cover_url}
                        alt={"Cover for " + e.name}
                        className="-ml-2 mr-2 inline-block h-12 w-16 rounded object-cover"
                      />
                    )}
                    {e.name}
                  </a>
                </td>
                <td className="whitespace-nowrap px-6 py-5 text-text-secondary">
                  {formatDate(e.start_at)}
                </td>
                {guestCounts && (
                  <td className="px-6 py-5 text-text-secondary tabular-nums">
                    {total !== undefined ? total : "-"}
                  </td>
                )}
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
}

import type { CalendarListEventsEntry } from "@/app/lib/luma";
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
}: {
  items: CalendarListEventsEntry[];
}) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-border bg-bg-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((entry, idx) => {
              const e = entry.event;
              const rowBg = idx % 2 === 0 ? "bg-bg" : "bg-bg-soft";
              return (
                <tr
                  key={e.api_id}
                  className={`${rowBg} transition-colors hover:bg-bg-muted/50`}
                >
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {items.map((entry) => {
          const e = entry.event;
          return (
            <a
              key={e.api_id}
              href={link("/admin/events/:id", { id: e.api_id })}
              className="block rounded-lg border border-border bg-bg-soft p-4 no-underline transition-colors hover:bg-bg-muted/50"
            >
              <div className="flex items-start gap-3">
                {e.cover_url && (
                  <img
                    src={e.cover_url}
                    alt={"Cover for " + e.name}
                    className="h-16 w-20 flex-shrink-0 rounded object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-text line-clamp-2 leading-snug">
                    {e.name}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {formatDate(e.start_at)}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}

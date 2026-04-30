import { getLumaClient } from "@/app/lib/luma";
import { EventsTable } from "@/app/shared/events-table";
import { Seo } from "@/app/components/seo";
import { link } from "@/app/shared/links";

export const AdminEvents = async ({
  request,
}: {
  request?: Request;
}) => {
  const url = request ? new URL(request.url) : new URL("http://localhost");
  const cursor = url.searchParams.get("cursor") ?? undefined;
  const LIMIT = 50;

  const luma = getLumaClient();

  try {
    const { entries, has_more, next_cursor } = await luma.listEvents({
      sort_column: "start_at",
      sort_direction: "desc",
      limit: LIMIT,
      ...(cursor && { after: cursor }),
    });

    const buildHref = (overrides: Record<string, string>) => {
      const p = new URLSearchParams(url.searchParams);
      for (const [k, v] of Object.entries(overrides)) {
        if (v) p.set(k, v);
        else p.delete(k);
      }
      return link("/admin/events") + "?" + p.toString();
    };

    return (
      <>
        <Seo
          title="Events | Admin | AgentCribs"
          description="AgentCribs Luma events admin panel."
          noIndex
        />
        <main className="mx-auto max-w-[1200px] px-6 py-16 sm:px-8 sm:py-20">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Events
            </h1>
          </div>

          {entries.length === 0 ? (
            <p className="mt-12 text-center text-text-secondary">
              No events found.
            </p>
          ) : (
            <div className="mt-8">
              <EventsTable items={entries} />
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-2">
            {cursor && (
              <a
                href={buildHref({ cursor: "" })}
                className="rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text no-underline transition-colors hover:bg-bg-muted"
              >
                &larr; Previous page
              </a>
            )}
            {has_more && next_cursor && (
              <a
                href={buildHref({ cursor: next_cursor })}
                className="rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text no-underline transition-colors hover:bg-bg-muted"
              >
                Next page &rarr;
              </a>
            )}
          </div>
        </main>
      </>
    );
  } catch {
    return (
      <>
        <Seo
          title="Events | Admin | AgentCribs"
          description="AgentCribs Luma events admin panel."
          noIndex
        />
        <main className="mx-auto max-w-[1200px] px-6 py-16 sm:px-8 sm:py-20">
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Events
          </h1>
          <p className="mt-6 text-text-secondary">
            Could not load events from Luma. Please try again later.
          </p>
        </main>
      </>
    );
  }
};

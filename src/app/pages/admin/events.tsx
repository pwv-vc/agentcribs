import { getLumaClient } from "@/app/lib/luma";
import { EventsTable } from "@/app/shared/events-table";
import { Seo } from "@/app/components/seo";
import { CtaButton } from "@/app/shared/cta-button";

export const AdminEvents = async () => {
  const luma = getLumaClient();
  const { entries, has_more, next_cursor } = await luma.listEvents({
    sort_column: "start_at",
    sort_direction: "desc",
    limit: 50,
  });

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

        {has_more && next_cursor && (
          <p className="mt-4 text-center text-sm text-text-secondary">
            More events available. Use cursor:{" "}
            <code className="rounded bg-bg-soft px-1.5 py-0.5 text-xs">
              {next_cursor}
            </code>
          </p>
        )}
      </main>
    </>
  );
};

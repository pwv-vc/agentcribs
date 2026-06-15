import { Seo } from "@/app/components/seo";
import { CtaButton } from "@/app/shared/cta-button";
import { link } from "@/app/shared/links";
import { getEvent, type Event } from "@/app/queries/events";
import { formatDateShort } from "@/app/lib/formatters";

function statusLabel(status: Event["status"]): string {
  switch (status) {
    case "upcoming":
      return "Upcoming";
    case "current":
      return "Happening now";
    case "past":
      return "Past";
  }
}

function statusColor(status: Event["status"]): string {
  switch (status) {
    case "upcoming":
      return "bg-status-live-bg text-status-live-text";
    case "current":
      return "bg-status-scheduled-bg text-status-scheduled-text";
    case "past":
      return "bg-status-ended-bg text-status-ended-text";
  }
}

export const EventDetail = async ({ id }: { id: string }) => {
  let event: Event | null = null;
  try {
    event = await getEvent(id);
  } catch {
    return (
      <>
        <Seo
          title="Event Not Found | AgentCribs"
          description="The requested event could not be found."
        />
        <main className="mx-auto max-w-[800px] px-6 py-24 sm:px-8 sm:py-32">
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Event not found
          </h1>
          <p className="mt-4 text-text-secondary">
            The event you're looking for doesn't exist or was removed.
          </p>
          <div className="mt-8">
            <a href={link("/community/events")} className="text-sm text-text-secondary underline decoration-border underline-offset-4 hover:text-accent transition-colors">&larr; Back to events</a>
          </div>
        </main>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Seo
          title="Event Not Found | AgentCribs"
          description="The requested event could not be found."
        />
        <main className="mx-auto max-w-[800px] px-6 py-24 sm:px-8 sm:py-32">
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Event not found
          </h1>
          <p className="mt-4 text-text-secondary">
            The event you're looking for doesn't exist or was removed.
          </p>
          <div className="mt-8">
            <a href={link("/community/events")} className="text-sm text-text-secondary underline decoration-border underline-offset-4 hover:text-accent transition-colors">&larr; Back to events</a>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Seo
        title={`${event.title} | AgentCribs`}
        description={`${event.title} — ${event.location}, ${formatDateShort(event.date)}.`}
      />
      <main className="mx-auto max-w-[800px] px-6 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-text-secondary">
              {formatDateShort(event.date)} &middot; {event.location}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              {event.title}
            </h1>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColor(event.status)}`}
          >
            {statusLabel(event.status)}
          </span>
        </div>

        {event.speakers.length > 0 && (
          <p className="mt-6 text-base text-text-secondary">
            <span className="font-semibold text-text">
              {event.speakers
                .map((s) =>
                  s.affiliation ? `${s.name} (${s.affiliation})` : s.name,
                )
                .join(", ")}
            </span>
          </p>
        )}

        <div className="mt-12 border-t border-border pt-12">
          <div className="prose max-w-none leading-relaxed text-text-secondary">
            <div dangerouslySetInnerHTML={{ __html: event.content }} />
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <a href={link("/community/events")} className="text-sm text-text-secondary underline decoration-border underline-offset-4 hover:text-accent transition-colors">&larr; Back to events</a>
          <CtaButton href="/apply" label="Apply to join the waitlist" />
        </div>
      </main>
    </>
  );
};

import { Seo } from "@/app/components/seo";
import { CtaButton } from "@/app/shared/cta-button";
import { link } from "@/app/shared/links";
import {
  getUpcomingEvents,
  getPastEvents,
  type Event,
} from "@/app/queries/events";
import { formatDateShort } from "@/app/lib/formatters";
import { FormatBadge, EventStatusPill } from "@/app/lib/event-badges";

function FeaturedEventCard({ event }: { event: Event }) {
  return (
    <a
      href={link("/community/events/:id", { id: event.id })}
      className="group block rounded-lg border-2 border-accent bg-accent/5 p-6 transition-colors hover:bg-accent/10 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-pwv-green">
            {formatDateShort(event.date, event.timezone ?? "America/New_York")} &middot; {event.location}
          </p>
          <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
            {event.title}
          </h2>
          {event.speakers.length > 0 && (
            <p className="mt-3 text-base text-text-secondary">
              {event.speakers
                .map((s) =>
                  s.affiliation ? `${s.name} (${s.affiliation})` : s.name,
                )
                .join(", ")}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FormatBadge format={event.format} size="md" />
          <EventStatusPill status={event.status} size="md" />
        </div>
      </div>
    </a>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <a
      href={link("/community/events/:id", { id: event.id })}
      className="group block rounded-lg border border-border bg-bg p-6 transition-colors hover:border-accent/30 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-text-secondary">
            {formatDateShort(event.date, event.timezone ?? "America/New_York")} &middot; {event.location}
          </p>
          <h2 className="mt-2 text-xl font-bold leading-snug sm:text-2xl">
            {event.title}
          </h2>
          {event.speakers.length > 0 && (
            <p className="mt-3 text-sm text-text-secondary">
              {event.speakers
                .map((s) =>
                  s.affiliation ? `${s.name} (${s.affiliation})` : s.name,
                )
                .join(", ")}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FormatBadge format={event.format} size="md" />
          <EventStatusPill status={event.status} size="md" />
        </div>
      </div>
    </a>
  );
}

function PastEventRow({ event }: { event: Event }) {
  return (
    <a
      href={link("/community/events/:id", { id: event.id })}
      className="group flex flex-wrap items-center gap-x-6 gap-y-1 rounded-none border-b border-border pb-4 transition-colors hover:text-pwv-green"
    >
      <span className="text-sm tabular-nums text-text-secondary w-28 shrink-0">
        {formatDateShort(event.date, event.timezone ?? "America/New_York")}
      </span>
      <span className="text-lg font-bold">{event.title}</span>
      <span className="text-sm text-text-secondary">{event.location}</span>
      <FormatBadge format={event.format} size="sm" />
    </a>
  );
}

export const EventsList = async () => {
  let upcoming: Event[] = [];
  let past: Event[] = [];
  try {
    [upcoming, past] = await Promise.all([
      getUpcomingEvents(),
      getPastEvents(),
    ]);
  } catch {
    return (
      <>
        <Seo
          title="Events | AgentCribs"
          description="AgentCribs community events."
        />
        <main className="mx-auto max-w-[800px] px-6 py-16 sm:px-8 sm:py-24">
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Events
          </h1>
          <p className="mt-4 text-text-secondary">
            Something went wrong loading events. Please try again later.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Events | AgentCribs"
        description="AgentCribs community events — in-person and online gatherings for agentic software builders."
      />
      <main className="mx-auto max-w-[800px] px-6 py-16 sm:px-8 sm:py-24">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Events
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-text-secondary">
          In-person and online gatherings for the AgentCribs community.
        </p>

        <h2 className="mt-12 text-2xl font-black leading-tight sm:text-3xl">
          Upcoming
        </h2>

        {upcoming.length === 0 ? (
          <div className="mt-6 rounded-lg border border-border bg-bg-soft p-8 text-center">
            <p className="text-lg text-text-secondary">
              No upcoming events scheduled at the moment.
            </p>
            <p className="mt-2 text-text-secondary">
              Apply to join the waitlist and you'll hear about future events
              first.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <CtaButton href="/apply" label="Apply to join the waitlist" />
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {upcoming.map((event, i) =>
              i === 0 ? (
                <FeaturedEventCard key={event.id} event={event} />
              ) : (
                <EventCard key={event.id} event={event} />
              ),
            )}
          </div>
        )}

        {past.length > 0 && (
          <>
            <h2 className="mt-16 text-2xl font-black leading-tight sm:text-3xl">
              Past
            </h2>
            <div className="mt-6 space-y-4">
              {past.map((event) => (
                <PastEventRow key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
};

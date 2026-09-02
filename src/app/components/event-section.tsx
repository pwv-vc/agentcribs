import type { Event } from "@/app/queries/events";
import { formatDateShort } from "@/app/lib/formatters";
import { link } from "@/app/shared/links";
import { FormatBadge, EventStatusPill } from "@/app/lib/event-badges";
import { BrandLink } from "@/app/components/links";

export function EventSection({ event }: { event: Event | null }) {
  if (!event) return null;

  const externalRegistration = event.lumaEventUrl;
  const registerHref = externalRegistration ?? (event.waitlist ? "/apply" : link("/community/events/:id", { id: event.id }));
  const registerLabel = externalRegistration ? "Register now" : event.waitlist ? "Register" : "Details coming soon";

  return (
    <section className="border-b border-border bg-bg">
      <div className="mx-auto grid max-w-[1040px] gap-10 px-6 py-16 sm:px-8 sm:py-24 lg:grid-cols-[300px_1fr]">
        <div>
          <span className="font-sans text-sm font-extrabold uppercase tracking-widest text-pwv-green">
            Featured event
          </span>
          <h2 className="mt-2 text-4xl font-black leading-none sm:text-5xl">
            {formatDateShort(event.date, event.timezone ?? "America/New_York")} in {event.location}
          </h2>
          <p className="mt-5 text-xl font-black text-pwv-green">{event.title}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <FormatBadge format={event.format} size="md" />
            {event.status === "past" && <EventStatusPill status="past" size="md" />}
          </div>
        </div>

        <div className="max-w-[680px] text-lg">
          {event.speakers.length > 0 && (
            <p className="leading-relaxed text-text-secondary">
              Featuring{" "}
              {event.speakers.map((s, i) => (
                <span key={s.name}>
                  {i > 0 && i === event.speakers.length - 1 && " and "}
                  <strong className="text-text">{s.name}</strong>
                  {s.affiliation && <> of {s.affiliation}</>}
                  {i < event.speakers.length - 2 && ", "}
                </span>
              ))}
            </p>
          )}

          <div className="mt-5 prose max-w-none leading-relaxed text-text-secondary">
            <div dangerouslySetInnerHTML={{ __html: event.content }} />
          </div>

          <p className="mt-6">
            <a
              href={registerHref}
              target={externalRegistration ? "_blank" : undefined}
              rel={externalRegistration ? "noopener noreferrer" : undefined}
              className="inline-block border border-brand-green bg-brand-green px-6 py-3 text-base font-black text-accent-text no-underline transition-colors hover:border-brand-green-hover hover:bg-brand-green-hover sm:px-8 sm:py-4 sm:text-lg"
            >
              {registerLabel}
            </a>
            <span className="mx-2 text-border" aria-hidden="true">
              |
            </span>
            <BrandLink href={link("/community/events")}>
              All events
            </BrandLink>
          </p>
        </div>
      </div>
    </section>
  );
}

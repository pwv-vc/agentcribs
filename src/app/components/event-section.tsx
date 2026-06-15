import type { Event } from "@/app/queries/events";
import { formatDateShort } from "@/app/lib/formatters";
import { link } from "@/app/shared/links";

export function EventSection({ event }: { event: Event | null }) {
  if (!event) return null;

  return (
    <section className="border-b border-border bg-bg">
      <div className="mx-auto grid max-w-[1040px] gap-10 px-6 py-16 sm:px-8 sm:py-24 lg:grid-cols-[300px_1fr]">
        <div>
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
            Featured event
          </span>
          <h2 className="mt-2 text-4xl font-black leading-none sm:text-5xl">
            {formatDateShort(event.date)} in {event.location}
          </h2>
          <p className="mt-5 text-xl font-black text-accent">{event.title}</p>
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
              href={link("/community/events/:id", { id: event.id })}
              className="font-bold text-accent no-underline hover:text-accent-hover"
            >
              View event details
            </a>
            <span className="mx-2 text-border">|</span>
            <a
              href={link("/community/events")}
              className="font-bold text-accent no-underline hover:text-accent-hover"
            >
              All events
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

import {
  getLumaClient,
  type Host,
  type LumaEvent,
  type LumaGuest,
  type GuestApprovalStatus,
} from "@/app/lib/luma";
import {
  formatDateShort,
  formatTime,
  parseDuration,
} from "@/app/lib/formatters";
import { Seo } from "@/app/components/seo";
import { CtaButton } from "@/app/shared/cta-button";
import { link } from "@/app/shared/links";
import { EventDetailSection } from "@/app/components/events/event-detail-section";
import { LumaMapLink } from "@/app/components/events/luma-map-link";
import { HostCard } from "@/app/components/events/host-card";
import { EventGuestStats } from "@/app/components/events/event-guest-stats";
import { GuestFilters } from "@/app/components/events/guest-filters";
import { GuestsTable } from "@/app/components/events/guests-table";
import { GuestPagination } from "@/app/components/events/guest-pagination";
import { ExternalLink } from "@/app/components/events/external-link";
import { EventDescription } from "@/app/components/events/event-description";

function location(event: LumaEvent): string {
  if (event.location_type === "online") return "Online";
  if (event.geo_address_json?.full_address) {
    return event.geo_address_json.full_address;
  }
  if (event.geo_address_info) {
    return [
      event.geo_address_info.address_1,
      event.geo_address_info.city,
      event.geo_address_info.state,
      event.geo_address_info.zip,
      event.geo_address_info.country,
    ]
      .filter(Boolean)
      .join(", ");
  }
  return "-";
}

function googleMapsPlaceId(event: LumaEvent): string | null {
  return event.geo_address_json?.google_maps_place_id ?? null;
}

export async function AdminEventDetail({
  id,
  request,
}: {
  id: string;
  request: Request;
}) {
  const luma = getLumaClient();
  let event: LumaEvent;
  let hosts: Host[];
  let guests: LumaGuest[] = [];
  let guestsHasMore = false;
  let guestsNextCursor: string | undefined;

  const url = new URL(request.url);
  const guestCursor = url.searchParams.get("guest_cursor") ?? undefined;
  const guestStatus = url.searchParams.get("guest_status") as
    | GuestApprovalStatus
    | undefined;
  const guestSort = (url.searchParams.get("guest_sort") ?? "registered_at") as
    | "name"
    | "email"
    | "created_at"
    | "registered_at"
    | "checked_in_at";
  const guestDir = (url.searchParams.get("guest_dir") ?? "desc") as
    | "asc"
    | "desc"
    | "asc nulls last"
    | "desc nulls last";
  const GUEST_LIMIT = 30;

  const buildGuestHref = (overrides: Record<string, string>) => {
    const p = new URLSearchParams(url.searchParams);
    for (const [k, v] of Object.entries(overrides)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    return link("/admin/events/:id", { id }) + "?" + p.toString();
  };

  try {
    const [eventResult, guestsResult] = await Promise.all([
      luma.getEvent(id),
      luma.getGuests(id, {
        pagination_cursor: guestCursor,
        pagination_limit: GUEST_LIMIT,
        approval_status: guestStatus,
        sort_column: guestSort,
        sort_direction: guestDir,
      }),
    ]);

    event = eventResult.event;
    hosts = eventResult.hosts;
    guests = guestsResult.entries;
    guestsHasMore = guestsResult.has_more;
    guestsNextCursor = guestsResult.next_cursor;
  } catch {
    return (
      <>
        <Seo
          title="Event Not Found | Admin | AgentCribs"
          description="The requested event could not be found."
          noIndex
        />
        <main className="mx-auto max-w-[800px] px-6 py-16 sm:px-8 sm:py-20">
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Event not found
          </h1>
          <p className="mt-2 text-text-secondary">No event with ID {id}.</p>
          <div className="mt-8">
            <CtaButton
              href={link("/admin/events")}
              label="&larr; Back to events"
            />
          </div>
        </main>
      </>
    );
  }

  const eventLocation = location(event);
  const eventMapsId = googleMapsPlaceId(event);

  return (
    <>
      <Seo
        title={event.name + " | Admin | AgentCribs"}
        description={"Event detail for " + event.name + "."}
        noIndex
      />
      <main className="mx-auto max-w-[800px] px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex items-center gap-4 rounded-lg border border-border bg-bg-soft p-4">
          {event.cover_url && (
            <img
              src={event.cover_url}
              alt={"Cover for " + event.name}
              className="h-72 w-72 flex-shrink-0 rounded-lg border border-border object-cover"
            />
          )}
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            {event.name}
          </h1>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-bg-soft p-6 sm:p-8">
          <dl className="divide-y divide-border">
            <EventDetailSection label="Event ID" value={event.api_id} />
            <EventDetailSection label="Status" value={event.status ?? "-"} />
            <EventDetailSection
              label="Date"
              value={formatDateShort(event.start_at, event.timezone)}
            />
            <EventDetailSection
              label="Time"
              value={
                event.start_at
                  ? formatTime(event.start_at, event.timezone) +
                    " – " +
                    formatTime(event.end_at, event.timezone)
                  : "-"
              }
            />
            <EventDetailSection
              label="Duration"
              value={parseDuration(event.duration_interval) ?? "-"}
            />
            <EventDetailSection
              label="Timezone"
              value={event.timezone ?? "-"}
            />
            <EventDetailSection label="Location" value={eventLocation} />
            {eventMapsId && <LumaMapLink googleMapsPlaceId={eventMapsId} />}
            <EventDetailSection
              label="Tickets"
              value={
                (event.ticket_count ?? 0) +
                " / " +
                (event.ticket_limit ?? "Unlimited")
              }
            />
            <EventDetailSection
              label="Sessions"
              value={
                "Past: " +
                (event.num_past_sessions ?? 0) +
                " | Upcoming: " +
                (event.num_upcoming_sessions ?? 0)
              }
            />
            <EventDetailSection
              label="Event Type"
              value={
                event.event_type === "multi_session"
                  ? "Multi-session"
                  : "Single session"
              }
            />
          </dl>
        </div>

        {hosts && hosts.length > 0 && (
          <>
            <h2 className="mt-10 font-serif text-xl font-bold tracking-tight">
              Hosts
            </h2>
            <div className="mt-4 rounded-lg border border-border bg-bg-soft p-6 sm:p-8">
              <div className="space-y-4">
                {hosts.map((host) => (
                  <HostCard key={host.api_id} host={host} />
                ))}
              </div>
            </div>
          </>
        )}

        {guests.length > 0 && (
          <>
            <h2 className="mt-10 font-serif text-xl font-bold tracking-tight">
              Guests ({guests.length}
              {guestsHasMore ? "+" : ""})
            </h2>

            <div className="mt-4 space-y-4">
              <EventGuestStats guests={guests} />
              <GuestFilters current={guestStatus} buildHref={buildGuestHref} />
              <GuestsTable guests={guests} />
              <GuestPagination
                count={guests.length}
                hasMore={guestsHasMore}
                cursor={guestCursor}
                nextCursor={guestsNextCursor}
                buildHref={buildGuestHref}
              />
            </div>
          </>
        )}

        {event.url && (
          <div className="mt-10">
            <ExternalLink href={event.url} label="View on Luma" />
          </div>
        )}

        {(event.description || event.description_mirror) && (
          <>
            <h2 className="mt-10 font-serif text-xl font-bold tracking-tight">
              Description
            </h2>
            <div className="mt-4">
              <EventDescription
                description={
                  event.description_mirror || event.description || ""
                }
              />
            </div>
          </>
        )}
      </main>
    </>
  );
}

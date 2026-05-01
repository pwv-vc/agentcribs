import type { LumaGuest } from "@/app/lib/luma";
import { GuestStatusBadge } from "@/app/components/events/guest-status-badge";

function formatCheckIn(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function GuestsTable({ guests }: { guests: LumaGuest[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-border bg-bg-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Ticket</th>
              <th className="px-6 py-4 font-semibold">Check-in</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest, idx) => {
              const rowBg = idx % 2 === 0 ? "bg-bg" : "bg-bg-soft";
              return (
                <tr
                  key={guest.api_id}
                  className={`${rowBg} transition-colors hover:bg-bg-muted/50`}
                >
                  <td className="px-6 py-5 font-medium text-text">{guest.name}</td>
                  <td className="px-6 py-5 text-text-secondary">{guest.email}</td>
                  <td className="px-6 py-5">
                    <GuestStatusBadge status={guest.approval_status} />
                  </td>
                  <td className="px-6 py-5 text-text-secondary">
                    {guest.event_ticket?.name ?? "-"}
                  </td>
                  <td className="px-6 py-5 text-text-secondary">
                    {formatCheckIn(guest.checked_in_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {guests.map((guest) => (
          <div
            key={guest.api_id}
            className="rounded-lg border border-border bg-bg-soft p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-text text-sm">{guest.name}</h3>
                <p className="text-xs text-text-secondary truncate">
                  {guest.email}
                </p>
              </div>
              <GuestStatusBadge status={guest.approval_status} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
              <span>{guest.event_ticket?.name ?? "-"}</span>
              <span>{formatCheckIn(guest.checked_in_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

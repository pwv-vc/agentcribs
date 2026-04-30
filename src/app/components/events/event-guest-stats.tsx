import type { LumaGuest, GuestApprovalStatus } from "@/app/lib/luma";
import { getGuestStatusCounts } from "@/app/lib/events";

const GUEST_STATUS_CONFIG: {
  status: GuestApprovalStatus;
  label: string;
  bg: string;
  text: string;
}[] = [
  { status: "approved", label: "Approved", bg: "bg-green-50 dark:bg-green-950", text: "text-green-700 dark:text-green-300" },
  { status: "session", label: "Session", bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300" },
  { status: "pending_approval", label: "Pending", bg: "bg-yellow-50 dark:bg-yellow-950", text: "text-yellow-700 dark:text-yellow-300" },
  { status: "invited", label: "Invited", bg: "bg-yellow-50 dark:bg-yellow-950", text: "text-yellow-700 dark:text-yellow-300" },
  { status: "declined", label: "Declined", bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-300" },
  { status: "waitlist", label: "Waitlist", bg: "bg-purple-50 dark:bg-purple-950", text: "text-purple-700 dark:text-purple-300" },
];

export function EventGuestStats({
  guests,
  totalShown,
  hasMore,
}: {
  guests: LumaGuest[];
  totalShown: number;
  hasMore: boolean;
}) {
  const counts = getGuestStatusCounts(guests);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {GUEST_STATUS_CONFIG.map(({ status, label, bg, text }) => {
          const count = counts[status];
          return (
            <div
              key={status}
              className={`rounded-lg border border-border p-3 ${bg}`}
            >
              <p className={`text-xs font-semibold uppercase tracking-wider ${text}`}>
                {label}
              </p>
              <p className={`mt-1 text-2xl font-bold tabular-nums ${text}`}>
                {count}
              </p>
            </div>
          );
        })}
      </div>
      {hasMore && (
        <p className="mt-2 text-xs text-text-secondary">
          Showing counts from first {totalShown} guests only
        </p>
      )}
    </div>
  );
}

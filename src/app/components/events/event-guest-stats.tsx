import type { LumaGuest, GuestApprovalStatus } from "@/app/lib/luma";
import { getGuestStatusCounts } from "@/app/lib/events";
import {
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  UserPlusIcon,
  XCircleIcon,
  ListIcon,
} from "@/app/components/icons";

const GUEST_STATUS_CONFIG: {
  status: GuestApprovalStatus;
  label: string;
  icon: typeof CheckCircleIcon;
  bg: string;
  text: string;
}[] = [
  { status: "approved", label: "Approved", icon: CheckCircleIcon, bg: "bg-status-live-stat-bg", text: "text-status-live-stat-text" },
  { status: "session", label: "Session", icon: CalendarIcon, bg: "bg-status-scheduled-stat-bg", text: "text-status-scheduled-stat-text" },
  { status: "pending_approval", label: "Pending", icon: ClockIcon, bg: "bg-status-draft-stat-bg", text: "text-status-draft-stat-text" },
  { status: "invited", label: "Invited", icon: UserPlusIcon, bg: "bg-status-draft-stat-bg", text: "text-status-draft-stat-text" },
  { status: "declined", label: "Declined", icon: XCircleIcon, bg: "bg-status-declined-stat-bg", text: "text-status-declined-stat-text" },
  { status: "waitlist", label: "Waitlist", icon: ListIcon, bg: "bg-status-waitlist-stat-bg", text: "text-status-waitlist-stat-text" },
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
        {GUEST_STATUS_CONFIG.map(({ status, label, icon: Icon, bg, text }) => {
          const count = counts[status];
          return (
            <div
              key={status}
              className={`rounded-lg border border-border p-3 ${bg}`}
            >
              <p className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider ${text}`}>
                <Icon />
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

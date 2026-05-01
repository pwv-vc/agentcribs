import type { GuestApprovalStatus } from "@/app/lib/luma";
import {
  ListIcon,
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  UserPlusIcon,
  XCircleIcon,
  UsersIcon,
} from "@/app/components/icons";

const FILTERS: {
  value: "" | GuestApprovalStatus;
  label: string;
  icon: typeof ListIcon;
}[] = [
  { value: "", label: "All", icon: UsersIcon },
  { value: "approved", label: "Approved", icon: CheckCircleIcon },
  { value: "session", label: "Session", icon: CalendarIcon },
  { value: "pending_approval", label: "Pending", icon: ClockIcon },
  { value: "invited", label: "Invited", icon: UserPlusIcon },
  { value: "declined", label: "Declined", icon: XCircleIcon },
  { value: "waitlist", label: "Waitlist", icon: ListIcon },
];

export function GuestFilters({
  current,
  buildHref,
}: {
  current: GuestApprovalStatus | undefined;
  buildHref: (overrides: Record<string, string>) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ value, label, icon: Icon }) => {
        const active = current === value || (!current && !value);
        return (
          <a
            key={value}
            href={buildHref({ guest_status: value, guest_cursor: "" })}
            className={
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium no-underline " +
              (active
                ? "bg-accent text-white"
                : "border border-border bg-bg text-text-secondary hover:bg-bg-muted")
            }
          >
            <Icon />
            {label}
          </a>
        );
      })}
    </div>
  );
}

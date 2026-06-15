import type { GuestApprovalStatus } from "@/app/lib/luma";
import {
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  UserPlusIcon,
  XCircleIcon,
  ListIcon,
} from "@/app/components/icons";

const config: Record<
  GuestApprovalStatus,
  { label: string; icon: typeof CheckCircleIcon; style: string }
> = {
  approved: {
    label: "Approved",
    icon: CheckCircleIcon,
    style: "bg-status-live-bg text-status-live-text",
  },
  session: {
    label: "Session",
    icon: CalendarIcon,
    style: "bg-status-scheduled-bg text-status-scheduled-text",
  },
  pending_approval: {
    label: "Pending",
    icon: ClockIcon,
    style: "bg-status-draft-bg text-status-draft-text",
  },
  invited: {
    label: "Invited",
    icon: UserPlusIcon,
    style: "bg-status-draft-bg text-status-draft-text",
  },
  declined: {
    label: "Declined",
    icon: XCircleIcon,
    style: "bg-status-declined-bg text-status-declined-text",
  },
  waitlist: {
    label: "Waitlist",
    icon: ListIcon,
    style: "bg-status-waitlist-bg text-status-waitlist-text",
  },
};

export function GuestStatusBadge({
  status,
}: {
  status: GuestApprovalStatus;
}) {
  const c = config[status];
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${c.style}`}
    >
      <Icon />
      {c.label}
    </span>
  );
}

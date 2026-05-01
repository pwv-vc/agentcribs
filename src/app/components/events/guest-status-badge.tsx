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
    style: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  session: {
    label: "Session",
    icon: CalendarIcon,
    style: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  pending_approval: {
    label: "Pending",
    icon: ClockIcon,
    style:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  invited: {
    label: "Invited",
    icon: UserPlusIcon,
    style:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  declined: {
    label: "Declined",
    icon: XCircleIcon,
    style: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  waitlist: {
    label: "Waitlist",
    icon: ListIcon,
    style:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
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

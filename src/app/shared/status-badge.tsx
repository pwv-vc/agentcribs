import type { ApplicationStatus } from "@/app/actions/application";
import {
  QuestionIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@/app/components/icons";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; icon: typeof QuestionIcon; style: string }
> = {
  unverified: {
    label: "Unverified",
    icon: QuestionIcon,
    style: "bg-status-pending-bg text-status-pending-text",
  },
  pending: {
    label: "Pending",
    icon: ClockIcon,
    style: "bg-status-pending-bg text-status-pending-text",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircleIcon,
    style: "bg-status-accepted-bg text-status-accepted-text",
  },
  rejected: {
    label: "Rejected",
    icon: XCircleIcon,
    style: "bg-status-rejected-bg text-status-rejected-text",
  },
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.style}`}
    >
      <Icon />
      {config.label}
    </span>
  );
}

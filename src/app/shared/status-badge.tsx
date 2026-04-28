import type { ApplicationStatus } from "@/app/actions/application";

const statusStyles: Record<ApplicationStatus, string> = {
  unverified: "bg-[#2a2a2a] text-[#8f8d86]",
  pending: "bg-status-pending-bg text-status-pending-text",
  accepted: "bg-status-accepted-bg text-status-accepted-text",
  rejected: "bg-status-rejected-bg text-status-rejected-text",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

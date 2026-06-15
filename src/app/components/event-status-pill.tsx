import type { Event } from "@/app/queries/events";
import { SparkleFilledIcon, RadioFilledIcon, ClockFilledIcon } from "@/app/components/icons";

const config = {
  upcoming: {
    label: "Upcoming",
    className: "bg-status-live-bg text-status-live-text",
    Icon: SparkleFilledIcon,
  },
  current: {
    label: "Happening now",
    className: "bg-status-scheduled-bg text-status-scheduled-text",
    Icon: RadioFilledIcon,
  },
  past: {
    label: "Past",
    className: "bg-status-ended-bg text-status-ended-text",
    Icon: ClockFilledIcon,
  },
};

type Size = "sm" | "md" | "lg";

const sizeClasses: Record<Size, string> = {
  sm: "rounded-full px-2 py-0.5 text-xs font-medium",
  md: "rounded-full px-3 py-1 text-xs font-semibold",
  lg: "rounded-full px-3 py-1 text-sm font-semibold",
};

export function EventStatusPill({
  status,
  size = "md",
}: {
  status: Event["status"];
  size?: Size;
}) {
  const c = config[status];
  const Icon = c.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} ${c.className}`}
    >
      <Icon className="shrink-0" />
      {c.label}
    </span>
  );
}

import {
  RadioIcon,
  FileTextIcon,
  TimerIcon,
  FlagIcon,
} from "@/app/components/icons";

const config: Record<
  string,
  { label: string; icon: typeof RadioIcon; style: string }
> = {
  live: {
    label: "Live",
    icon: RadioIcon,
    style: "bg-status-live-bg text-status-live-text",
  },
  draft: {
    label: "Draft",
    icon: FileTextIcon,
    style: "bg-status-draft-bg text-status-draft-text",
  },
  scheduled: {
    label: "Scheduled",
    icon: TimerIcon,
    style: "bg-status-scheduled-bg text-status-scheduled-text",
  },
  ended: {
    label: "Ended",
    icon: FlagIcon,
    style: "bg-status-ended-bg text-status-ended-text",
  },
};

export function EventStatusBadge({ status }: { status: string }) {
  const c = config[status];
  if (!c) {
    return (
      <span className="inline-flex rounded-full bg-status-ended-bg px-2 py-0.5 text-xs font-medium text-status-ended-text">
        {status}
      </span>
    );
  }

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

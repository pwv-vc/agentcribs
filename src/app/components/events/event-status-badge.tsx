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
    style: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  draft: {
    label: "Draft",
    icon: FileTextIcon,
    style:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  scheduled: {
    label: "Scheduled",
    icon: TimerIcon,
    style: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  ended: {
    label: "Ended",
    icon: FlagIcon,
    style: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  },
};

export function EventStatusBadge({ status }: { status: string }) {
  const c = config[status];
  if (!c) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
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

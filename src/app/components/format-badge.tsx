import type { Event } from "@/app/queries/events";
import { HouseHeartIcon, WebcamIcon, ArrowBranchIcon } from "@/app/components/icons";

const config = {
  "in-person": {
    label: "In person",
    className: "bg-format-inperson-bg text-format-inperson-text",
    Icon: HouseHeartIcon,
  },
  remote: {
    label: "Remote",
    className: "bg-format-remote-bg text-format-remote-text",
    Icon: WebcamIcon,
  },
  hybrid: {
    label: "Hybrid",
    className: "bg-format-hybrid-bg text-format-hybrid-text",
    Icon: ArrowBranchIcon,
  },
};

type Size = "sm" | "md" | "lg";

const sizeClasses: Record<Size, string> = {
  sm: "rounded-full px-2 py-0.5 text-xs font-medium",
  md: "rounded-full px-3 py-1 text-xs font-semibold",
  lg: "rounded-full px-3 py-1 text-sm font-semibold",
};

export function FormatBadge({
  format,
  size = "md",
}: {
  format: Event["format"];
  size?: Size;
}) {
  const c = config[format];
  if (!c) return null;

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

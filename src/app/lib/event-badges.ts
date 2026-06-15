import type { Event } from "@/app/queries/events";

export function formatLabel(format: Event["format"]): string {
  switch (format) {
    case "in-person":
      return "In person";
    case "remote":
      return "Remote";
    case "hybrid":
      return "Hybrid";
    default:
      return "";
  }
}

export function formatColor(format: Event["format"]): string {
  switch (format) {
    case "in-person":
      return "bg-format-inperson-bg text-format-inperson-text";
    case "remote":
      return "bg-format-remote-bg text-format-remote-text";
    case "hybrid":
      return "bg-format-hybrid-bg text-format-hybrid-text";
    default:
      return "";
  }
}

export function statusLabel(status: Event["status"]): string {
  switch (status) {
    case "upcoming":
      return "Upcoming";
    case "current":
      return "Happening now";
    case "past":
      return "Past";
  }
}

export function statusColor(status: Event["status"]): string {
  switch (status) {
    case "upcoming":
      return "bg-status-live-bg text-status-live-text";
    case "current":
      return "bg-status-scheduled-bg text-status-scheduled-text";
    case "past":
      return "bg-status-ended-bg text-status-ended-text";
  }
}

export { FormatBadge } from "@/app/components/format-badge";
export { EventStatusPill } from "@/app/components/event-status-pill";

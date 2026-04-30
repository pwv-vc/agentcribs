export function formatDateShort(iso?: string, timezone?: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: timezone ?? undefined,
  });
}

export function formatTime(iso?: string, timezone?: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone ?? undefined,
    timeZoneName: "short",
  });
}

export function parseDuration(duration_interval?: string): string | null {
  if (!duration_interval) return null;
  const match = duration_interval.match(
    /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/,
  );
  if (!match) return null;
  const [, , , days, hours, minutes] = match.map(Number);
  const parts: string[] = [];
  if (days) parts.push(days + "d");
  if (hours) parts.push(hours + "h");
  if (minutes) parts.push(minutes + "m");
  return parts.length ? parts.join(" ") : null;
}

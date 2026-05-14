import { linkFor } from "rwsdk/router";
import type { App } from "rwsdk/worker";

export const link = linkFor<App>();

// Build a link with optional query params appended.
// Query values are automatically URI-encoded.
export function linkWithQuery(
  path: string,
  params?: Record<string, string | undefined>,
  query?: Record<string, string | undefined>,
): string {
  const base = link(path as any, params as any);
  if (!query) return base;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      searchParams.set(key, value);
    }
  }
  const qs = searchParams.toString();
  return qs ? `${base}?${qs}` : base;
}

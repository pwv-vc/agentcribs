import { env } from "cloudflare:workers";

const BASE_URL = "https://public-api.luma.com/v1";
const PER_PAGE = 30;
const CACHE_TTL_SECONDS = 300; // 5 minutes
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

export interface GeoAddressJson {
  address: string;
  city: string;
  region: string;
  country: string;
  city_state: string;
  full_address: string;
  google_maps_place_id?: string;
  apple_maps_place_id?: string;
  description?: string;
}

export interface LumaEvent {
  api_id: string;
  name: string;
  description?: string;
  description_mirror?: string;
  cover_url?: string;
  url?: string;
  start_at?: string;
  end_at?: string;
  timezone?: string;
  duration_interval?: string;
  location_type?: "in-person" | "online" | "hybrid";
  geo_address_info?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  geo_address_json?: GeoAddressJson;
  event_type?: "multi_session" | "single_session";
  num_past_sessions?: number;
  num_upcoming_sessions?: number;
  ticket_count?: number;
  ticket_limit?: number;
  status?: "live" | "draft" | "scheduled" | "ended";
  user_can_see_detail?: boolean;
  hide_rsvp_until_end?: boolean;
  hide_rsvp_until_start?: boolean;
  social_tracking?: Record<string, unknown>;
}

export interface Host {
  api_id: string;
  name: string;
  username: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
}

export interface GetEventResponse {
  event: LumaEvent;
  hosts: Host[];
}

export interface CalendarListEventsEntry {
  event: LumaEvent;
  hosts?: Host[];
}

export type GuestApprovalStatus =
  | "approved"
  | "session"
  | "pending_approval"
  | "invited"
  | "declined"
  | "waitlist";

export interface LumaGuest {
  api_id: string;
  name: string;
  email: string;
  user_first_name?: string;
  user_last_name?: string;
  approval_status: GuestApprovalStatus;
  registered_at?: string;
  checked_in_at?: string | null;
  event_ticket?: {
    api_id?: string;
    name?: string;
    amount?: number;
    currency?: string;
    checked_in_at?: string | null;
  };
  event_tickets?: Array<{
    api_id?: string;
    name?: string;
    amount?: number;
    currency?: string;
    checked_in_at?: string | null;
  }>;
  check_in_qr_code?: string;
}

export interface GetGuestsParams {
  pagination_cursor?: string;
  pagination_limit?: number;
  approval_status?: GuestApprovalStatus;
  sort_column?: "name" | "email" | "created_at" | "registered_at" | "checked_in_at";
  sort_direction?: "asc" | "desc" | "asc nulls last" | "desc nulls last";
}

export interface GetGuestsResponse {
  entries: LumaGuest[];
  has_more: boolean;
  next_cursor?: string;
}

export interface CalendarListEventsResponse {
  entries: CalendarListEventsEntry[];
  has_more: boolean;
  next_cursor?: string;
}

class LumaApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "LumaApiError";
    this.status = status;
  }
}

export interface ListEventsParams {
  after?: string;
  sort_column?: "start_at" | "created_at";
  sort_direction?: "asc" | "desc";
  limit?: number;
}

export interface LumaClient {
  getEvent(id: string): Promise<GetEventResponse>;
  getGuests(eventId: string, params?: GetGuestsParams): Promise<GetGuestsResponse>;
  listEvents(params?: ListEventsParams): Promise<CalendarListEventsResponse>;
}

function getCacheKey(type: string, params: Record<string, string | undefined>): string {
  const sortedParams = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return `luma:${type}:${sortedParams}`;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getLumaClient(): LumaClient {
  const apiKey = env.LUMA_API_SECRET;
  if (!apiKey) {
    throw new Error("LUMA_API_SECRET environment variable is not set");
  }

  async function requestWithRetry<T>(
    path: string,
    params?: Record<string, string>,
    attempt = 1,
  ): Promise<T> {
    const url = new URL(path, BASE_URL);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, value);
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        accept: "application/json",
        "x-luma-api-key": apiKey,
      },
    });

    // Handle rate limiting with exponential backoff
    if (response.status === 429) {
      if (attempt >= MAX_RETRIES) {
        throw new LumaApiError(
          "Luma API rate limit exceeded after " + MAX_RETRIES + " retries",
          429,
        );
      }
      const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
      await sleep(backoffMs);
      return requestWithRetry<T>(path, params, attempt + 1);
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new LumaApiError(
        "Luma API error: " + response.status + (body ? " - " + body : ""),
        response.status,
      );
    }

    return response.json() as Promise<T>;
  }

  async function getCached<T>(
    cacheKey: string,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    // Try to get from cache first
    try {
      const cached = await env.AGENTCRIBS_KV.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as T;
      }
    } catch {
      // Cache miss or error, continue to fetch
    }

    // Fetch from API
    const data = await fetcher();

    // Store in cache
    try {
      await env.AGENTCRIBS_KV.put(cacheKey, JSON.stringify(data), {
        expirationTtl: CACHE_TTL_SECONDS,
      });
    } catch {
      // Cache write failure is non-fatal
    }

    return data;
  }

  return {
    async getEvent(id: string): Promise<GetEventResponse> {
      const cacheKey = getCacheKey("event", { id });
      return getCached(cacheKey, () =>
        requestWithRetry<GetEventResponse>("/v1/event/get", { id }),
      );
    },

    async getGuests(
      eventId: string,
      params?: GetGuestsParams,
    ): Promise<GetGuestsResponse> {
      // Guest lists change frequently, don't cache
      return requestWithRetry<GetGuestsResponse>("/v1/event/get-guests", {
        event_id: eventId,
        ...(params?.pagination_cursor && { pagination_cursor: params.pagination_cursor }),
        ...(params?.pagination_limit && { pagination_limit: String(params.pagination_limit) }),
        ...(params?.approval_status && { approval_status: params.approval_status }),
        ...(params?.sort_column && { sort_column: params.sort_column }),
        ...(params?.sort_direction && { sort_direction: params.sort_direction }),
      });
    },

    async listEvents(
      params?: ListEventsParams,
    ): Promise<CalendarListEventsResponse> {
      const cacheKey = getCacheKey("events", {
        after: params?.after,
        sort_column: params?.sort_column,
        sort_direction: params?.sort_direction,
        limit: String(params?.limit ?? PER_PAGE),
      });
      return getCached(cacheKey, () =>
        requestWithRetry<CalendarListEventsResponse>("/v1/calendar/list-events", {
          ...params,
          limit: String(params?.limit ?? PER_PAGE),
        }),
      );
    },
  };
}

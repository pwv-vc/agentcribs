"use server";

import { serverQuery } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import type {
  ApplicationData,
  ApplicationStatus,
} from "@/app/actions/application";

const KV_PREFIX = "app:";
const CACHE_KEY = "dashboard:stats";
const CACHE_TTL = 3_600; // 1 hour

export interface DashboardStats {
  statusCounts: Record<ApplicationStatus, number>;
  total: number;
  topicCounts: { topic: string; count: number }[];
  locationCounts: { location: string; count: number }[];
  rawHowHeard: string[];
  rawStories: { id: string; story: string }[];
  asOf: string; // ISO timestamp when the stats were computed
}

function normalizeLocation(raw: string): string {
  let trimmed = raw.trim();

  trimmed = trimmed
    .replace(/,?\s*(CA|MA|NY|TX|WA|OR|IL|CO|FL|GA|PA|VA|NJ|NC|OH|MI|AZ|MN|MO|MD|WI|TN|IN|CT|UT|NV|KY|OK|KS|IA|AR|MS|NE|NM|WV|ID|HI|NH|ME|RI|MT|DE|SD|ND|AK|VT|WY|DC|AL|SC|LA)$/i, "")
    .replace(/,?\s*(USA|US|United States|Canada|UK|United Kingdom|Australia|Germany|France|Netherlands|Japan|Singapore|India|Brazil)\s*$/i, "")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const lower = trimmed.toLowerCase();

  const known: Record<string, string> = {
    sf: "San Francisco",
    "san francisco": "San Francisco",
    "san fran": "San Francisco",
    nyc: "New York City",
    "new york": "New York City",
    "new york city": "New York City",
    la: "Los Angeles",
    "los angeles": "Los Angeles",
    sd: "San Diego",
    "san diego": "San Diego",
    sjc: "San Jose",
    "san jose": "San Jose",
    "palo alto": "Palo Alto",
    "menlo park": "Menlo Park",
    "mountain view": "Mountain View",
    "santa clara": "Santa Clara",
    cupertino: "Cupertino",
    sunnyvale: "Sunnyvale",
    oakland: "Oakland",
    berkeley: "Berkeley",
    sacramento: "Sacramento",
    austin: "Austin",
    dallas: "Dallas",
    houston: "Houston",
    seattle: "Seattle",
    bellevue: "Bellevue",
    redmond: "Redmond",
    portland: "Portland",
    boston: "Boston",
    cambridge: "Cambridge",
    "moston ma": "Boston",
    moston: "Boston",
    chicago: "Chicago",
    denver: "Denver",
    boulder: "Boulder",
    miami: "Miami",
    atlanta: "Atlanta",
    "washington dc": "Washington DC",
    dc: "Washington DC",
    philadelphia: "Philadelphia",
    philly: "Philadelphia",
    phoenix: "Phoenix",
    "las vegas": "Las Vegas",
    vegas: "Las Vegas",
    "salt lake city": "Salt Lake City",
    slc: "Salt Lake City",
    minneapolis: "Minneapolis",
    detroit: "Detroit",
    nashville: "Nashville",
    charlotte: "Charlotte",
    raleigh: "Raleigh",
    durham: "Durham",
    "san antonio": "San Antonio",
    pittsburgh: "Pittsburgh",
    cincinnati: "Cincinnati",
    columbus: "Columbus",
    indianapolis: "Indianapolis",
    "kansas city": "Kansas City",
    "st louis": "St. Louis",
    baltimore: "Baltimore",
    orlando: "Orlando",
    tampa: "Tampa",
    london: "London",
    "london uk": "London",
    toronto: "Toronto",
    vancouver: "Vancouver",
    montreal: "Montreal",
    berlin: "Berlin",
    paris: "Paris",
    amsterdam: "Amsterdam",
    tokyo: "Tokyo",
    singapore: "Singapore",
    "singapore sg": "Singapore",
    sydney: "Sydney",
    melbourne: "Melbourne",
    bangalore: "Bangalore",
    bengaluru: "Bangalore",
    "bangalore in": "Bangalore",
    mumbai: "Mumbai",
    "new delhi": "New Delhi",
    delhi: "New Delhi",
    hyderabad: "Hyderabad",
    pune: "Pune",
    chennai: "Chennai",
    "sao paulo": "São Paulo",
    "buenos aires": "Buenos Aires",
    "mexico city": "Mexico City",
    remote: "Remote",
    "fully remote": "Remote",
    distributed: "Remote",
    "global / remote": "Remote",
  };

  if (known[lower]) return known[lower];

  return trimmed
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export const getDashboardStats = serverQuery(
  async (): Promise<DashboardStats> => {
    // Check cache first
    const cached = await env.AGENTCRIBS_KV.get(CACHE_KEY, "json");
    if (cached) {
      return cached as unknown as DashboardStats;
    }

    const allKeys: string[] = [];
    let cursor: string | undefined;

    do {
      const list = await env.AGENTCRIBS_KV.list({
        prefix: KV_PREFIX,
        cursor,
      });
      for (const key of list.keys) {
        allKeys.push(key.name);
      }
      cursor = list.list_complete ? undefined : list.cursor;
    } while (cursor);

    if (allKeys.length === 0) {
      const empty: DashboardStats = {
        statusCounts: { unverified: 0, pending: 0, accepted: 0, rejected: 0 },
        total: 0,
        topicCounts: [],
        locationCounts: [],
        rawHowHeard: [],
        rawStories: [],
        asOf: new Date().toISOString(),
      };
      await env.AGENTCRIBS_KV.put(CACHE_KEY, JSON.stringify(empty), {
        expirationTtl: CACHE_TTL,
      });
      return empty;
    }

    const results = await Promise.all(
      allKeys.map((key) => env.AGENTCRIBS_KV.get(key)),
    );

    const apps = results
      .filter((r): r is string => r !== null)
      .map((r) => JSON.parse(r) as ApplicationData);

    const statusCounts: Record<ApplicationStatus, number> = {
      unverified: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
    };
    for (const app of apps) {
      statusCounts[app.status]++;
    }

    const topicMap = new Map<string, number>();
    for (const app of apps) {
      for (const topic of app.topics || []) {
        topicMap.set(topic, (topicMap.get(topic) || 0) + 1);
      }
    }
    const topicCounts = Array.from(topicMap.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count);

    const locationMap = new Map<string, number>();
    for (const app of apps) {
      const location = app.location?.trim();
      if (location) {
        const normalized = normalizeLocation(location);
        locationMap.set(normalized, (locationMap.get(normalized) || 0) + 1);
      } else {
        locationMap.set("None", (locationMap.get("None") || 0) + 1);
      }
    }
    const locationCounts = Array.from(locationMap.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count);

    const rawHowHeard = apps
      .filter((a) => a.howHeard)
      .map((a) => a.howHeard!);

    const rawStories = apps
      .filter((a) => a.story && a.story.length > 20)
      .map((a) => ({ id: a.id, story: a.story! }));

    const result: DashboardStats = {
      statusCounts,
      total: apps.length,
      topicCounts,
      locationCounts,
      rawHowHeard,
      rawStories,
      asOf: new Date().toISOString(),
    };

    await env.AGENTCRIBS_KV.put(CACHE_KEY, JSON.stringify(result), {
      expirationTtl: CACHE_TTL,
    });

    return result;
  },
);

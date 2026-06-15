"use server";
import { serverQuery } from "rwsdk/worker";
import { allEvents } from "content-collections";

export type Event = (typeof allEvents)[number];
export type EventStatus = "upcoming" | "current" | "past";

export function findNextUpcomingEvent(): Event | null {
  const now = new Date();
  return (
    [...allEvents]
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ??
    null
  );
}

export const getEvents = serverQuery(async (): Promise<Event[]> => {
  return [...allEvents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
});

export const getEvent = serverQuery(async (id: string): Promise<Event | null> => {
  return allEvents.find((e) => e.id === id) ?? null;
});

export const getUpcomingEvents = serverQuery(async (): Promise<Event[]> => {
  const now = new Date();
  return [...allEvents]
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

export const getPastEvents = serverQuery(async (): Promise<Event[]> => {
  const now = new Date();
  return [...allEvents]
    .filter((e) => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

export const getFeaturedEvent = serverQuery(async (): Promise<Event | null> => {
  return allEvents.find((e) => e.isFeatured) ?? null;
});

export const getNextUpcomingEvent = serverQuery(
  async (): Promise<Event | null> => findNextUpcomingEvent(),
);

"use server";
import { serverQuery } from "rwsdk/worker";
import { allEvents } from "content-collections";

export type Event = (typeof allEvents)[number];

export const getEvents = serverQuery(async (): Promise<Event[]> => {
  return [...allEvents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
});

export const getEvent = serverQuery(async (id: string): Promise<Event | null> => {
  return allEvents.find((e) => e.id === id) ?? null;
});

export const getUpcomingEvents = serverQuery(async (): Promise<Event[]> => {
  return [...allEvents]
    .filter((e) => e.status === "upcoming" || e.status === "current")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

export const getPastEvents = serverQuery(async (): Promise<Event[]> => {
  return [...allEvents]
    .filter((e) => e.status === "past")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

export const getFeaturedEvent = serverQuery(async (): Promise<Event | null> => {
  return allEvents.find((e) => e.isFeatured) ?? null;
});

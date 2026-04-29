"use server";

import { serverQuery } from "rwsdk/worker";
import { allTopics } from "content-collections";

export type Topic = (typeof allTopics)[number];

export const getTopics = serverQuery(
  async (): Promise<Topic[]> => {
    return [...allTopics].sort((a, b) => a.label.localeCompare(b.label));
  },
);

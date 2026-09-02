"use server";
import { serverQuery } from "rwsdk/worker";
import { allFaqs } from "content-collections";

export type Faq = (typeof allFaqs)[number];

export const getFaqs = serverQuery(async (): Promise<Faq[]> => {
  return [...allFaqs].sort((a, b) => a.order - b.order);
});

"use server";

import { serverAction } from "rwsdk/worker";
import {
  analyzeHowHeard as analyzeHowHeardAi,
  analyzeStoryThemes as analyzeStoryThemesAi,
} from "@/app/lib/ai";

export const analyzeHowHeard = serverAction(
  async (entries: string[]) => {
    return await analyzeHowHeardAi(entries);
  },
);

export const analyzeStoryThemes = serverAction(
  async (stories: { story: string }[]) => {
    return await analyzeStoryThemesAi(stories);
  },
);

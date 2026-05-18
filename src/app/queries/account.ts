"use server";

import { serverQuery } from "rwsdk/worker";
import { db } from "@/db/db";
import { accounts, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const listAccounts = serverQuery(async () => {
  const rows = await db
    .select()
    .from(accounts)
    .leftJoin(profiles, eq(accounts.id, profiles.account_id))
    .orderBy(accounts.created_at);

  return rows.map((r) => ({
    account: r.accounts,
    profile: r.profiles,
  }));
});

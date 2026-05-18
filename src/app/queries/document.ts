"use server";

import { serverQuery } from "rwsdk/worker";
import { db } from "@/db/db";
import { documents } from "@/db/schema";
import { and, eq } from "drizzle-orm";

// Returns the document only if it belongs to the given account.
// Ownership is enforced at the query level — the caller must provide the
// authenticated accountId. Returns null for missing docs or wrong owner.
export const getDocument = serverQuery(
  async (documentId: string, accountId: string) => {
    const [doc] = await db
      .select()
      .from(documents)
      .where(
        and(eq(documents.id, documentId), eq(documents.account_id, accountId)),
      )
      .limit(1);

    return doc ?? null;
  },
);

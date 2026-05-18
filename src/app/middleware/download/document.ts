import type { RouteMiddleware } from "rwsdk/router";
import { env } from "cloudflare:workers";
import { db } from "@/db/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Handles document download at /my/documents/:id/download.
 * Reads accountId from session (set by accountSessionMiddleware)
 * and enforces ownership — only the owning account can download.
 */
export const handleDocumentDownload: RouteMiddleware = async ({
  ctx,
  params,
}) => {
  const documentId = params.id;
  const accountId = ctx.session?.accountId;

  if (!accountId) {
    return new Response(null, { status: 401 });
  }

  const [doc] = await db
    .select({
      id: documents.id,
      account_id: documents.account_id,
      filename: documents.filename,
      content_type: documents.content_type,
      r2_key: documents.r2_key,
    })
    .from(documents)
    .where(eq(documents.id, documentId))
    .limit(1);

  if (!doc) {
    return new Response(null, { status: 404 });
  }

  // Enforce ownership: only the document's owning account can download
  if (doc.account_id !== accountId) {
    return new Response(null, { status: 403 });
  }

  const object = await env.AGENTCRIBS_R2.get(doc.r2_key);
  if (!object) {
    return new Response(null, { status: 404 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Disposition",
    `attachment; filename="${doc.filename}"`,
  );
  if (doc.content_type) {
    headers.set("Content-Type", doc.content_type);
  }
  if (object.size) {
    headers.set("Content-Length", object.size.toString());
  }

  return new Response(object.body, { headers });
};

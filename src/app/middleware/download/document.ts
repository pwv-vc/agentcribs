import type { RouteMiddleware } from "rwsdk/router";
import { env } from "cloudflare:workers";
import { db } from "@/db/db";
import { accounts, documents } from "@/db/schema";
import { eq } from "drizzle-orm";

export const handleDocumentDownload: RouteMiddleware = async ({
  ctx,
  params,
}) => {
  const documentId = params.id;
  const email = ctx.session?.email;

  if (!email) {
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

  const [account] = await db
    .select({ id: accounts.id })
    .from(accounts)
    .where(eq(accounts.email, email))
    .limit(1);

  if (!account || doc.account_id !== account.id) {
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

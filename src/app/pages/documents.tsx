import { db } from "@/db/db";
import { documents } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Seo } from "@/app/components/seo";
import { linkWithQuery } from "@/app/shared/links";

const typeLabels: Record<string, string> = {
  application: "Application",
  dossier: "Dossier",
  matches: "Matches",
  cards: "Cards",
};

export const DocumentsPage = async ({ ctx }: { ctx: { session?: { email?: string; accountId?: string } } }) => {
  const accountId = ctx.session?.accountId;

  if (!accountId) {
    return (
      <main className="mx-auto max-w-[720px] px-6 py-16 sm:px-8 sm:py-24">
        <p className="text-text-secondary">No account found.</p>
      </main>
    );
  }

  const docs = await db
    .select()
    .from(documents)
    .where(eq(documents.account_id, accountId))
    .orderBy(desc(documents.created_at));

  // Preserve dev impersonation param on view links
  const viewHref = (docId: string) =>
    linkWithQuery(
      "/my/documents/:id",
      { id: docId },
      import.meta.env.DEV && ctx.session?.email ? { as: ctx.session.email } : undefined,
    );

  return (
    <>
      <Seo
        title="Your Documents"
        description="Manage your uploaded documents."
      />
      <main className="mx-auto max-w-[720px] px-6 py-16 sm:px-8 sm:py-24">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Your Documents
        </h1>

        <div className="mt-12">
          {docs.length === 0 ? (
            <p className="text-sm text-text-secondary">No documents uploaded yet.</p>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left text-text-secondary font-medium">Type</th>
                    <th className="px-4 py-3 text-left text-text-secondary font-medium">Filename</th>
                    <th className="px-4 py-3 text-left text-text-secondary font-medium">Size</th>
                    <th className="px-4 py-3 text-left text-text-secondary font-medium">Uploaded</th>
                    <th className="px-4 py-3 text-left text-text-secondary font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc) => (
                    <tr key={doc.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-surface-secondary px-2 py-0.5 text-xs font-medium text-text-secondary">
                          {typeLabels[doc.document_type] ?? doc.document_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text">{doc.filename}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {doc.size_bytes ? `${(doc.size_bytes / 1_024).toFixed(1)} KB` : "—"}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={viewHref(doc.id)}
                          className="text-xs font-medium text-accent no-underline hover:text-accent-hover"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

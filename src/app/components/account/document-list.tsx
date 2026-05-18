import { db } from "@/db/db";
import { documents } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { linkWithQuery } from "@/app/shared/links";
import { FileTextIcon } from "@/app/components/icons";
import { FileStackIcon } from "@/app/components/icons";
import { HandshakeIcon } from "@/app/components/icons";
import { CardsIcon } from "@/app/components/icons";

const typeMeta: Record<string, { label: string; Icon: typeof FileTextIcon }> = {
  application: { label: "Application", Icon: FileTextIcon },
  dossier: { label: "Dossier", Icon: FileStackIcon },
  matches: { label: "Matches", Icon: HandshakeIcon },
  cards: { label: "Cards", Icon: CardsIcon },
};

export async function DocumentList({
  accountId,
  devEmail,
}: {
  accountId: string;
  devEmail?: string;
}) {
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
      devEmail ? { as: devEmail } : undefined,
    );

  if (docs.length === 0) {
    return (
      <p className="text-sm text-text-secondary">No documents uploaded yet.</p>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-surface-secondary">
          <tr>
            <th className="px-4 py-3 text-left text-text-secondary font-medium">Type</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => {
            const meta = typeMeta[doc.document_type] ?? {
              label: doc.document_type,
              Icon: FileTextIcon,
            };
            return (
              <tr key={doc.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-secondary px-2 py-0.5 text-xs font-medium text-text-secondary">
                    <meta.Icon className="size-3" />
                    {meta.label}
                  </span>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import { marked } from "marked";
import { env } from "cloudflare:workers";
import { Seo } from "@/app/components/seo";
import { link, linkWithQuery } from "@/app/shared/links";
import { FileTextIcon } from "@/app/components/icons";
import { FileStackIcon } from "@/app/components/icons";
import { HandshakeIcon } from "@/app/components/icons";
import { CardsIcon } from "@/app/components/icons";
import { getDocument } from "@/app/queries/document";

// Document type → label + icon for the detail page badge
const typeMeta: Record<string, { label: string; Icon: typeof FileTextIcon }> = {
  application: { label: "Application", Icon: FileTextIcon },
  dossier: { label: "Dossier", Icon: FileStackIcon },
  matches: { label: "Matches", Icon: HandshakeIcon },
  cards: { label: "Cards", Icon: CardsIcon },
};

export const DocumentDetailPage = async ({
  id,
  ctx,
}: {
  id: string;
  ctx: { session?: { email?: string; accountId?: string } };
}) => {
  const accountId = ctx.session?.accountId;

  if (!accountId) {
    return (
      <main className="mx-auto max-w-[720px] px-6 py-16 sm:px-8 sm:py-24">
        <p className="text-text-secondary">No account found.</p>
      </main>
    );
  }

  // Ownership enforced at the query level — only returns doc if it belongs to this account
  const doc = await getDocument(id, accountId);

  if (!doc) {
    return (
      <main className="mx-auto max-w-[720px] px-6 py-16 sm:px-8 sm:py-24">
        <p className="text-text-secondary">Document not found.</p>
      </main>
    );
  }

  let content: string | null = null;
  let renderError: string | null = null;

  try {
    const object = await env.AGENTCRIBS_R2.get(doc.r2_key);
    if (object) {
      content = await object.text();
    }
  } catch {
    renderError = "Could not load document content.";
  }

  const meta = typeMeta[doc.document_type] ?? {
    label: doc.document_type,
    Icon: FileTextIcon,
  };
  // Preserve dev impersonation param on download links so the download
  // middleware (which uses cloudflareSessionMiddleware) can authenticate.
  const devQuery = import.meta.env.DEV && ctx.session?.email
    ? { as: ctx.session.email }
    : undefined;
  const downloadHref = linkWithQuery(
    "/documents/:id/download",
    { id: doc.id },
    devQuery,
  );

  return (
    <>
      <Seo
        title={`${doc.filename} — Documents`}
        description={`View ${doc.filename}`}
      />
      <main className="mx-auto max-w-[720px] px-6 py-16 sm:px-8 sm:py-24">
        <a
          href={link("/documents")}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary no-underline hover:text-text mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Documents
        </a>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-secondary px-2 py-0.5 text-xs font-medium text-text-secondary">
                <meta.Icon className="size-3" />
                {meta.label}
              </span>
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl break-all">
              {doc.filename}
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              {doc.size_bytes
                ? `${(doc.size_bytes / 1_024).toFixed(1)} KB`
                : "Unknown size"}
              {" · "}
              {doc.created_at
                ? new Date(doc.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Unknown date"}
            </p>
          </div>
          <a
            href={downloadHref}
            className="shrink-0 rounded-md border border-border bg-bg px-4 py-2 text-sm font-medium text-text no-underline transition-colors hover:bg-bg-muted"
            download
          >
            Download
          </a>
        </div>

        <div className="rounded-xl border border-border bg-bg p-6">
          {renderError ? (
            <p className="text-sm text-text-secondary">{renderError}</p>
          ) : !content ? (
            <p className="text-sm text-text-secondary">No content to display.</p>
          ) : doc.content_type === "text/markdown" ? (
            <div
              className="prose dark:prose-invert max-w-none prose-sm"
              dangerouslySetInnerHTML={{
                __html: marked.parse(content, { async: false }),
              }}
            />
          ) : doc.content_type === "application/json" ? (
            <pre className="text-sm font-mono text-text overflow-auto whitespace-pre-wrap">
              {(() => {
                try {
                  return JSON.stringify(JSON.parse(content), null, 2);
                } catch {
                  return content;
                }
              })()}
            </pre>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-text-secondary mb-4">
                Preview not available for this file type.
              </p>
              <a
                href={downloadHref}
                className="rounded-md border border-border bg-bg px-4 py-2 text-sm font-medium text-text no-underline transition-colors hover:bg-bg-muted"
                download
              >
                Download to view
              </a>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

import { env } from "cloudflare:workers";
import { db } from "@/db/db";
import { documents } from "@/db/schema";

// Maps R2 directory prefixes to document_type values.
// Files must be named with the application ULID as the prefix (first 26 chars).
// Example: dossiers/01KQHZRVWCE7P1S4T70Z1Z8XE2__Name.md
export const R2_DOCUMENT_DIRECTORIES = [
  { prefix: "applications/", documentType: "application" },
  { prefix: "dossiers/", documentType: "dossier" },
  { prefix: "matches/", documentType: "matches" },
  { prefix: "cards/", documentType: "cards" },
] as const;

export function inferContentType(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  const map: Record<string, string> = {
    ".md": "text/markdown",
    ".json": "application/json",
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".csv": "text/csv",
  };
  return map[ext] ?? "application/octet-stream";
}

// Scans R2 directories for files matching the given application ULID
// and inserts document rows linked to the account. Called during backfill.
// Idempotent — onConflictDoNothing skips files already imported.
export async function scanAndImportDirectoryDocs(
  applicationId: string,
  accountId: string,
) {
  for (const dir of R2_DOCUMENT_DIRECTORIES) {
    // R2 list prefix matches all files starting with "{dir.prefix}{applicationId}"
    const listed = await env.AGENTCRIBS_R2.list({
      prefix: `${dir.prefix}${applicationId}`,
    });
    if (listed.objects.length === 0) continue;

    const docRows = listed.objects.map((obj) => ({
      account_id: accountId,
      application_id: applicationId,
      document_type: dir.documentType,
      filename: obj.key.split("/").pop()!,
      content_type:
        obj.httpMetadata?.contentType ?? inferContentType(obj.key),
      size_bytes: obj.size,
      r2_key: obj.key,
    }));

    // Skip duplicates via the unique index on (account_id, document_type, filename)
    await db.insert(documents).values(docRows).onConflictDoNothing();
  }
}

import { queryApplications } from "@/app/queries/application";
import { CtaButton } from "@/app/shared/cta-button";
import { ApplicationsTable } from "@/app/shared/applications-table";
import { Seo } from "@/app/components/seo";
import type { ApplicationStatus } from "@/app/actions/application";

export const AdminApplications = async ({
  request,
}: {
  request?: Request;
}) => {
  const url = request ? new URL(request.url) : new URL("http://localhost");

  const activeStatus = url.searchParams.get("status") ?? undefined;
  const sort = url.searchParams.get("sort") === "asc" ? "asc" : "desc";
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);

  const { items, total, totalPages } = await queryApplications({
    status: activeStatus as ApplicationStatus | undefined,
    sort,
    page,
  });

  const statuses = [
    { value: "", label: "All" },
    { value: "unverified", label: "Unverified" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
  ] as const;

  const buildHref = (overrides: Record<string, string>) => {
    const p = new URLSearchParams(url.searchParams);
    for (const [k, v] of Object.entries(overrides)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    return `?${p.toString()}`;
  };

  return (
    <>
      <Seo title="Applications | Admin | AgentCribs" description="AgentCribs applications admin panel." noIndex />
      <main className="mx-auto max-w-[1200px] px-6 py-16 sm:px-8 sm:py-20">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Applications
        </h1>
        <CtaButton href="/" label="&larr; Site" />
      </div>

      {/* Filter pills */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {statuses.map((s) => {
          const isActive = activeStatus === s.value || (!activeStatus && !s.value);
          return (
            <a
              key={s.value}
              href={s.value === activeStatus ? buildHref({ status: "" }) : buildHref({ status: s.value, page: "1" })}
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium no-underline transition-colors ${
                isActive
                  ? "bg-accent text-accent-text"
                  : "bg-bg-soft text-text-secondary hover:bg-bg-muted hover:text-text"
              }`}
            >
              {s.label}
            </a>
          );
        })}
      </div>

      {/* Sort toggle + count */}
      <div className="mt-4 flex items-center gap-4 text-sm text-text-secondary">
        <a
          href={
            sort === "desc"
              ? buildHref({ sort: "asc" })
              : buildHref({ sort: "" })
          }
          className="inline-flex items-center gap-1 text-text-secondary no-underline hover:text-text"
        >
          {sort === "desc" ? "\u2193" : "\u2191"}{" "}
          {sort === "desc" ? "Newest first" : "Oldest first"}
        </a>
        <span>{total} total</span>
      </div>

      {items.length === 0 ? (
        <p className="mt-12 text-center text-text-secondary">
          No applications{activeStatus ? ` with status "${activeStatus}"` : ""}.
        </p>
      ) : (
        <div className="mt-4">
          <ApplicationsTable items={items} />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {page > 1 ? (
            <a
              href={buildHref({ page: String(page - 1) })}
              className="rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text no-underline transition-colors hover:bg-bg-muted"
            >
              &larr; Previous
            </a>
          ) : (
            <span className="rounded-lg border border-transparent px-3 py-1.5 text-sm text-text-secondary opacity-40">
              &larr; Previous
            </span>
          )}
          <span className="px-2 text-sm text-text-secondary">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <a
              href={buildHref({ page: String(page + 1) })}
              className="rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text no-underline transition-colors hover:bg-bg-muted"
            >
              Next &rarr;
            </a>
          ) : (
            <span className="rounded-lg border border-transparent px-3 py-1.5 text-sm text-text-secondary opacity-40">
              Next &rarr;
            </span>
          )}
        </div>
      )}
    </main>
    </>
  );
};

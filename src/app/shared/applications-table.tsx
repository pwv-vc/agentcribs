import type { ApplicationData } from "@/app/actions/application";
import { StatusBadge } from "@/app/shared/status-badge";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function ApplicationsTable({ items }: { items: ApplicationData[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-bg-soft">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Name</th>
            <th className="px-6 py-4 font-semibold">Email</th>
            <th className="px-6 py-4 font-semibold">Submitted</th>
          </tr>
        </thead>
        {items.map((app, idx) => {
          const rowBg = idx % 2 === 0 ? "bg-bg" : "bg-bg-soft";
          return (
            <tbody
              key={app.id}
              className={`${rowBg} transition-colors hover:bg-bg-muted/50`}
            >
              <tr>
                {/* Status — rowspan 2 */}
                <td rowSpan={2} className="px-6 py-5 align-middle">
                  <StatusBadge status={app.status} />
                </td>
                {/* Name — top row */}
                <td className="px-6 pt-5">
                  <a
                    href={`/admin/applications/${app.id}`}
                    className="font-medium text-text no-underline underline-offset-2 transition-colors hover:text-accent hover:underline"
                  >
                    {app.firstName} {app.lastName}
                  </a>
                  {app.githubHandle && (
                    <a
                      href={`https://github.com/${app.githubHandle}`}
                      className="ml-2 text-accent no-underline hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{app.githubHandle}
                    </a>
                  )}
                </td>
                {/* Email — top row */}
                <td className="px-6 pt-5 text-text-secondary">{app.email}</td>
                {/* Submitted — top row */}
                <td className="whitespace-nowrap px-6 pt-5 text-text-secondary">
                  {formatDate(app.createdAt)}
                  {app.editedAt && (
                    <span className="ml-1 text-xs opacity-60">(edited)</span>
                  )}
                </td>
              </tr>
              <tr>
                {/* Secondary info spans across name, email, submitted columns */}
                <td
                  colSpan={3}
                  className="px-6 pb-5 text-xs text-text-secondary"
                >
                  {app.organization && <span>{app.organization}</span>}
                  {app.organization && app.topics.length > 0 && (
                    <span className="mx-2">&middot;</span>
                  )}
                  {app.topics.length > 0 && (
                    <span className="max-w-[400px] truncate inline-block align-bottom">
                      {app.topics.join(", ")}
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
}

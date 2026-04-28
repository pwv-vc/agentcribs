import { listApplications } from "@/app/queries/application";
import { CtaButton } from "@/app/shared/cta-button";
import { StatusBadge } from "@/app/shared/status-badge";

export const AdminApplications = async () => {
  const applications = await listApplications();

  const formatTopics = (topics: string[]) => {
    if (topics.length === 0) return "\u2014";
    return topics.join(", ");
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-16 sm:px-8 sm:py-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">
            Applications
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {applications.length} application{applications.length !== 1 ? "s" : ""}{" "}
            received
          </p>
        </div>
        <CtaButton href="/" label="&larr; Site" />
      </div>

      {applications.length === 0 ? (
        <p className="mt-12 text-center text-text-secondary">
          No applications yet.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="hidden px-3 py-2 font-semibold sm:table-cell">
                  Organization
                </th>
                <th className="hidden px-3 py-2 font-semibold lg:table-cell">
                  Topics
                </th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Applied</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-border transition-colors hover:bg-bg-secondary"
                >
                  <td className="px-3 py-3">
                    <a
                      href={`/admin/applications/${app.id}`}
                      className="font-medium text-text no-underline underline-offset-2 transition-colors hover:text-accent hover:underline"
                    >
                      {app.firstName} {app.lastName}
                    </a>
                  </td>
                  <td className="px-3 py-3 text-text-secondary">
                    {app.email}
                  </td>
                  <td className="hidden px-3 py-3 text-text-secondary sm:table-cell">
                    {app.organization || "\u2014"}
                  </td>
                  <td className="hidden max-w-[300px] truncate px-3 py-3 text-text-secondary lg:table-cell">
                    {formatTopics(app.topics)}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-text-secondary">
                    {formatDate(app.createdAt)}
                    {app.editedAt && (
                      <span className="ml-1 text-xs opacity-60">(edited)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

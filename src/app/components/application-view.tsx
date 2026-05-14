import type { ApplicationData } from "@/app/actions/application";
import { StatusBadge } from "@/app/shared/status-badge";
import { ExternalLinkIcon } from "@/app/components/icons";

function parseApplicationData(content: string): ApplicationData | null {
  try {
    return JSON.parse(content) as ApplicationData;
  } catch {
    return null;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
      <dt className="w-32 shrink-0 text-xs sm:text-sm font-medium text-text-secondary">
        {label}
      </dt>
      <dd className="text-sm text-text">{children || "—"}</dd>
    </div>
  );
}

export function ApplicationView({ content }: { content: string }) {
  const app = parseApplicationData(content);

  if (!app) {
    return (
      <pre className="text-sm font-mono text-text overflow-auto whitespace-pre-wrap">
        {content}
      </pre>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-serif text-xl font-bold text-text">
            {app.firstName} {app.lastName}
          </h2>
          <StatusBadge status={app.status} />
        </div>

        <dl className="divide-y divide-border rounded-xl border border-border bg-bg-soft px-5">
          <FieldRow label="Email">{app.email}</FieldRow>

          {app.organization && (
            <FieldRow label="Organization">{app.organization}</FieldRow>
          )}

          {app.location && (
            <FieldRow label="Location">{app.location}</FieldRow>
          )}

          {app.howHeard && (
            <FieldRow label="How heard">{app.howHeard}</FieldRow>
          )}

          <FieldRow label="Topics">
            {app.topics.length > 0 ? app.topics.join(", ") : "—"}
          </FieldRow>

          {app.githubHandle && (
            <FieldRow label="GitHub">
              <div className="space-y-2">
                <a
                  href={`https://github.com/${app.githubHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:text-accent-hover no-underline"
                >
                  @{app.githubHandle}
                  <ExternalLinkIcon />
                </a>

                {app.githubEmailMismatch && (
                  <p className="text-xs text-text-secondary">
                    GitHub primary email does not match application email.
                  </p>
                )}

                {app.githubEmails && app.githubEmails.length > 0 && (
                  <p className="text-xs text-text-secondary">
                    GitHub emails:{" "}
                    {app.githubEmails
                      .map((e) => `${e.email}${e.primary ? " (primary)" : ""}${e.verified ? " ✓" : ""}`)
                      .join(", ")}
                  </p>
                )}

                {app.githubProfile && (
                  <div className="mt-2 space-y-1 text-sm text-text-secondary">
                    {app.githubProfile.name && (
                      <p>{app.githubProfile.name}</p>
                    )}
                    {app.githubProfile.company && (
                      <p>{app.githubProfile.company}</p>
                    )}
                    {app.githubProfile.location && (
                      <p>{app.githubProfile.location}</p>
                    )}
                    {app.githubProfile.bio && (
                      <p className="italic">{app.githubProfile.bio}</p>
                    )}
                    {app.githubProfile.blog && (
                      <a
                        href={
                          app.githubProfile.blog.startsWith("http")
                            ? app.githubProfile.blog
                            : `https://${app.githubProfile.blog}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent hover:text-accent-hover no-underline"
                      >
                        {app.githubProfile.blog}
                        <ExternalLinkIcon />
                      </a>
                    )}
                    {(app.githubProfile.public_repos !== undefined ||
                      app.githubProfile.followers !== undefined) && (
                      <p>
                        {app.githubProfile.public_repos !== undefined &&
                          `${app.githubProfile.public_repos} repos`}
                        {app.githubProfile.public_repos !== undefined &&
                          app.githubProfile.followers !== undefined &&
                          " · "}
                        {app.githubProfile.followers !== undefined &&
                          `${app.githubProfile.followers} followers`}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </FieldRow>
          )}
        </dl>
      </section>

      {app.story && (
        <section>
          <h3 className="label-text mb-3">Story</h3>
          <div className="rounded-xl border border-border bg-bg-soft p-5">
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-text-secondary">
              {app.story}
            </p>
          </div>
        </section>
      )}

      {app.summary && (
        <section>
          <h3 className="label-text mb-3">Summary</h3>
          <div className="rounded-xl border border-border bg-bg-soft p-5">
            <p className="text-sm leading-relaxed italic text-accent">
              {app.summary}
            </p>
          </div>
        </section>
      )}

      <section>
        <h3 className="label-text mb-3">Timeline</h3>
        <dl className="divide-y divide-border rounded-xl border border-border bg-bg-soft px-5">
          <FieldRow label="Applied">{formatDate(app.createdAt)}</FieldRow>

          {app.termsAcceptedAt && (
            <FieldRow label="Terms">{formatDate(app.termsAcceptedAt)}</FieldRow>
          )}

          {app.verifiedAt && (
            <FieldRow label="Verified">{formatDate(app.verifiedAt)}</FieldRow>
          )}

          {app.editedAt && (
            <FieldRow label="Edited">{formatDate(app.editedAt)}</FieldRow>
          )}

          {app.approvedAt && (
            <FieldRow label="Approved">{formatDate(app.approvedAt)}</FieldRow>
          )}

          {app.rejectedAt && (
            <FieldRow label="Rejected">{formatDate(app.rejectedAt)}</FieldRow>
          )}
        </dl>
      </section>

      <section className="border-t border-border pt-6">
        <p className="font-mono text-xs text-text-secondary">
          {app.id}
          {app.accountId && ` · account: ${app.accountId}`}
        </p>
      </section>
    </div>
  );
}

import { db } from "@/db/db";
import { accounts, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Seo } from "@/app/components/seo";
import { DocumentList } from "@/app/components/account/document-list";
import { gravatarUrl } from "@/app/lib/gravatar";

export const ProfilePage = async ({ ctx }: { ctx: { session?: { email?: string; accountId?: string; avatarUrl?: string }; devEmail?: string } }) => {
  const accountId = ctx.session?.accountId;

  if (!accountId) {
    return (
      <main className="mx-auto max-w-[720px] px-6 py-16 sm:px-8 sm:py-24">
        <p className="text-text-secondary">No account found.</p>
      </main>
    );
  }

  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, accountId))
    .limit(1);

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.account_id, accountId))
    .limit(1);

  const displayName =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : null;
  const avatar = ctx.session?.avatarUrl ?? (account?.email ? await gravatarUrl(account.email, 120) : null);

  return (
    <>
      <Seo
        title="Your Profile"
        description="Manage your AgentCribs profile."
      />
      <main className="mx-auto max-w-[720px] px-6 py-16 sm:px-8 sm:py-24">
        <div className="flex items-center gap-5">
          {avatar && (
            <img
              src={avatar}
              alt=""
              className="size-16 rounded-full border-2 border-border"
            />
          )}
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              {displayName ?? account?.email ?? "Your Profile"}
            </h1>
            {displayName && (
              <p className="mt-1 text-sm text-text-secondary">{account?.email}</p>
            )}
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-text mb-4">Account Details</h2>
            <div className="rounded-xl border border-border bg-surface-soft p-6">
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <dt className="text-text-secondary">Email</dt>
                  <dd className="text-text font-medium">{account?.email ?? "—"}</dd>
                </div>
                {profile?.first_name && (
                  <div className="flex justify-between items-center border-t border-border pt-4">
                    <dt className="text-text-secondary">Name</dt>
                    <dd className="text-text">{displayName}</dd>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-border pt-4">
                  <dt className="text-text-secondary">Member since</dt>
                  <dd className="text-text">
                    {account?.created_at
                      ? new Date(account.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </dd>
                </div>
                {profile?.github_handle && (
                  <div className="flex justify-between items-center border-t border-border pt-4">
                    <dt className="text-text-secondary">GitHub</dt>
                    <dd className="text-text">
                      <a
                        href={`https://github.com/${profile.github_handle}`}
                        className="text-accent no-underline hover:text-accent-hover"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @{profile.github_handle}
                      </a>
                    </dd>
                  </div>
                )}
                {profile?.bio && (
                  <div className="border-t border-border pt-4">
                    <dt className="text-text-secondary mb-1">Bio</dt>
                    <dd className="text-text">{profile.bio}</dd>
                  </div>
                )}
              </dl>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text mb-4">Documents</h2>
            <DocumentList accountId={accountId} devEmail={ctx.devEmail} />
          </section>
        </div>
      </main>
    </>
  );
};

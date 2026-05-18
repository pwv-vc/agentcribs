import { listAccounts } from "@/app/queries/account";
import { listApplications } from "@/app/queries/application";
import { Seo } from "@/app/components/seo";
import { BackfillButton } from "@/app/components/admin/backfill-button";
import { BackfillAllButton } from "@/app/components/admin/backfill-all-button";

export const AdminAccounts = async () => {
  const [accountsData, applications] = await Promise.all([
    listAccounts(),
    listApplications(),
  ]);

  const appsWithoutAccount = applications.filter(
    (a) => !a.accountId || !accountsData.find((d) => d.account.id === a.accountId),
  );

  return (
    <>
      <Seo title="Accounts — Admin" description="Manage applicant accounts." />
      <main className="mx-auto max-w-[1200px] px-6 py-12 sm:px-8">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
            Accounts
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-sm text-text-secondary">
              {accountsData.length} total
            </p>
            <BackfillAllButton />
          </div>
        </div>

        {appsWithoutAccount.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-text">
              Applications without accounts ({appsWithoutAccount.length})
            </h2>
            <div className="mt-3 rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left text-text-secondary font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-text-secondary font-medium">Email</th>
                    <th className="px-4 py-3 text-left text-text-secondary font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-text-secondary font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appsWithoutAccount.map((app) => (
                    <tr key={app.id} className="border-t border-border">
                      <td className="px-4 py-3 text-text">
                        {app.firstName} {app.lastName}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{app.email}</td>
                      <td className="px-4 py-3 text-text-secondary">{app.status}</td>
                      <td className="px-4 py-3">
                        <BackfillButton applicationId={app.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-text">All Accounts</h2>
          {accountsData.length === 0 ? (
            <p className="mt-3 text-sm text-text-secondary">No accounts yet.</p>
          ) : (
            <div className="mt-3 rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left text-text-secondary font-medium">Email</th>
                    <th className="px-4 py-3 text-left text-text-secondary font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-text-secondary font-medium">GitHub</th>
                    <th className="px-4 py-3 text-left text-text-secondary font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {accountsData.map(({ account, profile }) => {
                    const name =
                      profile?.first_name && profile?.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : null;
                    return (
                      <tr key={account.id} className="border-t border-border">
                        <td className="px-4 py-3 text-text">{account.email}</td>
                        <td className="px-4 py-3 text-text-secondary">
                          {name ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {profile?.github_handle ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {new Date(account.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export function AdminLayout({
  children,
  requestInfo,
}: {
  children?: React.ReactNode;
  requestInfo?: { ctx: { session?: { email: string; sub: string } } };
}) {
  const email = requestInfo?.ctx.session?.email;
  const isDev =
    import.meta.env.DEV || import.meta.env.VITE_IS_DEV_SERVER === "true";
  const displayEmailAddress = email || (isDev ? "User" : undefined);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-bg-muted">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-text-secondary">
              Admin
            </span>
            {displayEmailAddress && (
              <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                </svg>
                {displayEmailAddress}
              </span>
            )}
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="/admin/applications"
              className="text-sm font-medium text-text-secondary no-underline transition-colors hover:text-text"
            >
              Applications
            </a>
            <a
              href="/"
              className="rounded-md border border-border bg-bg px-3 py-1.5 text-xs font-medium text-text-secondary no-underline transition-colors hover:bg-bg-muted hover:text-text"
            >
              Back to site
            </a>
            {!isDev && (
              <a
                href="/cdn-cgi/access/logout"
                className="rounded-md border border-border bg-bg px-3 py-1.5 text-xs font-medium text-text-secondary no-underline transition-colors hover:bg-bg-muted hover:text-text"
              >
                Logout
              </a>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-bg-muted">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 sm:px-8">
          <p className="text-xs text-text-secondary">AgentCribs Admin</p>
          <p className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} PWV
          </p>
        </div>
      </footer>
    </div>
  );
}

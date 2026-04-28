export function AdminLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-bg-muted">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3 sm:px-8">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-text-secondary">
            Admin
          </span>
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
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-bg-muted">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 sm:px-8">
          <p className="text-xs text-text-secondary">
            AgentCribs Admin
          </p>
          <p className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} PWV
          </p>
        </div>
      </footer>
    </div>
  );
}

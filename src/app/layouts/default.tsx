import { CtaButton } from "@/app/shared/cta-button";

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4 sm:px-8">
          <a
            href="/"
            className="font-serif text-xl font-bold no-underline transition-opacity hover:opacity-70"
          >
            AgentCribs
          </a>
          <nav className="flex items-center gap-6">
            <a
              href="/"
              className="hidden text-sm font-medium text-text-secondary no-underline transition-colors hover:text-text sm:block"
            >
              About
            </a>
            <a
              href="/apply"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-accent-text no-underline transition-colors hover:bg-accent-hover"
            >
              Apply
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row sm:px-8">
          <p className="text-xs leading-relaxed text-text-secondary sm:text-sm">
            AgentCribs is a{" "}
            <a
              href="https://pwv.com"
              className="font-medium text-text underline underline-offset-2 transition-colors hover:text-accent"
            >
              PWV
            </a>{" "}
            community project.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:agentcribs@pwv.com"
              className="text-xs text-text-secondary no-underline underline-offset-2 transition-colors hover:text-text hover:underline sm:text-sm"
            >
              agentcribs@pwv.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

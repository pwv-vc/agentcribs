import { link } from "@/app/shared/links";
import { AccountMobileNav } from "@/app/components/account/mobile-nav";
import { DarkModeToggle } from "@/app/shared/dark-mode-toggle";

export function AccountLayout({
  children,
  requestInfo,
}: {
  children?: React.ReactNode;
  requestInfo?: {
    ctx: {
      session?: {
        email?: string;
        accountId?: string;
        avatarUrl?: string;
      };
    };
  };
}) {
  const email = requestInfo?.ctx.session?.email;
  const avatar = requestInfo?.ctx.session?.avatarUrl;
  const isDev =
    import.meta.env.DEV || import.meta.env.VITE_IS_DEV_SERVER === "true";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-bg">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 sm:px-8">
          <a
            href="/"
            className="group flex items-baseline gap-3 text-text no-underline"
          >
            <span className="text-lg font-black tracking-normal transition-colors group-hover:text-accent sm:text-xl">
              AgentCribs
            </span>
            <span className="hidden font-mono text-xs uppercase text-text-secondary sm:inline">
              by PWV
            </span>
          </a>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-5">
              <a
                href={link("/my/profile")}
                className="text-sm font-medium text-text-secondary no-underline transition-colors hover:text-text"
              >
                Profile
              </a>
              <a
                href="/"
                className="text-sm font-medium text-text-secondary no-underline transition-colors hover:text-text"
              >
                Back to site
              </a>
            </nav>

            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-border">
              {email ? (
                <a
                  href="/logout"
                  className="group flex items-center gap-2.5 no-underline"
                  title="Logout"
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt=""
                      className="size-7 rounded-full border border-border ring-2 ring-transparent transition-shadow group-hover:ring-accent/30"
                    />
                  ) : (
                    <span className="flex size-7 items-center justify-center rounded-full border border-border bg-bg-muted text-xs text-text-secondary">
                      {email.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="text-xs text-text-secondary group-hover:text-text">
                    {email}
                    {isDev && (
                      <span className="ml-1 font-mono text-[10px] text-accent">
                        dev
                      </span>
                    )}
                  </span>
                </a>
              ) : (
                <a
                  href="/login"
                  className="flex items-center gap-2 text-xs text-text-secondary no-underline hover:text-text"
                >
                  <span className="flex size-7 items-center justify-center rounded-full border border-border bg-bg-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                    </svg>
                  </span>
                  Sign in
                </a>
              )}
            </div>

            <DarkModeToggle />

            <AccountMobileNav email={email} avatarUrl={avatar} isDev={isDev} />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-bg-muted">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 sm:px-8">
          <p className="text-xs text-text-secondary">AgentCribs Account</p>
          <p className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} PWV
          </p>
        </div>
      </footer>
    </div>
  );
}

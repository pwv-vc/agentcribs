import { linkFor } from "rwsdk/router";
import type { App } from "rwsdk/worker";
import { DarkModeToggle } from "./dark-mode-toggle";

const link = linkFor<App>();

export function Header() {
  return (
    <header className="border-b border-border bg-bg">
      <div className="mx-auto flex max-w-[1040px] items-center justify-between px-6 py-5 sm:px-8">
        <a
          href="/"
          className="group flex items-baseline gap-3 text-text no-underline"
        >
          <span className="text-xl font-black tracking-normal transition-colors group-hover:text-accent sm:text-2xl">
            AgentCribs
          </span>
          <span className="hidden font-mono text-xs uppercase text-text-secondary sm:inline">
            by PWV
          </span>
        </a>
        <nav className="flex items-center gap-3">
          <a
            href={link("/login")}
            className="border border-border px-5 py-2 text-sm font-medium text-text-secondary no-underline transition-colors hover:border-text-secondary hover:text-text"
          >
            Login
          </a>
          <a
            href={link("/apply")}
            className="border border-brand-green bg-brand-green px-5 py-2 text-sm font-black text-accent-text no-underline transition-colors hover:border-brand-green-hover hover:bg-brand-green-hover"
          >
            Apply
          </a>
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}

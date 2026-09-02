import { linkFor } from "rwsdk/router";
import type { App } from "rwsdk/worker";
import { allPodcasts } from "content-collections";
import { DarkModeToggle } from "./dark-mode-toggle";
import { NavLink } from "@/app/components/links";
import { MicAudioLinesIcon, TicketCheckIcon } from "@/app/components/icons";

const link = linkFor<App>();

// "Podcasts" links straight to the featured show (AI Worth Using) rather than
// the index — with a single show, the detail page is the destination.
const featuredPodcast =
  allPodcasts.find((podcast) => podcast.isFeatured) ?? allPodcasts[0];

const podcastHref = featuredPodcast
  ? link("/podcasts/:id", { id: featuredPodcast.id })
  : link("/podcasts");

export function Header() {
  return (
    <header className="border-b border-border bg-bg">
      <div className="mx-auto flex max-w-[1040px] items-center justify-between px-6 py-5 sm:px-8">
        <a
          href="/"
          className="group flex items-baseline gap-3 text-text no-underline"
        >
          <span className="text-xl font-black tracking-normal transition-colors group-hover:text-brand-green sm:text-2xl">
            AgentCribs
          </span>
          <span className="hidden font-mono text-xs uppercase text-text-secondary sm:inline">
            by PWV
          </span>
        </a>
        <nav className="flex items-center gap-5">
          <NavLink
            href={podcastHref}
            className="flex items-center gap-1.5"
          >
            <MicAudioLinesIcon className="h-4 w-4" aria-hidden="true" />
            Podcasts
          </NavLink>
          <NavLink
            href={link("/community/events")}
            className="flex items-center gap-1.5"
          >
            <TicketCheckIcon className="h-4 w-4" aria-hidden="true" />
            Events
          </NavLink>
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

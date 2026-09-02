import { Fragment } from "react";
import { link } from "@/app/shared/links";
import type { Podcast } from "@/app/queries/podcasts";
import { MicAudioLinesIcon } from "@/app/components/icons";
import { PodcastLogo, PodcastTrailer } from "@/app/components/podcasts";
import { PodcastSubscribeLinks } from "@/app/components/podcasts/podcast-links";

export function PodcastSection({ podcast }: { podcast: Podcast | null }) {
  if (!podcast) return null;

  const hosts = podcast.hosts.map((host) => host.name).join(" and ");
  const trailerHost = podcast.hosts[0];
  const firstSeasonEpisodes = podcast.seasons[0]?.episodes ?? [];
  const seasonGuests = firstSeasonEpisodes.map((episode, i) => (
    <Fragment key={i}>
      {i > 0 ? ", " : null}
      <strong>{episode.guest.name}</strong> ({episode.title})
    </Fragment>
  ));

  return (
    <section className="border-b border-border bg-bg-deep text-pwv-white">
      <div className="mx-auto max-w-[1040px] px-6 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-pwv-green/40 bg-pwv-green/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-pwv-green">
              <MicAudioLinesIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Sponsored by {podcast.sponsor ?? "AgentCribs"}
            </span>
            <div className="mt-2 flex items-center gap-4">
              <PodcastLogo
                podcast={podcast}
                className="h-12 w-12 sm:h-14 sm:w-14"
              />
              <h2 className="text-4xl font-black leading-none sm:text-5xl">
                {podcast.name}
              </h2>
            </div>
            <p className="mt-5 text-xl font-black leading-tight text-pwv-green">
              {podcast.tagline}
            </p>
          </div>

          <div className="max-w-[680px]">
            <p className="text-lg leading-relaxed text-pwv-white/80">
              Leading AI developers come on to show what they are shipping and
              the open source tools behind it. Co-hosts{" "}
              <strong>{hosts}</strong> install the software with them and demo
              it live.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-pwv-white/60">
              Season{" "}
              {podcast.seasons.map((s) => s.number).join(", ")} features{" "}
              {seasonGuests}.
            </p>
            <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={podcast.links?.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-brand-green bg-brand-green px-6 py-3 text-base font-black text-accent-text no-underline transition-colors hover:border-brand-green-hover hover:bg-brand-green-hover sm:px-8 sm:py-4 sm:text-lg"
              >
                Subscribe
              </a>
              <span className="text-pwv-white/40" aria-hidden="true">
                |
              </span>
              <a
                href={link("/podcasts/:id", { id: podcast.id })}
                className="inline-block px-2 py-3 text-base font-bold text-pwv-white no-underline transition-colors hover:text-pwv-green"
              >
                Browse episodes
              </a>
            </p>
          </div>
        </div>

        {podcast.trailer && (
          <div className="mt-12 w-full">
            <PodcastTrailer
              videoId={podcast.trailer.videoId}
              label={podcast.trailer.label}
              intro={
                trailerHost && (
                  <>
                    <strong className="font-bold text-pwv-white">
                      {trailerHost.name}
                    </strong>{" "}
                    introduces the {podcast.name} podcast.
                  </>
                )
              }
            />
            <PodcastSubscribeLinks
              links={{
                ...podcast.trailer.links,
                youtube: podcast.links?.youtube,
              }}
              className="mt-6"
            />
          </div>
        )}
      </div>
    </section>
  );
}

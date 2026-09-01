import { link } from "@/app/shared/links";
import type { Podcast } from "@/app/queries/podcasts";
import { PodcastLogo, PodcastTrailer } from "@/app/components/podcasts";
import { PodcastSubscribeLinks } from "@/app/components/podcasts/podcast-links";

export function PodcastSection({ podcast }: { podcast: Podcast | null }) {
  if (!podcast) return null;

  const seasonNumbers = podcast.seasons.map((s) => s.number).join(", ");
  const firstSeasonGuests = podcast.seasons[0]?.episodes
    .map((e) => e.guest.name)
    .join(", ");

  return (
    <section className="border-b border-border bg-bg-deep text-pwv-white">
      <div className="mx-auto max-w-[1040px] px-6 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <div>
            <span className="font-sans text-sm font-extrabold uppercase tracking-widest text-pwv-green">
              Featured Podcast
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
              {podcast.description}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-pwv-white/60">
              {podcast.sponsor && <>Sponsored by {podcast.sponsor}. </>}
              Season {seasonNumbers} features {firstSeasonGuests}.
            </p>
            <p className="mt-6">
              <a
                href={link("/podcasts/:id", { id: podcast.id })}
                className="inline-block border border-brand-green bg-brand-green px-6 py-3 text-base font-black text-accent-text no-underline transition-colors hover:border-brand-green-hover hover:bg-brand-green-hover sm:px-8 sm:py-4 sm:text-lg"
              >
                Browse episodes
              </a>
              <span className="mx-2 text-pwv-white/40" aria-hidden="true">
                |
              </span>
              <a
                href={link("/podcasts")}
                className="inline-block px-2 py-3 text-base font-bold text-pwv-white no-underline transition-colors hover:text-pwv-green"
              >
                All podcasts
              </a>
            </p>
          </div>
        </div>

        {podcast.trailer && (
          <div className="mt-12 max-w-[820px] space-y-10">
            <PodcastTrailer
              videoId={podcast.trailer.videoId}
              label={podcast.trailer.label}
            />
            <PodcastSubscribeLinks
              links={podcast.trailer.links}
              className="mt-3"
              labels={{ youtube: podcast.trailer.label }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

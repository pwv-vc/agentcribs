import { link } from "@/app/shared/links";
import type {
  Podcast,
  PodcastEpisode,
  PodcastHost,
  PodcastSeason,
} from "@/app/queries/podcasts";
import { RadioFilledIcon } from "@/app/components/icons";
import { PodcastLinks } from "./podcast-links";

const STREAM_CUSTOMER = "customer-k7ms15mqb129fv5n";

function streamIframeSrc(videoId: string) {
  const poster = encodeURIComponent(
    `https://${STREAM_CUSTOMER}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg?time=0h0m03s&height=600`,
  );
  return `https://${STREAM_CUSTOMER}.cloudflarestream.com/${videoId}/iframe?poster=${poster}`;
}

export function PodcastTrailer({
  videoId,
  label,
  className = "",
}: {
  videoId: string;
  label?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-pwv-white/15">
        <iframe
          src={streamIframeSrc(videoId)}
          title={label ?? "Podcast trailer"}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </figure>
  );
}

export function PodcastEpisodeCard({
  episode,
}: {
  episode: PodcastEpisode;
}) {
  return (
    <article className="grid gap-6 border-t border-border py-9 sm:grid-cols-[160px_1fr] sm:gap-8">
      <img
        src={episode.image}
        alt={episode.imageAlt}
        width={360}
        height={360}
        loading="lazy"
        decoding="async"
        className="aspect-square w-40 rounded-lg object-cover sm:w-full"
      />
      <div>
        <p className="label-text text-xs">{episode.number}</p>
        <h4 className="mt-1 text-2xl font-black leading-tight">
          {episode.guest.name}
        </h4>
        <p className="mt-1 text-base font-bold leading-snug text-pwv-deep-green dark:text-pwv-green">
          {episode.title}
        </p>
        <PodcastLinks
          links={episode.guest.links}
          size="xs"
          className="mt-1.5"
        />
        <p className="mt-3 leading-relaxed text-text-secondary">
          {episode.description}
        </p>
        <PodcastLinks links={episode.links} size="sm" className="mt-4" />
      </div>
    </article>
  );
}

export function PodcastSeasonSection({
  season,
}: {
  season: PodcastSeason;
}) {
  const label = season.title ?? `Season ${season.number}`;

  return (
    <section className="mt-14 first:mt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-2xl font-black leading-tight sm:text-3xl">{label}</h3>
        <span className="text-sm font-medium text-text-secondary">
          {season.episodes.length} episode{season.episodes.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="mt-4">
        {season.episodes.map((episode) => (
          <PodcastEpisodeCard key={episode.number} episode={episode} />
        ))}
      </div>
    </section>
  );
}

export function PodcastHostCard({ host }: { host: PodcastHost }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-pwv-white/10 bg-bg-deep">
      <img
        src={host.image}
        alt={host.imageAlt}
        width={1600}
        height={1329}
        loading="lazy"
        decoding="async"
        className="aspect-[4/3] w-full object-cover object-top"
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-black leading-tight text-pwv-white">
          {host.name}
        </h3>
        <p className="mt-1 text-sm font-bold text-pwv-green">{host.role}</p>
        <p className="mt-3 text-sm leading-relaxed text-pwv-white/75">
          {host.bio}
        </p>
        {host.links && (
          <PodcastLinks
            links={host.links}
            size="sm"
            onDark
            className="mt-auto pt-4"
          />
        )}
      </div>
    </div>
  );
}

export function PodcastLogo({
  podcast,
  className = "",
}: {
  podcast: Podcast;
  className?: string;
}) {
  if (!podcast.logo) return null;

  return (
    <img
      src={podcast.logo}
      alt={podcast.logoAlt ?? `${podcast.name} logo`}
      width={64}
      height={64}
      decoding="async"
      className={`rounded-[14px] ${className}`}
    />
  );
}

export function PodcastCard({
  podcast,
}: {
  podcast: Podcast;
}) {
  const episodeThumbs = podcast.seasons
    .flatMap((season) => season.episodes)
    .slice(0, 6);

  return (
    <a
      href={link("/podcasts/:id", { id: podcast.id })}
      className="group block rounded-lg border border-border bg-bg-soft p-6 transition-colors hover:border-accent/40 sm:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="max-w-[560px]">
          <p className="label-text flex items-center gap-3 text-xs">
            <span>
              <RadioFilledIcon className="mr-1 inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" />{" "}
              Podcast
            </span>
            {podcast.sponsor && (
              <span className="font-sans font-bold normal-case tracking-normal text-text-secondary">
                Sponsored by {podcast.sponsor}
              </span>
            )}
          </p>
          <div className="mt-2 flex items-center gap-4">
            <PodcastLogo podcast={podcast} className="h-12 w-12" />
            <h2 className="text-2xl font-black leading-tight sm:text-3xl">
              {podcast.name}
            </h2>
          </div>
          <p className="mt-1 text-base font-bold text-pwv-deep-green dark:text-pwv-green">
            {podcast.tagline}
          </p>
          <p className="mt-3 leading-relaxed text-text-secondary">
            {podcast.description}
          </p>
        </div>
        {episodeThumbs.length > 0 ? (
          <div className="sm:shrink-0">
            <ul className="grid grid-cols-3 gap-2 sm:gap-2">
              {episodeThumbs.map((episode) => (
                <li key={episode.number}>
                  <img
                    src={episode.image}
                    alt=""
                    width={360}
                    height={360}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full rounded-md border border-border object-cover transition-colors group-hover:border-accent/40 sm:w-20"
                  />
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs font-bold text-pwv-deep-green group-hover:underline dark:text-pwv-green">
              {podcast.totalEpisodes} episode
              {podcast.totalEpisodes === 1 ? "" : "s"}
            </p>
          </div>
        ) : (
          <div className="sm:shrink-0">
            {podcast.image && (
              <img
                src={podcast.image}
                alt={podcast.imageAlt ?? podcast.name}
                width={podcast.imageWidth ?? 360}
                height={podcast.imageHeight ?? 360}
                loading="lazy"
                decoding="async"
                className="hidden aspect-square w-28 rounded-lg object-cover sm:block"
              />
            )}
            <p className="mt-2 text-xs font-bold text-pwv-deep-green group-hover:underline dark:text-pwv-green">
              {podcast.totalEpisodes} episode
              {podcast.totalEpisodes === 1 ? "" : "s"}
            </p>
          </div>
        )}
      </div>
    </a>
  );
}

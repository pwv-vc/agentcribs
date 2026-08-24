import { Seo } from "@/app/components/seo";
import { JsonLd } from "@/app/components/json-ld";
import { BackLink } from "@/app/components/links";
import { RadioFilledIcon } from "@/app/components/icons";
import {
  PodcastTrailer,
  PodcastSeasonSection,
  PodcastHostCard,
  PodcastLogo,
} from "@/app/components/podcasts";
import { getPodcast } from "@/app/queries/podcasts";
import { APP_URL } from "@/app/lib/url";

export const PodcastDetail = async ({ id }: { id: string }) => {
  const podcast = await getPodcast(id);

  if (!podcast) {
    return (
      <>
        <Seo
          title="Podcast Not Found | AgentCribs"
          description="The requested podcast could not be found."
        />
        <main className="mx-auto max-w-[800px] px-6 py-24 sm:px-8 sm:py-32">
          <h1 className="text-3xl font-black tracking-tight">Podcast not found</h1>
          <p className="mt-4 text-text-secondary">
            The podcast you're looking for doesn't exist or was removed.
          </p>
          <div className="mt-8">
            <BackLink href="/podcasts">&larr; Back to podcasts</BackLink>
          </div>
        </main>
      </>
    );
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PodcastSeries",
        "@id": `${APP_URL}/podcasts/${podcast.id}#podcast`,
        name: podcast.name,
        url: podcast.url,
        description: podcast.description,
        sponsor: {
          "@type": "Organization",
          name: "AgentCribs",
          url: APP_URL,
          parentOrganization: {
            "@type": "Organization",
            name: "PWV",
            url: "https://pwv.com/",
          },
        },
        author: podcast.hosts.map((host) => ({
          "@type": "Person",
          name: host.name,
          jobTitle: host.role,
        })),
        episode: podcast.seasons.flatMap((season) =>
          season.episodes.map((episode) => ({
            "@type": "PodcastEpisode",
            episodeNumber: Number(episode.number.replace(/\D/g, "")),
            name: `${episode.guest}: ${episode.title}`,
            description: episode.description,
            image: `${APP_URL}${episode.image}`,
            url: podcast.url,
          })),
        ),
      },
      {
        "@type": "WebPage",
        "@id": `${APP_URL}/podcasts/${podcast.id}#webpage`,
        url: `${APP_URL}/podcasts/${podcast.id}`,
        name: `${podcast.name} | AgentCribs Podcasts`,
        inLanguage: "en-US",
        about: { "@id": `${APP_URL}/podcasts/${podcast.id}#podcast` },
      },
    ],
  };

  return (
    <>
      <Seo
        title={`${podcast.name} | ${podcast.tagline}`}
        description={podcast.description}
        canonical={`/podcasts/${podcast.id}`}
      />
      <JsonLd schema={schema} />

      <section className="bg-pwv-black text-pwv-white">
        <div className="mx-auto max-w-[1040px] px-6 py-14 sm:px-8 sm:py-20">
          <p className="text-sm font-bold">
            <BackLink href="/podcasts" onDark>Podcasts</BackLink>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-pwv-green">
              {podcast.name}
            </span>
          </p>
          {podcast.sponsor && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-pwv-green/40 bg-pwv-green/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-pwv-green">
                <RadioFilledIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Sponsored by {podcast.sponsor}
              </span>
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <PodcastLogo
              podcast={podcast}
              className="h-16 w-16 sm:h-20 sm:w-20"
            />
            <h1 className="text-5xl font-black leading-none sm:text-7xl md:text-8xl">
              {podcast.name}
            </h1>
          </div>
          <h2 className="mt-6 max-w-[820px] text-xl font-black leading-[1.05] sm:text-4xl">
            {podcast.tagline}
          </h2>
          <p className="mt-8 max-w-[720px] text-lg leading-relaxed text-pwv-white/80 sm:text-xl">
            {podcast.description}
          </p>

          {podcast.trailer && (
            <div className="mt-10 max-w-[820px]">
              <PodcastTrailer
                videoId={podcast.trailer.videoId}
                label={podcast.trailer.label}
              />
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-bg">
        <div className="mx-auto max-w-[1040px] px-6 py-16 sm:px-8 sm:py-24">
          <div className="max-w-[820px]">
            <span className="label-text">Seasons</span>
            <h2 className="mt-2 text-4xl font-black leading-none sm:text-5xl">
              {podcast.totalEpisodes} Episodes
            </h2>
          </div>
          <div className="mt-10 max-w-[820px]">
            {podcast.seasons.map((season) => (
              <PodcastSeasonSection key={season.number} season={season} />
            ))}
          </div>
          <p className="mt-8 max-w-[820px] leading-relaxed text-text-secondary">
            New episodes drop on{" "}
            <a
              href={podcast.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-accent underline decoration-border underline-offset-4 transition-colors hover:text-accent-hover"
            >
              {new URL(podcast.url).hostname}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-bg">
        <div className="mx-auto max-w-[1040px] px-6 py-16 sm:px-8 sm:py-24">
          <div className="max-w-[820px]">
            <span className="label-text">The Hosts</span>
            <h2 className="mt-2 text-4xl font-black leading-none sm:text-5xl">
              {podcast.hosts.map((h) => h.name.split(" ")[0]).join(" and ")}
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {podcast.hosts.map((host) => (
              <PodcastHostCard key={host.name} host={host} />
            ))}
          </div>
          <div className="mt-14 border-t border-border pt-14">
            <div className="prose max-w-[820px]" dangerouslySetInnerHTML={{ __html: podcast.content }} />
          </div>
        </div>
      </section>
    </>
  );
};

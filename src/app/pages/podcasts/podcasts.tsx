import { Seo } from "@/app/components/seo";
import { JsonLd } from "@/app/components/json-ld";
import { PodcastCard } from "@/app/components/podcasts";
import { getPodcasts, getFeaturedPodcast } from "@/app/queries/podcasts";
import { APP_URL } from "@/app/lib/url";

export const Podcasts = async () => {
  const [podcasts, featured] = await Promise.all([
    getPodcasts(),
    getFeaturedPodcast(),
  ]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${APP_URL}/podcasts`,
    url: `${APP_URL}/podcasts`,
    name: "Podcasts | AgentCribs",
    inLanguage: "en-US",
    hasPart: podcasts.map((podcast) => ({
      "@type": "PodcastSeries",
      name: podcast.name,
      url: podcast.url,
      description: podcast.description,
    })),
  };

  return (
    <>
      <Seo
        title="Podcasts from the AgentCribs community"
        description="Podcasts sponsored by AgentCribs and PWV. AI Worth Using shows how the top AI engineers build, with live demos from leading AI developers."
        canonical="/podcasts"
        ogImage={featured?.ogImage ?? featured?.image}
        ogImageAlt={featured?.ogImageAlt ?? featured?.imageAlt}
        ogImageVersion={featured?.imagesVersion}
        ogImageWidth={featured?.ogImageWidth}
        ogImageHeight={featured?.ogImageHeight}
      />
      <JsonLd schema={schema} />

      <section className="bg-bg-deep text-pwv-white">
        <div className="mx-auto max-w-[1040px] px-6 py-14 sm:px-8 sm:py-20">
          <span className="label-text">AgentCribs Podcasts</span>
          <h1 className="mt-2 text-5xl font-black leading-none sm:text-7xl">
            Podcasts
          </h1>
          <p className="mt-8 max-w-[720px] text-lg leading-relaxed text-pwv-white/80 sm:text-xl">
            Shows we sponsor and produce with the AgentCribs community, covering
            how the best builders actually work with AI.
          </p>
        </div>
      </section>

      <section className="bg-bg">
        <div className="mx-auto max-w-[1040px] px-6 py-16 sm:px-8 sm:py-24">
          <div className="flex flex-col gap-6">
            {podcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

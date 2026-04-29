import { Seo } from "@/app/components/seo";
import { getPlaylist } from "@/app/queries/playlist";
import { CtaButton } from "@/app/shared/cta-button";
import VideoCard from "@/app/shared/video-card";

export const Playlist = async () => {
  const data = await getPlaylist();

  if (!data) {
    return (
      <>
        <Seo title="Playlist" description="AgentCribs video playlist" noIndex />
        <main className="mx-auto max-w-[640px] px-6 py-16 sm:px-8 sm:py-24">
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Playlist not found
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            The playlist could not be loaded. Please try again later.
          </p>
          <div className="mt-10">
            <CtaButton href="/" label="&larr; Back to home" />
          </div>
        </main>
      </>
    );
  }

  const { playlist, videos } = data;

  return (
    <>
      <Seo
        title={`${playlist.title} — Videos`}
        description={playlist.description}
        noIndex
      />
      <main className="mx-auto max-w-[900px] px-6 py-16 sm:px-8 sm:py-24">
        {/* Playlist header */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-bg-muted sm:w-64 sm:shrink-0">
            <img
              src={playlist.thumbnail}
              alt={`${playlist.title} playlist thumbnail`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {playlist.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              {playlist.description}
            </p>
            <div className="mt-2 flex items-center gap-3 text-sm text-text-secondary">
              <span className="font-medium text-text">{playlist.channel}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{data.totalVideos} video{data.totalVideos !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* Video grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              videoId={video.id}
              title={video.title}
              thumbnail={video.thumbnail}
              published={video.published}
              url={video.url}
            />
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-10">
          <CtaButton href="/" label="&larr; Back to home" />
        </div>
      </main>
    </>
  );
};

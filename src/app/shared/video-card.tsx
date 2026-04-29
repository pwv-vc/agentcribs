"use client";

import { useState } from "react";

type VideoCardProps = {
  videoId: string;
  title: string;
  thumbnail: string;
  published: string;
  url: string;
};

const VideoCard = ({ videoId, title, thumbnail, published, url }: VideoCardProps) => {
  const [playing, setPlaying] = useState(false);
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-accent">
      <div className="relative aspect-video overflow-hidden bg-bg-muted">
        {playing ? (
          <iframe
            src={embedUrl}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
              loading="lazy"
            />
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex cursor-pointer items-center justify-center"
              aria-label={"Play ".concat(title)}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/90 text-accent-text shadow-lg transition-transform hover:scale-110">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 rounded bg-black/70 px-2.5 py-1 text-xs font-medium text-white opacity-0 transition-opacity hover:bg-black/90 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              Watch on YouTube
            </a>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-serif text-sm font-semibold leading-snug text-text">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            {title}
          </a>
        </h3>
        <p className="mt-auto text-xs text-text-secondary">
          {new Date(published).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;

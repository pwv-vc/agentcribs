'use client';

import YouTube from 'react-youtube';

export function CommunityVideo() {
  return (
    <YouTube
      videoId="m-xodKzUtTU"
      title="AgentCribs Community"
      className="aspect-video w-full overflow-hidden rounded-lg [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0"
      opts={{
        width: '100%',
        height: '100%',
        playerVars: {
          rel: 0,
          modestbranding: 1,
        },
      }}
    />
  );
}

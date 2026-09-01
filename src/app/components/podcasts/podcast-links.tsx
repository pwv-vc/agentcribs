import {
  AppleIcon,
  GlobeIcon,
  LinkedinIcon,
  SpotifyIcon,
  XIcon,
  YoutubeIcon,
} from "@/app/components/icons";

const PLATFORMS = [
  { key: "show", label: "The Show", Icon: GlobeIcon },
  { key: "apple", label: "Apple Podcasts", Icon: AppleIcon },
  { key: "spotify", label: "Spotify", Icon: SpotifyIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "x", label: "X", Icon: XIcon },
] as const;

type PlatformKey = (typeof PLATFORMS)[number]["key"];
type Links = Partial<Record<PlatformKey, string>>;

export function PodcastLinks({
  links,
  size = "md",
  onDark = false,
  labels,
  className = "",
}: {
  links?: Links;
  size?: "xs" | "sm" | "md";
  onDark?: boolean;
  // Overrides for the default platform labels (e.g. a trailer's own label
  // for its YouTube link).
  labels?: Partial<Record<PlatformKey, string>>;
  className?: string;
}) {
  if (!links) return null;

  const items = PLATFORMS.filter(({ key }) => links[key]);
  if (items.length === 0) return null;

  const pillSize =
    size === "xs"
      ? "gap-1 px-2 py-0.5 text-[11px]"
      : size === "sm"
        ? "gap-1.5 px-3 py-1 text-xs"
        : "gap-2 px-4 py-1.5 text-sm";
  const iconSize =
    size === "xs" ? "h-3 w-3" : size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const pillTone = onDark
    ? "border-pwv-white/20 text-pwv-white/80 hover:border-pwv-white/40 hover:text-pwv-white"
    : "border-border bg-bg text-text-secondary hover:bg-bg-muted hover:text-text";

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center rounded-full border font-bold no-underline transition-colors ${pillSize} ${pillTone}`}
          >
            <Icon className={iconSize} />
            {labels?.[key] ?? label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function PodcastSubscribeLinks({
  links,
  labels,
  className = "",
}: {
  links?: Links;
  labels?: Partial<Record<PlatformKey, string>>;
  className?: string;
}) {
  const items = PLATFORMS.filter(({ key }) => links?.[key]);
  if (items.length === 0) return null;

  return (
    <div className={`text-center ${className}`}>
      <p className="text-md font-extrabold uppercase tracking-widest text-pwv-white/60">
        Watch. Listen. Subscribe.
      </p>
      <PodcastLinks
        links={links}
        size="sm"
        onDark
        labels={labels}
        className="mt-2 justify-center"
      />
    </div>
  );
}

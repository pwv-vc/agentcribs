import {
  SITE_NAME,
  SITE_URL,
  OG_IMAGE,
  OG_IMAGE_ALT,
  OG_IMAGE_CB,
  TWITTER_HANDLE,
} from "@/app/lib/seo";

export type SeoProps = {
  title: string;
  description: string;
  /** Relative or absolute URL for the canonical link. Defaults to SITE_URL. */
  canonical?: string;
  /** Override the OG image path. Defaults to /og-image.png. */
  ogImage?: string;
  /** Alt text for the OG image. Defaults to the site-wide alt. */
  ogImageAlt?: string;
  /** Cache-bust version for the OG image. Defaults to OG_IMAGE_CB. */
  ogImageVersion?: string | number;
  /** Intrinsic image dimensions, rendered as og:image:width/height. */
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: "website" | "article";
  /** When true, sets <meta name="robots" content="noindex,nofollow">. */
  noIndex?: boolean;
};

const DEFAULT_OG_IMAGE_WIDTH = "1200";
const DEFAULT_OG_IMAGE_HEIGHT = "630";

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

function ogImageUrl(path: string, version?: string | number) {
  const url = new URL(path, SITE_URL);
  url.searchParams.set("v", String(version ?? OG_IMAGE_CB));
  return url.toString();
}

export const Seo = ({
  title,
  description,
  canonical = SITE_URL,
  ogImage = OG_IMAGE,
  ogImageAlt = OG_IMAGE_ALT,
  ogImageVersion,
  ogImageWidth,
  ogImageHeight,
  ogType = "website",
  noIndex = false,
}: SeoProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = absoluteUrl(canonical);
  const imageUrl = ogImageUrl(ogImage, ogImageVersion);
  const imageAlt = ogImageAlt;
  const imageWidth = String(ogImageWidth ?? DEFAULT_OG_IMAGE_WIDTH);
  const imageHeight = String(ogImageHeight ?? DEFAULT_OG_IMAGE_HEIGHT);

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />
      {TWITTER_HANDLE && <meta name="twitter:site" content={TWITTER_HANDLE} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
    </>
  );
};

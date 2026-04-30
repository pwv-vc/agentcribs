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
  ogType?: "website" | "article";
  /** When true, sets <meta name="robots" content="noindex,nofollow">. */
  noIndex?: boolean;
};

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

function ogImageUrl(path: string) {
  const url = new URL(path, SITE_URL);
  url.searchParams.set("v", OG_IMAGE_CB);
  return url.toString();
}

export const Seo = ({
  title,
  description,
  canonical = SITE_URL,
  ogImage = OG_IMAGE,
  ogType = "website",
  noIndex = false,
}: SeoProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = absoluteUrl(canonical);
  const imageUrl = ogImageUrl(ogImage);

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
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={OG_IMAGE_ALT} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={OG_IMAGE_ALT} />
      {TWITTER_HANDLE && <meta name="twitter:site" content={TWITTER_HANDLE} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
    </>
  );
};

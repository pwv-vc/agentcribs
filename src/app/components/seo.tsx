import { SITE_NAME, SITE_URL, OG_IMAGE } from "@/app/lib/seo";

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

export const Seo = ({
  title,
  description,
  canonical = SITE_URL,
  ogImage = OG_IMAGE,
  ogType = "website",
  noIndex = false,
}: SeoProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
    </>
  );
};

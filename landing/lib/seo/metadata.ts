import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_URL,
  LOCALES,
  localePath,
  absoluteUrl,
  OPEN_GRAPH_LOCALE,
  type Locale,
} from "@/lib/site";

const DEFAULT_OG_IMAGE = absoluteUrl("/hero-image.webp");

type PageMetadataInput = {
  lang: Locale;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
};

export function buildPageMetadata({
  lang,
  path,
  title,
  description,
  keywords,
  noIndex,
  image,
}: PageMetadataInput): Metadata {
  const canonicalPath = localePath(lang, path);
  const languages: Record<string, string> = {};

  for (const locale of LOCALES) {
    languages[locale] = absoluteUrl(localePath(locale, path));
  }
  languages["x-default"] = absoluteUrl(localePath("fr", path));

  const ogImage = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
      languages,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OPEN_GRAPH_LOCALE[lang],
      url: absoluteUrl(canonicalPath),
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function getDictionarySeo(lang: Locale) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dicts = {
    fr: require("@/dictionaries/fr").default,
    en: require("@/dictionaries/en").default,
    ar: require("@/dictionaries/ar").default,
  } as const;
  return dicts[lang].seo;
}

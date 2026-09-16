/**
 * Site configuration — https://universmarbre.com
 *
 * Off-site SEO checklist (manual):
 * 1. Google Search Console — verify domain, submit /sitemap.xml and /llms.txt
 * 2. Google Analytics 4 — set NEXT_PUBLIC_GA_ID (see .env.example); link Search Console in GA4 for organic reports
 * 3. Google Business Profile — UNIVMAR, Temara, photos, services
 * 4. NAP consistency — match lib/contact.ts everywhere
 * 5. Backlinks — annuaires pro, Instagram, partners
 * 6. Client reviews on Google after projects
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://universmarbre.com";

export const SITE_NAME = "UNIVMAR";

/** Used to compute “years of experience” across the public site. */
export const COMPANY_FOUNDED_YEAR = 2004;

export const LOCALES = ["fr", "en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Build a locale-prefixed path, e.g. localePath("fr", "/produits") → "/fr/produits" */
export function localePath(lang: Locale, path = ""): string {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  if (normalized === "" || normalized === "/") return `/${lang}`;
  return `/${lang}${normalized}`;
}

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export const CORE_PATHS = [
  "",
  "/produits",
  "/a-propos",
  "/projets",
  "/contact",
  "/blog",
] as const;

export const PILLAR_SLUGS = [
  "marbre-maroc",
  "marbrerie-maroc",
  "pierre-de-taza",
  "marbre-de-taza",
  "prix-marbre-maroc",
  "plan-de-travail-marbre",
  "pierre-naturelle-maroc",
  "granit-maroc",
  "marbre-et-granit-maroc",
  "marbre-local-maroc",
  "marbre-importe",
] as const;

export const CITY_SLUGS = [
  "marbre-casablanca",
  "marbre-rabat",
  "marbre-temara",
  "marbre-marrakech",
] as const;

export const SEO_PAGE_SLUGS = [...PILLAR_SLUGS, ...CITY_SLUGS] as const;

export const BLOG_SLUGS = [
  "guide-granit-maroc-2026",
  "guide-pierre-de-taza-2026",
  "pierre-de-taza-vs-marbre",
  "prix-pierre-de-taza-maroc",
  "facades-pierre-naturelle-maroc",
  "entretien-marbre-pierre-naturelle",
  "granit-vs-marbre-plan-de-travail",
  "marbre-maroc-guide-complet-2026",
  "marbre-de-taza-guide",
  "ou-acheter-pierre-de-taza-maroc",
  "marbre-de-taza-vs-pierre-de-taza",
  "prix-marbre-crema-marfil-volubilis",
] as const;

export const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
  ar: "ar_MA",
};

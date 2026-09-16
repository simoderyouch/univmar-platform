import { COMPANY_FOUNDED_YEAR } from "@/lib/site";

export type SiteStats = {
  products: number;
  categories: number;
  projects: number;
  years: number;
};

/** Public-facing counters shown on the homepage, about page, and stats band. */
export const DISPLAY_STATS: SiteStats = {
  products: 100,
  projects: 300,
  years: 15,
  categories: 6,
};

export function getYearsOfExperience(referenceYear = new Date().getFullYear()): number {
  return Math.max(0, referenceYear - COMPANY_FOUNDED_YEAR);
}

/** Replace `{products}`, `{categories}`, `{projects}`, `{years}` in copy strings. */
export function withSiteStats(text: string, stats: SiteStats): string {
  return text
    .replace(/\{years\}/g, String(stats.years))
    .replace(/\{products\}/g, String(stats.products))
    .replace(/\{projects\}/g, String(stats.projects))
    .replace(/\{categories\}/g, String(stats.categories));
}

export function yearsWithPlus(years: number): string {
  return `${years}+`;
}

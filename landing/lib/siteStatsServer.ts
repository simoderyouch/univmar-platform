import { DISPLAY_STATS, type SiteStats } from "@/lib/siteStats";

export async function getSiteStats(): Promise<SiteStats> {
  return DISPLAY_STATS;
}

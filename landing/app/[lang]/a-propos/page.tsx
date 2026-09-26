import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getDictionary } from "@/lib/i18n-server";
import { isLocale, type Locale } from "@/lib/site";
import { notFound } from "next/navigation";
import { getSiteStats } from "@/lib/siteStatsServer";
import AboutClient from "./AboutClient";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  if (!isLocale(langParam)) return {};
  const lang = langParam as Locale;
  const seo = getDictionary(lang).seo.aPropos;
  return buildPageMetadata({
    lang,
    path: "/a-propos",
    title: seo.title,
    description: seo.description,
  });
}

export default async function AboutPage({ params }: Props) {
  const { lang: langParam } = await params;
  if (!isLocale(langParam)) notFound();
  const stats = await getSiteStats();
  return <AboutClient stats={stats} />;
}

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getDictionary } from "@/lib/i18n-server";
import { isLocale, type Locale } from "@/lib/site";
import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/products";
import { getCategories, getPortfolioProjects } from "@/lib/erpCms";
import { getSiteStats } from "@/lib/siteStatsServer";
import HomeClient from "./HomeClient";

type Props = { params: Promise<{ lang: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  if (!isLocale(langParam)) return {};
  const lang = langParam as Locale;
  const seo = getDictionary(lang).seo.home;
  return buildPageMetadata({ lang, path: "", title: seo.title, description: seo.description });
}

export default async function HomePage({ params }: Props) {
  const { lang: langParam } = await params;
  if (!isLocale(langParam)) notFound();
  const [products, categories, projects, stats] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getPortfolioProjects(true),
    getSiteStats(),
  ]);

  return (
    <>
      <HomeClient
        products={products}
        categories={[...categories].sort((a, b) => a.order - b.order)}
        projects={projects}
        stats={stats}
      />
    </>
  );
}

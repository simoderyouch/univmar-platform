import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getDictionary } from "@/lib/i18n-server";
import { isLocale, type Locale } from "@/lib/site";
import { notFound } from "next/navigation";
import ProjectsClient from "./ProjectsClient";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  if (!isLocale(langParam)) return {};
  const lang = langParam as Locale;
  const seo = getDictionary(lang).seo.projets;
  return buildPageMetadata({
    lang,
    path: "/projets",
    title: seo.title,
    description: seo.description,
  });
}

export default async function ProjectsPage({ params }: Props) {
  const { lang: langParam } = await params;
  if (!isLocale(langParam)) notFound();
  return <ProjectsClient />;
}

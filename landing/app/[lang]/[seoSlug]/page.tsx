import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { absoluteUrl, isLocale, localePath, type Locale } from "@/lib/site";
import { allSeoPageSlugs, getSeoPage, isSeoPageSlug } from "@/data/seo-pages";
import SeoContentPage from "@/components/seo/SeoContentPage";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema, webPageSchema } from "@/lib/seo/schema";
import { getDictionary } from "@/lib/i18n-server";

type Props = { params: Promise<{ lang: string; seoSlug: string }> };

export function generateStaticParams() {
  const slugs = allSeoPageSlugs();
  return ["fr", "en", "ar"].flatMap((lang) => slugs.map((seoSlug) => ({ lang, seoSlug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam, seoSlug } = await params;
  if (!isLocale(langParam) || !isSeoPageSlug(seoSlug)) return {};
  const lang = langParam as Locale;
  const page = getSeoPage(seoSlug, lang);
  return buildPageMetadata({
    lang,
    path: `/${seoSlug}`,
    title: page.metaTitle,
    description: page.metaDescription,
  });
}

export default async function SeoSlugPage({ params }: Props) {
  const { lang: langParam, seoSlug } = await params;
  if (!isLocale(langParam) || !isSeoPageSlug(seoSlug)) notFound();

  const lang = langParam as Locale;
  const content = getSeoPage(seoSlug, lang);
  const dict = getDictionary(lang);
  const url = absoluteUrl(localePath(lang, `/${seoSlug}`));

  const pageSchemas: Record<string, unknown>[] = [
    breadcrumbSchema(lang, [
      { name: dict.nav.home, path: "" },
      { name: content.h1, path: `/${seoSlug}` },
    ]),
    faqPageSchema(content.faq),
  ];

  if (content.dateModified) {
    pageSchemas.push(
      webPageSchema({
        name: content.h1,
        description: content.metaDescription,
        url,
        dateModified: content.dateModified,
      }),
    );
  }

  return (
    <>
      <JsonLd data={pageSchemas} />
      <SeoContentPage content={content} />
    </>
  );
}

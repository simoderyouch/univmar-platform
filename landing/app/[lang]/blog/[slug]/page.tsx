import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getDictionary } from "@/lib/i18n-server";
import { isLocale, LOCALES, type Locale } from "@/lib/site";
import { absoluteUrl, localePath } from "@/lib/site";
import { allBlogSlugs, getBlogPost } from "@/content/blog/posts";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import BlogArticleClient from "./BlogArticleClient";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  const slugs = allBlogSlugs();
  return LOCALES.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  if (!isLocale(langParam)) return {};
  const post = getBlogPost(slug);
  if (!post) return {};
  const c = post.content[langParam as Locale];
  return buildPageMetadata({
    lang: langParam as Locale,
    path: `/blog/${slug}`,
    title: `${c.title} | UNIVMAR`,
    description: c.description,
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { lang: langParam, slug } = await params;
  if (!isLocale(langParam)) notFound();
  const lang = langParam as Locale;

  const post = getBlogPost(slug);
  if (!post) notFound();

  const dict = getDictionary(lang);
  const c = post.content[lang];
  const path = `/blog/${slug}`;
  const url = absoluteUrl(localePath(lang, path));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(lang, [
            { name: dict.nav.home, path: "" },
            { name: "Blog", path: "/blog" },
            { name: c.title, path },
          ]),
          articleSchema({
            title: c.title,
            description: c.description,
            datePublished: post.datePublished,
            dateModified: post.dateModified ?? post.datePublished,
            url,
          }),
        ]}
      />
      <BlogArticleClient post={post} />
    </>
  );
}

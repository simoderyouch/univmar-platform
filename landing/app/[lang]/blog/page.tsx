import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getDictionary } from "@/lib/i18n-server";
import { isLocale, type Locale } from "@/lib/site";
import BlogIndexClient from "./BlogIndexClient";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  if (!isLocale(langParam)) return {};
  const dict = getDictionary(langParam as Locale);
  return buildPageMetadata({
    lang: langParam as Locale,
    path: "/blog",
    title: dict.seo.blog.title,
    description: dict.seo.blog.description,
  });
}

export default async function BlogPage({ params }: Props) {
  const { lang: langParam } = await params;
  if (!isLocale(langParam)) notFound();
  return <BlogIndexClient />;
}

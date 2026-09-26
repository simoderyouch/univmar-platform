import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getDictionary } from "@/lib/i18n-server";
import { isLocale, type Locale } from "@/lib/site";
import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/erpCms";
import ProduitsClient from "./ProduitsClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  if (!isLocale(langParam)) return {};
  const lang = langParam as Locale;
  const seo = getDictionary(lang).seo.produits;
  return buildPageMetadata({
    lang,
    path: "/produits",
    title: seo.title,
    description: seo.description,
  });
}

export default async function ProduitsPage({ params }: Props) {
  const { lang: langParam } = await params;
  if (!isLocale(langParam)) notFound();

  const categories = await getCategories();
  const products = (await Promise.all(categories.map((category) => getProducts(category.slug)))).flat();

  return (
    <ProduitsClient
      products={products}
      categories={[...categories].sort((a, b) => a.order - b.order)}
    />
  );
}

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getDictionary } from "@/lib/i18n-server";
import { isLocale, type Locale } from "@/lib/site";
import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/products";
import { loadCategories } from "@/lib/productData";
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

  const [products, categories] = await Promise.all([getAllProducts(), loadCategories()]);

  return (
    <ProduitsClient
      products={products}
      categories={[...categories].sort((a, b) => a.order - b.order)}
    />
  );
}

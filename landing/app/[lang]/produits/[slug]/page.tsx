import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getDictionary } from "@/lib/i18n-server";
import { isLocale, LOCALES, type Locale } from "@/lib/site";
import { allProductSlugsAsync } from "@/lib/productsServer";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { absoluteUrl, localePath } from "@/lib/site";
import { publicAssetUrl } from "@/lib/publicAsset";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema, productSchema } from "@/lib/seo/schema";
import { productSlugById } from "@/lib/slug";
import { buildProductSeoContent } from "@/lib/productSeo";
import ProductDetailClient from "./ProductDetailClient";

type Props = { params: Promise<{ lang: string; slug: string }> };

function cleanMetaDescription(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= 158) return normalized;

  const clipped = normalized.slice(0, 158);
  const boundary = Math.max(clipped.lastIndexOf(". "), clipped.lastIndexOf("; "), clipped.lastIndexOf(", "));
  return `${clipped.slice(0, boundary > 95 ? boundary : 155).trimEnd().replace(/[,:;]$/, "")}.`;
}

export async function generateStaticParams() {
  const slugs = await allProductSlugsAsync();
  return LOCALES.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  if (!isLocale(langParam)) return {};
  const lang = langParam as Locale;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const dict = getDictionary(lang);
  const catKey = product.category.name as keyof typeof dict.products.categories;
  const categoryLabel = dict.products.categories[catKey] ?? product.category.name;
  const titleName = slug.endsWith(`-${product.id}`) ? `${product.name} variante ${product.id}` : product.name;
  const title =
    slug === "labrador-noir"
      ? lang === "fr"
        ? "Labrador Noir : granit noir pour sols et plans de travail | UNIVMAR"
        : lang === "ar"
          ? "غرانيت لابرادور نوير في المغرب | UNIVMAR"
          : "Labrador Noir granite in Morocco | UNIVMAR"
      : `${titleName} — ${categoryLabel} ${dict.seo.productTemplate.titleSuffix}`;
  const fallbackDescription = dict.seo.productTemplate.descriptionTemplate
    .replace("{name}", product.name)
    .replace("{category}", categoryLabel);
  const seoContent = buildProductSeoContent(product, categoryLabel, lang);
  const description =
    slug === "labrador-noir" && lang === "fr"
      ? "Découvrez le granit Labrador Noir, ses finitions et ses usages. Demandez conseil et un devis pour votre projet au Maroc."
      : seoContent
        ? cleanMetaDescription(seoContent.paragraphs[0])
        : fallbackDescription;

  return buildPageMetadata({
    lang,
    path: `/produits/${slug}`,
    title,
    description,
    image: product.images,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { lang: langParam, slug } = await params;
  if (!isLocale(langParam)) notFound();
  const lang = langParam as Locale;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const dict = getDictionary(lang);
  const catKey = product.category.name as keyof typeof dict.products.categories;
  const categoryLabel = dict.products.categories[catKey] ?? product.category.name;
  const path = `/produits/${slug}`;
  const url = absoluteUrl(localePath(lang, path));
  const fallbackDescription = dict.seo.productTemplate.descriptionTemplate
    .replace("{name}", product.name)
    .replace("{category}", categoryLabel);
  const seoContent = buildProductSeoContent(product, categoryLabel, lang);
  const description = seoContent?.paragraphs[0] ?? fallbackDescription;
  const allProducts = await getAllProducts();
  const relatedProducts = allProducts
    .filter((item) => item.id !== product.id && item.categoryId === product.categoryId)
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      name: item.name,
      href: localePath(lang, `/produits/${productSlugById(item.id, allProducts) ?? ""}`),
    }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(lang, [
            { name: dict.nav.home, path: "" },
            { name: dict.nav.products, path: "/produits" },
            { name: product.name, path },
          ]),
          productSchema({
            name: product.name,
            description,
            image: [
              absoluteUrl(publicAssetUrl(product.images)),
              ...(product.applicationImages ?? []).map((img) =>
                absoluteUrl(publicAssetUrl(img)),
              ),
            ],
            category: categoryLabel,
            url,
          }),
          ...(seoContent ? [faqPageSchema(seoContent.faq)] : []),
        ]}
      />
      <ProductDetailClient
        product={product}
        categoryLabel={categoryLabel}
        lang={lang}
        seoContent={seoContent}
        relatedProducts={relatedProducts}
      />
    </>
  );
}

import type { MetadataRoute } from "next";
import {
  SITE_URL,
  LOCALES,
  CORE_PATHS,
  PILLAR_SLUGS,
  CITY_SLUGS,
  localePath,
  absoluteUrl,
  type Locale,
} from "@/lib/site";
import { allProductSlugsAsync } from "@/lib/productsServer";
import { productIdBySlug, buildSlugMaps } from "@/lib/slug";
import { BLOG_POSTS } from "@/content/blog/posts";
import { getSeoPage, type SeoPageSlug } from "@/data/seo-pages";
import { loadProducts } from "@/lib/productData";
import { publicAssetUrl } from "@/lib/publicAsset";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await loadProducts();
  const published = products.filter((p) => p.images && p.published !== false);
  const { slugToId } = buildSlugMaps(published);
  const slugs = await allProductSlugsAsync();

  const productLastModified = (slug: string): Date | undefined => {
    const id = slugToId.get(slug) ?? productIdBySlug(slug, published);
    if (!id) return undefined;
    const product = published.find((p) => p.id === id);
    if (product?.updatedAt) return new Date(product.updatedAt);
    return undefined;
  };

  const seoPageLastModified = (slug: SeoPageSlug): Date | undefined => {
    const dateModified = getSeoPage(slug, "fr").dateModified;
    return dateModified ? new Date(`${dateModified}T12:00:00Z`) : undefined;
  };

  const entries: MetadataRoute.Sitemap = [];

  const addPath = (path: string, lastModified?: Date, images?: string[]) => {
    for (const lang of LOCALES) {
      entries.push({
        url: `${SITE_URL}${localePath(lang as Locale, path)}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : path.startsWith("/produits/") ? 0.8 : 0.7,
        ...(images?.length ? { images } : {}),
      });
    }
  };

  for (const path of CORE_PATHS) {
    addPath(path);
  }

  for (const slug of slugs) {
    const id = slugToId.get(slug) ?? productIdBySlug(slug, published);
    const product = id ? published.find((item) => item.id === id) : undefined;
    const images = product
      ? [product.images, ...(product.applicationImages ?? [])]
          .filter(Boolean)
          .slice(0, 6)
          .map((img) => absoluteUrl(publicAssetUrl(img)))
      : undefined;
    addPath(`/produits/${slug}`, productLastModified(slug), images);
  }

  for (const slug of PILLAR_SLUGS) {
    addPath(`/${slug}`, seoPageLastModified(slug));
  }

  for (const slug of CITY_SLUGS) {
    addPath(`/${slug}`, seoPageLastModified(slug));
  }

  for (const post of BLOG_POSTS) {
    addPath(
      `/blog/${post.slug}`,
      new Date(`${post.dateModified ?? post.datePublished}T12:00:00Z`),
    );
  }

  return entries;
}

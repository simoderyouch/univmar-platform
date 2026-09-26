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
import { BLOG_POSTS } from "@/content/blog/posts";
import { getSeoPage, type SeoPageSlug } from "@/data/seo-pages";
import { getProducts } from "@/lib/erpCms";
import { publicAssetUrl } from "@/lib/publicAsset";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const productLastModified = (slug: string): Date | undefined => {
    void slug;
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

  for (const product of products) {
    const images = [product.images, ...product.applicationImages]
      .filter(Boolean)
      .slice(0, 6)
      .map((img) => absoluteUrl(publicAssetUrl(img)));
    addPath(`/produits/${product.slug}`, productLastModified(product.slug), images);
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

import { slugify } from "@/lib/slugify";
import productsRaw from "@/data/products.json";

type ProductRow = {
  id: number;
  name: string;
  published?: boolean;
  images?: string;
};

export { slugify };

export function buildSlugMaps(products: ProductRow[]) {
  const slugCounts = new Map<string, number>();
  const idToSlug = new Map<number, string>();
  const slugToId = new Map<string, number>();

  for (const product of products) {
    const base = slugify(product.name) || `produit-${product.id}`;
    const count = (slugCounts.get(base) ?? 0) + 1;
    slugCounts.set(base, count);
    const slug = count > 1 ? `${base}-${product.id}` : base;
    idToSlug.set(product.id, slug);
    slugToId.set(slug, product.id);
  }

  return { idToSlug, slugToId };
}

const publishedSeed = (productsRaw as ProductRow[]).filter(
  (p) => p.images && p.published !== false,
);
const seedMaps = buildSlugMaps(publishedSeed);

export function productSlugById(id: number, products?: ProductRow[]): string | undefined {
  if (products) return buildSlugMaps(products).idToSlug.get(id);
  return seedMaps.idToSlug.get(id);
}

export function productIdBySlug(slug: string, products?: ProductRow[]): number | undefined {
  if (products) return buildSlugMaps(products).slugToId.get(slug);
  return seedMaps.slugToId.get(slug);
}

export function allProductSlugs(products?: ProductRow[]): string[] {
  if (products) return [...buildSlugMaps(products).slugToId.keys()];
  return [...seedMaps.slugToId.keys()];
}

export { publishedSeed as publishedProducts };

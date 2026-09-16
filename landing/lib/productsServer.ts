import { getAllProducts } from "@/lib/products";
import { allProductSlugs } from "@/lib/slug";

export async function loadPublishedProducts() {
  return getAllProducts();
}

export async function allProductSlugsAsync(): Promise<string[]> {
  const products = await loadPublishedProducts();
  return allProductSlugs(products);
}

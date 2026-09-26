import { getProducts } from "@/lib/erpCms";

export async function loadPublishedProducts() {
  return getProducts();
}

export async function allProductSlugsAsync(): Promise<string[]> {
  const products = await loadPublishedProducts();
  return products.map((product) => product.slug);
}

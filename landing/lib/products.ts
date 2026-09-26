import { getProductBySlug as getErpProductBySlug, getProducts, type ProductRecord } from "@/lib/erpCms";

export type { ProductRecord };

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  return getErpProductBySlug(slug);
}

export async function getAllProducts(): Promise<ProductRecord[]> {
  return getProducts();
}

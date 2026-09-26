import fs from "fs/promises";
import path from "path";
import categoriesSeed from "@/data/categories.json";

export type CategoryRecord = {
  id: number;
  name: string;
  order: number;
  local?: boolean;
};

export type ProductRecord = {
  id: number;
  name: string;
  regularPrice: number | null;
  images: string;
  categoryId: number;
  type: string;
  published: boolean;
  visibility: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
  category: CategoryRecord;
  applicationImages: string[];
};

const PRODUCTS_PATH = path.join(process.cwd(), "data/products.json");
const CATEGORIES_PATH = path.join(process.cwd(), "data/categories.json");

export async function loadCategories(): Promise<CategoryRecord[]> {
  try {
    const raw = await fs.readFile(CATEGORIES_PATH, "utf-8");
    return JSON.parse(raw) as CategoryRecord[];
  } catch {
    return categoriesSeed as CategoryRecord[];
  }
}

export async function loadProducts(): Promise<ProductRecord[]> {
  const raw = await fs.readFile(PRODUCTS_PATH, "utf-8");
  return JSON.parse(raw) as ProductRecord[];
}

export async function saveProducts(products: ProductRecord[]): Promise<void> {
  await fs.writeFile(PRODUCTS_PATH, `${JSON.stringify(products, null, 2)}\n`, "utf-8");
}

export function categoryImageDir(categoryName: string): string {
  return `/images/${categoryName}/images`;
}

export function attachCategory(
  product: Omit<ProductRecord, "category"> & { category?: CategoryRecord },
  categories: CategoryRecord[],
): ProductRecord {
  const category =
    categories.find((c) => c.id === product.categoryId) ??
    product.category ??
    ({ id: product.categoryId, name: "Inconnu", order: 99 } as CategoryRecord);

  return { ...product, category } as ProductRecord;
}

export function mergeProductUpdate(
  existing: ProductRecord,
  body: Record<string, unknown>,
  categories: CategoryRecord[],
): ProductRecord | { error: string } {
  const name = typeof body.name === "string" ? body.name.trim() : existing.name;
  const categoryId = body.categoryId !== undefined ? Number(body.categoryId) : existing.categoryId;
  const regularPrice =
    body.regularPrice === null || body.regularPrice === ""
      ? null
      : body.regularPrice !== undefined
        ? Number(body.regularPrice)
        : existing.regularPrice;
  const images = typeof body.images === "string" ? body.images.trim() : existing.images;
  const applicationImages = Array.isArray(body.applicationImages)
    ? body.applicationImages.filter((v): v is string => typeof v === "string")
    : existing.applicationImages;
  const published = body.published !== undefined ? body.published !== false : existing.published;

  if (!name || !categoryId || !images) {
    return { error: "Name, category, and main image are required." };
  }

  const category = categories.find((c) => c.id === categoryId);
  if (!category) return { error: "Invalid category." };

  return attachCategory(
    {
      ...existing,
      name,
      categoryId,
      regularPrice: Number.isFinite(regularPrice) ? regularPrice : null,
      images,
      applicationImages,
      published,
      updatedAt: new Date().toISOString(),
    },
    categories,
  );
}

export async function nextProductId(products: ProductRecord[]): Promise<number> {
  const max = products.reduce((m, p) => Math.max(m, p.id), 0);
  return max + 1;
}

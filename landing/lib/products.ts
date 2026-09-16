import { loadProducts, type ProductRecord } from "@/lib/productData";
import { productIdBySlug } from "@/lib/slug";

export type { ProductRecord };

type ApiImage = { url: string; primary: boolean };
type ApiVariant = { indicativePrice: number | null };
type ApiMaterial = {
  id: number;
  sourceProductId: number | null;
  name: string;
  category: string;
  images: ApiImage[];
  variants: ApiVariant[];
};
type ApiCategory = { id: number; sourceCategoryId: number | null; name: string; displayOrder: number; localMaterial: boolean };
type ApiPage = { content?: ApiMaterial[] };

function apiBaseUrl(): string | null {
  const value = process.env.UNIVMAR_API_URL?.trim();
  return value ? value.replace(/\/$/, "") : null;
}

async function loadProductsFromApi(): Promise<ProductRecord[] | null> {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) return null;

  try {
    const [materialsResponse, categoriesResponse] = await Promise.all([
      fetch(`${baseUrl}/materials?size=100`, { cache: "no-store" }),
      fetch(`${baseUrl}/materials/categories`, { cache: "no-store" }),
    ]);
    if (!materialsResponse.ok || !categoriesResponse.ok) return null;

    const page = (await materialsResponse.json()) as ApiPage;
    const categories = (await categoriesResponse.json()) as ApiCategory[];
    const categoryByName = new Map(categories.map((category) => [category.name, category]));

    return (page.content ?? [])
      .filter((material) => material.images.length > 0)
      .map((material) => {
        const category = categoryByName.get(material.category);
        const orderedImages = [...material.images].sort((a, b) => Number(b.primary) - Number(a.primary));
        const primaryImage = orderedImages[0];
        return {
          id: material.sourceProductId ?? material.id,
          name: material.name,
          regularPrice: material.variants[0]?.indicativePrice ?? null,
          images: primaryImage.url,
          categoryId: category?.sourceCategoryId ?? category?.id ?? 0,
          type: "simple",
          published: true,
          visibility: "visible",
          inStock: true,
          createdAt: "",
          updatedAt: "",
          category: {
            id: category?.sourceCategoryId ?? category?.id ?? 0,
            name: material.category,
            order: category?.displayOrder ?? 99,
            local: category?.localMaterial,
          },
          applicationImages: orderedImages.slice(1).map((image) => image.url),
        };
      });
  } catch {
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const products = await getAllProducts();
  const published = products.filter((p) => p.images && p.published !== false);
  const id = productIdBySlug(slug, published);
  if (!id) return null;
  const product = published.find((p) => p.id === id);
  return product ?? null;
}

export async function getAllProducts(): Promise<ProductRecord[]> {
  const products = (await loadProductsFromApi()) ?? (await loadProducts());
  return products.filter((p) => p.images && p.published !== false);
}

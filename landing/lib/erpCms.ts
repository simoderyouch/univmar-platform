import "server-only";

type ApiResponse<T> = { data: T };

type ErpCategory = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  productCount: number;
};

type ErpVariant = {
  id: string;
  name: string;
  thicknessMm: number;
  format: string | null;
  coverImageUrl: string;
  galleryImageUrls: string[];
};

type ErpProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  color: string | null;
  origin: string | null;
  pattern: string | null;
  description: string | null;
  applications: string | null;
  coverImageUrl: string;
  galleryImageUrls: string[];
  variants: ErpVariant[];
};

type ErpPortfolioCategory = { id: string; name: string; slug: string; sortOrder: number };
type ErpPortfolioProject = {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  featured: boolean;
  sortOrder: number;
};

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  order: number;
  productCount: number;
};

export type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  regularPrice: null;
  images: string;
  applicationImages: string[];
  categoryId: string;
  category: { id: string; name: string; slug: string };
  color: string | null;
  origin: string | null;
  pattern: string | null;
  description: string | null;
  applications: string | null;
  variants: ErpVariant[];
  published: true;
  visibility: "visible";
  inStock: true;
};

export type PortfolioCategory = { id: string; name: string; slug: string; order: number };
export type PortfolioProject = {
  id: string;
  title: string;
  image: string;
  galleryImages: string[];
  categoryId: string;
  category: { id: string; name: string; slug: string };
  featured: boolean;
};

const apiBase = (process.env.ERP_PUBLIC_API_URL ?? "http://localhost:8080/api/v1").replace(/\/$/, "");

const PRODUCT_FALLBACKS = ["/image-produits-1.jpeg", "/image-produits-2.jpeg", "/image-produits-3.jpeg"];
const PORTFOLIO_FALLBACKS = ["/project-12.jpg", "/project-9.jpg", "/slide1.jpg", "/slide2.jpg", "/slide3.jpg"];

async function publicApi<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`ERP public API returned ${response.status} for ${path}`);
  return (await response.json() as ApiResponse<T>).data;
}

/**
 * Images are held in MinIO. The landing proxies the ERP's public image routes
 * so its browser clients never need an internal host, a storage URL, or a token.
 */
function minioAsset(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  const path = value.replace(/^https?:\/\/[^/]+/i, "");
  const apiImage = path.match(/^\/api\/v1\/uploads\/(images|base-gallery)\/(.+)$/i);
  if (apiImage) return `/api/erp/uploads/${apiImage[1]}/${apiImage[2]}`;
  const legacyGallery = path.match(/^\/(?:base-gallery|images)\/(.+)$/i);
  return legacyGallery ? `/api/erp/uploads/base-gallery/${legacyGallery[1]}` : fallback;
}

function fallbackFrom(id: string, choices: string[]): string {
  let hash = 0;
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return choices[hash % choices.length];
}

function product(product: ErpProduct): ProductRecord {
  const fallback = fallbackFrom(product.id, PRODUCT_FALLBACKS);
  const cover = minioAsset(product.coverImageUrl, fallback);
  const gallery = Array.from(new Set([
    ...product.galleryImageUrls.map((image) => minioAsset(image, fallback)),
    ...product.variants.flatMap((variant) => variant.galleryImageUrls.map((image) => minioAsset(image, fallback))),
  ])).filter((image) => image !== cover);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    regularPrice: null,
    images: cover,
    applicationImages: gallery,
    categoryId: product.categorySlug,
    category: { id: product.categorySlug, name: product.category, slug: product.categorySlug },
    color: product.color,
    origin: product.origin,
    pattern: product.pattern,
    description: product.description,
    applications: product.applications,
    variants: product.variants.map((variant) => ({
      ...variant,
      coverImageUrl: minioAsset(variant.coverImageUrl, fallback),
      galleryImageUrls: variant.galleryImageUrls.map((image) => minioAsset(image, fallback)),
    })),
    published: true,
    visibility: "visible",
    inStock: true,
  };
}

export async function getCategories(): Promise<CategoryRecord[]> {
  const categories = await publicApi<ErpCategory[]>("/public/catalog/categories");
  return categories.map((category) => ({
    id: category.slug,
    name: category.name,
    slug: category.slug,
    order: category.sortOrder,
    productCount: category.productCount,
  }));
}

export async function getProducts(category?: string): Promise<ProductRecord[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return (await publicApi<ErpProduct[]>(`/public/catalog/products${query}`)).map(product);
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const id = slug.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i)?.[1];
  if (id) return product(await publicApi<ErpProduct>(`/public/catalog/products/${id}`));
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getPortfolioCategories(): Promise<PortfolioCategory[]> {
  const categories = await publicApi<ErpPortfolioCategory[]>("/public/portfolio/categories");
  return categories.map((category) => ({ id: category.id, name: category.name, slug: category.slug, order: category.sortOrder }));
}

export async function getPortfolioProjects(featured?: boolean): Promise<PortfolioProject[]> {
  const query = featured ? "?featured=true" : "";
  const projects = await publicApi<ErpPortfolioProject[]>(`/public/portfolio/projects${query}`);
  return projects.map((project) => ({
    id: project.id,
    title: project.title,
    image: minioAsset(project.coverImageUrl, fallbackFrom(project.id, PORTFOLIO_FALLBACKS)),
    galleryImages: project.galleryImageUrls.map((image) => minioAsset(image, fallbackFrom(project.id, PORTFOLIO_FALLBACKS))),
    categoryId: project.categorySlug,
    category: { id: project.categorySlug, name: project.category, slug: project.categorySlug },
    featured: project.featured,
  }));
}

export function erpPublicApiBase(): string {
  return apiBase;
}

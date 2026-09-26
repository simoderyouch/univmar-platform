export type MaterialCategory = { id: string; name: string; slug: string; sortOrder: number; active: boolean; websiteVisible: boolean };
export type StoneType = string;

export type MaterialVariant = {
  id: string;
  variantName?: string;
  thicknessMm: number;
  format?: string;
  mainImageUrl?: string;
  galleryImageUrls: string[];
  active: boolean;
};

export type MaterialSummary = {
  id: string;
  name: string;
  commercialName?: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  stoneType: StoneType;
  origin?: string;
  color?: string;
  active: boolean;
  variantCount: number;
  mainImageUrl?: string;
};

export type Material = Omit<MaterialSummary, "variantCount"> & {
  pattern?: string;
  description?: string;
  applications?: string;
  variants: MaterialVariant[];
};

export type MaterialPage = {
  content: MaterialSummary[];
  page: number;
  totalElements: number;
  totalPages: number;
};

export type MaterialFormValues = {
  name: string;
  commercialName: string;
  sku: string;
  categoryId: string;
  stoneType: StoneType;
  origin: string;
  color: string;
  pattern: string;
  description: string;
  applications: string;
};

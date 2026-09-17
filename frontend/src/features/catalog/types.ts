export type StoneType = "MARBLE" | "GRANITE" | "TRAVERTINE" | "LIMESTONE" | "QUARTZITE" | "ONYX" | "OTHER";
export type Finish = "POLISHED" | "HONED" | "BRUSHED" | "LEATHERED" | "FLAMED" | "SANDBLASTED" | "OTHER";

export type MaterialVariant = {
  id: string;
  thicknessMm: number;
  finish: Finish;
  format?: string;
  active: boolean;
};

export type MaterialSummary = {
  id: string;
  name: string;
  commercialName?: string;
  sku: string;
  stoneType: StoneType;
  origin?: string;
  color?: string;
  mainImageUrl?: string;
  active: boolean;
  variantCount: number;
};

export type Material = Omit<MaterialSummary, "variantCount"> & {
  pattern?: string;
  description?: string;
  applications?: string;
  galleryImageUrls: string[];
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
  stoneType: StoneType;
  origin: string;
  color: string;
  pattern: string;
  description: string;
  applications: string;
  mainImageUrl: string;
  gallery: string;
};

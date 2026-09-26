import type { MaterialFormValues, StoneType } from "./types";

export const stoneTypes: StoneType[] = ["MARBLE", "GRANITE", "TRAVERTINE", "LIMESTONE", "QUARTZITE", "ONYX", "STONE", "OTHER"];

export const emptyMaterialForm: MaterialFormValues = {
  name: "",
  commercialName: "",
  sku: "",
  categoryId: "",
  stoneType: "",
  origin: "",
  color: "",
  pattern: "",
  description: "",
  applications: "",
};

export function formatCatalogLabel(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

import type { Finish, MaterialFormValues, StoneType } from "./types";

export const stoneTypes: StoneType[] = ["MARBLE", "GRANITE", "TRAVERTINE", "LIMESTONE", "QUARTZITE", "ONYX", "OTHER"];
export const finishes: Finish[] = ["POLISHED", "HONED", "BRUSHED", "LEATHERED", "FLAMED", "SANDBLASTED", "OTHER"];

export const emptyMaterialForm: MaterialFormValues = {
  name: "",
  commercialName: "",
  sku: "",
  stoneType: "MARBLE",
  origin: "",
  color: "",
  pattern: "",
  description: "",
  applications: "",
  mainImageUrl: "",
  gallery: "",
};

export function formatCatalogLabel(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

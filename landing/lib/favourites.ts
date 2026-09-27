export type SavedMaterial = {
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  category: string;
  image: string;
  addedAt: string;
};

const KEY = "univmar.saved-materials.v1";
const EVENT = "univmar:saved-materials";

export function readSavedMaterials(): SavedMaterial[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as SavedMaterial[];
    return Array.isArray(parsed) ? parsed.slice(0, 12) : [];
  } catch { return []; }
}

export function writeSavedMaterials(items: SavedMaterial[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, 12)));
  window.dispatchEvent(new Event(EVENT));
}

export function toggleSavedMaterial(item: SavedMaterial) {
  const current = readSavedMaterials();
  const existing = current.some((saved) => saved.variantId === item.variantId);
  writeSavedMaterials(existing ? current.filter((saved) => saved.variantId !== item.variantId) : [...current, item]);
  return !existing;
}

export function savedMaterialEvents(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(EVENT, callback); window.removeEventListener("storage", callback); };
}

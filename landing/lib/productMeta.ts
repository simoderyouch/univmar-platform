export type ProductColor =
  | "beige"
  | "blanc"
  | "gris"
  | "noir"
  | "rose"
  | "rouge"
  | "marron"
  | "jaune"
  | "orange"
  | "vert"
  | "bleu"
  | "violet"
  | "dore";

export const PRODUCT_COLORS: ProductColor[] = [
  "beige",
  "blanc",
  "gris",
  "noir",
  "rose",
  "rouge",
  "marron",
  "jaune",
  "orange",
  "vert",
  "bleu",
  "violet",
  "dore",
];

const TOKEN_TO_COLOR: Record<string, ProductColor> = {
  beige: "beige",
  blanc: "blanc",
  balnc: "blanc",
  balanc: "blanc",
  white: "blanc",
  gris: "gris",
  grey: "gris",
  gray: "gris",
  noir: "noir",
  black: "noir",
  negro: "noir",
  rose: "rose",
  rouge: "rouge",
  rosso: "rouge",
  marron: "marron",
  brown: "marron",
  jaune: "jaune",
  orange: "orange",
  vert: "vert",
  verdatre: "vert",
  bleu: "bleu",
  blue: "bleu",
  violet: "violet",
  dore: "dore",
};

function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getTokens(name: string): string[] {
  return normalizeName(name).split(/[\s_\-./]+/).filter(Boolean);
}

/** First colour word found in the title (left to right). */
export function inferProductColor(name: string): ProductColor | null {
  for (const token of getTokens(name)) {
    const color = TOKEN_TO_COLOR[token];
    if (color) return color;
  }

  return null;
}

export function countProductsByColor(
  products: { name: string }[],
): Record<ProductColor, number> {
  const counts = Object.fromEntries(
    PRODUCT_COLORS.map((color) => [color, 0]),
  ) as Record<ProductColor, number>;

  for (const product of products) {
    const color = inferProductColor(product.name);
    if (color) counts[color] += 1;
  }

  return counts;
}

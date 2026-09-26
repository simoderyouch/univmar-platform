import fr from "@/dictionaries/fr";
import en from "@/dictionaries/en";
import ar from "@/dictionaries/ar";
import type { Lang } from "@/lib/i18n";

const dicts = { fr, en, ar } as const;

export function getDictionary(lang: Lang) {
  return dicts[lang];
}

export type Dictionary = typeof fr;

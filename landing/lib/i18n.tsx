"use client";

import React, { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import fr from "@/dictionaries/fr";
import en from "@/dictionaries/en";
import ar from "@/dictionaries/ar";
import { isLocale, localePath, type Locale } from "@/lib/site";
import { notoSansArabic } from "@/lib/fonts";

export type Lang = Locale;

type Dict = Omit<typeof fr, "dir"> & { dir: "ltr" | "rtl" };
const dicts: Record<Lang, Dict> = { fr, en, ar };

function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "";
  }
  return pathname === "/" ? "" : pathname;
}

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
  lp: (path?: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: "fr",
  setLang: () => {},
  t: fr,
  lp: (path = "") => localePath("fr", path),
});

export function LangProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const pathWithoutLocale = stripLocaleFromPathname(pathname);

  const setLang = (next: Lang) => {
    localStorage.setItem("univmar-lang", next);
    router.push(localePath(next, pathWithoutLocale));
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dicts[lang].dir;
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.classList.toggle(notoSansArabic.variable, lang === "ar");
    localStorage.setItem("univmar-lang", lang);
  }, [lang]);

  const lp = (path = "") => localePath(lang, path);

  return (
    <LangContext.Provider value={{ lang, setLang, t: dicts[lang], lp }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function useLocalePath() {
  const { lp } = useLang();
  return lp;
}

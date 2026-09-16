import { notFound } from "next/navigation";
import { LangProvider } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { HtmlLang } from "@/components/seo/HtmlLang";
import { globalSchemas } from "@/lib/seo/schema";
import { isLocale, LOCALES, type Locale } from "@/lib/site";
import { notoSansArabic } from "@/lib/fonts";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: Props) {
  const { lang: langParam } = await params;
  if (!isLocale(langParam)) notFound();

  const lang = langParam as Locale;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LangProvider lang={lang}>
      <HtmlLang lang={lang} dir={dir} />
      <JsonLd data={globalSchemas(lang)} />
      <div className={lang === "ar" ? notoSansArabic.className : undefined}>
        {children}
      </div>
    </LangProvider>
  );
}

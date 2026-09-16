import { CONTACT_WHATSAPP } from "@/lib/contact";
import type { Lang } from "@/lib/i18n";
import { localePath } from "@/lib/site";

export function buildProductContactHref(
  productName: string,
  category?: string,
  lang: Lang = "fr",
) {
  const params = new URLSearchParams({
    product: productName,
    intent: "quote",
  });
  if (category) params.set("category", category);
  return `${localePath(lang, "/contact")}?${params.toString()}`;
}

export function buildMultiProductContactHref(
  items: { name: string; category?: string }[],
  lang: Lang = "fr",
) {
  const params = new URLSearchParams({
    intent: "quote",
    product: items.map((item) => item.name).join(", "),
  });

  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))];
  if (categories.length > 0) {
    params.set("category", categories.join(", "));
  }

  return `${localePath(lang, "/contact")}?${params.toString()}`;
}

export function buildMultiProductInquiryMessage(
  items: { name: string; category?: string }[],
  lang: Lang,
) {
  const list = items
    .map((item) => (item.category ? `${item.name} (${item.category})` : item.name))
    .join("\n• ");

  if (lang === "en") {
    return `Hello,\n\nI am interested in the following materials:\n• ${list}\n\nPlease send me a quote.`;
  }

  if (lang === "ar") {
    return `مرحباً،\n\nأنا مهتم بالمواد التالية:\n• ${list}\n\nيرجى إرسال عرض سعر لي.`;
  }

  return `Bonjour,\n\nJe suis intéressé(e) par les matériaux suivants :\n• ${list}\n\nMerci de me contacter pour un devis.`;
}

export function buildProductWhatsAppHref(
  productName: string,
  categoryLabel: string,
  lang: Lang,
) {
  const message = {
    fr: `Bonjour, je souhaite un devis pour le matériau : ${productName} (${categoryLabel}).`,
    en: `Hello, I would like a quote for: ${productName} (${categoryLabel}).`,
    ar: `مرحباً، أود الحصول على عرض سعر للمادة: ${productName} (${categoryLabel}).`,
  }[lang];

  return `${CONTACT_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function buildProductInquiryMessage(
  productName: string,
  category: string | null,
  lang: Lang,
) {
  const suffix = category ? ` (${category})` : "";

  if (lang === "en") {
    return `Hello,\n\nI am interested in: ${productName}${suffix}.\n\nPlease send me a quote.`;
  }

  if (lang === "ar") {
    return `مرحباً،\n\nأنا مهتم بالمادة: ${productName}${suffix}.\n\nيرجى إرسال عرض سعر لي.`;
  }

  return `Bonjour,\n\nJe suis intéressé(e) par le matériau : ${productName}${suffix}.\n\nMerci de me contacter pour un devis.`;
}

export function quoteSubjectForLang(lang: Lang) {
  return {
    fr: "Demande de devis",
    en: "Quote request",
    ar: "طلب عرض سعر",
  }[lang];
}

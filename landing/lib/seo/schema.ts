import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_INSTAGRAM,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP,
} from "@/lib/contact";
import { SITE_NAME, SITE_URL, absoluteUrl, localePath, type Locale } from "@/lib/site";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/univmar-logo.png"),
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    sameAs: [CONTACT_INSTAGRAM],
  };
}

export function websiteSchema(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(localePath(lang)),
  };
}

export function localBusinessSchema() {
  const services = [
    "Fourniture de marbre au Maroc",
    "Fourniture de granit au Maroc",
    "Pierre naturelle pour façade",
    "Pierre de Taza beige et grise",
    "Plans de travail en granit et quartz",
    "Découpe et finition de pierre naturelle",
    "Livraison Rabat, Temara, Casablanca et Taza",
  ];

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: `${SITE_NAME} - Marbre et pierre naturelle`,
    image: absoluteUrl("/univmar-logo.png"),
    url: SITE_URL,
    telephone: CONTACT_PHONE_TEL,
    email: CONTACT_EMAIL,
    priceRange: "Sur devis",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Atelier 2, Ouled Slama, Ain Atiq",
      addressLocality: "Temara",
      addressRegion: "Rabat-Salé-Kénitra",
      addressCountry: "MA",
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_ADDRESS)}`,
    areaServed: [
      { "@type": "City", name: "Temara" },
      { "@type": "City", name: "Rabat" },
      { "@type": "City", name: "Casablanca" },
      { "@type": "City", name: "Taza" },
      { "@type": "Country", name: "Morocco" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: CONTACT_PHONE_TEL,
        contactType: "customer service",
        areaServed: "MA",
        availableLanguage: ["fr", "ar", "en"],
      },
      {
        "@type": "ContactPoint",
        url: CONTACT_WHATSAPP,
        contactType: "WhatsApp",
        areaServed: "MA",
        availableLanguage: ["fr", "ar", "en"],
      },
    ],
    knowsAbout: services,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services marbre, granit et pierre naturelle UNIVMAR",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service,
          areaServed: "Morocco",
        },
      })),
    },
    description:
      "UNIVMAR est une marbrerie à Temara spécialisée dans le marbre, le granit, la pierre naturelle, la pierre de Taza, le quartz et l'onyx pour projets architecturaux au Maroc.",
    sameAs: [CONTACT_INSTAGRAM],
  };
}

export function globalSchemas(lang: Locale) {
  return [organizationSchema(), websiteSchema(lang), localBusinessSchema()];
}

type ProductSchemaInput = {
  name: string;
  description: string;
  image: string | string[];
  category: string;
  url: string;
};

export function productSchema({ name, description, image, category, url }: ProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    category,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    url,
  };
}

export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

type ArticleSchemaInput = {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
};

export function articleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/univmar-logo.png"),
      },
    },
  };
}

type WebPageSchemaInput = {
  name: string;
  description: string;
  url: string;
  dateModified: string;
};

/**
 * Use for maintained service and editorial landing pages. This is emitted by
 * the server so crawlers receive the date in the initial HTML response.
 */
export function webPageSchema({ name, description, url, dateModified }: WebPageSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    dateModified,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

type BreadcrumbItem = { name: string; path: string };

export function breadcrumbSchema(lang: Locale, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localePath(lang, item.path)),
    })),
  };
}

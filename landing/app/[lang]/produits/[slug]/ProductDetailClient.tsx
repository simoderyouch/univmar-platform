"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang, useLocalePath } from "@/lib/i18n";
import { inferProductColor } from "@/lib/productMeta";
import { buildProductContactHref, buildProductWhatsAppHref } from "@/lib/productContact";
import { trackEvent } from "@/lib/analytics";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import type { ProductRecord } from "@/lib/products";
import type { Lang } from "@/lib/i18n";
import type { ProductSeoContent } from "@/lib/productSeo";

export default function ProductDetailClient({
  product,
  categoryLabel,
  lang,
  seoContent,
  relatedProducts,
}: {
  product: ProductRecord;
  categoryLabel: string;
  lang: Lang;
  seoContent: ProductSeoContent | null;
  relatedProducts: { id: number; name: string; href: string }[];
}) {
  const { t } = useLang();
  const lp = useLocalePath();
  const color = inferProductColor(product.name);
  const colorLabel = color ? t.products.colors[color] : null;

  const quoteHref = buildProductContactHref(product.name, categoryLabel, lang);
  const whatsappHref = buildProductWhatsAppHref(product.name, categoryLabel, lang);

  const description = t.seo.productTemplate.descriptionTemplate
    .replace("{name}", product.name)
    .replace("{category}", categoryLabel);

  const galleryImages = [product.images, ...(product.applicationImages ?? [])];
  const slideLabels = [
    { fr: "Matériau", en: "Material", ar: "المادة" }[lang],
    ...Array.from({ length: Math.max(0, galleryImages.length - 1) }, () =>
      t.seoContent.applications,
    ),
  ];
  const relatedTitle = { fr: "Produits associés", en: "Related products", ar: "منتجات ذات صلة" }[lang];
  const faqTitle = { fr: "Questions fréquentes", en: "Frequently asked questions", ar: "أسئلة شائعة" }[lang];

  return (
    <>
      <Navbar />
      <article className="product-detail">
        <div className="product-detail__inner">
          <ScrollReveal as="nav" className="product-detail__breadcrumb" aria-label="Breadcrumb">
            <Link href={lp()}>{t.nav.home}</Link>
            <span aria-hidden>/</span>
            <Link href={lp("/produits")}>{t.nav.products}</Link>
            <span aria-hidden>/</span>
            <span>{product.name}</span>
          </ScrollReveal>

          <div className="product-detail__grid">
            <ScrollReveal className="product-detail__visuals" direction="right">
              <div className="product-detail__media">
                <ProductImageCarousel
                  images={galleryImages}
                  alt={seoContent?.imageAlt ?? `${product.name} — ${categoryLabel} UNIVMAR`}
                  slideLabels={slideLabels}
                  className="product-detail__carousel"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal className="product-detail__info" direction="left" delay={0.12}>
              <p className="eyebrow">{categoryLabel}</p>
              <h1 className="product-detail__title">{product.name}</h1>
              <div className="product-detail__tags">
                <span className="catalog-tile__tag">{categoryLabel}</span>
                {colorLabel ? (
                  <span className={`catalog-tile__tag catalog-tile__tag--${color}`}>
                    {colorLabel}
                  </span>
                ) : null}
              </div>
              <p className="product-detail__desc">{description}</p>

              <div className="product-detail__actions">
                <Link
                  href={quoteHref}
                  className="btn-gold"
                  onClick={() => trackEvent("contact_click", { method: "quote", location: "product_page", product: product.name })}
                >
                  {t.products.requestQuote}
                </Link>
                <a
                  href={whatsappHref}
                  className="btn-outline"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("contact_click", { method: "whatsapp", location: "product_page", product: product.name })}
                >
                  {t.cta.whatsapp}
                </a>
              </div>

              <Link href={lp("/produits")} className="product-detail__back">
                ← {t.products.viewAll}
              </Link>
            </ScrollReveal>
          </div>

          {seoContent ? (
            <ScrollReveal as="section" className="product-detail__seo">
              <div className="product-detail__seo-main">
                <h2>{seoContent.title}</h2>
                {seoContent.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <aside className="product-detail__seo-aside" aria-label="Informations matière">
                <ul>
                  {seoContent.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </aside>
            </ScrollReveal>
          ) : null}

          {relatedProducts.length ? (
            <ScrollReveal as="section" className="product-detail__related">
              <h2>{relatedTitle}</h2>
              <div className="product-detail__related-list">
                {relatedProducts.map((item) => (
                  <Link key={item.id} href={item.href} className="product-detail__related-link">
                    {item.name}
                  </Link>
                ))}
                <Link href={lp("/contact")} className="product-detail__related-link product-detail__related-link--cta">
                  {t.products.requestQuote}
                </Link>
              </div>
            </ScrollReveal>
          ) : null}

          {seoContent ? (
            <ScrollReveal as="section" className="product-detail__faq">
              <h2>{faqTitle}</h2>
              {seoContent.faq.map((item) => (
                <details key={item.q} className="seo-content-page__faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </ScrollReveal>
          ) : null}
        </div>
      </article>
      <Footer />
    </>
  );
}

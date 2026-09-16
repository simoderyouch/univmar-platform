"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { useLang, useLocalePath } from "@/lib/i18n";
import type { SeoPageContent } from "@/data/seo-pages";

export default function SeoContentPage({ content }: { content: SeoPageContent }) {
  const { t, lang } = useLang();
  const lp = useLocalePath();
  const updatedLabel = lang === "ar" ? "آخر تحديث" : lang === "en" ? "Updated" : "Mis à jour le";
  const dateLocale = lang === "ar" ? "ar-MA" : lang === "en" ? "en-GB" : "fr-FR";

  return (
    <>
      <Navbar />
      <article className="seo-content-page">
        <div className="seo-content-page__inner">
          <Breadcrumbs
            items={[
              { label: t.nav.home, href: "/" },
              { label: content.h1 },
            ]}
          />
        </div>
        <header className="seo-content-page__hero">
          <ScrollReveal className="seo-content-page__inner">
            <p className="eyebrow">UNIVMAR</p>
            <h1 className="seo-content-page__title">{content.h1}</h1>
            <div className="gold-divider" />
            <p className="seo-content-page__intro">{content.intro}</p>
            {content.dateModified ? (
              <time className="seo-content-page__updated" dateTime={content.dateModified}>
                {updatedLabel} {new Date(`${content.dateModified}T12:00:00Z`).toLocaleDateString(dateLocale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            ) : null}
          </ScrollReveal>
        </header>

        <div className="seo-content-page__body">
          <div className="seo-content-page__inner">
            {content.sections.map((section, index) => (
              <ScrollReveal as="section" key={section.title} className="seo-content-page__section">
                <h2>{section.title}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {content.imageSources?.[index] ? (
                  <figure className="seo-content-page__figure">
                    <img
                      src={content.imageSources[index]}
                      alt={`${content.h1} — ${section.title}`}
                      title={`${content.h1} — ${section.title}`}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </figure>
                ) : null}
              </ScrollReveal>
            ))}

            <ScrollReveal as="section" className="seo-content-page__section">
              <h2>{t.seoContent.applications}</h2>
              <ul className="seo-content-page__tags">
                {content.applications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal as="section" className="seo-content-page__section">
              <h2>{content.whyTitle}</h2>
              <ul className="seo-content-page__list">
                {content.whyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </ScrollReveal>

            {content.internalLinks?.length ? (
              <ScrollReveal as="section" className="seo-content-page__section">
                <h2>{lang === "ar" ? "اكتشفوا أيضاً" : lang === "en" ? "Explore further" : "À explorer aussi"}</h2>
                <div className="seo-content-page__links">
                  {content.internalLinks.map((item) => (
                    <Link key={`${item.href}-${item.label}`} href={lp(item.href)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </ScrollReveal>
            ) : null}

            <ScrollReveal as="section" className="seo-content-page__section">
              <h2>{t.seoContent.faq}</h2>
              <div className="seo-content-page__faq">
                {content.faq.map((item) => (
                  <details key={item.q} className="seo-content-page__faq-item">
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal className="seo-content-page__cta">
              <Link href={lp("/contact")} className="btn-gold">
                {t.nav.quote} →
              </Link>
              <Link href={lp("/produits")} className="btn-outline">
                {t.hero.cta} →
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}

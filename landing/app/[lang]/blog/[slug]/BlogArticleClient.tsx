"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang, useLocalePath } from "@/lib/i18n";
import type { BlogPost } from "@/content/blog/posts";

export default function BlogArticleClient({ post }: { post: BlogPost }) {
  const { t, lang } = useLang();
  const lp = useLocalePath();
  const c = post.content[lang];
  const images = post.images?.[lang] ?? [];
  const faqs = post.faqs?.[lang] ?? [];
  const relatedLinks = post.relatedLinks?.[lang] ?? [];
  const dateLocale = lang === "ar" ? "ar-MA" : lang === "en" ? "en-GB" : "fr-FR";
  const hasSubstantiveUpdate = Boolean(post.dateModified && post.dateModified !== post.datePublished);
  const publishedLabel = lang === "ar" ? "نُشر في" : lang === "en" ? "Published" : "Publié le";
  const updatedLabel = lang === "ar" ? "آخر تحديث" : lang === "en" ? "Updated" : "Mis à jour le";

  return (
    <>
      <Navbar />
      <article className="blog-article">
        <div className="blog-article__inner">
          <ScrollReveal as="nav" className="blog-article__breadcrumb" aria-label="Breadcrumb">
            <Link href={lp()}>{t.nav.home}</Link>
            <span aria-hidden>/</span>
            <Link href={lp("/blog")}>Blog</Link>
            <span aria-hidden>/</span>
            <span>{c.title}</span>
          </ScrollReveal>

          <ScrollReveal as="header" className="blog-article__header">
            <div className="blog-article__dates">
              <time dateTime={post.datePublished} itemProp="datePublished">
                {publishedLabel} {new Date(`${post.datePublished}T12:00:00Z`).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })}
              </time>
              {hasSubstantiveUpdate ? (
                <time dateTime={post.dateModified} itemProp="dateModified">
                  {updatedLabel} {new Date(`${post.dateModified}T12:00:00Z`).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })}
                </time>
              ) : (
                <meta itemProp="dateModified" content={post.datePublished} />
              )}
            </div>
            <h1>{c.title}</h1>
            <p className="blog-article__lead">{c.excerpt}</p>
          </ScrollReveal>

          <div className="blog-article__body">
            {c.sections.map((section, index) => (
              <ScrollReveal as="section" key={section.heading} className="blog-article__section">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((para) => (
                  <p key={para.slice(0, 48)}>{para}</p>
                ))}
                {section.bullets && section.bullets.length > 0 ? (
                  <ul className="blog-article__list">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {images[index] ? (
                  <figure className="blog-article__figure">
                    <img
                      src={images[index].src}
                      alt={images[index].alt}
                      title={images[index].alt}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    {images[index].caption ? (
                      <figcaption>{images[index].caption}</figcaption>
                    ) : null}
                  </figure>
                ) : null}
              </ScrollReveal>
            ))}
          </div>

          {faqs.length ? (
            <ScrollReveal as="section" className="blog-article__faq" aria-labelledby="blog-faq-heading">
              <h2 id="blog-faq-heading">{lang === "ar" ? "الأسئلة الشائعة" : lang === "en" ? "Frequently asked questions" : "Questions fréquentes"}</h2>
              {faqs.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </ScrollReveal>
          ) : null}

          {relatedLinks.length ? (
            <ScrollReveal as="section" className="blog-article__related" aria-label="Related resources">
              <h2>{lang === "ar" ? "صفحات مفيدة لمشروعكم" : lang === "en" ? "Useful pages for your project" : "Pages utiles pour votre projet"}</h2>
              <ul>
                {relatedLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={lp(item.href)}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ) : null}

          <ScrollReveal as="footer" className="blog-article__footer">
            <Link href={lp("/contact")} className="btn-gold">
              {t.cta.btn}
            </Link>
            <Link href={lp("/blog")} className="blog-article__back">
              ← Blog
            </Link>
          </ScrollReveal>
        </div>
      </article>
      <Footer />
    </>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang, useLocalePath } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ServiceIcon, { ProcessStepIcon } from "@/components/ServiceIcon";
import type { SiteStats } from "@/lib/siteStats";
import { withSiteStats, yearsWithPlus } from "@/lib/siteStats";

function PillarIcon({ index }: { index: number }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (index) {
    case 0:
      return (
        <svg {...props}>
          <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 17.8 5.7 21l2.3-7-6-4.6h7.6z" />
        </svg>
      );
    case 1:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
  }
}

const PILLAR_IDS = ["vision", "mission", "conviction"] as const;

const PILLAR_IMAGES = [
  { src: "/s.jpeg", position: "center bottom" },
  { src: "/WhatsApp Image 2026-06-27 at 14.47.48.jpeg", position: "center center" },
  { src: "/project-12.jpg", position: "center center" },
] as const;

const HERO_CAROUSEL_IMAGES = [
  { src: "/slide2.jpg", position: "center top" },
  { src: "/slide3.jpg", position: "center top" },
  { src: "/image-produits-2.jpeg", position: "center center" },
  { src: "/slide1.jpg", position: "center center" },
] as const;

const ABOUT_SERVICE_IMAGES = ["/1.jpeg", "/2.jpeg", "/3.jpeg", "/4.jpeg"] as const;
const ABOUT_SERVICE_ORDER = [0, 1, 3, 2] as const;

type Props = { stats: SiteStats };

export default function AProposPage({ stats }: Props) {
  const { t } = useLang();
  const lp = useLocalePath();
  const storyRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const [titleLine1, titleLine2] = t.aboutPage.title.split("\n");
  const pillarsHeadline = t.aboutPage.pillars.headline.split("\n");
  const servicesHeadline = t.aboutPage.services.headline.split("\n");
  const [processLine1, processLine2] = t.aboutPage.services.process.headline.split("\n");
  const [ctaLine1, ctaLine2] = t.aboutPage.ctaTitle.split("\n");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % HERO_CAROUSEL_IMAGES.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Navbar />

      <section className="about-page-hero">
        <div className="about-page-hero__glow" aria-hidden />
        <div className="about-page-hero__inner">
          <div className="about-page-hero__grid">
            <motion.div
              className="about-page-hero__content"
              initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="eyebrow about-page-hero__eyebrow">{t.aboutPage.eyebrow}</p>
              <h1 className="about-page-hero__title">
                {titleLine1}
                {titleLine2 ? (
                  <>
                    <br />
                    <em>{titleLine2}</em>
                  </>
                ) : null}
              </h1>
              <div className="gold-divider about-page-hero__divider" />
              <p className="about-page-hero__subtitle">{t.aboutPage.subtitle}</p>
              <div className="about-page-hero__actions">
                <Link href={lp("/contact")} className="btn-primary">
                  {t.nav.quote}
                </Link>
                <button type="button" className="about-page-hero__scroll btn-outline" onClick={scrollToStory}>
                  {t.aboutPage.heroCta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </button>
              </div>
            </motion.div>

            <motion.div
              className="about-page-hero__visual"
              initial={{ opacity: 0, x: 28, scale: 0.96, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            >
              <div className="about-page-hero__carousel">
                <div className="about-page-hero__image-wrap">
                  {HERO_CAROUSEL_IMAGES.map((slide, i) => (
                    <Image
                      key={slide.src}
                      src={slide.src}
                      alt={`${t.about.imageAlt} - ${t.aboutPage.materials[i] ?? t.aboutPage.materialsLabel}`}
                      title={`${t.about.imageAlt} - ${t.aboutPage.materials[i] ?? t.aboutPage.materialsLabel}`}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 900px) 100vw, 560px"
                      className={`about-page-hero__image${i === activeHeroSlide ? " is-active" : ""}`}
                      style={{ objectPosition: slide.position }}
                    />
                  ))}
                  <div className="about-page-hero__shade" aria-hidden />
                  <div className="about-page-hero__pulse" aria-hidden />
                </div>

                <div className="about-page-hero__thumbs" aria-label={t.aboutPage.materialsLabel}>
                  {HERO_CAROUSEL_IMAGES.map((slide, i) => (
                    <button
                      key={slide.src}
                      type="button"
                      className={`about-page-hero__thumb${i === activeHeroSlide ? " is-active" : ""}`}
                      onClick={() => setActiveHeroSlide(i)}
                      aria-label={t.aboutPage.materials[i] ?? t.aboutPage.materialsLabel}
                      aria-pressed={i === activeHeroSlide}
                    >
                      <Image
                        src={slide.src}
                        alt=""
                        title={t.aboutPage.materials[i] ?? t.aboutPage.materialsLabel}
                        fill
                        sizes="96px"
                        className="about-page-hero__thumb-image"
                        style={{ objectPosition: slide.position }}
                      />
                      <span className="about-page-hero__thumb-progress" aria-hidden />
                    </button>
                  ))}
                </div>
              </div>
              <div className="about-page-hero__frame" aria-hidden />
            </motion.div>
          </div>
        </div>
      </section>

      <section ref={storyRef} id="story" className="about-page-story">
        <div className="about-page-story__inner about-page-story__grid">
          <ScrollReveal className="about-page-story__visual" direction="right">
            
            <div className="about-page-story__main">
              <Image
                src="/about-us-01.jpeg"
                alt={t.about.imageAlt}
                title={t.about.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
              <div className="about-page-story__shade" aria-hidden />
            </div>
            <div className="about-page-story__badge">
              <span className="about-page-story__badge-val">{yearsWithPlus(stats.years)}</span>
              <span className="about-page-story__badge-label">{t.stats.years}</span>
            </div>
            <div className="about-page-story__frame" aria-hidden />
          </ScrollReveal>

          <ScrollReveal className="about-page-story__content" direction="left" delay={0.12}>
            <p className="eyebrow about-page-story__eyebrow">Qui sommes-nous ?</p>
            <h2 className="about-page-story__title">L'Excellence de la Matière, de la Carrière à l'Architecture</h2>
            <div className="gold-divider about-page-story__divider" />
            <p className="about-page-story__text">
              Spécialiste de la pierre naturelle depuis plusieurs générations, notre entreprise s'impose comme un acteur majeur du secteur grâce à une maîtrise intégrée de l'ensemble de la chaîne de valeur.
            </p>
            <p className="about-page-story__text">
              De l'extraction rigoureuse au sein de nos carrières partenaires jusqu'à la distribution internationale, en passant par un traitement industriel de haute précision, nous façonnons des matériaux d'exception.
            </p>
            <p className="about-page-story__text">
              Alliant savoir-faire traditionnel et technologies de pointe, nous transformons la pierre brute en solutions architecturales uniques, capables de sublimer et de pérenniser vos projets les plus ambitieux.
            </p>

            <div className="about-page-story__milestones">
              {t.about.milestones.map((label) => (
                <span key={label} className="about-page-story__chip">
                  {label}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="about-pillars-intro">
        <ScrollReveal className="about-pillars-intro__inner">
          <p className="eyebrow about-pillars-intro__eyebrow">{t.aboutPage.pillars.title}</p>
          <h2 className="about-pillars-intro__title">
            {pillarsHeadline[0]}
            {pillarsHeadline[1] ? (
              <>
                <br />
                <em>{pillarsHeadline[1]}</em>
              </>
            ) : null}
          </h2>
        </ScrollReveal>
      </section>

      {t.aboutPage.pillars.items.map((item, i) => {
        const pillarId = PILLAR_IDS[i];
        const image = PILLAR_IMAGES[i];
        const [accentLine1, accentLine2] = item.accent.split("\n");
        const isReversed = i % 2 === 1;

        return (
          <section
            key={pillarId}
            id={pillarId}
            className={`about-pillar about-pillar--${pillarId}${isReversed ? " about-pillar--reverse" : ""}`}
          >
            <div className="about-pillar__inner">
              <motion.div
                className="about-pillar__visual"
                initial={{ opacity: 0, x: isReversed ? 32 : -32, scale: 0.96, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: false, margin: "-80px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <span className="about-pillar__ghost" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="about-pillar__image-wrap">
                  <Image
                    src={image.src}
                    alt={item.title}
                    title={item.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{ objectFit: "cover", objectPosition: image.position }}
                  />
                  <div className="about-pillar__image-shade" aria-hidden />
                </div>
                <div className="about-pillar__icon">
                  <PillarIcon index={i} />
                </div>
              </motion.div>

              <motion.div
                className="about-pillar__content"
                initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: false, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              >
                <p className="eyebrow about-pillar__eyebrow">{item.title}</p>
                <h3 className="about-pillar__accent">
                  {accentLine1}
                  {accentLine2 ? (
                    <>
                      <br />
                      <em>{accentLine2}</em>
                    </>
                  ) : null}
                </h3>
                <div className="gold-divider about-pillar__divider" />
                <p className="about-pillar__desc">{item.desc}</p>
                <ul className="about-pillar__highlights">
                  {item.highlights.map((point) => (
                    <li key={point} className="about-pillar__highlight">
                      <span className="about-pillar__highlight-mark" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </section>
        );
      })}

      <section ref={servicesRef} id="services" className="services-page-grid-section">
        <div className="services-page-grid-section__inner">
          <ScrollReveal className="about-page-services__header">
            <p className="eyebrow">{t.aboutPage.services.eyebrow}</p>
            <h2 className="about-page-services__title">
              {servicesHeadline[0]}
              {servicesHeadline[1] ? (
                <>
                  <br />
                  <em>{servicesHeadline[1]}</em>
                </>
              ) : null}
            </h2>
            <p className="about-page-services__subtitle">{t.aboutPage.services.subtitle}</p>
          </ScrollReveal>

          <div className="services-page-grid services-page-grid--four about-page-services__list">
            {ABOUT_SERVICE_ORDER.map((serviceIndex, i) => {
              const item = t.services.items[serviceIndex];

              return (
              <ScrollReveal key={item.title} className="services-page-card about-page-services__card" delay={i * 0.08}>
                <div className="about-page-services__media">
                  <Image
                    src={ABOUT_SERVICE_IMAGES[serviceIndex] ?? ABOUT_SERVICE_IMAGES[0]}
                    alt={item.title}
                    title={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="about-page-services__image"
                  />
                </div>
                <div className="about-page-services__body">
                  <span className="services-page-card__index" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="services-page-card__icon">
                    <ServiceIcon index={serviceIndex} width={24} height={24} />
                  </div>
                  <h3 className="services-page-card__title">{item.title}</h3>
                  <p className="services-page-card__desc">{item.desc}</p>
                  <span className="services-page-card__line" aria-hidden />
                </div>
              </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="services-page-process">
        <div className="services-page-process__inner">
          <ScrollReveal className="services-page-process__header">
            <p className="eyebrow services-page-process__eyebrow">{t.aboutPage.services.process.title}</p>
            <h2 className="services-page-process__title">
              {processLine1}
              {processLine2 ? (
                <>
                  <br />
                  <em>{processLine2}</em>
                </>
              ) : null}
            </h2>
          </ScrollReveal>

          <div className="services-page-path">
            <div className="services-page-path__rail" aria-hidden />
            {t.aboutPage.services.process.steps.map((step, i) => (
              <ScrollReveal key={step.num} className="services-page-path__step" delay={i * 0.08}>
                <div className="services-page-path__node">
                  <span className="services-page-path__icon">
                    <ProcessStepIcon index={i} />
                  </span>
                  <span className="services-page-path__num">{step.num}</span>
                </div>
                <div className="services-page-path__card">
                  <h3 className="services-page-path__title">{step.title}</h3>
                  <p className="services-page-path__desc">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="atouts" className="about-strengths">
        <div className="about-strengths__inner">
          <ScrollReveal className="about-strengths__header">
            <p className="eyebrow about-strengths__eyebrow">{t.aboutPage.strengths.title}</p>
            <h2 className="about-strengths__title">{t.aboutPage.strengths.subtitle}</h2>
          </ScrollReveal>

          <div className="about-strengths__grid">
            {t.aboutPage.strengths.items.map((item, i) => (
              <ScrollReveal key={item.title} className="about-strengths__card" delay={i * 0.08}>
                <h3 className="about-strengths__card-title">{withSiteStats(item.title, stats)}</h3>
                <p className="about-strengths__card-desc">{item.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-page-cta">
        <ScrollReveal className="about-page-cta__inner">
          <h2 className="about-page-cta__title">
            {ctaLine1}
            {ctaLine2 ? (
              <>
                <br />
                <em>{ctaLine2}</em>
              </>
            ) : null}
          </h2>
          <p className="about-page-cta__subtitle">{t.aboutPage.ctaSubtitle}</p>
          <div className="about-page-cta__actions">
            <Link href={lp("/contact")} className="btn-gold">
              {t.cta.btn}
            </Link>
            <Link href={lp("/produits")} className="btn-outline">
              {t.nav.products}
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </>
  );
}

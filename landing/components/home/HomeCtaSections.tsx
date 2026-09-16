"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useLang } from "@/lib/i18n";

const sectionViewport = { once: false, margin: "-120px" } as const;

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.96, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.72, ease: "easeOut" } },
};

export function HomeCtaSection() {
  const { t, lp } = useLang();
  const content = t.homePage.cta;
  return (
    <section className="home-cta-band" aria-labelledby="home-cta-heading">
      <motion.div
        className="home-cta-band__inner"
        variants={ctaVariants}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
      >
        <h2 id="home-cta-heading" className="home-cta-band__title">
          {content.title}
        </h2>
        <p className="home-cta-band__subtitle">{content.subtitle}</p>
        <div className="home-cta-band__actions">
          <Link href={lp("/produits")} className="btn-gold">
            {content.btn}
          </Link>
          <Link href={lp("/contact")} className="btn-outline">
            {content.btn2}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export function HomeContactTeaser() {
  const { t, lp } = useLang();
  const content = t.homePage.contact;
  const [titleLine1, titleLine2] = content.title.split("\n");

  return (
    <section className="home-contact-teaser" aria-labelledby="home-contact-heading">
      <motion.div
        className="home-contact-teaser__inner"
        variants={ctaVariants}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
      >
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="home-contact-heading" className="home-contact-teaser__title">
          {titleLine1}
          {titleLine2 ? (
            <>
              <br />
              <em>{titleLine2}</em>
            </>
          ) : null}
        </h2>
        <p className="home-contact-teaser__subtitle">{content.subtitle}</p>
        <Link href={lp("/contact")} className="btn-gold">
          {content.cta}
        </Link>
      </motion.div>
    </section>
  );
}

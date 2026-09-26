"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useLang } from "@/lib/i18n";
import type { SiteStats } from "@/lib/siteStats";
import { withSiteStats, yearsWithPlus } from "@/lib/siteStats";

type Props = { stats: SiteStats };

const textVariants: Variants = {
  hidden: { opacity: 0, x: -42, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.78, ease: "easeOut", staggerChildren: 0.08 },
  },
};

const visualVariants: Variants = {
  hidden: { opacity: 0, x: 42, scale: 0.96, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.82, ease: "easeOut" },
  },
};

export default function HomeAboutSection({ stats }: Props) {
  const { t, lp, lang } = useLang();
  const content = t.homePage.about;
  const [titleLine1, titleLine2] = content.title.split("\n");
  const mobileCopy =
    lang === "fr"
      ? [
          "Depuis plusieurs années, UNIVMAR met son expertise au service de projets architecturaux d'exception.",
          "Spécialisée dans la sélection, la transformation et la fourniture de marbre et de pierre naturelle, notre entreprise accompagne particuliers, architectes et promoteurs dans la réalisation d'espaces élégants et durables.",
        ]
      : [content.p1];

  return (
    <section className="home-about" aria-labelledby="home-about-heading">
      <div className="home-about__inner">
        <motion.div
          className="home-about__text"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
<p
  className="eyebrow home-about__eyebrow"
  style={{ marginBottom: "26px" }}
>
  {content.eyebrow}
</p>          <h2 id="home-about-heading" className="home-about__title">
            {titleLine1}
            {titleLine2 ? (
              <>
                <br />
                <em>{titleLine2}</em>
              </>
            ) : null}
          </h2>
          <p className="home-about__p">{content.p1}</p>
          <p className="home-about__p">{content.p2}</p>
          <p className="home-about__p">{content.p3}</p>
          <div className="home-about__mobile-copy">
            {mobileCopy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="home-about__bullets">
            {content.bullets.map((item) => (
              <li key={item}>{withSiteStats(item, stats)}</li>
            ))}
          </ul>
          <Link href={lp("/a-propos")} className="btn-gold home-about__cta">
            {content.cta}
          </Link>
        </motion.div>

        <motion.div
          className="home-about__visual"
          variants={visualVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -8, scale: 1.015 }}
        >
          <div className="home-about__image-wrap">
            <Image
              src="/about-hero-section-2.jpeg"
              alt={content.imageAlt}
              title={content.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 560px"
              className="home-about__image"
            />
          </div>
          <div className="home-about__badge">
            <span className="home-about__badge-value">{yearsWithPlus(stats.years)}</span>
            <span className="home-about__badge-label">{t.stats.years}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

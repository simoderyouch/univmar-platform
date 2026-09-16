"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { publicAssetUrl } from "@/lib/publicAsset";
import { HOME_CATEGORY_IMAGES } from "@/data/homeConfig";

const sectionViewport = { once: false, margin: "-120px" } as const;

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.075, delayChildren: 0.12 },
  },
};

const categoryVariants: Variants = {
  hidden: { opacity: 0, y: 42, scale: 0.93, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.62, ease: "easeOut" },
  },
};

type Category = { id: number; name: string; order: number };

type Props = { categories: Category[] };

export default function HomeCategoriesSection({ categories }: Props) {
  const { t, lp } = useLang();
  const content = t.homePage.categories;
  const productsDict = t.products.categories as Record<string, string>;
  const [titleLine1, titleLine2] = content.title.split("\n");

  return (
    <section className="home-categories" aria-labelledby="home-categories-heading">
      <div className="home-categories__inner">
        <motion.div
          className="home-categories__header"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
        >
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 id="home-categories-heading" className="home-categories__title">
            {titleLine1}
            {titleLine2 ? (
              <>
                <br />
                <em>{titleLine2}</em>
              </>
            ) : null}
          </h2>
          <p className="home-categories__subtitle">{content.subtitle}</p>
        </motion.div>

        <motion.div
          className="home-categories__grid"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
        >
          {categories.map((cat, i) => {
            const label = productsDict[cat.name] ?? cat.name;
            const image = HOME_CATEGORY_IMAGES[cat.name] ?? "/image-produits-3.jpeg";

            return (
              <motion.div
                key={cat.id}
                variants={categoryVariants}
                whileHover={{ y: -8, scale: 1.035, rotate: i % 2 === 0 ? 0.35 : -0.35 }}
                whileTap={{ scale: 0.985 }}
              >
                <Link href={lp("/produits")} className="home-categories__card">
                  <img
                    src={publicAssetUrl(image)}
                    alt={label}
                    title={label}
                    className="home-categories__img"
                    loading="lazy"
                  />
                  <div className="home-categories__overlay">
                    <span className="home-categories__name">{label}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

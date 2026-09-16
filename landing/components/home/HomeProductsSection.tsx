"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { publicAssetUrl } from "@/lib/publicAsset";
import { productSlugById } from "@/lib/slug";

type Product = {
  id: number;
  name: string;
  images: string;
  categoryId: number;
  category: { name: string };
};

type Props = { products: Product[] };

const GRID_SIZE = 12;
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
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.12 } },
};

const productVariants: Variants = {
  hidden: { opacity: 0, y: 38, scale: 0.95, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.58, ease: "easeOut" },
  },
};

export default function HomeProductsSection({ products }: Props) {
  const { t, lp } = useLang();
  const content = t.homePage.products;
  const [titleLine1, titleLine2] = content.title.split("\n");

  const gridProducts = useMemo(() => {
    const seen = new Set<number>();
    const picks: Product[] = [];

    for (const p of products) {
      if (picks.length >= GRID_SIZE) break;
      if (!seen.has(p.categoryId)) {
        picks.push(p);
        seen.add(p.categoryId);
      }
    }

    for (const p of products) {
      if (picks.length >= GRID_SIZE) break;
      if (!picks.some((x) => x.id === p.id)) picks.push(p);
    }

    return picks.slice(0, GRID_SIZE);
  }, [products]);

  return (
    <section className="home-products" aria-labelledby="home-products-heading">
      <div className="home-products__inner">
        <motion.div
          className="home-products__header"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
        >
          <div className="home-products__header-text">
            <p className="eyebrow">{content.eyebrow}</p>
            <h2 id="home-products-heading" className="home-products__title">
              {titleLine1}
              {titleLine2 ? (
                <>
                  <br />
                  <em>{titleLine2}</em>
                </>
              ) : null}
            </h2>
            <p className="home-products__subtitle">{content.subtitle}</p>
          </div>
          <ul className="home-products__bullets">
            {content.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div className="home-products__grid" variants={gridVariants} initial="hidden" whileInView="visible" viewport={sectionViewport}>
          {gridProducts.map((product, i) => {
            const slug = productSlugById(product.id);
            const href = slug ? lp(`/produits/${slug}`) : lp("/produits");

            return (
              <motion.article
                key={product.id}
                className="home-products__card"
                variants={productVariants}
                whileHover={{ y: -8, scale: 1.025 }}
                whileTap={{ scale: 0.985 }}
              >
                <Link href={href} className="home-products__link">
                  <div className="home-products__media">
                    <img
                      src={publicAssetUrl(product.images)}
                      alt={`${product.name} — ${product.category.name} pour projet architectural au Maroc`}
                      title={`${product.name} — ${product.category.name}`}
                      className="home-products__img"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="home-products__overlay">
                      <span className="home-products__quote-btn">{content.requestQuote}</span>
                    </div>
                  </div>
                  <h3 className="home-products__name">{product.name}</h3>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div
          className="home-products__cta"
          initial={{ opacity: 0, y: 18, scale: 0.96, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={sectionViewport}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <Link href={lp("/produits")} className="btn-gold">
            {content.viewAll}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

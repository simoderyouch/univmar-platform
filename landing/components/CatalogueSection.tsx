"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { publicAssetUrl } from "@/lib/publicAsset";
import { useLocalePath } from "@/lib/i18n";
import { productSlugById } from "@/lib/slug";

type Product = {
  id: number;
  name: string;
  regularPrice: number | null;
  images: string;
  categoryId: number;
  category: { id: number; name: string };
};

type Category = { id: number; name: string; order: number };

type CatalogueContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  previewSubtitle?: string;
  previewCtaLabel?: string;
  viewAll: string;
};

const FEATURE_MS = 5000;

const CAT_GRADIENTS: Record<string, string> = {
  Granit: "linear-gradient(135deg, #e8e3d8 0%, #ddd6c8 100%)",
  Marbre: "linear-gradient(135deg, #dce4ea 0%, #ccd5de 100%)",
  "Marbre importé": "linear-gradient(135deg, #dce4ea 0%, #ccd5de 100%)",
  "Marbre local": "linear-gradient(135deg, #ede0d8 0%, #e3d0c6 100%)",
  "Pierre Naturelle&Tahejart": "linear-gradient(135deg, #dce8dc 0%, #cddccc 100%)",
  Onyx: "linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 100%)",
  Quartz: "linear-gradient(135deg, #eef1f5 0%, #dde3ea 100%)",
  "Pierre naturelle": "linear-gradient(135deg, #dce8dc 0%, #cddccc 100%)",
};

function pickPreviewProducts(products: Product[], categories: Category[]): Product[] {
  const sorted = [...categories].sort((a, b) => a.order - b.order);
  const picks: Product[] = [];
  const used = new Set<number>();

  for (const cat of sorted) {
    const match = products.find((p) => p.categoryId === cat.id && !used.has(p.id));
    if (match) {
      picks.push(match);
      used.add(match.id);
    }
  }

  for (const p of products) {
    if (picks.length >= 4) break;
    if (!used.has(p.id)) {
      picks.push(p);
      used.add(p.id);
    }
  }

  return picks.slice(0, 4);
}

function PreviewCard({
  product,
  size = "default",
}: {
  product: Product;
  size?: "featured" | "default";
}) {
  const lp = useLocalePath();
  const slug = productSlugById(product.id);
  const gradient =
    CAT_GRADIENTS[product.category?.name] ??
    "linear-gradient(135deg, #e8e4de 0%, #ddd8d0 100%)";

  return (
    <Link
      href={slug ? lp(`/produits/${slug}`) : lp("/produits")}
      className={`catalogue-preview-card catalogue-preview-card--${size}`}
    >
      <div className="catalogue-preview-card-media" style={{ background: gradient }}>
        <img
          src={publicAssetUrl(product.images)}
          alt={`${product.name} — ${product.category?.name ?? ""} UNIVMAR`}
          title={`${product.name} — ${product.category?.name ?? ""}`}
          className="catalogue-preview-card-img"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="catalogue-preview-card-shade" aria-hidden />
        <span className="catalogue-preview-card-tag">{product.category?.name}</span>
        <div className="catalogue-preview-card-caption">
          <h3 className="catalogue-preview-card-title">{product.name}</h3>
        </div>
      </div>
    </Link>
  );
}

export default function CatalogueSection({
  products,
  categories,
  content,
}: {
  products: Product[];
  categories: Category[];
  content: CatalogueContent;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const lp = useLocalePath();
  const isInView = useInView(sectionRef, { once: false, margin: "-80px" });

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.order - b.order),
    [categories]
  );

  const previewProducts = useMemo(
    () => pickPreviewProducts(products, sortedCategories),
    [products, sortedCategories]
  );

  const featured = previewProducts[featuredIndex] ?? previewProducts[0];
  const sideProducts = previewProducts.filter((_, i) => i !== featuredIndex).slice(0, 3);

  const categoryCounts = useMemo(() => {
    const counts = new Map<number, number>();
    sortedCategories.forEach((cat) => {
      counts.set(cat.id, products.filter((p) => p.categoryId === cat.id).length);
    });
    return counts;
  }, [products, sortedCategories]);

  useEffect(() => {
    if (!isInView || isPaused || previewProducts.length < 2) return;

    const timer = window.setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % previewProducts.length);
    }, FEATURE_MS);

    return () => window.clearInterval(timer);
  }, [isInView, isPaused, previewProducts.length]);

  if (!featured) return null;

  return (
    <section
      ref={sectionRef}
      className="catalogue-section catalogue-section--preview"
      aria-labelledby="catalogue-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="catalogue-section-inner">
        <motion.div
          className="catalogue-preview-header"
          initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(8px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, y: 28, scale: 0.96, filter: "blur(8px)" }
          }
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="catalogue-preview-header__title">
            <p className="eyebrow catalogue-eyebrow">{content.eyebrow}</p>
            <h2 id="catalogue-heading" className="catalogue-title">
              {content.title}
            </h2>
            <div className="gold-divider catalogue-divider" />
          </div>
          <p className="catalogue-subtitle catalogue-preview-header__subtitle">
            {content.previewSubtitle ?? content.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="catalogue-preview-categories"
          initial={{ opacity: 0, y: 16, scale: 0.98, filter: "blur(8px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, y: 16, scale: 0.98, filter: "blur(8px)" }
          }
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {sortedCategories.map((cat) => (
            <Link key={cat.id} href={lp("/produits")} className="catalogue-preview-cat-chip">
              <span className="catalogue-preview-cat-name">{cat.name}</span>
              <span className="catalogue-preview-cat-count">{categoryCounts.get(cat.id) ?? 0}</span>
            </Link>
          ))}
        </motion.div>

        <motion.div
          className="catalogue-preview-bento"
          initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(8px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, y: 24, scale: 0.96, filter: "blur(8px)" }
          }
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="catalogue-preview-featured">
            <AnimatePresence mode="wait">
              <motion.div
                key={featured.id}
                className="catalogue-preview-featured-inner"
                initial={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <PreviewCard product={featured} size="featured" />
              </motion.div>
            </AnimatePresence>

            <div className="catalogue-preview-dots" role="tablist" aria-label="Featured products">
              {previewProducts.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={featuredIndex === i}
                  aria-label={p.name}
                  className={`catalogue-preview-dot${featuredIndex === i ? " is-active" : ""}`}
                  onClick={() => setFeaturedIndex(i)}
                >
                  {featuredIndex === i && !isPaused && (
                    <motion.span
                      className="catalogue-preview-dot-progress"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: FEATURE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="catalogue-preview-side">
            {sideProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 16, scale: 0.96, filter: "blur(8px)" }}
                animate={
                  isInView
                    ? { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }
                    : { opacity: 0, x: 16, scale: 0.96, filter: "blur(8px)" }
                }
                transition={{
                  duration: 0.45,
                  delay: 0.25 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <PreviewCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="catalogue-preview-cta"
          initial={{ opacity: 0, y: 16, scale: 0.98, filter: "blur(8px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, y: 16, scale: 0.98, filter: "blur(8px)" }
          }
          transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="catalogue-preview-cta-text">
            <span className="catalogue-preview-cta-count">{products.length}</span>
            <span className="catalogue-preview-cta-label">
              {content.previewCtaLabel ?? content.subtitle.split(".")[0]}
            </span>
          </div>
          <Link href={lp("/produits")} className="btn-gold catalogue-preview-cta-btn">
            {content.viewAll}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

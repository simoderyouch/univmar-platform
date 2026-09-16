"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang, useLocalePath } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { publicAssetUrl } from "@/lib/publicAsset";
import { buildMultiProductContactHref } from "@/lib/productContact";
import { inferProductColor, PRODUCT_COLORS, countProductsByColor, type ProductColor } from "@/lib/productMeta";
import { productSlugById } from "@/lib/slug";
import ProductMediaSwap from "@/components/ProductMediaSwap";
import ColorFilterDropdown from "@/components/ColorFilterDropdown";
import ScrollReveal from "@/components/ScrollReveal";

type Product = {
  id: number;
  name: string;
  images: string;
  applicationImages?: string[];
  categoryId: number;
  published?: boolean;
  category: { id: number; name: string };
};
type Category = { id: number; name: string; order: number };

type Props = {
  products: Product[];
  categories: Category[];
};

const CAT_GRADIENTS: Record<string, string> = {
  Granit: "linear-gradient(135deg, #e8e3d8 0%, #ddd6c8 100%)",
  Marbre: "linear-gradient(135deg, #dce4ea 0%, #ccd5de 100%)",
  "Marbre local": "linear-gradient(135deg, #ede0d8 0%, #e3d0c6 100%)",
  "Pierre Naturelle&Tahejart": "linear-gradient(135deg, #dce8dc 0%, #cddccc 100%)",
  Onyx: "linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 100%)",
  Quartz: "linear-gradient(135deg, #eef1f5 0%, #dde3ea 100%)",
  "Pierre naturelle": "linear-gradient(135deg, #dce8dc 0%, #cddccc 100%)",
};

const PRODUCT_HERO_IMAGES = [
  { src: "/image-produits-1.jpeg", variant: "main" as const, altKey: "main" as const },
  { src: "/image-produits-2.jpeg", variant: "side" as const, altKey: "side" as const },
  { src: "/image-produits-3.jpeg", variant: "accent" as const, altKey: "accent" as const },
] as const;

const COLOR_KEYS = PRODUCT_COLORS;

export default function ProduitsClient({ products, categories }: Props) {
  const { t, lang, lp } = useLang();
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeColor, setActiveColor] = useState<ProductColor | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [titleLine1, titleLine2] = t.products.title.split("\n");

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const clearUnavailableColorFilter = () => {
      if (mobileQuery.matches) setActiveColor(null);
    };

    clearUnavailableColorFilter();
    mobileQuery.addEventListener("change", clearUnavailableColorFilter);
    return () => mobileQuery.removeEventListener("change", clearUnavailableColorFilter);
  }, []);

  const catLabel = (name: string) => {
    const key = name as keyof typeof t.products.categories;
    return t.products.categories[key] ?? name;
  };

  const sectionMeta = (name: string) => {
    const key = name as keyof typeof t.products.categorySections;
    return t.products.categorySections[key];
  };

  const productsWithMeta = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        color: inferProductColor(product.name),
        categoryLabel: catLabel(product.category?.name ?? ""),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  const colorCounts = useMemo(() => countProductsByColor(products), []);

  const availableColors = useMemo(
    () => COLOR_KEYS.filter((color) => colorCounts[color] > 0),
    [colorCounts],
  );

  const matchesFilters = (product: (typeof productsWithMeta)[number]) => {
    if (activeColor && product.color !== activeColor) return false;
    return true;
  };

  const visibleCategories = useMemo(() => {
    if (activeCategory !== null) {
      return categories.filter((cat) => cat.id === activeCategory);
    }
    return categories;
  }, [activeCategory]);

  const groupedSections = useMemo(() => {
    return visibleCategories
      .map((cat) => {
        const items = productsWithMeta
          .filter((p) => p.categoryId === cat.id && matchesFilters(p))
          .sort((a, b) => a.name.localeCompare(b.name));

        return { category: cat, items };
      })
      .filter((section) => section.items.length > 0);
  }, [visibleCategories, productsWithMeta, activeColor]);

  const hasActiveFilters = activeCategory !== null || activeColor !== null;

  const clearFilters = () => {
    setActiveCategory(null);
    setActiveColor(null);
  };

  const scrollToCatalogue = () => {
    filtersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleSelection = (productId: number) => {
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const selectedProducts = useMemo(
    () => productsWithMeta.filter((product) => selectedIds.includes(product.id)),
    [productsWithMeta, selectedIds],
  );

  const selectionQuoteHref = buildMultiProductContactHref(
    selectedProducts.map((product) => ({
      name: product.name,
      category: product.categoryLabel,
    })),
    lang,
  );

  return (
    <>
      <Navbar />

      <section className="products-hero">
        <div className="products-hero__glow" aria-hidden />
        <div className="products-hero__inner">
          <div className="products-hero__grid">
            <motion.div
              className="products-hero__content"
              initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="eyebrow products-hero__eyebrow">{t.products.eyebrow}</p>
              <h1 className="products-hero__title">
                {titleLine1}
                {titleLine2 ? (
                  <>
                    <br />
                    <em>{titleLine2}</em>
                  </>
                ) : null}
              </h1>
              <div className="gold-divider products-hero__divider" />
              <p className="products-hero__subtitle">{t.products.subtitle}</p>

              <button
                type="button"
                className="products-hero__scroll btn-outline"
                onClick={() => scrollToCatalogue()}
              >
                {t.products.heroCta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </button>
            </motion.div>

            <motion.div
              className="products-hero__visual"
              initial={{ opacity: 0, x: 28, scale: 0.96, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            >
              <div className="products-hero__mosaic">
                {PRODUCT_HERO_IMAGES.map((image) => (
                  <div
                    key={image.src}
                    className={`products-hero__tile products-hero__tile--${image.variant}`}
                    style={{ backgroundImage: `url("${image.src}")` }}
                    role="img"
                    aria-label={t.products.heroImages[image.altKey]}
                  />
                ))}
              </div>
              <div className="products-hero__badge">
                <span className="products-hero__badge-count">+100</span>
                <span className="products-hero__badge-label">{t.products.heroBadge}</span>
              </div>
              <div className="products-hero__frame" aria-hidden />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="catalog-filters" aria-label={t.products.filterCategory}>
        <div ref={filtersRef} />
        <div className="catalog-filters__inner">
          <div className="catalog-filters__row">
            <div className="catalog-filters__group catalog-filters__group--grow">
              <span className="catalog-filters__label">{t.products.filterCategory}</span>
              <div className="catalog-filters__chips">
                <button
                  type="button"
                  className={`catalog-filter-chip${activeCategory === null ? " is-active" : ""}`}
                  onClick={() => setActiveCategory(null)}
                >
                  {t.products.all}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`catalog-filter-chip${activeCategory === cat.id ? " is-active" : ""}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {catLabel(cat.name)}
                  </button>
                ))}
              </div>
            </div>

            <ColorFilterDropdown
              colors={availableColors}
              counts={colorCounts}
              activeColor={activeColor}
              onChange={setActiveColor}
              labels={t.products.colors}
              allLabel={t.products.all}
              filterLabel={t.products.filterColor}
            />

            {hasActiveFilters ? (
              <button type="button" className="catalog-filters__reset btn-outline" onClick={clearFilters}>
                {t.products.clearFilters}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <div className={`catalog-body${selectedIds.length > 0 ? " catalog-body--has-selection" : ""}`}>
        {groupedSections.length > 0 ? (
          groupedSections.map(({ category, items }, sectionIndex) => {
            const meta = sectionMeta(category.name);
            const sectionNumber = meta?.index ?? String(sectionIndex + 1).padStart(2, "0");

            return (
              <section
                key={category.id}
                id={`category-${category.id}`}
                className="catalog-category-block"
                aria-labelledby={`category-heading-${category.id}`}
              >
                <div className="catalog-category-block__inner">
                  <header className="catalog-category-block__header">
                    <p className="catalog-category-block__index">
                      {t.products.categoryNumber} {sectionNumber}
                    </p>
                    <h2 id={`category-heading-${category.id}`} className="catalog-category-block__title">
                      {meta?.titleLine1 ?? catLabel(category.name)}
                      {meta?.titleLine2 ? (
                        <>
                          <br />
                          <em>{meta.titleLine2}</em>
                        </>
                      ) : null}
                    </h2>
                    {meta?.description ? (
                      <p className="catalog-category-block__desc">{meta.description}</p>
                    ) : null}
                  </header>

                  <div className="catalog-tiles-grid">
                    {items.map((product) => (
                      <CatalogTile
                        key={product.id}
                        product={product}
                        allProducts={products}
                        colorLabel={product.color ? t.products.colors[product.color] : null}
                        applicationLabel={t.seoContent.applications}
                        addLabel={t.products.addMaterial}
                        removeLabel={t.products.removeMaterial}
                        inCart={selectedIds.includes(product.id)}
                        onCartToggle={() => toggleSelection(product.id)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );
          })
        ) : (
          <section className="catalog-empty">
            <p>{t.products.empty}</p>
            <button type="button" className="btn-outline" onClick={clearFilters}>
              {t.products.clearFilters}
            </button>
          </section>
        )}
      </div>

      {selectedIds.length > 0 ? (
        <div className="catalog-selection-bar" role="region" aria-label={t.products.selectedMaterials}>
          <div className="catalog-selection-bar__inner">
            <p className="catalog-selection-bar__count">
              <strong>{selectedIds.length}</strong> {t.products.selectedMaterials}
            </p>
            <button type="button" className="catalog-selection-bar__clear" onClick={clearSelection}>
              {t.products.clearSelection}
            </button>
            <Link href={selectionQuoteHref} className="btn-gold catalog-selection-bar__cta">
              {t.products.requestQuoteFree}
            </Link>
          </div>
        </div>
      ) : null}

      <ScrollReveal as="section" className="catalog-quote-cta">
        <div className="catalog-quote-cta__inner">
          <p className="eyebrow catalog-quote-cta__eyebrow">{t.products.customQuoteTitle}</p>
          <h2 className="catalog-quote-cta__title">{t.products.customQuoteHeading}</h2>
          <p className="catalog-quote-cta__desc">{t.products.customQuoteDesc}</p>
          <Link href={lp("/contact")} className="btn-gold catalog-quote-cta__btn">
            {t.products.customQuoteBtn} →
          </Link>
        </div>
      </ScrollReveal>

      <Footer />
    </>
  );
}

function CatalogTile({
  product,
  allProducts,
  colorLabel,
  applicationLabel,
  addLabel,
  removeLabel,
  inCart,
  onCartToggle,
}: {
  product: Product & { color: ProductColor | null; categoryLabel: string };
  colorLabel: string | null;
  applicationLabel: string;
  addLabel: string;
  removeLabel: string;
  inCart: boolean;
  onCartToggle: () => void;
  allProducts: Product[];
}) {
  const lp = useLocalePath();
  const gradient =
    CAT_GRADIENTS[product.category?.name] ?? "linear-gradient(135deg, #e8e4de 0%, #ddd8d0 100%)";

  const slug = productSlugById(product.id, allProducts);
  const productHref = slug ? lp(`/produits/${slug}`) : undefined;
  const applicationSrc = product.applicationImages?.[0];
  const alt = `${product.name} — ${product.categoryLabel} UNIVMAR`;

  return (
    <article
      className="catalog-tile"
    >
      <div className="catalog-tile__media" style={{ background: gradient }}>
        <ProductMediaSwap
          mainSrc={publicAssetUrl(product.images)}
          applicationSrc={applicationSrc ? publicAssetUrl(applicationSrc) : undefined}
          alt={alt}
          applicationLabel={applicationLabel}
          productHref={productHref}
          inCart={inCart}
          addLabel={addLabel}
          removeLabel={removeLabel}
          onCartToggle={onCartToggle}
        />
      </div>
      <div className="catalog-tile__meta">
        {productHref ? (
          <Link href={productHref} className="catalog-tile__name-link">
            <h3 className="catalog-tile__name">{product.name}</h3>
          </Link>
        ) : (
          <h3 className="catalog-tile__name">{product.name}</h3>
        )}
        <div className="catalog-tile__tags">
          <span className="catalog-tile__tag">{product.categoryLabel}</span>
          {colorLabel ? (
            <span className={`catalog-tile__tag catalog-tile__tag--${product.color}`}>
              {colorLabel}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

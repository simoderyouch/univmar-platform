"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang, useLocalePath } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectLightbox, { type LightboxProject } from "@/components/ProjectLightbox";
import PortfolioCarousel from "@/components/PortfolioCarousel";
import PortfolioModal from "@/components/PortfolioModal";
import ScrollReveal from "@/components/ScrollReveal";
import { FEATURED_PROJECTS } from "@/data/featuredProjects";
import { publicAssetUrl } from "@/lib/publicAsset";
import projectsRaw from "@/data/projects.json";
import projectCategoriesRaw from "@/data/projectCategories.json";

type Project = {
  id: number;
  title: string;
  image: string;
  published: boolean;
  categoryId: number;
  category: { id: number; name: string };
};
type ProjCat = { id: number; name: string };

const projects = (projectsRaw as Project[]).filter((p) => p.published && p.image);
const projectCategories = projectCategoriesRaw as ProjCat[];

const PAGE_SIZE = 12;
const CAROUSEL_SIZE = 10;

export default function ProjetsPage() {
  const { t } = useLang();
  const lp = useLocalePath();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [titleLine1, titleLine2] = t.projects.title.split("\n");

  const categoryCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const p of projects) {
      counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1);
    }
    return counts;
  }, []);

  const catLabel = useCallback(
    (name: string) => {
      const key = name as keyof typeof t.projects.categories;
      return t.projects.categories[key] ?? name;
    },
    [t.projects.categories]
  );

  const filtered = useMemo(
    () =>
      activeCategory === null
        ? projects
        : projects.filter((p) => p.categoryId === activeCategory),
    [activeCategory]
  );

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const carouselProjects = useMemo(
    () =>
      projects.slice(0, CAROUSEL_SIZE).map((p) => ({
        id: p.id,
        title: p.title,
        image: p.image,
        categoryLabel: catLabel(p.category?.name ?? ""),
      })),
    [catLabel]
  );

  const lightboxItems: LightboxProject[] = useMemo(
    () =>
      filtered.map((p) => ({
        id: p.id,
        title: p.title,
        image: p.image,
        categoryLabel: catLabel(p.category?.name ?? ""),
      })),
    [filtered, catLabel]
  );

  const activeLightbox = lightboxIndex !== null ? lightboxItems[lightboxIndex] ?? null : null;

  const openLightbox = (projectId: number) => {
    const index = lightboxItems.findIndex((p) => p.id === projectId);
    if (index >= 0) setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = () => {
    if (lightboxIndex === null || lightboxItems.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length);
  };

  const goNext = () => {
    if (lightboxIndex === null || lightboxItems.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % lightboxItems.length);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setActiveCategory(categoryId);
    setVisibleCount(PAGE_SIZE);
    setLightboxIndex(null);
  };

  const openPortfolio = () => {
    setActiveCategory(null);
    setVisibleCount(PAGE_SIZE);
    setPortfolioOpen(true);
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const featured = FEATURED_PROJECTS.find((p) => p.id === hash);
    if (featured) {
      const el = document.getElementById(`featured-${featured.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (hash === "portfolio") {
      setPortfolioOpen(true);
    }
  }, []);

  return (
    <>
      <Navbar />

      <section className="projects-hero">
        <div className="projects-hero__glow" aria-hidden />
        <div className="projects-hero__inner">
          <motion.div
            className="projects-hero__content"
            initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="eyebrow projects-hero__eyebrow">{t.projects.eyebrow}</p>
            <h1 className="projects-hero__title">
              {titleLine1}
              {titleLine2 ? (
                <>
                  <br />
                  <em>{titleLine2}</em>
                </>
              ) : null}
            </h1>
            <div className="gold-divider projects-hero__divider" />
            <p className="projects-hero__subtitle">{t.projects.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="projects-showcase" aria-labelledby="projects-showcase-heading">
        <div className="projects-showcase__inner">
          <ScrollReveal as="header" className="projects-showcase__header">
            <h2 id="projects-showcase-heading" className="projects-showcase__title">
              {t.projects.featuredTitle}
            </h2>
            <p className="projects-showcase__subtitle">{t.projects.featuredSubtitle}</p>
          </ScrollReveal>

          <div className="projects-showcase__grid">
            {FEATURED_PROJECTS.map((project, i) => {
              const meta = t.projects.featured[i];
              if (!meta) return null;

              return (
                <ScrollReveal as="article" key={project.id} id={`featured-${project.id}`} className="projects-showcase__card" delay={i * 0.08}>
                  <div className="projects-showcase__media">
                    <img
                      src={publicAssetUrl(project.image)}
                      alt={meta.title}
                      title={meta.title}
                      className="projects-showcase__img"
                      loading={i < 2 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="projects-showcase__body">
                    <span className="projects-showcase__tag">{meta.tag}</span>
                    <h3 className="projects-showcase__name">{meta.title}</h3>
                    {meta.subtitle ? (
                      <p className="projects-showcase__desc">{meta.subtitle}</p>
                    ) : null}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="portfolio" className="projects-portfolio" aria-labelledby="projects-portfolio-heading">
        <div className="projects-portfolio__inner">
          <ScrollReveal className="projects-portfolio__header">
            <div>
              <h2 id="projects-portfolio-heading" className="projects-portfolio__title">
                {t.projects.portfolioTitle}
              </h2>
              <p className="projects-portfolio__subtitle">{t.projects.portfolioSubtitle}</p>
            </div>
            <button type="button" className="btn-gold projects-portfolio__open" onClick={openPortfolio}>
              {t.projects.openPortfolio}
            </button>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <PortfolioCarousel
              projects={carouselProjects}
              onSelect={openLightbox}
              prevLabel={t.projects.carouselPrev}
              nextLabel={t.projects.carouselNext}
            />
          </ScrollReveal>
        </div>
      </section>

      <section className="projects-cta">
        <ScrollReveal className="projects-cta__inner">
          <div className="projects-cta__text">
            <h2>{t.cta.title.split("\n")[0]}</h2>
            <p>{t.cta.subtitle}</p>
          </div>
          <Link href={lp("/contact")} className="btn-gold">
            {t.nav.quote}
          </Link>
        </ScrollReveal>
      </section>

      <PortfolioModal
        open={portfolioOpen}
        onClose={() => setPortfolioOpen(false)}
        title={t.projects.portfolioModalTitle}
        closeLabel={t.projects.lightboxClose}
        allLabel={t.projects.all}
        itemsLabel={t.projects.items}
        loadMoreLabel={t.projects.loadMore}
        emptyLabel={t.projects.empty}
        categories={projectCategories}
        categoryCounts={categoryCounts}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        displayed={displayed.map((p) => ({
          id: p.id,
          title: p.title,
          image: p.image,
          categoryLabel: catLabel(p.category?.name ?? ""),
        }))}
        totalCount={projects.length}
        filteredCount={filtered.length}
        hasMore={hasMore}
        onLoadMore={() => setVisibleCount((n) => n + PAGE_SIZE)}
        onOpenProject={openLightbox}
        catLabel={catLabel}
      />

      <ProjectLightbox
        project={activeLightbox}
        onClose={closeLightbox}
        onPrev={lightboxItems.length > 1 ? goPrev : undefined}
        onNext={lightboxItems.length > 1 ? goNext : undefined}
        closeLabel={t.projects.lightboxClose}
        prevLabel={t.projects.lightboxPrev}
        nextLabel={t.projects.lightboxNext}
      />

      <Footer />
    </>
  );
}

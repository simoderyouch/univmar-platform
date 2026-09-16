"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { SiteStats } from "@/lib/siteStats";
import { getSeoPageNavLabel, type SeoPageSlug } from "@/data/seo-pages";

const HomeAboutSection = dynamic(() => import("@/components/home/HomeAboutSection"));
const HomeSurMesureSection = dynamic(() => import("@/components/home/HomeSurMesureSection"));
const ServicesSection = dynamic(() => import("@/components/ServicesSection"));
const HomeProductsSection = dynamic(() => import("@/components/home/HomeProductsSection"));
const FeaturedProjectsSection = dynamic(() => import("@/components/FeaturedProjectsSection"));
const HomeStatsBanner = dynamic(() => import("@/components/home/HomeStatsBanner"));
const HomeProcessSection = dynamic(() => import("@/components/home/HomeProcessSection"));
const HomeCategoriesSection = dynamic(() => import("@/components/home/HomeCategoriesSection"));
const HomeCtaSection = dynamic(() =>
  import("@/components/home/HomeCtaSections").then((m) => m.HomeCtaSection),
);
const HomeContactTeaser = dynamic(() =>
  import("@/components/home/HomeCtaSections").then((m) => m.HomeContactTeaser),
);

type Product = {
  id: number;
  name: string;
  regularPrice: number | null;
  images: string;
  categoryId: number;
  category: { id: number; name: string };
};
type Category = { id: number; name: string; order: number };

type Props = {
  products: Product[];
  categories: Category[];
  stats: SiteStats;
};

export default function HomeClient({ products, categories, stats }: Props) {
  const { t, lp, lang } = useLang();

  return (
    <>
      <Navbar overDarkHero />

      {/* ── HERO ───────────────────────────────────── */}
      <section className="home-hero">
        <Image
          src="/hero-image.webp"
          alt={t.hero.imageAlt}
          title={t.hero.imageAlt}
          fill
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1400px"
          className="home-hero__bg"
        />

        <div className="hero-overlay home-hero__overlay" aria-hidden />

        <div className="home-hero__content">
          <p className="eyebrow home-hero__eyebrow">
            {t.hero.eyebrow}
          </p>

          <h1 className="home-hero__title">
            {t.hero.title.split("\n")[0]}
            <br />
            <em>{t.hero.title.split("\n")[1]}</em>
          </h1>

          <p className="home-hero__subtitle">
            {t.hero.subtitle}
          </p>

          <div className="home-hero__actions">
            <div>
              <Link href={lp("/produits")} className="btn-gold home-hero__btn">
                {t.hero.cta}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div>
              <Link href={lp("/a-propos")} className="btn-outline home-hero__btn-outline">
                {t.hero.cta2}
              </Link>
            </div>
          </div>
        </div>

        <div className="home-hero__scroll" aria-hidden>
          <div className="home-hero__scroll-line" />
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      <HomeAboutSection stats={stats} />
      <HomeSurMesureSection />
      <ServicesSection content={t.services} />
      <HomeProductsSection products={products} />
     
      <FeaturedProjectsSection content={t.projects} />
      <HomeStatsBanner stats={stats} />
      <HomeProcessSection />
      <HomeCategoriesSection categories={categories} />
      <HomeContactTeaser />

      <Footer />
    </>
  );
}

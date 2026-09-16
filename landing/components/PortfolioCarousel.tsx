"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { publicAssetUrl } from "@/lib/publicAsset";

export type CarouselProject = {
  id: number;
  title: string;
  image: string;
  categoryLabel: string;
};

type PortfolioCarouselProps = {
  projects: CarouselProject[];
  onSelect: (id: number) => void;
  prevLabel: string;
  nextLabel: string;
};

export default function PortfolioCarousel({
  projects,
  onSelect,
  prevLabel,
  nextLabel,
}: PortfolioCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateNav = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateNav();

    const onScroll = () => updateNav();
    el.addEventListener("scroll", onScroll, { passive: true });

    const observer = new ResizeObserver(() => updateNav());
    observer.observe(el);
    for (const img of el.querySelectorAll("img")) {
      img.addEventListener("load", updateNav);
    }

    window.addEventListener("resize", updateNav);

    return () => {
      el.removeEventListener("scroll", onScroll);
      observer.disconnect();
      window.removeEventListener("resize", updateNav);
    };
  }, [projects, updateNav]);

  const scrollBy = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>(".portfolio-carousel__slide");
    const gap = 16;
    const amount = (slide?.offsetWidth ?? 280) + gap;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (!projects.length) return null;

  return (
    <div className="portfolio-carousel">
      <button
        type="button"
        className="portfolio-carousel__nav portfolio-carousel__nav--prev ui-icon-btn"
        onClick={() => scrollBy(-1)}
        disabled={!canPrev}
        aria-label={prevLabel}
      >
        <svg className="ui-icon-btn__svg" viewBox="0 0 24 24" aria-hidden>
          <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="portfolio-carousel__viewport">
        <div ref={trackRef} className="portfolio-carousel__track">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className="project-card project-card--interactive portfolio-carousel__slide"
              onClick={() => onSelect(project.id)}
            >
              <div className="project-card__media">
                <img
                  src={publicAssetUrl(project.image)}
                  alt={project.title}
                  title={project.title}
                  className="project-card__img"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="project-card__body">
                <p className="project-card__category">{project.categoryLabel}</p>
                <h3 className="project-card__title">{project.title}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="portfolio-carousel__nav portfolio-carousel__nav--next ui-icon-btn"
        onClick={() => scrollBy(1)}
        disabled={!canNext}
        aria-label={nextLabel}
      >
        <svg className="ui-icon-btn__svg" viewBox="0 0 24 24" aria-hidden>
          <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

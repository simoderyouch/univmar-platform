"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { publicAssetUrl } from "@/lib/publicAsset";
import { HOME_SUR_MESURE_IMAGES } from "@/data/homeConfig";

export default function HomeSurMesureSection() {
  const { t, lp, lang } = useLang();
  const content = t.homePage.surMesure;
  const [titleLine1, titleLine2] = content.title.split("\n");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2);
  const [isMobile, setIsMobile] = useState(false);
  const slideCount = content.items.length;
  const maxIndex = Math.max(0, slideCount - visibleCount);

  const goTo = (nextIndex: number) => {
    const positionCount = maxIndex + 1;
    if (!positionCount) return;
    setActiveIndex((nextIndex + positionCount) % positionCount);
  };

  useEffect(() => {
    const tabletQuery = window.matchMedia("(max-width: 900px)");
    const mobileQuery = window.matchMedia("(max-width: 640px)");

    function updateLayout() {
      setVisibleCount(tabletQuery.matches ? 1 : 2);
      setIsMobile(mobileQuery.matches);
    }

    updateLayout();
    tabletQuery.addEventListener("change", updateLayout);
    mobileQuery.addEventListener("change", updateLayout);

    return () => {
      tabletQuery.removeEventListener("change", updateLayout);
      mobileQuery.removeEventListener("change", updateLayout);
    };
  }, []);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (isMobile || isPaused || maxIndex < 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, 4200);

    return () => window.clearInterval(timer);
  }, [isMobile, isPaused, maxIndex]);

  useEffect(() => {
    setActiveIndex(0);
  }, [lang]);

  return (
    <section className="home-sur-mesure" aria-labelledby="home-sur-mesure-heading">
      <div className="home-sur-mesure__inner">
        <div className="home-sur-mesure__header">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 id="home-sur-mesure-heading" className="home-sur-mesure__title">
            {titleLine1}
            {titleLine2 ? (
              <>
                <br />
                <em>{titleLine2}</em>
              </>
            ) : null}
          </h2>
          <p className="home-sur-mesure__subtitle">{content.subtitle}</p>
        </div>

        <div
          className="home-sur-mesure__carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div className="home-sur-mesure__viewport">
            <div
              className="home-sur-mesure__track"
              style={{
                transform: isMobile
                  ? "none"
                  : `translateX(${(lang === "ar" ? 1 : -1) * activeIndex * (100 / visibleCount)}%)`,
              }}
            >
              {content.items.map((item, i) => {
                const isVisible = isMobile || (i >= activeIndex && i < activeIndex + visibleCount);

                return (
                  <article
                    key={item.num}
                    className={`home-sur-mesure__card${isVisible ? " is-active" : ""}`}
                    aria-hidden={!isVisible}
                  >
                    <Link
                      href={lp("/projets")}
                      className="home-sur-mesure__link"
                      tabIndex={isVisible ? 0 : -1}
                    >
                      <div className="home-sur-mesure__media">
                        <img
                          src={publicAssetUrl(HOME_SUR_MESURE_IMAGES[i] ?? HOME_SUR_MESURE_IMAGES[0])}
                          alt={item.title}
                          title={item.title}
                          className="home-sur-mesure__img"
                          loading={i < 2 ? "eager" : "lazy"}
                        />
                        <span className="home-sur-mesure__num">{item.num}</span>
                      </div>
                      <div className="home-sur-mesure__body">
                        <span className="home-sur-mesure__kicker">{item.num}</span>
                        <h3 className="home-sur-mesure__name">
                          {item.title}
                          <span className="home-sur-mesure__index">{item.num}</span>
                        </h3>
                        <p className="home-sur-mesure__desc">{item.desc}</p>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>

          {slideCount > 1 && !isMobile ? (
            <div className="home-sur-mesure__controls" aria-label="Carousel controls">
              <button type="button" className="home-sur-mesure__nav" onClick={() => goTo(activeIndex - 1)} aria-label="Previous slide">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
              </button>
              <div className="home-sur-mesure__dots" role="tablist" aria-label="Slides">
                {content.items.slice(0, maxIndex + 1).map((item, i) => (
                  <button key={item.num} type="button" className={`home-sur-mesure__dot${i === activeIndex ? " is-active" : ""}`} onClick={() => goTo(i)} role="tab" aria-selected={i === activeIndex} aria-label={`Slide ${i + 1}`} />
                ))}
              </div>
              <button type="button" className="home-sur-mesure__nav" onClick={() => goTo(activeIndex + 1)} aria-label="Next slide">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

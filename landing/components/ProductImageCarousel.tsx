"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { publicAssetUrl } from "@/lib/publicAsset";

type ProductImageCarouselProps = {
  images: string[];
  alt: string;
  className?: string;
  slideLabels?: string[];
};

export default function ProductImageCarousel({
  images,
  alt,
  className = "",
  slideLabels = [],
}: ProductImageCarouselProps) {
  const slides = useMemo(
    () => images.filter(Boolean).map((src) => publicAssetUrl(src)),
    [images],
  );
  const [index, setIndex] = useState(0);

  const hasMultiple = slides.length > 1;
  const currentIndex = Math.min(index, slides.length - 1);
  const current = slides[currentIndex];

  const goTo = useCallback(
    (nextIndex: number) => {
      if (!slides.length) return;
      setIndex((nextIndex + slides.length) % slides.length);
    },
    [slides.length],
  );

  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!hasMultiple) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    },
    [goNext, goPrev, hasMultiple],
  );

  if (!slides.length || !current) return null;

  return (
    <div
      className={`product-carousel${className ? ` ${className}` : ""}`}
      tabIndex={hasMultiple ? 0 : undefined}
      onKeyDown={onKeyDown}
    >
      <div className="product-carousel__frame">
        <div className="product-carousel__stage">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={current}
              src={current}
              alt={`${alt}${hasMultiple ? ` (${currentIndex + 1}/${slides.length})` : ""}`}
              title={`${alt}${hasMultiple ? ` (${currentIndex + 1}/${slides.length})` : ""}`}
              className="product-carousel__img"
              initial={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>

          <div className="product-carousel__stage-shade" aria-hidden />

          {hasMultiple ? (
            <>
              <div className="product-carousel__counter" aria-live="polite">
                <span>{String(currentIndex + 1).padStart(2, "0")}</span>
                <span className="product-carousel__counter-sep">/</span>
                <span>{String(slides.length).padStart(2, "0")}</span>
              </div>

              <div className="product-carousel__nav-group">
                <button
                  type="button"
                  className="product-carousel__nav product-carousel__nav--prev"
                  onClick={goPrev}
                  aria-label="Previous image"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="product-carousel__nav product-carousel__nav--next"
                  onClick={goNext}
                  aria-label="Next image"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {hasMultiple ? (
        <div className="product-carousel__controls">
          <div className="product-carousel__dots" role="tablist" aria-label="Product images">
            {slides.map((src, dotIndex) => (
              <button
                key={`dot-${src}-${dotIndex}`}
                type="button"
                role="tab"
                aria-selected={dotIndex === currentIndex}
                aria-label={`Image ${dotIndex + 1}`}
                className={`product-carousel__dot${dotIndex === currentIndex ? " is-active" : ""}`}
                onClick={() => goTo(dotIndex)}
              />
            ))}
          </div>

          <div className="product-carousel__thumbs">
            {slides.map((src, thumbIndex) => {
              const label = slideLabels[thumbIndex];
              return (
                <button
                  key={`thumb-${src}-${thumbIndex}`}
                  type="button"
                  aria-current={thumbIndex === currentIndex}
                  aria-label={label ?? `Image ${thumbIndex + 1}`}
                  className={`product-carousel__thumb${thumbIndex === currentIndex ? " is-active" : ""}`}
                  onClick={() => goTo(thumbIndex)}
                >
                  <span className="product-carousel__thumb-frame">
                    <img src={src} alt="" title={label ?? alt} className="product-carousel__thumb-img" loading="lazy" />
                  </span>
                 
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

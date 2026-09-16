"use client";

import { useState } from "react";
import Link from "next/link";

type ProductMediaSwapProps = {
  mainSrc: string;
  applicationSrc?: string;
  alt: string;
  className?: string;
  applicationLabel?: string;
  productHref?: string;
  inCart?: boolean;
  addLabel?: string;
  removeLabel?: string;
  onCartToggle?: () => void;
};

export default function ProductMediaSwap({
  mainSrc,
  applicationSrc,
  alt,
  className = "",
  applicationLabel = "Application",
  productHref,
  inCart = false,
  addLabel = "Add",
  removeLabel = "Remove",
  onCartToggle,
}: ProductMediaSwapProps) {
  const hasApplication = Boolean(applicationSrc);
  const [hovering, setHovering] = useState(false);
  const showApplication = hasApplication && hovering;

  const images = (
    <>
      <img
        src={mainSrc}
        alt={alt}
        title={alt}
        className="product-media-swap__img product-media-swap__img--main"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {hasApplication && applicationSrc ? (
        <img
          src={applicationSrc}
          alt={`${alt} — ${applicationLabel}`}
          title={`${alt} — ${applicationLabel}`}
          className="product-media-swap__img product-media-swap__img--app"
          loading="lazy"
        />
      ) : null}
    </>
  );

  return (
    <div
      className={`product-media-swap${hasApplication ? " product-media-swap--has-app" : ""}${showApplication ? " product-media-swap--show-app" : ""}${className ? ` ${className}` : ""}`}
      onMouseEnter={hasApplication ? () => setHovering(true) : undefined}
      onMouseLeave={hasApplication ? () => setHovering(false) : undefined}
    >
      {productHref ? (
        <Link href={productHref} className="product-media-swap__link">
          {images}
        </Link>
      ) : (
        <div className="product-media-swap__link">{images}</div>
      )}

      <button
        type="button"
        className={`product-media-swap__toggle${inCart ? " is-in-cart" : ""}`}
        aria-label={inCart ? removeLabel : addLabel}
        aria-pressed={inCart}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onCartToggle?.();
        }}
      >
        {inCart ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        )}
      </button>
    </div>
  );
}

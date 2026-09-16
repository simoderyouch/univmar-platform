"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductColor } from "@/lib/productMeta";

type ColorFilterDropdownProps = {
  colors: ProductColor[];
  counts: Record<ProductColor, number>;
  activeColor: ProductColor | null;
  onChange: (color: ProductColor | null) => void;
  labels: Record<ProductColor, string>;
  allLabel: string;
  filterLabel: string;
};

export default function ColorFilterDropdown({
  colors,
  counts,
  activeColor,
  onChange,
  labels,
  allLabel,
  filterLabel,
}: ColorFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const triggerLabel = activeColor ? labels[activeColor] : allLabel;

  return (
    <div className={`color-filter${open ? " is-open" : ""}`} ref={rootRef}>
      <span className="catalog-filters__label">{filterLabel}</span>
      <button
        type="button"
        className={`color-filter__trigger${activeColor ? ` color-filter__trigger--${activeColor}` : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${filterLabel}: ${triggerLabel}`}
      >
        {activeColor ? (
          <span
            className={`color-filter__swatch color-filter__swatch--${activeColor}`}
            aria-hidden
          />
        ) : (
          <span className="color-filter__swatch color-filter__swatch--all" aria-hidden />
        )}
        <span className="color-filter__trigger-label">{triggerLabel}</span>
        <svg
          className="color-filter__chevron"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="color-filter__menu" role="listbox" aria-label={filterLabel}>
          <button
            type="button"
            role="option"
            aria-selected={activeColor === null}
            className={`color-filter__option${activeColor === null ? " is-active" : ""}`}
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            <span className="color-filter__swatch color-filter__swatch--all" aria-hidden />
            <span className="color-filter__option-label">{allLabel}</span>
          </button>

          {colors.map((color) => (
            <button
              key={color}
              type="button"
              role="option"
              aria-selected={activeColor === color}
              className={`color-filter__option color-filter__option--${color}${
                activeColor === color ? " is-active" : ""
              }`}
              onClick={() => {
                onChange(color);
                setOpen(false);
              }}
            >
              <span className={`color-filter__swatch color-filter__swatch--${color}`} aria-hidden />
              <span className="color-filter__option-label">{labels[color]}</span>
              <span className="color-filter__option-count">{counts[color]}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

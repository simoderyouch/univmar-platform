"use client";

import { useCallback, useEffect } from "react";
import { publicAssetUrl } from "@/lib/publicAsset";

export type PortfolioModalProject = {
  id: number;
  title: string;
  image: string;
  categoryLabel: string;
};

type PortfolioModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  allLabel: string;
  itemsLabel: string;
  loadMoreLabel: string;
  emptyLabel: string;
  categories: { id: number; name: string }[];
  categoryCounts: Map<number, number>;
  activeCategory: number | null;
  onCategoryChange: (id: number | null) => void;
  displayed: PortfolioModalProject[];
  totalCount: number;
  filteredCount: number;
  hasMore: boolean;
  onLoadMore: () => void;
  onOpenProject: (id: number) => void;
  catLabel: (name: string) => string;
};

export default function PortfolioModal({
  open,
  onClose,
  title,
  closeLabel,
  allLabel,
  itemsLabel,
  loadMoreLabel,
  emptyLabel,
  categories,
  categoryCounts,
  activeCategory,
  onCategoryChange,
  displayed,
  totalCount,
  filteredCount,
  hasMore,
  onLoadMore,
  onOpenProject,
  catLabel,
}: PortfolioModalProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === "Escape") onClose();
    },
    [open, onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="portfolio-modal" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="portfolio-modal__panel" onClick={(e) => e.stopPropagation()}>
        <header className="portfolio-modal__header">
          <div>
            <h2 className="portfolio-modal__title">{title}</h2>
            <p className="portfolio-modal__count">
              {filteredCount} {itemsLabel}
            </p>
          </div>
          <button type="button" className="portfolio-modal__close ui-icon-btn" onClick={onClose} aria-label={closeLabel}>
            <svg className="ui-icon-btn__svg" viewBox="0 0 24 24" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="portfolio-modal__filters">
          <button
            type="button"
            className={`projects-filter${activeCategory === null ? " is-active" : ""}`}
            onClick={() => onCategoryChange(null)}
          >
            {allLabel}
            <span className="projects-filter__count">{totalCount}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`projects-filter${activeCategory === cat.id ? " is-active" : ""}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              {catLabel(cat.name)}
              <span className="projects-filter__count">{categoryCounts.get(cat.id) ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="portfolio-modal__body">
          {displayed.length > 0 ? (
            <>
              <div className="portfolio-modal__grid">
                {displayed.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    className="project-card project-card--interactive"
                    onClick={() => onOpenProject(project.id)}
                  >
                    <div className="project-card__media">
                      <img
                        src={publicAssetUrl(project.image)}
                        alt={project.title}
                        title={project.title}
                        className="project-card__img"
                        loading="lazy"
                      />
                    </div>
                    <div className="project-card__body">
                      <p className="project-card__category">{project.categoryLabel}</p>
                      <h3 className="project-card__title">{project.title}</h3>
                    </div>
                  </button>
                ))}
              </div>

              {hasMore && (
                <div className="portfolio-modal__more">
                  <button type="button" className="btn-outline" onClick={onLoadMore}>
                    {loadMoreLabel}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="portfolio-modal__empty">{emptyLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}

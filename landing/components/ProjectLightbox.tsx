"use client";

import { useCallback, useEffect } from "react";
import { publicAssetUrl } from "@/lib/publicAsset";

export type LightboxProject = {
  id: number;
  title: string;
  image: string;
  categoryLabel: string;
};

type ProjectLightboxProps = {
  project: LightboxProject | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
};

export default function ProjectLightbox({
  project,
  onClose,
  onPrev,
  onNext,
  closeLabel,
  prevLabel,
  nextLabel,
}: ProjectLightboxProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!project) return;
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && onPrev) onPrev();
      if (event.key === "ArrowRight" && onNext) onNext();
    },
    [project, onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, handleKeyDown]);

  if (!project) return null;

  return (
    <div
      className="project-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
    >
      <div className="project-lightbox__panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="project-lightbox__close ui-icon-btn" onClick={onClose} aria-label={closeLabel}>
          <svg className="ui-icon-btn__svg" viewBox="0 0 24 24" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {onPrev && (
          <button type="button" className="project-lightbox__nav project-lightbox__nav--prev ui-icon-btn" onClick={onPrev} aria-label={prevLabel}>
            <svg className="ui-icon-btn__svg" viewBox="0 0 24 24" aria-hidden>
              <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        {onNext && (
          <button type="button" className="project-lightbox__nav project-lightbox__nav--next ui-icon-btn" onClick={onNext} aria-label={nextLabel}>
            <svg className="ui-icon-btn__svg" viewBox="0 0 24 24" aria-hidden>
              <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <div className="project-lightbox__media">
          <img
            src={publicAssetUrl(project.image)}
            alt={project.title}
            title={project.title}
            className="project-lightbox__img"
          />
        </div>

        <div className="project-lightbox__meta">
          <p className="project-lightbox__category">{project.categoryLabel}</p>
          <h2 className="project-lightbox__title">{project.title}</h2>
        </div>
      </div>
    </div>
  );
}

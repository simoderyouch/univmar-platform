"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, type Lang } from "@/lib/i18n";

const OPTIONS = [
  { code: "fr" as const, label: "FR", name: "Français" },
  { code: "en" as const, label: "EN", name: "English" },
  { code: "ar" as const, label: "AR", name: "العربية" },
];

export default function LanguageDropdown({
  overDark = false,
  className = "",
  onSelect,
}: {
  overDark?: boolean;
  className?: string;
  onSelect?: () => void;
}) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = OPTIONS.find((option) => option.code === lang) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectLang = (code: Lang) => {
    setLang(code);
    setOpen(false);
    onSelect?.();
  };

  return (
    <div
      ref={rootRef}
      className={[
        "lang-dropdown",
        open ? "is-open" : "",
        overDark ? "lang-dropdown--over-dark" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className="lang-dropdown__trigger"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
      >
        <GlobeIcon />
        <span className="lang-dropdown__current">{current.label}</span>
        <ChevronIcon />
      </button>

      <div className="lang-dropdown__menu" role="listbox" aria-label="Select language">
        {OPTIONS.map((option) => (
          <button
            key={option.code}
            type="button"
            role="option"
            aria-selected={lang === option.code}
            className={`lang-dropdown__option${lang === option.code ? " is-active" : ""}`}
            onClick={() => selectLang(option.code)}
          >
            <span className="lang-dropdown__option-code">{option.label}</span>
            <span className="lang-dropdown__option-name">{option.name}</span>
            {lang === option.code ? <CheckIcon /> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="lang-dropdown__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="lang-dropdown__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

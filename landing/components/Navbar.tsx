"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import LanguageDropdown from "@/components/LanguageDropdown";

const LINKS = [
  { key: "home" as const, href: "/" },
  { key: "about" as const, href: "/a-propos" },
  { key: "products" as const, href: "/produits" },
{ key: "projects" as const, href: "/projets" },  
  { key: "contact" as const, href: "/contact" },
];

export default function Navbar({ overDarkHero = false }: { overDarkHero?: boolean }) {
  const { t, lp } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const onDarkHero = overDarkHero && !scrolled && !open;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    // `overflow: hidden` alone does not lock the document on iOS Safari.
    // Preserve the page position while the drawer is open so every page keeps
    // the same navigation behavior in Safari, Chrome, and Firefox.
    const scrollY = window.scrollY;
    const previous = {
      bodyOverflow: document.body.style.overflow,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
      bodyLeft: document.body.style.left,
      bodyRight: document.body.style.right,
      bodyWidth: document.body.style.width,
      htmlOverflow: document.documentElement.style.overflow,
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = previous.bodyOverflow;
      document.body.style.position = previous.bodyPosition;
      document.body.style.top = previous.bodyTop;
      document.body.style.left = previous.bodyLeft;
      document.body.style.right = previous.bodyRight;
      document.body.style.width = previous.bodyWidth;
      document.documentElement.style.overflow = previous.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const pathFor = (href: string) => lp(href === "/" ? "" : href);

  return (
    <>
      <header
        className={`site-navbar${scrolled ? " site-navbar--scrolled" : ""}${onDarkHero ? " site-navbar--over-dark-hero" : ""}`}
      >
        <div className="site-navbar__inner">
          {/* Logo */}
          <Link href={lp()} onClick={() => setOpen(false)} style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <Logo variant={onDarkHero ? "light" : "auto"} />
          </Link>

          {/* Desktop Nav */}
          <nav className="site-navbar__nav hidden-mobile">
            {LINKS.map(({ key, href }) => (
              <Link key={key} href={pathFor(href)} className="site-navbar__link">
                {t.nav[key]}
              </Link>
            ))}
          </nav>

          {/* Right: Lang + CTA + Burger */}
          <div className="site-navbar__actions">
            <ThemeToggle className="hidden-mobile" />

            <LanguageDropdown className="hidden-mobile" overDark={onDarkHero} />

            {/* CTA button */}
            <Link href={pathFor("/contact")} className="btn-gold hidden-mobile" style={{ fontSize: "0.72rem", padding: "10px 20px" }}>
              {t.nav.quote}
            </Link>

            {/* Burger */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
              aria-expanded={open}
              aria-controls="site-navbar-drawer"
              className="show-mobile site-navbar__burger"
            >
              <span className={`site-navbar__burger-line${open ? " is-top-open" : ""}`} />
              <span className={`site-navbar__burger-line site-navbar__burger-line--mid${open ? " is-hidden" : ""}`} />
              <span className={`site-navbar__burger-line${open ? " is-bottom-open" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div id="site-navbar-drawer" className={`site-navbar__drawer${open ? " is-open" : ""}`}>
        <div className="site-navbar__drawer-inner">
          {LINKS.map(({ key, href }) => (
            <Link
              key={key}
              href={pathFor(href)}
              onClick={() => setOpen(false)}
              style={{
                padding: "16px 0",
                borderBottom: "1px solid var(--color-border)",
                color: "var(--color-ink)",
                fontSize: "1.3rem",
                fontFamily: "var(--font-family-sans)",
                fontWeight: 600,
                textDecoration: "none",
                display: "block",
              }}
            >
              {t.nav[key]}
            </Link>
          ))}

          {/* Mobile lang switcher */}
          <div className="site-navbar__drawer-tools">
            <ThemeToggle />
            <LanguageDropdown onSelect={() => setOpen(false)} />
          </div>

          <Link href={pathFor("/contact")} onClick={() => setOpen(false)} className="btn-gold" style={{ marginTop: 24, justifyContent: "center" }}>
            {t.nav.quote}
          </Link>
        </div>
      </div>
    </>
  );
}

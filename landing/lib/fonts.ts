// Keep the container build independent from Google Fonts. The browser uses its
// installed Arabic font, with the CSS fallback stack defined in globals.css.
export const notoSansArabic = {
  className: "font-arabic",
  variable: "font-arabic",
} as const;

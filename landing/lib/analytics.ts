/** GA4 Measurement ID — set NEXT_PUBLIC_GA_ID in .env.local (dev) and Hostinger env (production). */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function pageview(url: string) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
}

/** Send conversion interactions without including visitor-entered personal data. */
export function trackEvent(name: string, parameters: Record<string, string | number | boolean> = {}) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, parameters);
}

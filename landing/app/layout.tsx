import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Libre_Baskerville, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/lib/theme";
import ThemeScript from "@/components/ThemeScript";
import Analytics from "@/components/Analytics";
import AnalyticsPageView from "@/components/AnalyticsPageView";
import ConditionalFloatingTools from "@/components/ConditionalFloatingTools";
import ScrollRestoration from "@/components/ScrollRestoration";
import ScrollRestorationScript from "@/components/ScrollRestorationScript";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "600", "700"],
  preload: true,
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "UNIVMAR | Pierre Naturelle & Excellence",
    template: "%s",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${plusJakarta.variable} ${libreBaskerville.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="p:domain_verify"
          content="82212e8b0066dc750f53100289c21a6b"
        />
        <ThemeScript />
        <ScrollRestorationScript />
      </head>
      <body
        className={`${plusJakarta.variable} ${libreBaskerville.variable}`}
      >
        <ThemeProvider>
          {children}
          <Suspense fallback={null}>
            <ScrollRestoration />
          </Suspense>
          <Analytics />
          <AnalyticsPageView />
          <ConditionalFloatingTools />
        </ThemeProvider>
      </body>
    </html>
  );
}

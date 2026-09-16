import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { ThemeProvider } from "@/lib/theme";
import ThemeScript from "@/components/ThemeScript";
import Analytics from "@/components/Analytics";
import AnalyticsPageView from "@/components/AnalyticsPageView";
import FloatingAssistant from "@/components/FloatingAssistant";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollRestoration from "@/components/ScrollRestoration";
import ScrollRestorationScript from "@/components/ScrollRestorationScript";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

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
    <html suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="p:domain_verify"
          content="82212e8b0066dc750f53100289c21a6b"
        />
        <ThemeScript />
        <ScrollRestorationScript />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <Suspense fallback={null}>
            <ScrollRestoration />
          </Suspense>
          <Analytics />
          <AnalyticsPageView />
          <FloatingWhatsApp />
          <FloatingAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}

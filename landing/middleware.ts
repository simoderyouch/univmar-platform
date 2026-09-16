import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/lib/site";
import { IMAGE_SEO_HEADERS } from "@/lib/imageAccess";

const STATIC_FILE = /\.[a-zA-Z0-9]+$/;

const LEGACY_PATHS = new Set([
  "/produits",
  "/a-propos",
  "/projets",
  "/contact",
  "/services",
  "/blog",
  "/marbre-maroc",
  "/pierre-de-taza",
  "/marbre-de-taza",
  "/prix-marbre-maroc",
  "/plan-de-travail-marbre",
  "/pierre-naturelle-maroc",
  "/granit-maroc",
  "/marbre-et-granit-maroc",
  "/marbre-local-maroc",
  "/marbre-importe",
  "/marbre-casablanca",
  "/marbre-rabat",
  "/marbre-temara",
  "/marbre-marrakech",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHost = request.headers.get("host")?.split(":")[0]?.toLowerCase();

  // Keep every external signal (links, indexing, and analytics) on one host.
  // Canonicals help Google consolidate duplicates, but a permanent redirect is
  // the correct first-line fix when the www host is publicly reachable.
  if (requestHost === "www.universmarbre.com") {
    const url = request.nextUrl.clone();
    url.hostname = "universmarbre.com";
    // `nextUrl` can retain the internal application port in hosted
    // environments. Redirecting to that port leaks it into public URLs.
    url.port = "";
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  if (pathname.startsWith("/images/")) {
    const response = NextResponse.next();
    for (const [key, value] of Object.entries(IMAGE_SEO_HEADERS)) {
      response.headers.set(key, value);
    }
    return response;
  }

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (STATIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}`;
    return NextResponse.redirect(url, 308);
  }

  if (first && isLocale(first)) {
    return NextResponse.next();
  }

  if (LEGACY_PATHS.has(pathname) || pathname.startsWith("/produits/") || pathname.startsWith("/blog/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|llms.txt).*)"],
};

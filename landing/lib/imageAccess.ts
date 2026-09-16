import type { NextRequest } from "next/server";
import { SITE_URL } from "@/lib/site";

const ALLOWED_ORIGIN_PREFIXES = [
  "http://localhost",
  "https://localhost",
  "http://127.0.0.1",
  "https://127.0.0.1",
  SITE_URL,
  SITE_URL.replace("https://", "http://"),
  "https://www.universmarbre.com",
  "http://www.universmarbre.com",
];

function matchesAllowedOrigin(value: string): boolean {
  return ALLOWED_ORIGIN_PREFIXES.some((prefix) => value.startsWith(prefix));
}

/** Block hotlinking and direct bulk downloads from outside the site. */
export function isAllowedImageRequest(request: NextRequest): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "same-origin" || secFetchSite === "same-site") {
    return true;
  }

  const secFetchMode = request.headers.get("sec-fetch-mode");
  if (secFetchSite === "none" && secFetchMode === "navigate") {
    return false;
  }

  const referer = request.headers.get("referer");
  if (referer && matchesAllowedOrigin(referer)) {
    return true;
  }

  const origin = request.headers.get("origin");
  if (origin && matchesAllowedOrigin(origin)) {
    return true;
  }

  return false;
}

export const IMAGE_SEO_HEADERS = {
  "Cache-Control": "public, max-age=604800, immutable",
} as const;

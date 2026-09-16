/** Encode public asset paths so UTF-8 folder names resolve correctly in all browsers. */
export function publicAssetUrl(src: string): string {
  if (!src?.startsWith("/")) return src;

  return src
    .split("/")
    .map((segment) => {
      if (!segment) return segment;
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    })
    .join("/");
}

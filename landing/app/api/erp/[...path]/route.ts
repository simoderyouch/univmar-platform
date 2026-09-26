import { NextResponse } from "next/server";
import { erpPublicApiBase } from "@/lib/erpCms";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ path: string[] }> };

/** Proxies public MinIO-backed ERP images through the landing origin. */
export async function GET(_request: Request, { params }: RouteContext) {
  const { path } = await params;
  const [section, collection, ...objectPath] = path;
  const allowed = section === "uploads" && (collection === "images" || collection === "base-gallery") && objectPath.length > 0;
  if (!allowed) return NextResponse.json({ error: "Image not found." }, { status: 404 });

  const encodedPath = path.map((segment) => encodeURIComponent(segment)).join("/");
  try {
    const response = await fetch(`${erpPublicApiBase()}/${encodedPath}`, {
      headers: { Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8" },
      cache: "no-store",
    });
    const headers = new Headers();
    for (const name of ["content-type", "cache-control", "x-content-type-options"]) {
      const value = response.headers.get(name);
      if (value) headers.set(name, value);
    }
    return new Response(response.body, { status: response.status, headers });
  } catch {
    return NextResponse.json({ error: "Image service is unavailable." }, { status: 502 });
  }
}

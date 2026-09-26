import { NextResponse } from "next/server";
import { erpPublicApiBase } from "@/lib/erpCms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { token } = await params;
  try {
    const response = await fetch(`${erpPublicApiBase()}/public/quotations/${encodeURIComponent(token)}`, { headers: { Accept: "application/json" }, cache: "no-store" });
    return new NextResponse(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("content-type") ?? "application/json", "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Quotation service is unavailable." }, { status: 502 }); }
}

export async function POST(request: Request, { params }: Context) {
  const { token } = await params;
  try {
    const response = await fetch(`${erpPublicApiBase()}/public/quotations/${encodeURIComponent(token)}/response`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: await request.text(), cache: "no-store" });
    return new NextResponse(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("content-type") ?? "application/json", "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Quotation service is unavailable." }, { status: 502 }); }
}

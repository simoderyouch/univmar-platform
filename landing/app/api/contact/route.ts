import { NextResponse } from "next/server";
import { erpPublicApiBase } from "@/lib/erpCms";

const contactEndpoint = `${erpPublicApiBase()}/public/contact-form`;

async function forward(path: string, init?: RequestInit) {
  const response = await fetch(`${contactEndpoint}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({ error: "The contact service is unavailable." }));
  return NextResponse.json(body, { status: response.status });
}

export async function GET() {
  try {
    return await forward("");
  } catch {
    return NextResponse.json({ error: "The contact service is unavailable." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      return await forward("/submissions-with-files", { method: "POST", body: form });
    }
    const body = await request.json();
    return await forward("/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ error: "The contact service is unavailable." }, { status: 502 });
  }
}

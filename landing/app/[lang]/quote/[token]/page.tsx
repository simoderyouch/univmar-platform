import type { Metadata } from "next";
import QuoteClient from "./QuoteClient";

export const metadata: Metadata = { title: "Devis UNIVMAR", robots: { index: false, follow: false } };

export default async function QuotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <QuoteClient token={token} />;
}

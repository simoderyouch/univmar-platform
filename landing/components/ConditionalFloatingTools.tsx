"use client";

import { usePathname } from "next/navigation";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

/** Quote links are focused client documents, so they do not show marketing tools. */
export default function ConditionalFloatingTools() {
  const pathname = usePathname();
  if (/^\/(fr|en|ar)\/quote(?:\/|$)/.test(pathname)) return null;
  return <FloatingWhatsApp />;
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocalePath } from "@/lib/i18n";
import { readSavedMaterials, savedMaterialEvents, toggleSavedMaterial, type SavedMaterial } from "@/lib/favourites";

type Props = {
  productId: string; name: string; category: string; image: string;
  variant?: { id: string; name: string };
  availability: { code: string; label: string };
  whatsappHref: string;
};

function AvailabilityIcon({ code }: { code: string }) {
  return code === "SHOWROOM_SELECTION" ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16M6.5 20V9.5L12 4l5.5 5.5V20M9 20v-5h6v5" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></svg>;
}

function SendIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 3-7.2 18-3.2-7-7.4-3.2L21 3Z" /><path d="m10.6 13.4 3.2.6" /></svg>; }
function BookmarkIcon({ saved }: { saved: boolean }) { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4.5h11v15l-5.5-3.4-5.5 3.4v-15Z" fill={saved ? "currentColor" : "none"} /></svg>; }
function WhatsAppIcon() { return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.02 3.2a12.8 12.8 0 0 0-10.96 19.42L3.2 28.8l6.34-1.82A12.8 12.8 0 1 0 16.02 3.2Zm0 23.37a10.5 10.5 0 0 1-5.35-1.47l-.38-.22-3.76 1.08 1.1-3.66-.25-.38a10.5 10.5 0 1 1 8.64 4.65Zm5.76-7.86c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.52-.16-.74.16-.21.32-.84 1.04-1.03 1.26-.19.21-.38.24-.7.08a8.58 8.58 0 0 1-2.53-1.56 9.5 9.5 0 0 1-1.76-2.2c-.18-.32 0-.49.14-.65.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.57-.08-.16-.74-1.78-1.01-2.44-.26-.64-.53-.55-.74-.56h-.63c-.21 0-.56.08-.85.4-.3.32-1.12 1.1-1.12 2.68 0 1.58 1.15 3.11 1.3 3.33.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.82.68.77.24 1.47.2 2.02.12.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.54-.08-.14-.3-.22-.62-.38Z" fill="currentColor" /></svg>; }

export default function ProductDiscoveryActions({ productId, name, category, image, variant, availability, whatsappHref }: Props) {
  const lp = useLocalePath();
  const [saved, setSaved] = useState(false);
  const item = useMemo<SavedMaterial>(() => ({ productId, variantId: variant?.id ?? productId, name, variantName: variant?.name ?? "Standard", category, image, addedAt: new Date().toISOString() }), [productId, variant?.id, variant?.name, name, category, image]);
  useEffect(() => { const sync = () => setSaved(readSavedMaterials().some((value) => value.variantId === item.variantId)); sync(); return savedMaterialEvents(sync); }, [item.variantId]);
  const action = availability.code === "SHOWROOM_SELECTION" ? "Book a slab selection visit" : availability.code === "AVAILABLE_ON_ORDER" ? "Ask about lead time" : "Request this material";
  const href = `${lp("/contact")}?intent=project&product=${encodeURIComponent(name)}&productId=${encodeURIComponent(productId)}&variantId=${encodeURIComponent(item.variantId)}&category=${encodeURIComponent(category)}&galleryImage=${encodeURIComponent(image)}`;
  return <section className="product-discovery" aria-label="Material availability and enquiry actions">
    <div className="product-discovery__status">
      <span className={`product-discovery__icon product-discovery__icon--${availability.code.toLowerCase()}`}><AvailabilityIcon code={availability.code} /></span>
      <div><p className="product-discovery__label">{availability.label}</p><p className="product-discovery__hint">Our team confirms the selected slab, quantity, finish, and delivery time with you.</p></div>
    </div>
    <div className="product-discovery__actions">
      <Link href={href} className="product-discovery__action"><SendIcon />{action}</Link>
      <button type="button" className="product-discovery__action" onClick={() => { toggleSavedMaterial(item); setSaved(!saved); }} aria-pressed={saved}><BookmarkIcon saved={saved} />{saved ? "Saved to your selection" : "Save to my selection"}</button>
      <a href={whatsappHref} className="product-discovery__action product-discovery__action--whatsapp" target="_blank" rel="noopener noreferrer"><WhatsAppIcon />WhatsApp</a>
    </div>
  </section>;
}

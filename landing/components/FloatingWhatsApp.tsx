"use client";

import { CONTACT_WHATSAPP } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";

export default function FloatingWhatsApp() {
  return (
    <a
      className="floating-whatsapp"
      href={CONTACT_WHATSAPP}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact Univmar on WhatsApp"
      title="WhatsApp"
      onClick={() => trackEvent("contact_click", { method: "whatsapp", location: "floating_button" })}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.02 3.2a12.8 12.8 0 0 0-10.96 19.42L3.2 28.8l6.34-1.82A12.8 12.8 0 1 0 16.02 3.2Zm0 23.37a10.5 10.5 0 0 1-5.35-1.47l-.38-.22-3.76 1.08 1.1-3.66-.25-.38a10.5 10.5 0 1 1 8.64 4.65Zm5.76-7.86c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.52-.16-.74.16-.21.32-.84 1.04-1.03 1.26-.19.21-.38.24-.7.08a8.58 8.58 0 0 1-2.53-1.56 9.5 9.5 0 0 1-1.76-2.2c-.18-.32 0-.49.14-.65.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.57-.08-.16-.74-1.78-1.01-2.44-.26-.64-.53-.55-.74-.56h-.63c-.21 0-.56.08-.85.4-.3.32-1.12 1.1-1.12 2.68 0 1.58 1.15 3.11 1.3 3.33.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.82.68.77.24 1.47.2 2.02.12.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.54-.08-.14-.3-.22-.62-.38Z"
        />
      </svg>
    </a>
  );
}

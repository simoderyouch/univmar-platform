"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_INSTAGRAM,
  CONTACT_INSTAGRAM_HANDLE,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP,
} from "@/lib/contact";
import { buildProductInquiryMessage, buildMultiProductInquiryMessage, quoteSubjectForLang } from "@/lib/productContact";
import { trackEvent } from "@/lib/analytics";

type FormState = { name: string; email: string; phone: string; subject: string; message: string; website: string };
type Status = "idle" | "sending" | "success" | "error";

const SUBJECTS_FR = ["Demande de devis", "Renseignement produit", "Visite showroom", "Partenariat", "Autre"];
const SUBJECTS_EN = ["Quote request", "Product inquiry", "Showroom visit", "Partnership", "Other"];
const SUBJECTS_AR = ["طلب عرض سعر", "استفسار عن منتج", "زيارة المعرض", "شراكة", "أخرى"];

function ContactPageContent() {
  const { t, lang } = useLang();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");

  const subjects =
    lang === "ar" ? SUBJECTS_AR : lang === "en" ? SUBJECTS_EN : SUBJECTS_FR;

  useEffect(() => {
    const product = searchParams.get("product");
    if (!product) return;

    const category = searchParams.get("category");
    const intent = searchParams.get("intent");

    const names = product.split(",").map((value) => value.trim()).filter(Boolean);
    const categories = category
      ? category.split(",").map((value) => value.trim()).filter(Boolean)
      : [];

    const message =
      names.length > 1
        ? buildMultiProductInquiryMessage(
            names.map((name, index) => ({
              name,
              category: categories[index] ?? categories[0],
            })),
            lang,
          )
        : buildProductInquiryMessage(product, category, lang);

    setForm((prev) => ({
      ...prev,
      subject: intent === "quote" ? quoteSubjectForLang(lang) : prev.subject,
      message: prev.message || message,
    }));
  }, [searchParams, lang]);

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
          lang,
          website: form.website,
        }),
      });

      if (!res.ok) throw new Error("send failed");

      trackEvent("generate_lead", {
        lead_type: "contact_form",
        form_subject: form.subject || "unspecified",
      });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <>
      <Navbar />

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <section style={{
        paddingTop: "clamp(120px, 14vw, 180px)",
        paddingBottom: "clamp(60px, 8vw, 100px)",
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
        borderBottom: "1px solid var(--color-border)",
      }}>
        <ScrollReveal style={{ maxWidth: 1400, margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: 20 }}>{t.contact.eyebrow}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", whiteSpace: "pre-line", lineHeight: 1.05 }}>
              {t.contact.title.split("\n")[0]}
              <br />
              <em style={{ fontStyle: "italic", color: "var(--color-gold)" }}>
                {t.contact.title.split("\n")[1]}
              </em>
            </h1>
            <p style={{ color: "var(--color-muted)", maxWidth: 400, fontSize: "clamp(0.9rem, 1.3vw, 1rem)", lineHeight: 1.8 }}>
              {t.contact.subtitle}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────── */}
      <section style={{ padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "clamp(40px, 7vw, 100px)" }} className="contact-grid">

          {/* ── LEFT: Contact info ── */}
          <ScrollReveal direction="right">
            <h3 style={{ fontSize: "clamp(1.3rem, 2vw, 1.6rem)", marginBottom: 8 }}>
              {t.contact.info.address}
            </h3>
            <div className="gold-divider" style={{ marginBottom: 36 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {/* Phone */}
              <InfoCard
                icon={<PhoneIcon />}
                label={t.contact.info.phone}
                value={CONTACT_PHONE}
                href={`tel:${CONTACT_PHONE_TEL}`}
              />
              {/* Email */}
              <InfoCard
                icon={<EmailIcon />}
                label={t.contact.info.email}
                value={CONTACT_EMAIL}
                href={`mailto:${CONTACT_EMAIL}`}
              />
              {/* Address */}
              <InfoCard
                icon={<MapIcon />}
                label={t.contact.info.address}
                value={CONTACT_ADDRESS}
              />
              {/* Instagram */}
              <InfoCard
                icon={<InstagramIcon />}
                label={t.contact.info.instagram}
                value={CONTACT_INSTAGRAM_HANDLE}
                href={CONTACT_INSTAGRAM}
              />
              {/* Hours */}
              <InfoCard
                icon={<ClockIcon />}
                label={t.contact.info.hours}
                value={t.contact.info.hoursVal}
              />
            </div>

            {/* WhatsApp CTA */}
            <a
              href={CONTACT_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 22px",
                marginTop: 40,
                background: "rgba(37,211,102,0.08)",
                border: "1px solid rgba(37,211,102,0.2)",
                borderRadius: 4,
                textDecoration: "none",
                transition: "background 200ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(37,211,102,0.14)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(37,211,102,0.08)")}
              onClick={() => trackEvent("contact_click", { method: "whatsapp", location: "contact_page" })}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#25d366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <div>
                <div style={{ color: "#25d366", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  WhatsApp
                </div>
                <div style={{ color: "var(--color-muted)", fontSize: "0.8rem" }}>{CONTACT_PHONE}</div>
              </div>
            </a>
          </ScrollReveal>

          {/* ── RIGHT: Form ── */}
          <ScrollReveal direction="left" delay={0.12}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={update("website")}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />

              {/* Row: Name + Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="form-row">
                <div>
                  <label className="form-label">{t.contact.form.name}</label>
                  <input
                    required
                    className="form-input"
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Mohammed Alaoui"
                  />
                </div>
                <div>
                  <label className="form-label">{t.contact.form.email}</label>
                  <input
                    required
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="exemple@mail.ma"
                  />
                </div>
              </div>

              {/* Row: Phone + Subject */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="form-row">
                <div>
                  <label className="form-label">{t.contact.form.phone}</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="+212 6XX-XXXXXX"
                  />
                </div>
                <div>
                  <label className="form-label">{t.contact.form.subject}</label>
                  <select
                    className="form-input"
                    value={form.subject}
                    onChange={update("subject")}
                    style={{ appearance: "none", cursor: "pointer" }}
                  >
                    <option value="">—</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="form-label">{t.contact.form.message}</label>
                <textarea
                  required
                  className="form-input"
                  rows={6}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Décrivez votre projet..."
                  style={{ resize: "vertical", minHeight: 140 }}
                />
              </div>

              {/* Submit */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-gold"
                  style={{ opacity: status === "sending" ? 0.7 : 1, cursor: status === "sending" ? "not-allowed" : "pointer" }}
                >
                  {status === "sending" ? t.contact.form.sending : t.contact.form.send}
                  {status !== "sending" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                    </svg>
                  )}
                </button>

                {status === "success" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#4ade80", fontSize: "0.88rem" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {t.contact.form.success}
                  </div>
                )}
                {status === "error" && (
                  <div style={{ color: "#f87171", fontSize: "0.88rem" }}>{t.contact.form.error}</div>
                )}
              </div>
            </form>

            {/* Decorative bottom note */}
            <p style={{ marginTop: 24, fontSize: "0.78rem", color: "var(--color-subtle)", lineHeight: 1.7 }}>
              Nous répondons généralement sous <strong style={{ color: "var(--color-muted)" }}>24 heures ouvrées</strong>.
              Pour une urgence, contactez-nous directement par WhatsApp.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageContent />
    </Suspense>
  );
}

function InfoCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        background: "var(--color-gold-muted)",
        border: "1px solid rgba(201,164,110,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "var(--color-gold)",
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-subtle)", marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: "0.9rem", color: "var(--color-muted)", lineHeight: 1.5 }}>{value}</div>
      </div>
    </div>
  );

  if (href) {
    const method = href.startsWith("tel:") ? "phone" : href.startsWith("mailto:") ? "email" : "external";
    return (
      <a href={href} style={{ textDecoration: "none", display: "block", transition: "opacity 180ms ease" }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        onClick={() => trackEvent("contact_click", { method, location: "contact_page" })}
      >
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 8.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

import nodemailer from "nodemailer";
import { CONTACT_EMAIL } from "@/lib/contact";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  lang?: string;
  website?: string;
};

const MAX = {
  name: 100,
  email: 254,
  phone: 30,
  subject: 120,
  message: 5000,
} as const;

function trim(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateContactPayload(body: unknown):
  | { ok: true; data: Omit<ContactPayload, "website"> }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const raw = body as ContactPayload;

  if (trim(raw.website)) {
    return { ok: false, error: "Spam detected." };
  }

  const name = trim(raw.name);
  const email = trim(raw.email).toLowerCase();
  const phone = trim(raw.phone);
  const subject = trim(raw.subject);
  const message = trim(raw.message);
  const lang = trim(raw.lang) || "fr";

  if (name.length < 2 || name.length > MAX.name) {
    return { ok: false, error: "Invalid name." };
  }
  if (!isValidEmail(email) || email.length > MAX.email) {
    return { ok: false, error: "Invalid email." };
  }
  if (phone.length > MAX.phone) {
    return { ok: false, error: "Invalid phone." };
  }
  if (subject.length > MAX.subject) {
    return { ok: false, error: "Invalid subject." };
  }
  if (message.length < 10 || message.length > MAX.message) {
    return { ok: false, error: "Invalid message." };
  }

  return {
    ok: true,
    data: { name, email, phone, subject, message, lang },
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailContent(data: Omit<ContactPayload, "website">) {
  const subjectLine = data.subject
    ? `[UNIVMAR] ${data.subject}`
    : "[UNIVMAR] Nouveau message depuis le site";

  const text = [
    "Nouveau message depuis universmarbre.com",
    "",
    `Nom : ${data.name}`,
    `E-mail : ${data.email}`,
    data.phone ? `Téléphone : ${data.phone}` : null,
    data.subject ? `Objet : ${data.subject}` : null,
    `Langue : ${data.lang}`,
    "",
    "Message :",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <h2>Nouveau message depuis universmarbre.com</h2>
    <p><strong>Nom :</strong> ${escapeHtml(data.name)}</p>
    <p><strong>E-mail :</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
    ${data.phone ? `<p><strong>Téléphone :</strong> ${escapeHtml(data.phone)}</p>` : ""}
    ${data.subject ? `<p><strong>Objet :</strong> ${escapeHtml(data.subject)}</p>` : ""}
    <p><strong>Langue :</strong> ${escapeHtml(data.lang ?? "fr")}</p>
    <hr />
    <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
  `;

  return { subjectLine, text, html };
}

export async function sendContactEmail(data: Omit<ContactPayload, "website">) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured (SMTP_HOST, SMTP_USER, SMTP_PASS).");
  }

  const to = process.env.CONTACT_TO ?? CONTACT_EMAIL;
  const from = process.env.SMTP_FROM ?? user;
  const { subjectLine, text, html } = buildEmailContent(data);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"UNIVMAR Contact" <${from}>`,
    to,
    replyTo: `"${data.name}" <${data.email}>`,
    subject: subjectLine,
    text,
    html,
  });
}

"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import styles from "./QuoteClient.module.css";

type Line = { materialName: string; variantLabel: string; quantityM2: number; unitPrice: number; total: number };
type Quote = { number: string; customerName: string; projectName: string; expiryDate?: string; paymentTerms?: string; notes?: string; status: string; subtotal: number; taxTotal: number; transport: number; grandTotal: number; items: Line[]; clientResponse: "PENDING" | "ACCEPTED" | "REVISION_REQUESTED" };
type ApiResponse<T> = { data: T; error?: { message?: string } };

const money = (value: number) => `${Number(value).toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`;

function BrandMark() {
  return <Image src="/univmar-logo.png" alt="UNIVMAR" width={160} height={62} priority className={styles.brandMark} />;
}

export default function QuoteClient({ token }: { token: string }) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<"ACCEPTED" | "REVISION_REQUESTED">("ACCEPTED");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    void fetch(`/api/quote/${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async result => {
        const body = await result.json() as ApiResponse<Quote>;
        if (!result.ok) throw new Error(body.error?.message ?? "Ce devis n'est plus disponible.");
        setQuote(body.data);
      })
      .catch(cause => setError((cause as Error).message))
      .finally(() => setLoading(false));
  }, [token]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = await fetch(`/api/quote/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response, name, email: email || null, message: message || null }),
      });
      const body = await result.json() as ApiResponse<Quote>;
      if (!result.ok) throw new Error(body.error?.message ?? "Votre réponse n'a pas pu être enregistrée.");
      setQuote(body.data);
      setDone(true);
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className={styles.state}><span className={styles.loadingMark} />Chargement de votre devis…</main>;

  if (!quote) return <main className={styles.state}><section className={styles.unavailable}><BrandMark /><p className={styles.kicker}>LIEN CLIENT UNIVMAR</p><h1>Devis indisponible</h1><p>{error || "Ce lien est invalide, expiré ou a déjà été remplacé."}</p></section></main>;

  return <main className={styles.page}>
    <div className={styles.topline}><BrandMark /><p><span>Devis client</span><b>Accès sécurisé</b></p></div>

    <article className={styles.folio}>
      <header className={styles.cover}>
        <div className={styles.coverIdentity}><p className={styles.coverLabel}>PROPOSITION COMMERCIALE</p><h1>Votre<br />devis.</h1><p className={styles.coverProject}>{quote.projectName}</p></div>
        <div className={styles.coverMeta}><p>RÉFÉRENCE</p><strong>{quote.number}</strong><div /><p>VALABLE JUSQU’AU</p><strong>{quote.expiryDate ?? "À confirmer"}</strong></div>
      </header>

      <section className={styles.intro}>
        <div><p className={styles.sectionLabel}>PRÉPARÉ POUR</p><h2>{quote.customerName}</h2></div>
        <p className={styles.introCopy}>Voici le détail des matériaux, prestations et conditions préparés par votre conseiller UNIVMAR.</p>
      </section>

      <section className={styles.linesSection} aria-labelledby="quotation-lines">
        <div className={styles.sectionHeading}><p className={styles.sectionLabel}>DÉTAIL DE LA PROPOSITION</p><span>{quote.items.length} {quote.items.length > 1 ? "articles" : "article"}</span></div>
        <div className={styles.tableFrame}>
          <table className={styles.table} id="quotation-lines"><thead><tr><th>Matériau</th><th>Surface</th><th>Prix unitaire</th><th>Montant</th></tr></thead><tbody>{quote.items.map((item, index) => <tr key={index}><td><b>{item.materialName}</b><span>{item.variantLabel}</span></td><td>{item.quantityM2} <small>m²</small></td><td>{money(item.unitPrice)}</td><td>{money(item.total)}</td></tr>)}</tbody></table>
        </div>
      </section>

      <section className={styles.summary}>
        <div className={styles.terms}><p className={styles.sectionLabel}>CONDITIONS</p><p>{quote.paymentTerms || "Les modalités de règlement seront confirmées par votre conseiller."}</p>{quote.notes && <p className={styles.note}>{quote.notes}</p>}</div>
        <div className={styles.totalCard}><div><span>Sous-total</span><b>{money(quote.subtotal)}</b></div><div><span>TVA</span><b>{money(quote.taxTotal)}</b></div>{quote.transport > 0 && <div><span>Transport</span><b>{money(quote.transport)}</b></div>}<hr /><div className={styles.grandTotal}><span>Total TTC</span><b>{money(quote.grandTotal)}</b></div></div>
      </section>
    </article>

    {quote.clientResponse === "PENDING" && !done ? <form onSubmit={submit} className={styles.decision}>
      <aside className={styles.decisionAside}><p className={styles.sectionLabel}>VOTRE DÉCISION</p><h2>Un dernier échange,<br />puis nous avançons.</h2><p>Votre conseiller vérifie avec vous les détails avant de confirmer le stock et de lancer la commande.</p><div className={styles.securityNote}><span>✓</span> Ce lien est personnel et protégé.</div></aside>
      <div className={styles.decisionForm}><p className={styles.decisionPrompt}>Quelle est votre réponse à cette proposition&nbsp;?</p><div className={styles.choiceGrid}><button type="button" onClick={() => setResponse("ACCEPTED")} className={`${styles.choice} ${response === "ACCEPTED" ? styles.choiceActive : ""}`}><b>J’accepte le devis</b><span>Je souhaite confirmer avec mon conseiller.</span></button><button type="button" onClick={() => setResponse("REVISION_REQUESTED")} className={`${styles.choice} ${response === "REVISION_REQUESTED" ? styles.choiceActive : ""}`}><b>Je souhaite une modification</b><span>J’ai une question ou un ajustement à demander.</span></button></div>
        <div className={styles.fields}><label>Votre nom<input required value={name} onChange={event => setName(event.target.value)} autoComplete="name" /></label><label>Votre email <em>facultatif</em><input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" /></label></div>
        <label className={styles.message}>Votre message <em>facultatif</em><textarea value={message} onChange={event => setMessage(event.target.value)} placeholder="Ajoutez une question, une précision ou la date souhaitée…" /></label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={saving} className={styles.submit}>{saving ? "Envoi en cours…" : "Envoyer ma réponse"}<span>→</span></button>
      </div>
    </form> : <section className={styles.thanks}><p className={styles.sectionLabel}>RÉPONSE ENREGISTRÉE</p><h2>Merci, votre conseiller a été informé.</h2><p>UNIVMAR vous contactera pour confirmer les prochaines étapes et la disponibilité du stock.</p></section>}

    <footer className={styles.footer}><span>UNIVMAR · Pierre naturelle & excellence</span><span>Document client confidentiel</span></footer>
  </main>;
}

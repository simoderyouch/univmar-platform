import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Columns3,
  Copy,
  FileText,
  LayoutList,
  Link,
  Mail,
  Plus,
  Send,
} from "lucide-react";
import { api } from "../../../shared/api/client";
import { Button, PaginationControls } from "../../../shared/ui";
import { useRouter } from "../../../app/providers/router";

type QuoteItem = {
  variantId: string;
  materialName: string;
  variantLabel: string;
  quantityM2: number;
  unitPrice: number;
  total: number;
};
type Dispatch = {
  id: string;
  channel: "EMAIL" | "SHARE_LINK";
  status: "SENT" | "FAILED";
  recipientEmail?: string;
  ccEmails?: string;
  subject?: string;
  sentBy: string;
  sentAt?: string;
  failureReason?: string;
  clientResponse: "PENDING" | "ACCEPTED" | "REVISION_REQUESTED";
  respondedBy?: string;
  responseMessage?: string;
  respondedAt?: string;
  createdAt: string;
};
type Quote = {
  id: string;
  number: string;
  customerName: string;
  customerEmail?: string;
  projectName: string;
  expiryDate?: string;
  transport: number;
  paymentTerms?: string;
  status: string;
  revision: number;
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  orderId?: string;
  deliveryCount: number;
  items: QuoteItem[];
  dispatches: Dispatch[];
};
type Rfq = {
  id: string;
  number: string;
  customerId: string;
  projectId: string;
  customerName: string;
  items: {
    variantId: string;
    materialName: string;
    variantLabel: string;
    quantityM2: number;
  }[];
};
type SendResult = { quotation: Quote; dispatch: Dispatch; publicUrl: string };

const field =
  "mt-1 h-10 w-full rounded-md border border-[#d8ccc4] bg-white px-3 text-sm outline-none focus:border-[#110703]";
const money = (value: number) =>
  `${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`;
const label = (value: string) =>
  value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
const dateTime = (value?: string) =>
  value ? new Date(value).toLocaleString() : "—";

export function QuotationsPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [detail, setDetail] = useState<Quote | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"board" | "list">("board");
  const [pageData, setPageData] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  async function load(nextPage = pageData.page) {
    setLoading(true);
    try {
      const result = await api<{
        content: Quote[];
        page: number;
        totalPages: number;
        totalElements: number;
      }>(`/quotations?page=${nextPage}&size=20`);
      setQuotes(result.content);
      setPageData(result);
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load(0);
  }, []);
  if (creating)
    return (
      <NewQuotation
        back={() => setCreating(false)}
        done={async (quote) => {
          setDetail(quote);
          await load();
          setCreating(false);
        }}
      />
    );
  if (detail)
    return (
      <QuotationDocument
        quote={detail}
        back={() => setDetail(null)}
        change={setDetail}
      />
    );
  const drafts = quotes.filter((quote) => quote.status === "DRAFT");
  const sent = quotes.filter((quote) => quote.status === "SENT");
  const activeValue = quotes
    .filter((quote) => !["REJECTED", "EXPIRED"].includes(quote.status))
    .reduce((sum, quote) => sum + Number(quote.grandTotal), 0);
  const open = (quote: Quote) =>
    void api<Quote>(`/quotations/${quote.id}`)
      .then(setDetail)
      .catch((cause) => setError((cause as Error).message));
  return (
    <section className="mx-auto max-w-6xl px-4 py-7">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8ccc4] pb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#806f65]">
            COMMERCIAL PROPOSALS
          </p>
          <h1 className="mt-2 font-sans text-4xl tracking-tight">Quotations</h1>
          <p className="mt-2 max-w-xl text-sm text-[#786961]">
            Create, send, follow up, and confirm commercial offers.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} /> New quotation
        </Button>
      </header>
      <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-[#d8ccc4] bg-[#d8ccc4] sm:grid-cols-3">
        <Metric
          label="Drafts"
          value={String(drafts.length)}
          detail="Not shared with clients"
        />
        <Metric
          label="Awaiting reply"
          value={String(sent.length)}
          detail="Sent offers"
        />
        <Metric
          label="Active value"
          value={money(activeValue)}
          detail="On this page"
        />
      </div>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <section className="mt-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-sans text-xl">Proposal workspace</h2>
            <p className="mt-1 text-xs text-[#786961]">
              Follow each devis from first send through customer confirmation.
            </p>
          </div>
          <div className="inline-flex rounded-md border border-[#d8ccc4] bg-white p-1">
            <button
              type="button"
              onClick={() => setView("board")}
              className={`inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-xs font-semibold ${view === "board" ? "bg-[#21140f] text-white" : "text-[#786961]"}`}
            >
              <Columns3 size={14} /> Board
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-xs font-semibold ${view === "list" ? "bg-[#21140f] text-white" : "text-[#786961]"}`}
            >
              <LayoutList size={14} /> List
            </button>
          </div>
        </div>
        {quotes.length ? (
          view === "board" ? (
            <QuotationBoard quotes={quotes} open={open} />
          ) : (
            <section className="mt-5 overflow-hidden rounded-xl border border-[#d8ccc4] bg-white">
              <div className="hidden grid-cols-[1.1fr_1.25fr_.8fr_.9fr_34px] gap-5 border-b border-[#e9dfd9] bg-[#fcfaf8] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#806f65] md:grid">
                <span>Proposal</span>
                <span>Customer / project</span>
                <span>Validity</span>
                <span className="text-right">Commercial total</span>
                <span />
              </div>
              <div className="divide-y divide-[#eee6e1]">
                {quotes.map((quote) => (
                  <QuoteRow
                    key={quote.id}
                    quote={quote}
                    open={() => open(quote)}
                  />
                ))}
              </div>
            </section>
          )
        ) : (
          <EmptyQuotes create={() => setCreating(true)} />
        )}
        <PaginationControls
          page={pageData.page}
          totalPages={pageData.totalPages}
          totalElements={pageData.totalElements}
          itemCount={quotes.length}
          loading={loading}
          onPageChange={(nextPage) => void load(nextPage)}
          noun="quotations"
        />
      </section>
    </section>
  );
}

function Metric({
  label: title,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="bg-white px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#806f65]">
        {title}
      </p>
      <p className="mt-2 font-sans text-2xl">{value}</p>
      <p className="mt-1 text-xs text-[#786961]">{detail}</p>
    </article>
  );
}
function Status({ value }: { value: string }) {
  const tone =
    value === "ACCEPTED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : value === "SENT"
        ? "border-[#d9c2a6] bg-[#fbf2e7] text-[#76512f]"
        : value === "DRAFT"
          ? "border-[#d9d0ca] bg-[#f5f1ee] text-[#6c5c53]"
          : "border-[#e5d4d1] bg-[#faf2f1] text-[#9a4f46]";
  return (
    <div className="flex flex-col justify-center items-center">
      <span
        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone}`}
      >
        {label(value)}
      </span>
    </div>
  );
}
function QuoteRow({ quote, open }: { quote: Quote; open: () => void }) {
  return (
    <button
      type="button"
      onClick={open}
      className="grid w-full gap-3 px-5 py-5 text-left transition-colors hover:bg-[#fcfaf8] md:grid-cols-[1.1fr_1.25fr_.8fr_.9fr_34px] md:items-center md:gap-5"
    >
      <div>
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-[#a4764d]" />
          <b className="font-mono text-sm tracking-tight">{quote.number}</b>
        </div>
        <p className="mt-1.5 text-xs text-[#786961]">
          Revision {quote.revision} · {quote.items.length} lines
        </p>
      </div>
      <div>
        <p className="font-medium">{quote.customerName}</p>
        <p className="mt-1 text-sm text-[#786961]">{quote.projectName}</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-[#65564e]">
        <CalendarDays size={14} className="text-[#a4764d]" />
        <span>
          {quote.expiryDate ? `Until ${quote.expiryDate}` : "No expiry set"}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 md:block md:text-right">
        <Status value={quote.status} />
        <p className="mt-1 font-sans text-lg md:mt-2">
          {money(quote.grandTotal)}
        </p>
      </div>
      <ChevronRight size={18} className="hidden text-[#a99b92] md:block" />
    </button>
  );
}
function QuotationBoard({
  quotes,
  open,
}: {
  quotes: Quote[];
  open: (quote: Quote) => void;
}) {
  const columns = [
    { status: "DRAFT", label: "Drafting" },
    { status: "SENT", label: "Awaiting reply" },
    { status: "ACCEPTED", label: "Accepted" },
    { status: "REJECTED", label: "Closed" },
  ];
  return (
    <div className="mt-5 overflow-x-auto pb-2">
      <div className="grid min-w-[920px] grid-cols-4 gap-3">
        {columns.map((column) => (
          <section
            key={column.status}
            className="min-h-[315px] rounded-xl border border-[#e1d5cd] bg-[#faf8f6] p-3"
          >
            <header className="border-b border-[#e4dad4] pb-3">
              <p className="text-[10px] font-bold tracking-[.14em] text-[#806f65]">
                {column.label.toUpperCase()}
              </p>
            </header>
            <div className="mt-3 grid gap-3">
              {quotes
                .filter((quote) => quote.status === column.status)
                .map((quote) => (
                  <button
                    key={quote.id}
                    type="button"
                    onClick={() => open(quote)}
                    className="rounded-lg border border-[#e3d8d1] bg-white p-3 text-left hover:border-[#aa7756]"
                  >
                    <p className="font-mono text-sm font-semibold">
                      {quote.number}
                    </p>
                    <p className="mt-2 font-sans text-lg">
                      {money(quote.grandTotal)}
                    </p>
                    <p className="mt-3 text-sm font-medium">
                      {quote.customerName}
                    </p>
                    <p className="mt-0.5 text-xs text-[#786961]">
                      {quote.projectName}
                    </p>
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
function EmptyQuotes({ create }: { create: () => void }) {
  return (
    <div className="px-5 py-16 text-center">
      <FileText size={28} className="mx-auto text-[#b39a85]" />
      <p className="mt-4 font-medium">No quotations have been created.</p>
      <Button className="mt-5" onClick={create}>
        <Plus size={16} /> New quotation
      </Button>
    </div>
  );
}

function NewQuotation({
  back,
  done,
}: {
  back: () => void;
  done: (quote: Quote) => Promise<void>;
}) {
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [id, setId] = useState("");
  const [expiry, setExpiry] = useState("");
  const [prices, setPrices] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    void api<{ content: Rfq[] }>("/rfqs?status=SUBMITTED&size=100")
      .then((result) => setRfqs(result.content))
      .catch((cause) => setError((cause as Error).message));
  }, []);
  const rfq = rfqs.find((item) => item.id === id);
  async function save() {
    if (!rfq) return;
    setSaving(true);
    setError("");
    try {
      const quote = await api<Quote>("/quotations", {
        method: "POST",
        body: JSON.stringify({
          customerId: rfq.customerId,
          projectId: rfq.projectId,
          rfqId: rfq.id,
          expiryDate: expiry,
          transport: 0,
          paymentTerms: null,
          notes: null,
          items: rfq.items.map((item, index) => ({
            variantId: item.variantId,
            materialName: item.materialName,
            variantLabel: item.variantLabel,
            quantityM2: item.quantityM2,
            unitPrice: Number(prices[index] || 0),
            discountPercent: 0,
            taxPercent: 20,
          })),
        }),
      });
      await done(quote);
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <section className="mx-auto max-w-3xl px-4 py-7">
      <button
        onClick={back}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#65564e]"
      >
        <ArrowLeft size={16} /> Quotations
      </button>
      <header className="mt-5 border-b border-[#d8ccc4] pb-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-[#806f65]">
          COMMERCIAL PROPOSAL
        </p>
        <h1 className="mt-2 font-sans text-4xl">Create quotation</h1>
      </header>
      <div className="mt-6 rounded-xl border border-[#d8ccc4] bg-white p-6">
        <label className="text-sm font-semibold">
          Source RFQ
          <select
            className={field}
            value={id}
            onChange={(event) => setId(event.target.value)}
          >
            <option value="">Select a submitted RFQ</option>
            {rfqs.map((item) => (
              <option key={item.id} value={item.id}>
                {item.number} · {item.customerName}
              </option>
            ))}
          </select>
        </label>
        {rfq && (
          <div className="mt-6 border-t border-[#eadfd8] pt-5">
            {rfq.items.map((item, index) => (
              <label
                key={index}
                className="mt-4 grid gap-2 rounded-lg border border-[#eee6e1] bg-[#fcfaf8] p-4 text-sm sm:grid-cols-[1fr_180px]"
              >
                <span>
                  <b>{item.materialName}</b>
                  <small className="mt-1 block text-[#786961]">
                    {item.variantLabel} · {item.quantityM2} m²
                  </small>
                </span>
                <span>
                  Unit price (MAD)
                  <input
                    className={field}
                    type="number"
                    min="0"
                    value={prices[index] || ""}
                    onChange={(event) =>
                      setPrices({ ...prices, [index]: event.target.value })
                    }
                  />
                </span>
              </label>
            ))}
          </div>
        )}
        <label className="mt-5 block text-sm font-semibold">
          Offer expiry
          <input
            className={field}
            type="date"
            value={expiry}
            onChange={(event) => setExpiry(event.target.value)}
          />
        </label>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={back}>
            Cancel
          </Button>
          <Button
            onClick={() => void save()}
            loading={saving}
            disabled={!rfq || !expiry}
          >
            Create draft
          </Button>
        </div>
      </div>
    </section>
  );
}

function QuotationDocument({
  quote,
  back,
  change,
}: {
  quote: Quote;
  back: () => void;
  change: (quote: Quote) => void;
}) {
  const { navigate } = useRouter();
  const [sendOpen, setSendOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [availability, setAvailability] = useState<Record<string, number>>({});
  const [acceptance, setAcceptance] = useState({
    method: "PHONE",
    acceptedBy: quote.customerName,
    note: "",
  });
  const [shareUrl, setShareUrl] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const clientResponse = useMemo(
    () =>
      quote.dispatches.find(
        (dispatch) => dispatch.clientResponse !== "PENDING",
      ),
    [quote.dispatches],
  );
  useEffect(() => {
    if (confirm)
      void Promise.all(
        quote.items.map((item) =>
          api<number>(
            `/inventory/variant-availability?variantId=${item.variantId}`,
          ).then((value) => [item.variantId, value] as const),
        ),
      )
        .then((rows) => setAvailability(Object.fromEntries(rows)))
        .catch((cause) => setError((cause as Error).message));
  }, [confirm, quote.items]);
  async function share() {
    setWorking(true);
    setError("");
    try {
      const result = await api<SendResult>(
        `/quotations/${quote.id}/share-link`,
        { method: "POST" },
      );
      change(result.quotation);
      setShareUrl(result.publicUrl);
      await navigator.clipboard?.writeText(result.publicUrl);
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setWorking(false);
    }
  }
  async function accept() {
    setWorking(true);
    setError("");
    try {
      await api(`/orders/from-quotation/${quote.id}`, {
        method: "POST",
        body: JSON.stringify(acceptance),
      });
      navigate("/orders");
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setWorking(false);
    }
  }
  return (
    <section className="mx-auto max-w-4xl px-4 py-7">
      <button
        onClick={back}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#65564e]"
      >
        <ArrowLeft size={16} /> Quotations
      </button>
      <article className="mt-5 overflow-hidden rounded-xl border border-[#d8ccc4] bg-white">
        <header className="flex flex-wrap justify-between gap-5 border-b border-[#d8ccc4] bg-[#fcfaf8] px-6 py-7 sm:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#806f65]">
              UNIVMAR MARBLE · DEVIS
            </p>
            <h1 className="mt-2 font-sans text-4xl">{quote.number}</h1>
          </div>
          <Status value={quote.status} />
        </header>
        <div className="px-6 py-7 sm:px-8">
          <p className="font-sans text-2xl">{quote.customerName}</p>
          <p className="mt-1 text-sm text-[#786961]">
            {quote.projectName} · Valid until {quote.expiryDate ?? "—"}
          </p>
          <div className="mt-8 overflow-x-auto border-y border-[#e9dfd9]">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-[0.1em] text-[#806f65]">
                <tr>
                  <th className="py-3">Material</th>
                  <th className="py-3">Quantity</th>
                  <th className="py-3 text-right">Unit price</th>
                  <th className="py-3 text-right">Line total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee6e1]">
                {quote.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-4">
                      <b>{item.materialName}</b>
                      <small className="mt-1 block text-[#786961]">
                        {item.variantLabel}
                      </small>
                    </td>
                    <td>{item.quantityM2} m²</td>
                    <td className="text-right">{money(item.unitPrice)}</td>
                    <td className="text-right font-medium">
                      {money(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ml-auto mt-6 max-w-xs space-y-2 border-t-2 border-[#21140f] pt-4 text-right text-sm">
            <p className="flex justify-between">
              <span>Subtotal</span>
              <span>{money(quote.subtotal)}</span>
            </p>
            <p className="flex justify-between">
              <span>Tax</span>
              <span>{money(quote.taxTotal)}</span>
            </p>
            <p className="flex justify-between font-sans text-xl">
              <span>Total</span>
              <span>{money(quote.grandTotal)}</span>
            </p>
          </div>
          {quote.paymentTerms && (
            <p className="mt-7 border-l-2 border-[#c99b68] bg-[#fbf7f3] px-4 py-3 text-sm">
              <b>Payment terms: </b>
              {quote.paymentTerms}
            </p>
          )}
        </div>
      </article>
      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {shareUrl && (
        <div className="mt-5 rounded-xl border border-[#c99b68] bg-[#fffaf4] p-4 text-sm">
          <b>Client link copied.</b>
          <p className="mt-1 break-all text-[#65564e]">{shareUrl}</p>
        </div>
      )}
      {quote.status === "DRAFT" && (
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => setSendOpen(true)}>
            <Mail size={16} /> Send by email
          </Button>
          <Button
            variant="outline"
            loading={working}
            onClick={() => void share()}
          >
            <Link size={16} /> Copy WhatsApp link
          </Button>
        </div>
      )}
      {quote.status === "SENT" && (
        <>
          <section className="mt-5 rounded-xl border border-[#d8ccc4] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[.13em] text-[#806f65]">
                  CLIENT RESPONSE
                </p>
                <h2 className="mt-1 font-sans text-xl">
                  {clientResponse
                    ? label(clientResponse.clientResponse)
                    : "Awaiting response"}
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSendOpen(true)}
                >
                  <Mail size={15} /> Send again
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  loading={working}
                  onClick={() => void share()}
                >
                  <Copy size={15} /> Copy link
                </Button>
              </div>
            </div>
            {clientResponse ? (
              <p className="mt-3 text-sm text-[#5f483c]">
                {clientResponse.respondedBy} ·{" "}
                {dateTime(clientResponse.respondedAt)}
                {clientResponse.responseMessage
                  ? ` — ${clientResponse.responseMessage}`
                  : ""}
              </p>
            ) : (
              <p className="mt-2 text-sm text-[#786961]">
                The client can accept or request changes through the secure
                link. Phone and WhatsApp confirmations are recorded below by
                sales.
              </p>
            )}
          </section>
          {!confirm && (
            <Button className="mt-5" onClick={() => setConfirm(true)}>
              <CheckCircle2 size={16} /> Record acceptance & reserve stock
            </Button>
          )}
        </>
      )}
      {sendOpen && (
        <SendPanel
          quote={quote}
          close={() => setSendOpen(false)}
          done={(result) => {
            change(result.quotation);
            setShareUrl(result.publicUrl);
            setSendOpen(false);
          }}
        />
      )}
      {confirm && (
        <section className="mt-5 rounded-xl border border-[#d8ccc4] bg-white p-6">
          <h2 className="font-sans text-2xl">Record customer acceptance</h2>
          <p className="mt-2 text-sm text-[#786961]">
            This confirms evidence of acceptance, creates the order, and
            reserves available stock.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Acceptance method
              <select
                className={field}
                value={acceptance.method}
                onChange={(event) =>
                  setAcceptance({ ...acceptance, method: event.target.value })
                }
              >
                {[
                  "PHONE",
                  "EMAIL",
                  "WHATSAPP",
                  "SIGNED_QUOTATION",
                  "PURCHASE_ORDER",
                  "PUBLIC_LINK",
                ].map((value) => (
                  <option key={value}>{label(value)}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Accepted by
              <input
                className={field}
                value={acceptance.acceptedBy}
                onChange={(event) =>
                  setAcceptance({
                    ...acceptance,
                    acceptedBy: event.target.value,
                  })
                }
              />
            </label>
          </div>
          <label className="mt-4 block text-sm font-semibold">
            Confirmation note
            <textarea
              className="mt-1 min-h-24 w-full rounded-md border border-[#d8ccc4] p-3 text-sm"
              value={acceptance.note}
              onChange={(event) =>
                setAcceptance({ ...acceptance, note: event.target.value })
              }
              placeholder="Example: Simo accepted by phone at 15:30. Delivery confirmed for 20 October."
            />
          </label>
          <div className="mt-4 divide-y divide-[#eee6e1]">
            {quote.items.map((item) => (
              <div
                key={item.variantId}
                className="flex justify-between gap-4 py-3 text-sm"
              >
                <span>
                  {item.materialName} · {item.quantityM2} m²
                </span>
                <span>Available: {availability[item.variantId] ?? "…"} m²</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <Button
              loading={working}
              disabled={!acceptance.acceptedBy || !acceptance.note}
              onClick={() => void accept()}
            >
              <ClipboardCheck size={16} /> Confirm & reserve stock
            </Button>
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Back
            </Button>
          </div>
        </section>
      )}
    </section>
  );
}

function SendPanel({
  quote,
  close,
  done,
}: {
  quote: Quote;
  close: () => void;
  done: (result: SendResult) => void;
}) {
  const [recipientEmail, setRecipientEmail] = useState(
    quote.customerEmail ?? "",
  );
  const [ccEmails, setCcEmails] = useState("");
  const [subject, setSubject] = useState(`Devis ${quote.number} — UNIVMAR`);
  const [message, setMessage] = useState(
    `Bonjour,\n\nVeuillez trouver ci-joint notre devis ${quote.number} pour le projet ${quote.projectName}.\n\nCordialement,\nUNIVMAR`,
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = await api<SendResult>(
        `/quotations/${quote.id}/send-email`,
        {
          method: "POST",
          body: JSON.stringify({
            recipientEmail,
            ccEmails: ccEmails || null,
            subject,
            message,
          }),
        },
      );
      if (result.dispatch.status === "FAILED")
        setError(result.dispatch.failureReason ?? "Email could not be sent.");
      else done(result);
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/35">
      <aside className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-[#fdfbf9] p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[.14em] text-[#806f65]">
              CLIENT DELIVERY
            </p>
            <h2 className="mt-1 font-sans text-2xl">Send devis by email</h2>
            <p className="mt-2 text-sm text-[#786961]">
              The email includes a PDF and a secure client link. It uses your
              configured SMTP account.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-md px-2 py-1 text-sm"
          >
            Close
          </button>
        </div>
        <form className="mt-6" onSubmit={submit}>
          <label className="text-sm font-semibold">
            Client email
            <input
              className={field}
              required
              type="email"
              value={recipientEmail}
              onChange={(event) => setRecipientEmail(event.target.value)}
            />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            CC emails{" "}
            <span className="font-normal text-[#786961]">
              (comma separated)
            </span>
            <input
              className={field}
              value={ccEmails}
              onChange={(event) => setCcEmails(event.target.value)}
            />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Subject
            <input
              className={field}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Message
            <textarea
              className="mt-1 min-h-44 w-full rounded-md border border-[#d8ccc4] p-3 text-sm"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
          {error && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <footer className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              <Send size={16} /> Send PDF & link
            </Button>
          </footer>
        </form>
      </aside>
    </div>
  );
}

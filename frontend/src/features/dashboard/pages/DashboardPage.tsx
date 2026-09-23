import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, XAxis, YAxis } from "recharts";
import { Boxes, CalendarClock, ChevronRight, CircleDollarSign, FileText, Grid3X3, PackageCheck, UsersRound } from "lucide-react";
import { useRouter } from "../../../app/providers/router";
import { api } from "../../../shared/api/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../../../shared/ui/chart";

type Page<T> = { content: T[]; totalElements?: number };
type Inventory = { totals: { onHandM2: number; reservedM2: number; damagedM2: number; availableM2: number } };
type Order = { id: string; number: string; customerName: string; projectName: string; status: string; grandTotal: number };
type Quote = { id: string; number: string; customerName: string; status: string; grandTotal: number };
type Snapshot = { materials: number; customers: number; inventory: Inventory["totals"]; orders: Order[]; quotes: Quote[] };

const emptySnapshot: Snapshot = { materials: 0, customers: 0, inventory: { onHandM2: 0, reservedM2: 0, damagedM2: 0, availableM2: 0 }, orders: [], quotes: [] };
const money = (value: number) => `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} MAD`;
const title = (value: string) => value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
const salesConfig = { proposals: { label: "Proposals", color: "#a8754e" } } satisfies ChartConfig;
const stockConfig = { available: { label: "Available", color: "#b68560" }, reserved: { label: "Reserved", color: "#80675a" }, damaged: { label: "Damaged", color: "#d9cfc8" } } satisfies ChartConfig;
const orderConfig = { orders: { label: "Orders", color: "#6f5443" } } satisfies ChartConfig;

export function DashboardPage() {
  const { navigate } = useRouter();
  const [snapshot, setSnapshot] = useState<Snapshot>(emptySnapshot); const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function load() {
      setError("");
      try {
        const [materials, customers, inventory, orders, quotes] = await Promise.all([api<Page<unknown>>("/materials?size=1"), api<Page<unknown>>("/customers?size=1"), api<Inventory>("/inventory?size=1"), api<Page<Order>>("/orders?size=100"), api<Page<Quote>>("/quotations?size=100")]);
        if (active) setSnapshot({ materials: materials.totalElements ?? materials.content.length, customers: customers.totalElements ?? customers.content.length, inventory: inventory.totals, orders: orders.content, quotes: quotes.content });
      } catch (cause) { if (active) setError((cause as Error).message); }
    }
    void load(); return () => { active = false; };
  }, []);

  const liveOrders = snapshot.orders.filter(order => !["CANCELLED", "DELIVERED"].includes(order.status));
  const openQuotes = snapshot.quotes.filter(quote => !["REJECTED", "EXPIRED"].includes(quote.status));
  const quoteValue = openQuotes.reduce((sum, quote) => sum + Number(quote.grandTotal || 0), 0);
  const quoteData = ["DRAFT", "SENT", "ACCEPTED"].map(status => ({ status: title(status), proposals: snapshot.quotes.filter(quote => quote.status === status).length }));
  const orderData = [
    { status: "Pending", statuses: ["PENDING"] },
    { status: "Confirmed", statuses: ["CONFIRMED"] },
    { status: "Preparing", statuses: ["PREPARING"] },
    { status: "Delivery", statuses: ["PARTIALLY_DELIVERED"] },
  ].map(({ status, statuses }) => ({ status, orders: snapshot.orders.filter(order => statuses.includes(order.status)).length }));
  const stockData = [
    { name: "Available", value: snapshot.inventory.availableM2, fill: "var(--color-available)" },
    { name: "Reserved", value: snapshot.inventory.reservedM2, fill: "var(--color-reserved)" },
    { name: "Damaged", value: snapshot.inventory.damagedM2, fill: "var(--color-damaged)" },
  ];
  const attention = useMemo(() => [
    snapshot.customers === 0 ? { label: "No customers yet", detail: "Add a customer to begin commercial work.", route: "/customers", icon: UsersRound } : null,
    snapshot.materials === 0 ? { label: "Catalog needs a material", detail: "Add material and variants before receiving stock.", route: "/catalog", icon: Grid3X3 } : null,
    snapshot.quotes.filter(quote => quote.status === "SENT").length ? { label: `${snapshot.quotes.filter(quote => quote.status === "SENT").length} quotation${snapshot.quotes.filter(quote => quote.status === "SENT").length === 1 ? "" : "s"} awaiting reply`, detail: "Review open commercial offers.", route: "/quotations", icon: FileText } : null,
  ].filter(Boolean) as { label: string; detail: string; route: string; icon: typeof UsersRound }[], [snapshot.customers, snapshot.materials, snapshot.quotes]);

  return <div className="min-h-[calc(100vh-68px)] bg-white"><main className="mx-auto max-w-7xl px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
    <header className="border-b border-[#e8e0db] pb-6"><p className="text-[10px] font-bold tracking-[0.18em] text-[#765847]">UNIVMAR · OPERATIONS</p><h1 className="mt-2 font-sans text-3xl tracking-[-0.03em] text-[#21140f] sm:text-4xl">Dashboard</h1><p className="mt-2 text-sm text-[#786961]">Your commercial and warehouse position at a glance.</p></header>
    {error && <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Some dashboard data could not be loaded: {error}</p>}
    <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Customers" value={snapshot.customers.toLocaleString()} hint="Customer records" icon={<UsersRound size={17} />} onClick={() => navigate("/customers")} /><Metric label="Materials" value={snapshot.materials.toLocaleString()} hint="Catalog records" icon={<Grid3X3 size={17} />} onClick={() => navigate("/catalog")} /><Metric label="Available stone" value={`${snapshot.inventory.availableM2.toLocaleString()} m²`} hint={`${snapshot.inventory.reservedM2.toLocaleString()} m² reserved`} icon={<Boxes size={17} />} onClick={() => navigate("/inventory")} /><Metric label="Open proposal value" value={money(quoteValue)} hint={`${openQuotes.length} active quotations`} icon={<CircleDollarSign size={17} />} onClick={() => navigate("/quotations")} /></section>
    <section className="mt-6 grid gap-5 lg:grid-cols-[1.45fr_.9fr]"><QuotationChart data={quoteData} onOpen={() => navigate("/quotations")} /><StockChart data={stockData} total={snapshot.inventory.onHandM2} onOpen={() => navigate("/inventory")} /></section>
    <section className="mt-6 grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><OrderStatusChart data={orderData} onOpen={() => navigate("/orders")} /><OrdersList orders={liveOrders} onOpen={() => navigate("/orders")} /></section>
    <section className="mt-6"><Attention items={attention} onOpen={navigate} /></section>
  </main></div>;
}

function Metric({ label, value, hint, icon, onClick }: { label: string; value: string; hint: string; icon: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="group rounded-lg border border-[#e7dfda] bg-white p-4 text-left transition hover:border-[#cbb39f] hover:bg-[#fefdfc]"><div className="flex items-center justify-between"><p className="text-xs font-medium text-[#786961]">{label}</p><span className="text-[#9b7b64] transition group-hover:text-[#21140f]">{icon}</span></div><p className="mt-3 font-sans text-2xl tracking-[-0.03em] text-[#21140f]">{value}</p><p className="mt-1 text-xs text-[#89786e]">{hint}</p></button>;
}

function PanelHeader({ eyebrow, title: heading, action, onAction }: { eyebrow: string; title: string; action: string; onAction: () => void }) { return <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold tracking-[0.16em] text-[#806f65]">{eyebrow}</p><h2 className="mt-1 font-sans text-xl tracking-[-0.02em] text-[#21140f]">{heading}</h2></div><button type="button" onClick={onAction} className="inline-flex items-center gap-1 text-xs font-semibold text-[#765847] hover:text-[#21140f]">{action} <ChevronRight size={14} /></button></div>; }

function QuotationChart({ data, onOpen }: { data: { status: string; proposals: number }[]; onOpen: () => void }) {
  return <section className="rounded-lg border border-[#e7dfda] bg-white p-5 sm:p-6"><PanelHeader eyebrow="COMMERCIAL FLOW" title="Quotation pipeline" action="Open quotations" onAction={onOpen} /><p className="mt-1 text-sm text-[#786961]">Proposals by current decision stage.</p><ChartContainer config={salesConfig} className="mt-5 h-[250px] w-full"><BarChart accessibilityLayer data={data} margin={{ top: 12, left: -20, right: 4 }}><CartesianGrid vertical={false} /><XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={10} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><ChartTooltip cursor={{ fill: "#faf7f5" }} content={<ChartTooltipContent />} /><Bar dataKey="proposals" fill="var(--color-proposals)" radius={[5, 5, 0, 0]} maxBarSize={52} /></BarChart></ChartContainer></section>;
}

function StockChart({ data, total, onOpen }: { data: { name: string; value: number; fill: string }[]; total: number; onOpen: () => void }) {
  const pieData = data.filter(item => item.value > 0); const renderedData = pieData.length ? pieData : [{ name: "No stock", value: 1, fill: "#eee6e1" }];
  return <section className="rounded-lg border border-[#e7dfda] bg-white p-5 sm:p-6"><PanelHeader eyebrow="WAREHOUSE POSITION" title="Stone allocation" action="Open inventory" onAction={onOpen} /><div className="mt-5 grid items-center gap-2 sm:grid-cols-[170px_1fr]"><ChartContainer config={stockConfig} className="mx-auto size-[180px]"><PieChart accessibilityLayer><ChartTooltip content={<ChartTooltipContent labelFormatter={() => "Stock allocation"} />} /><Pie data={renderedData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={78} paddingAngle={pieData.length > 1 ? 3 : 0} strokeWidth={0}>{renderedData.map(item => <Cell key={item.name} fill={item.fill} />)}<Label value={`${total.toLocaleString()} m²`} position="center" className="fill-[#21140f] text-[13px] font-semibold" /></Pie></PieChart></ChartContainer><div><p className="text-sm font-medium text-[#21140f]">Physical stock on hand</p><p className="mt-1 text-xs text-[#786961]">Available, reserved, and damaged quantities.</p><div className="mt-5 grid gap-3">{(["Available", "Reserved", "Damaged"] as const).map(label => { const item = data.find(row => row.name === label); const config = stockConfig[label.toLowerCase() as keyof typeof stockConfig]; return <div key={label} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-[#786961]"><i className="size-2 rounded-full" style={{ background: config.color }} />{label}</span><b className="font-medium text-[#21140f]">{(item?.value ?? 0).toLocaleString()} m²</b></div>; })}</div></div></div></section>;
}

function OrderStatusChart({ data, onOpen }: { data: { status: string; orders: number }[]; onOpen: () => void }) {
  return <section className="rounded-lg border border-[#e7dfda] bg-white p-5 sm:p-6"><PanelHeader eyebrow="FULFILMENT FLOW" title="Order status" action="Open orders" onAction={onOpen} /><p className="mt-1 text-sm text-[#786961]">Active commitments by fulfilment stage.</p><ChartContainer config={orderConfig} className="mt-5 h-[220px] w-full"><BarChart accessibilityLayer data={data} margin={{ top: 12, left: -20, right: 4 }}><CartesianGrid vertical={false} /><XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={10} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><ChartTooltip cursor={{ fill: "#faf7f5" }} content={<ChartTooltipContent />} /><Bar dataKey="orders" fill="var(--color-orders)" radius={[5, 5, 0, 0]} maxBarSize={38} /></BarChart></ChartContainer></section>;
}

function OrdersList({ orders, onOpen }: { orders: Order[]; onOpen: () => void }) { return <section className="rounded-lg border border-[#e7dfda] bg-white p-5 sm:p-6"><PanelHeader eyebrow="FULFILMENT" title="Live orders" action="Open order desk" onAction={onOpen} /><div className="mt-4 divide-y divide-[#f0e8e4]">{orders.length ? orders.slice(0, 4).map(order => <button type="button" key={order.id} onClick={onOpen} className="flex w-full items-center gap-3 py-3.5 text-left first:pt-0 hover:bg-[#fefdfc]"><span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#f4ece8] text-[#765847]"><PackageCheck size={15} /></span><span className="min-w-0 flex-1"><b className="block text-sm text-[#21140f]">{order.number}</b><span className="mt-0.5 block truncate text-xs text-[#786961]">{order.customerName} · {order.projectName}</span></span><span className="text-right"><b className="block text-xs font-medium text-[#21140f]">{money(Number(order.grandTotal || 0))}</b><span className="mt-1 inline-block rounded-full bg-[#f4ece8] px-2 py-0.5 text-[10px] font-semibold text-[#5d4030]">{title(order.status)}</span></span></button>) : <div className="grid min-h-36 place-items-center text-center"><div><CalendarClock size={22} className="mx-auto text-[#b59b88]" /><p className="mt-3 text-sm text-[#786961]">No live orders yet.</p></div></div>}</div></section>; }

function Attention({ items, onOpen }: { items: { label: string; detail: string; route: string; icon: typeof UsersRound }[]; onOpen: (route: string) => void }) { return <section className="rounded-lg border border-[#e7dfda] bg-white p-5 sm:p-6"><p className="text-[10px] font-bold tracking-[0.16em] text-[#806f65]">NEXT ACTIONS</p><h2 className="mt-1 font-sans text-xl tracking-[-0.02em] text-[#21140f]">Keep work moving</h2><div className="mt-4 divide-y divide-[#f0e8e4]">{items.length ? items.map(item => { const Icon = item.icon; return <button type="button" key={item.label} onClick={() => onOpen(item.route)} className="flex w-full items-center gap-3 py-3.5 text-left first:pt-0"><span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#f4ece8] text-[#765847]"><Icon size={15} /></span><span className="min-w-0 flex-1"><b className="block text-sm text-[#21140f]">{item.label}</b><span className="mt-0.5 block text-xs leading-5 text-[#786961]">{item.detail}</span></span><ChevronRight size={16} className="text-[#aa9689]" /></button>; }) : <div className="grid min-h-36 place-items-center text-center"><div><PackageCheck size={22} className="mx-auto text-emerald-600" /><p className="mt-3 text-sm text-[#786961]">No immediate actions.</p></div></div>}</div></section>; }

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Columns3,
  LayoutList,
  PackageCheck,
  Search,
  XCircle,
} from "lucide-react";
import { api } from "../../../shared/api/client";
import { Button, DataTable, PaginationControls } from "../../../shared/ui";
import { useRouter } from "../../../app/providers/router";

type Reservation = {
  id: string;
  inventoryItemId: string;
  warehouseName: string;
  locationCode: string;
  lotNumber?: string;
  bundleNumber?: string;
  quantityM2: number;
  status: string;
};
type Item = {
  id: string;
  materialName: string;
  variantLabel: string;
  quantityM2: number;
  unitPrice: number;
  lineTotal: number;
  reservations: Reservation[];
};
type Event = { id: string; type: string; message: string; occurredAt: string };
type Delivery = {
  id: string;
  number: string;
  status: string;
  scheduledDate?: string;
};
type Order = {
  id: string;
  number: string;
  quotationNumber: string;
  customerName: string;
  projectName: string;
  status: string;
  grandTotal: number;
  createdAt: string;
  items: Item[];
  deliveries: Delivery[];
  events: Event[];
};
export function OrdersPage() {
  const [list, setList] = useState<Order[]>([]),
    [detail, setDetail] = useState<Order | null>(null),
    [error, setError] = useState(""),
    [query, setQuery] = useState(""),
    [view, setView] = useState<"board" | "list">("board"),
    [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 }),
    [loading, setLoading] = useState(false);
  async function load(nextPage = pageData.page) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(nextPage), size: "20" });
      if (query.trim()) params.set("search", query.trim());
      const result = await api<{ content: Order[]; page: number; totalPages: number; totalElements: number }>(`/orders?${params}`);
      setList(result.content);
      setPageData(result);
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load(0);
  }, [query]);
  if (detail)
    return (
      <OrderDetail
        order={detail}
        back={() => setDetail(null)}
        refresh={async () => {
          const next = await api<Order>(`/orders/${detail.id}`);
          setDetail(next);
          await load();
        }}
      />
    );
  const filtered = list;
  const live = list.filter(
    (order) => !["CANCELLED", "DELIVERED"].includes(order.status),
  );
  const value = live.reduce(
    (total, order) => total + Number(order.grandTotal),
    0,
  );
  const open = (order: Order) =>
    void api<Order>(`/orders/${order.id}`)
      .then(setDetail)
      .catch((cause) => setError((cause as Error).message));
  return (
    <section className="mx-auto max-w-7xl px-4 py-7 sm:px-7">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8ccc4] pb-6">
        <div>
          <p className="text-[10px] font-bold tracking-[.18em] text-[#765847]">
            SALES TO FULFILMENT
          </p>
          <h1 className="mt-2 font-sans text-4xl tracking-tight">Order desk</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#786961]">
            Accepted customer commitments, their reserved stock, and the next
            fulfilment action.
          </p>
        </div>
        <div className="rounded-xl border border-[#4c3225] bg-[#21140f] px-5 py-4 text-right text-white shadow-sm">
          <p className="text-[10px] font-bold tracking-[.13em] text-[#d8b08b]">
            LIVE ORDER VALUE
          </p>
          <p className="mt-1 font-sans text-2xl">
            {value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            MAD
          </p>
        </div>
      </header>
      <div className="mt-6 grid overflow-hidden rounded-xl border border-[#e9ded6] bg-[#e9ded6] shadow-sm sm:grid-cols-3">
        <OrderMetric
          icon={<ClipboardList size={17} />}
          label="Live orders"
          value={String(live.length)}
          note="Awaiting fulfilment"
        />
        <OrderMetric
          icon={<PackageCheck size={17} />}
          label="Ready to plan"
          value={String(
            list.filter((order) =>
              [
                "CONFIRMED",
                "PREPARING",
                "READY",
                "PARTIALLY_DELIVERED",
              ].includes(order.status),
            ).length,
          )}
          note="Can move to delivery"
        />
        <OrderMetric
          icon={<CheckCircle2 size={17} />}
          label="Completed"
          value={String(
            list.filter((order) => order.status === "DELIVERED").length,
          )}
          note="Fully delivered"
        />
      </div>
      <section className="mt-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-sans text-xl">Customer commitments</h2>
            <p className="mt-1 text-xs text-[#786961]">
              See fulfilment work by dispatch stage, then switch to the register
              when you need every commitment.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b887c]"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find order, customer, project"
                className="h-9 w-64 rounded-md border border-[#d8ccc4] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#110703]"
              />
            </label>
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
        </div>
        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {!filtered.length ? (
          <EmptyOrders hasOrders={Boolean(list.length)} />
        ) : view === "board" ? (
          <OrderBoard orders={filtered} open={open} />
        ) : (
          <OrderRegister orders={filtered} open={open} />
        )}
        <PaginationControls page={pageData.page} totalPages={pageData.totalPages} totalElements={pageData.totalElements} itemCount={list.length} loading={loading} onPageChange={nextPage => void load(nextPage)} noun="orders" />
      </section>
    </section>
  );
}
function EmptyOrders({ hasOrders }: { hasOrders: boolean }) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-[#cdbeb3] bg-white px-5 py-16 text-center">
      <ClipboardList size={28} className="mx-auto text-[#b39a85]" />
      <h2 className="mt-4 font-sans text-2xl">
        {hasOrders ? "No matching order" : "No orders to fulfil"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#786961]">
        {hasOrders
          ? "Try a customer name, project, or order number."
          : "When a sent quotation is accepted, its reserved stock and fulfilment record will appear here."}
      </p>
    </div>
  );
}
function OrderBoard({
  orders,
  open,
}: {
  orders: Order[];
  open: (order: Order) => void;
}) {
  const columns = [
    { status: "PENDING", label: "To confirm" },
    { status: "CONFIRMED", label: "Stock reserved" },
    { status: "PREPARING", label: "Preparing" },
    { status: "READY", label: "Ready to dispatch" },
    { status: "PARTIALLY_DELIVERED", label: "In delivery" },
  ];
  return (
    <div className="mt-5 overflow-x-auto pb-2">
      <div className="grid min-w-[1160px] grid-cols-5 gap-3">
        {columns.map((column) => {
          const cards = orders.filter(
            (order) => order.status === column.status,
          );
          return (
            <section
              key={column.status}
              className="min-h-[315px] rounded-xl border border-[#e1d5cd] bg-[#faf8f6] p-3"
            >
              <header className="flex items-center justify-between border-b border-[#e4dad4] pb-3">
                <div>
                  <p className="text-[10px] font-bold tracking-[.14em] text-[#806f65]">
                    {column.label.toUpperCase()}
                  </p>
                  <p className="mt-1 text-xs text-[#786961]">
                    {cards.length} order{cards.length === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="grid size-7 place-items-center rounded-full bg-white text-xs font-bold text-[#6f5443]">
                  {cards.length}
                </span>
              </header>
              <div className="mt-3 grid gap-3">
                {cards.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => open(order)}
                    className="rounded-lg border border-[#e3d8d1] bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-[#aa7756] hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-mono text-sm font-semibold">{order.number}</p>
                      <span className="text-xs font-semibold">
                        {Number(order.grandTotal).toLocaleString()} MAD
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {order.customerName}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[#786961]">
                      {order.projectName}
                    </p>
                    <p className="mt-3 border-t border-[#eee6e1] pt-2 text-[11px] text-[#786961]">
                      {order.deliveries.length
                        ? `${order.deliveries.length} delivery plan${order.deliveries.length === 1 ? "" : "s"}`
                        : "No delivery plan yet"}
                    </p>
                  </button>
                ))}
                {!cards.length && (
                  <p className="py-10 text-center text-xs text-[#9b887c]">
                    Nothing in this stage
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
function OrderRegister({
  orders,
  open,
}: {
  orders: Order[];
  open: (order: Order) => void;
}) {
  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-[#d8ccc4] bg-white">
      <div className="flex items-center justify-between border-b border-[#e9dfd9] px-5 py-4">
        <div>
          <h2 className="font-sans text-xl">Order register</h2>
          <p className="mt-1 text-xs text-[#786961]">
            Select an order to review stock allocation, delivery, and financial
            progress.
          </p>
        </div>
        <span className="text-xs font-medium text-[#786961]">
          {orders.length} total
        </span>
      </div>
      <div className="hidden grid-cols-[1.05fr_1.25fr_.9fr_.95fr_34px] gap-5 border-b border-[#e9dfd9] bg-[#fcfaf8] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#806f65] md:grid">
        <span>Order</span>
        <span>Customer / project</span>
        <span>Delivery</span>
        <span className="text-right">Commitment</span>
        <span />
      </div>
      <div className="divide-y divide-[#eee6e1]">
        {orders.map((order) => (
          <OrderRegisterRow
            key={order.id}
            order={order}
            open={() => open(order)}
          />
        ))}
      </div>
    </section>
  );
}
function OrderRegisterRow({ order, open }: { order: Order; open: () => void }) {
  const deliveryLabel = order.deliveries.length
    ? `${order.deliveries.length} delivery plan${order.deliveries.length === 1 ? "" : "s"}`
    : "No delivery plan";
  return (
    <button
      type="button"
      onClick={open}
      className="grid w-full gap-3 px-5 py-5 text-left transition-colors hover:bg-[#fcfaf8] focus-visible:bg-[#fcfaf8] md:grid-cols-[1.05fr_1.25fr_.9fr_.95fr_34px] md:items-center md:gap-5"
    >
      <div>
        <p className="font-mono text-sm font-semibold tracking-tight">
          {order.number}
        </p>
        <p className="mt-1.5 text-xs text-[#786961]">
          From quotation {order.quotationNumber}
        </p>
      </div>
      <div>
        <p className="font-medium">{order.customerName}</p>
        <p className="mt-1 text-sm text-[#786961]">{order.projectName}</p>
      </div>
      <div>
        <p className="text-sm text-[#65564e]">{deliveryLabel}</p>
        <p className="mt-1 text-xs text-[#786961]">
          {order.status.replaceAll("_", " ")}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 md:block md:text-right">
        <StatusPill value={order.status} />
        <p className="mt-1 font-sans text-lg md:mt-2">
          {Number(order.grandTotal).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          MAD
        </p>
      </div>
      <ChevronRight size={18} className="hidden text-[#a99b92] md:block" />
    </button>
  );
}
function OrderMetric({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="bg-white px-5 py-5">
      <div className="flex items-center gap-2 text-[#765847]">
        {icon}
        <p className="text-[11px] font-bold uppercase tracking-[.12em]">
          {label}
        </p>
      </div>
      <p className="mt-3 font-sans text-2xl">{value}</p>
      <p className="mt-1 text-xs text-[#786961]">{note}</p>
    </article>
  );
}
function StatusPill({ value }: { value: string }) {
  const tone =
    value === "DELIVERED"
      ? "bg-emerald-50 text-emerald-800"
      : value === "CANCELLED"
        ? "bg-red-50 text-red-700"
        : value === "CONFIRMED"
          ? "bg-[#f4e3d2] text-[#72472f]"
          : "bg-[#f3efeb] text-[#66554b]";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${tone}`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}
function OrderDetail({
  order,
  back,
  refresh,
}: {
  order: Order;
  back: () => void;
  refresh: () => Promise<void>;
}) {
  const [tab, setTab] = useState("Overview"),
    [error, setError] = useState("");
  const reserved = order.items.reduce(
    (total, item) =>
      total +
      item.reservations.reduce(
        (area, reservation) => area + Number(reservation.quantityM2),
        0,
      ),
    0,
  );
  const totalArea = order.items.reduce(
    (total, item) => total + Number(item.quantityM2),
    0,
  );
  async function action(path: string) {
    try {
      await api(`/orders/${order.id}/${path}`, { method: "POST" });
      await refresh();
    } catch (cause) {
      setError((cause as Error).message);
    }
  }
  return (
    <section className="mx-auto max-w-6xl px-4 py-7 sm:px-7">
      <button
        type="button"
        onClick={back}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#65564e] transition hover:text-[#110703]"
      >
        <ArrowLeft size={16} /> Orders
      </button>
      <article className="mt-5 overflow-hidden rounded-xl border border-[#d8ccc4] bg-white">
        <header className="bg-[#21140f] px-5 py-6 text-white sm:px-7 sm:py-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold tracking-[.18em] text-[#d8b08b]">
                CUSTOMER COMMITMENT
              </p>
              <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight sm:text-3xl">
                {order.number}
              </h1>
              <p className="mt-3 max-w-xl text-sm text-white/65">
                Created from {order.quotationNumber} for {order.customerName}.
              </p>
            </div>
            <StatusPill value={order.status} />
          </div>
          <div className="mt-7 grid gap-5 border-t border-white/15 pt-5 sm:grid-cols-[1.2fr_.8fr]">
            <div>
              <p className="text-[10px] font-bold tracking-[.14em] text-white/45">
                DELIVERY CONTEXT
              </p>
              <p className="mt-2 text-lg font-medium">{order.customerName}</p>
              <p className="mt-1 text-sm text-white/60">{order.projectName}</p>
            </div>
            <div className="sm:border-l sm:border-white/15 sm:pl-5">
              <p className="text-[10px] font-bold tracking-[.14em] text-white/45">
                COMMITTED VALUE
              </p>
              <p className="mt-2 font-sans text-2xl">
                {Number(order.grandTotal).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                MAD
              </p>
            </div>
          </div>
        </header>
        <div className="grid border-b border-[#e6dad3] bg-[#fcfaf8] sm:grid-cols-3">
          <div className="px-5 py-4 sm:px-7">
            <p className="text-[10px] font-bold tracking-[.14em] text-[#806f65]">
              ORDER LINES
            </p>
            <p className="mt-1.5 font-sans text-xl text-[#21140f]">
              {order.items.length}
            </p>
            <p className="mt-1 text-xs text-[#786961]">
              {totalArea.toLocaleString()} m² committed
            </p>
          </div>
          <div className="border-t border-[#e6dad3] px-5 py-4 sm:border-l sm:border-t-0 sm:px-7">
            <p className="text-[10px] font-bold tracking-[.14em] text-[#806f65]">
              STOCK ALLOCATED
            </p>
            <p className="mt-1.5 font-sans text-xl text-[#21140f]">
              {reserved.toLocaleString()} m²
            </p>
            <p className="mt-1 text-xs text-[#786961]">
              {reserved >= totalArea && totalArea > 0
                ? "Fully reserved"
                : "Review allocation"}
            </p>
          </div>
          <div className="border-t border-[#e6dad3] px-5 py-4 sm:border-l sm:border-t-0 sm:px-7">
            <p className="text-[10px] font-bold tracking-[.14em] text-[#806f65]">
              DELIVERY PLANS
            </p>
            <p className="mt-1.5 font-sans text-xl text-[#21140f]">
              {order.deliveries.length}
            </p>
            <p className="mt-1 text-xs text-[#786961]">
              {order.deliveries.length
                ? "Dispatch is being coordinated"
                : "No dispatch planned yet"}
            </p>
          </div>
        </div>
        <nav
          aria-label="Order detail sections"
          className="grid grid-cols-3 gap-1 border-b border-[#e6dad3] bg-[#faf8f6] p-2 sm:grid-cols-6"
        >
          {[
            "Overview",
            "Items",
            "Reservations",
            "Delivery",
            "Invoice",
            "History",
          ].map((name) => (
            <button
              key={name}
              type="button"
              aria-selected={tab === name}
              onClick={() => setTab(name)}
              className={`rounded-md px-2 py-2.5 text-xs font-semibold transition sm:text-sm ${tab === name ? "bg-[#21140f] text-white shadow-sm" : "text-[#786961] hover:bg-white hover:text-[#21140f]"}`}
            >
              {name}
            </button>
          ))}
        </nav>
        <div className="min-h-64 px-5 py-6 sm:px-7 sm:py-7">
          {tab === "Overview" && (
            <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
              <section className="rounded-lg border border-[#e1d5cd] bg-white p-5">
                <p className="text-[10px] font-bold tracking-[.14em] text-[#806f65]">
                  FULFILMENT BRIEF
                </p>
                <h2 className="mt-2 font-sans text-2xl text-[#21140f]">
                  {order.status === "PENDING"
                    ? "Confirm the customer commitment"
                    : order.status === "DELIVERED"
                      ? "This order is complete"
                      : "Keep stock and dispatch moving"}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#786961]">
                  {order.status === "PENDING"
                    ? "Confirming this order reserves stock against its customer commitment."
                    : order.deliveries.length
                      ? "Open the delivery workspace to review dispatch plans and update the handover."
                      : "Reserve stock, then plan the first dispatch when the material is ready."}
                </p>
              </section>
              <aside className="rounded-lg bg-[#f4eee9] p-5">
                <p className="text-[10px] font-bold tracking-[.14em] text-[#765847]">
                  SOURCE PROPOSAL
                </p>
                <p className="mt-2 font-mono text-sm font-semibold">
                  {order.quotationNumber}
                </p>
                <p className="mt-4 text-xs leading-5 text-[#786961]">
                  The commercial terms are retained from the accepted quotation.
                </p>
              </aside>
            </div>
          )}
          {tab === "Items" && <Lines items={order.items} />}{" "}
          {tab === "Reservations" && (
            <section className="overflow-hidden rounded-lg border border-[#e1d5cd] bg-white">
              <header className="border-b border-[#e6dad3] bg-[#fcfaf8] px-5 py-4">
                <p className="text-[10px] font-bold tracking-[.14em] text-[#806f65]">
                  PHYSICAL ALLOCATIONS
                </p>
                <h2 className="mt-1 font-sans text-xl">Reserved stock</h2>
              </header>
              {order.items.flatMap((item) =>
                item.reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex flex-wrap justify-between gap-3 border-b border-[#eee6e1] px-5 py-4 text-sm last:border-0"
                  >
                    <span>
                      <b>{item.materialName}</b>
                      <span className="text-[#786961]">
                        {" "}
                        · {reservation.warehouseName} /{" "}
                        {reservation.locationCode}
                        {reservation.lotNumber
                          ? ` · ${reservation.lotNumber}`
                          : ""}
                      </span>
                    </span>
                    <span className="font-medium">
                      {reservation.quantityM2} m² · {reservation.status}
                    </span>
                  </div>
                )),
              ) || (
                <p className="px-5 py-10 text-sm text-[#786961]">
                  No physical stock has been allocated yet.
                </p>
              )}
            </section>
          )}
          {tab === "Delivery" && (
            <section className="overflow-hidden rounded-lg border border-[#e1d5cd] bg-white">
              <header className="border-b border-[#e6dad3] bg-[#fcfaf8] px-5 py-4">
                <p className="text-[10px] font-bold tracking-[.14em] text-[#806f65]">
                  DISPATCH CONTROL
                </p>
                <h2 className="mt-1 font-sans text-xl">Delivery plans</h2>
              </header>
              {order.deliveries.length ? (
                <div className="divide-y divide-[#eee6e1]">
                  {order.deliveries.map((delivery) => (
                    <div
                      key={delivery.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm"
                    >
                      <span className="font-mono font-semibold">
                        {delivery.number}
                      </span>
                      <span className="text-[#786961]">
                        {delivery.scheduledDate ?? "Not scheduled"} ·{" "}
                        {delivery.status.replaceAll("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-10 text-sm text-[#786961]">
                  No dispatch has been planned for this customer commitment.
                </p>
              )}
            </section>
          )}
          {tab === "History" && (
            <section className="overflow-hidden rounded-lg border border-[#e1d5cd] bg-white">
              <header className="border-b border-[#e6dad3] bg-[#fcfaf8] px-5 py-4">
                <p className="text-[10px] font-bold tracking-[.14em] text-[#806f65]">
                  ORDER HISTORY
                </p>
                <h2 className="mt-1 font-sans text-xl">Activity timeline</h2>
              </header>
              {order.events.map((event) => (
                <div
                  key={event.id}
                  className="border-b border-[#eee6e1] px-5 py-4 text-sm last:border-0"
                >
                  <b>{event.message}</b>
                  <p className="mt-1 text-[#786961]">
                    {new Date(event.occurredAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </section>
          )}
          {tab === "Invoice" && <OrderInvoice order={order} />}{" "}
          {error && (
            <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
        <footer className="flex flex-wrap justify-end gap-2 border-t border-[#e6dad3] bg-[#fcfaf8] px-5 py-4 sm:px-7">
          {order.status === "PENDING" && (
            <Button onClick={() => void action("confirm")}>
              <CheckCircle2 size={16} />
              Confirm order
            </Button>
          )}
          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
            <Button variant="outline" onClick={() => void action("cancel")}>
              <XCircle size={16} />
              Cancel & release stock
            </Button>
          )}
        </footer>
      </article>
    </section>
  );
}
type InvoiceSummary = {
  number: string;
  status: string;
  paidTotal: number;
  outstandingTotal: number;
  grandTotal: number;
  dueDate?: string;
};
function OrderInvoice({ order }: { order: Order }) {
  const { navigate } = useRouter();
  const [invoice, setInvoice] = useState<InvoiceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    void api<InvoiceSummary>(`/invoices/order/${order.id}`)
      .then(setInvoice)
      .catch((cause) => {
        if ((cause as { message?: string }).message?.includes("No invoice"))
          return;
        setError((cause as Error).message);
      })
      .finally(() => setLoading(false));
  }, [order.id]);
  if (loading)
    return (
      <section className="mt-6 rounded-xl border bg-white p-6 text-sm text-[#786961]">
        Loading financial record…
      </section>
    );
  if (!invoice)
    return (
      <section className="mt-6 rounded-xl border bg-white p-6">
        <h2 className="font-semibold">No invoice created</h2>
        <p className="mt-2 text-sm text-[#786961]">
          Create an invoice in the financial workspace to track what this
          customer owes and has paid.
        </p>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <Button className="mt-5" onClick={() => navigate("/invoices")}>
          Open invoices & payments
        </Button>
      </section>
    );
  return (
    <section className="mt-6 rounded-xl border bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">{invoice.number}</h2>
          <p className="mt-1 text-sm text-[#786961]">
            {invoice.status.replaceAll("_", " ")}
            {invoice.dueDate ? ` · due ${invoice.dueDate}` : ""}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/invoices")}>
          Open financial record
        </Button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <p className="rounded-md bg-[#faf7f5] p-3 text-sm">
          Invoice total
          <br />
          <b>{invoice.grandTotal} MAD</b>
        </p>
        <p className="rounded-md bg-[#faf7f5] p-3 text-sm">
          Received
          <br />
          <b>{invoice.paidTotal} MAD</b>
        </p>
        <p className="rounded-md bg-[#faf7f5] p-3 text-sm">
          Outstanding
          <br />
          <b>{invoice.outstandingTotal} MAD</b>
        </p>
      </div>
    </section>
  );
}
function Lines({ items }: { items: Item[] }) {
  const { navigate } = useRouter();
  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-[#dfe5e8] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-[#f8fafb] text-[10px] uppercase tracking-[.12em] text-[#71808b]">
            <tr>
              <th className="w-[40%] px-4 py-3 font-semibold">Material</th>
              <th className="px-4 py-3 font-semibold">Quantity</th>
              <th className="px-4 py-3 text-right font-semibold">Unit price</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6eaed]">
            {items.map((item) => {
              const inventoryId = item.reservations[0]?.inventoryItemId;
              return (
                <tr
                  key={item.id}
                  className="bg-white transition hover:bg-[#f8fafb]"
                >
                  <td className="px-4 py-4">
                    {inventoryId ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/inventory/${inventoryId}`)}
                        className="group text-left"
                      >
                        <span className="font-semibold text-[#25313a] group-hover:underline">
                          {item.materialName}
                        </span>
                        <span className="mt-1 flex items-center gap-1 text-xs text-[#71808b]">
                          {item.variantLabel}
                          <ChevronRight
                            size={13}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </span>
                      </button>
                    ) : (
                      <>
                        <p className="font-semibold text-[#25313a]">
                          {item.materialName}
                        </p>
                        <p className="mt-1 text-xs text-[#71808b]">
                          {item.variantLabel} · Stock not allocated
                        </p>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-4 text-[#5f6d76]">
                    {item.quantityM2} m²
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums text-[#5f6d76]">
                    {item.unitPrice} MAD
                  </td>
                  <td className="px-4 py-4 text-right font-semibold tabular-nums text-[#25313a]">
                    {item.lineTotal} MAD
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

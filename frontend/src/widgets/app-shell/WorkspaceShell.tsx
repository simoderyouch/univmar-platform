import { useState } from "react";
import { Bell, ChevronRight, LogOut, Menu, X } from "lucide-react";
import { Redirect, useRouter } from "../../app/providers/router";
import { useAuth } from "../../features/auth/AuthProvider";
import { CatalogPage } from "../../features/catalog";
import { CustomersPage } from "../../features/customer";
import { DashboardPage } from "../../features/dashboard";
import { InventoryPage } from "../../features/inventory";
import { PurchasingPage } from "../../features/purchasing";
import { ProjectsPage } from "../../features/project";
import { RfqsPage } from "../../features/rfq";
import { QuotationsPage } from "../../features/quotation";
import { OrdersPage } from "../../features/order";
import { DeliveriesPage } from "../../features/delivery";
import { InvoicesPage } from "../../features/invoice";
import { DocumentsPage } from "../../features/document";
import { SlabsPage } from "../../features/slab";
import { PlaceholderPage } from "../../features/workspace";
import { workspaceNavigation, type NavigationEntry } from "./navigation";

function NavigationItem({ item, onNavigate }: { item: NavigationEntry; onNavigate: () => void }) {
  const { path, navigate } = useRouter();
  const active = path === item.to;
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => { navigate(item.to); onNavigate(); }}
      className={`flex h-10 items-center gap-3 rounded-md px-3 text-left text-[13px] font-medium transition-colors ${active ? "bg-[#c99b68]/20 text-white ring-1 ring-inset ring-[#dbb882]/30" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
    >
      <Icon size={17} />
      {item.label}
    </button>
  );
}

export function WorkspaceShell() {
  const { user, loading, logout } = useAuth();
  const { path, navigate } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#f7f3f0] text-sm text-[#786961]">Loading workspace…</main>;
  if (!user) return <Redirect to="/login" />;

  const current = workspaceNavigation.find((item) => item.to === path);
  const title = current?.label ?? "Dashboard";
  const closeMenu = () => setMenuOpen(false);
  const content = path === "/dashboard" || !current
    ? <DashboardPage />
    : path === "/catalog"
      ? <CatalogPage />
      : path === "/inventory"
        ? <InventoryPage />
        : path === "/slabs"
          ? <SlabsPage />
        : path === "/suppliers"
          ? <PurchasingPage />
          : path === "/customers"
            ? <CustomersPage />
            : path === "/projects"
              ? <ProjectsPage />
              : path === "/rfqs"
                ? <RfqsPage />
                : path === "/quotations"
                  ? <QuotationsPage />
                  : path === "/orders"
                    ? <OrdersPage />
                    : path === "/deliveries"
                      ? <DeliveriesPage />
                      : path === "/invoices"
                        ? <InvoicesPage />
                        : path === "/documents"
                          ? <DocumentsPage />
        : <PlaceholderPage title={title} />;

  const sidebar = (
    <>
      <div className="flex h-16 items-center justify-center py-12 border-b border-white/10 px-3">
        <img src="/univmar-logo-w.png" alt="Univmar Marble" className="h-auto w-[11rem] object-contain object-left" />
        <button type="button" className="ml-auto p-2 lg:hidden" onClick={closeMenu} aria-label="Close navigation"><X size={18} /></button>
      </div>
      <nav className="grid pt-6 gap-1">{workspaceNavigation.map((item) => <NavigationItem key={item.to} item={item} onNavigate={closeMenu} />)}</nav>
      <div className="mt-auto border-t border-white/10 p-3">
        <p className="truncate text-xs font-medium text-white/80">{user.email}</p>
        <p className="mt-1 text-[10px] tracking-wider text-white/40">{user.role.replaceAll("_", " ")}</p>
        <button type="button" onClick={() => { logout(); navigate("/login"); }} className="mt-4 flex items-center gap-2 text-xs text-white/60 hover:text-white"><LogOut size={15} /> Sign out</button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f7f3f0] text-black">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col bg-[#110703] px-3 py-5 text-white lg:flex">{sidebar}</aside>
      {menuOpen && <>
        <button type="button" aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={closeMenu} />
        <aside className="fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-[#110703] px-3 py-5 text-white lg:hidden">{sidebar}</aside>
      </>}
      <main className="min-h-screen lg:ml-[272px]">
        <header className="flex h-[68px] items-center border-b border-[#e3d8d1] bg-[#f7f3f0] px-4 md:px-8">
          <button type="button" aria-label="Open navigation" className="mr-3 rounded-md p-2 text-[#786961] lg:hidden" onClick={() => setMenuOpen(true)}><Menu size={19} /></button>
          <div className="hidden items-center gap-2 text-xs text-[#806f65] sm:flex"><span>Workspace</span><ChevronRight size={14} /><b className="font-semibold text-black">{title}</b></div>
          <button type="button" aria-label="Notifications" className="ml-auto rounded-md p-2 text-[#786961]"><Bell size={18} /></button>
          <span className="ml-3 grid size-8 place-items-center rounded-full bg-[#c99b68] text-xs font-bold text-black">{user.email[0]?.toUpperCase()}</span>
        </header>
        {content}
      </main>
    </div>
  );
}

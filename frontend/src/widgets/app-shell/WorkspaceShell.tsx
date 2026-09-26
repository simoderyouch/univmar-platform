import { useState } from "react";
import { Bell, ChevronRight, Inbox, LogOut, Menu, X } from "lucide-react";
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
import { ScanPage } from "../../features/scan";
import { RemnantsPage } from "../../features/remnant";
import { FabricationPage } from "../../features/fabrication";
import { UsersPage } from "../../features/user";
import { CmsPage, Submissions } from "../../features/cms";
import { PlaceholderPage } from "../../features/workspace";
import { workspaceNavigation, workspaceNavigationGroups, type NavigationEntry } from "./navigation";
import { canAccessFormInbox, canAccessRoute } from "../../features/auth/permissions";

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
  const [inboxOpen, setInboxOpen] = useState(false);

  if (loading) return <main className="grid min-h-screen place-items-center bg-white text-sm text-[#786961]">Loading workspace…</main>;
  if (!user) return <Redirect to="/login" />;

  const current = workspaceNavigation.find((item) => path === item.to || path.startsWith(`${item.to}/`));
  const title = current?.label ?? "Dashboard";
  const closeMenu = () => setMenuOpen(false);
  const navigationGroups = workspaceNavigationGroups.map(group => ({ ...group, items: group.items.filter(item => canAccessRoute(user.role, item.to)) })).filter(group => group.items.length > 0);
  if (!canAccessRoute(user.role, path)) return <Redirect to="/dashboard" />;
  const content = path === "/dashboard"
    ? <DashboardPage />
    : path === "/catalog"
      ? <CatalogPage />
      : path === "/inventory" || path.startsWith("/inventory/")
        ? <InventoryPage />
        : path === "/slabs"
          ? <SlabsPage />
          : path === "/remnants"
            ? <RemnantsPage />
            : path === "/fabrication"
              ? <FabricationPage />
          : path === "/scan"
            ? <ScanPage />
        : path === "/suppliers"
          ? <PurchasingPage />
            : path === "/customers"
              ? <CustomersPage />
              : path === "/cms"
                ? <CmsPage />
              : path === "/projects" || path.startsWith("/projects/")
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
                          : path === "/users"
                            ? <UsersPage />
        : !current
          ? <DashboardPage />
          : <PlaceholderPage title={title} />;

  const sidebar = (
    <>
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-white/10  py-12">
        <img src="/univmar-logo-w.png" alt="Univmar Marble" className="h-auto w-[11rem] object-contain object-left" />
        <button type="button" className="ml-auto p-2 lg:hidden" onClick={closeMenu} aria-label="Close navigation"><X size={18} /></button>
      </div>
      <nav aria-label="Workspace navigation" className="workspace-nav-scroll min-h-0 flex-1 space-y-6 overflow-y-auto px-1 py-6 pl-3 pr-2">
        {navigationGroups.map((group) => (
          <section key={group.label} aria-label={group.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">{group.label}</p>
            <div className="grid gap-1">
              {group.items.map((item) => <NavigationItem key={item.to} item={item} onNavigate={closeMenu} />)}
            </div>
          </section>
        ))}
      </nav>
      <div className="shrink-0 border-t border-white/10 px-3 pt-4">
        <div className="flex items-center gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#c99b68] text-xs font-bold text-[#110703]">{user.email[0]?.toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white/90">{user.email}</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/40">{user.role.replaceAll("_", " ")}</p>
          </div>
          <button type="button" onClick={() => { logout(); navigate("/login"); }} className="inline-flex shrink-0 items-center justify-center text-white/60 transition-colors hover:text-white" aria-label="Sign out" title="Sign out"><LogOut size={15} /></button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white text-black">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col bg-[#110703]  py-5 text-white lg:flex">{sidebar}</aside>
      {menuOpen && <>
        <button type="button" aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={closeMenu} />
        <aside className="fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-[#110703] px-3 py-5 text-white lg:hidden">{sidebar}</aside>
      </>}
      <main className="min-h-screen lg:ml-[272px]">
        <header className="flex h-[68px] items-center border-b border-[#e3d8d1] bg-white px-4 md:px-8">
          <button type="button" aria-label="Open navigation" className="mr-3 rounded-md p-2 text-[#786961] lg:hidden" onClick={() => setMenuOpen(true)}><Menu size={19} /></button>
          <div className="hidden items-center gap-2 text-xs text-[#806f65] sm:flex"><span>Workspace</span><ChevronRight size={14} /><b className="font-semibold text-black">{title}</b></div>
          <div className="ml-auto flex items-center gap-1">
            {canAccessFormInbox(user.role) && <button type="button" aria-label="Open form inbox" title="Form inbox" onClick={() => setInboxOpen(true)} className="rounded-md p-2 text-[#786961] transition-colors hover:bg-[#f5f0ed] hover:text-[#21140f]"><Inbox size={18} /></button>}
            <button type="button" aria-label="Notifications" title="Notifications" className="rounded-md p-2 text-[#786961] transition-colors hover:bg-[#f5f0ed] hover:text-[#21140f]"><Bell size={18} /></button>
          </div>
        </header>
        {content}
      </main>
      {inboxOpen && <>
        <button type="button" aria-label="Close form inbox" className="fixed inset-0 z-50 bg-[#110703]/35 backdrop-blur-[1px]" onClick={() => setInboxOpen(false)} />
        <aside role="dialog" aria-modal="true" aria-label="Form inbox" className="fixed inset-y-0 right-0 z-[60] w-full max-w-[1100px] overflow-y-auto bg-[#fbf9f7] shadow-[-20px_0_60px_rgba(17,7,3,.2)]">
          <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[#e3d8d1] bg-white/95 px-4 backdrop-blur sm:px-7">
            <button type="button" aria-label="Close form inbox" onClick={() => setInboxOpen(false)} className="rounded-md p-2 text-[#786961] transition-colors hover:bg-[#f5f0ed] hover:text-[#21140f]"><X size={18} /></button>
          </div>
          <Submissions />
        </aside>
      </>}
    </div>
  );
}

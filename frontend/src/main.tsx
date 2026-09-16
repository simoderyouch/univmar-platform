import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Archive, BarChart3, Boxes, ChevronRight, ClipboardList, FileText, ImagePlus, LayoutDashboard, LogOut, Menu, Package, Plus, Search, ShieldCheck, Users, X } from "lucide-react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { cn } from "./lib/utils";
import "./styles.css";

type View = "overview" | "catalogue" | "requests" | "quotations" | "orders" | "inventory" | "team";
type Category = { id: number; slug: string; name: string; displayOrder: number; localMaterial?: boolean; active?: boolean };
type Media = { id: number; url: string; primary: boolean; altText?: string };
type Variant = { id: number; finish: string; thicknessMm: number; grade?: string; indicativePrice: number | null; availability: string };
type Material = { id: number; name: string; slug: string; category: string; originCountry?: string; primaryColor?: string; description?: string; applications?: string; active: boolean; images: Media[]; variants: Variant[] };
type User = { id: number; email: string; role: string; status: string; createdAt: string };
type InventoryItem = { id: number; variantId: number; onHandM2: number; reservedM2: number; availableM2: number; minStockM2: number; active: boolean };
type Draft = Omit<Material, "id" | "slug"> & { id?: number };

const newDraft = (category = ""): Draft => ({ name: "", category, originCountry: "", primaryColor: "", description: "", applications: "", active: true, images: [], variants: [] });
const modules: { id: View; label: string; icon: typeof LayoutDashboard; path?: string }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "catalogue", label: "Catalogue", icon: Package },
  { id: "requests", label: "Quote requests", icon: ClipboardList, path: "/sales/quote-requests" },
  { id: "quotations", label: "Quotations", icon: FileText, path: "/sales/quotations" },
  { id: "orders", label: "Orders", icon: Archive, path: "/sales/orders" },
  { id: "inventory", label: "Inventory", icon: Boxes, path: "/inventory" },
  { id: "team", label: "Team & access", icon: Users, path: "/admin/users" },
];
const sessionKey = "univmar.platform.access";
const jsonHeaders = { "Content-Type": "application/json" };
const fieldClass = "mt-1.5 w-full rounded-md border border-[#d8d0c6] bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-[#c9a46e] focus:ring-2 focus:ring-[#c9a46e]/20";
const labelClass = "text-xs font-semibold text-[#6b6560]";

function slug(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
function label(value: unknown) { return typeof value === "string" ? value.replaceAll("_", " ") : String(value ?? "—"); }

function App() {
  const [token, setToken] = useState(sessionStorage.getItem(sessionKey) ?? "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState<View>("overview");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [operations, setOperations] = useState<unknown[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  const request = useCallback(async (path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(`/api/v1${path}`, { ...init, headers });
    if (response.status === 401) { sessionStorage.removeItem(sessionKey); setToken(""); throw new Error("Your session ended. Sign in again."); }
    if (response.status === 403) throw new Error("Your account does not have access to this area.");
    return response;
  }, [token]);

  const loadCatalogue = useCallback(async () => {
    const [catalogueResponse, categoriesResponse] = await Promise.all([request("/admin/materials?size=500"), request("/admin/categories")]);
    if (!catalogueResponse.ok) throw new Error("Catalogue could not be loaded.");
    const page = await catalogueResponse.json() as { content?: Material[] };
    setMaterials((page.content ?? []).sort((a, b) => a.name.localeCompare(b.name, "fr")));
    if (categoriesResponse.ok) setCategories((await categoriesResponse.json() as Category[]).sort((a, b) => a.displayOrder - b.displayOrder));
  }, [request]);
  const loadTeam = useCallback(async () => { const response = await request("/admin/users"); if (response.ok) setUsers(await response.json() as User[]); }, [request]);
  const loadInventory = useCallback(async () => { const response = await request("/inventory?size=500"); if (!response.ok) throw new Error("Inventory could not be loaded."); const page = await response.json() as { content?: InventoryItem[] }; setInventory(page.content ?? []); }, [request]);
  const loadOperations = useCallback(async (id: View) => {
    const module = modules.find((item) => item.id === id);
    if (!module?.path) return;
    const response = await request(module.path);
    if (!response.ok) throw new Error(`${module.label} could not be loaded.`);
    const body = await response.json() as unknown;
    setOperations(Array.isArray(body) ? body : (body && typeof body === "object" && "content" in body ? ((body as { content?: unknown[] }).content ?? []) : [body]));
  }, [request]);

  useEffect(() => { if (!token) return; setLoading(true); Promise.all([loadCatalogue(), loadTeam()]).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load platform data.")).finally(() => setLoading(false)); }, [token, loadCatalogue, loadTeam]);
  useEffect(() => { if (!token) return; if (view === "inventory") { void loadInventory().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load inventory.")); return; } if (!["overview", "catalogue", "team"].includes(view)) void loadOperations(view).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load data.")); }, [token, view, loadOperations, loadInventory]);

  const signIn = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/v1/auth/login", { method: "POST", headers: jsonHeaders, body: JSON.stringify({ email, password }) });
      if (!response.ok) throw new Error("Invalid email or password.");
      const body = await response.json() as { accessToken?: string };
      if (!body.accessToken) throw new Error("Sign in is unavailable.");
      sessionStorage.setItem(sessionKey, body.accessToken); setToken(body.accessToken); setPassword("");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Sign in failed."); } finally { setLoading(false); }
  };
  const saveProduct = async () => {
    if (!draft || !draft.name.trim() || !draft.category) return setError("Name and category are required.");
    setLoading(true); setError("");
    try {
      const payload = { name: draft.name.trim(), slug: draft.id ? "unchanged" : slug(draft.name), category: draft.category, originCountry: draft.originCountry || null, primaryColor: draft.primaryColor || null, description: draft.description || null, applications: draft.applications || null, active: draft.active, images: draft.images.map((image) => ({ url: image.url, altText: image.altText ?? draft.name })) };
      const response = await request(draft.id ? `/admin/materials/${draft.id}` : "/admin/materials", { method: draft.id ? "PUT" : "POST", headers: jsonHeaders, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("Product could not be saved.");
      const saved = await response.json() as Material; setDraft(saved); await loadCatalogue(); setNotice("Product saved. Upload images below once it has been created.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Product could not be saved."); } finally { setLoading(false); }
  };
  const upload = async (files: FileList | null) => {
    if (!files?.length || !draft?.id) return setError("Save the product before uploading images.");
    setLoading(true);
    try {
      const added: Media[] = [];
      for (const file of Array.from(files)) { const form = new FormData(); form.set("file", file); form.set("altText", draft.name); const response = await request(`/admin/materials/${draft.id}/images`, { method: "POST", body: form }); if (!response.ok) throw new Error("Use JPEG, PNG, or WebP files smaller than 10 MB."); added.push(await response.json() as Media); }
      setDraft({ ...draft, images: [...draft.images, ...added] }); await loadCatalogue(); setNotice("Image stored in platform media.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Image could not be uploaded."); } finally { setLoading(false); }
  };
  const removeMedia = async (media: Media) => { if (!draft?.id || !confirm("Remove this image from the platform?")) return; const response = await request(`/admin/materials/${draft.id}/images/${media.id}`, { method: "DELETE" }); if (!response.ok) return setError("Image could not be removed."); setDraft({ ...draft, images: draft.images.filter((item) => item.id !== media.id) }); await loadCatalogue(); };
  const hideProduct = async () => { if (!draft?.id || !confirm("Hide this product from the landing site?")) return; const response = await request(`/admin/materials/${draft.id}`, { method: "DELETE" }); if (!response.ok) return setError("Product could not be hidden."); setDraft(null); await loadCatalogue(); setNotice("Product is hidden from the landing site."); };
  const updateUser = async (user: User, role: string, active: boolean) => { const response = await request(`/admin/users/${user.id}`, { method: "PATCH", headers: jsonHeaders, body: JSON.stringify({ role, active }) }); if (!response.ok) return setError("Access could not be updated."); await loadTeam(); setNotice("User access updated."); };
  const createUser = async (email: string, password: string, role: string) => { const response = await request("/admin/users", { method: "POST", headers: jsonHeaders, body: JSON.stringify({ email, password, role }) }); if (!response.ok) return setError("Team member could not be created."); await loadTeam(); setNotice("Team member created."); };
  const resetPassword = async (id: number, password: string) => { const response = await request(`/admin/users/${id}/reset-password`, { method: "POST", headers: jsonHeaders, body: JSON.stringify({ password }) }); if (!response.ok) return setError("Password could not be reset."); setNotice("Password reset successfully."); };
  const saveCategory = async (category: Category) => { const payload = { slug: category.slug, name: category.name, displayOrder: category.displayOrder, localMaterial: Boolean(category.localMaterial), active: category.active !== false }; const response = await request(category.id ? `/admin/categories/${category.id}` : "/admin/categories", { method: category.id ? "PUT" : "POST", headers: jsonHeaders, body: JSON.stringify(payload) }); if (!response.ok) return setError("Category could not be saved."); await loadCatalogue(); setNotice("Category saved."); };
  const createVariant = async (input: { finish: string; thicknessMm: number; grade: string; indicativePrice: number | null }) => { if (!draft?.id) return; const response = await request(`/admin/materials/${draft.id}/variants`, { method: "POST", headers: jsonHeaders, body: JSON.stringify(input) }); if (!response.ok) return setError("Variant could not be created."); const saved = await response.json() as Variant; setDraft({ ...draft, variants: [...draft.variants, saved] }); await loadCatalogue(); setNotice("Variant created."); };
  const archiveVariant = async (variantId: number) => { if (!draft?.id || !confirm("Hide this variant from the catalogue?")) return; const response = await request(`/admin/materials/${draft.id}/variants/${variantId}`, { method: "DELETE" }); if (!response.ok) return setError("Variant could not be hidden."); setDraft({ ...draft, variants: draft.variants.filter((item) => item.id !== variantId) }); await loadCatalogue(); };
  const updateVariant = async (variant: Variant, input: { finish: string; thicknessMm: number; grade: string; indicativePrice: number | null }) => { if (!draft?.id) return; const response = await request(`/admin/materials/${draft.id}/variants/${variant.id}`, { method: "PUT", headers: jsonHeaders, body: JSON.stringify(input) }); if (!response.ok) return setError("Variant could not be updated."); const saved = await response.json() as Variant; setDraft({ ...draft, variants: draft.variants.map((item) => item.id === saved.id ? saved : item) }); await loadCatalogue(); setNotice("Variant updated."); };
  const inventoryAction = async (id: number | null, endpoint: string, payload: object, success: string) => { const archive = endpoint === "/archive"; const path = id === null ? "/inventory" : archive ? `/inventory/${id}` : `/inventory/${id}${endpoint}`; const response = await request(path, { method: id === null ? "POST" : archive ? "DELETE" : "POST", headers: jsonHeaders, body: archive ? undefined : JSON.stringify(payload) }); if (!response.ok) return setError("Inventory could not be updated."); await loadInventory(); setNotice(success); };
  const updateInventoryMinimum = async (id: number, minStockM2: number) => { const response = await request(`/inventory/${id}`, { method: "PUT", headers: jsonHeaders, body: JSON.stringify({ minStockM2 }) }); if (!response.ok) return setError("Inventory threshold could not be updated."); await loadInventory(); setNotice("Minimum stock updated."); };
  const visibleMaterials = useMemo(() => materials.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase())), [materials, query]);
  const currentModule = modules.find((item) => item.id === view)?.label ?? "Overview";

  if (!token) return <SignIn email={email} password={password} loading={loading} error={error} setEmail={setEmail} setPassword={setPassword} onSubmit={signIn} />;
  return <div className="min-h-screen bg-[#faf7f2] text-black">
    <aside className={cn("fixed inset-y-0 left-0 z-30 flex w-[272px] -translate-x-full flex-col border-r border-white/10 bg-black px-3 py-5 text-white transition-transform duration-200 lg:translate-x-0", sidebar && "translate-x-0 shadow-2xl")}>
      <div className="flex h-16 items-center justify-center border-b border-white/10 pb-4">
        <img src="/brand/univmar-logo-w.png" alt="UNIVMAR" className="h-12 w-16 object-contain" />
        <button className="ml-auto inline-flex p-2 text-white/70 lg:hidden" onClick={() => setSidebar(false)} aria-label="Close navigation"><X size={18} /></button>
      </div>
      <p className="mb-3 mt-6 px-2 text-[10px] font-bold tracking-[0.16em] text-white/40">WORKSPACE</p>
      <nav className="grid gap-1">
        {modules.map((item) => { const Icon = item.icon; const active = view === item.id; return <button key={item.id} className={cn("flex h-10 items-center gap-3 rounded-md px-3 text-left text-[13px] font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white", active && "bg-[#c9a46e]/20 text-white ring-1 ring-inset ring-[#dbb882]/30")} onClick={() => { setView(item.id); setSidebar(false); }}><Icon size={17} className={active ? "text-[#dbb882]" : ""} />{item.label}</button>; })}
      </nav>
      <div className="mt-auto flex gap-2 border-t border-white/10 px-2 pt-4 text-[11px] leading-4 text-white/50"><ShieldCheck size={16} className="shrink-0 text-[#dbb882]" />Role-protected workspace</div>
    </aside>
    {sidebar && <button className="fixed inset-0 z-20 bg-black/35 lg:hidden" aria-label="Close navigation overlay" onClick={() => setSidebar(false)} />}
    <main className="min-h-screen lg:ml-[272px]">
      <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-[#e4ddd2] bg-[#faf7f2]/95 px-4 backdrop-blur md:px-8">
        <Button variant="ghost" className="lg:hidden" onClick={() => setSidebar(true)} aria-label="Open navigation"><Menu size={19} /></Button>
        <div className="hidden items-center gap-2 text-xs text-[#7a736c] lg:flex"><span>Workspace</span><ChevronRight size={14} /><b className="font-semibold text-black">{currentModule}</b></div>
        <div className="ml-auto flex items-center gap-2"><Badge className="hidden border border-[#c9a46e]/30 bg-[#c9a46e]/10 text-[#88663b] sm:inline-flex">Secure session</Badge><Button variant="outline" size="sm" onClick={() => { sessionStorage.removeItem(sessionKey); setToken(""); }}><LogOut size={15} />Sign out</Button></div>
      </header>
      <section className="mx-auto max-w-[1520px] px-4 py-7 md:px-8 md:py-10">
        {error && <Alert kind="error" text={error} close={() => setError("")} />}
        {notice && <Alert kind="notice" text={notice} close={() => setNotice("")} />}
        {loading && <div className="mb-6 h-0.5 w-full overflow-hidden bg-[#ede8df]"><div className="h-full w-2/5 bg-[#c9a46e]" /></div>}
        {view === "overview" && <Overview materials={materials} users={users} onCatalog={() => setView("catalogue")} />}
        {view === "catalogue" && <Catalogue materials={visibleMaterials} categories={categories} query={query} setQuery={setQuery} draft={draft} setDraft={setDraft} save={saveProduct} upload={upload} removeMedia={removeMedia} hide={hideProduct} loading={loading} saveCategory={saveCategory} createVariant={createVariant} updateVariant={updateVariant} archiveVariant={archiveVariant} />}
        {view === "team" && <Team users={users} update={updateUser} create={createUser} resetPassword={resetPassword} />}
        {view === "inventory" && <Inventory inventory={inventory} create={(variantId, minStockM2) => inventoryAction(null, "", { variantId, minStockM2 }, "Inventory item created.")} updateMinimum={updateInventoryMinimum} stockIn={(id, quantityM2, reason) => inventoryAction(id, "/stock-in", { quantityM2, reason }, "Stock received.")} adjust={(id, quantityM2, reason) => inventoryAction(id, "/adjustments", { quantityM2, reason }, "Inventory adjusted.")} archive={(id) => inventoryAction(id, "/archive", {}, "Inventory item archived.")} />}
        {! ["overview", "catalogue", "team", "inventory"].includes(view) && <Operations title={currentModule} rows={operations} />}
      </section>
    </main>
  </div>;
}

function SignIn({ email, password, loading, error, setEmail, setPassword, onSubmit }: { email: string; password: string; loading: boolean; error: string; setEmail(value: string): void; setPassword(value: string): void; onSubmit(event: FormEvent): void }) {
  return <main className="grid min-h-screen place-items-center bg-black p-5"><form className="w-full max-w-[452px] border border-[#dbb882]/50 bg-[#faf7f2] p-8 shadow-2xl sm:p-11" onSubmit={onSubmit}>
    <img src="/brand/univmar-logo.png" alt="UNIVMAR" className="mb-7 h-14 w-20 object-contain object-left" />
    <p className="text-[10px] font-extrabold tracking-[.16em] text-[#a8804c]">UNIVMAR PLATFORM</p>
    <h1 className="mt-2 font-serif text-3xl leading-tight tracking-tight text-black">Control room for stone operations.</h1>
    <p className="mt-3 text-sm leading-6 text-[#6b6560]">Use your platform administrator account. The session is kept only for this browser tab.</p>
    <label className={cn("mt-7 block", labelClass)}>Work email<Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required className="mt-1.5" /></label>
    <label className={cn("mt-5 block", labelClass)}>Password<Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required className="mt-1.5" /></label>
    <Button className="mt-7 w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in securely"}</Button>
    {error && <p className="mt-3 text-xs text-[#873f36]">{error}</p>}
  </form></main>;
}

function Alert({ kind, text, close }: { kind: "error" | "notice"; text: string; close(): void }) {
  const style = kind === "error" ? "border-[#f1d2cb] bg-[#fff2ef] text-[#873f36]" : "border-[#ead7ad] bg-[#fbf5e9] text-[#765528]";
  return <div className={cn("mb-5 flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm", style)}><span>{text}</span><button className="p-0.5" onClick={close} aria-label="Dismiss message"><X size={15} /></button></div>;
}

function PageHeading({ eyebrow, title, children, action }: { eyebrow: string; title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="mb-7 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end"><div><p className="text-[10px] font-extrabold tracking-[.16em] text-[#a8804c]">{eyebrow}</p><h1 className="mt-2 font-serif text-3xl tracking-tight text-black md:text-[38px]">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b6560]">{children}</p></div>{action}</div>;
}

function Overview({ materials, users, onCatalog }: { materials: Material[]; users: User[]; onCatalog(): void }) {
  const live = materials.filter((item) => item.active).length;
  const media = materials.reduce((sum, item) => sum + item.images.length, 0);
  const percent = materials.length ? Math.round((live / materials.length) * 100) : 0;
  return <>
    <PageHeading eyebrow="OPERATIONS SNAPSHOT" title="Today’s catalogue pulse" action={<Button onClick={onCatalog}><Plus size={16} />Manage catalogue</Button>}>A clear view of what is live, ready for quotation, and owned by your team.</PageHeading>
    <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Live materials" value={live} note={`${materials.length - live} hidden`} icon={<Package size={18} />} accent />
      <Metric label="Product media" value={media} note="Stored outside source control" icon={<ImagePlus size={18} />} />
      <Metric label="Team accounts" value={users.length} note={`${users.filter((user) => user.status === "ACTIVE").length} active`} icon={<Users size={18} />} />
      <Metric label="Commercial workflow" value="Ready" note="RFQ → quotation → order" icon={<BarChart3 size={18} />} />
    </div>
    <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
      <Card><CardHeader><b className="text-sm text-black">Catalogue readiness</b><span className="mt-1 block text-xs text-[#7a736c]">Products visible to the landing website</span></CardHeader><CardContent>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#ede8df]"><div className="h-full rounded-full bg-[#c9a46e]" style={{ width: `${percent}%` }} /></div>
        <div className="mt-2 flex justify-between text-xs text-[#6b6560]"><span>{live} of {materials.length} published</span><b className="text-black">{percent}%</b></div>
        <p className="mt-5 text-sm leading-6 text-[#6b6560]">Published products are immediately returned by the public catalogue API. Product images are served from persistent platform media, never from GitHub.</p>
      </CardContent></Card>
      <Card><CardHeader><b className="text-sm text-black">Operating sequence</b></CardHeader><CardContent><ol className="grid gap-4">
        <Sequence number="01" title="Qualify request">Review customer RFQs and project requirements.</Sequence>
        <Sequence number="02" title="Send quotation">Turn approved material selections into a commercial offer.</Sequence>
        <Sequence number="03" title="Reserve and fulfil">Accept, reserve inventory, and progress the order.</Sequence>
      </ol></CardContent></Card>
    </div>
  </>;
}

function Metric({ label, value, note, icon, accent }: { label: string; value: string | number; note: string; icon: React.ReactNode; accent?: boolean }) {
  return <Card className="relative min-h-[150px] overflow-hidden"><CardContent className="p-5"><div className="float-right grid size-9 place-items-center rounded-lg border border-[#e4ddd2] bg-[#f3efe8] text-[#a8804c]">{icon}</div><p className="mb-3 text-xs font-medium text-[#7a736c]">{label}</p><b className="block font-serif text-3xl tracking-tight text-black">{value}</b><span className="mt-2 block text-[11px] text-[#8b847d]">{note}</span></CardContent><div className={cn("absolute inset-x-0 bottom-0 h-[3px] bg-[#e4ddd2]", accent && "bg-[#c9a46e]")} /></Card>;
}

function Sequence({ number, title, children }: { number: string; title: string; children: React.ReactNode }) { return <li className="flex gap-3"><i className="grid size-7 shrink-0 place-items-center rounded-full border border-[#e4ddd2] bg-[#f3efe8] text-[10px] font-extrabold not-italic text-[#a8804c]">{number}</i><div><b className="text-sm text-black">{title}</b><span className="mt-0.5 block text-xs leading-5 text-[#7a736c]">{children}</span></div></li>; }

function Catalogue({ materials, categories, query, setQuery, draft, setDraft, save, upload, removeMedia, hide, loading, saveCategory, createVariant, updateVariant, archiveVariant }: { materials: Material[]; categories: Category[]; query: string; setQuery(value: string): void; draft: Draft | null; setDraft(value: Draft | null): void; save(): void; upload(files: FileList | null): void; removeMedia(media: Media): void; hide(): void; loading: boolean; saveCategory(category: Category): void; createVariant(input: { finish: string; thicknessMm: number; grade: string; indicativePrice: number | null }): void; updateVariant(variant: Variant, input: { finish: string; thicknessMm: number; grade: string; indicativePrice: number | null }): void; archiveVariant(id: number): void }) {
  return <><PageHeading eyebrow="PUBLIC CATALOGUE" title="Materials and media" action={<div className="flex flex-wrap gap-2"><Dialog><DialogTrigger asChild><Button variant="outline">Manage categories</Button></DialogTrigger><DialogContent className="max-w-2xl"><CategoryManager categories={categories} save={saveCategory} /></DialogContent></Dialog><Dialog><DialogTrigger asChild><Button onClick={() => setDraft(newDraft(categories.find((item) => item.active !== false)?.name ?? ""))}><Plus size={16} />New material</Button></DialogTrigger><DialogContent className="max-w-4xl"><Editor draft={draft} categories={categories.filter((item) => item.active !== false)} setDraft={setDraft} save={save} upload={upload} removeMedia={removeMedia} hide={hide} loading={loading} createVariant={createVariant} updateVariant={updateVariant} archiveVariant={archiveVariant} /></DialogContent></Dialog></div>}>Every published item is shown on the landing website from the platform API.</PageHeading>
    <Card><CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><b className="text-sm text-black">Material library</b><span className="mt-1 block text-xs text-[#7a736c]">{materials.length} matching materials</span></div><div className="flex min-w-0 items-center gap-2 text-[#a8804c] sm:w-80"><Search size={16} /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search material or category" className="bg-[#faf7f2]" /></div></CardHeader>
      <div className="overflow-auto"><table className="w-full min-w-[740px] border-collapse text-left text-[13px]"><thead className="bg-[#f3efe8] text-[10px] font-bold tracking-[.1em] text-[#7a736c]"><tr><th className="px-5 py-3">Material</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Media</th><th className="px-5 py-3">Visibility</th><th className="px-5 py-3" /></tr></thead><tbody>{materials.map((material) => <tr key={material.id} className="border-b border-[#ede8df] last:border-0 hover:bg-[#faf7f2]"><td className="px-5 py-3"><div className="flex items-center gap-3">{material.images[0] ? <img src={material.images[0].url} alt="" className="size-10 rounded-md border border-[#e4ddd2] object-cover" /> : <div className="size-10 rounded-md border border-[#e4ddd2] bg-[#ede8df]" />}<div><b className="block font-semibold text-black">{material.name}</b><span className="mt-0.5 block text-[11px] text-[#8b847d]">#{material.id} · {material.slug}</span></div></div></td><td className="px-5 py-3 text-[#6b6560]">{material.category}</td><td className="px-5 py-3 text-[#6b6560]">{material.images.length} files</td><td className="px-5 py-3"><Badge className={material.active ? "border border-[#a8804c]/20 bg-[#c9a46e]/15 text-[#765528]" : "border border-[#ecd2cd] bg-[#f6e8e5] text-[#875049]"}>{material.active ? "Published" : "Hidden"}</Badge></td><td className="px-5 py-3"><Dialog><DialogTrigger asChild><Button variant="ghost" size="sm" onClick={() => setDraft(material)}>Edit</Button></DialogTrigger><DialogContent className="max-w-4xl"><Editor draft={draft} categories={categories.filter((item) => item.active !== false)} setDraft={setDraft} save={save} upload={upload} removeMedia={removeMedia} hide={hide} loading={loading} createVariant={createVariant} updateVariant={updateVariant} archiveVariant={archiveVariant} /></DialogContent></Dialog></td></tr>)}</tbody></table>{!materials.length && <p className="p-10 text-center text-sm text-[#7a736c]">No materials match this search.</p>}</div>
    </Card></>;
}

function Editor({ draft, categories, setDraft, save, upload, removeMedia, hide, loading, createVariant, updateVariant, archiveVariant }: { draft: Draft | null; categories: Category[]; setDraft(value: Draft | null): void; save(): void; upload(files: FileList | null): void; removeMedia(media: Media): void; hide(): void; loading: boolean; createVariant(input: { finish: string; thicknessMm: number; grade: string; indicativePrice: number | null }): void; updateVariant(variant: Variant, input: { finish: string; thicknessMm: number; grade: string; indicativePrice: number | null }): void; archiveVariant(id: number): void }) {
  if (!draft) return null;
  return <div><div className="mb-6 flex flex-col gap-4 pr-7 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[10px] font-extrabold tracking-[.16em] text-[#a8804c]">MATERIAL RECORD</p><h2 className="mt-2 font-serif text-2xl text-black">{draft.id ? `Edit ${draft.name}` : "New material"}</h2></div><div className="flex gap-2">{draft.id && <Button variant="destructive" size="sm" onClick={hide}>Hide from landing</Button>}<Button size="sm" onClick={save} disabled={loading}>Save changes</Button></div></div>
    <div className="grid gap-4 sm:grid-cols-2"><label className={labelClass}>Name<Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="mt-1.5" /></label><label className={labelClass}>Category<select className={fieldClass} value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}</select></label><label className={labelClass}>Origin<Input value={draft.originCountry ?? ""} onChange={(event) => setDraft({ ...draft, originCountry: event.target.value })} className="mt-1.5" /></label><label className={labelClass}>Primary colour<Input value={draft.primaryColor ?? ""} onChange={(event) => setDraft({ ...draft, primaryColor: event.target.value })} className="mt-1.5" /></label><label className={cn(labelClass, "sm:col-span-2")}>Description<textarea className={cn(fieldClass, "min-h-24 resize-y")} value={draft.description ?? ""} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label><label className={cn(labelClass, "flex items-center gap-2 sm:col-span-2")}><input type="checkbox" className="accent-[#a8804c]" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />Publish to the landing website</label></div>
    <div className="mt-6 grid gap-3 border-t border-[#e4ddd2] pt-5 sm:grid-cols-[1fr_auto]"><div><b className="text-sm text-black">Product images</b><p className="mt-1 text-xs leading-5 text-[#6b6560]">JPEG, PNG, or WebP · maximum 10 MB. Files are stored in the platform media volume.</p></div>{draft.id ? <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#ead7ad] bg-[#fbf5e9] px-3 text-xs font-bold text-[#765528]"><ImagePlus size={16} />Upload media<input type="file" className="hidden" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => upload(event.target.files)} /></label> : <Badge className="h-fit">Save before uploading</Badge>}<div className="grid grid-cols-3 gap-2 sm:col-span-2 sm:grid-cols-5">{draft.images.map((media) => <figure key={media.id} className="relative aspect-square overflow-hidden rounded-md border border-[#e4ddd2] bg-[#ede8df]"><img src={media.url} alt={draft.name} className="size-full object-cover" /><button className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-[#873f36] text-white" onClick={() => removeMedia(media)} aria-label="Remove image"><X size={14} /></button>{media.primary && <figcaption className="absolute inset-x-0 bottom-0 bg-black/80 py-1 text-center text-[10px] text-white">Primary</figcaption>}</figure>)}</div></div>{draft.id && <VariantManager variants={draft.variants} create={createVariant} update={updateVariant} archive={archiveVariant} />}
  </div>;
}

function CategoryManager({ categories, save }: { categories: Category[]; save(category: Category): void }) {
  const [draft, setDraft] = useState<Category>({ id: 0, slug: "", name: "", displayOrder: categories.length + 1, localMaterial: false, active: true });
  return <div className="pr-6"><p className="text-[10px] font-extrabold tracking-[.16em] text-[#a8804c]">CATALOGUE STRUCTURE</p><h2 className="mt-2 font-serif text-2xl text-black">Categories</h2><div className="mt-5 grid gap-3 sm:grid-cols-2"><label className={labelClass}>Name<Input className="mt-1.5" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value, slug: draft.slug || slug(event.target.value) })} /></label><label className={labelClass}>Slug<Input className="mt-1.5" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: slug(event.target.value) })} /></label><label className={labelClass}>Display order<Input className="mt-1.5" type="number" value={draft.displayOrder} onChange={(event) => setDraft({ ...draft, displayOrder: Number(event.target.value) })} /></label><label className={cn(labelClass, "flex items-center gap-2 self-end pb-2")}><input type="checkbox" checked={draft.active !== false} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} className="accent-[#a8804c]" />Visible on landing</label></div><Button className="mt-4" onClick={() => { save(draft); setDraft({ id: 0, slug: "", name: "", displayOrder: categories.length + 1, localMaterial: false, active: true }); }}>{draft.id ? "Save category" : "Create category"}</Button><div className="mt-6 divide-y divide-[#ede8df] border-t border-[#e4ddd2]">{categories.map((category) => <button key={category.id} className="flex w-full items-center justify-between py-3 text-left" onClick={() => setDraft(category)}><span><b className="block text-sm text-black">{category.name}</b><small className="text-xs text-[#7a736c]">/{category.slug} · order {category.displayOrder}</small></span><Badge className={category.active !== false ? "bg-[#c9a46e]/15 text-[#765528]" : "bg-[#f6e8e5] text-[#875049]"}>{category.active !== false ? "Live" : "Hidden"}</Badge></button>)}</div></div>;
}

function VariantManager({ variants, create, update, archive }: { variants: Variant[]; create(input: { finish: string; thicknessMm: number; grade: string; indicativePrice: number | null }): void; update(variant: Variant, input: { finish: string; thicknessMm: number; grade: string; indicativePrice: number | null }): void; archive(id: number): void }) {
  const [finish, setFinish] = useState(""); const [thicknessMm, setThickness] = useState("20"); const [grade, setGrade] = useState(""); const [price, setPrice] = useState("");
  return <div className="mt-6 border-t border-[#e4ddd2] pt-5"><b className="text-sm text-black">Commercial variants</b><div className="mt-3 grid gap-2 sm:grid-cols-4"><Input placeholder="Finish" value={finish} onChange={(event) => setFinish(event.target.value)} /><Input type="number" min="0.01" placeholder="Thickness mm" value={thicknessMm} onChange={(event) => setThickness(event.target.value)} /><Input placeholder="Grade" value={grade} onChange={(event) => setGrade(event.target.value)} /><Input type="number" min="0" placeholder="Price" value={price} onChange={(event) => setPrice(event.target.value)} /></div><Button size="sm" className="mt-3" onClick={() => { if (!finish.trim() || !Number(thicknessMm)) return; create({ finish: finish.trim(), thicknessMm: Number(thicknessMm), grade, indicativePrice: price ? Number(price) : null }); setFinish(""); setGrade(""); setPrice(""); }}>Add variant</Button><div className="mt-4 divide-y divide-[#ede8df] rounded-md border border-[#e4ddd2]">{variants.length ? variants.map((variant) => <div key={variant.id} className="flex items-center justify-between gap-3 px-3 py-2 text-xs"><span className="text-[#6b6560]"><b className="text-black">{variant.finish}</b> · {variant.thicknessMm} mm · {variant.grade || "Standard"} · {variant.indicativePrice ?? "—"}</span><span><Button size="sm" variant="ghost" onClick={() => { const finish = prompt("Finish:", variant.finish); const thicknessMm = Number(prompt("Thickness (mm):", String(variant.thicknessMm))); if (finish && thicknessMm > 0) update(variant, { finish, thicknessMm, grade: prompt("Grade:", variant.grade || "") || "", indicativePrice: Number(prompt("Indicative price:", String(variant.indicativePrice ?? ""))) || null }); }}>Edit</Button><Button size="sm" variant="ghost" onClick={() => archive(variant.id)}>Hide</Button></span></div>) : <p className="p-3 text-xs text-[#7a736c]">No variants yet.</p>}</div></div>;
}

function Operations({ title, rows }: { title: string; rows: unknown[] }) {
  const list = rows.filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object");
  const fields = list.length ? Object.keys(list[0]).slice(0, 6) : [];
  return <><PageHeading eyebrow="COMMERCIAL OPERATIONS" title={title}>Live records from the protected platform API.</PageHeading><Card><CardHeader><b className="text-sm text-black">{list.length} records</b><span className="mt-1 block text-xs text-[#7a736c]">Access is enforced by your assigned role.</span></CardHeader><div className="overflow-auto"><table className="w-full min-w-[700px] border-collapse text-left text-[13px]"><thead className="bg-[#f3efe8] text-[10px] font-bold uppercase tracking-[.1em] text-[#7a736c]"><tr>{fields.map((field) => <th key={field} className="px-5 py-3">{label(field)}</th>)}</tr></thead><tbody>{list.map((row, index) => <tr key={index} className="border-b border-[#ede8df] last:border-0 hover:bg-[#faf7f2]">{fields.map((field) => <td key={field} className="px-5 py-3 text-[#6b6560]">{typeof row[field] === "object" ? JSON.stringify(row[field]) : label(row[field])}</td>)}</tr>)}</tbody></table>{!list.length && <p className="p-10 text-center text-sm text-[#7a736c]">No records are available for this workspace.</p>}</div></Card></>;
}

function Inventory({ inventory, create, updateMinimum, stockIn, adjust, archive }: { inventory: InventoryItem[]; create(variantId: number, minStockM2: number): void; updateMinimum(id: number, minStockM2: number): void; stockIn(id: number, quantityM2: number, reason: string): void; adjust(id: number, quantityM2: number, reason: string): void; archive(id: number): void }) {
  const [variantId, setVariantId] = useState(""); const [minimum, setMinimum] = useState("0");
  return <><PageHeading eyebrow="STOCK CONTROL" title="Inventory">Receive stock, correct counts, set thresholds, and archive inactive stock lines.</PageHeading><Card className="mb-4"><CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end"><label className={cn(labelClass, "flex-1")}>Variant ID<Input className="mt-1.5" type="number" value={variantId} onChange={(event) => setVariantId(event.target.value)} /></label><label className={cn(labelClass, "flex-1")}>Minimum m²<Input className="mt-1.5" type="number" min="0" value={minimum} onChange={(event) => setMinimum(event.target.value)} /></label><Button onClick={() => { if (Number(variantId) > 0) { create(Number(variantId), Number(minimum)); setVariantId(""); } }}><Plus size={16} />Create inventory item</Button></CardContent></Card><Card><div className="overflow-auto"><table className="w-full min-w-[800px] border-collapse text-left text-[13px]"><thead className="bg-[#f3efe8] text-[10px] font-bold uppercase tracking-[.1em] text-[#7a736c]"><tr><th className="px-5 py-3">Variant</th><th className="px-5 py-3">On hand</th><th className="px-5 py-3">Reserved</th><th className="px-5 py-3">Available</th><th className="px-5 py-3">Minimum</th><th className="px-5 py-3" /></tr></thead><tbody>{inventory.map((item) => <tr key={item.id} className="border-b border-[#ede8df] last:border-0 hover:bg-[#faf7f2]"><td className="px-5 py-3 font-semibold text-black">#{item.variantId}</td><td className="px-5 py-3 text-[#6b6560]">{item.onHandM2} m²</td><td className="px-5 py-3 text-[#6b6560]">{item.reservedM2} m²</td><td className="px-5 py-3"><Badge className={item.availableM2 <= item.minStockM2 ? "bg-[#f6e8e5] text-[#875049]" : "bg-[#c9a46e]/15 text-[#765528]"}>{item.availableM2} m²</Badge></td><td className="px-5 py-3 text-[#6b6560]">{item.minStockM2} m²</td><td className="flex gap-1 px-5 py-3"><Button size="sm" variant="ghost" onClick={() => { const quantity = Number(prompt("Quantity received (m²):")); if (quantity > 0) stockIn(item.id, quantity, "Manual stock receipt"); }}>Receive</Button><Button size="sm" variant="ghost" onClick={() => { const quantity = Number(prompt("Adjustment m² (positive or negative):")); if (quantity) adjust(item.id, quantity, "Manual count correction"); }}>Adjust</Button><Button size="sm" variant="ghost" onClick={() => { const minimum = Number(prompt("Minimum stock m²:", String(item.minStockM2))); if (minimum >= 0) updateMinimum(item.id, minimum); }}>Threshold</Button><Button size="sm" variant="ghost" onClick={() => { if (confirm("Archive this inventory item?")) archive(item.id); }}>Archive</Button></td></tr>)}</tbody></table>{!inventory.length && <p className="p-10 text-center text-sm text-[#7a736c]">No active inventory items. Create one from a product variant.</p>}</div></Card></>;
}

function Team({ users, update, create, resetPassword }: { users: User[]; update(user: User, role: string, active: boolean): void; create(email: string, password: string, role: string): void; resetPassword(id: number, password: string): void }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [role, setRole] = useState("SALES");
  return <><PageHeading eyebrow="ACCESS CONTROL" title="Team & permissions" action={<Dialog><DialogTrigger asChild><Button><Plus size={16} />Add team member</Button></DialogTrigger><DialogContent><div className="pr-6"><p className="text-[10px] font-extrabold tracking-[.16em] text-[#a8804c]">TEAM ACCESS</p><h2 className="mt-2 font-serif text-2xl text-black">Create account</h2><label className={cn(labelClass, "mt-5 block")}>Work email<Input className="mt-1.5" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className={cn(labelClass, "mt-4 block")}>Temporary password<Input className="mt-1.5" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><label className={cn(labelClass, "mt-4 block")}>Role<select className={fieldClass} value={role} onChange={(event) => setRole(event.target.value)}><option>ADMIN</option><option>SALES</option><option>INVENTORY_MANAGER</option></select></label><Button className="mt-5" onClick={() => { if (email && password.length >= 10) { create(email, password, role); setEmail(""); setPassword(""); } }}>Create account</Button></div></DialogContent></Dialog>}>Role-based access is verified by the API on every protected operation.</PageHeading><Card><div className="overflow-auto"><table className="w-full min-w-[720px] border-collapse text-left text-[13px]"><thead className="bg-[#f3efe8] text-[10px] font-bold uppercase tracking-[.1em] text-[#7a736c]"><tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Created</th><th className="px-5 py-3" /></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b border-[#ede8df] last:border-0 hover:bg-[#faf7f2]"><td className="px-5 py-3 font-semibold text-black">{user.email}</td><td className="px-5 py-3"><select className="rounded-md border border-[#d8d0c6] bg-white px-2.5 py-1.5 text-xs text-black outline-none focus:border-[#c9a46e]" defaultValue={user.role} onChange={(event) => update(user, event.target.value, user.status === "ACTIVE")}><option>ADMIN</option><option>SALES</option><option>INVENTORY_MANAGER</option><option>CUSTOMER</option></select></td><td className="px-5 py-3"><Badge className={user.status === "ACTIVE" ? "border border-[#a8804c]/20 bg-[#c9a46e]/15 text-[#765528]" : "border border-[#ecd2cd] bg-[#f6e8e5] text-[#875049]"}>{user.status}</Badge></td><td className="px-5 py-3 text-[#6b6560]">{new Date(user.createdAt).toLocaleDateString()}</td><td className="px-5 py-3"><Button size="sm" variant="outline" onClick={() => update(user, user.role, user.status !== "ACTIVE")}>{user.status === "ACTIVE" ? "Disable" : "Enable"}</Button><Button size="sm" variant="ghost" className="ml-1" onClick={() => { const password = prompt(`New password for ${user.email}:`); if (password && password.length >= 10) resetPassword(user.id, password); }}>Reset password</Button></td></tr>)}</tbody></table></div></Card></>;
}

createRoot(document.getElementById("root")!).render(<App />);

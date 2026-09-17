import { createContext, useCallback, useContext, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Bell, Boxes, ChevronRight, ClipboardList, FileText, Handshake, LayoutDashboard, LogOut, Menu, Package, Truck, Users, X } from "lucide-react";
import { Button, DataTable, TextField } from "./components/ui";
import "./styles.css";

type User = { id: string; email: string; role: string };
type Envelope<T> = { data: T };
type ApiFailure = { message?: string; fields?: Record<string, string> };
const API_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
type RouterState = { path: string; navigate: (to: string, replace?: boolean) => void };
const RouterContext = createContext<RouterState | undefined>(undefined);
function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => { const update = () => setPath(window.location.pathname); window.addEventListener("popstate", update); return () => window.removeEventListener("popstate", update); }, []);
  const navigate = useCallback((to: string, replace = false) => { window.history[replace ? "replaceState" : "pushState"]({}, "", to); setPath(to); }, []);
  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}
function useRouter() { const value = useContext(RouterContext); if (!value) throw new Error("useRouter must be inside RouterProvider"); return value; }
function Redirect({ to }: { to: string }) { const { navigate } = useRouter(); useEffect(() => navigate(to, true), [navigate, to]); return null; }
class RequestError extends Error { constructor(message: string, public fields: Record<string, string> = {}) { super(message); } }
async function api<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) { const problem = body as ApiFailure; throw new RequestError(problem.message ?? "The request could not be completed.", problem.fields); }
  return (body as Envelope<T>).data;
}

type AuthState = { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => void };
const AuthContext = createContext<AuthState | undefined>(undefined); const tokenKey = "univmar.access-token";
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true);
  const token = () => localStorage.getItem(tokenKey) ?? undefined;
  useEffect(() => { const existing = token(); if (!existing) { setLoading(false); return; } api<User>("/auth/me", {}, existing).then(setUser).catch(() => localStorage.removeItem(tokenKey)).finally(() => setLoading(false)); }, []);
  async function login(email: string, password: string) { const result = await api<{ accessToken: string; user: User }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }); localStorage.setItem(tokenKey, result.accessToken); setUser(result.user); }
  function logout() { localStorage.removeItem(tokenKey); setUser(null); }
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be inside AuthProvider"); return value; }

type Toast = { id: number; message: string; kind: "error" | "success" }; const ToastContext = createContext<(message: string, kind?: Toast["kind"]) => void>(() => undefined);
function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  function notify(message: string, kind: Toast["kind"] = "success") { const id = Date.now(); setToasts(items => [...items, { id, message, kind }]); window.setTimeout(() => setToasts(items => items.filter(item => item.id !== id)), 4500); }
  return <ToastContext.Provider value={notify}>{children}<div className="fixed right-4 top-4 z-[60] grid w-[min(360px,calc(100vw-2rem))] gap-2">{toasts.map(toast => <div key={toast.id} role="status" className={`rounded-lg border px-4 py-3 text-sm shadow-lg ${toast.kind === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{toast.message}</div>)}</div></ToastContext.Provider>;
}
const useToast = () => useContext(ToastContext);

function Login() {
  const { user, login } = useAuth(); const { navigate } = useRouter(); const notify = useToast(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [errors, setErrors] = useState<Record<string, string>>({}); const [submitting, setSubmitting] = useState(false);
  if (user) return <Redirect to="/dashboard" />;
  async function submit(event: FormEvent) { event.preventDefault(); setErrors({}); setSubmitting(true); try { await login(email, password); notify("Welcome to UNIVMAR."); navigate("/dashboard", { replace: true }); } catch (error) { const problem = error as RequestError; setErrors(problem.fields); notify(problem.message, "error"); } finally { setSubmitting(false); } }
  return <main className="grid min-h-screen bg-[#faf7f2] lg:grid-cols-[1.1fr_0.9fr]"><section className="hidden bg-black p-12 text-white lg:flex lg:flex-col"><p className="text-lg font-semibold tracking-[0.18em]">UNIVMAR</p><div className="my-auto max-w-md"><p className="text-[10px] font-bold tracking-[0.16em] text-[#dbb882]">STONE COMPANY MANAGEMENT</p><h1 className="mt-5 font-serif text-5xl leading-tight">One place for the work behind remarkable stone.</h1><p className="mt-6 text-sm leading-6 text-white/60">A secure workspace for your catalogue, inventory, customers, orders, and deliveries.</p></div><p className="text-xs text-white/35">Phase 0 · Project foundation</p></section><section className="grid place-items-center p-6 sm:p-10"><form onSubmit={submit} className="w-full max-w-sm"><p className="text-[10px] font-extrabold tracking-[0.16em] text-[#a8804c]">ADMIN WORKSPACE</p><h2 className="mt-2 font-serif text-4xl tracking-tight">Sign in</h2><p className="mt-2 text-sm leading-6 text-[#6b6560]">Use the administrator account configured for this environment.</p><div className="mt-8 grid gap-4"><TextField label="Email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} error={errors.email} placeholder="admin@univmar.local" required /><TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} error={errors.password} required /><Button type="submit" loading={submitting} className="mt-2 w-full">Sign in</Button></div></form></section></main>;
}

const navigation = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard }, { label: "Catalog", to: "/catalog", icon: Package }, { label: "Inventory", to: "/inventory", icon: Boxes }, { label: "Customers", to: "/customers", icon: Users }, { label: "Suppliers", to: "/suppliers", icon: Handshake }, { label: "Sales", to: "/sales", icon: FileText }, { label: "Orders", to: "/orders", icon: ClipboardList }, { label: "Deliveries", to: "/deliveries", icon: Truck },
];
function NavigationItem({ label, to, Icon, closeMenu }: { label: string; to: string; Icon: typeof LayoutDashboard; closeMenu: () => void }) {
  const { path, navigate } = useRouter(); const active = path === to;
  return <button type="button" onClick={() => { navigate(to); closeMenu(); }} className={`flex h-10 items-center gap-3 rounded-md px-3 text-left text-[13px] font-medium transition-colors ${active ? "bg-[#c9a46e]/20 text-white ring-1 ring-inset ring-[#dbb882]/30" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon size={17} />{label}</button>;
}
function ProtectedLayout() {
  const { user, loading, logout } = useAuth(); const { path, navigate } = useRouter(); const [menuOpen, setMenuOpen] = useState(false);
  if (loading) return <main className="grid min-h-screen place-items-center bg-[#faf7f2] text-sm text-[#6b6560]">Loading workspace…</main>;
  if (!user) return <Redirect to="/login" />;
  const current = navigation.find(item => item.to === path); const title = current?.label ?? "Dashboard"; const closeMenu = () => setMenuOpen(false);
  const sideContent = <><div className="flex h-16 items-center border-b border-white/10 px-3"><span className="text-lg font-semibold tracking-[0.18em]">UNIVMAR</span><button type="button" className="ml-auto p-2 lg:hidden" onClick={closeMenu} aria-label="Close navigation"><X size={18} /></button></div><p className="mb-3 mt-6 px-3 text-[10px] font-bold tracking-[0.16em] text-white/40">WORKSPACE</p><nav className="grid gap-1">{navigation.map(({ label, to, icon: Icon }) => <NavigationItem key={to} label={label} to={to} Icon={Icon} closeMenu={closeMenu} />)}</nav><div className="mt-auto border-t border-white/10 p-3"><p className="truncate text-xs font-medium text-white/80">{user.email}</p><p className="mt-1 text-[10px] tracking-wider text-white/40">{user.role.replaceAll("_", " ")}</p><button onClick={() => { logout(); navigate("/login"); }} className="mt-4 flex items-center gap-2 text-xs text-white/60 hover:text-white"><LogOut size={15} /> Sign out</button></div></>;
  return <div className="min-h-screen bg-[#faf7f2] text-black"><aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col bg-black px-3 py-5 text-white lg:flex">{sideContent}</aside>{menuOpen && <><button aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={closeMenu} /><aside className="fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-black px-3 py-5 text-white lg:hidden">{sideContent}</aside></>}<main className="min-h-screen lg:ml-[272px]"><header className="flex h-[68px] items-center border-b border-[#e4ddd2] bg-[#faf7f2] px-4 md:px-8"><button type="button" aria-label="Open navigation" className="mr-3 rounded-md p-2 text-[#6b6560] lg:hidden" onClick={() => setMenuOpen(true)}><Menu size={19} /></button><div className="hidden items-center gap-2 text-xs text-[#7a736c] sm:flex"><span>Workspace</span><ChevronRight size={14} /><b className="font-semibold text-black">{title}</b></div><button type="button" aria-label="Notifications" className="ml-auto rounded-md p-2 text-[#6b6560]"><Bell size={18} /></button><span className="ml-3 grid size-8 place-items-center rounded-full bg-[#c9a46e] text-xs font-bold text-black">{user.email[0]?.toUpperCase()}</span></header>{path === "/dashboard" || !current ? <Dashboard /> : <Placeholder title={title} />}</main></div>;
}
function Dashboard() { return <section className="mx-auto max-w-[1520px] px-4 py-8 md:px-8 md:py-10"><p className="text-[10px] font-extrabold tracking-[0.16em] text-[#a8804c]">UNIVMAR PLATFORM</p><h1 className="mt-2 font-serif text-3xl tracking-tight md:text-[38px]">Dashboard</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#6b6560]">Your foundation is connected. Business indicators arrive as their phases are delivered.</p><div className="mt-8 grid gap-5 md:grid-cols-3">{[["System status", "API authentication and protected routes are ready."], ["Next feature", "Build the Stone Catalog in Phase 1."], ["Workspace", "Use the sidebar to preview each planned area."]].map(([title, detail]) => <article key={title} className="min-h-40 rounded-lg border border-[#e4ddd2] bg-white p-5 shadow-sm"><h2 className="text-sm font-semibold text-black">{title}</h2><p className="mt-4 text-sm leading-6 text-[#6b6560]">{detail}</p></article>)}</div></section>; }
function Placeholder({ title }: { title: string }) { return <section className="mx-auto max-w-[1520px] px-4 py-8 md:px-8 md:py-10"><p className="text-[10px] font-extrabold tracking-[0.16em] text-[#a8804c]">PLANNED WORKSPACE</p><h1 className="mt-2 font-serif text-3xl tracking-tight md:text-[38px]">{title}</h1><div className="mt-8 max-w-3xl"><DataTable><thead className="border-b border-[#e4ddd2] bg-[#fcfaf7] text-xs uppercase tracking-wider text-[#7a736c]"><tr><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Availability</th></tr></thead><tbody><tr><td className="px-5 py-5 font-medium">Coming in a future roadmap phase</td><td className="px-5 py-5 text-[#6b6560]">The navigation and protected route are ready.</td></tr></tbody></DataTable></div></section>; }
function App() { const { path } = useRouter(); return <AuthProvider><ToastProvider>{path === "/login" ? <Login /> : <ProtectedLayout />}</ToastProvider></AuthProvider>; }
function Root() { return <RouterProvider><App /></RouterProvider>; }
createRoot(document.getElementById("root")!).render(<Root />);

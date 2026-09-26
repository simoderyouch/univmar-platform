import { useEffect, useMemo, useState, type FormEvent } from "react";
import { KeyRound, Plus, ShieldAlert, ShieldCheck, UserRoundCheck, UserRoundX } from "lucide-react";
import { api, RequestError } from "../../../shared/api/client";
import { Button, DataTable } from "../../../shared/ui";
import { Modal } from "../../../shared/ui/modal";
import { TextField } from "../../../shared/ui/text-field";
import { useAuth } from "../../auth/AuthProvider";
import { roleLabel, type WorkspaceRole } from "../../auth/permissions";

type StaffUser = { id: string; email: string; role: WorkspaceRole; active: boolean; createdAt: string; updatedAt: string };
type AccessDenial = { id: string; eventType: string; message: string; actor: string; occurredAt: string };
type PendingChange = { user: StaffUser; role?: WorkspaceRole; active?: boolean };

const roles: WorkspaceRole[] = ["ADMIN", "MANAGER", "SALES_AGENT", "INVENTORY_MANAGER", "PURCHASING_MANAGER"];
const roleNotes: Record<WorkspaceRole, string> = {
  ADMIN: "Full system control, financial records, catalogue and staff access.",
  MANAGER: "Operational oversight across all ERP modules and finance.",
  SALES_AGENT: "Customers, projects, RFQs, quotations and orders they own.",
  INVENTORY_MANAGER: "Stock, workshop, labels, fabrication and deliveries.",
  PURCHASING_MANAGER: "Suppliers, purchase orders and supplier receipts.",
};

function RolePill({ role }: { role: WorkspaceRole }) { return <span className="inline-flex rounded-full bg-[#f4ece8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#765847]">{roleLabel(role)}</span>; }
function date(value: string) { return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [denials, setDenials] = useState<AccessDenial[]>([]);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [resetUser, setResetUser] = useState<StaffUser | null>(null);
  const load = () => Promise.all([api<StaffUser[]>("/users"), api<AccessDenial[]>("/activity/access-denials")])
    .then(([staff, blocked]) => { setUsers(staff); setDenials(blocked); })
    .catch((reason: RequestError) => setError(reason.message));
  useEffect(() => { void load(); }, []);
  const activeAdmins = useMemo(() => users.filter(item => item.active && item.role === "ADMIN").length, [users]);

  async function confirmChange() {
    if (!pending) return;
    setError("");
    try {
      const changed = pending.role
        ? await api<StaffUser>(`/users/${pending.user.id}/role`, { method: "PATCH", body: JSON.stringify({ role: pending.role }) })
        : await api<StaffUser>(`/users/${pending.user.id}/active`, { method: "PATCH", body: JSON.stringify({ active: pending.active }) });
      setUsers(current => current.map(item => item.id === changed.id ? changed : item));
      setPending(null);
    } catch (reason) { setError((reason as RequestError).message); }
  }

  return <section className="mx-auto max-w-7xl px-4 py-7 sm:px-7">
    <header className="flex flex-wrap items-end justify-between gap-5 border-b border-[#d8ccc4] pb-6">
      <div><p className="text-[10px] font-bold tracking-[.18em] text-[#765847]">WORKSPACE SECURITY</p><h1 className="mt-2 font-sans text-4xl tracking-tight text-[#21140f]">People & access</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#786961]">Create staff accounts, assign the minimum role needed for the work, and review blocked requests.</p></div>
      <Button onClick={() => setCreateOpen(true)}><Plus size={16} /> Add staff member</Button>
    </header>
    {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
    <section className="mt-6 grid gap-3 lg:grid-cols-5">{roles.map(role => <article key={role} className="rounded-xl border border-[#e3d8d1] bg-[#fdfbf9] p-4"><RolePill role={role} /><p className="mt-3 text-xs leading-5 text-[#786961]">{roleNotes[role]}</p></article>)}</section>
    <section className="mt-6 overflow-hidden rounded-xl border border-[#e3d8d1] bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-[#eee6e1] px-5 py-4"><div><h2 className="font-sans text-xl text-[#21140f]">Staff accounts</h2><p className="mt-1 text-xs text-[#786961]">Role changes apply to the user’s next API request. Password resets sign the staff member out everywhere.</p></div><span className="text-xs font-semibold text-[#786961]">{users.filter(item => item.active).length} active</span></div>
      <DataTable><thead className="bg-[#faf7f5] text-[10px] font-bold tracking-[.14em] text-[#806f65]"><tr><th className="px-5 py-3 text-left">Staff member</th><th className="px-5 py-3 text-left">Role</th><th className="px-5 py-3 text-left">Access</th><th className="px-5 py-3 text-right">Manage</th></tr></thead><tbody>{users.map(item => {
        const self = item.id === currentUser?.id;
        const lastAdmin = item.active && item.role === "ADMIN" && activeAdmins === 1;
        return <tr key={item.id} className="border-t border-[#f0e8e4]"><td className="px-5 py-4"><p className="font-medium text-[#291711]">{item.email}</p><p className="mt-1 text-xs text-[#89786e]">Added {date(item.createdAt)}</p></td><td className="px-5 py-4"><RolePill role={item.role} /></td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 text-sm font-medium ${item.active ? "text-emerald-700" : "text-[#89786e]"}`}>{item.active ? <UserRoundCheck size={16} /> : <UserRoundX size={16} />}{item.active ? "Active" : "Inactive"}</span></td><td className="px-5 py-4 text-right"><div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={() => setResetUser(item)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#d8ccc4] px-2.5 text-xs font-semibold text-[#5f483c] transition hover:border-[#a4764d]"><KeyRound size={14} /> Reset password</button>{!self && <><select aria-label={`Change role for ${item.email}`} value={item.role} onChange={event => { const role = event.target.value as WorkspaceRole; if (role !== item.role) setPending({ user: item, role }); }} className="h-9 rounded-md border border-[#d8ccc4] bg-white px-2 text-xs font-medium text-[#47342b] outline-none focus:border-[#110703]">{roles.map(role => <option key={role} value={role}>{roleLabel(role)}</option>)}</select><button type="button" disabled={lastAdmin} title={lastAdmin ? "At least one active administrator must remain." : undefined} onClick={() => setPending({ user: item, active: !item.active })} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#d8ccc4] px-2.5 text-xs font-semibold text-[#5f483c] transition hover:border-[#a4764d] disabled:cursor-not-allowed disabled:opacity-45">{item.active ? <><UserRoundX size={14} /> Deactivate</> : <><UserRoundCheck size={14} /> Activate</>}</button></>}</div></td></tr>;
      })}</tbody></DataTable>
    </section>
    <section className="mt-6 rounded-xl border border-[#e3d8d1] bg-white"><div className="flex items-center gap-3 border-b border-[#eee6e1] px-5 py-4"><span className="grid size-9 place-items-center rounded-md bg-[#fbefed] text-[#a84b3e]"><ShieldAlert size={18} /></span><div><h2 className="font-sans text-xl text-[#21140f]">Blocked access attempts</h2><p className="mt-0.5 text-xs text-[#786961]">The latest 100 server-side permission denials.</p></div></div>{denials.length ? <div className="divide-y divide-[#f0e8e4]">{denials.slice(0, 8).map(item => <div key={item.id} className="grid gap-1 px-5 py-3 sm:grid-cols-[minmax(0,1fr)_auto]"><p className="text-sm text-[#47342b]"><span className="font-semibold">{item.actor}</span><span className="px-1.5 text-[#b4a49a]">·</span>{item.message}</p><time className="text-xs text-[#89786e]">{date(item.occurredAt)}</time></div>)}</div> : <p className="px-5 py-8 text-sm text-[#786961]">No blocked access attempts have been recorded.</p>}</section>
    {createOpen && <CreateUser onClose={() => setCreateOpen(false)} onCreated={created => { setUsers(current => [...current, created].sort((a, b) => a.email.localeCompare(b.email))); setCreateOpen(false); }} onError={setError} />}
    {resetUser && <ResetPassword user={resetUser} onClose={() => setResetUser(null)} onReset={() => setResetUser(null)} onError={setError} />}
    {pending && <Modal title={pending.role ? "Confirm role change" : pending.active ? "Activate staff account" : "Deactivate staff account"} onClose={() => setPending(null)}><div className="mt-2 flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#f4ece8] text-[#765847]"><ShieldCheck size={19} /></span><p className="text-sm leading-6 text-[#5f483c]">{pending.role ? `Change ${pending.user.email} from ${roleLabel(pending.user.role)} to ${roleLabel(pending.role)}?` : `${pending.active ? "Restore" : "Remove"} ${pending.user.email}’s access to the workspace?`}</p></div><div className="mt-6 flex justify-end gap-3"><Button type="button" className="bg-white text-[#25302a] ring-1 ring-[#dacfc8] hover:bg-[#f8f3f0]" onClick={() => setPending(null)}>Cancel</Button><Button type="button" onClick={() => void confirmChange()}>Confirm change</Button></div></Modal>}
  </section>;
}

function CreateUser({ onClose, onCreated, onError }: { onClose: () => void; onCreated: (user: StaffUser) => void; onError: (message: string) => void }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [role, setRole] = useState<WorkspaceRole>("SALES_AGENT"); const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); try { onCreated(await api<StaffUser>("/users", { method: "POST", body: JSON.stringify({ email, password, role }) })); } catch (reason) { onError((reason as RequestError).message); } finally { setSaving(false); } }
  return <Modal title="Add staff member" onClose={onClose}><p className="mt-1 text-sm leading-6 text-[#786961]">Create a named account with only the access required for that person’s work.</p><form className="mt-5 grid gap-4" onSubmit={submit}><TextField label="Work email" type="email" value={email} onChange={event => setEmail(event.target.value)} required /><div><TextField label="Temporary password" type="password" minLength={12} value={password} onChange={event => setPassword(event.target.value)} required /><p className="mt-1.5 text-xs text-[#786961]">At least 12 characters.</p></div><label className="grid gap-1.5 text-sm font-medium text-[#47342b]">Role<select value={role} onChange={event => setRole(event.target.value as WorkspaceRole)} className="h-10 rounded-md border border-[#d8ccc4] bg-white px-3 text-sm outline-none focus:border-[#110703]">{roles.map(item => <option key={item} value={item}>{roleLabel(item)}</option>)}</select></label><p className="rounded-md bg-[#faf7f5] px-3 py-2 text-xs leading-5 text-[#786961]"><KeyRound size={14} className="mr-1 inline" />{roleNotes[role]}</p><div className="mt-2 flex justify-end gap-3"><Button type="button" className="bg-white text-[#25302a] ring-1 ring-[#dacfc8] hover:bg-[#f8f3f0]" onClick={onClose}>Cancel</Button><Button type="submit" loading={saving}>Create account</Button></div></form></Modal>;
}

function ResetPassword({ user, onClose, onReset, onError }: { user: StaffUser; onClose: () => void; onReset: () => void; onError: (message: string) => void }) {
  const [password, setPassword] = useState(""); const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); try { await api<StaffUser>(`/users/${user.id}/password`, { method: "PATCH", body: JSON.stringify({ password }) }); onReset(); } catch (reason) { onError((reason as RequestError).message); } finally { setSaving(false); } }
  return <Modal title="Reset staff password" onClose={onClose}><div className="mt-1 rounded-md bg-[#faf7f5] px-3 py-2.5 text-sm leading-6 text-[#5f483c]"><KeyRound size={15} className="mr-1.5 inline text-[#765847]" />Set a new temporary password for <strong>{user.email}</strong>. Their current sessions will be signed out.</div><form className="mt-5 grid gap-4" onSubmit={submit}><div><TextField label="New temporary password" type="password" minLength={12} value={password} onChange={event => setPassword(event.target.value)} required autoFocus /><p className="mt-1.5 text-xs text-[#786961]">Use at least 12 characters, then give it to the staff member through a secure channel.</p></div><div className="mt-2 flex justify-end gap-3"><Button type="button" className="bg-white text-[#25302a] ring-1 ring-[#dacfc8] hover:bg-[#f8f3f0]" onClick={onClose}>Cancel</Button><Button type="submit" loading={saving}><KeyRound size={16} /> Reset password</Button></div></form></Modal>;
}

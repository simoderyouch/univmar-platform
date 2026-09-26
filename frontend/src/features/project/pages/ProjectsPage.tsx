import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Pencil,
  ImagePlus,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { api, resolveImageUrl, uploadImage } from "../../../shared/api/client";
import { Button, DataTable, PaginationControls } from "../../../shared/ui";
import { useRouter } from "../../../app/providers/router";

type Customer = { id: string; name: string };
type ProjectStatus = "LEAD" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
type Project = {
  id: string;
  customerId: string;
  customerName: string;
  name: string;
  location?: string;
  projectType?: string;
  description?: string;
  estimatedValue?: number;
  startDate?: string;
  requiredDeliveryDate?: string;
  assignedSalesAgent?: string;
  status: ProjectStatus;
  notes?: string;
  images: ProjectImage[];
};
type ProjectImage = { id: string; imageUrl: string; caption?: string; position: number; createdAt: string };
type ProjectFormData = Omit<Project, "id" | "customerName" | "images">;
type ProjectPageResponse = { content: Project[]; page: number; totalPages: number; totalElements: number };

const field =
  "mt-1 h-10 w-full rounded-md border border-[#d8ccc4] bg-white px-3 text-sm outline-none focus:border-[#110703]";
const textarea =
  "mt-1 min-h-24 w-full rounded-md border border-[#d8ccc4] bg-white p-3 text-sm outline-none focus:border-[#110703]";
const statuses: ProjectStatus[] = [
  "LEAD",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
];
const emptyForm = (): ProjectFormData => ({
  customerId: "",
  name: "",
  location: "",
  projectType: "",
  description: "",
  estimatedValue: undefined,
  startDate: "",
  requiredDeliveryDate: "",
  assignedSalesAgent: "",
  status: "LEAD",
  notes: "",
});
function toPayload(form: ProjectFormData) {
  return {
    ...form,
    location: form.location || null,
    projectType: form.projectType || null,
    description: form.description || null,
    estimatedValue: form.estimatedValue ?? null,
    startDate: form.startDate || null,
    requiredDeliveryDate: form.requiredDeliveryDate || null,
    assignedSalesAgent: form.assignedSalesAgent || null,
    notes: form.notes || null,
  };
}
function dateValue(value?: string) {
  return value?.slice(0, 10) ?? "";
}
function money(value?: number) {
  return value == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MAD",
      }).format(value);
}
function statusLabel(value: ProjectStatus) {
  return value.replaceAll("_", " ");
}

export function ProjectsPage() {
  const { path, navigate } = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [screen, setScreen] = useState<"list" | "create" | "detail" | "edit">(
    "list",
  );
  const [detail, setDetail] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | ProjectStatus>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState<ProjectPageResponse>({ content: [], page: 0, totalPages: 0, totalElements: 0 });
  async function load(nextPage = page) {
    const query = new URLSearchParams({ size: "20", page: String(nextPage) });
    if (search.trim()) query.set("search", search.trim());
    if (status) query.set("status", status);
    setLoading(true);
    setError("");
    try {
      const result = await api<ProjectPageResponse>(`/projects?${query}`);
      setProjects(result.content);
      setPageData(result);
      setPage(result.page);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Projects could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load(0);
  }, [search, status]);
  useEffect(() => {
    void api<{ content: Customer[] }>("/customers?size=20").then((page) =>
      setCustomers(page.content),
    );
  }, []);
  async function openDetail(id: string) {
    if (path !== `/projects/${id}`) {
      navigate(`/projects/${id}`);
      return;
    }
    const project = await api<Project>(`/projects/${id}`);
    setDetail(project);
    setScreen("detail");
  }
  useEffect(() => {
    const match = path.match(/^\/projects\/([^/]+)$/);
    if (!match) return;
    void openDetail(match[1]);
  }, [path]);
  if (screen === "create" || (screen === "edit" && detail))
    return (
      <ProjectForm
        title={screen === "create" ? "New project" : `Edit ${detail!.name}`}
        customers={customers}
        initial={screen === "edit" ? detail! : undefined}
        back={() => setScreen(screen === "edit" ? "detail" : "list")}
        saved={async (project) => {
          setDetail(project);
          await load();
          setScreen("detail");
        }}
      />
    );
  if (screen === "detail" && detail)
    return (
      <ProjectDetail
        project={detail}
        back={() => {
          setScreen("list");
          navigate("/projects");
          void load();
        }}
        edit={() => setScreen("edit")}
        remove={async () => {
          if (!window.confirm(`Delete ${detail.name}? This cannot be undone.`)) return;
          try {
            await api(`/projects/${detail.id}`, { method: "DELETE" });
            setDetail(null);
            setScreen("list");
            navigate("/projects");
            await load(0);
          } catch (reason) {
            window.alert(
              reason instanceof Error
                ? reason.message
                : "The project could not be deleted.",
            );
          }
        }}
        reload={async () => setDetail(await api<Project>(`/projects/${detail.id}`))}
      />
    );
  return (
    <section className="mx-auto max-w-6xl px-4 py-7 sm:px-7">
      <header className="flex flex-col gap-4 border-b border-[#dfd4cd] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[.18em] text-[#765847]">
            PROJECT PORTFOLIO
          </p>
          <h1 className="mt-2 font-sans text-4xl">Projects</h1>
        </div>
        <Button onClick={() => setScreen("create")}>
          <Plus size={16} />
          Create project
        </Button>
      </header>

        <div className="flex mt-5 flex-col gap-2 sm:flex-row">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-md border border-[#d8ccc4] px-3 text-[#75665d] transition ">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a6988f]"
              placeholder="Search projects"
              aria-label="Search projects"
            />
          </label>
          <label className="flex h-11 items-center gap-2 rounded-md border border-[#d8ccc4] px-3 text-[#75665d] transition focus-within:border-[#110703] sm:w-52">
            <SlidersHorizontal size={16} />
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as "" | ProjectStatus)
              }
              className="min-w-0 flex-1 bg-transparent text-sm text-[#21140f] outline-none"
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {statusLabel(item)}
                </option>
              ))}
            </select>
          </label>
        </div>
      <div className="mt-5 overflow-hidden rounded-xl border border-[#e3d8d1] bg-white">
        {error ? (
          <div className="px-5 py-10 text-center text-sm text-red-700">
            <p>{error}</p>
            <Button
              className="mt-4"
              size="sm"
              variant="outline"
              onClick={() => void load()}
            >
              Try again
            </Button>
          </div>
        ) : loading ? (
          <p className="px-5 py-12 text-center text-sm text-[#786961]">
            Loading projects…
          </p>
        ) : (
          <>
            <DataTable>
              <thead className="bg-[#faf7f5] text-xs">
                <tr>
                  <th className="px-5 py-3">Project</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Value</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => void openDetail(item.id)}
                    className="cursor-pointer border-t border-[#f0e8e4] hover:bg-[#fdfaf8]"
                  >
                    <td className="px-5 py-4 font-semibold">{item.name}</td>
                    <td className="px-5 py-4 text-sm">{item.customerName}</td>
                    <td className="px-5 py-4 text-sm">
                      {item.projectType ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {money(item.estimatedValue)}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold tracking-wide">
                      {statusLabel(item.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            {!projects.length && (
              <p className="px-5 py-12 text-center text-sm text-[#786961]">
                No projects match this view.
              </p>
            )}
          </>
        )}
      </div>
      <PaginationControls page={page} totalPages={pageData.totalPages} totalElements={pageData.totalElements} itemCount={projects.length} loading={loading} onPageChange={nextPage => void load(nextPage)} noun="projects" />
    </section>
  );
}

function ProjectForm({
  title,
  customers,
  initial,
  back,
  saved,
}: {
  title: string;
  customers: Customer[];
  initial?: Project;
  back: () => void;
  saved: (project: Project) => Promise<void>;
}) {
  const [form, setForm] = useState<ProjectFormData>(() =>
    initial ? (() => {
          const { id: _id, customerName: _customerName, images: _images, ...project } = initial;
          return {
          ...project,
          startDate: dateValue(initial.startDate),
          requiredDeliveryDate: dateValue(initial.requiredDeliveryDate),
          };
        })()
      : emptyForm(),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const change = <K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K],
  ) => setForm((current) => ({ ...current, [key]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const project = await api<Project>(
        initial ? `/projects/${initial.id}` : "/projects",
        {
          method: initial ? "PUT" : "POST",
          body: JSON.stringify(toPayload(form)),
        },
      );
      await saved(project);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "The project could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <section className="mx-auto max-w-4xl px-4 py-7 sm:px-7">
      <button
        onClick={back}
        className="inline-flex items-center gap-2 text-sm text-[#4b3328]"
      >
        <ArrowLeft size={16} />
        Projects
      </button>
      <form
        onSubmit={submit}
        className="mt-5 rounded-xl border border-[#e3d8d1] bg-white p-5 sm:p-7"
      >
        <h1 className="font-sans text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-[#786961]">
          Keep the commercial, delivery, and ownership information together.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium">
            Customer
            <select
              required
              value={form.customerId}
              onChange={(event) => change("customerId", event.target.value)}
              className={field}
            >
              <option value="">Select a customer</option>
              {customers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Project name
            <input
              required
              value={form.name}
              onChange={(event) => change("name", event.target.value)}
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Location
            <input
              value={form.location ?? ""}
              onChange={(event) => change("location", event.target.value)}
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Project type
            <input
              value={form.projectType ?? ""}
              onChange={(event) => change("projectType", event.target.value)}
              className={field}
              placeholder="Residential, hospitality…"
            />
          </label>
          <label className="text-sm font-medium">
            Estimated value (MAD)
            <input
              min="0"
              step="0.01"
              type="number"
              value={form.estimatedValue ?? ""}
              onChange={(event) =>
                change(
                  "estimatedValue",
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
                )
              }
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Status
            <select
              value={form.status}
              onChange={(event) =>
                change("status", event.target.value as ProjectStatus)
              }
              className={field}
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {statusLabel(item)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Start date
            <input
              type="date"
              value={form.startDate ?? ""}
              onChange={(event) => change("startDate", event.target.value)}
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Required delivery date
            <input
              type="date"
              value={form.requiredDeliveryDate ?? ""}
              onChange={(event) =>
                change("requiredDeliveryDate", event.target.value)
              }
              className={field}
            />
          </label>
          <label className="text-sm font-medium md:col-span-2">
            Assigned sales agent
            <input
              value={form.assignedSalesAgent ?? ""}
              onChange={(event) =>
                change("assignedSalesAgent", event.target.value)
              }
              className={field}
            />
          </label>
          <label className="text-sm font-medium md:col-span-2">
            Description
            <textarea
              value={form.description ?? ""}
              onChange={(event) => change("description", event.target.value)}
              className={textarea}
            />
          </label>
          <label className="text-sm font-medium md:col-span-2">
            Internal notes
            <textarea
              value={form.notes ?? ""}
              onChange={(event) => change("notes", event.target.value)}
              className={textarea}
            />
          </label>
        </div>
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={back}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {initial ? "Save changes" : "Create project"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function ProjectDetail({
  project,
  back,
  edit,
  remove,
  reload,
}: {
  project: Project;
  back: () => void;
  edit: () => void;
  remove: () => void;
  reload: () => Promise<void>;
}) {
  const [tab, setTab] = useState("Overview");
  const tabs = [
    "Overview",
    "Materials",
    "RFQs",
    "Quotations",
    "Orders",
    "Deliveries",
    "Documents",
    "Realization photos",
  ];
  return (
    <section className="mx-auto max-w-5xl px-4 py-7 sm:px-7">
      <button
        onClick={back}
        className="inline-flex items-center gap-2 text-sm text-[#4b3328]"
      >
        <ArrowLeft size={16} />
        Projects
      </button>
      <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-[10px] font-bold tracking-[.18em] text-[#765847]">
            {statusLabel(project.status)}
          </p>
          <h1 className="mt-2 font-sans text-4xl">{project.name}</h1>
          <p className="mt-2 text-sm text-[#786961]">
            {project.customerName}
            {project.location ? ` · ${project.location}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={edit}>
            <Pencil size={16} />
            Edit project
          </Button>
          <Button
            variant="outline"
            onClick={remove}
            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
          >
            <Trash2 size={16} />
            Delete project
          </Button>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 border-b border-[#e3d8d1]">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-3 py-2 text-sm ${tab === item ? "border-b-2 border-[#110703] font-semibold" : "text-[#786961]"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <section className="mt-5 rounded-xl border border-[#e3d8d1] bg-white p-6">
        {tab === "Overview" ? (
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <Info label="Customer" value={project.customerName} />
            <Info label="Status" value={statusLabel(project.status)} />
            <Info label="Project type" value={project.projectType} />
            <Info
              label="Estimated value"
              value={money(project.estimatedValue)}
            />
            <Info label="Location" value={project.location} />
            <Info
              label="Assigned sales agent"
              value={project.assignedSalesAgent}
            />
            <Info label="Start date" value={project.startDate} />
            <Info
              label="Required delivery"
              value={project.requiredDeliveryDate}
            />
            <Info label="Description" value={project.description} wide />
            <Info label="Internal notes" value={project.notes} wide />
          </dl>
        ) : tab === "Realization photos" ? (
          <ProjectGallery project={project} reload={reload} />
        ) : (
          <p className="py-10 text-center text-sm text-[#786961]">
            No {tab.toLowerCase()} are linked to this project yet.
          </p>
        )}
      </section>
    </section>
  );
}

function ProjectGallery({ project, reload }: { project: Project; reload: () => Promise<void> }) {
  const input = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function add(file?: File) {
    if (!file) return;
    setSaving(true);
    setError("");
    try {
      const imageUrl = await uploadImage(file);
      await api(`/projects/${project.id}/images`, { method: "POST", body: JSON.stringify({ imageUrl, caption: caption || null }) });
      setCaption("");
      if (input.current) input.current.value = "";
      await reload();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The realization photo could not be saved.");
    } finally { setSaving(false); }
  }
  async function remove(imageId: string) {
    setSaving(true);
    setError("");
    try { await api(`/projects/${project.id}/images/${imageId}`, { method: "DELETE" }); await reload(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "The photo could not be removed."); }
    finally { setSaving(false); }
  }
  return <div>
    <div className="flex flex-col gap-3 rounded-lg border border-dashed border-[#cdbdb2] bg-[#fcf9f7] p-4 sm:flex-row sm:items-end">
      <label className="min-w-0 flex-1 text-sm font-medium">Photo caption (optional)<input value={caption} onChange={event => setCaption(event.target.value)} maxLength={240} className={field} placeholder="Kitchen installation, finished lobby…" /></label>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => void add(event.target.files?.[0])} />
      <Button type="button" loading={saving} onClick={() => input.current?.click()}><ImagePlus size={16} />Add realization photo</Button>
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    {project.images.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{project.images.map(image => <figure key={image.id} className="overflow-hidden rounded-lg border border-[#e3d8d1] bg-[#fdfbf9]"><img src={resolveImageUrl(image.imageUrl)} alt={image.caption || `Realization photo for ${project.name}`} className="h-44 w-full object-cover" /><figcaption className="flex min-h-14 items-start justify-between gap-3 p-3 text-sm"><span>{image.caption || "Realization photo"}</span><button type="button" disabled={saving} onClick={() => void remove(image.id)} className="rounded p-1 text-[#8f3c31] hover:bg-red-50 disabled:opacity-50" aria-label="Remove realization photo"><Trash2 size={16} /></button></figcaption></figure>)}</div> : <p className="py-10 text-center text-sm text-[#786961]">No realization photos have been added yet.</p>}
  </div>;
}
function Info({
  label,
  value,
  wide = false,
}: {
  label: string;
  value?: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs font-semibold uppercase tracking-wider text-[#786961]">
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm">{value || "Not set"}</dd>
    </div>
  );
}

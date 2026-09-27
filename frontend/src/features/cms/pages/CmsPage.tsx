import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Archive,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  CheckCircle2,
  CircleAlert,
  Clipboard,
  Download,
  ExternalLink,
  Globe2,
  ImagePlus,
  Inbox,
  Mail,
  MailOpen,
  Phone,
  RefreshCw,
  Save,
  Search,
  Tag,
  Upload,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "../../auth/AuthProvider";
import { useRouter } from "../../../app/providers/router";
import {
  api,
  downloadProtectedFile,
  RequestError,
  resolveImageUrl,
  uploadImage,
} from "../../../shared/api/client";
import { Button } from "../../../shared/ui";

type Tab = "CATALOG" | "PORTFOLIO" | "FORM" | "DOCUMENTATION";
type Page<T> = {
  content: T[];
  page?: number;
  totalPages?: number;
  totalElements: number;
};
type Category = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  active: boolean;
  websiteVisible: boolean;
};
type PortfolioCategory = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  active: boolean;
};
type Project = { id: string; name: string };
type Portfolio = {
  id: string;
  projectId: string;
  projectName: string;
  categoryId: string;
  categoryName: string;
  published: boolean;
  featured: boolean;
  sortOrder: number;
  coverImageUrl: string;
  galleryImageUrls: string[];
  variantIds?: string[];
};
type CatalogMaterialForPortfolio = { id: string; name: string; variants: { id: string; variantName: string; thicknessMm: number }[] };
type Settings = {
  enabled: boolean;
  title: string;
  description: string;
  submitLabel: string;
  requireEmail: boolean;
  requirePhone: boolean;
};
type Submission = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  sourcePage?: string;
  utmSource?: string;
  utmCampaign?: string;
  status: "NEW" | "READ" | "ARCHIVED";
  notificationStatus: "PENDING" | "SENT" | "FAILED";
  qualifiedCustomerId?: string;
  qualifiedProjectId?: string;
  assignedToUserId?: string;
  assignedToEmail?: string;
  callOutcome?:
    | "UNCONTACTED"
    | "QUALIFIED"
    | "FOLLOW_UP"
    | "NOT_INTERESTED"
    | "INVALID";
  callNotes?: string;
  nextFollowUpAt?: string;
  attachments?: { id: string; documentUrl: string; originalFilename: string; contentType: string; fileSize: number }[];
  createdAt: string;
  updatedAt?: string;
};
type SalesUser = { id: string; email: string; role: string; active: boolean };

const field = "h-10 rounded-md border border-[#d8ccc4] bg-white px-3 text-sm";
const date = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
const makeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function CmsPage() {
  const [tab, setTab] = useState<Tab>("CATALOG");
  const labels: Record<Tab, string> = {
    CATALOG: "Catalog categories",
    PORTFOLIO: "Portfolio",
    FORM: "Contact form",
    DOCUMENTATION: "Developer guide",
  };
  return (
    <section className="mx-auto max-w-7xl px-4 py-7 sm:px-7">
      <header className="border-b border-[#d8ccc4] pb-6">
        <p className="text-[10px] font-bold tracking-[.18em] text-[#765847]">
          PUBLIC WEBSITE
        </p>
        <h1 className="mt-2 font-sans text-4xl tracking-tight text-[#21140f]">
          Website CMS
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#786961]">
          The landing keeps its design, copy, and translations. The ERP safely
          provides active product data, approved portfolio media, and the
          contact inbox.
        </p>
      </header>
      <nav className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(labels) as Tab[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${tab === item ? "bg-[#21140f] text-white" : "bg-[#f5f0ed] text-[#65564e]"}`}
          >
            {labels[item]}
          </button>
        ))}
      </nav>
      {tab === "CATALOG" ? (
        <CatalogCategories />
      ) : tab === "PORTFOLIO" ? (
        <PortfolioManager />
      ) : tab === "FORM" ? (
        <ContactForm />
      ) : (
        <DeveloperGuide />
      )}
    </section>
  );
}

function CatalogCategories() {
  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const empty = {
    name: "",
    slug: "",
    sortOrder: 7,
    active: true,
    websiteVisible: true,
  };
  const [draft, setDraft] = useState(empty);
  const load = () =>
    api<Category[]>("/material-categories")
      .then(setItems)
      .catch((cause: RequestError) => setError(cause.message));
  useEffect(() => {
    void load();
  }, []);
  const current = editing ?? draft;
  const update = (key: keyof typeof empty, value: string | boolean | number) =>
    editing
      ? setEditing((item) => (item ? { ...item, [key]: value } : item))
      : setDraft((item) => ({ ...item, [key]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = { ...current, slug: makeSlug(current.slug || current.name) };
      await api(
        editing ? `/material-categories/${editing.id}` : "/material-categories",
        { method: editing ? "PUT" : "POST", body: JSON.stringify(body) },
      );
      setEditing(null);
      setDraft({ ...empty, sortOrder: items.length + 1 });
      await load();
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
      <form
        onSubmit={submit}
        className="rounded-xl border border-[#e3d8d1] bg-white p-5"
      >
        <p className="text-[10px] font-bold tracking-[.16em] text-[#765847]">
          LANDING GROUP
        </p>
        <h2 className="mt-2 font-sans text-xl">
          {editing ? `Edit ${editing.name}` : "Add catalog category"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#786961]">
          All active materials in a public category are published automatically.
          There is no one-by-one product publishing.
        </p>
        <label className="mt-5 grid gap-1.5 text-sm font-medium">
          Name
          <input
            required
            value={current.name}
            onChange={(e) => update("name", e.target.value)}
            className={field}
          />
        </label>
        <label className="mt-4 grid gap-1.5 text-sm font-medium">
          URL key
          <input
            required
            value={current.slug}
            onChange={(e) => update("slug", e.target.value)}
            className={field}
            placeholder="pierre-naturelle"
          />
        </label>
        <label className="mt-4 grid gap-1.5 text-sm font-medium">
          Display order
          <input
            min="0"
            type="number"
            value={current.sortOrder}
            onChange={(e) => update("sortOrder", Number(e.target.value))}
            className={field}
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-5 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={current.active}
              onChange={(e) => update("active", e.target.checked)}
            />{" "}
            Active
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={current.websiteVisible}
              onChange={(e) => update("websiteVisible", e.target.checked)}
            />{" "}
            Publish to landing
          </label>
        </div>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        <div className="mt-5 flex gap-2">
          <Button type="submit" loading={saving}>
            <Save size={16} />
            {editing ? "Save category" : "Add category"}
          </Button>
          {editing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
      <section className="overflow-hidden rounded-xl border border-[#e3d8d1] bg-white">
        <header className="border-b border-[#eee6e1] px-5 py-4">
          <h2 className="font-sans text-xl">Catalog publication</h2>
          <p className="mt-1 text-xs text-[#786961]">
            These are editable ERP data records, served to the landing.
          </p>
        </header>
        <div className="divide-y divide-[#eee6e1]">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setEditing(item)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-[#fdfaf8]"
            >
              <span className="w-7 font-mono text-xs text-[#89786e]">
                {String(item.sortOrder).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#291711]">{item.name}</p>
                <p className="mt-1 text-xs text-[#786961]">/{item.slug}</p>
              </div>
              <span
                className={`rounded px-2 py-1 text-xs font-semibold ${item.websiteVisible ? "bg-emerald-50 text-emerald-700" : "bg-[#f3efeb] text-[#786961]"}`}
              >
                {item.websiteVisible ? "Public" : "Hidden"}
              </span>
            </button>
          ))}
          {!items.length && (
            <p className="px-5 py-12 text-center text-sm text-[#786961]">
              No catalog categories yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function PortfolioManager() {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [items, setItems] = useState<Portfolio[]>([]);
  const [catalogMaterials, setCatalogMaterials] = useState<CatalogMaterialForPortfolio[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [cover, setCover] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [form, setForm] = useState({
    projectId: "",
    categoryId: "",
    published: true,
    featured: false,
    sortOrder: 0,
    variantIds: [] as string[],
  });
  const coverInput = useRef<HTMLInputElement>(null);
  const load = () =>
    Promise.all([
      api<PortfolioCategory[]>("/cms/portfolio/categories"),
      api<Page<Project>>("/projects?size=100"),
      api<Portfolio[]>("/cms/portfolio"),
      api<Page<{ id: string }>>("/materials?size=100"),
    ])
      .then(async ([cats, projectPage, records, materialPage]) => {
        setCategories(cats);
        setProjects(projectPage.content);
        setItems(records);
        const materialDetails = await Promise.all(materialPage.content.map((material) => api<CatalogMaterialForPortfolio>(`/materials/${material.id}`)));
        setCatalogMaterials(materialDetails);
      })
      .catch((cause: RequestError) => setError(cause.message));
  useEffect(() => {
    void load();
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!cover) {
      setError("Choose a cover image.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const coverImageUrl = await uploadImage(cover);
      const galleryImageUrls = await Promise.all(gallery.map(uploadImage));
      await api("/cms/portfolio", {
        method: "POST",
        body: JSON.stringify({ ...form, coverImageUrl, galleryImageUrls }),
      });
      setForm({
        projectId: "",
        categoryId: "",
        published: true,
        featured: false,
        sortOrder: 0,
        variantIds: [],
      });
      setCover(null);
      setGallery([]);
      await load();
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setSaving(false);
    }
  }
  async function toggle(item: Portfolio) {
    try {
      await api(`/cms/portfolio/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({
          projectId: item.projectId,
          categoryId: item.categoryId,
          published: !item.published,
          featured: item.featured,
          sortOrder: item.sortOrder,
          coverImageUrl: item.coverImageUrl,
          galleryImageUrls: item.galleryImageUrls,
          variantIds: item.variantIds ?? [],
        }),
      });
      await load();
    } catch (cause) {
      setError((cause as Error).message);
    }
  }
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <form
        onSubmit={submit}
        className="rounded-xl border border-[#e3d8d1] bg-white p-5"
      >
        <p className="text-[10px] font-bold tracking-[.16em] text-[#765847]">
          APPROVED PUBLIC MEDIA
        </p>
        <h2 className="mt-2 font-sans text-xl">Add portfolio project</h2>
        <p className="mt-2 text-sm leading-6 text-[#786961]">
          Only ERP-uploaded images can be exposed. Private customer data,
          values, notes, and documents stay private.
        </p>
        <label className="mt-5 grid gap-1.5 text-sm font-medium">
          ERP project
          <select
            required
            value={form.projectId}
            onChange={(e) =>
              setForm((v) => ({ ...v, projectId: e.target.value }))
            }
            className={field}
          >
            <option value="">Choose project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 grid gap-1.5 text-sm font-medium">Materials used in this project <span className="text-xs font-normal text-[#786961]">These links appear on the matching public product pages.</span><select multiple value={form.variantIds} onChange={(event) => setForm((value) => ({ ...value, variantIds: Array.from(event.currentTarget.selectedOptions, (option) => option.value) }))} className={`${field} h-32`}>{catalogMaterials.flatMap((material) => material.variants.map((variant) => <option key={variant.id} value={variant.id}>{material.name} · {variant.variantName} · {variant.thicknessMm} mm</option>))}</select></label>
        <label className="mt-4 grid gap-1.5 text-sm font-medium">
          Portfolio category
          <select
            required
            value={form.categoryId}
            onChange={(e) =>
              setForm((v) => ({ ...v, categoryId: e.target.value }))
            }
            className={field}
          >
            <option value="">Choose category</option>
            {categories
              .filter((category) => category.active)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </label>
        <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-[#cdbdb2] p-3 text-sm font-medium hover:bg-[#faf7f5]">
          <input
            ref={coverInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => setCover(e.target.files?.[0] ?? null)}
          />
          <ImagePlus size={16} />
          {cover ? cover.name : "Choose cover image"}
        </label>
        <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-[#cdbdb2] p-3 text-sm font-medium hover:bg-[#faf7f5]">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={(e) => setGallery(Array.from(e.target.files ?? []))}
          />
          <Upload size={16} />
          {gallery.length
            ? `${gallery.length} gallery images selected`
            : "Choose gallery images"}
        </label>
        <div className="mt-4 flex flex-wrap gap-5 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm((v) => ({ ...v, published: e.target.checked }))
              }
            />{" "}
            Publish now
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm((v) => ({ ...v, featured: e.target.checked }))
              }
            />{" "}
            Featured
          </label>
        </div>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        <Button className="mt-5" type="submit" loading={saving}>
          <Globe2 size={16} />
          Add public project
        </Button>
      </form>
      <section className="overflow-hidden rounded-xl border border-[#e3d8d1] bg-white">
        <header className="border-b border-[#eee6e1] px-5 py-4">
          <h2 className="font-sans text-xl">Public portfolio</h2>
          <p className="mt-1 text-xs text-[#786961]">
            Each card has a cover and optional gallery.
          </p>
        </header>
        <div className="divide-y divide-[#eee6e1]">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex items-center gap-4 px-5 py-4"
            >
              <img
                src={resolveImageUrl(item.coverImageUrl)}
                alt=""
                className="size-12 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[#291711]">
                  {item.projectName}
                </p>
                <p className="mt-1 text-xs text-[#786961]">
                  {item.categoryName} · {item.galleryImageUrls.length} gallery
                  images
                </p>
              </div>
              <button
                type="button"
                onClick={() => void toggle(item)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${item.published ? "bg-emerald-50 text-emerald-700" : "bg-[#f3efeb] text-[#786961]"}`}
              >
                {item.published ? "Published" : "Hidden"}
              </button>
            </article>
          ))}
          {!items.length && (
            <p className="px-5 py-12 text-center text-sm text-[#786961]">
              No portfolio projects added.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState<Settings>({
    enabled: true,
    title: "",
    description: "",
    submitLabel: "",
    requireEmail: false,
    requirePhone: false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    void api<Settings>("/cms/contact-form")
      .then(setForm)
      .catch((cause: RequestError) => setError(cause.message));
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      setForm(
        await api<Settings>("/cms/contact-form", {
          method: "PUT",
          body: JSON.stringify(form),
        }),
      );
    } catch (cause) {
      setError((cause as RequestError).message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="mt-6 max-w-3xl rounded-xl border border-[#e3d8d1] bg-white p-5"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-[#f4ece8] text-[#765847]">
          <Mail size={19} />
        </span>
        <div>
          <h2 className="font-sans text-xl text-[#21140f]">
            Landing contact form
          </h2>
          <p className="mt-1 text-xs text-[#786961]">
            Fallback configuration and validation rules only.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                enabled: event.target.checked,
              }))
            }
          />{" "}
          Accept new submissions
        </label>
        <Text
          label="Fallback title"
          value={form.title}
          onChange={(value) =>
            setForm((current) => ({ ...current, title: value }))
          }
        />
        <label className="grid gap-1.5 text-sm font-medium">
          Fallback description
          <textarea
            required
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            className="min-h-24 rounded-md border border-[#d8ccc4] p-3 text-sm"
          />
        </label>
        <Text
          label="Fallback submit label"
          value={form.submitLabel}
          onChange={(value) =>
            setForm((current) => ({ ...current, submitLabel: value }))
          }
        />
        <div className="flex gap-5 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.requireEmail}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  requireEmail: event.target.checked,
                }))
              }
            />{" "}
            Require email
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.requirePhone}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  requirePhone: event.target.checked,
                }))
              }
            />{" "}
            Require phone
          </label>
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <Button className="mt-5" type="submit" loading={saving}>
        <Save size={16} />
        Save form
      </Button>
    </form>
  );
}

export function Submissions() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const canAssignSalesperson = user?.role === "ADMIN" || user?.role === "MANAGER";
  const isSalesAgent = user?.role === "SALES_AGENT";
  const [page, setPage] = useState<Page<Submission>>({
    content: [],
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | Submission["status"]>("ALL");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [salesUsers, setSalesUsers] = useState<SalesUser[]>([]);
  const [qualifyOpen, setQualifyOpen] = useState(false);
  const [qualified, setQualified] = useState<{
    customerId: string;
    projectId: string;
  } | null>(null);
  const [qualification, setQualification] = useState({
    projectName: "",
    projectType: "",
    location: "",
    callConfirmed: false,
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const next = await api<Page<Submission>>(
        `/cms/contact-submissions?size=20&page=${pageNumber}`,
      );
      setPage(next);
      setSelected((current) =>
        current.filter((id) => next.content.some((item) => item.id === id)),
      );
      setSelectedId((current) =>
        current && next.content.some((item) => item.id === current)
          ? current
          : (next.content[0]?.id ?? null),
      );
    } catch (cause) {
      setError((cause as RequestError).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [pageNumber]);
  useEffect(() => {
    if (!canAssignSalesperson) return;
    void api<SalesUser[]>("/users")
      .then((users) =>
        setSalesUsers(
          users.filter(
            (user) =>
              user.active &&
              ["SALES_AGENT", "ADMIN", "MANAGER"].includes(user.role),
          ),
        ),
      )
      .catch(() => {});
  }, [canAssignSalesperson]);

  const counts = useMemo(
    () => ({
      all: page.content.length,
      new: page.content.filter((item) => item.status === "NEW").length,
      read: page.content.filter((item) => item.status === "READ").length,
      archived: page.content.filter((item) => item.status === "ARCHIVED")
        .length,
    }),
    [page.content],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return page.content.filter((item) => {
      const matchesFilter = filter === "ALL" || item.status === filter;
      const haystack = [
        item.fullName,
        item.email,
        item.phone,
        item.subject,
        item.message,
        item.sourcePage,
        item.utmSource,
        item.utmCampaign,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesFilter && (!needle || haystack.includes(needle));
    });
  }, [filter, page.content, query]);

  const active =
    page.content.find((item) => item.id === selectedId) ?? visible[0] ?? null;
  const trackingLocked = isSalesAgent && !active?.assignedToUserId;

  async function claimLead() {
    if (!active) return;
    setBusy(true);
    setError("");
    try {
      await api(`/cms/contact-submissions/${active.id}/claim`, { method: "POST" });
      await load();
    } catch (cause) {
      setError((cause as RequestError).message);
    } finally {
      setBusy(false);
    }
  }

  function openQualification() {
    if (!active) return;
    setQualified(null);
    setQualification({
      projectName: active.subject || `${active.fullName} project`,
      projectType: "",
      location: "",
      callConfirmed: false,
    });
    setQualifyOpen(true);
  }

  async function qualifyLead(event: FormEvent) {
    event.preventDefault();
    if (!active || !qualification.callConfirmed) return;
    setBusy(true);
    setError("");
    try {
      const result = await api<{ customerId: string; projectId: string }>(
        `/cms/contact-submissions/${active.id}/qualify`,
        {
          method: "POST",
          body: JSON.stringify({
            projectName: qualification.projectName.trim(),
            projectType: qualification.projectType.trim() || null,
            location: qualification.location.trim() || null,
            callConfirmed: qualification.callConfirmed,
          }),
        },
      );
      setQualified({
        customerId: result.customerId,
        projectId: result.projectId,
      });
      setQualifyOpen(false);
      await load();
    } catch (cause) {
      setError((cause as RequestError).message);
    } finally {
      setBusy(false);
    }
  }

  async function status(ids: string[], value: Submission["status"]) {
    if (!ids.length) return;
    setBusy(true);
    setError("");
    try {
      await Promise.all(
        ids.map((id) => {
          const inquiry = page.content.find((item) => item.id === id);
          return api(`/cms/contact-submissions/${id}`, {
            method: "PATCH",
            body: JSON.stringify({
              status: value,
              assignedToUserId: inquiry?.assignedToUserId ?? null,
              callOutcome: inquiry?.callOutcome ?? "UNCONTACTED",
              callNotes: inquiry?.callNotes ?? null,
              nextFollowUpAt: inquiry?.nextFollowUpAt ?? null,
            }),
          });
        }),
      );
      await load();
      setSelected([]);
    } catch (cause) {
      setError((cause as RequestError).message);
    } finally {
      setBusy(false);
    }
  }

  function exportCsv() {
    const header = [
      "Name",
      "Email",
      "Phone",
      "Subject",
      "Message",
      "Status",
      "Notification",
      "Source",
      "Campaign",
      "Created",
    ];
    const rows = page.content.map((item) => [
      item.fullName,
      item.email ?? "",
      item.phone ?? "",
      item.subject ?? "",
      item.message ?? "",
      item.status,
      item.notificationStatus,
      item.sourcePage ?? "",
      item.utmCampaign ?? "",
      item.createdAt,
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `univmar-form-inbox-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const toggleSelected = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const toggleAll = () =>
    setSelected(
      selected.length === visible.length ? [] : visible.map((item) => item.id),
    );
  const statusLabel = (value: Submission["status"]) =>
    value === "NEW" ? "New" : value === "READ" ? "Read" : "Archived";
  const statusClass = (value: Submission["status"]) =>
    value === "NEW"
      ? "bg-[#fdf0d8] text-[#99661c]"
      : value === "READ"
        ? "bg-[#e8f1f7] text-[#32657c]"
        : "bg-[#f0ece9] text-[#746860]";
  async function updateTracking(fields: {
    assignedToUserId?: string | null;
    callOutcome?: Submission["callOutcome"];
    callNotes?: string;
    nextFollowUpAt?: string | null;
  }) {
    if (!active) return;
    setBusy(true);
    try {
      await api(`/cms/contact-submissions/${active.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: active.status,
          assignedToUserId:
            fields.assignedToUserId ?? active.assignedToUserId ?? null,
          callOutcome:
            fields.callOutcome ?? active.callOutcome ?? "UNCONTACTED",
          callNotes: fields.callNotes ?? active.callNotes ?? null,
          nextFollowUpAt:
            fields.nextFollowUpAt ?? active.nextFollowUpAt ?? null,
        }),
      });
      await load();
    } catch (cause) {
      setError((cause as RequestError).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="overflow-hidden">
      <header className="border-b border-[#e8ded8] bg-white px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#765847]">
              <Inbox size={16} />
              <p className="text-[10px] font-bold tracking-[.18em]">
                CUSTOMER RELATIONSHIP
              </p>
            </div>
            <h2 className="mt-2 font-sans text-3xl tracking-tight text-[#21140f]">
              Form inbox
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#786961]">
              Every website enquiry in one place. Qualify the lead, keep
              attribution intact, and move it through your response queue.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d8ccc4] bg-white px-3 text-xs font-semibold text-[#57483f] hover:bg-[#f8f4f1] disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d8ccc4] bg-white px-3 text-xs font-semibold text-[#57483f] hover:bg-[#f8f4f1]"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              ["ALL", "All enquiries", counts.all],
              ["NEW", "Needs reply", counts.new],
              ["READ", "In progress", counts.read],
              ["ARCHIVED", "Archived", counts.archived],
            ] as const
          ).map(([value, label, count]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-xl border px-3 py-3 text-left transition ${filter === value ? "border-[#765847] bg-[#f8f1ec]" : "border-[#eee5df] bg-white hover:border-[#cdbdb2]"}`}
            >
              <span className="block text-2xl font-semibold tracking-tight text-[#291711]">
                {count}
              </span>
              <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[.08em] text-[#89786e]">
                {label}
              </span>
            </button>
          ))}
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700 sm:px-7">
          <CircleAlert size={16} />
          {error}
        </div>
      )}
      <div className="grid min-h-[660px] lg:grid-cols-[minmax(330px,.8fr)_minmax(0,1.2fr)]">
        <div className="border-b border-[#e8ded8] bg-[#f7f3f0] lg:border-b-0 lg:border-r">
          <div className="border-b border-[#e8ded8] p-4 sm:p-5">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a08e83]"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, message, campaign…"
                className="h-10 w-full rounded-lg border border-[#d8ccc4] bg-white pl-9 pr-9 text-sm outline-none ring-[#765847] placeholder:text-[#ad9e95] focus:ring-2"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89786e]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#67564c]">
                <input
                  type="checkbox"
                  checked={
                    visible.length > 0 && selected.length === visible.length
                  }
                  onChange={toggleAll}
                />
                Select visible
              </label>
              {selected.length > 0 && (
                <span className="text-xs font-semibold text-[#765847]">
                  {selected.length} selected
                </span>
              )}
            </div>
            {selected.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void status(selected, "READ")}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#21140f] px-2.5 py-1.5 text-[11px] font-semibold text-white disabled:opacity-50"
                >
                  <CheckCheck size={13} />
                  Mark read
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void status(selected, "ARCHIVED")}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#d8ccc4] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#67564c] disabled:opacity-50"
                >
                  <Archive size={13} />
                  Archive
                </button>
              </div>
            )}
          </div>
          <div className="divide-y divide-[#e8ded8]">
            {visible.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedId(item.id);
                  if (item.status === "NEW") void status([item.id], "READ");
                }}
                className={`block w-full border-l-2 px-4 py-4 text-left transition sm:px-5 ${active?.id === item.id ? "border-l-[#9c6b4d] bg-white" : "border-l-transparent hover:bg-white/70"}`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onClick={(event) => event.stopPropagation()}
                    onChange={() => toggleSelected(item.id)}
                    className="mt-1"
                  />
                  <span
                    className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${item.status === "NEW" ? "bg-[#e4c2a4] text-[#67432e]" : "bg-[#e7e0db] text-[#806d61]"}`}
                  >
                    {item.fullName.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <strong
                        className={`truncate text-sm ${item.status === "NEW" ? "font-bold text-[#291711]" : "font-semibold text-[#59483f]"}`}
                      >
                        {item.fullName}
                      </strong>
                      <time className="shrink-0 text-[10px] text-[#a08e83]">
                        {new Intl.DateTimeFormat(undefined, {
                          month: "short",
                          day: "numeric",
                        }).format(new Date(item.createdAt))}
                      </time>
                    </span>
                    <span className="mt-1 block truncate text-xs text-[#786961]">
                      {item.subject || item.message || "New website enquiry"}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass(item.status)}`}
                      >
                        {statusLabel(item.status)}
                      </span>
                      {item.utmSource && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#9a7760]">
                          <Tag size={10} />
                          {item.utmSource}
                        </span>
                      )}
                    </span>
                  </span>
                </div>
              </button>
            ))}
            {!visible.length && (
              <div className="px-6 py-16 text-center">
                <Inbox size={28} className="mx-auto text-[#c8b9af]" />
                <p className="mt-3 text-sm font-semibold text-[#5f483c]">
                  No enquiries in this view
                </p>
                <p className="mt-1 text-xs text-[#89786e]">
                  Try another filter or search term.
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-[#e8ded8] px-4 py-3 text-xs text-[#786961]">
            <span>
              Page {pageNumber + 1} of {Math.max(1, page.totalPages ?? 1)}
            </span>
            <span className="flex gap-2">
              <button
                type="button"
                disabled={pageNumber === 0 || loading}
                onClick={() => setPageNumber((value) => value - 1)}
                className="rounded-md border border-[#d8ccc4] bg-white px-2.5 py-1.5 font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pageNumber + 1 >= (page.totalPages ?? 1) || loading}
                onClick={() => setPageNumber((value) => value + 1)}
                className="rounded-md border border-[#d8ccc4] bg-white px-2.5 py-1.5 font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </span>
          </div>
        </div>

        <div className="bg-white">
          {active ? (
            <div className="h-full">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#eee6e1] px-5 py-5 sm:px-8">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e4c2a4] text-sm font-bold text-[#67432e]">
                    {active.fullName.slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-sans text-2xl tracking-tight text-[#21140f]">
                        {active.fullName}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass(active.status)}`}
                      >
                        {statusLabel(active.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#89786e]">
                      Received {date(active.createdAt)}
                    </p>
                  </div>
                </div>
                <select
                  value={active.status}
                  onChange={(event) =>
                    void status(
                      [active.id],
                      event.target.value as Submission["status"],
                    )
                  }
                  className="h-9 rounded-lg border border-[#d8ccc4] bg-white px-3 text-xs font-semibold text-[#59483f]"
                >
                  <option value="NEW">New</option>
                  <option value="READ">Read</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div className="grid gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_220px]">
                <main>
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9b7861]">
                    Message
                  </p>
                  <h4 className="mt-3 text-lg font-semibold text-[#291711]">
                    {active.subject || "Website enquiry"}
                  </h4>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#59483f]">
                    {active.message || "No message was provided."}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {active.email && (
                      <a
                        href={`mailto:${active.email}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#21140f] px-3 py-2 text-xs font-semibold text-white hover:bg-[#3a251c]"
                      >
                        <Mail size={14} />
                        Reply by email
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                    {active.phone && (
                      <a
                        href={`tel:${active.phone}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#d8ccc4] px-3 py-2 text-xs font-semibold text-[#59483f] hover:bg-[#f8f4f1]"
                      >
                        <Phone size={14} />
                        Call lead
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard?.writeText(
                          active.message ?? "",
                        );
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#d8ccc4] px-3 py-2 text-xs font-semibold text-[#59483f] hover:bg-[#f8f4f1]"
                    >
                      <Clipboard size={14} />
                      Copy message
                    </button>
                    {isSalesAgent && !active.assignedToUserId && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void claimLead()}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#9b6040] px-3 py-2 text-xs font-semibold text-white hover:bg-[#7d472d] disabled:opacity-50"
                      >
                        <UserPlus size={14} />
                        Claim lead
                      </button>
                    )}
                    {active.qualifiedProjectId ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/projects/${active.qualifiedProjectId}`)}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                      >
                        <CheckCircle2 size={14} />
                        Open qualified project
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={trackingLocked}
                        onClick={openQualification}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#b88a68] bg-[#fff8f3] px-3 py-2 text-xs font-semibold text-[#76513b] hover:bg-[#f9eee6] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <UserPlus size={14} />
                        Qualify after call
                      </button>
                    )}
                  </div>
                  {(qualified || active.qualifiedProjectId) && (
                    <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold">
                          Customer and project created
                        </p>
                        <p className="mt-1 text-xs leading-5">
                          The project is now a LEAD. Sales can capture
                          requirements and create the RFQ next.
                        </p>
                      </div>
                    </div>
                  )}
                </main>
                <aside className="space-y-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9b7861]">
                      Contact
                    </p>
                    <div className="mt-3 space-y-3 text-sm">
                      {active.email && (
                        <a
                          href={`mailto:${active.email}`}
                          className="flex items-center gap-2 break-all text-[#59483f] hover:text-[#9b6040]"
                        >
                          <Mail size={14} className="shrink-0 text-[#9b7861]" />
                          {active.email}
                        </a>
                      )}
                      {active.phone && (
                        <a
                          href={`tel:${active.phone}`}
                          className="flex items-center gap-2 text-[#59483f] hover:text-[#9b6040]"
                        >
                          <Phone
                            size={14}
                            className="shrink-0 text-[#9b7861]"
                          />
                          {active.phone}
                        </a>
                      )}
                      {!active.email && !active.phone && (
                        <span className="text-xs text-[#89786e]">
                          No direct contact supplied
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-[#eee6e1] pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9b7861]">
                      Attribution
                    </p>
                    <dl className="mt-3 space-y-3 text-xs">
                      <div>
                        <dt className="text-[#a08e83]">Source page</dt>
                        <dd className="mt-1 flex items-center gap-1 font-semibold text-[#59483f]">
                          {active.sourcePage || "Landing"}
                          {active.sourcePage && <ExternalLink size={11} />}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#a08e83]">Campaign</dt>
                        <dd className="mt-1 font-semibold text-[#59483f]">
                          {active.utmCampaign ||
                            active.utmSource ||
                            "Direct / organic"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  {active.attachments?.length ? <div className="border-t border-[#eee6e1] pt-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9b7861]">Project files</p><div className="mt-3 space-y-2">{active.attachments.map((file) => <button type="button" key={file.id} onClick={() => void downloadProtectedFile(file.documentUrl, file.originalFilename)} className="flex w-full items-center gap-2 text-left text-xs font-semibold text-[#59483f] hover:text-[#9b6040]"><Download size={14} className="text-[#9b7861]" />{file.originalFilename}<span className="ml-auto font-normal text-[#a08e83]">{Math.ceil(file.fileSize / 1024)} KB</span></button>)}</div></div> : null}
                  <div className="border-t border-[#eee6e1] pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9b7861]">
                      Sales ownership
                    </p>
                    {canAssignSalesperson ? (
                      <label className="mt-3 block text-xs font-semibold text-[#67564c]">
                        Assigned salesperson
                        <select
                          disabled={busy}
                          value={active.assignedToUserId ?? ""}
                          onChange={(event) =>
                            void updateTracking({
                              assignedToUserId: event.target.value || null,
                            })
                          }
                          className="mt-1.5 h-9 w-full rounded-lg border border-[#d8ccc4] bg-white px-2 text-xs font-medium text-[#59483f] disabled:opacity-60"
                        >
                          <option value="">Unassigned</option>
                          {salesUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.email}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : (
                      <p className="mt-3 text-xs text-[#786961]">
                        Owner: <span className="font-semibold text-[#59483f]">{active.assignedToEmail ?? "Unassigned"}</span>
                      </p>
                    )}
                    {trackingLocked && (
                      <p className="mt-3 rounded-lg bg-[#fff6e9] px-3 py-2 text-xs leading-5 text-[#875d26]">
                        Claim this lead to become its owner before recording a call or qualifying it.
                      </p>
                    )}
                    <label className="mt-4 block text-xs font-semibold text-[#67564c]">
                      Call outcome
                      <select
                        disabled={busy || trackingLocked}
                        value={active.callOutcome ?? "UNCONTACTED"}
                        onChange={(event) =>
                          void updateTracking({
                            callOutcome: event.target
                              .value as Submission["callOutcome"],
                          })
                        }
                        className="mt-1.5 h-9 w-full rounded-lg border border-[#d8ccc4] bg-white px-2 text-xs font-medium text-[#59483f] disabled:opacity-60"
                      >
                        <option value="UNCONTACTED">Not contacted</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="FOLLOW_UP">Follow-up needed</option>
                        <option value="NOT_INTERESTED">Not interested</option>
                        <option value="INVALID">Invalid lead</option>
                      </select>
                    </label>
                    <label className="mt-4 block text-xs font-semibold text-[#67564c]">
                      Call notes
                      <textarea
                        key={`${active.id}-${active.updatedAt}`}
                        disabled={busy || trackingLocked}
                        defaultValue={active.callNotes ?? ""}
                        onBlur={(event) =>
                          void updateTracking({
                            callNotes: event.target.value,
                          })
                        }
                        placeholder="Call summary, requirements, next action…"
                        className="mt-1.5 min-h-20 w-full resize-y rounded-lg border border-[#d8ccc4] bg-white p-2 text-xs font-medium text-[#59483f] placeholder:text-[#ad9e95]"
                      />
                    </label>
                    <label className="mt-4 block text-xs font-semibold text-[#67564c]">
                      Next follow-up
                      <input
                        type="datetime-local"
                        disabled={busy || trackingLocked}
                        value={active.nextFollowUpAt?.slice(0, 16) ?? ""}
                        onChange={(event) =>
                          void updateTracking({
                            nextFollowUpAt: event.target.value
                              ? new Date(event.target.value).toISOString()
                              : null,
                          })
                        }
                        className="mt-1.5 h-9 w-full rounded-lg border border-[#d8ccc4] bg-white px-2 text-xs font-medium text-[#59483f]"
                      />
                    </label>
                  </div>
                  <div className="border-t border-[#eee6e1] pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9b7861]">
                      Notification
                    </p>
                    <p
                      className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold ${active.notificationStatus === "SENT" ? "text-emerald-700" : active.notificationStatus === "FAILED" ? "text-red-700" : "text-amber-700"}`}
                    >
                      {active.notificationStatus === "SENT" ? (
                        <Check size={14} />
                      ) : active.notificationStatus === "FAILED" ? (
                        <CircleAlert size={14} />
                      ) : (
                        <MailOpen size={14} />
                      )}
                      Email {active.notificationStatus.toLowerCase()}
                    </p>
                  </div>
                </aside>
              </div>
            </div>
          ) : (
            <div className="grid h-full place-items-center px-8 py-24 text-center">
              <UserRound size={34} className="text-[#c8b9af]" />
              <h3 className="mt-4 font-sans text-xl text-[#59483f]">
                Select an enquiry
              </h3>
              <p className="mt-1 text-sm text-[#89786e]">
                Choose a message from the queue to see its full context.
              </p>
            </div>
          )}
        </div>
        {qualifyOpen && active && (
          <div className="fixed inset-0 z-[80] grid place-items-center bg-[#110703]/35 p-4">
            <form
              onSubmit={qualifyLead}
              className="w-full max-w-lg rounded-2xl border border-[#ded1c8] bg-white p-6 shadow-2xl sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9b7861]">
                    SALES QUALIFICATION
                  </p>
                  <h3 className="mt-2 font-sans text-2xl text-[#21140f]">
                    Create the lead workspace
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#786961]">
                    Confirm the call first. This creates a customer and a
                    project in LEAD status; the RFQ comes after requirements are
                    captured.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setQualifyOpen(false)}
                  className="rounded-md p-2 text-[#89786e] hover:bg-[#f5f0ed]"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-6 grid gap-4">
                <label className="grid gap-1.5 text-sm font-medium text-[#59483f]">
                  Project name
                  <input
                    required
                    value={qualification.projectName}
                    onChange={(event) =>
                      setQualification((current) => ({
                        ...current,
                        projectName: event.target.value,
                      }))
                    }
                    className={field}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-medium text-[#59483f]">
                    Project type
                    <input
                      value={qualification.projectType}
                      onChange={(event) =>
                        setQualification((current) => ({
                          ...current,
                          projectType: event.target.value,
                        }))
                      }
                      placeholder="Kitchen, villa, hotel…"
                      className={field}
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium text-[#59483f]">
                    Location
                    <input
                      value={qualification.location}
                      onChange={(event) =>
                        setQualification((current) => ({
                          ...current,
                          location: event.target.value,
                        }))
                      }
                      placeholder="City / site"
                      className={field}
                    />
                  </label>
                </div>
                <label className="flex items-start gap-3 rounded-xl border border-[#e6d9d1] bg-[#faf7f5] p-4 text-sm text-[#59483f]">
                  <input
                    required
                    type="checkbox"
                    checked={qualification.callConfirmed}
                    onChange={(event) =>
                      setQualification((current) => ({
                        ...current,
                        callConfirmed: event.target.checked,
                      }))
                    }
                    className="mt-0.5"
                  />
                  <span>
                    <strong className="block text-[#291711]">
                      Sales call completed and lead qualified
                    </strong>
                    <span className="mt-1 block text-xs leading-5 text-[#786961]">
                      I confirmed the contact details and project intent with
                      the client.
                    </span>
                  </span>
                </label>
              </div>
              {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQualifyOpen(false)}
                  className="h-10 rounded-lg border border-[#d8ccc4] px-4 text-sm font-semibold text-[#67564c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy || !qualification.callConfirmed}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#21140f] px-4 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <BriefcaseBusiness size={15} />
                  {busy ? "Creating…" : "Confirm and create"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

function DeveloperGuide() {
  const productExample = `{
  "data": [{
    "id": "uuid", "slug": "uuid", "name": "Calacatta",
    "category": "Marbre", "categorySlug": "marbre",
    "coverImageUrl": "/api/v1/uploads/images/...",
    "galleryImageUrls": ["/api/v1/uploads/images/..."]
  }]
}`;
  const formExample = `{
  "fullName": "Jane Doe", "email": "jane@example.com",
  "phone": "+212...", "subject": "Project enquiry",
  "message": "...", "language": "fr",
  "selectedProducts": "uuid,uuid", "sourcePage": "/products",
  "utmSource": "google", "utmMedium": "cpc",
  "utmCampaign": "autumn", "referrer": "...",
  "website": ""
}`;
  return (
    <section className="mt-6 space-y-6">
      <header className="rounded-xl border border-[#e3d8d1] bg-white p-5">
        <p className="text-[10px] font-bold tracking-[.16em] text-[#765847]">
          HANDOFF FOR LANDING DEVELOPERS
        </p>
        <h2 className="mt-2 font-sans text-2xl text-[#21140f]">
          Public website integration
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#786961]">
          Use this ERP as the data source. A landing website controls its own
          visual design, copy, routes, and translations; it reads only approved
          public data from these endpoints.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <GuideCard title="Automatic product publishing">
          <ol className="space-y-3 text-sm leading-6 text-[#5f483c]">
            <li>
              <strong>1. Place a material in a catalog category.</strong>{" "}
              Categories are managed in the first tab and their URL key is used
              by the landing.
            </li>
            <li>
              <strong>2. Keep the material active.</strong> It must also have an
              active variant with an uploaded image.
            </li>
            <li>
              <strong>3. Publish or hide the category.</strong> A category
              marked “Publish to landing” exposes all qualifying materials
              automatically; hiding it removes that whole group from the public
              feed.
            </li>
          </ol>
          <p className="mt-4 rounded-md bg-[#f8f4f1] p-3 text-xs leading-5 text-[#786961]">
            Do not publish each product one by one. Category, material status,
            and image readiness are the management controls.
          </p>
        </GuideCard>
        <GuideCard title="Public API endpoints">
          <div className="space-y-2 text-sm">
            <Endpoint
              method="GET"
              path="/api/v1/public/catalog/categories"
              note="Landing navigation groups, ordered with product counts."
            />
            <Endpoint
              method="GET"
              path="/api/v1/public/catalog/products?category=marbre"
              note="Automatic products for one category. Omit category for all products."
            />
            <Endpoint
              method="GET"
              path="/api/v1/public/catalog/products/{id}"
              note="One product detail."
            />
            <Endpoint
              method="GET"
              path="/api/v1/public/portfolio/categories"
              note="Portfolio filters."
            />
            <Endpoint
              method="GET"
              path="/api/v1/public/portfolio/projects?featured=true"
              note="Published portfolio cards and galleries."
            />
            <Endpoint
              method="GET"
              path="/api/v1/public/contact-form"
              note="Fallback form content and validation rules."
            />
            <Endpoint
              method="POST"
              path="/api/v1/public/contact-form/submissions"
              note="Saves the enquiry to ERP and triggers configured email."
            />
          </div>
        </GuideCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GuideCard title="Response and product data">
          <p className="text-sm leading-6 text-[#5f483c]">
            Every successful endpoint returns{" "}
            <code className="rounded bg-[#f3efeb] px-1.5 py-0.5">{`{ data, timestamp, requestId }`}</code>
            . Render products from{" "}
            <code className="rounded bg-[#f3efeb] px-1.5 py-0.5">data</code> and
            use{" "}
            <code className="rounded bg-[#f3efeb] px-1.5 py-0.5">
              categorySlug
            </code>{" "}
            and ERP order instead of hard-coded category lists.
          </p>
          <Code value={productExample} />
        </GuideCard>
        <GuideCard title="Contact form submission">
          <p className="text-sm leading-6 text-[#5f483c]">
            Submit JSON to the POST endpoint. Send the hidden{" "}
            <code className="rounded bg-[#f3efeb] px-1.5 py-0.5">website</code>{" "}
            honeypot as an empty string. Do not show it to people. Form leads,
            attribution, and notification status are handled in the ERP inbox.
          </p>
          <Code value={formExample} />
        </GuideCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GuideCard title="Landing implementation rules">
          <ul className="space-y-2 text-sm leading-6 text-[#5f483c]">
            <li>
              Use{" "}
              <code className="rounded bg-[#f3efeb] px-1.5 py-0.5">
                ERP_PUBLIC_API_URL
              </code>
              , for example{" "}
              <code className="rounded bg-[#f3efeb] px-1.5 py-0.5">
                https://api.example.com/api/v1
              </code>
              .
            </li>
            <li>
              Public calls require no Authorization header. Never put ERP
              logins, bearer tokens, or mail-provider keys in the landing code.
            </li>
            <li>
              For Next.js or another server-rendered site, fetch catalog and
              portfolio data on the server with normal cache/revalidation.
              Submit the contact form from the browser to the ERP.
            </li>
            <li>
              Use the supplied image URLs; only ERP-uploaded media is returned.
              The public API deliberately does not expose customer, value,
              notes, or documents.
            </li>
          </ul>
        </GuideCard>
        <GuideCard title="Deployment checklist">
          <ul className="space-y-2 text-sm leading-6 text-[#5f483c]">
            <li>
              Set{" "}
              <code className="rounded bg-[#f3efeb] px-1.5 py-0.5">
                UNIVMAR_CORS_ALLOWED_ORIGINS
              </code>{" "}
              to every approved landing domain.
            </li>
            <li>
              Set{" "}
              <code className="rounded bg-[#f3efeb] px-1.5 py-0.5">
                UNIVMAR_PUBLIC_API_URL
              </code>{" "}
              so public image URLs use the public ERP host.
            </li>
            <li>
              To email form notifications, configure{" "}
              <code className="rounded bg-[#f3efeb] px-1.5 py-0.5">
                UNIVMAR_WEBSITE_EMAIL_ENABLED
              </code>
              ,{" "}
              <code className="rounded bg-[#f3efeb] px-1.5 py-0.5">
                UNIVMAR_WEBSITE_EMAIL_TO
              </code>
              , and the standard{" "}
              <code className="rounded bg-[#f3efeb] px-1.5 py-0.5">
                SPRING_MAIL_*
              </code>{" "}
              SMTP settings.
            </li>
            <li>
              After deployment, test a category page, a product image, a
              portfolio gallery, and one form submission from the real landing
              domain.
            </li>
          </ul>
        </GuideCard>
      </div>
    </section>
  );
}

function GuideCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-xl border border-[#e3d8d1] bg-white p-5">
      <h3 className="font-sans text-xl text-[#21140f]">{title}</h3>
      <div className="mt-4">{children}</div>
    </article>
  );
}
function Endpoint({
  method,
  path,
  note,
}: {
  method: "GET" | "POST";
  path: string;
  note: string;
}) {
  return (
    <div className="rounded-md border border-[#eee6e1] p-3">
      <div className="flex items-center gap-2">
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${method === "POST" ? "bg-[#f4ece8] text-[#765847]" : "bg-emerald-50 text-emerald-700"}`}
        >
          {method}
        </span>
        <code className="break-all text-xs text-[#291711]">{path}</code>
      </div>
      <p className="mt-1.5 text-xs leading-5 text-[#786961]">{note}</p>
    </div>
  );
}
function Code({ value }: { value: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-md bg-[#21140f] p-4 text-xs leading-5 text-[#f6efea]">
      <code>{value}</code>
    </pre>
  );
}
function Text({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <input
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={field}
      />
    </label>
  );
}

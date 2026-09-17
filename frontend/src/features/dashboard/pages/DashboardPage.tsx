const workspaceAreas = [
  ["Material library", "Manage stone materials and variants", "Catalog"],
  ["Inventory", "Warehouse quantities and movements", "In setup"],
  ["Customers", "Companies, contacts, and projects", "In setup"],
  ["Orders", "Accepted quotations and fulfilment", "In setup"],
] as const;

const nextSteps = [
  ["Add a material", "Create the commercial identity for each stone."],
  ["Configure variants", "Record each thickness and finish combination."],
  ["Connect inventory", "Track physical quantities when warehouse records are ready."],
] as const;

export function DashboardPage() {
  return (
    <section className="mx-auto max-w-[1520px] px-4 py-8 sm:px-7 lg:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#21140f]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#786961]">A concise view of the operational areas your team can access.</p>
        </div>
        <span className="inline-flex rounded-md border border-[#e3d8d1] bg-white px-3 py-2 text-sm font-medium text-[#4b3328]">Catalog ready</span>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {workspaceAreas.map(([title, detail, status]) => (
          <article key={title} className="rounded-lg border border-[#e3d8d1] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#21140f]">{title}</p>
            <p className="mt-2 text-sm leading-6 text-[#786961]">{detail}</p>
            <span className="mt-5 inline-flex rounded-full bg-[#f4ece8] px-2.5 py-1 text-xs font-medium text-[#4b3328]">{status}</span>
          </article>
        ))}
      </div>
      <section className="mt-6 rounded-lg border border-[#e3d8d1] bg-white shadow-sm">
        <div className="border-b border-[#f0e8e4] px-5 py-4">
          <h2 className="font-semibold text-[#21140f]">Getting started</h2>
          <p className="mt-1 text-sm text-[#786961]">Build a clean commercial record before connecting stock and sales activity.</p>
        </div>
        <div className="grid divide-y divide-[#f0e8e4] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {nextSteps.map(([title, detail]) => (
            <div key={title} className="py-5 sm:px-5 first:pl-0 last:pr-0">
              <p className="text-sm font-semibold text-[#21140f]">{title}</p>
              <p className="mt-1 text-sm leading-6 text-[#786961]">{detail}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

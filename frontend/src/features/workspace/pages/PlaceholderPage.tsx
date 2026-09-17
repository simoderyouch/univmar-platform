import { DataTable } from "../../../shared/ui";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-[1520px] px-4 py-8 md:px-8 md:py-10">
      <p className="text-[10px] font-extrabold tracking-[0.16em] text-[#856958]">WORKSPACE</p>
      <h1 className="mt-2 font-serif text-3xl tracking-tight md:text-[38px]">{title}</h1>
      <div className="mt-8 max-w-3xl">
        <DataTable>
          <thead className="border-b border-[#e3d8d1] bg-[#fcfaf7] text-xs uppercase tracking-wider text-[#806f65]">
            <tr><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Availability</th></tr>
          </thead>
          <tbody>
            <tr><td className="px-5 py-5 font-medium">This workspace is being prepared</td><td className="px-5 py-5 text-[#786961]">Access is configured and the workspace will be available soon.</td></tr>
          </tbody>
        </DataTable>
      </div>
    </section>
  );
}

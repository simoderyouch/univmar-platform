import type { ReactNode } from "react";

export function DataTable({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm">{children}</table></div>;
}

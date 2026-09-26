import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  totalElements: number;
  itemCount: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  noun?: string;
};

export function PaginationControls({ page, totalPages, totalElements, itemCount, loading = false, onPageChange, noun = "records" }: PaginationControlsProps) {
  const first = totalElements === 0 ? 0 : page * 20 + 1;
  const last = totalElements === 0 ? 0 : page * 20 + itemCount;
  return <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#786961]"><p>{totalElements ? `Showing ${first}–${last} of ${totalElements} ${noun}` : `No ${noun}`}</p><div className="flex items-center gap-2"><Button type="button" variant="outline" size="sm" disabled={loading || page === 0} onClick={() => onPageChange(page - 1)}><ChevronLeft size={16} /> Previous</Button><span className="min-w-20 text-center text-xs font-semibold">Page {totalPages ? page + 1 : 0} of {totalPages}</span><Button type="button" variant="outline" size="sm" disabled={loading || totalPages === 0 || page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>Next <ChevronRight size={16} /></Button></div></div>;
}

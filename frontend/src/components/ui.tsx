import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { LoaderCircle, X } from "lucide-react";

export function Button({ children, className = "", loading, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return <button {...props} disabled={loading || props.disabled} className={`inline-flex h-10 items-center justify-center gap-2 rounded-md bg-black px-4 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
    {loading && <LoaderCircle size={16} className="animate-spin" />}{children}
  </button>;
}

export function TextField({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return <label className="grid gap-1.5 text-sm font-medium text-[#393531]">{label}
    <input {...props} className={`h-11 rounded-md border bg-white px-3 text-sm outline-none transition placeholder:text-[#9e968d] focus:border-[#a8804c] focus:ring-2 focus:ring-[#c9a46e]/20 ${error ? "border-red-500" : "border-[#dcd5ca]"}`} />
    {error && <span className="text-xs font-normal text-red-600">{error}</span>}
  </label>;
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-label={title}>
    <section className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between gap-4"><h2 className="font-serif text-2xl">{title}</h2><button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 text-[#766f67] hover:bg-[#f2eee8]"><X size={19} /></button></div>{children}</section>
  </div>;
}

export function DataTable({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto rounded-lg border border-[#e4ddd2] bg-white"><table className="w-full min-w-[600px] text-left text-sm">{children}</table></div>;
}

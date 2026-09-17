import { createContext, useContext, useState, type ReactNode } from "react";

type ToastKind = "error" | "success";
type Toast = { id: number; message: string; kind: ToastKind };
type ToastContextValue = (message: string, kind?: ToastKind) => void;

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function notify(message: string, kind: ToastKind = "success") {
    const id = Date.now();
    setToasts((items) => [...items, { id, message, kind }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 4500);
  }

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="fixed right-4 top-4 z-[60] grid w-[min(360px,calc(100vw-2rem))] gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`rounded-lg border px-4 py-3 text-sm shadow-lg ${toast.kind === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider.");
  return value;
}

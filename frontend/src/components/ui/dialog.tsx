import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";
export const Dialog = DialogPrimitive.Root; export const DialogTrigger = DialogPrimitive.Trigger;
export function DialogContent({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Content>) { return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]" /><DialogPrimitive.Content className={cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#e4ddd2] bg-[#faf7f2] p-6 shadow-2xl focus:outline-none", className)} {...props}>{children}<DialogPrimitive.Close className="absolute right-4 top-4 text-[#7a736c] hover:text-black"><X size={18} /></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal>; }

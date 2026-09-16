import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const variants = cva("inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "bg-emerald-900 text-white hover:bg-emerald-800", outline: "border border-stone-300 bg-white text-stone-800 hover:bg-stone-100", ghost: "text-stone-600 hover:bg-stone-100 hover:text-stone-950", destructive: "bg-red-700 text-white hover:bg-red-800" }, size: { default: "h-9", sm: "h-8 px-2.5 text-xs", lg: "h-10 px-4" } }, defaultVariants: { variant: "default", size: "default" } });
type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof variants> & { asChild?: boolean };
export function Button({ className, variant, size, asChild, ...props }: Props) { const Comp = asChild ? Slot : "button"; return <Comp className={cn(variants({ variant, size }), className)} {...props} />; }

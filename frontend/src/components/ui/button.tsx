import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const variants = cva("inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a46e] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "bg-black text-white hover:bg-[#242424]", outline: "border border-[#d8d0c6] bg-white text-black hover:bg-[#f3efe8]", ghost: "text-[#6b6560] hover:bg-[#f3efe8] hover:text-black", destructive: "bg-[#9a403a] text-white hover:bg-[#7d322d]" }, size: { default: "h-9", sm: "h-8 px-2.5 text-xs", lg: "h-10 px-4" } }, defaultVariants: { variant: "default", size: "default" } });
type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof variants> & { asChild?: boolean };
export function Button({ className, variant, size, asChild, ...props }: Props) { const Comp = asChild ? Slot : "button"; return <Comp className={cn(variants({ variant, size }), className)} {...props} />; }

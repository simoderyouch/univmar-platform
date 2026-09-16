import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cn("h-9 w-full rounded-md border border-[#d8d0c6] bg-white px-3 text-sm text-black outline-none placeholder:text-[#9b938b] focus:border-[#c9a46e] focus:ring-2 focus:ring-[#c9a46e]/20", className)} {...props} />; }

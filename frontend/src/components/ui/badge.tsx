import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) { return <span className={cn("inline-flex items-center rounded-full bg-[#f3efe8] px-2 py-0.5 text-xs font-medium text-[#6b6560]", className)} {...props} />; }

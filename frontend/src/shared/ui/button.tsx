import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { cn } from "./cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#110703] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#110703] text-white shadow-sm hover:bg-[#2a1811]",
        secondary: "bg-[#f3ece8] text-[#291711] hover:bg-[#e8ddd7]",
        outline: "border border-[#d8ccc4] bg-white text-[#291711] hover:bg-[#fbf8f6]",
        ghost: "text-[#4b3328] hover:bg-[#f3ece8]",
      },
      size: { default: "h-10 px-4", sm: "h-9 rounded-md px-3", lg: "h-11 px-5" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} disabled={loading || disabled} {...props}>
      {loading && <LoaderCircle size={16} className="animate-spin" />}
      {children}
    </button>
  ),
);
Button.displayName = "Button";

import type React from "react";
import { cn } from "./cn";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function TextField({ label, error, className, ...props }: TextFieldProps) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-[#33251f]">
      <span>{label}</span>
      <input
        {...props}
        className={cn(
          "h-11 rounded-md border bg-white px-3 text-sm text-[#21140f] outline-none transition placeholder:text-[#a1958d] hover:border-[#b8a9a0] focus:border-[#110703]",
          error ? "border-red-500 focus:border-red-600" : "border-[#d8ccc4]",
          className,
        )}
      />
      {error && <span className="text-xs font-normal text-red-700">{error}</span>}
    </label>
  );
}

"use client";

import Image from "next/image";
import { useTheme } from "@/lib/theme";

const LOGO_LIGHT = "/univmar-logo.png";
const LOGO_DARK = "/univmar-logo-w.png";

type LogoProps = {
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  /** Force white logo on dark backgrounds regardless of site theme */
  variant?: "auto" | "light";
};

export default function Logo({
  width = 160,
  height = 75,
  priority = false,
  className,
  variant = "auto",
}: LogoProps) {
  const { theme } = useTheme();
  const useLightLogo = variant === "light" || theme === "dark";

  return (
    <Image
      src={useLightLogo ? LOGO_DARK : LOGO_LIGHT}
      alt="UNIVMAR"
      title="UNIVMAR"
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ height, width: "auto", objectFit: "contain" }}
    />
  );
}

export { LOGO_DARK, LOGO_LIGHT };

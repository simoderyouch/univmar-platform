"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "none";

type RevealTag = "div" | "section" | "article" | "header" | "footer" | "li" | "nav";

type ScrollRevealProps = {
  as?: RevealTag;
  children: ReactNode;
  delay?: number;
  direction?: RevealDirection;
  className?: string;
  once?: boolean;
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "whileInView" | "viewport" | "transition">;

const offsets: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 38 },
  down: { x: 0, y: -30 },
  left: { x: 36, y: 0 },
  right: { x: -36, y: 0 },
  none: { x: 0, y: 0 },
};

export default function ScrollReveal({
  as = "div",
  children,
  delay = 0,
  direction = "up",
  className,
  once = false,
  ...props
}: ScrollRevealProps) {
  const offset = offsets[direction];

  const motionProps = {
    className,
    initial: { opacity: 0, x: offset.x, y: offset.y, scale: 0.96, filter: "blur(8px)" },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" },
    // Do not wait for the content to be 100px inside the viewport. That delay
    // leaves an empty section at the start of pages on Safari and touch browsers.
    viewport: { once, margin: "0px" },
    transition: { duration: 0.68, delay, ease: "easeOut" },
    ...props,
  } as any;

  if (as === "section") return <motion.section {...motionProps}>{children}</motion.section>;
  if (as === "article") return <motion.article {...motionProps}>{children}</motion.article>;
  if (as === "header") return <motion.header {...motionProps}>{children}</motion.header>;
  if (as === "footer") return <motion.footer {...motionProps}>{children}</motion.footer>;
  if (as === "li") return <motion.li {...motionProps}>{children}</motion.li>;
  if (as === "nav") return <motion.nav {...motionProps}>{children}</motion.nav>;
  return <motion.div {...motionProps}>{children}</motion.div>;
}

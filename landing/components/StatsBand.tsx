"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { SiteStats } from "@/lib/siteStats";

type StatKey = "products" | "projects" | "years" | "categories";

type StatsLabels = Record<StatKey, string>;

function StatIcon({ statKey }: { statKey: StatKey }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (statKey) {
    case "products":
      return (
        <svg {...props}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    case "projects":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      );
    case "years":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="5" />
          <path d="M12 13v8" />
          <path d="M8 21h8" />
          <path d="M10 8h4" />
        </svg>
      );
    case "categories":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
  }
}

function AnimatedNumber({
  value,
  suffix,
  active,
}: {
  value: number;
  suffix: string;
  active: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;

    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [active, value]);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.94, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function StatsBand({ labels, stats }: { labels: StatsLabels; stats: SiteStats }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });

  const items = useMemo(
    () =>
      [
        { value: stats.products, suffix: "+", key: "products" as const },
        { value: stats.projects, suffix: "+", key: "projects" as const },
        { value: stats.years, suffix: "+", key: "years" as const },
        { value: stats.categories, suffix: "", key: "categories" as const },
      ] satisfies { value: number; suffix: string; key: StatKey }[],
    [stats],
  );

  return (
    <section ref={ref} className="stats-band" aria-label="Statistics">
      <motion.div
        className="stats-band-accent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="stats-band-glow" aria-hidden />

      <motion.div
        className="stats-grid stats-band-grid"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {items.map(({ value, suffix, key }) => (
          <motion.div key={key} className="stats-item stats-band-item" variants={itemVariants}>
            <motion.div
              className="stats-band-icon"
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
            >
              <motion.span
                className="stats-band-icon-ring"
                animate={isInView ? { scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] } : {}}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />
              <StatIcon statKey={key} />
            </motion.div>

            <div className="stats-band-value">
              <AnimatedNumber value={value} suffix={suffix} active={isInView} />
            </div>

            <div className="stats-band-label">{labels[key]}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

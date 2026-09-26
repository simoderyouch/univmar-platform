"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/lib/i18n";
import type { SiteStats } from "@/lib/siteStats";

type Props = { stats: SiteStats };

function AnimatedStat({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
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

export default function HomeStatsBanner({ stats }: Props) {
  const { t } = useLang();
  const labels = t.homePage.statsBanner;
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });

  const items = [
    { value: stats.projects, suffix: "+", label: labels.projects },
    { value: stats.products, suffix: "+", label: labels.products },
    { value: stats.years, suffix: "+", label: labels.years },
  ];

  return (
    <section ref={ref} className="home-stats-banner" aria-label="Statistics">
      <div className="home-stats-banner__inner">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            className="home-stats-banner__item"
            initial={{ opacity: 0, y: 34, scale: 0.92, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.68, delay: i * 0.12, ease: "easeOut" }}
            whileHover={{ y: -6, scale: 1.035 }}
          >
            <div className="home-stats-banner__value">
              <AnimatedStat value={item.value} suffix={item.suffix} active={inView} />
            </div>
            <div className="home-stats-banner__label">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

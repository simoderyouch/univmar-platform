"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import ServiceIcon from "@/components/ServiceIcon";
import { useLocalePath } from "@/lib/i18n";

type ServiceItem = { title: string; desc: string };

type ServicesContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  viewAll: string;
  items: ServiceItem[];
};

const sectionViewport = { once: false, margin: "-120px" } as const;

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

const headerAsideVariants: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, delay: 0.12, ease: "easeOut" },
  },
};

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.075, delayChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 38, scale: 0.95, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.58, ease: "easeOut" },
  },
};

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const SERVICE_IMAGES = ["/1.jpeg", "/2.jpeg", "/3.jpeg", "/4.jpeg"] as const;
const SERVICE_ORDER = [0, 1, 3, 2] as const;

export default function ServicesSection({ content }: { content: ServicesContent }) {
  const lp = useLocalePath();

  return (
    <section className="services-section" aria-labelledby="services-heading">
      <div className="services-section-inner">
        <div className="services-header">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
          >
            <p className="eyebrow services-eyebrow">{content.eyebrow}</p>
            <h2 id="services-heading" className="services-title">
              {content.title}
            </h2>
            <div className="gold-divider services-divider" />
          </motion.div>

          <motion.div
            variants={headerAsideVariants}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            className="services-header-aside"
          >
            <p className="services-subtitle">{content.subtitle}</p>
            <Link href={`${lp("/a-propos")}#services`} className="services-link">
              {content.viewAll}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="services-grid"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
        >
          {SERVICE_ORDER.map((serviceIndex, i) => {
            const item = content.items[serviceIndex];

            return (
              <motion.article
                key={item.title}
                className="services-card services-card--with-image"
                variants={cardVariants}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 380, damping: 22 } }}
              >
                <div className="services-card-media">
                  <Image
                    src={SERVICE_IMAGES[serviceIndex] ?? SERVICE_IMAGES[0]}
                    alt={item.title}
                    title={item.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 280px"
                    className="services-card-image"
                  />
                </div>

                <div className="services-card-body">
                  <span className="services-card-index" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <motion.div
                    className="services-card-icon"
                    whileHover={{
                      scale: 1.08,
                      rotate: -4,
                      transition: { type: "spring", stiffness: 420, damping: 16 },
                    }}
                  >
                    <ServiceIcon index={serviceIndex} />
                  </motion.div>

                  <h3 className="services-card-title">{item.title}</h3>
                  <p className="services-card-desc">{item.desc}</p>

                  <motion.span className="services-card-line" variants={lineVariants} aria-hidden />
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

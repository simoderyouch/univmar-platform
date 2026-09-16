"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { FEATURED_PROJECTS } from "@/data/featuredProjects";
import { publicAssetUrl } from "@/lib/publicAsset";
import { useLocalePath } from "@/lib/i18n";

type FeaturedItem = { title: string; tag: string; subtitle?: string };

type FeaturedProjectsContent = {
  eyebrow: string;
  title: string;
  homeSubtitle: string;
  viewAll: string;
  featured: FeaturedItem[];
};

const sectionViewport = { once: false, margin: "-120px" } as const;

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.72, ease: "easeOut" } },
};

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 44, scale: 0.94, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.68, ease: "easeOut" } },
};

export default function FeaturedProjectsSection({ content }: { content: FeaturedProjectsContent }) {
  const lp = useLocalePath();

  return (
    <section className="home-featured-projects" aria-labelledby="featured-projects-heading">
      <div className="home-featured-projects__inner">
        <motion.div
          className="home-featured-projects__header"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
        >
          <div>
            <p className="eyebrow">{content.eyebrow}</p>
            <h2 id="featured-projects-heading" className="home-featured-projects__title">
              {content.title}
            </h2>
            <p className="home-featured-projects__subtitle">{content.homeSubtitle}</p>
          </div>
          <Link href={lp("/projets")} className="btn-outline home-featured-projects__cta">
            {content.viewAll} →
          </Link>
        </motion.div>

        <motion.div className="home-featured-projects__grid" variants={gridVariants} initial="hidden" whileInView="visible" viewport={sectionViewport}>
          {FEATURED_PROJECTS.map((project, i) => {
            const item = content.featured[i];
            if (!item) return null;

            return (
              <motion.article
                key={project.id}
                className="home-featured-projects__card"
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.025 }}
                whileTap={{ scale: 0.985 }}
              >
                <Link href={lp(`/projets#${project.id}`)} className="home-featured-projects__link">
                  <div className="home-featured-projects__media">
                    <img
                      src={publicAssetUrl(project.image)}
                      alt={item.title}
                      title={item.title}
                      className="home-featured-projects__img"
                      loading="lazy"
                    />
                  </div>
                  <div className="home-featured-projects__body">
                    <span className="home-featured-projects__tag">{item.tag}</span>
                    <h3 className="home-featured-projects__name">{item.title}</h3>
                    {item.subtitle ? (
                      <p className="home-featured-projects__desc">{item.subtitle}</p>
                    ) : null}
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

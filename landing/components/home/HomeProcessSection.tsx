"use client";

import { motion, type Variants } from "framer-motion";
import { useLang } from "@/lib/i18n";

const sectionViewport = { once: false, margin: "-120px" } as const;

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.72, ease: "easeOut" } },
};

const stepsVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.12 } },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 42, scale: 0.95, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.62, ease: "easeOut" } },
};

export default function HomeProcessSection() {
  const { t } = useLang();
  const content = t.homePage.process;
  const [titleLine1, titleLine2] = content.title.split("\n");

  return (
    <section className="home-process" aria-labelledby="home-process-heading">
      <div className="home-process__inner">
        <motion.div
          className="home-process__header"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
        >
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 id="home-process-heading" className="home-process__title">
            {titleLine1}
            {titleLine2 ? (
              <>
                <br />
                <em>{titleLine2}</em>
              </>
            ) : null}
          </h2>
          <p className="home-process__intro">{content.intro}</p>
        </motion.div>

        <motion.div className="home-process__steps" variants={stepsVariants} initial="hidden" whileInView="visible" viewport={sectionViewport}>
          {content.steps.map((step, i) => (
            <motion.article
              key={step.num}
              className="home-process__step"
              variants={stepVariants}
              whileHover={{ y: -8, scale: 1.025 }}
            >
              <span className="home-process__num">{step.num}</span>
              <h3 className="home-process__step-title">{step.title}</h3>
              <p className="home-process__step-desc">{step.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "motion/react";
import { couple, hero, START_DATE } from "@/content/content";
import { HeroPetals } from "./HeroPetals";

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: "easeOut" as const },
  };
}

export function Hero() {
  const themName = couple.them;
  const youName = couple.you;
  const tagline = hero.tagline;
  const [year, month, day] = START_DATE.split("-").map(Number);
  const startDate = new Date(year, month - 1, day).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      aria-label="Hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24"
    >
      <HeroPetals />

      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-md">
        <motion.div {...fadeUp(0)} className="flex items-center gap-3">
          <span className="block h-px w-10" style={{ background: "var(--rose)" }} />
          <span style={{ color: "var(--rose)", fontFamily: "var(--font-fraunces)", fontSize: "1.25rem" }}>
            ♥
          </span>
          <span className="block h-px w-10" style={{ background: "var(--rose)" }} />
        </motion.div>

        <motion.h1
          {...fadeUp(0.15)}
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--ink)" }}
          className="text-5xl sm:text-6xl leading-tight"
        >
          {youName}{" "}
          <span style={{ color: "var(--rose)" }}>&</span>{" "}
          {themName}
        </motion.h1>

        <motion.p
          {...fadeUp(0.3)}
          style={{
            fontFamily: "var(--font-caveat)",
            color: "var(--ink-soft)",
            fontSize: "1.5rem",
            lineHeight: 1.5,
          }}
        >
          &ldquo;{tagline}&rdquo;
        </motion.p>

        <motion.p
          {...fadeUp(0.45)}
          style={{ fontFamily: "var(--font-nunito)", color: "var(--ink-soft)" }}
          className="text-sm tracking-widest uppercase"
        >
          Together since {startDate}
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-8"
        style={{ color: "var(--ink-soft)" }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { START_DATE } from "@/content/content";

function daysTogether(): number {
  const [year, month, day] = START_DATE.split("-").map(Number);
  const start = new Date(year, month - 1, day).getTime();
  const now = new Date();
  const todayLocal = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  return Math.floor((todayLocal - start) / (1000 * 60 * 60 * 24));
}

function formatPeriod(days: number): string {
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  if (months === 0) return `${days} day${days !== 1 ? "s" : ""}`;
  return `${months} month${months !== 1 ? "s" : ""} and ${remainingDays} day${remainingDays !== 1 ? "s" : ""}`;
}

export function Counter() {
  const [days, setDays] = useState<number | null>(null);

  // Computed on the client after mount on purpose: the value depends on the
  // current date, so rendering it on the server would cause a hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDays(daysTogether());
  }, []);

  return (
    <section
      aria-label="Days together"
      className="py-24 px-6 text-center"
      style={{ background: "var(--blush)" }}
    >
      <div className="max-w-sm mx-auto">
        {/* heading */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <div className="flex items-center gap-3">
            <span className="block h-px w-10" style={{ background: "var(--rose)" }} />
            <span style={{ color: "var(--rose)", fontFamily: "var(--font-fraunces)", fontSize: "1.25rem" }}>
              ♥
            </span>
            <span className="block h-px w-10" style={{ background: "var(--rose)" }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--ink)" }}
          >
            Days together
          </h2>
        </div>

        {days !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <p
              className="leading-none"
              style={{
                fontFamily: "var(--font-fraunces)",
                color: "var(--rose)",
                fontSize: "clamp(4rem, 20vw, 8rem)",
              }}
            >
              {days}
            </p>
            <p
              className="text-xl mt-2"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--ink-soft)" }}
            >
              days together
            </p>
            <p
              className="text-sm mt-1"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--ink-soft)" }}
            >
              {formatPeriod(days)} of love
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

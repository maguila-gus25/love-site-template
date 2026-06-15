"use client";

import { motion } from "motion/react";
import { moments } from "@/content/content";

function formatDate(date: string): string {
  if (date.startsWith("[")) return "";
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function Timeline() {
  return (
    <section aria-label="How it all started" className="py-24 px-6">
      <div className="max-w-xl mx-auto">
        {/* heading */}
        <div className="flex flex-col items-center gap-3 mb-16">
          <div className="flex items-center gap-3">
            <span className="block h-px w-10" style={{ background: "var(--rose)" }} />
            <span style={{ color: "var(--rose)", fontFamily: "var(--font-fraunces)", fontSize: "1.25rem" }}>
              ♥
            </span>
            <span className="block h-px w-10" style={{ background: "var(--rose)" }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl text-center"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--ink)" }}
          >
            How it all started
          </h2>
        </div>

        {/* timeline */}
        <div className="relative">
          {/* vertical line — centered on the marker column (w-11 = 2.75rem, half = 1.375rem) */}
          <span
            className="absolute top-0 bottom-0 w-0.5"
            style={{ left: "1.375rem", background: "var(--blush)" }}
          />

          {moments.map((m, i) => {
            const isAnchor = m.anchor === true;
            const dateStr = formatDate(m.date);

            return (
              <motion.div
                key={i}
                className="relative flex items-start gap-5 mb-10 last:mb-0"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" as const }}
              >
                {/* marker column — w-11 so its center aligns with the line */}
                <div className="flex-shrink-0 w-11 flex justify-center pt-4 z-10">
                  <span
                    className="w-4 h-4 rounded-full border-2"
                    style={{
                      background: isAnchor ? "var(--rose)" : "var(--surface)",
                      borderColor: "var(--rose)",
                    }}
                  />
                </div>

                {/* card */}
                <div
                  className="flex-1 p-5 rounded-2xl"
                  style={{
                    background: isAnchor ? "var(--blush)" : "var(--surface)",
                    boxShadow: "0 2px 12px rgba(59,47,42,0.06)",
                  }}
                >
                  {dateStr && (
                    <p
                      className="text-xs mb-1 uppercase tracking-wide"
                      style={{ fontFamily: "var(--font-nunito)", color: "var(--ink-soft)" }}
                    >
                      {dateStr}
                    </p>
                  )}
                  <h3
                    className={isAnchor ? "text-xl mb-2" : "text-base mb-2 font-semibold"}
                    style={{
                      fontFamily: isAnchor ? "var(--font-fraunces)" : "var(--font-nunito)",
                      color: "var(--ink)",
                    }}
                  >
                    {m.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-nunito)", color: "var(--ink)" }}
                  >
                    {m.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

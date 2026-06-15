"use client";

import { motion } from "motion/react";
import { thingsILove } from "@/content/content";

export function ThingsILove() {
  return (
    <section aria-label="What I love about you" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
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
            Reasons I love you
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {thingsILove.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" as const }}
              className={`p-6 rounded-2xl text-center${i === thingsILove.length - 1 && thingsILove.length % 3 === 1 ? " lg:col-start-2" : ""}`}
              style={{ background: "var(--blush)" }}
            >
              {item.emoji && (
                <div className="text-4xl mb-3" aria-hidden="true">
                  {item.emoji}
                </div>
              )}
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-nunito)", color: "var(--ink)" }}
              >
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

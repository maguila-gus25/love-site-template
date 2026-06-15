"use client";

import { useRef, useState } from "react";
import { motion, useAnimation, useInView } from "motion/react";
import { LETTER } from "@/content/content";

export function Letter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [isOpen, setIsOpen] = useState(false);
  const [animating, setAnimating] = useState(false);

  const flapControls = useAnimation();
  const sealControls = useAnimation();
  const letterControls = useAnimation();

  async function open() {
    setAnimating(true);
    setIsOpen(true);

    // seal pulses and breaks
    await sealControls.start({
      scale: [1, 1.3, 0],
      opacity: [1, 1, 0],
      transition: { duration: 0.5, times: [0, 0.4, 1] },
    });

    // flap opens (retracts top to bottom)
    await flapControls.start({
      scaleY: 0,
      transition: { duration: 0.45, ease: "easeIn" },
    });

    // paper slides out of the envelope
    await letterControls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    });

    setAnimating(false);
  }

  async function close() {
    setAnimating(true);

    // paper slides back in
    await letterControls.start({
      y: -110,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeIn" },
    });

    // flap closes
    await flapControls.start({
      scaleY: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    });

    // seal reappears and pulses
    await sealControls.start({
      scale: [0, 1.3, 1],
      opacity: [0, 1, 1],
      transition: { duration: 0.5, times: [0, 0.3, 1] },
    });

    setIsOpen(false);
    setAnimating(false);
  }

  return (
    <section ref={sectionRef} aria-label="The letter" className="py-24 px-6">
      <div className="max-w-lg mx-auto">

        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-3 mb-6"
        >
          <div className="flex items-center gap-3">
            <span className="block h-px w-10" style={{ background: "var(--rose)" }} />
            <span
              style={{
                color: "var(--rose)",
                fontFamily: "var(--font-fraunces)",
                fontSize: "1.25rem",
              }}
            >
              ♥
            </span>
            <span className="block h-px w-10" style={{ background: "var(--rose)" }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl text-center"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--ink)" }}
          >
            A letter for you
          </h2>
        </motion.div>

        {/* open / close button */}
        <div className="flex justify-center mb-8">
          <motion.button
            onClick={isOpen ? close : open}
            disabled={animating}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: "10px 32px",
              borderRadius: 999,
              border: "1.5px solid var(--rose)",
              background: isOpen ? "var(--rose)" : "transparent",
              color: isOpen ? "white" : "var(--rose)",
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: animating ? "default" : "pointer",
              opacity: animating ? 0.5 : 1,
              transition: "background 0.25s, color 0.25s",
              letterSpacing: "0.02em",
            }}
          >
            {isOpen ? "Close" : "Open"}
          </motion.button>
        </div>

        {/* envelope + letter — layered stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          style={{ position: "relative" }}
        >
          {/* ── layer 2: envelope (on top) ── */}
          <div style={{ position: "relative", zIndex: 2, height: 164 }}>

            {/* envelope body */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: "var(--surface)",
                boxShadow: "0 4px 24px rgba(59,47,42,0.08)",
                overflow: "hidden",
              }}
            >
              {/* bottom-left triangle */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "50%",
                  height: "65%",
                  background: "var(--blush)",
                  clipPath: "polygon(0 100%, 100% 100%, 0 0)",
                  opacity: 0.35,
                }}
              />
              {/* bottom-right triangle */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "50%",
                  height: "65%",
                  background: "var(--blush)",
                  clipPath: "polygon(0 100%, 100% 100%, 100% 0)",
                  opacity: 0.35,
                }}
              />
            </div>

            {/* top flap */}
            <motion.div
              animate={flapControls}
              initial={{ scaleY: 1 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "58%",
                background: "var(--blush)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformOrigin: "top center",
                zIndex: 2,
              }}
            />

            {/* heart seal */}
            <motion.div
              animate={sealControls}
              initial={{ scale: 1, opacity: 1 }}
              style={{
                position: "absolute",
                top: "calc(52% - 16px)",
                left: "calc(50% - 16px)",
                zIndex: 3,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="var(--rose)"
                style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.25))" }}
              >
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
              </svg>
            </motion.div>
          </div>

          {/* ── layer 1: letter (slides out from inside the envelope) ── */}
          <motion.div
            animate={letterControls}
            initial={{ y: -110, opacity: 0 }}
            style={{ position: "relative", zIndex: 1, marginTop: -8 }}
          >
            <div
              className="p-8 rounded-b-2xl"
              style={{
                background: "var(--surface)",
                boxShadow: "0 6px 24px rgba(59,47,42,0.09)",
                borderTop: "1px solid var(--blush)",
              }}
            >
              <p
                className="leading-relaxed whitespace-pre-line"
                style={{
                  fontFamily: "var(--font-caveat)",
                  color: "var(--ink)",
                  fontSize: "1.25rem",
                  lineHeight: 1.7,
                }}
              >
                {LETTER}
              </p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import { couple, dateVoucherSteps } from "@/content/content";

const WHEEL_SIZE = 256;
const WHEEL_CENTER = WHEEL_SIZE / 2;
const WHEEL_RADIUS = 112;
const EXTRA_TURNS = 5;

function pointOnWheel(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: WHEEL_CENTER + radius * Math.cos(rad),
    y: WHEEL_CENTER + radius * Math.sin(rad),
  };
}

function slicePath(startAngle: number, endAngle: number, radius: number) {
  const p0 = pointOnWheel(startAngle, radius);
  const p1 = pointOnWheel(endAngle, radius);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${WHEEL_CENTER} ${WHEEL_CENTER} L ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`;
}

export function DateVoucher() {
  const [screen, setScreen] = useState<null | "intro" | "wheels">(null);
  const [results, setResults] = useState<string[]>([]);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const step = results.length;
  const finished = step >= dateVoucherSteps.length;
  const currentStep = dateVoucherSteps[step];

  useEffect(() => {
    if (!screen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setScreen(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [screen]);

  function next() {
    if (currentResult === null) return;
    setResults((prev) => [...prev, currentResult]);
    setCurrentResult(null);
  }

  function restart() {
    setResults([]);
    setCurrentResult(null);
    setScreen("wheels");
  }

  async function downloadPdf() {
    if (!ticketRef.current || generatingPdf) return;
    setGeneratingPdf(true);
    try {
      await document.fonts.ready;
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: "#FBF4EC",
        scale: 2,
      });
      const image = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("date-voucher.pdf");
    } finally {
      setGeneratingPdf(false);
    }
  }

  return (
    <section aria-label="Surprise date voucher" className="py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-lg mx-auto flex flex-col items-center gap-4"
      >
        <p style={{ fontFamily: "var(--font-script)", fontSize: "1.3rem", color: "var(--ink-soft)" }}>
          psst… one more surprise
        </p>
        <motion.button
          onClick={() => setScreen("intro")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          animate={{
            boxShadow: [
              "0 10px 28px rgba(201,96,90,0.30)",
              "0 14px 40px rgba(201,96,90,0.70)",
              "0 10px 28px rgba(201,96,90,0.30)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          style={{
            padding: "16px 48px",
            borderRadius: 999,
            border: "none",
            background: "var(--rose)",
            color: "white",
            fontFamily: "var(--font-fraunces)",
            fontSize: "1.2rem",
            letterSpacing: "0.18em",
            cursor: "pointer",
          }}
        >
          ✦ PRESS ME ✦
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {screen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setScreen(null)}
            role="presentation"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 60,
              background: "rgba(59,47,42,0.55)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <motion.div
              key="modal"
              layout
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.3, ease: "easeOut", layout: { duration: 0.35, ease: "easeOut" } }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Date voucher"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 420,
                maxHeight: "88vh",
                overflowY: "auto",
                background: "var(--bg)",
                borderRadius: 28,
                boxShadow: "0 28px 72px rgba(0,0,0,0.4)",
                padding: "32px 22px 28px",
              }}
            >
              <button
                onClick={() => setScreen(null)}
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "none",
                  background: "var(--blush)",
                  color: "var(--rose)",
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>

              {screen === "intro" ? (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-col items-center gap-6 text-center"
                >
                  <span style={{ fontSize: "2.6rem" }}>🎟️</span>
                  <div className="flex flex-col gap-2">
                    <h3
                      style={{
                        fontFamily: "var(--font-fraunces)",
                        fontSize: "1.9rem",
                        color: "var(--ink)",
                        lineHeight: 1.15,
                      }}
                    >
                      Your Date Voucher
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "1rem",
                        color: "var(--ink-soft)",
                        lineHeight: 1.65,
                        maxWidth: 320,
                      }}
                    >
                      You&apos;re holding a full date — but the details are still a mystery.
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        color: "var(--ink-soft)",
                        lineHeight: 1.65,
                        maxWidth: 320,
                        marginTop: 4,
                      }}
                    >
                      Across <strong style={{ color: "var(--ink)" }}>{dateVoucherSteps.length} wheels</strong> you&apos;ll decide how our next date will go!
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-script)",
                        fontSize: "1.1rem",
                        color: "var(--rose)",
                        marginTop: 6,
                      }}
                    >
                      Ready to find out what&apos;s in store?
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setScreen("wheels")}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      padding: "12px 32px",
                      borderRadius: 999,
                      border: "none",
                      background: "var(--rose)",
                      color: "white",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "1rem",
                      cursor: "pointer",
                      boxShadow: "0 8px 22px rgba(201,96,90,0.35)",
                    }}
                  >
                    Spin the wheels →
                  </motion.button>
                </motion.div>
              ) : !finished ? (
                <motion.div layout className="flex flex-col items-center gap-5">
                  <div className="flex flex-col items-center gap-1">
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.78rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--ink-soft)",
                      }}
                    >
                      Wheel {step + 1} of {dateVoucherSteps.length}
                    </span>
                    <h3
                      className="text-2xl text-center"
                      style={{ fontFamily: "var(--font-fraunces)", color: "var(--ink)" }}
                    >
                      {currentStep.question}
                    </h3>
                  </div>

                  <Wheel
                    key={step}
                    options={currentStep.options}
                    fixedResult={currentStep.fixedResult}
                    onResult={setCurrentResult}
                  />

                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {currentStep.options.map((option, i) => (
                      <span
                        key={option}
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.82rem",
                          color: option === currentResult ? "var(--rose)" : "var(--ink-soft)",
                          fontWeight: option === currentResult ? 700 : 400,
                        }}
                      >
                        {i + 1}. {option}
                      </span>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {currentResult && (
                      <motion.div
                        key={currentResult}
                        initial={{ opacity: 0, scale: 0.85, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="flex flex-col items-center gap-3"
                      >
                        <p
                          className="text-center"
                          style={{ fontFamily: "var(--font-script)", fontSize: "1.5rem", color: "var(--rose)" }}
                        >
                          🎉 {currentResult}
                        </p>
                        <motion.button
                          onClick={next}
                          whileTap={{ scale: 0.96 }}
                          style={{
                            padding: "10px 28px",
                            borderRadius: 999,
                            border: "1.5px solid var(--rose)",
                            background: "var(--rose)",
                            color: "white",
                            fontFamily: "var(--font-body)",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            cursor: "pointer",
                          }}
                        >
                          {step === dateVoucherSteps.length - 1 ? "See the voucher 🎟️" : "Next wheel →"}
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <h3
                    className="text-2xl text-center"
                    style={{ fontFamily: "var(--font-fraunces)", color: "var(--ink)" }}
                  >
                    Your date voucher is ready 🎟️
                  </h3>

                  <div
                    ref={ticketRef}
                    style={{
                      position: "relative",
                      width: "100%",
                      maxWidth: 340,
                      background: "var(--surface)",
                      borderRadius: 20,
                      padding: "30px 26px",
                      boxShadow: "0 10px 36px rgba(59,47,42,0.14)",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: -13,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "var(--bg)",
                      }}
                    />
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        right: -13,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "var(--bg)",
                      }}
                    />

                    <div className="text-center" style={{ marginBottom: 14 }}>
                      <p style={{ fontFamily: "var(--font-script)", fontSize: "1.35rem", color: "var(--rose)" }}>
                        {couple.you} & {couple.them}
                      </p>
                      <h4
                        style={{
                          fontFamily: "var(--font-fraunces)",
                          fontSize: "1.7rem",
                          letterSpacing: "0.12em",
                          color: "var(--ink)",
                        }}
                      >
                        DATE · VOUCHER
                      </h4>
                    </div>

                    <div style={{ borderTop: "1.5px dashed var(--blush)" }} />

                    <ul className="flex flex-col" style={{ gap: 10, padding: "16px 0" }}>
                      {dateVoucherSteps.map((item, i) => (
                        <li
                          key={item.question}
                          className="flex items-baseline justify-between"
                          style={{ gap: 14, fontFamily: "var(--font-body)", fontSize: "0.92rem" }}
                        >
                          <span style={{ color: "var(--ink-soft)" }}>{item.question}</span>
                          <span style={{ color: "var(--ink)", fontWeight: 700, textAlign: "right" }}>
                            {results[i]}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div style={{ borderTop: "1.5px dashed var(--blush)" }} />

                    <p
                      className="text-center"
                      style={{
                        fontFamily: "var(--font-script)",
                        fontSize: "1.1rem",
                        color: "var(--rose)",
                        marginTop: 14,
                      }}
                    >
                      Valid for as long as our love lasts ♥
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <motion.button
                      onClick={restart}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        padding: "10px 24px",
                        borderRadius: 999,
                        border: "1.5px solid var(--rose)",
                        background: "transparent",
                        color: "var(--rose)",
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        fontSize: "0.92rem",
                        cursor: "pointer",
                      }}
                    >
                      Spin again 🔄
                    </motion.button>
                    <motion.button
                      onClick={downloadPdf}
                      disabled={generatingPdf}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        padding: "10px 24px",
                        borderRadius: 999,
                        border: "none",
                        background: "var(--rose)",
                        color: "white",
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        fontSize: "0.92rem",
                        cursor: generatingPdf ? "default" : "pointer",
                        opacity: generatingPdf ? 0.65 : 1,
                      }}
                    >
                      {generatingPdf ? "Generating…" : "Download as PDF 🎟️"}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const PARTICLES = ["🎉", "✨", "💕", "⭐"];

function makeConfetti() {
  return Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * 360 + (Math.random() * 24 - 12);
    const distance = 70 + Math.random() * 50;
    const rad = (angle * Math.PI) / 180;
    return {
      id: i,
      emoji: PARTICLES[Math.floor(Math.random() * PARTICLES.length)],
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance,
      rotation: Math.random() * 200 - 100,
      delay: Math.random() * 0.18,
    };
  });
}

function Wheel({
  options,
  fixedResult,
  onResult,
}: {
  options: string[];
  fixedResult?: string;
  onResult: (option: string) => void;
}) {
  const controls = useAnimation();
  const accumulatedRotation = useRef(0);
  const [state, setState] = useState<"idle" | "spinning" | "stopped">("idle");
  const [resultIndex, setResultIndex] = useState<number | null>(null);
  const [burstId, setBurstId] = useState(0);
  const [confetti, setConfetti] = useState<ReturnType<typeof makeConfetti>>([]);

  async function spin() {
    if (state !== "idle") return;
    setState("spinning");
    setResultIndex(null);

    const n = options.length;
    const sectorAngle = 360 / n;
    const drawnIndex = fixedResult
      ? Math.max(options.indexOf(fixedResult), 0)
      : Math.floor(Math.random() * n);
    const sectorMid = drawnIndex * sectorAngle + sectorAngle / 2;
    const desiredFinalAngle = (360 - sectorMid) % 360;
    const currentMod = ((accumulatedRotation.current % 360) + 360) % 360;
    const delta = (desiredFinalAngle - currentMod + 360) % 360;
    const newRotation = accumulatedRotation.current + 360 * EXTRA_TURNS + delta;
    accumulatedRotation.current = newRotation;

    await controls.start({
      rotate: newRotation,
      transition: { duration: 3.8, ease: [0.13, 0.7, 0.16, 1] },
    });

    setState("stopped");
    setResultIndex(drawnIndex);
    setConfetti(makeConfetti());
    setBurstId((b) => b + 1);
    onResult(options[drawnIndex]);
  }

  const sectorAngle = 360 / options.length;

  return (
    <div className="flex flex-col items-center gap-5">
      <div style={{ position: "relative", width: WHEEL_SIZE, height: WHEEL_SIZE }}>
        {/* fixed pointer */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -2,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderTop: "17px solid var(--gold)",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.28))",
            zIndex: 5,
          }}
        />
        <motion.svg
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
          animate={controls}
          initial={{ rotate: 0 }}
          style={{
            transformOrigin: "50% 50%",
            display: "block",
            filter: "drop-shadow(0 10px 28px rgba(59,47,42,0.22))",
          }}
        >
          {options.map((_, i) => {
            const start = i * sectorAngle;
            const end = start + sectorAngle;
            const mid = start + sectorAngle / 2;
            const pos = pointOnWheel(mid, WHEEL_RADIUS * 0.7);
            return (
              <g key={i}>
                <path
                  d={slicePath(start, end, WHEEL_RADIUS)}
                  fill={i % 2 === 0 ? "var(--rose)" : "var(--ink)"}
                  stroke="var(--bg)"
                  strokeWidth={2}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontFamily="var(--font-fraunces)"
                  fontSize={18}
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
          {state === "stopped" && resultIndex !== null && (
            <motion.path
              key={`glow-${burstId}`}
              d={slicePath(resultIndex * sectorAngle, (resultIndex + 1) * sectorAngle, WHEEL_RADIUS)}
              fill="var(--gold)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.55, 0, 0.55, 0, 0.55, 0] }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              style={{ pointerEvents: "none" }}
            />
          )}
          <circle cx={WHEEL_CENTER} cy={WHEEL_CENTER} r={WHEEL_RADIUS} fill="none" stroke="var(--gold)" strokeWidth={3} />
          <circle cx={WHEEL_CENTER} cy={WHEEL_CENTER} r={28} fill="var(--surface)" stroke="var(--gold)" strokeWidth={2} />
          <text x={WHEEL_CENTER} y={WHEEL_CENTER} textAnchor="middle" dominantBaseline="central" fill="var(--rose)" fontSize={20}>
            ♥
          </text>
        </motion.svg>

        <AnimatePresence>
          {state === "stopped" && (
            <div
              key={`confetti-${burstId}`}
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 6,
              }}
            >
              {confetti.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.8 }}
                  animate={{ x: p.x, y: p.y, opacity: [1, 1, 0], rotate: p.rotation, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, delay: p.delay, ease: "easeOut" }}
                  style={{ position: "absolute", fontSize: "1.1rem" }}
                >
                  {p.emoji}
                </motion.span>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={spin}
        disabled={state !== "idle"}
        whileTap={state === "idle" ? { scale: 0.96 } : undefined}
        style={{
          padding: "11px 36px",
          borderRadius: 999,
          border: "1.5px solid var(--rose)",
          background: state === "idle" ? "var(--rose)" : "transparent",
          color: state === "idle" ? "white" : "var(--ink-soft)",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: "1rem",
          cursor: state === "idle" ? "pointer" : "default",
          opacity: state === "spinning" ? 0.65 : 1,
          transition: "background 0.25s, color 0.25s, opacity 0.2s",
        }}
      >
        {state === "spinning" ? "Spinning…" : state === "stopped" ? "Stopped! 🎯" : "Spin 🎲"}
      </motion.button>
    </div>
  );
}

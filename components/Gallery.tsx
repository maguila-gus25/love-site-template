"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { photos } from "@/content/content";
import type { Photo } from "@/content/content";

const ROTATIONS = [-2, 1.5, -3, 2, -1, 2.5, -1.5, 3];

function PolaroidCard({
  photo,
  index,
  onClick,
}: {
  photo: Photo;
  index: number;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const isPlaceholder = photo.caption.startsWith("[");

  return (
    <motion.div
      layoutId={`polaroid-${index}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: "easeOut" as const }}
      style={{ transform: `rotate(${rotation}deg)`, cursor: "pointer" }}
      onClick={onClick}
    >
      {/* polaroid frame */}
      <div
        className="p-3 rounded-sm"
        style={{
          background: "var(--surface)",
          boxShadow:
            "0 4px 16px rgba(59,47,42,0.12), 0 1px 4px rgba(59,47,42,0.06)",
        }}
      >
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1 / 1", background: "var(--blush)" }}>
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{ background: "var(--blush)" }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ color: "var(--ink-soft)" }}
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span
                style={{
                  fontFamily: "var(--font-caveat)",
                  color: "var(--ink-soft)",
                  fontSize: "0.9rem",
                }}
              >
                your photo here
              </span>
            </div>
          )}
        </div>

        {/* caption inside the white area, vertically centered */}
        <div style={{ height: "56px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p
            className="text-center"
            style={{
              fontFamily: "var(--font-caveat)",
              color: "var(--ink-soft)",
              fontSize: "1rem",
              lineHeight: 1.3,
            }}
          >
            {isPlaceholder ? "— — —" : photo.caption}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Lightbox({
  photo,
  index,
  onClose,
}: {
  photo: Photo;
  index: number;
  onClose: () => void;
}) {
  return (
    <>
      {/* backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-40"
        style={{ background: "rgba(30, 20, 18, 0.88)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      {/* centering wrapper — not a motion element, so it doesn't conflict with layoutId */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ pointerEvents: "none" }}
      >
        <motion.div
          key="lightbox"
          layoutId={`polaroid-${index}`}
          className="p-4 pb-10 rounded-sm"
          style={{
            background: "var(--surface)",
            boxShadow: "0 32px 96px rgba(59,47,42,0.4)",
            width: "min(88vw, 480px)",
            pointerEvents: "auto",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
        >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.alt}
          className="w-full rounded-sm object-cover"
          style={{ maxHeight: "70vh" }}
        />
        <p
          className="text-center mt-3"
          style={{
            fontFamily: "var(--font-caveat)",
            color: "var(--ink-soft)",
            fontSize: "1.3rem",
            lineHeight: 1.3,
          }}
        >
          {photo.caption}
        </p>
        </motion.div>
      </div>
    </>
  );
}

export function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  return (
    <section
      aria-label="Photo gallery"
      className="py-24 px-6"
      style={{ background: "var(--surface)" }}
    >
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
            Our moments
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 items-start">
          {photos.map((photo, i) => (
            <PolaroidCard
              key={i}
              photo={photo}
              index={i}
              onClick={() => setSelectedIndex(i)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            photo={photos[selectedIndex]}
            index={selectedIndex}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

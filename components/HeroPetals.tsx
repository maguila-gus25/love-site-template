"use client";

import { motion } from "motion/react";

const PETALS = [
  { id: 1, left: 8, delay: 0, duration: 9, size: 16 },
  { id: 2, left: 18, delay: 2.1, duration: 11, size: 12 },
  { id: 3, left: 33, delay: 0.8, duration: 8.5, size: 20 },
  { id: 4, left: 47, delay: 3.2, duration: 10, size: 14 },
  { id: 5, left: 58, delay: 1.5, duration: 12, size: 18 },
  { id: 6, left: 68, delay: 4.0, duration: 9.5, size: 13 },
  { id: 7, left: 79, delay: 2.7, duration: 11.5, size: 15 },
  { id: 8, left: 89, delay: 0.3, duration: 8, size: 17 },
  { id: 9, left: 25, delay: 5.1, duration: 10.5, size: 11 },
  { id: 10, left: 72, delay: 3.8, duration: 13, size: 19 },
];

function Petal({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.5)}
      viewBox="0 0 20 30"
      fill="none"
    >
      <path
        d="M10 2C14 6 17 12 16 18C15 24 12 27 10 28C8 27 5 24 4 18C3 12 6 6 10 2Z"
        fill="var(--blush)"
        opacity="0.75"
      />
    </svg>
  );
}

export function HeroPetals() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {PETALS.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{ left: `${petal.left}%`, top: 0 }}
          animate={{ y: "110vh", rotate: 360 }}
          transition={{
            y: {
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: "linear",
            },
            rotate: {
              duration: petal.duration * 1.3,
              delay: petal.delay,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          <Petal size={petal.size} />
        </motion.div>
      ))}
    </div>
  );
}

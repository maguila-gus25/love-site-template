"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from "motion/react";
import { vinylPlaylist } from "@/content/content";

declare global {
  interface Window {
    onSpotifyIframeApiReady: (api: SpotifyIFrameAPI) => void;
  }
}
interface SpotifyIFrameAPI {
  createController(
    element: HTMLElement,
    options: { uri: string },
    callback: (controller: SpotifyController) => void
  ): void;
}
interface SpotifyPlaybackEvent {
  data: { isPaused: boolean; position: number; duration: number; playingURI: string };
}
interface SpotifyController {
  play(): void;
  togglePlay(): void;
  loadUri(uri: string): void;
  seek(positionMs: number): void;
  addListener(event: "playback_update", cb: (e: SpotifyPlaybackEvent) => void): void;
  destroy(): void;
}

// tonearm angles (CSS rotate) — rough visual direction of each:
// REST ≈ pointing left; OUTER (1st track) ≈ left and slightly down;
// INNER (last track) keeps swinging down/inward, like a real turntable
// needle advancing toward the center of the disc.
const TONEARM_REST_ANGLE = 70;
const TONEARM_OUTER_ANGLE = 50;
const TONEARM_INNER_ANGLE = 31;

function tonearmAngleForTrack(index: number, total: number) {
  if (total <= 1) return TONEARM_OUTER_ANGLE;
  const progress = index / (total - 1);
  return TONEARM_OUTER_ANGLE + progress * (TONEARM_INNER_ANGLE - TONEARM_OUTER_ANGLE);
}

export function Vinyl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const controllerRef = useRef<SpotifyController | null>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  // Spotify resumes tracks from the saved position (same logic as podcasts);
  // we store the uri we just requested so we can reset the position as soon as
  // it starts playing — only once, so it doesn't interfere with pause/resume.
  const pendingResetUriRef = useRef<string | null>(null);
  const currentTrack = vinylPlaylist[currentTrackIndex];

  // disc rotation via useAnimationFrame — no snap/jump on pause/resume
  const rotation = useMotionValue(0);
  const rotationAccum = useRef(0);
  const isPlayingRef = useRef(false);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useAnimationFrame((_t, delta) => {
    if (!isPlayingRef.current) return;
    rotationAccum.current += delta * 0.072; // 360° / 5000ms
    rotation.set(rotationAccum.current);
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      if (!embedRef.current) return;
      IFrameAPI.createController(
        embedRef.current,
        { uri: vinylPlaylist[0]?.uri || "spotify:track:2plbrEY59IikOBgBGLjaoe" },
        (controller) => {
          controllerRef.current = controller;
          pendingResetUriRef.current = vinylPlaylist[0]?.uri ?? null;
          setReady(true);
          controller.addListener("playback_update", (e) => {
            setIsPlaying(!e.data.isPaused);
            const { playingURI, position } = e.data;
            if (pendingResetUriRef.current && playingURI === pendingResetUriRef.current) {
              pendingResetUriRef.current = null;
              if (position > 1000) controller.seek(0);
            }
          });
        }
      );
    };

    return () => {
      script.remove();
      controllerRef.current?.destroy();
    };
  }, []);

  function handlePlayPause() {
    controllerRef.current?.togglePlay();
  }

  function goToTrack(index: number) {
    const track = vinylPlaylist[index];
    if (!track || !controllerRef.current) return;
    pendingResetUriRef.current = track.uri;
    controllerRef.current.loadUri(track.uri);
    controllerRef.current.play();
    setCurrentTrackIndex(index);
  }

  function handlePrevious() {
    goToTrack(currentTrackIndex === 0 ? vinylPlaylist.length - 1 : currentTrackIndex - 1);
  }

  function handleNext() {
    goToTrack(currentTrackIndex === vinylPlaylist.length - 1 ? 0 : currentTrackIndex + 1);
  }

  return (
    <section aria-label="Our playlist" className="py-24 px-6">
      <div className="max-w-sm mx-auto flex flex-col items-center gap-8">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-3"
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
              ♫
            </span>
            <span className="block h-px w-10" style={{ background: "var(--rose)" }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl text-center"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--ink)" }}
          >
            Our playlist
          </h2>
        </motion.div>

        {/* turntable */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          style={{
            position: "relative",
            width: 280,
            height: 280,
            borderRadius: 16,
            background: "linear-gradient(145deg, #2d1f1a, #1a1008)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* platter recess — centered: (280-210)/2 = 35 */}
          <div
            style={{
              position: "absolute",
              top: 35,
              left: 35,
              width: 210,
              height: 210,
              borderRadius: "50%",
              background: "radial-gradient(circle, #1a1a1a 0%, #111 100%)",
              boxShadow: "inset 0 4px 16px rgba(0,0,0,0.8)",
            }}
          />

          {/* vinyl disc — centered: (280-196)/2 = 42 */}
          <motion.div
            style={{
              rotate: rotation,
              position: "absolute",
              top: 42,
              left: 42,
              width: 196,
              height: 196,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #2a2a2a 0%, #1a1a1a 35%, #222 45%, #1a1a1a 55%, #222 65%, #1a1a1a 75%, #222 85%, #1a1a1a 100%)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* grooves */}
            {[20, 38, 56].map((inset) => (
              <div
                key={inset}
                style={{
                  position: "absolute",
                  inset,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.05)",
                  pointerEvents: "none",
                }}
              />
            ))}
            {/* label */}
            <div
              style={{
                position: "relative",
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: "var(--rose)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontFamily: "var(--font-caveat)",
                  fontSize: "1.6rem",
                  lineHeight: 1,
                }}
              >
                ♥
              </span>
              {/* spindle hole */}
              <div
                style={{
                  position: "absolute",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#111",
                }}
              />
            </div>
          </motion.div>

          {/* tonearm */}
          <motion.div
            animate={{
              rotate: isPlaying
                ? tonearmAngleForTrack(currentTrackIndex, vinylPlaylist.length)
                : TONEARM_REST_ANGLE,
            }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "6%",
              right: "6%",
              transformOrigin: "top right",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <TonearmSVG />
          </motion.div>
        </motion.div>

        {/* now playing */}
        <div
          style={{
            minHeight: "2.6rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTrackIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ fontFamily: "var(--font-nunito)", color: "var(--ink)", fontSize: "0.95rem" }}
            >
              <span style={{ fontFamily: "var(--font-fraunces)" }}>{currentTrack?.title}</span>
              {" — "}
              <span style={{ color: "var(--ink-soft)" }}>{currentTrack?.artist}</span>
            </motion.p>
          </AnimatePresence>
        </div>

        {/* controls: previous / play-pause / next */}
        <div className="flex items-center justify-center gap-4">
          <motion.button
            onClick={handlePrevious}
            disabled={!ready}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "none",
              background: "var(--blush)",
              color: "var(--rose)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: ready ? "pointer" : "default",
              opacity: ready ? 1 : 0.6,
              transition: "background 0.2s, opacity 0.2s",
            }}
            aria-label="Previous track"
          >
            <PreviousIcon />
          </motion.button>

          <motion.button
            onClick={handlePlayPause}
            disabled={!ready}
            whileTap={{ scale: 0.94 }}
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: "none",
              background: ready ? "var(--rose)" : "var(--blush)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: ready ? "pointer" : "default",
              boxShadow: "0 4px 16px rgba(201,96,90,0.3)",
              transition: "background 0.2s",
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={!ready}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "none",
              background: "var(--blush)",
              color: "var(--rose)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: ready ? "pointer" : "default",
              opacity: ready ? 1 : 0.6,
              transition: "background 0.2s, opacity 0.2s",
            }}
            aria-label="Next track"
          >
            <NextIcon />
          </motion.button>
        </div>

        {/* spotify embed (headless playback engine — kept out of view).
            separate wrapper: Spotify rewrites the styles of the element that
            receives the controller, so it must stay "clean" and the visual
            hiding lives on an outer element it doesn't touch. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clipPath: "inset(50%)",
            whiteSpace: "nowrap",
            border: 0,
            padding: 0,
            margin: -1,
          }}
        >
          <div ref={embedRef} />
        </div>
      </div>
    </section>
  );
}

function TonearmSVG() {
  return (
    <svg
      width="70"
      height="130"
      viewBox="0 0 70 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* pivot base */}
      <circle cx="58" cy="10" r="9" fill="#4a3728" stroke="#6b5040" strokeWidth="1.5" />
      <circle cx="58" cy="10" r="4" fill="#2d1f1a" />
      {/* arm */}
      <path
        d="M52 16 L18 108"
        stroke="#8a7060"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M52 16 L18 108"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* headshell */}
      <path
        d="M18 108 L10 118 L22 122 L26 112 Z"
        fill="#5a4535"
        stroke="#6b5040"
        strokeWidth="1"
      />
      {/* stylus/needle */}
      <line
        x1="16"
        y1="119"
        x2="14"
        y2="129"
        stroke="#aaa"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function PreviousIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="5" width="3" height="14" rx="1" />
      <polygon points="19,5 19,19 8,12" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,5 5,19 16,12" />
      <rect x="16" y="5" width="3" height="14" rx="1" />
    </svg>
  );
}

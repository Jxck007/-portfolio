/**
 * ParticleIntro — choreographs the intro particle states.
 *
 * INTRO_JXCK (stable, centred, visible from the very first frame)
 * → (click) → DETACH (particles loosen + gain Z depth)
 * → SPIRAL (the SAME particles form a volumetric rotating helix)
 * → FACE (particles resolve into the owner avatar at the hero avatar anchor)
 * → HERO_REVEAL (face stabilises → hero content appears around it, no jump)
 *
 * One persistent engine instance drives every state; nothing is remounted or
 * recreated between morphs. Reduced-motion users get a single static JXCK
 * frame and the host (IntroGate) skips the choreography entirely.
 */

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import avatarUrl from "../../assets/images/Avatar.png";
import { getAvatarAnchor } from "../../utils/heroAnchor";
import { ParticleEngine } from "./ParticleEngine";
import {
  generateFaceTargets,
  generateScatterTargets,
  generateSpiralTargets,
  generateTextTargets,
} from "./targets";

export interface ParticleIntroHandle {
  start: () => void;
}

export interface ParticleIntroProps {
  text?: string;
  reducedMotion?: boolean;
  onReveal?: () => void;
}

type IntroState = "text" | "detach" | "spiral" | "face" | "hero";

/**
 * Choreography timeline in ms, measured from start().
 * Restrained cinematic pacing:
 *   JXCK → SPIRAL ≈ 1.2s · SPIRAL dwell ≈ 1.2s · SPIRAL → FACE = 1.2s
 *   FACE settle = 0.6s · hero reveal = 0.6s  (total ≈ 4.3s)
 */
const CHOREO = {
  detachMs: 500, // JXCK loosens (particles detach, gain Z depth)
  spiralAt: 550, // detach → spiral formation begins
  spiralMs: 650, // volumetric helix forms — JXCK → SPIRAL ≈ 1.2s total
  spinAt: 1250, // spiral settled → continuous Y-axis rotation begins
  faceAt: 2450, // spiral dwelled ~1.2s rotating → SPIRAL → FACE
  faceMs: 1200, // face morph duration (also untwists the rotation)
  dwellMs: 600, // face holds before the hero reveal
  revealAt: 4250, // face settled → HERO_REVEAL
  heroMs: 600, // hero scatter duration
} as const;

const ParticleIntro = forwardRef<ParticleIntroHandle, ParticleIntroProps>(
  function ParticleIntro({ text = "JXCK", reducedMotion = false, onReveal }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<ParticleEngine | null>(null);
    const faceImageRef = useRef<HTMLImageElement | null>(null);
    const facePendingRef = useRef(false);
    const startedRef = useRef(false);
    const stateRef = useRef<IntroState>("text");
    const timersRef = useRef<number[]>([]);
    const onRevealRef = useRef(onReveal);
    onRevealRef.current = onReveal;

    // Shared avatar anchor computed in the canvas's own coordinate space (the
    // CSS size of the intro container, not window.innerHeight) so the face
    // lands exactly where the hero avatar will render, even on mobile
    // browsers with dynamic URL bars.
    const computeAnchor = () => {
      const el = containerRef.current;
      return getAvatarAnchor(
        el?.clientWidth || window.innerWidth,
        el?.clientHeight || window.innerHeight
      );
    };

    // Pointer & Touch interaction — enables particle repulsion on desktop and mobile touchscreens
    const mouseActiveRef = { current: false };

    const handlePointerMove = (e: PointerEvent | TouchEvent) => {
      if (stateRef.current !== "text") return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e && e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = (e as PointerEvent).clientX;
        clientY = (e as PointerEvent).clientY;
      } else {
        return;
      }
      const nx = (clientX - rect.left) / rect.width;
      const ny = (clientY - rect.top) / rect.height;
      const eng = engineRef.current;
      if (eng) eng.setMouse(nx, ny);
      mouseActiveRef.current = true;
    };

    const handlePointerLeave = () => {
      const eng = engineRef.current;
      if (eng) eng.setMouse(null, null);
      mouseActiveRef.current = false;
    };

    // Mount-only setup: a session is fully self-contained. Reduced-motion is
    // read synchronously here so the engine is correct even before the host's
    // own matchMedia effect settles, and so a later prop change can never tear
    // down a running choreography (which would strand the intro).
    useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const prefersReduced =
        reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Responsive particle count + capped DPR (rules: mobile-reduced, DPR cap).
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const count = isMobile ? 4500 : 9000;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

      let engine: ParticleEngine | null = null;
      try {
        engine = new ParticleEngine(canvas, { count, dpr, reducedMotion: prefersReduced });
      } catch {
        engine = null; // WebGL unavailable → graceful fallback in start()
      }
      engineRef.current = engine;

      // Re-layout viewport-dependent targets on resize (only when idle).
      const relayout = () => {
        const e = engineRef.current;
        if (!e || e.isMorphing()) return;
        const st = stateRef.current;
        if (st === "text") {
          e.applyTargets(generateTextTargets(text, e.count, e.viewport, isMobile), {
            duration: 0,
          });
        } else if (st === "face") {
          const img = faceImageRef.current;
          if (img) {
            e.applyTargets(generateFaceTargets(img, e.count, e.viewport, computeAnchor()), {
              duration: 0,
            });
          }
        }
      };

      if (engine) {
        engine.onResize(relayout);
        // Duration 0 → JXCK is fully formed and rendered on the very first
        // frame (origin = target), so it is clearly visible before any click.
        engine.applyTargets(generateTextTargets(text, engine.count, engine.viewport, isMobile), {
          duration: 0,
        });
        engine.renderOnce();
        engine.start();
      }

      // Preload the real avatar for the FACE state (local asset, loads fast).
      const avatar = new Image();
      avatar.onload = () => {
        faceImageRef.current = avatar;
        if (facePendingRef.current) {
          facePendingRef.current = false;
          const e = engineRef.current;
          if (e) {
            stateRef.current = "face";
            e.applyTargets(generateFaceTargets(avatar, e.count, e.viewport, computeAnchor()), {
              duration: CHOREO.faceMs / 1000,
              stagger: 0.4,
            });
          }
        }
      };
      avatar.src = avatarUrl;

      // Attach pointer and touch listeners to the container for desktop & mobile interaction
      if (!prefersReduced) {
        container.addEventListener("pointermove", handlePointerMove as EventListener);
        container.addEventListener("pointerleave", handlePointerLeave);
        container.addEventListener("touchstart", handlePointerMove as EventListener, { passive: true });
        container.addEventListener("touchmove", handlePointerMove as EventListener, { passive: true });
        container.addEventListener("touchend", handlePointerLeave);
        container.addEventListener("touchcancel", handlePointerLeave);
      }

      return () => {
        timersRef.current.forEach((id) => window.clearTimeout(id));
        timersRef.current = [];
        container.removeEventListener("pointermove", handlePointerMove as EventListener);
        container.removeEventListener("pointerleave", handlePointerLeave);
        container.removeEventListener("touchstart", handlePointerMove as EventListener);
        container.removeEventListener("touchmove", handlePointerMove as EventListener);
        container.removeEventListener("touchend", handlePointerLeave);
        container.removeEventListener("touchcancel", handlePointerLeave);
        engine?.dispose();
        engineRef.current = null;
        faceImageRef.current = null;
        facePendingRef.current = false;
        startedRef.current = false;
      };
    }, []);

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      // Disable cursor interaction once the choreography begins.
      const e = engineRef.current;
      if (e) e.setMouse(null, null);
      if (!e) {
        // WebGL unavailable → skip the choreography gracefully.
        window.setTimeout(() => onRevealRef.current?.(), 400);
        return;
      }
      e.completeMorph(); // never interrupt a half-formed JXCK

      const t = (ms: number, fn: () => void) => {
        timersRef.current.push(window.setTimeout(fn, ms));
      };

      // STATE: detach — JXCK particles loosen, gain Z depth (radii clamped to
      // the viewport so the burst stays on screen at 320px+).
      const vp = e.viewport;
      stateRef.current = "detach";
      e.applyTargets(
        generateScatterTargets(
          e.count,
          Math.min(2.2, vp.width * 0.3),
          Math.min(3.6, vp.width * 0.5),
          1
        ),
        { duration: CHOREO.detachMs / 1000, stagger: 0.3 }
      );

      // STATE: spiral — the same particles collapse into a volumetric helix.
      t(CHOREO.spiralAt, () => {
        stateRef.current = "spiral";
        e.applyTargets(generateSpiralTargets(e.count, vp), {
          duration: CHOREO.spiralMs / 1000,
          stagger: 0.45,
        });
      });

      // Continuous Y-axis rotation once the helix has formed.
      t(CHOREO.spinAt, () => e.setSpinVelocity(0.5));

      // STATE: face — resolve into the avatar at the hero avatar anchor while
      // the rotation untwists back to 0.
      t(CHOREO.faceAt, () => {
        e.setSpinVelocity(0);
        e.animateSpinTo(0, CHOREO.faceMs / 1000);
        const img = faceImageRef.current;
        if (img) {
          stateRef.current = "face";
          e.applyTargets(generateFaceTargets(img, e.count, e.viewport, computeAnchor()), {
            duration: CHOREO.faceMs / 1000,
            stagger: 0.4,
          });
        } else {
          facePendingRef.current = true; // avatar still loading → onload fires the morph
        }
      });

      // STATE: hero reveal — face settled → host swaps in the hero content at
      // the same anchor while the particles scatter outward and fade.
      t(CHOREO.revealAt, () => {
        onRevealRef.current?.(); // host: warp whoosh → portal swap
        stateRef.current = "hero";
        e.applyTargets(generateScatterTargets(e.count, 7, 10, 0), {
          duration: CHOREO.heroMs / 1000,
          stagger: 0.25,
        });
      });
    };

    useImperativeHandle(ref, () => ({ start }), []);

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full overflow-hidden select-none"
        aria-hidden="true"
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
    );
  }
);

export default ParticleIntro;

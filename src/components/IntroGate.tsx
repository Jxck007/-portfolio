import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import ParticleIntro, { type ParticleIntroHandle } from "./particles/ParticleIntro";
import IntroPlaceholder from "./IntroPlaceholder";
import { startAmbientPad, playWarpWhoosh } from "../utils/audio";
import { useReducedMotion } from "../utils/useReducedMotion";

interface IntroGateProps {
  isEntered?: boolean;
  onEnterStateChange?: (entered: boolean) => void;
}

export default function IntroGate({ isEntered: propIsEntered, onEnterStateChange }: IntroGateProps) {
  const [internalEntered, setInternalEntered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const reducedMotion = useReducedMotion();
  const [heroReady, setHeroReady] = useState(false);
  const introRef = useRef<ParticleIntroHandle>(null);
  const enterTimer1Ref = useRef<NodeJS.Timeout | null>(null);
  const enterTimer2Ref = useRef<NodeJS.Timeout | null>(null);

  const isEntered = propIsEntered !== undefined ? propIsEntered : internalEntered;

  useEffect(() => {
    return () => {
      if (enterTimer1Ref.current) clearTimeout(enterTimer1Ref.current);
      if (enterTimer2Ref.current) clearTimeout(enterTimer2Ref.current);
    };
  }, []);

  // One-time interaction hook to safely initiate ambient pad due to browser autoplay policies
  useEffect(() => {
    const handleInteraction = () => {
      startAmbientPad();
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
    window.addEventListener("pointerdown", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    return () => {
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  // Finish the intro: warp whoosh + portal swap immediately on click/tap
  const performEnter = () => {
    if (isEntered) return;
    setIsTransitioning(true);
    playWarpWhoosh();
    enterTimer1Ref.current = setTimeout(() => {
      setInternalEntered(true);
      if (onEnterStateChange) {
        onEnterStateChange(true);
      }
      enterTimer2Ref.current = setTimeout(() => setHeroReady(true), 50);
    }, 300);
  };

  // Skip multi-stage particle morph choreography and enter immediately on click
  const handleStart = () => {
    if (isEntered || isTransitioning) return;
    performEnter();
  };

  // Keyboard accessibility: Enter or Space starts the intro — but ONLY while
  // the intro is actually showing. Once entered, the listener goes inert so it
  // never hijacks space-to-scroll, form input, or button activation.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEntered || isTransitioning) return;
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTransitioning, isEntered, reducedMotion]);

  // Deep-link / refresh on a route: reveal the hero content
  useEffect(() => {
    if (!isEntered || heroReady) return;
    const t = window.setTimeout(() => setHeroReady(true), 120);
    return () => window.clearTimeout(t);
  }, [isEntered, heroReady]);

  if (isEntered) {
    return (
      <div className="relative w-full min-h-screen bg-transparent text-white cursor-default" id="portfolio-main-root">
        <IntroPlaceholder
          key="placeholder-viewport"
          heroReady={heroReady}
          onReset={() => {
            setInternalEntered(false);
            setHeroReady(false);
            if (onEnterStateChange) {
              onEnterStateChange(false);
            }
            setIsTransitioning(false);
          }}
        />
      </div>
    );
  }

  return (
    <div
      onClick={handleStart}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleStart();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Intro screen, click or tap anywhere to enter portfolio"
      className="relative w-full h-[100dvh] bg-transparent text-white overflow-hidden flex flex-col items-center justify-center select-none cursor-pointer outline-none"
      id="intro-gate-container"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="intro-viewport"
          initial={{ opacity: 1 }}
          exit={
            reducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.02, filter: "blur(8px)" }
          }
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full flex flex-col items-center justify-center p-6 z-10 relative"
        >
          {/* Centered composition: particles + instruction */}
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-end pb-10 sm:pb-12">
            <motion.div
              className="absolute inset-0 w-full h-full flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 1.0 }}
            >
              <div className="absolute w-72 h-24 rounded-full bg-white/5 blur-[80px] pointer-events-none" />
              <ParticleIntro
                ref={introRef}
                reducedMotion={reducedMotion}
                onReveal={performEnter}
              />
            </motion.div>

            {/* Interaction instruction — immediately disappears once transition begins */}
            {!isTransitioning && (
              <div className="relative z-20 pointer-events-none select-none text-center">
                <span className="text-[10px] sm:text-xs font-mono tracking-[0.35em] text-white/40 uppercase animate-[pulse_3s_infinite]">
                  <span className="hidden md:inline">CLICK ANYWHERE TO ENTER</span>
                  <span className="inline md:hidden">TAP TO ENTER</span>
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

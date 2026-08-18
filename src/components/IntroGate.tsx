import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import ParticleIntro, { type ParticleIntroHandle } from "./particles/ParticleIntro";
import IntroPlaceholder from "./IntroPlaceholder";
import { startAmbientPad, playWarpWhoosh } from "../utils/audio";

interface IntroGateProps {
  isEntered?: boolean;
  onEnterStateChange?: (entered: boolean) => void;
}

export default function IntroGate({ isEntered: propIsEntered, onEnterStateChange }: IntroGateProps) {
  const [internalEntered, setInternalEntered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const introRef = useRef<ParticleIntroHandle>(null);

  const isEntered = propIsEntered !== undefined ? propIsEntered : internalEntered;

  // Monitor user systems for reduced motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
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

  // Finish the intro: warp whoosh + portal swap (called once by the choreography)
  const performEnter = () => {
    if (isEntered) return;
    setIsTransitioning(true);
    playWarpWhoosh();
    setTimeout(() => {
      setInternalEntered(true);
      if (onEnterStateChange) {
        onEnterStateChange(true);
      }
      // Trigger the staggered hero reveal after the portal swap completes.
      // A short delay lets the hero mount and stabilise before content fades in.
      setTimeout(() => setHeroReady(true), 100);
    }, 600);
  };

  // Kick off the particle choreography (or skip straight to enter for reduced motion)
  const handleStart = () => {
    if (isEntered || isTransitioning) return;
    if (reducedMotion) {
      performEnter();
      return;
    }
    setIsTransitioning(true);
    introRef.current?.start();
  };

  // Keyboard accessibility: Enter or Space anywhere starts the intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTransitioning, isEntered, reducedMotion]);

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
      aria-label="Intro animation, click or tap anywhere to enter portfolio"
      className="relative w-full min-h-[100dvh] bg-transparent text-white overflow-hidden flex flex-col items-center justify-center select-none cursor-pointer outline-none"
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
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full flex flex-col items-center justify-center p-6 z-10 relative"
        >
          {/* Interaction instructions at the bottom */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none text-center">
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.35em] text-white/30 uppercase animate-[pulse_3s_infinite] transition-colors duration-500">
              <span className="hidden md:inline">CLICK ANYWHERE TO ENTER</span>
              <span className="inline md:hidden">TAP ANYWHERE TO ENTER</span>
            </span>
          </div>

          {/* Immersive Central Interactive Canvas Area */}
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
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
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

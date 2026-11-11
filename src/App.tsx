/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense, Component, type ReactNode } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import IntroGate from "./components/IntroGate";
import { AnimatePresence, motion } from "motion/react";
import Waves from "./components/ui/Waves";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: ErrorBoundaryProps;
  state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 text-center font-mono text-xs text-red-400">
            System load error. Please refresh the page.
          </div>
        )
      );
    }
    return this.props.children;
  }
}

// Lazy-load PixelBlast so it only mounts AFTER the intro completes.
// This prevents two WebGL renderers from competing for context during startup,
// which caused "Context Lost" and a blank white page.
const PixelBlast = lazy(() => import("./components/ui/PixelBlast"));

// Lazy-load route pages (project carousel + case studies). The first screen
// (intro + portfolio) never needs them, so they split into their own chunk
// and load only on navigation.
const DestinationPage = lazy(() => import("./components/DestinationPage"));

export default function App() {
  const location = useLocation();
  const [isEntered, setIsEntered] = useState(() => location.pathname !== "/");

  // Keep entered state synced if user navigates via URL or back button
  useEffect(() => {
    if (location.pathname !== "/") {
      setIsEntered(true);
    }
  }, [location.pathname]);

  const showIntroBg = !isEntered && location.pathname === "/";

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white selection:bg-white/20 selection:text-white overflow-x-hidden font-sans" id="app-root">
      {/* Intro Background: Waves Animation (Active only during the initial intro) */}
      <AnimatePresence>
        {showIntroBg && (
          <motion.div
            key="waves"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-0 overflow-hidden select-none pointer-events-none"
            id="waves-bg-container"
            aria-hidden="true"
          >
            <Waves
              lineColor="rgba(255, 255, 255, 0.07)"
              backgroundColor="transparent"
              waveSpeedX={0.015}
              waveSpeedY={0.008}
              waveAmpX={45}
              waveAmpY={22}
              friction={0.91}
              tension={0.008}
              maxCursorMove={110}
              xGap={12}
              yGap={34}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post-Intro Website Background: React Bits PixelBlast */}
        {!showIntroBg && (
          <ErrorBoundary>
            <Suspense fallback={null}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="fixed inset-0 z-0 overflow-hidden select-none pointer-events-none"
                id="pixelblast-bg-container"
                aria-hidden="true"
              >
                {/* Subtle, atmospheric particle field — intentionally low density
                    and dimmed so it never competes with the hero, avatar, or work. */}
                <PixelBlast
                  variant="circle"
                  pixelSize={4}
                  color="#ffffff"
                  patternScale={5.5}
                  patternDensity={0.09}
                  pixelSizeJitter={0.45}
                  enableRipples={true}
                  rippleSpeed={0.45}
                  rippleThickness={0.14}
                  rippleIntensityScale={1.2}
                  liquid={false}
                  speed={0.5}
                  edgeFade={0.3}
                  transparent={true}
                />
              </motion.div>
            </Suspense>
          </ErrorBoundary>
        )}

        {/* Persisting Responsive Grid Background */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none" 
          id="persistent-grid-bg"
          aria-hidden="true"
        >
          {/* Responsive Grid Columns using Tailwind grid utilities */}
          <div className="w-full h-full max-w-7xl mx-auto px-6 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-6 opacity-25">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-full border-r border-white/[0.03] relative ${
                  i >= 4 ? "hidden md:block" : ""
                } ${i >= 8 ? "md:hidden lg:block" : ""}`}
              >
                {/* Vertical line indicator */}
                <div className="absolute inset-y-0 left-0 w-[1px] bg-white/[0.015]" />
                
                {/* Horizontal geometric rule alignments at structured breakpoints */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/[0.03]" />
                <div className="absolute top-1/4 left-0 w-full h-[1px] bg-white/[0.02]" />
                <div className="absolute top-2/4 left-0 w-full h-[1px] bg-white/[0.02]" />
                <div className="absolute top-3/4 left-0 w-full h-[1px] bg-white/[0.02]" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/[0.03]" />

                {/* Subtle tech crosshair accent on some intersections */}
                {i % 4 === 0 && (
                  <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 border border-white/10 rounded-full bg-neutral-950" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Portfolio Sections */}
        <div className="relative z-10 w-full min-h-screen">
          <IntroGate 
            isEntered={isEntered} 
            onEnterStateChange={(entered) => setIsEntered(entered)} 
          />
          
          <AnimatePresence mode="wait">
            {/* @ts-expect-error Routes + AnimatePresence type mismatch */}
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={null} />
              <Route path="/:section" element={
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, exit: { duration: 0.4 } }}
                  className="absolute top-0 left-0 w-full min-h-screen z-50 bg-transparent"
                >
                  <ErrorBoundary>
                    <Suspense fallback={null}>
                      <DestinationPage />
                    </Suspense>
                  </ErrorBoundary>
                </motion.div>
              } />
              <Route path="/:section/:id" element={
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, exit: { duration: 0.4 } }}
                  className="absolute top-0 left-0 w-full min-h-screen z-50 bg-transparent"
                >
                  <ErrorBoundary>
                    <Suspense fallback={null}>
                      <DestinationPage />
                    </Suspense>
                  </ErrorBoundary>
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
      </div>
    </div>
  );
}



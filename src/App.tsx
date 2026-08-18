/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import IntroGate from "./components/IntroGate";
import DestinationPage from "./components/DestinationPage";
import { AnimatePresence, motion } from "motion/react";
import Waves from "./components/ui/Waves";
import PixelBlast from "./components/ui/PixelBlast";

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
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: showIntroBg ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className={`fixed inset-0 z-0 overflow-hidden select-none ${showIntroBg ? "pointer-events-none" : "pointer-events-none"}`}
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

      {/* Post-Intro Website Background: React Bits PixelBlast */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: !showIntroBg ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className={`fixed inset-0 z-0 overflow-hidden select-none ${!showIntroBg ? "pointer-events-none" : "pointer-events-none"}`}
        id="pixelblast-bg-container"
        aria-hidden="true"
      >
        <PixelBlast
          variant="circle"
          pixelSize={5}
          color="#ffffff"
          patternScale={4.5}
          patternDensity={0.35}
          pixelSizeJitter={0.45}
          enableRipples={true}
          rippleSpeed={0.45}
          rippleThickness={0.14}
          rippleIntensityScale={2.2}
          liquid={false}
          speed={0.8}
          edgeFade={0.2}
          transparent={true}
        />
      </motion.div>

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
          {/* @ts-ignore */}
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
                <DestinationPage />
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
                <DestinationPage />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}



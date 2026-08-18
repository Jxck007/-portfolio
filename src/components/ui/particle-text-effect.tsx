import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ParticleTextEffectProps {
  text?: string;
  className?: string;
  onInteracted?: () => void;
  disperse?: boolean; // When true, particles disperse outwards
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  alpha: number;
  targetAlpha: number;
  speed: number;
  friction: number;
  colorType: number;
  active: boolean;
}

export function ParticleTextEffect({
  text = "JXCK",
  className,
  onInteracted,
  disperse = false,
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const currentTextRef = useRef<string>("");
  const mouseRef = useRef<{ x: number | null; y: number | null; active: boolean }>({
    x: null,
    y: null,
    active: false,
  });
  const [hasInteracted, setHasInteracted] = useState(false);

  // Core setup and loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const offscreenW = 480;
    const offscreenH = 160;

    // Helper to calculate target mapping on onscreen canvas
    const getLayout = (w: number, h: number) => {
      // Responsive size adjustments based on screen width
      const maxTargetW = Math.min(w * 0.90, w < 640 ? 320 : 540);
      const scale = maxTargetW / offscreenW;
      const dx = (w - offscreenW * scale) / 2;
      const dy = (h - offscreenH * scale) / 2;
      return { scale, dx, dy };
    };

    let layout = getLayout(width, height);

    // Scan text function
    const scanText = (word: string) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = offscreenW;
      offscreen.height = offscreenH;
      const oCtx = offscreen.getContext("2d");
      if (!oCtx) return [];

      oCtx.fillStyle = "#ffffff";
      oCtx.textAlign = "center";
      oCtx.textBaseline = "middle";
      
      // Make text look pristine, bold, and modern
      oCtx.font = "900 100px system-ui, -apple-system, sans-serif";
      oCtx.fillText(word, offscreenW / 2, offscreenH / 2);

      const imgData = oCtx.getImageData(0, 0, offscreenW, offscreenH);
      const data = imgData.data;
      const points: { x: number; y: number }[] = [];

      // Grid interval: responsive adjustments (tighter grid on small screens for crisp letters)
      const step = width < 640 ? 4 : 3;
      for (let y = 0; y < offscreenH; y += step) {
        for (let x = 0; x < offscreenW; x += step) {
          const index = (y * offscreenW + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 110) {
            points.push({ x, y });
          }
        }
      }
      return points;
    };

    // Update particles for the given word
    const updateWordTarget = (word: string) => {
      const scannedPoints = scanText(word);
      const currentParticles = particlesRef.current;

      // Map targets to existing particles, create or deactivate as needed
      const numTargets = scannedPoints.length;
      const numParticles = currentParticles.length;

      // Re-evaluate layout
      layout = getLayout(width, height);

      // Shuffle target points briefly so transition looks organic and particle lines cross beautifully
      const shuffledTargets = [...scannedPoints].sort(() => Math.random() - 0.5);

      for (let i = 0; i < Math.max(numTargets, numParticles); i++) {
        if (i < numTargets) {
          const targetPt = shuffledTargets[i];
          const tx = targetPt.x * layout.scale + layout.dx;
          const ty = targetPt.y * layout.scale + layout.dy;

          if (i < numParticles) {
            // Morph existing particle to new target
            const p = currentParticles[i];
            p.targetX = tx;
            p.targetY = ty;
            p.baseX = targetPt.x;
            p.baseY = targetPt.y;
            p.targetAlpha = 1.0;
            p.active = true;
          } else {
            // Spawn a new particle from a nearby active particle, or center
            let spawnX = width / 2;
            let spawnY = height / 2;
            if (numParticles > 0) {
              const source = currentParticles[Math.floor(Math.random() * numParticles)];
              spawnX = source.x;
              spawnY = source.y;
            }

            currentParticles.push({
              x: spawnX,
              y: spawnY,
              targetX: tx,
              targetY: ty,
              baseX: targetPt.x,
              baseY: targetPt.y,
              vx: 0,
              vy: 0,
              size: Math.random() * 1.1 + 0.8,
              baseSize: Math.random() * 1.1 + 0.8,
              alpha: 0,
              targetAlpha: 1.0,
              speed: Math.random() * 0.04 + 0.035,
              friction: Math.random() * 0.12 + 0.82,
              colorType: Math.random(),
              active: true,
            });
          }
        } else {
          // Excess particles: send them to float as cosmic stardust or fade out
          const p = currentParticles[i];
          p.targetAlpha = 0.0;
          p.active = false;
        }
      }
    };

    // Keep monitoring the latest text prop
    if (text !== currentTextRef.current) {
      currentTextRef.current = text;
      updateWordTarget(text);
    }

    const handleResize = () => {
      if (!canvas || !container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      const newCtx = canvas.getContext("2d");
      if (newCtx) {
        newCtx.scale(dpr, dpr);
      }

      layout = getLayout(width, height);

      // Readjust target positions based on new layout coordinates
      particlesRef.current.forEach((p) => {
        if (p.active) {
          p.targetX = p.baseX * layout.scale + layout.dx;
          p.targetY = p.baseY * layout.scale + layout.dy;
        }
      });
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    let animationId: number;
    let time = 0;

    const repulsionRadius = 75;
    const repulsionStrength = 0.45;

    // Continuous render loop
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const currentParticles = particlesRef.current;

      for (let i = 0; i < currentParticles.length; i++) {
        const p = currentParticles[i];

        // Disperse logic - Miles Morales warp speed radial explosion physics
        if (disperse) {
          const dx = p.x - width / 2;
          const dy = p.y - height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          p.vx += (dx / dist) * 2.8;
          p.vy += (dy / dist) * 2.8;
          p.friction = 0.985; // Low friction for high momentum speed lines
          p.targetAlpha = 0.0;
          // Fade out slightly slower so we can appreciate the colorful trails crossing the screen
          p.alpha += (0.0 - p.alpha) * 0.006;
          p.speed = 0.12;
        }

        // Interpolate alpha
        p.alpha += (p.targetAlpha - p.alpha) * 0.1;

        // Skip rendering if completely invisible to optimize performance
        if (p.alpha < 0.01) continue;

        // 1. Interactive Mouse Repulsion
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < repulsionRadius) {
            if (!hasInteracted && onInteracted) {
              setHasInteracted(true);
              onInteracted();
            }

            const force = (repulsionRadius - dist) / repulsionRadius;
            const forcePower = force * repulsionStrength * 4.5;
            const angle = Math.atan2(dy, dx);

            p.vx -= Math.cos(angle) * forcePower;
            p.vy -= Math.sin(angle) * forcePower;

            p.size = Math.min(p.baseSize * 1.5, p.size + 0.08);
          } else {
            p.size = Math.max(p.baseSize, p.size - 0.06);
          }
        } else {
          p.size = Math.max(p.baseSize, p.size - 0.06);
        }

        // 2. Spring Physics towards targets
        const springX = disperse ? 0 : (p.targetX - p.x) * p.speed;
        const springY = disperse ? 0 : (p.targetY - p.y) * p.speed;

        // Subtle dynamic floating drift
        const driftX = disperse ? 0 : Math.sin(time * 0.018 + p.baseX * 0.15) * 0.06;
        const driftY = disperse ? 0 : Math.cos(time * 0.018 + p.baseY * 0.15) * 0.06;

        p.vx += springX + driftX;
        p.vy += springY + driftY;

        p.vx *= p.friction;
        p.vy *= p.friction;

        p.x += p.vx;
        p.y += p.vy;

        // 3. Color Styling (adapts gracefully to motion - pure white & crystal silver particles)
        const dX = p.x - p.targetX;
        const dY = p.y - p.targetY;
        const disp = Math.sqrt(dX * dX + dY * dY);

        let color: string;
        if (disperse) {
          // Clean, high-contrast white & silver particle trails
          if (p.colorType > 0.5) {
            color = `rgba(255, 255, 255, ${p.alpha * 0.9})`; // Bright white
          } else {
            color = `rgba(235, 235, 245, ${p.alpha * 0.85})`; // Crystal silver
          }
        } else if (disp > 20) {
          const ratio = Math.min(1, (disp - 20) / 70);
          color = `rgba(255, 255, 255, ${p.alpha * (0.6 + ratio * 0.4)})`; // Pristine bright white during motion
        } else {
          const ratio = disp / 20;
          const val = 0.85 + ratio * 0.15;
          if (p.colorType > 0.5) {
            color = `rgba(255, 255, 255, ${p.alpha * val})`; // Solid bright white
          } else {
            color = `rgba(240, 240, 245, ${p.alpha * val})`; // Crystal silver-white
          }
        }

        if (disperse) {
          const speedVal = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          ctx.strokeStyle = color;
          // Stylized thick comic streak lines
          ctx.lineWidth = Math.max(1.8, p.size * (1 + speedVal * 0.12));
          ctx.lineCap = "round";
          ctx.beginPath();
          // Draw backward trail line based on momentum
          ctx.moveTo(p.x - p.vx * 3.8, p.y - p.vy * 3.8);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [text, onInteracted, disperse, hasInteracted]);

  // Mouse move handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
    mouseRef.current.x = null;
    mouseRef.current.y = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
      active: true,
    };
  };

  const handleTouchEnd = () => {
    mouseRef.current.active = false;
    mouseRef.current.x = null;
    mouseRef.current.y = null;
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full cursor-crosshair overflow-hidden select-none", className)}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="block"
      />
    </div>
  );
}

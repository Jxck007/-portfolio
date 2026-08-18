import React, { useEffect, useRef, useState } from 'react';

export type PixelAnimationMethod = 'appear' | 'disappear';

interface PixelCardProps {
  active?: boolean;
  isActiveOrNeighbor?: boolean;
  isDragging?: boolean;
  gap?: number;
  speed?: number;
  colors?: string;
  variant?: string;
  className?: string;
  children?: React.ReactNode;
}

class Pixel {
  x: number;
  y: number;
  size: number;
  color: string;
  originalAlpha: number;
  alpha: number;
  targetAlpha: number;
  speed: number;

  constructor(x: number, y: number, size: number, color: string, speedMultiplier: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.originalAlpha = Math.random() * 0.12; // Resting background glow
    this.alpha = 0;
    this.targetAlpha = this.originalAlpha;
    this.speed = (speedMultiplier + Math.random() * 8) / 1000;
  }

  setAnimationState(method: PixelAnimationMethod) {
    if (method === 'appear') {
      this.targetAlpha = 0.35 + Math.random() * 0.45;
    } else {
      this.targetAlpha = this.originalAlpha;
    }
  }

  update(
    isHovered: boolean,
    isFocused: boolean,
    mouseX: number,
    mouseY: number,
    distanceThreshold: number,
    isReducedMotion: boolean,
    active: boolean
  ) {
    if (!active) {
      // Inactive card -> pixels fade out completely
      this.targetAlpha = 0;
      this.alpha += (this.targetAlpha - this.alpha) * 0.15;
      return;
    }

    if (isReducedMotion) {
      // Flat transitions without continuous active shimmer
      this.targetAlpha = (isHovered || isFocused) ? 0.20 : 0.03;
      this.alpha += (this.targetAlpha - this.alpha) * 0.08;
      return;
    }

    let isNearMouse = false;
    if (isHovered && mouseX >= 0 && mouseY >= 0) {
      const dx = (this.x + this.size / 2) - mouseX;
      const dy = (this.y + this.size / 2) - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < distanceThreshold) {
        isNearMouse = true;
      }
    }

    if (isNearMouse) {
      this.targetAlpha = 0.45 + Math.random() * 0.4;
    } else if (isHovered || isFocused) {
      this.targetAlpha = 0.12 + Math.random() * 0.15;
    } else {
      this.targetAlpha = this.originalAlpha;
    }

    this.alpha += (this.targetAlpha - this.alpha) * this.speed;

    // Muted background shimmer
    if (!isNearMouse && !isHovered && !isFocused && Math.random() < 0.003) {
      this.originalAlpha = Math.random() * 0.12;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0.001) return;
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

export default function PixelCard({
  active = false,
  isActiveOrNeighbor = false,
  isDragging = false,
  gap = 7,
  speed = 22,
  colors = '#f5f5f4,#a8a29e,#57534e',
  className = '',
  children
}: PixelCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInViewport, setIsInViewport] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const mousePosRef = useRef({ x: -1, y: -1 });
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Monitor prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // IntersectionObserver to only work when card is inside the viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInViewport(entry.isIntersecting);
        });
      },
      { threshold: 0.02 }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Debounced ResizeObserver to measure canvas dimensions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        const entry = entries[0];
        if (entry) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
        }
      }, 100);
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, []);

  // Reinitialize pixel grid when dimensions or layout details change
  useEffect(() => {
    // Only initialize canvases and pixels for active or adjacent cards in viewport
    if (!isActiveOrNeighbor || !isInViewport || dimensions.width === 0 || dimensions.height === 0) {
      pixelsRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const palette = colors.split(',');
    const pixelsList: Pixel[] = [];
    const pixelSize = 4; // size of each pixel particle
    
    // Adjust layout gap based on screen size (ensure mobile gap is at least 9px)
    const isMobile = window.innerWidth < 768;
    const computedGap = isMobile ? Math.max(9, gap) : gap;
    const step = pixelSize + computedGap;

    // Limit maximum particles to optimize memory and GPU performance
    const maxCols = Math.floor(dimensions.width / step);
    const maxRows = Math.floor(dimensions.height / step);

    for (let c = 0; c < maxCols; c++) {
      for (let r = 0; r < maxRows; r++) {
        // Skip some pixels randomly or keep the pattern centered to avoid solid walls of color
        if (Math.random() > 0.82) continue;

        const x = c * step + computedGap;
        const y = r * step + computedGap;
        const color = palette[Math.floor(Math.random() * palette.length)];
        
        pixelsList.push(new Pixel(x, y, pixelSize, color, speed));
      }
    }
    pixelsRef.current = pixelsList;
  }, [dimensions, colors, gap, speed, isActiveOrNeighbor, isInViewport]);

  // Main high-performance animation loop
  useEffect(() => {
    // Avoid running loops for hidden, inactive, or unmounted cards
    if (!isActiveOrNeighbor || !isInViewport || dimensions.width === 0 || dimensions.height === 0) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Cache context to avoid retrieving it during every single frame
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const renderLoop = () => {
      // Pause animation if tab is hidden
      if (document.hidden) {
        animationFrameIdRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const pixels = pixelsRef.current;
      const mouse = mousePosRef.current;
      const threshold = 70; // mouse interaction radius

      // Disable/Mute animation during dragging to optimize performance
      const effectiveHover = isHovered && !isDragging;

      for (let i = 0; i < pixels.length; i++) {
        const pixel = pixels[i];
        pixel.update(effectiveHover, isFocused, mouse.x, mouse.y, threshold, reducedMotion, active);
        pixel.draw(ctx);
      }

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [dimensions, isActiveOrNeighbor, isInViewport, isHovered, isFocused, isDragging, active, reducedMotion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!active || isDragging) return;
    if (!rectRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      rectRef.current = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    }
    const x = e.clientX - rectRef.current.left;
    const y = e.clientY - rectRef.current.top;
    mousePosRef.current = { x, y };
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!active || isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    rectRef.current = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    mousePosRef.current = { x: -1, y: -1 };
    rectRef.current = null;
  };

  const handleFocus = () => {
    if (!active) return;
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div
      ref={containerRef}
      className={`project-pixel-card ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={active ? 0 : -1}
      id={`pixel-card-${active ? 'active' : 'inactive'}`}
    >
      {/* Decorative Canvas Element with Accessible Hiding */}
      {isActiveOrNeighbor && isInViewport && (
        <canvas
          ref={canvasRef}
          className="pixel-canvas"
          width={dimensions.width}
          height={dimensions.height}
          aria-hidden="true"
          style={{ width: dimensions.width, height: dimensions.height }}
        />
      )}

      {/* Structured Card Content Layer */}
      <div className="project-card-content">
        {children}
      </div>
    </div>
  );
}

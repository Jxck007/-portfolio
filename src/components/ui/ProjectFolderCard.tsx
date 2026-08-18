import React, { useState, useEffect, useRef, useMemo } from 'react';
import './ProjectFolderCard.css';

// --- HELPER FUNCTIONS & CONSTANTS ---
const DARKEN_CACHE = new Map<string, string>();

const darkenColor = (hex: string, percent: number): string => {
  const cacheKey = `${hex}-${percent}`;
  if (DARKEN_CACHE.has(cacheKey)) return DARKEN_CACHE.get(cacheKey)!;

  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const num = parseInt(color.slice(0, 6), 16);
  const r = Math.max(0, Math.min(255, Math.floor(((num >> 16) & 0xff) * (1 - percent))));
  const g = Math.max(0, Math.min(255, Math.floor(((num >> 8) & 0xff) * (1 - percent))));
  const b = Math.max(0, Math.min(255, Math.floor((num & 0xff) * (1 - percent))));
  
  const result = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  DARKEN_CACHE.set(cacheKey, result);
  return result;
};

class Pixel {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInteger: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number
  ) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = (Math.random() * 0.8 + 0.1) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = Math.random() * (this.maxSizeInteger - this.minSize) + this.minSize;
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  draw() {
    const centerOffset = (this.maxSizeInteger - this.size) * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) this.isShimmer = true;
    
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    }
    this.size -= 0.1;
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) this.isReverse = true;
    else if (this.size <= this.minSize) this.isReverse = false;
    
    this.size += this.isReverse ? -this.speed : this.speed;
  }
}

function getEffectiveSpeed(value: number | string | undefined, reducedMotion: boolean) {
  if (reducedMotion) return 0;
  const parsed = typeof value === 'number' ? value : parseInt(value || '0', 10) || 0;
  if (parsed <= 0) return 0;
  return Math.min(parsed, 100) * 0.001;
}

export type ProjectFolderVariant = 'default' | 'blue' | 'yellow' | 'pink' | 'emerald' | 'purple';

const VARIANTS: Record<string, { gap: number; speed: number; colors: string; noFocus: boolean }> = {
  default: { gap: 5, speed: 35, colors: '#f8fafc,#f1f5f9,#cbd5e1', noFocus: false },
  blue:    { gap: 10, speed: 25, colors: '#e0f2fe,#7dd3fc,#0ea5e9', noFocus: false },
  yellow:  { gap: 3, speed: 20, colors: '#fef08a,#fde047,#eab308', noFocus: false },
  pink:    { gap: 6, speed: 80, colors: '#fecdd3,#fda4af,#e11d48', noFocus: true },
  emerald: { gap: 6, speed: 30, colors: '#a7f3d0,#34d399,#059669', noFocus: false },
  purple:  { gap: 5, speed: 30, colors: '#e9d5ff,#c084fc,#9333ea', noFocus: false }
};

interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  className?: string;
}

// --- SUB-COMPONENTS ---
export function Folder({ color = '#5227FF', size = 1, items = [], className = '' }: FolderProps) {
  const maxItems = 3;
  const papers = useMemo(() => {
    const sliced: (React.ReactNode | null)[] = items.slice(0, maxItems);
    while (sliced.length < maxItems) sliced.push(null);
    return sliced;
  }, [items]);

  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(() =>
    Array(maxItems).fill({ x: 0, y: 0 })
  );

  const folderBackColor = useMemo(() => darkenColor(color, 0.08), [color]);
  
  const folderStyle = useMemo(
    () =>
      ({
        '--folder-color': color,
        '--folder-back-color': folderBackColor,
        '--paper-1': '#E6E6E6',
        '--paper-2': '#F2F2F2',
        '--paper-3': '#FFFFFF'
      } as React.CSSProperties),
    [color, folderBackColor]
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(prev => !prev);
    if (open) setPaperOffsets(Array(maxItems).fill({ x: 0, y: 0 }));
  };

  const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) * 0.15;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) * 0.15;
    
    setPaperOffsets(prev => {
      const next = [...prev];
      next[index] = { x: offsetX, y: offsetY };
      return next;
    });
  };

  const handlePaperMouseLeave = (index: number) => {
    setPaperOffsets(prev => {
      const next = [...prev];
      next[index] = { x: 0, y: 0 };
      return next;
    });
  };

  return (
    <div style={{ transform: `scale(${size})` }} className={className}>
      <div
        className={`folder cursor-target ${open ? 'open' : ''}`}
        style={folderStyle}
        onClick={handleClick}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setOpen(prev => !prev))}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-label={open ? 'Close folder' : 'Open folder'}
      >
        <div className="folder__back">
          {papers.map((item, i) => (
            <div
              key={i}
              className={`paper paper-${i + 1}`}
              onMouseMove={e => handlePaperMouseMove(e, i)}
              onMouseLeave={() => handlePaperMouseLeave(i)}
              style={
                open
                  ? ({
                      '--magnet-x': `${paperOffsets[i]?.x || 0}px`,
                      '--magnet-y': `${paperOffsets[i]?.y || 0}px`
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {item}
            </div>
          ))}
          <div className="folder__front" />
          <div className="folder__front right" />
        </div>
      </div>
    </div>
  );
}

export interface ProjectFolderCardProps {
  title?: string;
  subtitle?: string;
  variant?: ProjectFolderVariant;
  folderColor?: string;
  gap?: number;
  speed?: number;
  colors?: string;
  noFocus?: boolean;
  items?: React.ReactNode[];
  onClick?: () => void;
  className?: string;
}

// --- MAIN COMBINED COMPONENT ---
export default function ProjectFolderCard({
  title = "Project Vault",
  subtitle = "Click folder to open files",
  variant = 'blue',
  folderColor = '#0ea5e9',
  gap,
  speed,
  colors,
  noFocus,
  items = [
    <span key="1" className="file-chip chip-pink">🎨 Design</span>,
    <span key="2" className="file-chip chip-blue">⚡ Code</span>,
    <span key="3" className="file-chip chip-yellow">📄 Docs</span>
  ],
  onClick,
  className = ''
}: ProjectFolderCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number | null>(null);
  const timePreviousRef = useRef(performance.now());

  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  const variantCfg = VARIANTS[variant] || VARIANTS.default;
  const finalGap = gap ?? variantCfg.gap;
  const finalSpeed = speed ?? variantCfg.speed;
  const finalColors = colors ?? variantCfg.colors;
  const finalNoFocus = noFocus ?? variantCfg.noFocus;

  const initPixels = () => {
    if (!containerRef.current || !canvasRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);
    if (width <= 0 || height <= 0) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const parsedGap = Math.max(1, typeof finalGap === 'number' ? finalGap : parseInt(String(finalGap), 10) || 5);
    const parsedSpeed = getEffectiveSpeed(finalSpeed, reducedMotion);
    const colorsArray = finalColors.split(',');
    const pxs: Pixel[] = [];

    for (let x = 0; x < width; x += parsedGap) {
      for (let y = 0; y < height; y += parsedGap) {
        const color = colorsArray[Math.floor(Math.random() * colorsArray.length)];
        const dx = x - width / 2;
        const dy = y - height / 2;
        const delay = reducedMotion ? 0 : Math.sqrt(dx * dx + dy * dy);

        pxs.push(new Pixel(canvasRef.current, ctx, x, y, color, parsedSpeed, delay));
      }
    }
    pixelsRef.current = pxs;
  };

  const doAnimate = (fnName: 'appear' | 'disappear') => {
    animationRef.current = requestAnimationFrame(() => doAnimate(fnName));
    const timeNow = performance.now();
    const timePassed = timeNow - timePreviousRef.current;
    const timeInterval = 1000 / 60;

    if (timePassed < timeInterval) return;
    timePreviousRef.current = timeNow - (timePassed % timeInterval);

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    let allIdle = true;
    for (let i = 0; i < pixelsRef.current.length; i++) {
      const pixel = pixelsRef.current[i];
      pixel[fnName]();
      if (!pixel.isIdle) allIdle = false;
    }
    if (allIdle && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleAnimation = (name: 'appear' | 'disappear') => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(() => doAnimate(name));
  };

  useEffect(() => {
    initPixels();
    const observer = new ResizeObserver(initPixels);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [finalGap, finalSpeed, finalColors, finalNoFocus]);

  return (
    <div
      ref={containerRef}
      className={`pixel-card cursor-target ${className}`}
      onClick={onClick}
      onMouseEnter={() => handleAnimation('appear')}
      onMouseLeave={() => handleAnimation('disappear')}
      onFocus={finalNoFocus ? undefined : (e) => !e.currentTarget.contains(e.relatedTarget) && handleAnimation('appear')}
      onBlur={finalNoFocus ? undefined : (e) => !e.currentTarget.contains(e.relatedTarget) && handleAnimation('disappear')}
      tabIndex={finalNoFocus ? -1 : 0}
    >
      <canvas className="pixel-canvas" ref={canvasRef} />
      
      <div className="card-overlay-content">
        <div className="folder-container">
          <Folder size={1.2} color={folderColor} items={items} />
        </div>
        <div className="card-meta">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

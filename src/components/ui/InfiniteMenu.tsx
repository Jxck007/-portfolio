import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import './InfiniteMenu.css';

export interface MenuItem {
  image: string;
  link: string;
  title: string;
  description: string;
}

interface InfiniteMenuProps {
  items?: MenuItem[];
  scale?: number;
  onItemSelect?: (item: MenuItem) => void;
  isTransitioning?: boolean;
}

export default function InfiniteMenu({
  items = [],
  scale = 1.0,
  onItemSelect,
  isTransitioning = false
}: InfiniteMenuProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active Index State
  const [activeIndex, setActiveIndex] = useState(0);

  // Is changing state (for the 330ms transition lock and text opacity)
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Leaving animation state
  const [navigationState, setNavigationState] = useState<'idle' | 'leaving'>('idle');

  // Wheel state refs
  const wheelAccumulatorRef = useRef(0);
  const wheelLockedRef = useRef(false);
  const wheelResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drag visual feedback offset state
  const [dragOffset, setDragOffset] = useState(0);

  const activeItem = items[activeIndex] || items[0];

  // Helper to change active item with boundary safety
  const triggerChange = (direction: number) => {
    if (wheelLockedRef.current || isTransitioning || navigationState !== 'idle') return;

    setIsInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }

    setActiveIndex((prev) => (prev + direction + items.length) % items.length);

    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 330); // Settlement delay
  };

  // Wheel Accumulator and Sensitivity Logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      if (wheelLockedRef.current || isTransitioning || navigationState !== 'idle') return;

      // Only handle if this element is fully visible in viewport
      const rect = container.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible) return;

      // Prevent page scrolling while launchpad is active
      event.preventDefault();

      const multiplier =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? window.innerHeight
            : 1;

      const normalizedDelta = event.deltaY * multiplier;

      wheelAccumulatorRef.current += normalizedDelta;

      if (wheelResetTimerRef.current !== null) {
        clearTimeout(wheelResetTimerRef.current);
      }

      wheelResetTimerRef.current = setTimeout(() => {
        wheelAccumulatorRef.current = 0;
      }, 140); // Reset incomplete accumulator after 140ms

      if (Math.abs(wheelAccumulatorRef.current) < 110) { // WHEEL_THRESHOLD
        return;
      }

      const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;

      wheelAccumulatorRef.current = 0;
      wheelLockedRef.current = true;

      triggerChange(direction);

      setTimeout(() => {
        wheelLockedRef.current = false;
      }, 520); // Cooldown lock
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (wheelResetTimerRef.current) clearTimeout(wheelResetTimerRef.current);
    };
  }, [activeIndex, isTransitioning, navigationState, items.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning || navigationState !== 'idle') return;

      switch (e.key) {
        case 'ArrowLeft':
          triggerChange(-1);
          break;
        case 'ArrowRight':
          triggerChange(1);
          break;
        case 'Enter':
        case ' ': // Spacebar
          e.preventDefault();
          handleEnter();
          break;
        case 'Escape':
          if (activeIndex !== 0) {
            setIsInteracting(true);
            setActiveIndex(0);
            setTimeout(() => setIsInteracting(false), 330);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, isTransitioning, navigationState, items.length]);

  // Handle click / tap on arrow to transition to the route
  const handleEnter = () => {
    if (isTransitioning || navigationState !== 'idle' || !activeItem) return;
    setNavigationState('leaving');

    // Trigger parent callback after 180ms leaving delay
    setTimeout(() => {
      if (onItemSelect) {
        onItemSelect(activeItem);
      } else {
        navigate(activeItem.link, { state: { fromImage: activeItem.image } });
      }
    }, 180);
  };

  if (!items.length) return null;

  return (
    <div 
      className="launchpad-menu flex flex-col justify-between" 
      ref={containerRef}
      id="launchpad-menu-root"
    >
      {/* Aria Live Announcement Region */}
      <div className="sr-only" aria-live="polite">
        {activeItem.title}, item {activeIndex + 1} of {items.length}
      </div>

      {/* Main Interactive Three-Column Content area */}
      <div 
        className="launchpad-content"
        data-state={navigationState}
      >
        {/* LEFT COLUMN: Section Title, index & Navigation Node label */}
        <div className="launchpad-copy">
          <span className="text-[10px] md:text-xs font-mono tracking-[0.25em] text-white/40 uppercase mb-2">
            NAVIGATION NODE
          </span>
          
          <div className="text-xs md:text-sm font-mono text-neutral-500 mb-4 tracking-widest uppercase">
            <span className="text-white/80 font-medium">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>{' '}
            / {String(items.length).padStart(2, '0')}
          </div>

          <motion.h2
            className="face-title"
            animate={isInteracting ? 'interacting' : 'active'}
            variants={{
              active: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] }
              },
              interacting: {
                opacity: 0.35,
                y: 12,
                transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] }
              }
            }}
          >
            {activeItem.title}
          </motion.h2>
        </div>

        {/* CENTRE COLUMN: Active circular image & navigation action button */}
        <div className="launchpad-visual select-none flex flex-col items-center">
          <div className="active-circle-container">
            {/* Draggable Circle Wrapper */}
            <motion.div
              drag={isTransitioning || navigationState !== 'idle' ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              dragTransition={{ bounceStiffness: 260, bounceDamping: 30 }}
              onDragStart={() => setIsInteracting(true)}
              onDrag={(event, info) => {
                setDragOffset(info.offset.x);
              }}
              onDragEnd={(event, info) => {
                setDragOffset(0);
                setIsInteracting(false);
                if (wheelLockedRef.current || isTransitioning || navigationState !== 'idle') return;
                
                const offset = info.offset.x;
                const velocity = info.velocity.x;

                if (offset < -70 || velocity < -550) { // DRAG_DISTANCE_THRESHOLD & DRAG_VELOCITY_THRESHOLD
                  triggerChange(1);
                } else if (offset > 70 || velocity > 550) {
                  triggerChange(-1);
                }
              }}
              style={{ x: dragOffset }}
              className="w-full h-full cursor-grab active:cursor-grabbing relative flex items-center justify-center"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0.8, scale: 0.97, filter: 'blur(3px)', y: 8 }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                  exit={{ opacity: 0.8, scale: 0.97, filter: 'blur(3px)', y: -8 }}
                  transition={{ duration: 0.33, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full relative"
                >
                  <img
                    src={activeItem.image}
                    alt={`${activeItem.title} navigation circle`}
                    className="active-circle-image pointer-events-none select-none"
                  />
                  {/* Local overlay vignette inside the circle */}
                  <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_24px_rgba(0,0,0,0.65)]" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Action button below the circle */}
          <button
            type="button"
            onClick={handleEnter}
            className={`action-button ${navigationState === 'leaving' ? 'leaving-arrow' : ''}`}
            aria-label={`Open ${activeItem.title}`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* RIGHT COLUMN: Active Description */}
        <div className="launchpad-description">
          <span className="text-[10px] md:text-xs font-mono tracking-[0.25em] text-white/40 uppercase mb-4">
            LAUNCHPAD DESTINATION
          </span>
          <motion.div
            animate={isInteracting ? 'interacting' : 'active'}
            variants={{
              active: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.28, delay: 0.05, ease: [0.16, 1, 0.3, 1] }
              },
              interacting: {
                opacity: 0.2,
                y: 8,
                transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
              }
            }}
            className="description-inner"
          >
            <p className="face-description">
              {activeItem.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* FOOTER: Instruction Bar */}
      <footer className="launchpad-instructions z-20">
        {/* Desktop instructions */}
        <div className="hidden md:flex items-center justify-between w-full font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
          <span>DRAG / SCROLL TO NAVIGATE</span>
          <span>ENTER TO OPEN</span>
        </div>
        {/* Mobile instructions */}
        <div className="flex md:hidden items-center justify-between w-full font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase px-4">
          <span>SWIPE TO NAVIGATE</span>
          <span>TAP ARROW TO OPEN</span>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { projects, Project } from '../../data/projects';
import ProjectCard from './ProjectCard';
import './ProjectCarousel.css';

type TransitionState = 'idle' | 'selecting' | 'expanding' | 'navigating' | 'revealing';

export default function ProjectCarousel() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize active index based on route state if returning from a case study
  const initialIndex = projects.findIndex(
    (p) => p.id === location.state?.activeProjectId
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transitionState, setTransitionState] = useState<TransitionState>('idle');
  const [transitioningProject, setTransitioningProject] = useState<Project | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const startXRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Monitor prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (transitionState !== 'idle') return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, transitionState]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      timerRefs.current.forEach(clearTimeout);
    };
  }, []);

  const addTimer = (fn: () => void, delay: number) => {
    const timer = setTimeout(fn, delay);
    timerRefs.current.push(timer);
  };

  const handlePrev = () => {
    if (transitionState !== 'idle') return;
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (transitionState !== 'idle') return;
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const handleIndicatorClick = (index: number) => {
    if (transitionState !== 'idle') return;
    setActiveIndex(index);
  };

  // Drag Gesture Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (transitionState !== 'idle') return;
    
    // Only drag with primary mouse button / touch
    startXRef.current = e.clientX;
    isPointerDownRef.current = true;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    
    // Smooth responsive dampening of extreme drags
    setDragOffset(diff);
  };

  const handlePointerUpOrLeave = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    const threshold = 65; // Small responsive drag threshold
    if (dragOffset < -threshold) {
      handleNext();
    } else if (dragOffset > threshold) {
      handlePrev();
    }
    
    setDragOffset(0);
  };

  // VIEW CASE STUDY Transition Orchestrator
  const handleViewCaseStudy = (project: Project) => {
    if (transitionState !== 'idle') return;

    setTransitioningProject(project);
    setTransitionState('selecting');

    if (reducedMotion) {
      addTimer(() => {
        setTransitionState('navigating');
        navigate(`/projects/${project.id}`);
      }, 200);
      return;
    }

    // Step 1: Lock and scale active card slightly
    addTimer(() => {
      setTransitionState('expanding');
    }, 180);

    // Step 2: Expand active image to cover full viewport
    addTimer(() => {
      setTransitionState('navigating');
      // Transition routing to sub-detail page
      navigate(`/projects/${project.id}`);
    }, 750);
  };

  // Helper to compute modular circular difference for loop effect
  const getIndexDiff = (index: number, active: number, total: number) => {
    let diff = index - active;
    if (diff > total / 2) {
      diff -= total;
    } else if (diff < -total / 2) {
      diff += total;
    }
    return diff;
  };

  return (
    <section
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-neutral-950 px-6 py-8 md:py-12 select-none"
      aria-labelledby="projects-section-heading"
      id="projects-carousel-root"
    >
      {/* Background Graphic Grid Rules */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:60px_60px]" />
      
      {/* Dynamic Aria Live status region */}
      <div className="sr-only" aria-live="polite">
        Active project {activeIndex + 1} of {projects.length}: {projects[activeIndex].title}
      </div>

      {/* Top Header Line */}
      <div 
        className={`w-full max-w-7xl mx-auto flex items-end justify-between z-10 transition-all duration-500 ${
          transitionState !== 'idle' ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <header className="space-y-1 md:space-y-2">
          <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-neutral-500 uppercase">
            SELECTED WORK
          </span>
          <h2 
            id="projects-section-heading"
            className="text-3xl md:text-5xl font-medium tracking-tighter text-white uppercase"
          >
            PROJECTS
          </h2>
          <p className="text-neutral-400 font-light text-xs md:text-sm max-w-xl leading-relaxed">
            Digital products, event platforms and practical workflow systems.
          </p>
        </header>

        {/* Desktop Static Counter */}
        <div className="hidden md:flex flex-col items-end font-mono text-neutral-500 select-none">
          <span className="text-xs tracking-widest text-neutral-600 uppercase">CATALOG STATUS</span>
          <div className="text-3xl font-light tracking-widest text-white/90 pt-1">
            {String(activeIndex + 1).padStart(2, '0')}{' '}
            <span className="text-neutral-700">/</span>{' '}
            <span className="text-neutral-500">{String(projects.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Carousel Area */}
      <div 
        className="relative flex-grow w-full flex items-center justify-center z-10 my-4 md:my-6 overflow-visible"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Subtle Horizontal Industrial Rail behind cards */}
        <div className="project-carousel-rail" />

        {/* Sliding Cards Track */}
        <div 
          className="carousel-cards-track flex items-center"
          style={{
            transform: `translateX(calc(50vw - 50% - ${activeIndex} * (100% + var(--card-gap)) + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {projects.map((project, idx) => {
            const diff = getIndexDiff(idx, activeIndex, projects.length);
            const absDiff = Math.abs(diff);
            const isActive = idx === activeIndex;
            const isNeighbor = absDiff <= 1;

            // Generate active card spatial transformations (restrained spatial depth)
            let opacity = 1;
            let scale = 1;
            let rotateY = 0;
            let filter = 'blur(0px) saturate(1)';
            let zIndex = 10;

            if (isActive) {
              opacity = 1;
              scale = 1;
              rotateY = 0;
              filter = 'blur(0px) saturate(1)';
              zIndex = 10;
              
              if (transitionState === 'selecting') {
                scale = 1.025;
              } else if (transitionState === 'expanding') {
                scale = 1.05;
                opacity = 0; // Handled by expanding portal overlay
              }
            } else if (isNeighbor) {
              opacity = 0.44; // Adjacent card opacity range: 0.32 - 0.55
              scale = 0.90;   // Adjacent card scale range: 0.88 - 0.93
              rotateY = diff * 10; // Adjacent card rotation range: 8 - 14 deg
              filter = 'blur(1.5px) saturate(0.5)';
              zIndex = 5;
            } else {
              // Distant cards
              opacity = 0.15;
              scale = 0.82;
              rotateY = diff * 12;
              filter = 'blur(3px) saturate(0.2)';
              zIndex = 1;
            }

            // During transitions, all surrounding cards fade out
            if (transitionState !== 'idle' && transitioningProject) {
              if (project.id !== transitioningProject.id) {
                opacity = 0;
                filter = 'blur(6px) saturate(0)';
              }
            }

            return (
              <div
                key={project.id}
                className="carousel-card-container flex-shrink-0 relative"
                style={{
                  opacity,
                  transform: `perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`,
                  filter,
                  zIndex,
                  pointerEvents: transitionState !== 'idle' ? 'none' : 'auto',
                  transition: isDragging && isActive 
                    ? 'none' 
                    : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), filter 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <ProjectCard
                  project={project}
                  isActive={isActive}
                  isActiveOrNeighbor={isNeighbor}
                  isDragging={isDragging}
                  onViewCaseStudy={handleViewCaseStudy}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Controls / Indicator Panel */}
      <div 
        className={`w-full max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 px-4 z-20 transition-all duration-500 ${
          transitionState !== 'idle' ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* PREVIOUS Button */}
        <button
          onClick={handlePrev}
          className="group flex items-center gap-2.5 text-[10px] font-mono tracking-[0.25em] text-neutral-400 hover:text-white transition-colors uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white p-2 rounded-sm cursor-pointer select-none"
          aria-label="Previous project"
        >
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>PREVIOUS</span>
        </button>

        {/* Center Indicator Bar: 01 ━━━━━ 05 */}
        <div className="flex items-center gap-4 font-mono text-[11px] select-none">
          <span className="text-white/60">{String(activeIndex + 1).padStart(2, '0')}</span>
          <div className="flex gap-2 items-center" role="tablist" aria-label="Project selection">
            {projects.map((p, idx) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Go to project ${idx + 1}`}
                onClick={() => handleIndicatorClick(idx)}
                className={`h-[3px] transition-all duration-300 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                  idx === activeIndex ? 'w-8 bg-white' : 'w-3.5 bg-neutral-800 hover:bg-neutral-600'
                }`}
              />
            ))}
          </div>
          <span className="text-neutral-600">{String(projects.length).padStart(2, '0')}</span>
        </div>

        {/* NEXT Button */}
        <button
          onClick={handleNext}
          className="group flex items-center gap-2.5 text-[10px] font-mono tracking-[0.25em] text-neutral-400 hover:text-white transition-colors uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white p-2 rounded-sm cursor-pointer select-none"
          aria-label="Next project"
        >
          <span>NEXT</span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Cinematic Transition Portal Image Element */}
      {!reducedMotion && transitioningProject && transitionState !== 'idle' && (
        <div
          className={`pointer-events-none fixed z-50 bg-cover bg-center transition-all duration-[750ms] ease-[cubic-bezier(0.16,1,0.3,1)]
            ${transitionState === 'selecting' ? 'opacity-100 rounded-2xl' : ''}
            ${transitionState === 'expanding' ? 'opacity-100 rounded-none w-full h-full left-0 top-0 translate-x-0 translate-y-0 filter brightness-[1.1] scale-100' : ''}
            ${transitionState === 'navigating' ? 'opacity-0 scale-[1.01] rounded-none w-full h-full left-0 top-0 translate-x-0 translate-y-0 filter brightness-100' : ''}
          `}
          style={{
            backgroundImage: `url(${transitioningProject.image})`,
            // Set start dimensions matching active card layout centered on screen
            width: transitionState === 'selecting' ? 'var(--card-width)' : undefined,
            height: transitionState === 'selecting' ? 'var(--card-height)' : undefined,
            left: transitionState === 'selecting' ? '50%' : undefined,
            top: transitionState === 'selecting' ? '50%' : undefined,
            transform: transitionState === 'selecting' ? 'translate(-50%, -50%) scale(1.025)' : undefined,
          }}
        />
      )}
    </section>
  );
}

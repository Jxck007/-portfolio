import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Stack from '../ui/Stack';
import { projects, archiveProjects, type Project } from '../../data/projects';
import { SiGithub } from 'react-icons/si';
import { ExternalLink, LayoutGrid, Layers, FolderGit2, ChevronDown, ChevronUp } from 'lucide-react';
import type { RefObject } from 'react';

interface ProjectsSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
}

/* ── Grid Card ────────────────────────────────────────────────────────── */

function GridCard({ project, index, key }: { project: Project; index: number; key?: React.Key }) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const initials = project.title
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  const handleCaseStudy = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCaseStudy();
    }
  };

  return (
    <motion.article
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.32), ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col rounded-xl bg-zinc-950/90 border border-zinc-800 overflow-hidden transition-colors duration-300 hover:border-zinc-600/80 focus-within:border-zinc-600/80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      role="article"
      aria-label={`Project ${project.number}: ${project.title}`}
    >
      {/* ── Image ──────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-900 border-b border-zinc-800 flex-shrink-0">
        {!imageFailed && project.image ? (
          <img
            src={project.image}
            alt={`${project.title} project screenshot`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Technical Monochrome Fallback */
          <div className="w-full h-full bg-zinc-900/60 flex flex-col items-center justify-center relative font-mono text-zinc-700 select-none">
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <span className="text-5xl font-bold tracking-widest text-zinc-800">{initials}</span>
            <span className="text-[9px] mt-3 tracking-[0.3em] uppercase text-zinc-600">NO SIGNAL</span>
          </div>
        )}

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />

        {/* Category tag */}
        <div className="absolute top-3 left-3 bg-zinc-950/80 border border-zinc-800/60 px-2 py-0.5 rounded text-[9px] font-mono tracking-widest text-zinc-400 uppercase backdrop-blur-sm">
          {project.category}
        </div>
      </div>

      {/* ── Card Body ──────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 space-y-2">
        {/* Metadata Row: Number / Year / Status */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 tracking-wider uppercase flex-wrap">
          <span className="text-white font-semibold bg-zinc-900 px-1.5 py-0.5 rounded">
            {project.number}
          </span>
          <span className="text-zinc-700">/</span>
          <span>{project.year}</span>
          {project.status && (
            <>
              <span className="text-zinc-700">/</span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  project.status.toLowerCase().includes('live') || project.status.toLowerCase().includes('active')
                    ? 'bg-white'
                    : 'bg-zinc-500'
                }`} />
                {project.status}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-sans font-semibold tracking-tight text-white text-sm leading-tight group-hover:text-zinc-200 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-2 flex-1">
          {project.shortDescription}
        </p>

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <ul className="space-y-0.5 pt-1.5 border-t border-zinc-800/60">
            {project.highlights.slice(0, 2).map((hl, i) => (
              <li key={i} className="text-[10px] font-mono text-zinc-500 flex items-start gap-1.5">
                <span className="text-zinc-600 mt-0.5 shrink-0">›</span>
                <span className="line-clamp-1">{hl}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-1 pt-0.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-1.5 py-px rounded bg-zinc-900 border border-zinc-800 text-[8px] font-mono text-zinc-400"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* ── Actions ──────────────────────────────────────────────── */}
        <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center gap-2.5 mt-auto">
          {/* Primary: View Case Study */}
          <button
            onClick={handleCaseStudy}
            onKeyDown={handleKeyDown}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-black font-mono text-[11px] tracking-wider uppercase hover:bg-zinc-200 transition-colors rounded-sm font-semibold cursor-pointer shrink-0 group/btn"
            aria-label={`View case study for ${project.title}`}
          >
            <span>Case Study</span>
            <svg
              className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          {/* Secondary: Live Site */}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider text-zinc-500 hover:text-white transition-colors uppercase border-b border-transparent hover:border-white pb-0.5"
              aria-label={`Open live site for ${project.title}`}
            >
              Live
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}

          {/* Secondary: Source */}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider text-zinc-500 hover:text-white transition-colors uppercase border-b border-transparent hover:border-white pb-0.5"
              aria-label={`Open source repository for ${project.title}`}
            >
              <span className="inline-flex"><SiGithub /></span>
              Source
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ── Main Section ─────────────────────────────────────────────────────── */

export default function ProjectsSection({ sectionRef }: ProjectsSectionProps) {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [projectViewMode, setProjectViewMode] = useState<'grid' | 'stack'>('grid');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* 3D Stack card content (preserved from existing implementation) */
  const projectStackCards = projects.map((p) => (
    <div
      key={p.id}
      className="w-full h-full p-6 sm:p-7 flex flex-col justify-between text-left select-none relative overflow-hidden bg-zinc-950/95 border border-zinc-700/80 rounded-2xl shadow-2xl group transition-all"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between w-full border-b border-zinc-800 pb-3 z-10">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-700 text-zinc-200">
            {p.category}
          </span>
          <span className="text-[10px] font-mono text-zinc-300 flex items-center gap-1.5 bg-zinc-900/60 px-2 py-0.5 rounded border border-zinc-800">
            <span className={`w-1.5 h-1.5 rounded-full ${
              p.status?.toLowerCase().includes('live') || p.status?.toLowerCase().includes('active')
                ? 'bg-white animate-pulse'
                : 'bg-zinc-500'
            }`} />
            {p.status || 'Active'}
          </span>
        </div>
        <span className="font-mono text-xs font-bold text-zinc-400 tracking-widest">
          {p.number} / 04
        </span>
      </div>

      {/* Card Body */}
      <div className="space-y-3 my-auto py-2 z-10">
        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
            {p.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
            {p.fullDescription || p.shortDescription}
          </p>
        </div>

        {p.highlights && p.highlights.length > 0 && (
          <ul className="space-y-1 pt-1 border-t border-zinc-800/80">
            {p.highlights.slice(0, 2).map((hl, i) => (
              <li key={i} className="text-[11px] font-mono text-zinc-400 flex items-start gap-1.5">
                <span className="text-zinc-500 mt-0.5">›</span>
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {p.technologies.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Card Actions */}
      <div className="w-full pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2.5 z-10">
        <div className="flex items-center gap-2">
          {p.githubUrl && (
            <a
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="cursor-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs font-semibold transition-all hover:scale-105"
            >
              <span className="inline-flex text-sm"><SiGithub /></span>
              <span>Repository</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          )}

          {p.liveUrl && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="cursor-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-mono text-xs font-bold transition-all hover:scale-105 shadow-md"
            >
              <span>Live Demo</span>
              <ExternalLink className="w-3 h-3 text-black" />
            </a>
          )}
        </div>

        <span className="text-[10px] font-mono text-zinc-400 tracking-wider flex items-center gap-1">
          <span>Swipe or click to cycle</span>
        </span>
      </div>
    </div>
  ));

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="space-y-6 pt-6 text-left"
      aria-labelledby="projects-heading"
    >
      {/* ── Section Header & View Mode Switcher ────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
            03 / WORK
          </span>
          <h2
            id="projects-heading"
            className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight"
          >
            PROJECTS
          </h2>
          <p className="text-zinc-500 text-xs font-light max-w-lg leading-relaxed">
            Systems, platforms and tools — built with intention.
          </p>
        </div>

        {/* View Mode Toggle: Grid (default) vs 3D Stack (secondary) */}
        <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setProjectViewMode('grid')}
            className={`cursor-target flex items-center gap-1.5 px-3 py-1 rounded font-mono text-[10px] uppercase tracking-wider transition-all ${
              projectViewMode === 'grid'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            aria-pressed={projectViewMode === 'grid'}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>

          <button
            onClick={() => setProjectViewMode('stack')}
            className={`cursor-target flex items-center gap-1.5 px-3 py-1 rounded font-mono text-[10px] uppercase tracking-wider transition-all ${
              projectViewMode === 'stack'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            aria-pressed={projectViewMode === 'stack'}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Stack</span>
          </button>
        </div>
      </div>

      {/* ── VIEW 1: RESPONSIVE PROJECT GRID ─────────────────────────── */}
      <AnimatePresence mode="wait">
        {projectViewMode === 'grid' && (
          <motion.div
            key="grid"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2"
          >
            {projects.map((p, idx) => (
              <GridCard key={p.id} project={p} index={idx} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VIEW 2: 3D STACK (Secondary) ───────────────────────────── */}
      <AnimatePresence mode="wait">
        {projectViewMode === 'stack' && (
          <motion.div
            key="stack"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center justify-center py-4"
          >
            <div className="w-full max-w-[580px] h-[320px] sm:h-[380px] md:h-[420px] relative flex items-center justify-center">
              <Stack
                cards={projectStackCards}
                randomRotation={true}
                sensitivity={140}
                sendToBackOnClick={true}
                animationConfig={{ stiffness: 280, damping: 22 }}
                pauseOnHover={true}
                className="w-full h-full"
              />
            </div>
            <p className="text-[10px] font-mono text-zinc-500 tracking-wider mt-4">
              Swipe, drag or click cards to cycle through projects
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ARCHIVE: MORE PROJECTS ──────────────────────────────────── */}
      <div className="w-full border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/70 mt-6">
        <button
          onClick={() => setIsArchiveOpen(!isArchiveOpen)}
          className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/60 transition-colors text-left cursor-target"
          aria-expanded={isArchiveOpen}
          aria-controls="archive-projects-list"
        >
          <div className="flex items-center gap-2.5">
            <FolderGit2 className="w-4 h-4 text-white" />
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Archive ({archiveProjects.length})
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono">
            <span>{isArchiveOpen ? 'Collapse' : 'Expand'}</span>
            {isArchiveOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        <AnimatePresence>
          {isArchiveOpen && (
            <motion.div
              id="archive-projects-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-zinc-800 divide-y divide-zinc-800/80"
            >
              {archiveProjects.map((ap, idx) => (
                <div key={idx} className="p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                  <div className="sm:col-span-4 font-mono font-bold text-xs text-white">
                    {ap.title}
                  </div>
                  <div className="sm:col-span-3 text-[11px] font-mono text-zinc-400">
                    {ap.stack}
                  </div>
                  <div className="sm:col-span-5 text-xs font-sans text-zinc-300">
                    {ap.description}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

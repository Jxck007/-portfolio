import React, { useState } from 'react';
import { Project } from '../../data/projects';
import PixelCard from './PixelCard';

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  isActiveOrNeighbor: boolean;
  isDragging: boolean;
  onViewCaseStudy: (project: Project) => void;
}

export default function ProjectCard({
  project,
  isActive,
  isActiveOrNeighbor,
  isDragging,
  onViewCaseStudy
}: ProjectCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = project.title
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <PixelCard
      active={isActive}
      isActiveOrNeighbor={isActiveOrNeighbor}
      isDragging={isDragging}
      gap={7}
      speed={22}
      colors="#f5f5f4,#a8a29e,#57534e"
      className="project-pixel-card select-none group/card"
    >
      <article
        className="project-card-wrapper flex flex-col md:flex-row h-full w-full bg-neutral-950/80 border border-neutral-800/80 rounded-2xl overflow-hidden"
        aria-label={`Project ${project.number} of 5: ${project.title}`}
      >
        {/* Project Image Section (58-64% width on desktop) */}
        <div className="w-full md:w-[58%] h-[220px] md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r border-neutral-900 flex-shrink-0">
          {!imageFailed && project.image ? (
            <img
              src={project.image}
              alt={`${project.title} project screenshot`}
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.025]"
              referrerPolicy="no-referrer"
            />
          ) : (
            /* Technical Monochrome Fallback */
            <div className="w-full h-full bg-neutral-900/60 flex flex-col items-center justify-center relative font-mono text-neutral-700 select-none">
              <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <span className="text-7xl font-bold tracking-widest text-neutral-800">{initials}</span>
              <span className="text-[10px] mt-4 tracking-[0.3em] uppercase text-neutral-600">SYSTEM OFFLINE</span>
            </div>
          )}
          {/* Subtle Dark Gradient Overlay at the bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/10 to-transparent pointer-events-none" />
          
          {/* Floating Category Tag for Visual Interest on desktop image */}
          <div className="absolute top-4 left-4 bg-neutral-950/80 border border-neutral-800/50 px-2.5 py-1 rounded-md text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
            {project.category}
          </div>
        </div>

        {/* Project Information Details Section */}
        <div className="flex-grow p-6 md:p-8 flex flex-col justify-between h-auto md:h-full bg-neutral-950/50 relative">
          <div className="space-y-4">
            {/* Metadata Row */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 tracking-wider uppercase">
              <span className="text-white font-semibold font-mono bg-neutral-900 px-1.5 py-0.5 rounded">{project.number}</span>
              <span className="text-neutral-700">/</span>
              <span>{project.category}</span>
              <span className="text-neutral-700">/</span>
              <span>{project.year}</span>
              {project.status && (
                <>
                  <span className="text-neutral-700">/</span>
                  <span className="text-emerald-500/80 font-semibold">{project.status}</span>
                </>
              )}
            </div>

            {/* Display Typography Title */}
            <h3
              className="font-sans font-medium tracking-tight text-white leading-none transition-transform duration-300 group-hover/card:-translate-y-[2px]"
              style={{ fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)' }}
            >
              {project.title}
            </h3>

            {/* Responsive Description Box */}
            <p className="text-neutral-400 font-light text-xs md:text-sm leading-relaxed max-w-[48ch] line-clamp-3 md:line-clamp-4 hidden sm:block">
              {project.shortDescription}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-neutral-900/50 mt-4 md:mt-0">
            {/* Technology Labels List */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-mono text-neutral-500">
              {project.technologies.map((tech, i) => (
                <React.Fragment key={tech}>
                  {i > 0 && <span className="text-neutral-700 font-light">/</span>}
                  <span className="hover:text-neutral-300 transition-colors">{tech}</span>
                </React.Fragment>
              ))}
            </div>

            {/* Project Actions Button Row */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => onViewCaseStudy(project)}
                className="px-4 py-2 bg-white text-black font-mono text-[11px] tracking-wider uppercase hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer rounded-sm group/btn font-semibold"
                aria-label={`View detailed case study of ${project.title}`}
              >
                <span>View Case Study</span>
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

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono tracking-wider text-neutral-400 hover:text-white transition-colors uppercase border-b border-transparent hover:border-white pb-0.5"
                >
                  Live Site
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono tracking-wider text-neutral-400 hover:text-white transition-colors uppercase border-b border-transparent hover:border-white pb-0.5"
                >
                  Source
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </PixelCard>
  );
}

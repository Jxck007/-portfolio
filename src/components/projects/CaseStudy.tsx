import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projects, Project } from '../../data/projects';
import { motion } from 'motion/react';

import { useReducedMotion } from '../../utils/useReducedMotion';

export default function CaseStudy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [project, setProject] = useState<Project | null>(() => {
    return projects.find((p) => p.id === id) || null;
  });

  useEffect(() => {
    const found = projects.find((p) => p.id === id);
    setProject(found || null);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center font-mono">
        <span className="text-xs text-neutral-500 uppercase tracking-[0.2em] mb-4">SEARCHING SYSTEM DATA...</span>
        <h2 className="text-xl border border-neutral-800 px-4 py-2 rounded">PROJECT RECORD NOT FOUND</h2>          <button
            onClick={() => navigate('/projects')}
            className="cursor-target mt-6 text-xs uppercase tracking-widest text-neutral-400 hover:text-white border-b border-neutral-800 pb-0.5 transition-colors cursor-pointer"
          >
            ← BACK TO WORK
          </button>
      </div>
    );
  }

  const handleBack = () => {
    // Reverse transition back to the launchpad projects list
    navigate('/projects', { state: { activeProjectId: project.id } });
  };

  // Structured case study details mapped directly from Jack's actual project records
  const getCaseStudyDetails = (pId: string) => {
    switch (pId) {
      case 'zyphoria':
        return {
          challenge: 'College symposiums need a centralized platform for event information, registration, and live coordination across multiple academic departments.',
          solution: 'Built the official symposium platform with TypeScript, Supabase, and React deployed on Vercel. Features include participant registration, schedule management, event updates, and real-time live coordination across departments.',
          impact: 'Successfully served as the official symposium platform, supporting registrations and event operations in a collaborative high-availability development environment.',
          metrics: ['Real-time event coordination', 'Multi-department support', 'Supabase backend', 'Live in production']
        };
      case 'billease':
        return {
          challenge: 'Small businesses need an intuitive billing, quotation, and invoice generation platform that supports bilingual workflows and real-time synchronization.',
          solution: 'Architected a billing platform with React, TypeScript, Firebase, and Tailwind CSS. Features bilingual Tamil and English localization, instant PDF generation, and cloud-backed real-time synchronization via Firebase.',
          impact: 'Tailored for seamless usability by non-technical business operators with real-time cloud sync and instant PDF output.',
          metrics: ['Bilingual Tamil/English', 'Instant PDF generation', 'Firebase real-time sync', 'Active in production']
        };
      case 'mystery-box':
        return {
          challenge: 'College events need real-time game and event management with live team coordination, dynamic scoring algorithms, and real-time leaderboard broadcast.',
          solution: 'Built a real-time event platform with TypeScript, Supabase, React, and Supabase Realtime API. Features live team coordination for ~65 teams, dynamic scoring, leaderboard broadcast, and organizer administration.',
          impact: 'Deployed during a major college event serving ~65 participating teams with low-latency Supabase websocket data handling.',
          metrics: ['65+ teams served live', 'Real-time leaderboards', 'Supabase websockets', 'Deployed live']
        };
      case 'forge-resume':
        return {
          challenge: 'Job seekers struggle with cluttered resume formats and complex design tools that fail ATS parsers or break layout exports.',
          solution: 'Built a modern resume builder with React, TypeScript, Firebase, and Tailwind CSS. Features document import, modular section editing, optional AI-assisted writing polish, and instant live PDF compilation.',
          impact: 'Delivered a fast, zero-bloat resume generator that produces clean, ATS-friendly professional resumes with transparent, student-friendly output.',
          metrics: ['AI-assisted writing tools', 'ATS-optimized output', 'Instant PDF export', 'Live in production']
        };
      default:
        return {
          challenge: 'Developing high-performance, maintainable systems tailored for campus workflows and modern developer productivity.',
          solution: 'Engineered clean backend services paired with cross-platform interfaces and relational database schemas.',
          impact: 'Delivered reliable systems with high developer experience and robust operational benchmarks.',
          metrics: ['Robust optimization', 'Modular architecture', 'High-performance layout']
        };
    }
  };

  const details = getCaseStudyDetails(project.id);

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white selection:bg-white/20 select-text">
      {/* Background Graphic Grid */}
      <div className="fixed inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-neutral-950 to-neutral-950" />
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between border-b border-neutral-900 pb-6 mb-10"
        >
          <button
            onClick={handleBack}
            className="cursor-target group flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 hover:text-white transition-colors uppercase cursor-pointer"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>BACK TO WORK</span>
          </button>
          
          <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase hidden sm:inline">
            ARCHIVE NODE // {project.number}
          </span>
        </motion.div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-neutral-400 uppercase tracking-wider">
              <span className="text-white font-mono bg-neutral-900 px-2 py-0.5 rounded">{project.number}</span>
              <span>•</span>
              <span>{project.category}</span>
              <span>•</span>
              <span>{project.year}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tighter text-white leading-none">
              {project.title}
            </h1>
            
            <p className="text-neutral-400 text-base md:text-lg font-light leading-relaxed max-w-2xl pt-2">
              {project.fullDescription || project.shortDescription}
            </p>
          </motion.div>

          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 w-full aspect-video md:aspect-[4/3] rounded-xl overflow-hidden border border-neutral-900 bg-neutral-900"
          >
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-neutral-900 mb-16" />

        {/* Deep Dive Study Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Detailed analysis */}
          <div className="md:col-span-8 space-y-12">
            {/* Challenge */}
            <motion.section
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <h2 className="text-xs font-mono tracking-[0.25em] text-neutral-500 uppercase">01 / CHALLENGE</h2>
              <p className="text-neutral-300 font-light leading-relaxed text-sm md:text-base">
                {details.challenge}
              </p>
            </motion.section>

            {/* Solution */}
            <motion.section
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3"
            >
              <h2 className="text-xs font-mono tracking-[0.25em] text-neutral-500 uppercase">02 / SOLUTION AND ENGINEERING</h2>
              <p className="text-neutral-300 font-light leading-relaxed text-sm md:text-base">
                {details.solution}
              </p>
            </motion.section>

            {/* Impact */}
            <motion.section
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3"
            >
              <h2 className="text-xs font-mono tracking-[0.25em] text-neutral-500 uppercase">03 / RESULT AND IMPACT</h2>
              <p className="text-neutral-300 font-light leading-relaxed text-sm md:text-base">
                {details.impact}
              </p>
            </motion.section>
          </div>

          {/* Tech Spec Sidebar */}
          <div className="md:col-span-4 space-y-8 p-6 bg-neutral-950/40 border border-neutral-900 rounded-xl">
            {/* Tech stack */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase">ENGINEERING STACK</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-3 pt-4 border-t border-neutral-900">
              <h3 className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase">SYSTEM BENCHMARKS</h3>
              <ul className="space-y-2 font-mono text-xs text-neutral-400">
                {details.metrics.map((metric, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div className="space-y-3 pt-4 border-t border-neutral-900">
              <h3 className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase">METADATA FEED</h3>
              <div className="flex flex-col gap-2 font-mono text-xs">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-target text-neutral-400 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>LIVE INTERACTIVE INSTANCE</span>
                    <span>→</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-target text-neutral-400 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>SOURCE ARCHIVE</span>
                    <span>→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Back */}
        <div className="w-full h-[1px] bg-neutral-900 mt-20 mb-8" />
        <div className="flex justify-between items-center text-xs font-mono text-neutral-500">
          <span>PORTFOLIO LAUNCHPAD OS</span>
          <button
            onClick={handleBack}
            className="cursor-target text-neutral-400 hover:text-white uppercase transition-colors"
          >
            ← BACK TO WORK
          </button>
        </div>
      </div>
    </div>
  );
}

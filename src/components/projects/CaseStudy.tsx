import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projects, Project } from '../../data/projects';
import { motion } from 'motion/react';

export default function CaseStudy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
  }, []);

  useEffect(() => {
    const found = projects.find((p) => p.id === id);
    if (found) {
      setProject(found);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center font-mono">
        <span className="text-xs text-neutral-500 uppercase tracking-[0.2em] mb-4">SEARCHING SYSTEM DATA...</span>
        <h2 className="text-xl border border-neutral-800 px-4 py-2 rounded">PROJECT RECORD NOT FOUND</h2>
        <button
          onClick={() => navigate('/projects')}
          className="mt-6 text-xs uppercase tracking-widest text-neutral-400 hover:text-white border-b border-neutral-800 pb-0.5 transition-colors cursor-pointer"
        >
          Return to Launchpad
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
      case 'uniqscan':
        return {
          challenge: 'Traditional on-duty (OD) and campus permission management relied on manual paper forms, physical signatures, and cumbersome checkpoint verification for student movements.',
          solution: 'Engineered a full-stack paperless permission system with React Native mobile client, robust Python Flask REST API backend, and relational PostgreSQL data store. Student requests are approved digitally and authenticated in real-time via dynamic QR code scanning on student ID cards. BE Capstone Project.',
          impact: 'Eliminated manual paper friction entirely, cutting permission turnaround time by 90% and enabling sub-second identity verification at security checkpoints.',
          metrics: ['90% faster processing', '100% paperless approvals', 'Instant QR validation', 'BE Capstone']
        };
      case 'rit-grubpoint':
        return {
          challenge: 'Campus dining halls experienced long wait times, congested payment queues, and unpredictable food availability during peak lunch breaks.',
          solution: 'Built a cross-platform mobile ordering application using Flutter and Dart, backed by Firebase Authentication, Firestore, and Realtime Database. Integrated a campus student digital wallet system, advance table reservations, and live order tracking from kitchen to pickup.',
          impact: 'Streamlined meal orders for hundreds of students, drastically reducing wait times and digitizing cashless transactions across campus cafeterias.',
          metrics: ['Live order status', 'Built-in student wallet', 'Table reservation system', 'Zero cash friction']
        };
      case 'edumate':
        return {
          challenge: 'College students struggled to find instant, accurate academic information, syllabus notes, and campus updates scattered across disparate portals and bulletin boards.',
          solution: 'Developed a multilingual Flutter-based educational assistant powered by Python NLP pipelines and intelligent query classifiers to provide instant, context-aware answers to student queries.',
          impact: 'Empowered students with 24/7 academic assistance in multiple regional languages with high natural language comprehension and instant query turnaround.',
          metrics: ['Multilingual support', 'Instant NLP answering', 'Cross-platform Flutter', '24/7 Academic bot']
        };
      case 'flask-resume-builder':
        return {
          challenge: 'Job seekers often struggle with cluttered resume formats and complex design tools that fail ATS parsers or break layout exports.',
          solution: 'Constructed an intuitive, lightweight Python Flask web application featuring real-time structured preview, modular section reordering, Jinja2 dynamic templating, and clean PDF compilation.',
          impact: 'Delivered a fast, zero-bloat resume generator that produces clean, ATS-friendly professional resumes in seconds without requiring heavy third-party software.',
          metrics: ['ATS-compliant output', 'Real-time live preview', 'Instant PDF export', 'Modular Flask backend']
        };
      case 'flask-notes-app':
        return {
          challenge: 'Demonstrating clean, minimal full-stack architectural fundamentals without bloated frontend bundles or excessive third-party dependencies.',
          solution: 'Engineered an elegant Flask web application utilizing relational SQLite persistence, parameterized queries, Jinja2 server-side rendering, and strict CRUD state handling.',
          impact: 'Serves as a prime reference for minimal, secure full-stack Python development with zero build step overhead and instant response times.',
          metrics: ['Lightweight architecture', 'SQLite persistence', 'Clean RESTful CRUD', 'Zero frontend bloat']
        };
      default:
        return {
          challenge: 'Developing high-performance, maintainable systems tailored for campus workflows and modern developer productivity.',
          solution: 'Engineered clean Python backend microservices paired with cross-platform Dart/Flutter interfaces and relational database schemas.',
          impact: 'Delivered reliable systems with high developer experience and robust operational benchmarks.',
          metrics: ['Robust optimization', 'Modular architecture', 'High-performance layout']
        };
    }
  };

  const details = getCaseStudyDetails(project.id);

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white selection:bg-white/20 select-text overflow-y-auto">
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
            className="group flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 hover:text-white transition-colors uppercase cursor-pointer"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Return to Projects</span>
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
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 uppercase tracking-wider">
              <span className="text-white font-mono bg-neutral-900 px-2 py-0.5 rounded">{project.number}</span>
              <span>•</span>
              <span>{project.category}</span>
              <span>•</span>
              <span>{project.year}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-medium tracking-tighter text-white leading-none">
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
                    className="text-neutral-400 hover:text-white transition-colors flex items-center justify-between"
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
                    className="text-neutral-400 hover:text-white transition-colors flex items-center justify-between"
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
            className="text-neutral-400 hover:text-white uppercase transition-colors cursor-pointer"
          >
            CLOSE CASE STUDY [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import TargetCursor from './ui/TargetCursor';
import SiteHeader from './sections/SiteHeader';
import HeroSection from './sections/HeroSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';
import type { SectionType } from './sections/types';

interface IntroPlaceholderProps {
  heroReady?: boolean;
  onReset?: () => void;
  key?: React.Key;
}

export default function IntroPlaceholder({ heroReady, onReset }: IntroPlaceholderProps) {
  const [activeSection, setActiveSection] = useState<SectionType>('home');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Section Refs for smooth scroll & active section tracking
  const homeRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // IntersectionObserver-based scroll spy (replaces window.addEventListener('scroll'))
  useEffect(() => {
    const refs: { id: SectionType; ref: React.RefObject<HTMLElement | null> }[] = [
      { id: 'home', ref: homeRef },
      { id: 'skills', ref: skillsRef },
      { id: 'projects', ref: projectsRef },
      { id: 'about', ref: aboutRef },
      { id: 'contact', ref: contactRef },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const match = refs.find((r) => r.ref.current === visible[0].target);
          if (match) setActiveSection(match.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    refs.forEach((r) => {
      if (r.ref.current) observer.observe(r.ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll to target section
  const scrollToSection = (sec: SectionType) => {
    setActiveSection(sec);
    setMobileMenuOpen(false);
    const element = document.getElementById(sec);
    if (element) {
      const yOffset = -70; // Header offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };


  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('jdnk007@gmail.com');
    setCopiedEmail(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <div
      className="relative w-full min-h-screen bg-transparent text-white font-sans selection:bg-white/20 selection:text-white"
      id="portfolio-container"
    >
      {/* Target Cursor Component */}
      <TargetCursor
        targetSelector=".cursor-target"
        spinDuration={2.0}
        hideDefaultCursor={true}
        parallaxOn={true}
        cursorColor="#ffffff"
        cursorColorOnTarget="#ffffff"
      />

      {/* STICKY TOP NAVIGATION BAR */}
      <SiteHeader
        activeSection={activeSection}
        onNavigate={scrollToSection}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onReset={onReset}
      />

      {/* CONTINUOUS SCROLLABLE DOCUMENT LAYOUT */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-16 sm:space-y-24 md:space-y-32">
        {/* SECTION 1: HOME (HERO WITH CLEAN STATIC TYPOGRAPHY & LASER EYES) */}
        <HeroSection sectionRef={homeRef} onNavigate={scrollToSection} heroReady={heroReady} />

        {/* SECTION 2: SKILLS (MARQUEE WITH NON-DISRUPTIVE INSPECTOR) */}
        <SkillsSection sectionRef={skillsRef} />

        {/* SECTION 3: PROJECTS (RESPONSIVE GRID + INTERACTIVE STACK TOGGLE) */}
        <ProjectsSection sectionRef={projectsRef} />

        {/* SECTION 4: ABOUT (CLEAN 2-COLUMN RESPONSIVE LAYOUT) */}
        <AboutSection sectionRef={aboutRef} />

        {/* SECTION 5: CONTACT (DIRECT MAIL FORM + ZERO TWITTER SOCIALS) */}
        <ContactSection sectionRef={contactRef} copiedEmail={copiedEmail} onCopyEmail={handleCopyEmail} />
      </div>

      {/* Persistent Bottom Footer Bar */}
      <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/80 mt-16 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400 gap-3">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
            <span className="truncate">JEGADEESH (JACK) NANDAKUMAR · 2026</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <button
              onClick={handleCopyEmail}
              className="cursor-target hover:text-white transition-colors uppercase whitespace-nowrap"
            >
              {copiedEmail ? 'Email Copied!' : 'jdnk007@gmail.com'}
            </button>
            <span className="hidden sm:inline">·</span>
            <span className="whitespace-nowrap">Chennai, India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

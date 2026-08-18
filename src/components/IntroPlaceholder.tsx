import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import RotatingText from './ui/RotatingText';
import LogoLoop, { LogoItem } from './ui/LogoLoop';
import TargetCursor from './ui/TargetCursor';
import Stack from './ui/Stack';
import ContributionGraph from './ui/ContributionGraph';
import PixelCard from './ui/PixelCard';
import { SKILLS_DATA, SkillDetail } from '../data/skills';
import { projects, archiveProjects } from '../data/projects';
import heroAvatarImg from '../assets/images/Avatar.png';

// Tech Stack Icons from react-icons/si, react-icons/fa6, react-icons/tb
import {
  SiPython,
  SiPostgresql,
  SiSqlite,
  SiFirebase,
  SiFlutter,
  SiFlask,
  SiReact,
  SiDart,
  SiHtml5,
  SiJavascript,
  SiDocker,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiRender,
  SiVercel,
  SiDjango,
  SiJenkins,
  SiLeetcode,
  SiSupabase
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa6';
import { TbDatabase, TbBrandCss3 } from 'react-icons/tb';
import {
  ExternalLink,
  X,
  ArrowRight,
  Check,
  Copy,
  Code2,
  Layers,
  Cpu,
  Mail,
  Linkedin,
  Terminal,
  Sparkles,
  GraduationCap,
  FolderGit2,
  Send,
  Award,
  Briefcase,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  LayoutGrid,
  Menu,
  FileText
} from 'lucide-react';

interface IntroPlaceholderProps {
  onReset?: () => void;
  key?: React.Key;
}

type SectionType = 'home' | 'skills' | 'projects' | 'about' | 'contact';
type StackCategoryTab = 'all' | 'hands-on' | 'builds' | 'learning';

export default function IntroPlaceholder({ onReset }: IntroPlaceholderProps) {
  const [activeSection, setActiveSection] = useState<SectionType>('home');
  const [activeStackTab, setActiveStackTab] = useState<StackCategoryTab>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [projectViewMode, setProjectViewMode] = useState<'grid' | 'stack'>('grid');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle skill inspector open/close
  const toggleSkill = (skill: SkillDetail) => {
    setSelectedSkill((prev) => (prev?.id === skill.id ? null : skill));
  };

  // Direct Mail Form States
  const [senderEmail, setSenderEmail] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Section Refs for smooth scroll & active section tracking
  const homeRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // ScrollSpy to update active navbar state based on current viewport scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      const sections: { id: SectionType; ref: React.RefObject<HTMLElement | null> }[] = [
        { id: 'contact', ref: contactRef },
        { id: 'about', ref: aboutRef },
        { id: 'projects', ref: projectsRef },
        { id: 'skills', ref: skillsRef },
        { id: 'home', ref: homeRef },
      ];

      for (const section of sections) {
        if (section.ref.current) {
          const top = section.ref.current.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('jdnk007@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleSendMail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderEmail || !mailMessage) return;

    const subjectText = encodeURIComponent(mailSubject || 'Engineering Inquiry from Portfolio');
    const bodyText = encodeURIComponent(
      `From: ${senderEmail}\n\nMessage:\n${mailMessage}\n\n---\nSent via Jack Nandakumar Portfolio Contact Form`
    );

    window.location.href = `mailto:jdnk007@gmail.com?subject=${subjectText}&body=${bodyText}`;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setSenderEmail('');
      setMailSubject('');
      setMailMessage('');
    }, 4000);
  };

  // Helper to render icon for any skill
  const getSkillIcon = (iconName: string, className = "text-sm") => {
    switch (iconName) {
      case 'SiPython': return <span className={className}><SiPython /></span>;
      case 'SiPostgresql': return <span className={className}><SiPostgresql /></span>;
      case 'SiSqlite': return <span className={className}><SiSqlite /></span>;
      case 'SiFirebase': return <span className={className}><SiFirebase /></span>;
      case 'SiFlutter': return <span className={className}><SiFlutter /></span>;
      case 'SiFlask': return <span className={className}><SiFlask /></span>;
      case 'SiReact': return <span className={className}><SiReact /></span>;
      case 'SiDart': return <span className={className}><SiDart /></span>;
      case 'SiHtml5': return <span className={className}><SiHtml5 /></span>;
      case 'SiJavascript': return <span className={className}><SiJavascript /></span>;
      case 'SiDocker': return <span className={className}><SiDocker /></span>;
      case 'SiGit': return <span className={className}><SiGit /></span>;
      case 'SiGithub': return <span className={className}><SiGithub /></span>;
      case 'SiGithubactions': return <span className={className}><SiGithubactions /></span>;
      case 'SiRender': return <span className={className}><SiRender /></span>;
      case 'SiVercel': return <span className={className}><SiVercel /></span>;
      case 'SiDjango': return <span className={className}><SiDjango /></span>;
      case 'SiJenkins': return <span className={className}><SiJenkins /></span>;
      case 'SiLeetcode': return <span className={className}><SiLeetcode /></span>;
      case 'SiSupabase': return <span className={className}><SiSupabase /></span>;
      case 'FaAws':
      case 'SiAmazonaws': return <span className={className}><FaAws /></span>;
      case 'TbDatabase': return <span className={className}><TbDatabase /></span>;
      case 'TbBrandCss3': return <span className={className}><TbBrandCss3 /></span>;
      default: return <Code2 className={className} />;
    }
  };

  // Category-based tech stacks
  const handsOnLogos: LogoItem[] = [
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.python)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiPython /></span> Python
        </button>
      ),
      title: 'Python'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.flask)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiFlask /></span> Flask
        </button>
      ),
      title: 'Flask'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.sql)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><TbDatabase /></span> SQL
        </button>
      ),
      title: 'SQL'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.postgresql)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiPostgresql /></span> PostgreSQL
        </button>
      ),
      title: 'PostgreSQL'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.sqlite)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiSqlite /></span> SQLite
        </button>
      ),
      title: 'SQLite'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.git)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiGit /></span> Git
        </button>
      ),
      title: 'Git'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.github)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiGithub /></span> GitHub
        </button>
      ),
      title: 'GitHub'
    }
  ];

  const buildLogos: LogoItem[] = [
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.flutter)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiFlutter /></span> Flutter
        </button>
      ),
      title: 'Flutter'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.dart)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiDart /></span> Dart
        </button>
      ),
      title: 'Dart'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.react)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiReact /></span> React
        </button>
      ),
      title: 'React'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.javascript)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiJavascript /></span> JavaScript
        </button>
      ),
      title: 'JavaScript'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.firebase)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiFirebase /></span> Firebase
        </button>
      ),
      title: 'Firebase'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.supabase)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiSupabase /></span> Supabase
        </button>
      ),
      title: 'Supabase'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.render)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiRender /></span> Render
        </button>
      ),
      title: 'Render'
    }
  ];

  const learningLogos: LogoItem[] = [
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.django)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiDjango /></span> Django
        </button>
      ),
      title: 'Django'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.docker)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiDocker /></span> Docker
        </button>
      ),
      title: 'Docker'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.aws)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><FaAws /></span> AWS
        </button>
      ),
      title: 'AWS'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.githubactions)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiGithubactions /></span> CI/CD
        </button>
      ),
      title: 'CI/CD'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.jenkins)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiJenkins /></span> Jenkins
        </button>
      ),
      title: 'Jenkins'
    },
    {
      node: (
        <button
          onClick={() => toggleSkill(SKILLS_DATA.vercel)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"
        >
          <span className="text-sm text-zinc-100 inline-flex"><SiVercel /></span> Vercel
        </button>
      ),
      title: 'Vercel'
    }
  ];

  const allTechLogos: LogoItem[] = [
    ...handsOnLogos,
    ...buildLogos,
    ...learningLogos
  ];

  const currentLogos =
    activeStackTab === 'hands-on' ? handsOnLogos :
    activeStackTab === 'builds' ? buildLogos :
    activeStackTab === 'learning' ? learningLogos : allTechLogos;

  // Custom Monochrome Stack Cards for Projects
  const projectStackCards = projects.map((p) => {
    return (
      <div
        key={p.id}
        className="w-full h-full p-6 sm:p-7 flex flex-col justify-between text-left select-none relative overflow-hidden bg-zinc-950/95 border border-zinc-700/80 rounded-2xl shadow-2xl group transition-all"
      >
        {/* Card Header: Category Tag, Live Status, Number */}
        <div className="flex items-center justify-between w-full border-b border-zinc-800 pb-3 z-10">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-700 text-zinc-200">
              {p.category}
            </span>
            <span className="text-[10px] font-mono text-zinc-300 flex items-center gap-1.5 bg-zinc-900/60 px-2 py-0.5 rounded border border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {p.status || 'Active'}
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-zinc-400 tracking-widest">
            {p.number} / 04
          </span>
        </div>

        {/* Card Body: Title, Description, and Bullet Highlights */}
        <div className="space-y-3 my-auto py-2 z-10">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
              {p.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
              {p.fullDescription || p.shortDescription}
            </p>
          </div>

          {/* Highlights */}
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

          {/* Tech Badges */}
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

        {/* Card Actions: Repo and Live Demo */}
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
                <span className="text-sm"><SiGithub /></span>
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
    );
  });

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
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-zinc-950/85 border-b border-zinc-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          {/* Logo / Identity */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2.5 group cursor-target text-left"
            aria-label="Scroll to home section"
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse group-hover:scale-125 transition-transform" />
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-white group-hover:text-zinc-300 uppercase transition-colors">
              JACK // JXCK007
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <nav className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-lg">
              {(
                [
                  { id: 'home', label: 'HOME' },
                  { id: 'skills', label: 'SKILLS' },
                  { id: 'projects', label: 'PROJECTS' },
                  { id: 'about', label: 'ABOUT' },
                  { id: 'contact', label: 'CONTACT' }
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`cursor-target text-[10px] font-mono tracking-widest px-3.5 py-1.5 rounded transition-all uppercase ${
                    activeSection === item.id
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => {
                if (onReset) onReset();
              }}
              className="cursor-target text-[10px] font-mono tracking-widest text-zinc-400 hover:text-white transition-all uppercase px-3 py-1.5 rounded border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900"
            >
              RESET
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-target p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-zinc-800 bg-zinc-950/95 px-4 py-3 space-y-2 backdrop-blur-xl"
            >
              {(
                [
                  { id: 'home', label: 'Home' },
                  { id: 'skills', label: 'Skills' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'about', label: 'About & Stats' },
                  { id: 'contact', label: 'Contact' }
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors ${
                    activeSection === item.id
                      ? 'bg-white text-black font-bold'
                      : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500">jdnk007@gmail.com</span>
                <button
                  onClick={() => {
                    if (onReset) onReset();
                  }}
                  className="text-[10px] font-mono text-zinc-400 hover:text-white uppercase"
                >
                  Reset Intro
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* CONTINUOUS SCROLLABLE DOCUMENT LAYOUT */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-24 md:space-y-32">
        {/* ======================================================== */}
        {/* SECTION 1: HOME (HERO WITH CLEAN STATIC TYPOGRAPHY & LASER EYES) */}
        {/* ======================================================== */}
        <section
          id="home"
          ref={homeRef}
          className="min-h-[80vh] flex items-center justify-center pt-4"
        >
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Developer Intro & Direct CTAs */}
            <div className="md:col-span-7 flex flex-col items-start text-left space-y-6">
              {/* Status Indicator & Fixed-Width Rotating Specialty Badge */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[10px] font-mono tracking-widest text-zinc-200 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  3RD YEAR CSE · RIT CHENNAI
                </div>

                {/* Rotating Text Spotlight Badge with Fixed Minimum Width to prevent layout shifts */}
                <div className="inline-flex items-center bg-white text-black rounded-lg px-3 py-1 shadow-xl overflow-hidden cursor-target min-w-[170px] justify-center">
                  <RotatingText
                    texts={[
                      'ADAPT',
                      'LEARN',
                      'BUILD',
                      'EVOLVE',
                      'INNOVATE'
                    ]}
                    mainClassName="font-mono font-bold tracking-tight text-[11px] sm:text-xs text-black text-center whitespace-nowrap flex items-center justify-center leading-none"
                    staggerFrom="last"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-120%', opacity: 0 }}
                    staggerDuration={0.02}
                    splitLevelClassName="overflow-hidden pb-0.5 inline-flex justify-center"
                    transition={{ type: 'spring', damping: 26, stiffness: 350 }}
                    rotationInterval={2200}
                  />
                </div>
              </div>

              {/* Primary Hero Typography */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-mono font-bold tracking-tight text-white leading-none">
                  JEGADEESH
                  <span className="text-zinc-400 block text-2xl sm:text-4xl lg:text-5xl mt-1">
                    (JACK) NANDAKUMAR
                  </span>
                </h1>
              </div>

              {/* Static, Crisp, Readable Mission Bio (Zero text scramble on hover) */}
              <div className="space-y-2 max-w-xl">
                <p className="text-sm sm:text-base font-sans text-zinc-200 leading-relaxed font-light">
                  Third-year Computer Science & Engineering student at <strong className="text-white font-medium">Rajalakshmi Institute of Technology, Chennai</strong>. Building practical software for real use cases—from symposium platforms and billing tools to workflow systems and event-management products.
                </p>
                <blockquote className="border-l-2 border-zinc-500 pl-3 py-1 text-xs font-mono text-zinc-400 italic">
                  "Workflow | Product Logic | Database Structure | Deployment Process | Failure Points"
                </blockquote>
              </div>

              {/* Quick Interactive Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="cursor-target inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:scale-[1.02]"
                >
                  <Layers className="w-3.5 h-3.5 text-black" />
                  EXPLORE PROJECTS
                </button>
                <button
                  onClick={() => scrollToSection('skills')}
                  className="cursor-target inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs tracking-wider uppercase transition-all hover:scale-[1.02]"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  TECH STACK
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="cursor-target inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs tracking-wider uppercase transition-all"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  ABOUT & STATS
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="cursor-target inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs tracking-wider uppercase transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  CONTACT
                </button>
              </div>
            </div>

            {/* Right Column: Character Asset */}
            <div className="md:col-span-5 flex justify-center md:justify-end items-center w-full relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] aspect-[3/4] flex items-center justify-center select-none"
              >
                {/* Subtle Ambient Glow */}
                <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent rounded-full blur-3xl" />

                {/* Character Image */}
                <div
                  className="relative w-full h-full flex items-center justify-center overflow-visible"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 80%, transparent 99%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 99%)'
                  }}
                >
                  <img
                    src={heroAvatarImg}
                    alt="Jack Avatar"
                    className="w-full h-full object-contain object-bottom filter contrast-105 brightness-100 drop-shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: SKILLS (MARQUEE WITH NON-DISRUPTIVE INSPECTOR) */}
        {/* ======================================================== */}
        <section
          id="skills"
          ref={skillsRef}
          className="space-y-6 pt-6"
        >
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                TECHNICAL ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
                ENGINEERING STACK
              </h2>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>20 TECHNOLOGIES & TOOLS</span>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-left">
            <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase">
              Filter category or click any badge to inspect:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', label: 'All Technologies' },
                  { id: 'hands-on', label: 'Comfortable / Hands-on' },
                  { id: 'builds', label: 'Builds & Project Exposure' },
                  { id: 'learning', label: 'Currently Learning' }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveStackTab(tab.id as StackCategoryTab)}
                  className={`cursor-target text-[9px] sm:text-[10px] font-mono tracking-wider px-2.5 py-1 rounded transition-all uppercase ${
                    activeStackTab === tab.id
                      ? 'bg-white text-black font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Moving Trailer (Paused on hover) */}
          <div className="w-full py-4 relative overflow-hidden bg-zinc-950/60 rounded-xl border border-zinc-800/80">
            <LogoLoop
              logos={currentLogos}
              speed={55}
              direction="left"
              logoHeight={34}
              gap={18}
              pauseOnHover={true}
              hoverSpeed={0}
              scaleOnHover={true}
              fadeOut={true}
              fadeOutColor="#09090b"
              ariaLabel="Technical Stack Loop"
            />
          </div>

          {/* Interactive Skill Details Inspector Modal / Card */}
          <AnimatePresence>
            {selectedSkill && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-5 sm:p-6 backdrop-blur-xl relative shadow-2xl text-left"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="cursor-target absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
                  aria-label="Close skill details"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Left: Icon & Category */}
                  <div className="md:col-span-4 flex flex-col space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-zinc-900 border border-zinc-700 text-white shadow-inner">
                        {getSkillIcon(selectedSkill.iconName, "text-2xl")}
                      </div>
                      <div>
                        <h3 className="font-mono text-lg font-bold text-white">{selectedSkill.name}</h3>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                          {selectedSkill.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <a
                      href={selectedSkill.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="cursor-target inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-300 hover:text-white transition-colors w-fit underline decoration-zinc-600 underline-offset-4"
                    >
                      Official Documentation <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Right: Detailed Description & Capabilities */}
                  <div className="md:col-span-8 space-y-3">
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-light">
                      {selectedSkill.description}
                    </p>

                    <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-1">
                      <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block">
                        APPLICATION IN PRODUCTION
                      </span>
                      <p className="text-xs font-mono text-zinc-200">{selectedSkill.experienceSummary}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedSkill.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: PROJECTS (RESPONSIVE GRID + INTERACTIVE STACK TOGGLE) */}
        {/* ======================================================== */}
        <section
          id="projects"
          ref={projectsRef}
          className="space-y-6 pt-6 text-left"
        >
          {/* Projects Header & View Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                FEATURED WORK
              </span>
              <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight flex items-center gap-3">
                <span>PROJECT ARCHIVES</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700 font-normal">
                  4 Primary Systems
                </span>
              </h2>
            </div>

            {/* View Mode Toggle: Grid (Fast Scan) vs 3D Stack */}
            <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 p-1 rounded-lg">
              <button
                onClick={() => setProjectViewMode('grid')}
                className={`cursor-target flex items-center gap-1.5 px-3 py-1 rounded font-mono text-[10px] uppercase tracking-wider transition-all ${
                  projectViewMode === 'grid'
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>

              <button
                onClick={() => setProjectViewMode('stack')}
                className={`cursor-target flex items-center gap-1.5 px-3 py-1 rounded font-mono text-[10px] uppercase tracking-wider transition-all ${
                  projectViewMode === 'stack'
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D Stack</span>
              </button>
            </div>
          </div>

          {/* VIEW 1: RESPONSIVE PROJECT GRID (Fast Scannable for Recruiters) */}
          {projectViewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-xl bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-750 text-zinc-300">
                        {p.category}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {p.status || 'Active'}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-500 tracking-wider">
                      {p.number}
                    </span>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2.5">
                    <h3 className="text-lg font-mono font-bold text-white group-hover:text-zinc-200 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                      {p.shortDescription}
                    </p>

                    {/* Highlights */}
                    {p.highlights && p.highlights.length > 0 && (
                      <ul className="space-y-1 pt-1.5 border-t border-zinc-850">
                        {p.highlights.slice(0, 2).map((hl, idx) => (
                          <li key={idx} className="text-[11px] font-mono text-zinc-400 flex items-start gap-1.5">
                            <span className="text-zinc-600 mt-0.5">›</span>
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-mono text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-zinc-850 flex items-center gap-2">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-target flex-1 py-1.5 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span className="text-sm inline-flex"><SiGithub /></span>
                        <span>Repo</span>
                        <ExternalLink className="w-3 h-3 text-zinc-400" />
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-target flex-1 py-1.5 px-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <span>Demo</span>
                        <ExternalLink className="w-3 h-3 text-black" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW 2: INTERACTIVE 3D STACK */}
          {projectViewMode === 'stack' && (
            <div className="w-full flex flex-col items-center justify-center py-4">
              <div className="w-full max-w-[580px] h-[380px] sm:h-[420px] relative flex items-center justify-center">
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
              <p className="text-[10px] font-mono text-zinc-400 tracking-wider mt-4">
                Swipe, drag or click cards to cycle through projects
              </p>
            </div>
          )}

          {/* EXPANDABLE "MORE PROJECTS" ARCHIVE */}
          <div className="w-full border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/70 mt-6">
            <button
              onClick={() => setIsArchiveOpen(!isArchiveOpen)}
              className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/60 transition-colors text-left cursor-target"
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4 text-white" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  More Projects Archive ({archiveProjects.length} Systems)
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

        {/* ======================================================== */}
        {/* SECTION 4: ABOUT (CLEAN 2-COLUMN RESPONSIVE LAYOUT) */}
        {/* ======================================================== */}
        <section
          id="about"
          ref={aboutRef}
          className="space-y-6 pt-6 text-left"
        >
          {/* Header */}
          <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                BIOGRAPHY & PROFILE
              </span>
              <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
                ABOUT JEGADEESH NANDAKUMAR (JACK)
              </h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-700 text-[10px] font-mono text-zinc-200 w-fit">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>RIT CHENNAI · CSE '26</span>
            </div>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Python Class Code Block & Quick Summary */}
            <div className="lg:col-span-5 space-y-6">
              {/* Python Class High-Contrast Container */}
              <div className="bg-zinc-950 border border-zinc-700 rounded-xl p-5 font-mono text-xs shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-white" />
                    <span className="text-[10px] uppercase tracking-wider text-white">jack_profile.py</span>
                  </div>
                  <span className="text-[9px] text-zinc-400">Python 3.12 · Strict Schema</span>
                </div>

                <pre className="text-zinc-200 overflow-x-auto leading-relaxed text-[11px] sm:text-xs">
                  <code>
                    <span className="text-zinc-500">class</span> <span className="text-white font-bold">JackNandakumar</span>:
                    {'\n'}    <span className="text-zinc-500">def</span> <span className="text-white">__init__</span>(self):
                    {'\n'}        self.name = <span className="text-zinc-300">"Jegadeesh Nandakumar (Jack)"</span>
                    {'\n'}        self.education = <span className="text-zinc-300">"B.E. CSE (3rd Year) @ RIT Chennai"</span>
                    {'\n'}        self.primary_focus = [
                    {'\n'}            <span className="text-zinc-300">"Backend Engineering"</span>,
                    {'\n'}            <span className="text-zinc-300">"Relational Databases"</span>,
                    {'\n'}            <span className="text-zinc-300">"REST APIs & Automation"</span>
                    {'\n'}        ]
                    {'\n'}        self.philosophy = (
                    {'\n'}            <span className="text-zinc-300">"Workflow | Logic | Schema | Deployment | Failure Points"</span>
                    {'\n'}        )
                    {'\n'}        self.status = <span className="text-zinc-300">"Open to Internship & Engineering Opportunities"</span>
                  </code>
                </pre>
              </div>

              {/* Education & Core Philosophy Box */}
              <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <FileText className="w-4 h-4 text-white" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Core Philosophy
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  I believe solid backend software is defined by deterministic data models, graceful failure handling, and transparent workflow design. Speed of delivery matters, but maintainable logic and reliable database schemas matter more.
                </p>
              </div>
            </div>

            {/* Right Column: Static Bio + Key Achievements + Experience Timeline + Telemetry */}
            <div className="lg:col-span-7 space-y-6">
              {/* Static Biography Paragraph (High Contrast, No Scramble on Hover) */}
              <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-700/80 space-y-3">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                  BIOGRAPHY & BACKGROUND
                </span>
                <p className="text-sm sm:text-base text-zinc-200 font-sans leading-relaxed font-light">
                  Hi, I'm <strong className="text-white font-semibold">Jegadeesh Nandakumar (Jack)</strong>. I am a third-year Computer Science and Engineering student at Rajalakshmi Institute of Technology, Chennai. I enjoy building practical software for real use cases—from symposium platforms and billing tools to workflow systems and event-management products. I use AI-assisted tools to accelerate development and learning, while still focusing on the workflow, product logic, database structure, deployment process, and failure points behind what I build.
                </p>
              </div>

              {/* Key Achievements Grid */}
              <div className="bg-zinc-950 border border-zinc-700 rounded-xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <Award className="w-4 h-4 text-white" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Key Achievements
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🥈</span>
                      <span className="font-mono font-bold text-xs text-white">2nd Prize · Unlock AI</span>
                    </div>
                    <p className="text-[11px] text-zinc-300">VIT Chennai Vibrance 2026 (Team Jack Sparrow)</p>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🎯</span>
                      <span className="font-mono font-bold text-xs text-white">Assistant Coordinator</span>
                    </div>
                    <p className="text-[11px] text-zinc-300">Mystery Box event (~65 participating teams)</p>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🌐</span>
                      <span className="font-mono font-bold text-xs text-white">ZYPHORIA'26 Platform</span>
                    </div>
                    <p className="text-[11px] text-zinc-300">Contributed to official symposium website</p>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🧾</span>
                      <span className="font-mono font-bold text-xs text-white">BillEase Platform</span>
                    </div>
                    <p className="text-[11px] text-zinc-300">Engineered for a real business billing workflow</p>
                  </div>
                </div>
              </div>

              {/* Contribution Graph Telemetry */}
              <ContributionGraph username="Jxck007" year={2025} />
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 5: CONTACT (DIRECT MAIL FORM + ZERO TWITTER SOCIALS) */}
        {/* ======================================================== */}
        <section
          id="contact"
          ref={contactRef}
          className="space-y-6 pt-6 text-left"
        >
          {/* Header */}
          <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                GET IN TOUCH DIRECTLY
              </span>
              <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
                DIRECT MAIL & NETWORKS
              </h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-700 text-[10px] font-mono text-zinc-200 w-fit">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>jdnk007@gmail.com</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Direct Mail Form with PixelCard Dispatch Button */}
            <div className="md:col-span-7 bg-zinc-950 border border-zinc-700 rounded-xl p-5 sm:p-6 shadow-2xl space-y-4">
              <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-white" />
                Send a Direct Message
              </h3>
              <p className="text-xs font-sans text-zinc-400">
                Fill out the details below to dispatch an engineering or collaboration inquiry directly to Jack.
              </p>

              {formSubmitted ? (
                <div className="p-5 rounded-lg bg-zinc-900 border border-zinc-600 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-white mx-auto animate-bounce" />
                  <h4 className="font-mono text-sm font-bold text-white">Opening Email Client...</h4>
                  <p className="text-xs text-zinc-300">
                    Your message has been formatted and triggered. Thank you for getting in touch!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendMail} className="space-y-3.5">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-zinc-400 tracking-wider mb-1">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-zinc-400 tracking-wider mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={mailSubject}
                      onChange={(e) => setMailSubject(e.target.value)}
                      placeholder="Engineering / Backend Collaboration"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-zinc-400 tracking-wider mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={mailMessage}
                      onChange={(e) => setMailMessage(e.target.value)}
                      placeholder="Describe your requirements, timeline, or engineering role..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-sans text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors resize-none"
                    />
                  </div>

                  {/* Dispatch Direct Message Button with PixelCard Effect */}
                  <PixelCard variant="monochrome" className="w-full h-auto rounded-xl border border-zinc-700 overflow-hidden">
                    <button
                      type="submit"
                      className="cursor-target w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01]"
                    >
                      <Send className="w-3.5 h-3.5 text-black" />
                      <span>DISPATCH DIRECT MESSAGE</span>
                    </button>
                  </PixelCard>
                </form>
              )}
            </div>

            {/* Right: Quick Copy and Verified Social Profile Pixel Cards */}
            <div className="md:col-span-5 space-y-4">
              {/* Quick Copy Email Card */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                  Direct Email Contact
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-700">
                  <span className="font-mono text-xs text-white">jdnk007@gmail.com</span>
                  <button
                    onClick={handleCopyEmail}
                    className="cursor-target px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Verified Profile Pixel Cards */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                  Verified Profile Buttons
                </span>

                <div className="space-y-3">
                  <PixelCard variant="default" className="w-full h-auto rounded-xl border border-zinc-800 hover:border-zinc-500 transition-colors">
                    <a
                      href="https://github.com/Jxck007"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-target flex items-center justify-between p-3 w-full transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-white text-base inline-flex"><SiGithub /></span>
                        <div className="text-left">
                          <span className="font-mono text-xs font-bold text-white block">GitHub Profile</span>
                          <span className="text-[10px] font-mono text-zinc-400">@Jxck007</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                    </a>
                  </PixelCard>

                  <PixelCard variant="blue" className="w-full h-auto rounded-xl border border-zinc-800 hover:border-zinc-500 transition-colors">
                    <a
                      href="https://www.linkedin.com/in/jegadeesh-nandakumar/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-target flex items-center justify-between p-3 w-full transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Linkedin className="text-white w-4 h-4" />
                        <div className="text-left">
                          <span className="font-mono text-xs font-bold text-white block">LinkedIn Network</span>
                          <span className="text-[10px] font-mono text-zinc-400">Jegadeesh Nandakumar</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                    </a>
                  </PixelCard>

                  <PixelCard variant="yellow" className="w-full h-auto rounded-xl border border-zinc-800 hover:border-zinc-500 transition-colors">
                    <button
                      onClick={handleCopyEmail}
                      className="cursor-target flex items-center justify-between p-3 w-full transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="text-white w-4 h-4" />
                        <div className="text-left">
                          <span className="font-mono text-xs font-bold text-white block">Direct Mail</span>
                          <span className="text-[10px] font-mono text-zinc-400">jdnk007@gmail.com</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white">
                        {copiedEmail ? 'Copied!' : 'Copy Email'}
                      </span>
                    </button>
                  </PixelCard>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Persistent Bottom Footer Bar */}
      <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/80 mt-16 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-400 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>JEGADEESH (JACK) NANDAKUMAR · 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCopyEmail}
              className="cursor-target hover:text-white transition-colors uppercase"
            >
              {copiedEmail ? 'Email Copied!' : 'jdnk007@gmail.com'}
            </button>
            <span>·</span>
            <span>Chennai, India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

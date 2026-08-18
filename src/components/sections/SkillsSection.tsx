import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LogoLoop, { LogoItem } from '../ui/LogoLoop';
import { SKILLS_DATA, SkillDetail } from '../../data/skills';
import { SiPython, SiPostgresql, SiSqlite, SiFirebase, SiFlutter, SiFlask, SiReact, SiDart, SiHtml5, SiJavascript, SiDocker, SiGit, SiGithub, SiGithubactions, SiRender, SiVercel, SiDjango, SiJenkins, SiLeetcode, SiSupabase, SiTypescript } from 'react-icons/si';
import { FaAws } from 'react-icons/fa6';
import { TbDatabase, TbBrandCss3 } from 'react-icons/tb';
import { ExternalLink, X, Code2 } from 'lucide-react';
import type { RefObject } from 'react';

type StackCategoryTab = 'all' | 'hands-on' | 'builds' | 'learning';

interface SkillsSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
}

/* ------------------------------------------------------------------ */
/* Skill categories — the source of truth for the static grid           */
/* ------------------------------------------------------------------ */
const SKILL_CATEGORIES = [
  {
    key: 'languages',
    label: 'LANGUAGES',
    skills: ['python', 'sql', 'dart', 'html5', 'css3', 'javascript', 'typescript'] as const,
  },
  {
    key: 'frameworks',
    label: 'FRAMEWORKS',
    skills: ['flask', 'flutter', 'django', 'sqlalchemy'] as const,
  },
  {
    key: 'databases',
    label: 'DATABASES',
    skills: ['postgresql', 'sqlite', 'firebase', 'supabase'] as const,
  },
  {
    key: 'devops',
    label: 'DEVOPS & TOOLING',
    skills: ['git', 'github', 'docker', 'githubactions', 'render', 'jenkins', 'aws', 'vercel'] as const,
  },
] as const;

export default function SkillsSection({ sectionRef }: SkillsSectionProps) {
  const [activeStackTab, setActiveStackTab] = useState<StackCategoryTab>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail | null>(null);

  const toggleSkill = (skill: SkillDetail) => {
    setSelectedSkill((prev) => (prev?.id === skill.id ? null : skill));
  };

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
      case 'SiTypescript': return <span className={className}><SiTypescript /></span>;
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

  /* --- Conveyor logo items per category tab --- */
  const handsOnLogos: LogoItem[] = [
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.python)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiPython /></span> Python</button>), title: 'Python' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.flask)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiFlask /></span> Flask</button>), title: 'Flask' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.sql)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><TbDatabase /></span> SQL</button>), title: 'SQL' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.postgresql)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiPostgresql /></span> PostgreSQL</button>), title: 'PostgreSQL' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.sqlite)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiSqlite /></span> SQLite</button>), title: 'SQLite' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.git)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiGit /></span> Git</button>), title: 'Git' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.github)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiGithub /></span> GitHub</button>), title: 'GitHub' },
  ];

  const buildLogos: LogoItem[] = [
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.flutter)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiFlutter /></span> Flutter</button>), title: 'Flutter' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.dart)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiDart /></span> Dart</button>), title: 'Dart' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.react)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiReact /></span> React</button>), title: 'React' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.javascript)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiJavascript /></span> JavaScript</button>), title: 'JavaScript' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.firebase)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiFirebase /></span> Firebase</button>), title: 'Firebase' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.supabase)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiSupabase /></span> Supabase</button>), title: 'Supabase' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.render)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiRender /></span> Render</button>), title: 'Render' },
  ];

  const learningLogos: LogoItem[] = [
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.django)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiDjango /></span> Django</button>), title: 'Django' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.docker)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiDocker /></span> Docker</button>), title: 'Docker' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.aws)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><FaAws /></span> AWS</button>), title: 'AWS' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.githubactions)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiGithubactions /></span> CI/CD</button>), title: 'CI/CD' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.jenkins)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiJenkins /></span> Jenkins</button>), title: 'Jenkins' },
    { node: (<button onClick={() => toggleSkill(SKILLS_DATA.vercel)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-400 text-zinc-200 font-mono text-xs cursor-target transition-all"><span className="text-sm text-zinc-100 inline-flex"><SiVercel /></span> Vercel</button>), title: 'Vercel' },
  ];

  const allTechLogos: LogoItem[] = [...handsOnLogos, ...buildLogos, ...learningLogos];

  const currentLogos =
    activeStackTab === 'hands-on' ? handsOnLogos :
    activeStackTab === 'builds' ? buildLogos :
    activeStackTab === 'learning' ? learningLogos : allTechLogos;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="space-y-6 pt-6"
    >
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
            TECHNICAL ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            ENGINEERING STACK
          </h2>
          <p className="text-xs font-sans text-zinc-500 max-w-md leading-relaxed">
            Technologies I actually work with, organized by comfort level.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span>{Object.keys(SKILLS_DATA).length} TECHNOLOGIES & TOOLS</span>
        </div>
      </div>

      {/* ─── Category Filter Tabs ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase shrink-0">
          Filter category or click any badge to inspect:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
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

      {/* ─── Moving Technology Conveyor ─── */}
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

      {/* ─── Categorized Skill Grid — static, readable archive ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SKILL_CATEGORIES.map((cat) => (
          <div
            key={cat.key}
            className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 space-y-3"
          >
            <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase block">
              {cat.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((id) => {
                const skill = SKILLS_DATA[id];
                if (!skill) return null;
                return (
                  <button
                    key={id}
                    onClick={() => toggleSkill(skill)}
                    className="cursor-target flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white font-mono text-[10px] transition-all"
                  >
                    <span className="text-zinc-400 inline-flex">{getSkillIcon(skill.iconName, "text-xs")}</span>
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Skill Inspector Modal ─── */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-5 sm:p-6 backdrop-blur-xl relative shadow-2xl text-left"
          >
            <button
              onClick={() => setSelectedSkill(null)}
              className="cursor-target absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
              aria-label="Close skill details"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
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
  );
}

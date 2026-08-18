import ContributionGraph from '../ui/ContributionGraph';
import { GraduationCap, Terminal, FileText, Award } from 'lucide-react';
import type { RefObject } from 'react';

interface AboutSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
}

export default function AboutSection({ sectionRef }: AboutSectionProps) {
  return (
    <section
      id="about"
      ref={sectionRef}
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

            <pre className="text-zinc-200 overflow-x-auto leading-relaxed text-[11px] sm:text-xs" style={{ WebkitOverflowScrolling: 'touch' }}>
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
  );
}

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import RotatingText from "../ui/RotatingText";
import { ArrowRight, Cpu } from "lucide-react";
import type { RefObject } from "react";
import type { SectionType } from "./types";

interface HeroSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
  onNavigate: (section: SectionType) => void;
  heroReady?: boolean;
}

/* ------------------------------------------------------------------ */
/* Reveal variants — staggered, cinematic, restrained                   */
/* ------------------------------------------------------------------ */
const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      delay,
    },
  }),
};

const ROTATING_WORDS = ["ADAPT", "LEARN", "BUILD", "EVOLVE", "INNOVATE"];

export default function HeroSection({
  sectionRef,
  onNavigate,
  heroReady = false,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isReady = heroReady || prefersReduced;
  const inView = useInView(containerRef, { once: true, amount: 0.15 });

  return (
    <section
      id="home"
      ref={sectionRef}
      className="min-h-[75vh] flex items-center justify-start pt-6 sm:pt-10"
    >
      <div
        ref={containerRef}
        className="w-full max-w-4xl flex flex-col items-start text-left space-y-5 sm:space-y-6"
      >
        {/* Identity Eyebrow */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isReady && inView ? "visible" : "hidden"}
          custom={0.1}
        >
          <span className="inline-block font-mono text-[11px] tracking-[0.2em] text-zinc-400 uppercase">
            JXCK · Software Engineer
          </span>
        </motion.div>

        {/* Primary Heading */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isReady && inView ? "visible" : "hidden"}
          custom={0.2}
        >
          <h1 className="text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl font-mono font-bold tracking-tight text-white leading-[1.04] max-w-3xl">
            I BUILD
            <br />
            DIGITAL
            <br />
            SYSTEMS.
          </h1>
        </motion.div>

        {/* Rotating White Box — technical UI element */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isReady && inView ? "visible" : "hidden"}
          custom={0.32}
          className="w-full"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white text-black font-mono text-sm sm:text-base font-bold tracking-wider" style={{ minWidth: '220px' }}>
            <span className="text-zinc-400 text-xs font-normal select-none">
              //&nbsp;
            </span>
            <RotatingText
              texts={ROTATING_WORDS}
              splitBy="characters"
              rotationInterval={2400}
              auto={!prefersReduced}
              mainClassName="overflow-hidden min-w-[120px]"
              elementLevelClassName="inline-block"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-120%", opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            />
            <span className="cursor-blink text-zinc-400 text-xs font-normal select-none">
              &nbsp;_
            </span>
          </div>
        </motion.div>

        {/* Supporting Copy */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isReady && inView ? "visible" : "hidden"}
          custom={0.42}
          className="max-w-xl"
        >
          <p className="text-base sm:text-lg font-sans text-zinc-400 leading-relaxed font-normal">
            Software, systems, and product thinking, built end to end.
          </p>
        </motion.div>

        {/* CTAs — focused, prominent */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isReady && inView ? "visible" : "hidden"}
          custom={0.55}
          className="flex flex-wrap items-center gap-3 pt-2"
        >
          <button
            onClick={() => onNavigate("projects")}
            className="cursor-target group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
          >
            VIEW WORK
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/5 group-hover:bg-black/10 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
          <button
            onClick={() => onNavigate("skills")}
            className="cursor-target inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
          >
            <Cpu className="w-4 h-4" />
            TECH STACK
          </button>
        </motion.div>
      </div>
    </section>
  );
}

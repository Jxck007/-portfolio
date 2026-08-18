import { useRef } from "react";
import { motion, useInView } from "motion/react";
import RotatingText from "../ui/RotatingText";
import heroAvatarImg from "../../assets/images/Avatar.png";
import { ArrowRight, Cpu } from "lucide-react";
import type { RefObject } from "react";
import type { SectionType } from "./types";
import { useAvatarAnchor } from "../../utils/heroAnchor";

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

const avatarReveal = {
  hidden: { opacity: 0, scale: 0.96, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.05,
    },
  },
};

const ROTATING_WORDS = ["ADAPT", "LEARN", "BUILD", "EVOLVE", "INNOVATE"];

export default function HeroSection({
  sectionRef,
  onNavigate,
  heroReady = false,
}: HeroSectionProps) {
  const avatarAnchor = useAvatarAnchor();
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
      className="min-h-[80vh] flex items-center justify-center pt-4"
    >
      <div
        ref={containerRef}
        className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center"
      >
        {/* ─── LEFT COLUMN: Identity + Typography + Rotating Box + CTAs ─── */}
        <div className="md:col-span-7 flex flex-col items-start text-left space-y-5">
          {/* Identity Eyebrow */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isReady && inView ? "visible" : "hidden"}
            custom={0.1}
          >
            <span className="inline-block font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
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
            <h1 className="text-[1.65rem] sm:text-4xl md:text-5xl lg:text-6xl font-mono font-bold tracking-tight text-white leading-[1.05] max-w-2xl">
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
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white text-black font-mono text-sm sm:text-base font-bold tracking-wider">
              <span className="text-zinc-400 text-xs font-normal select-none">
                //&nbsp;
              </span>
              <RotatingText
                texts={ROTATING_WORDS}
                splitBy="characters"
                rotationInterval={2200}
                mainClassName="overflow-hidden"
                elementLevelClassName="inline-block"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-120%", opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              />
              <span className="text-zinc-400 text-xs font-normal select-none">
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
            className="max-w-md"
          >
            <p className="text-sm sm:text-base font-sans text-zinc-400 leading-relaxed">
              Software, systems, and product thinking,
              built end to end.
            </p>
          </motion.div>

          {/* CTAs — two, focused */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isReady && inView ? "visible" : "hidden"}
            custom={0.55}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <button
              onClick={() => onNavigate("projects")}
              className="cursor-target group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
            >
              VIEW WORK
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/5 group-hover:bg-black/10 transition-colors">
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
            <button
              onClick={() => onNavigate("skills")}
              className="cursor-target inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
            >
              <Cpu className="w-3.5 h-3.5" />
              TECH STACK
            </button>
          </motion.div>
        </div>

        {/* ─── RIGHT COLUMN: Avatar / Particle-Face Destination ─── */}
        <motion.div
          variants={avatarReveal}
          initial="hidden"
          animate={isReady && inView ? "visible" : "hidden"}
          className="md:col-span-5 flex justify-center md:justify-end items-center w-full relative"
        >
          <div
            className="relative w-full aspect-[3/4] flex items-center justify-center select-none group cursor-default"
            style={{ maxWidth: avatarAnchor.widthPx }}
          >
            {/* Subtle Ambient Glow */}
            <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Eye-activation glow on hover — subtle, local, no neon */}
            <div className="absolute inset-0 bg-radial from-white/0 via-transparent to-transparent rounded-full blur-2xl pointer-events-none transition-all duration-700 ease-out group-hover:from-white/[0.06]" />

            {/* Character Image — subtle idle depth + hover eye response */}
            <motion.div
              className="relative w-full h-full flex items-center justify-center overflow-visible"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 80%, transparent 99%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 80%, transparent 99%)",
              }}
              animate={
                isReady && !prefersReduced
                  ? {
                      y: [0, -2, 0, 1.5, 0],
                    }
                  : {}
              }
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                src={heroAvatarImg}
                alt="Jack Avatar"
                className="w-full h-full object-contain object-bottom filter contrast-105 brightness-100 drop-shadow-2xl transition-all duration-500 ease-out group-hover:brightness-110 group-hover:contrast-110"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

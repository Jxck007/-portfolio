import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Menu } from "lucide-react";
import type { SectionType } from "./types";

interface NavItem {
  id: SectionType;
  num: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", num: "01", label: "HOME" },
  { id: "skills", num: "02", label: "STACK" },
  { id: "projects", num: "03", label: "WORK" },
  { id: "about", num: "04", label: "ABOUT" },
  { id: "contact", num: "05", label: "CONTACT" },
];

interface SiteHeaderProps {
  activeSection: SectionType;
  onNavigate: (section: SectionType) => void;
  mobileMenuOpen: boolean;
  onToggleMenu: () => void;
  onReset?: () => void;
}

export default function SiteHeader({
  activeSection,
  onNavigate,
  mobileMenuOpen,
  onToggleMenu,
  onReset,
}: SiteHeaderProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on ESC and trap focus
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        onToggleMenu();
        toggleRef.current?.focus();
      }
    },
    [mobileMenuOpen, onToggleMenu]
  );

  useEffect(() => {
    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [mobileMenuOpen, handleKeyDown]);

  // Close mobile menu on click outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        // Don't close if clicking the toggle button itself
        if (toggleRef.current?.contains(e.target as Node)) return;
        onToggleMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen, onToggleMenu]);

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-zinc-950/85 border-b border-zinc-800/80"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* ─── Logo / Identity ─── */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 group text-left focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none rounded"
          aria-label="Scroll to home section"
        >
          <div className="w-2 h-2 rounded-full bg-white animate-pulse group-hover:scale-125 transition-transform" />
          <span className="text-xs font-mono font-bold tracking-[0.2em] text-white group-hover:text-zinc-300 uppercase transition-colors">
            JACK // JXCK007
          </span>
        </button>

        {/* ─── Desktop Navigation ─── */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-0.5 bg-zinc-900/90 border border-zinc-800 p-1 rounded-lg">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.id);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative cursor-target flex items-center gap-1.5 text-[10px] font-mono tracking-widest px-3 py-1.5 rounded transition-all uppercase focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none ${
                    isActive
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <span
                    className={`text-[9px] tabular-nums ${
                      isActive ? "text-black/50" : "text-zinc-600 group-hover:text-zinc-400"
                    }`}
                  >
                    {item.num}
                  </span>
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Reset Button — compact icon-only */}
          {onReset && (
            <button
              onClick={onReset}
              className="cursor-target text-[10px] font-mono tracking-widest text-zinc-400 hover:text-white transition-all uppercase px-2.5 py-1.5 rounded border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
              aria-label="Reset intro animation"
            >
              ↺
            </button>
          )}
        </nav>

        {/* ─── Mobile Menu Toggle ─── */}
        <div className="flex md:hidden items-center gap-2">
          <button
            ref={toggleRef}
            onClick={onToggleMenu}
            className="cursor-target p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Dropdown Panel ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-nav-panel"
            role="navigation"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    role="menuitem"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.id);
                    }}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none ${
                      isActive
                        ? "bg-white text-black font-bold"
                        : "text-zinc-300 hover:bg-zinc-900"
                    }`}
                  >
                    <span
                      className={`text-[10px] tabular-nums ${
                        isActive ? "text-black/50" : "text-zinc-600"
                      }`}
                    >
                      {item.num}
                    </span>
                    {item.label}
                  </a>
                );
              })}

              {/* Mobile footer row */}
              <div className="pt-2 mt-1 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500">
                  jdnk007@gmail.com
                </span>
                {onReset && (
                  <button
                    onClick={onReset}
                    className="text-[10px] font-mono text-zinc-400 hover:text-white uppercase focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
                  >
                    Reset Intro
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

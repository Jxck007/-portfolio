/**
 * Shared hero-avatar anchor.
 *
 * ONE source of truth for the avatar's geometry across the intro particle
 * system and the hero layout. The intro's FACE particle state is generated at
 * exactly this anchor, and the hero avatar is sized from the same anchor, so
 * the face → hero handoff has no visible position jump.
 *
 * The math mirrors the existing Tailwind layout (IntroPlaceholder +
 * HeroSection), so the anchor predicts where the avatar actually renders:
 *  - content wrapper: max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8
 *  - hero grid:       grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center
 *  - avatar column:   md:col-span-5 md:justify-end, capped 440px, aspect 3/4
 *  - sticky header + wrapper padding push the hero down; hero section is
 *    min-h-[80vh] with its row vertically centred
 */

import { useEffect, useState } from "react";

export interface AvatarAnchor {
  /** Avatar centre, x as a fraction of viewport width (0..1). */
  nx: number;
  /** Avatar centre, y as a fraction of viewport height (0..1). */
  ny: number;
  /** Avatar height as a fraction of viewport height. */
  heightFrac: number;
  /** Avatar width in CSS px (drives the hero <img> wrapper). */
  widthPx: number;
}

export const AVATAR_ASPECT = 3 / 4; // width / height (aspect-[3/4])

const CONTAINER_MAX = 1280; // max-w-7xl
const HEADER_H = 54; // sticky header (~py-3 + content)
const WRAPPER_PT = 32; // py-8 on the content wrapper
const SECTION_PT = 16; // pt-4 on the hero section
const TEXT_COL_H = 420; // estimated hero text column height on md+ (eyebrow + h1 + rotating box + bio + 2 CTAs)

export function getAvatarAnchor(vw: number, vh: number): AvatarAnchor {
  if (vw < 768) {
    // Mobile: single column — the avatar is centred below the text (below the
    // fold on most phones). The face is clamped into a visible band so the
    // FACE stage is actually seen during the reveal; there is no jump because
    // the face scatters before the hero content fades in.
    const pad = vw < 640 ? 16 : 32; // px-4 / sm:px-8
    const maxW = vw < 640 ? 340 : 400; // max-w-[340px] / sm:max-w-[400px]
    const widthPx = Math.min(maxW, vw - pad * 2);
    const heightPx = widthPx / AVATAR_ASPECT;
    return { nx: 0.5, ny: 0.55, heightFrac: heightPx / vh, widthPx };
  }

  // md+: avatar in the right 5/12 column, right-aligned (md:justify-end),
  // capped at 440px wide, aspect 3:4.
  const containerW = Math.min(vw, CONTAINER_MAX);
  const pad = vw >= 1024 ? 48 : 32; // sm:px-8 / lg:px-12
  const gap = vw >= 1024 ? 48 : 32; // gap-8 / lg:gap-12
  const contentW = containerW - pad * 2;
  const colW = (contentW - 11 * gap) / 12;
  const rightColW = 5 * colW + 4 * gap; // col-span-5 (+ 4 internal gaps)
  const widthPx = Math.min(440, rightColW);
  const heightPx = widthPx / AVATAR_ASPECT;
  const containerLeft = (vw - containerW) / 2;
  const centerX = containerLeft + pad + contentW - widthPx / 2;

  // Vertical: header + wrapper padding push the hero down; the row is centred
  // inside a min-h-[80vh] section.
  const sectionTop = HEADER_H + WRAPPER_PT;
  const rowH = Math.max(TEXT_COL_H, heightPx);
  const sectionH = Math.max(0.8 * vh, rowH + SECTION_PT);
  const centerY = sectionTop + sectionH / 2;

  return { nx: centerX / vw, ny: centerY / vh, heightFrac: heightPx / vh, widthPx };
}

/** Reactive viewport-aware avatar anchor. */
export function useAvatarAnchor(): AvatarAnchor {
  const [anchor, setAnchor] = useState<AvatarAnchor>(() =>
    getAvatarAnchor(window.innerWidth, window.innerHeight)
  );

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setAnchor(getAvatarAnchor(window.innerWidth, window.innerHeight));
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return anchor;
}

/**
 * Target generators for the unified particle system.
 *
 * Every generator produces EXACTLY `count` particles so the engine keeps one
 * fixed-capacity GPU buffer — particles are never destroyed or recreated
 * between states. Every particle belongs to the active shape; any leftover
 * capacity is parked invisibly (alpha 0) in a wide volume and fades in/out as
 * states morph. There is NO separate decorative particle layer.
 */

import type { AvatarAnchor } from "../../utils/heroAnchor";

export interface ViewportBox {
  /** Visible world width at z = 0 */
  width: number;
  /** Visible world height at z = 0 */
  height: number;
}

export interface ParticleTargets {
  /** count * 3, xyz per particle */
  positions: Float32Array;
  /** count, world-unit point size */
  sizes: Float32Array;
  /** count, 0..1 */
  alphas: Float32Array;
}

const SCAN_W = 768;
const SCAN_H = 256;

/**
 * JXCK letterforms sampled from an offscreen canvas (same typography as the
 * original intro) mapped into world space, centred on the origin. Dense enough
 * to read as the primary visual object on load.
 */
export function generateTextTargets(
  text: string,
  count: number,
  viewport: ViewportBox,
  mobile: boolean
): ParticleTargets {
  const offscreen = document.createElement("canvas");
  offscreen.width = SCAN_W;
  offscreen.height = SCAN_H;
  const octx = offscreen.getContext("2d", { willReadFrequently: true });
  if (!octx) return generateScatterTargets(count, 2, 3, 0.9);

  octx.fillStyle = "#ffffff";
  octx.textAlign = "center";
  octx.textBaseline = "middle";
  octx.font = "900 160px system-ui, -apple-system, sans-serif";
  octx.fillText(text, SCAN_W / 2, SCAN_H / 2);

  const data = octx.getImageData(0, 0, SCAN_W, SCAN_H).data;
  const step = mobile ? 4 : 3;
  const px: number[] = [];
  for (let y = 0; y < SCAN_H; y += step) {
    for (let x = 0; x < SCAN_W; x += step) {
      if (data[(y * SCAN_W + x) * 4 + 3] > 110) {
        px.push(x, y);
      }
    }
  }

  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);

  // Fit the 3:1 letterforms inside the viewport — big, centred, primary.
  const textAspect = SCAN_W / SCAN_H;
  const worldH = Math.min(viewport.height * 0.34, viewport.width / textAspect);
  const worldW = worldH * textAspect;

  const glyphPoints = px.length / 2;
  const stride = Math.max(1, Math.ceil(glyphPoints / count));
  let gi = 0;
  for (let i = 0; i < glyphPoints && gi < count; i += stride) {
    const sx = px[i * 2];
    const sy = px[i * 2 + 1];
    positions[gi * 3] = (sx / SCAN_W - 0.5) * worldW;
    positions[gi * 3 + 1] = (0.5 - sy / SCAN_H) * worldH;
    positions[gi * 3 + 2] = 0;
    sizes[gi] = 0.013 + Math.random() * 0.005;
    alphas[gi] = 1;
    gi++;
  }

  parkHidden(positions, sizes, alphas, gi, count);
  return { positions, sizes, alphas };
}

/**
 * A filled, volumetric helix around the Y axis — the SAME particles that form
 * the face, temporarily spread into a rotating 3D volume. Never a thin dotted
 * line: every particle is offset inside a tube around the helix path.
 */
export function generateSpiralTargets(count: number, viewport: ViewportBox): ParticleTargets {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);
  const TURNS = 2.6;
  const HEIGHT = 4.4;
  // Clamp to the viewport so the helix never clips on narrow screens (320px+).
  const CORE_RADIUS = Math.min(1.5, viewport.width * 0.32);
  const TUBE_RADIUS = Math.min(0.55, viewport.width * 0.12);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * TURNS * Math.PI * 2;
    const oa = Math.random() * Math.PI * 2;
    const or = Math.sqrt(Math.random()) * TUBE_RADIUS;
    positions[i * 3] = Math.cos(angle) * CORE_RADIUS + Math.cos(oa) * or;
    positions[i * 3 + 1] = (t - 0.5) * HEIGHT + (Math.random() - 0.5) * TUBE_RADIUS * 1.4;
    positions[i * 3 + 2] = Math.sin(angle) * CORE_RADIUS + Math.sin(oa) * or;
    sizes[i] = 0.011 + Math.random() * 0.005;
    alphas[i] = 1;
  }
  return { positions, sizes, alphas };
}

/**
 * Samples the real owner avatar (Avatar.png) into particles — no GLB, no eye
 * glow — centred on the shared heroAvatarAnchor so the face forms exactly
 * where the hero avatar will render (no centre → right jump).
 */
export function generateFaceTargets(
  source: HTMLImageElement,
  count: number,
  viewport: ViewportBox,
  anchor: AvatarAnchor
): ParticleTargets {
  const w = source.naturalWidth || source.width;
  const h = source.naturalHeight || source.height;
  const MAX_DIM = 440;
  const scale = Math.min(1, MAX_DIM / Math.max(w, h));
  const cw = Math.max(1, Math.round(w * scale));
  const ch = Math.max(1, Math.round(h * scale));

  const offscreen = document.createElement("canvas");
  offscreen.width = cw;
  offscreen.height = ch;
  const octx = offscreen.getContext("2d", { willReadFrequently: true });
  if (!octx) return generateScatterTargets(count, 2, 3, 0.9);
  octx.drawImage(source, 0, 0, cw, ch);
  const img = octx.getImageData(0, 0, cw, ch);
  const data = img.data;

  // Detect transparency: if nearly fully opaque, fall back to luminance so we
  // don't capture a solid rectangle.
  let opaque = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 128) opaque++;
  }
  const opaqueFrac = opaque / (cw * ch);
  const useLuma = opaqueFrac > 0.85;

  const sample = (st: number): number[] => {
    const pts: number[] = [];
    for (let y = 0; y < ch; y += st) {
      for (let x = 0; x < cw; x += st) {
        const o = (y * cw + x) * 4;
        if (data[o + 3] <= 128) continue;
        if (useLuma) {
          const lum =
            (0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2]) / 255;
          if (lum < 0.4) continue;
        }
        pts.push(x, y);
      }
    }
    return pts;
  };

  const targetGlyph = Math.floor(count * 0.85);
  let step = 3;
  let pts = sample(step);
  while (pts.length / 2 > targetGlyph && step < 8) {
    step++;
    pts = sample(step);
  }
  while (pts.length / 2 < targetGlyph * 0.45 && step > 1) {
    step--;
    pts = sample(step);
  }

  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);

  const aspect = cw / ch;
  const worldH = anchor.heightFrac * viewport.height;
  const worldW = worldH * aspect;
  const centerX = (anchor.nx - 0.5) * viewport.width;
  const centerY = (0.5 - anchor.ny) * viewport.height;

  const glyphPoints = pts.length / 2;
  const stride = Math.max(1, Math.ceil(glyphPoints / targetGlyph));
  let gi = 0;
  for (let i = 0; i < glyphPoints && gi < count; i += stride) {
    const sx = pts[i * 2];
    const sy = pts[i * 2 + 1];
    positions[gi * 3] = centerX + (sx / cw - 0.5) * worldW;
    positions[gi * 3 + 1] = centerY + (0.5 - sy / ch) * worldH;
    positions[gi * 3 + 2] = 0;
    sizes[gi] = 0.012 + Math.random() * 0.005;
    alphas[gi] = 1;
    gi++;
  }

  parkHidden(positions, sizes, alphas, gi, count);
  return { positions, sizes, alphas };
}

/** Radial burst / fade shell — used for the detach moment and the hero reveal. */
export function generateScatterTargets(
  count: number,
  rMin: number,
  rMax: number,
  alpha: number
): ParticleTargets {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = rMin + Math.random() * (rMax - rMin);
    const sinPhi = Math.sin(phi);
    positions[i * 3] = r * sinPhi * Math.cos(theta);
    positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = 0.012 + Math.random() * 0.006;
    alphas[i] = alpha;
  }
  return { positions, sizes, alphas };
}

/**
 * Invisible parking for indices [start, count): scattered in a wide volume at
 * alpha 0. These are the same particles — they fade in/out through the morphs,
 * so the fixed buffer is preserved with no decorative layer.
 */
function parkHidden(
  positions: Float32Array,
  sizes: Float32Array,
  alphas: Float32Array,
  start: number,
  count: number
): void {
  for (let i = start; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 6 + Math.random() * 3; // beyond the visible plane — they only
    // become visible as the morph brings them into the shape
    const sinPhi = Math.sin(phi);
    positions[i * 3] = r * sinPhi * Math.cos(theta);
    positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = 0.011;
    alphas[i] = 0;
  }
}

/**
 * Persistent single-instance WebGL particle engine.
 *
 * One THREE.Points + custom ShaderMaterial. All state changes are expressed as
 * morphs between target sets: the previous targets become the morph origin and
 * the new targets become the destination, interpolated entirely on the GPU
 * (`mix(position, aTarget, t)` with per-particle stagger). Particles are never
 * destroyed or recreated between states.
 *
 * - Fixed-capacity GPU buffers (allocated once)
 * - Capped devicePixelRatio (1.5 mobile / 2 desktop — passed in)
 * - prefers-reduced-motion: static single-frame rendering, no rAF loop
 * - Pauses the loop while the tab is hidden / page is being unloaded
 * - Spiral rotation applied via points.rotation.y (single matrix, not per-vertex)
 */

import * as THREE from "three";
import type { ParticleTargets, ViewportBox } from "./targets";

export interface ParticleEngineOptions {
  count: number;
  dpr: number;
  reducedMotion: boolean;
}

interface MorphState {
  running: boolean;
  start: number;
  duration: number;
}

const FOV = 50;
const CAMERA_DISTANCE = 8;

const VERT = `
uniform float uProgress;
uniform float uHeightScale;
uniform float uPixelRatio;
uniform vec3 uMouse;       // world-space cursor (xy = world pos, z = strength 0..1)
uniform float uMouseRadius; // world-space influence radius

attribute vec3 aTarget;
attribute float aDelay;
attribute float aSize;
attribute float aTargetSize;
attribute float aAlpha;
attribute float aTargetAlpha;
attribute float aSeed;

varying float vAlpha;
varying float vSeed;

float easeInOutCubic(float x) {
  return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
}

void main() {
  float t = clamp((uProgress - aDelay) / max(1.0 - aDelay, 0.001), 0.0, 1.0);
  t = easeInOutCubic(t);
  vec3 pos = mix(position, aTarget, t);

  // Cursor repulsion — subtle, physical, distance-falloff
  float str = uMouse.z; // 0 = off, 1 = full
  if (str > 0.001) {
    vec2 toCursor = pos.xy - uMouse.xy;
    float dist = length(toCursor);
    float falloff = 1.0 - smoothstep(0.0, uMouseRadius, dist);
    falloff = falloff * falloff; // quadratic for tighter local feel
    float push = falloff * str * 0.35; // subtle displacement
    if (dist > 0.001) {
      vec2 dir = toCursor / dist;
      pos.xy += dir * push;
      pos.z += falloff * str * 0.08; // slight Z depth shift
    }
  }

  float alpha = mix(aAlpha, aTargetAlpha, t);
  float size = mix(aSize, aTargetSize, t);
  vAlpha = alpha;
  vSeed = aSeed;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = max(1.0, size * uPixelRatio * uHeightScale / max(0.001, -mv.z));
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = `
uniform float uTime;
varying float vAlpha;
varying float vSeed;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.12, d) * vAlpha;
  float twinkle = 0.92 + 0.08 * sin(uTime * 1.6 + vSeed * 37.0);
  gl_FragColor = vec4(vec3(1.0), a * twinkle);
}
`;

export class ParticleEngine {
  readonly count: number;
  readonly reducedMotion: boolean;

  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private points: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;

  /** Last applied targets — becomes the origin of the next morph. */
  private last: { positions: Float32Array; sizes: Float32Array; alphas: Float32Array };
  private morph: MorphState = { running: false, start: 0, duration: 1 };
  private spinVelocity = 0;
  private spinAngle = 0;
  private mouseWorldX = 9999;
  private mouseWorldY = 9999;
  private mouseStrength = 0;
  private mouseTargetStrength = 0;
  private spinTween: { from: number; to: number; start: number; duration: number } | null = null;
  private time = 0;
  private lastFrame = 0;
  private raf = 0;
  private loopRunning = false;
  private disposed = false;
  private resizeObserver: ResizeObserver | null = null;
  private onResizeCb: (() => void) | null = null;
  private contextLostHandler: ((e: Event) => void) | null = null;
  private contextRestoredHandler: (() => void) | null = null;

  /**
   * Throws if WebGL is unavailable — callers should treat a thrown constructor
   * as "engine not available" and fall back gracefully.
   */
  constructor(canvas: HTMLCanvasElement, opts: ParticleEngineOptions) {
    this.count = opts.count;
    this.reducedMotion = opts.reducedMotion;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      throw new Error("ParticleEngine: WebGL context unavailable");
    }
    if (!renderer.getContext()) {
      throw new Error("ParticleEngine: WebGL context unavailable");
    }
    this.renderer = renderer;
    renderer.setPixelRatio(opts.dpr);
    renderer.setClearColor(0x000000, 0);

    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    this.camera.position.set(0, 0, CAMERA_DISTANCE);

    this.geometry = new THREE.BufferGeometry();
    const pos = new Float32Array(this.count * 3);
    const tgt = new Float32Array(this.count * 3);
    const delay = new Float32Array(this.count);
    const size = new Float32Array(this.count);
    const tSize = new Float32Array(this.count);
    const alpha = new Float32Array(this.count);
    const tAlpha = new Float32Array(this.count);
    const seed = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) seed[i] = Math.random();

    this.geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.geometry.setAttribute("aTarget", new THREE.BufferAttribute(tgt, 3));
    this.geometry.setAttribute("aDelay", new THREE.BufferAttribute(delay, 1));
    this.geometry.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    this.geometry.setAttribute("aTargetSize", new THREE.BufferAttribute(tSize, 1));
    this.geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 1));
    this.geometry.setAttribute("aTargetAlpha", new THREE.BufferAttribute(tAlpha, 1));
    this.geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uHeightScale: { value: 1 },
        uPixelRatio: { value: opts.dpr },
        uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
        uMouseRadius: { value: 1.8 },
      },
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);

    this.last = {
      positions: new Float32Array(this.count * 3),
      sizes: new Float32Array(this.count),
      alphas: new Float32Array(this.count),
    };

    this.resize();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);

    document.addEventListener("visibilitychange", this.handleVisibility);

    // Handle WebGL context loss: hide the canvas so the dark background
    // shows through instead of a white/blank canvas.
    this.contextLostHandler = (e: Event) => {
      e.preventDefault(); // allow context restoration
      this.pause();
      canvas.style.visibility = "hidden";
    };
    this.contextRestoredHandler = () => {
      canvas.style.visibility = "";
      this.resize();
      if (!this.reducedMotion) this.resume();
    };
    canvas.addEventListener("webglcontextlost", this.contextLostHandler);
    canvas.addEventListener("webglcontextrestored", this.contextRestoredHandler);
  }

  /** World-space viewport box at z = 0 (used by target generators). */
  get viewport(): ViewportBox {
    const worldH = 2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2) * CAMERA_DISTANCE;
    return { height: worldH, width: worldH * this.camera.aspect };
  }

  isMorphing(): boolean {
    return this.morph.running;
  }

  onResize(cb: () => void): void {
    this.onResizeCb = cb;
  }

  /** Snap the current morph to its end state (used before interrupting it). */
  completeMorph(): void {
    if (this.morph.running) {
      this.material.uniforms.uProgress.value = 1;
      this.morph.running = false;
      this.commit();
    }
  }

  /**
   * Morph from the previous target set to `targets`. GPU-interpolated with a
   * per-particle stagger (far particles move first → organic wave).
   */
  applyTargets(targets: ParticleTargets, opts: { duration?: number; stagger?: number } = {}): void {
    const duration = (opts.duration ?? 1) * 1000;
    const stagger = opts.stagger ?? 0.35;

    const posAttr = this.geometry.attributes.position as THREE.BufferAttribute;
    const tgtAttr = this.geometry.attributes.aTarget as THREE.BufferAttribute;
    const delayAttr = this.geometry.attributes.aDelay as THREE.BufferAttribute;
    const sizeAttr = this.geometry.attributes.aSize as THREE.BufferAttribute;
    const tSizeAttr = this.geometry.attributes.aTargetSize as THREE.BufferAttribute;
    const alphaAttr = this.geometry.attributes.aAlpha as THREE.BufferAttribute;
    const tAlphaAttr = this.geometry.attributes.aTargetAlpha as THREE.BufferAttribute;

    const posArr = posAttr.array as Float32Array;
    const tgtArr = tgtAttr.array as Float32Array;
    const delayArr = delayAttr.array as Float32Array;
    const sizeArr = sizeAttr.array as Float32Array;
    const tSizeArr = tSizeAttr.array as Float32Array;
    const alphaArr = alphaAttr.array as Float32Array;
    const tAlphaArr = tAlphaAttr.array as Float32Array;

    // Previous state becomes the morph origin.
    posArr.set(this.last.positions);
    sizeArr.set(this.last.sizes);
    alphaArr.set(this.last.alphas);

    // New state becomes the morph target.
    tgtArr.set(targets.positions);
    tSizeArr.set(targets.sizes);
    tAlphaArr.set(targets.alphas);

    // Per-particle stagger: particles far from their destination move first.
    let maxD = 0.0001;
    for (let i = 0; i < this.count; i++) {
      const dx = posArr[i * 3] - tgtArr[i * 3];
      const dy = posArr[i * 3 + 1] - tgtArr[i * 3 + 1];
      const dz = posArr[i * 3 + 2] - tgtArr[i * 3 + 2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d > maxD) maxD = d;
    }
    for (let i = 0; i < this.count; i++) {
      const dx = posArr[i * 3] - tgtArr[i * 3];
      const dy = posArr[i * 3 + 1] - tgtArr[i * 3 + 1];
      const dz = posArr[i * 3 + 2] - tgtArr[i * 3 + 2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) / maxD;
      const base = 1 - Math.min(1, d);
      delayArr[i] = base * stagger * 0.85 + Math.random() * stagger * 0.15;
    }

    posAttr.needsUpdate = true;
    tgtAttr.needsUpdate = true;
    delayAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    tSizeAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
    tAlphaAttr.needsUpdate = true;

    this.last = { positions: targets.positions, sizes: targets.sizes, alphas: targets.alphas };

    if (duration <= 0 || this.reducedMotion) {
      this.material.uniforms.uProgress.value = 1;
      this.morph.running = false;
      this.commit();
      this.renderOnce();
    } else {
      this.material.uniforms.uProgress.value = 0;
      this.morph = { running: true, start: performance.now(), duration };
      this.renderOnce(); // present the origin frame immediately
      if (!this.loopRunning) this.resume();
    }
  }

  /**
   * Update cursor position in normalized [0,1] viewport coordinates.
   * Converted to world space internally. Pass null/false to disable.
   */
  setMouse(nx: number | null, ny: number | null): void {
    if (nx === null || ny === null) {
      this.mouseTargetStrength = 0;
      return;
    }
    const vp = this.viewport;
    this.mouseWorldX = (nx - 0.5) * vp.width;
    this.mouseWorldY = (0.5 - ny) * vp.height;
    this.mouseTargetStrength = 1;
  }

  /** Smoothly enable/disable mouse interaction (0 = off, 1 = full). */
  setMouseStrength(s: number): void {
    this.mouseTargetStrength = s;
  }

  /** Continuous spiral rotation speed (radians/second). */
  setSpinVelocity(v: number): void {
    this.spinVelocity = v;
  }

  /** Tween the spiral angle to `angle` over `duration` seconds (untwist). */
  animateSpinTo(angle: number, duration: number): void {
    this.spinTween = {
      from: this.spinAngle,
      to: angle,
      start: performance.now(),
      duration: duration * 1000,
    };
  }

  /** Begin rendering. In reduced-motion mode this renders a single static frame. */
  start(): void {
    if (this.disposed) return;
    if (this.reducedMotion) {
      this.renderOnce();
      return;
    }
    this.resume();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.pause();
    this.resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.handleVisibility);
    // Remove context loss handlers before disposing the renderer.
    if (this.contextLostHandler) {
      this.renderer.domElement.removeEventListener("webglcontextlost", this.contextLostHandler);
    }
    if (this.contextRestoredHandler) {
      this.renderer.domElement.removeEventListener("webglcontextrestored", this.contextRestoredHandler);
    }
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
    // Do NOT call forceContextLoss() here. In React StrictMode (dev), the
    // effect cleanup disposes the engine and then immediately re-creates it
    // on the same <canvas>. forceContextLoss() puts the canvas into a
    // context-lost state which some browsers render as a white/blank
    // surface — occluding the dark background and causing a white page.
    // renderer.dispose() is sufficient to release GPU resources.
  }

  private commit(): void {
    const posAttr = this.geometry.attributes.position as THREE.BufferAttribute;
    const sizeAttr = this.geometry.attributes.aSize as THREE.BufferAttribute;
    const alphaAttr = this.geometry.attributes.aAlpha as THREE.BufferAttribute;
    (posAttr.array as Float32Array).set(
      this.geometry.attributes.aTarget.array as Float32Array
    );
    (sizeAttr.array as Float32Array).set(
      this.geometry.attributes.aTargetSize.array as Float32Array
    );
    (alphaAttr.array as Float32Array).set(
      this.geometry.attributes.aTargetAlpha.array as Float32Array
    );
    posAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
  }

  private resize = (): void => {
    let w = this.renderer.domElement.clientWidth;
    let h = this.renderer.domElement.clientHeight;
    // Fallback: if the canvas has no laid-out size yet, use the window so the
    // very first frame is never blank or rendered as 1px dots.
    if (!w || !h) {
      w = window.innerWidth;
      h = window.innerHeight;
    }
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.material.uniforms.uHeightScale.value =
      h / (2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2));
    this.onResizeCb?.();
    if (this.reducedMotion) this.renderOnce();
  };

  private handleVisibility = (): void => {
    if (document.hidden) this.pause();
    else if (!this.reducedMotion) this.resume();
  };

  private resume(): void {
    if (this.disposed || this.loopRunning) return;
    this.loopRunning = true;
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private pause(): void {
    if (!this.loopRunning) return;
    this.loopRunning = false;
    cancelAnimationFrame(this.raf);
  }

  /** Render a single frame immediately (used to guarantee the first paint). */
  renderOnce(): void {
    if (this.disposed) return;
    this.renderer.render(this.scene, this.camera);
  }

  private tick = (now: number): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min(0.05, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    this.time += dt;

    if (this.morph.running) {
      const p = (now - this.morph.start) / this.morph.duration;
      if (p >= 1) {
        this.material.uniforms.uProgress.value = 1;
        this.morph.running = false;
        this.commit();
      } else {
        this.material.uniforms.uProgress.value = p;
      }
    }

    if (this.spinTween) {
      const sp = Math.min(1, (now - this.spinTween.start) / this.spinTween.duration);
      const e = sp < 1 ? sp * sp * (3 - 2 * sp) : 1;
      this.spinAngle = this.spinTween.from + (this.spinTween.to - this.spinTween.from) * e;
      if (sp >= 1) this.spinTween = null;
    }
    this.spinAngle += this.spinVelocity * dt;
    this.points.rotation.y = this.spinAngle;

    // Damped cursor interaction strength
    const mouseLerp = 1 - Math.pow(0.00001, dt);
    this.mouseStrength += (this.mouseTargetStrength - this.mouseStrength) * mouseLerp;
    if (this.mouseStrength < 0.001) this.mouseStrength = 0;
    const uMouse = this.material.uniforms.uMouse.value as THREE.Vector3;
    uMouse.set(this.mouseWorldX, this.mouseWorldY, this.mouseStrength);

    this.material.uniforms.uTime.value = this.time;
    this.renderer.render(this.scene, this.camera);
  };
}

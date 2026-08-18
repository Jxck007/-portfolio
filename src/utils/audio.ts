// Web Audio API Cinematic Synthesizer for Intro Gate and Warp Transition
// No external static assets required; all sound is generated procedurally in real-time.

let audioCtx: AudioContext | null = null;
let padGainNode: GainNode | null = null;
let droneOsc1: OscillatorNode | null = null;
let droneOsc2: OscillatorNode | null = null;
let lfoNode: OscillatorNode | null = null;

// Initialize the Audio Context safely
function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Procedurally starts a deep, evolving cosmic ambient space pad.
 * Detuned oscillators combined with a lowpass filter modulated by an LFO
 * create an organic, atmospheric cinematic drone.
 */
export function startAmbientPad() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Guard against multiple initializations
    if (padGainNode) return;

    // Create a master pad gain node for smooth fade-in
    padGainNode = ctx.createGain();
    padGainNode.gain.setValueAtTime(0, ctx.currentTime);
    padGainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 4.0); // Slow fade-in over 4 seconds

    // Deep cinematic chord frequencies (E1 and B1 for an immersive perfect 5th drone)
    const freq1 = 41.20; // E1
    const freq2 = 61.74; // B1
    const freq3 = 82.41; // E2

    // Warm triangle oscillator 1
    droneOsc1 = ctx.createOscillator();
    droneOsc1.type = "triangle";
    droneOsc1.frequency.setValueAtTime(freq1, ctx.currentTime);

    // Warm triangle oscillator 2 (detuned slightly for chorus/beating effect)
    droneOsc2 = ctx.createOscillator();
    droneOsc2.type = "sawtooth"; // Richer harmonics
    droneOsc2.frequency.setValueAtTime(freq2 + 0.3, ctx.currentTime);

    // Mid oscillator for core presence
    const droneOsc3 = ctx.createOscillator();
    droneOsc3.type = "triangle";
    droneOsc3.frequency.setValueAtTime(freq3, ctx.currentTime);

    // Lowpass filter to keep it deep and warm
    const filterNode = ctx.createBiquadFilter();
    filterNode.type = "lowpass";
    filterNode.frequency.setValueAtTime(180, ctx.currentTime);
    filterNode.Q.setValueAtTime(4.0, ctx.currentTime);

    // Evolving LFO to slowly sweep the filter cutoff back and forth
    lfoNode = ctx.createOscillator();
    lfoNode.frequency.setValueAtTime(0.12, ctx.currentTime); // Very slow 0.12Hz cycle

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(60, ctx.currentTime); // Modulate filter cutoff by +/- 60Hz

    // Connect LFO modulation
    lfoNode.connect(lfoGain);
    lfoGain.connect(filterNode.frequency);

    // Connect audio signal path
    droneOsc1.connect(filterNode);
    droneOsc2.connect(filterNode);
    droneOsc3.connect(filterNode);
    filterNode.connect(padGainNode);
    padGainNode.connect(ctx.destination);

    // Start all synthesized nodes
    droneOsc1.start();
    droneOsc2.start();
    droneOsc3.start();
    lfoNode.start();
  } catch (error) {
    console.warn("Failed to start ambient synthesized audio:", error);
  }
}

/**
 * Plays a high-fidelity stylized cartoonish "warp whoosh" sound effect using Web Audio API.
 * Uses rising frequency modulators and bandpass-filtered noise to create
 * a perfect Spider-Verse lightspeed transition sonic signature.
 */
export function playWarpWhoosh() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const duration = 0.8;
    const now = ctx.currentTime;

    // 1. White Noise Generator for airy air pressure whoosh
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // Sweep filter for the noise
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(100, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(1600, now + duration * 0.8);
    noiseFilter.Q.setValueAtTime(2.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.15);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseNode.start(now);

    // 2. Synthesizer Laser/Warp sweeps
    const sweepCount = 3;
    for (let i = 0; i < sweepCount; i++) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = i % 2 === 0 ? "sawtooth" : "triangle";
      
      const startFreq = 80 + i * 40;
      const endFreq = 900 + i * 350;
      
      osc.frequency.setValueAtTime(startFreq, now);
      // Sweeps rapidly upwards matching the cinematic warp line explosion
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.7);

      const sweepFilter = ctx.createBiquadFilter();
      sweepFilter.type = "lowpass";
      sweepFilter.frequency.setValueAtTime(1200, now);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.06, now + 0.1 + i * 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(sweepFilter);
      sweepFilter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    }

    // 3. Smoothly fade out and stop the ambient space pad background drone
    if (padGainNode) {
      padGainNode.gain.cancelScheduledValues(now);
      padGainNode.gain.setValueAtTime(padGainNode.gain.value, now);
      padGainNode.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.1);
      
      setTimeout(() => {
        try {
          droneOsc1?.stop();
          droneOsc2?.stop();
          lfoNode?.stop();
          padGainNode = null;
        } catch (e) {}
      }, duration * 1100);
    }
  } catch (error) {
    console.warn("Failed to play warp synthesized audio:", error);
  }
}

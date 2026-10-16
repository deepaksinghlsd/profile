import { siteConfig } from '../config/site';
import { readPrefs, writePrefs } from './prefs';

export interface MusicState {
  enabled: boolean;
  status: 'off' | 'starting' | 'on' | 'error';
  volume: number;
  ducked: boolean;
  error: string | null;
  title: string;
  credit: string;
}

const MAX_GAIN = 0.16;
const midi = (n: number) => 440 * 2 ** ((n - 69) / 12);

// Slow minor-key progression: Am9, Fmaj7, Cmaj7, G6 (MIDI note numbers).
const CHORDS = [
  [45, 57, 64, 67, 71],
  [41, 57, 60, 64, 69],
  [48, 55, 59, 64, 67],
  [43, 55, 59, 62, 64],
];

/** An ambient pad generated live with oscillators, filters and a delay. */
class AmbientPad {
  private voices: { a: OscillatorNode; b: OscillatorNode }[] = [];
  private lfo: OscillatorNode;
  private timer = 0;
  private step = 0;
  private ctx: AudioContext;

  constructor(ctx: AudioContext, out: AudioNode) {
    this.ctx = ctx;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 950;
    filter.Q.value = 0.6;

    this.lfo = ctx.createOscillator();
    this.lfo.frequency.value = 0.06;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 380;
    this.lfo.connect(lfoDepth).connect(filter.frequency);

    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.43;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.32;
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    filter.connect(out);
    filter.connect(delay);
    delay.connect(feedback).connect(delay);
    delay.connect(wet).connect(out);

    for (const note of CHORDS[0]) {
      const gain = ctx.createGain();
      gain.gain.value = note < 50 ? 0.16 : 0.1;
      const a = ctx.createOscillator();
      a.type = 'sine';
      a.frequency.value = midi(note);
      const b = ctx.createOscillator();
      b.type = 'triangle';
      b.frequency.value = midi(note);
      b.detune.value = 7;
      a.connect(gain);
      b.connect(gain);
      gain.connect(filter);
      this.voices.push({ a, b });
    }
  }

  start() {
    this.lfo.start();
    this.voices.forEach(({ a, b }) => {
      a.start();
      b.start();
    });
    this.timer = window.setInterval(() => this.next(), 9000);
  }

  private next() {
    this.step = (this.step + 1) % CHORDS.length;
    const t = this.ctx.currentTime;
    CHORDS[this.step].forEach((note, i) => {
      this.voices[i].a.frequency.setTargetAtTime(midi(note), t, 1.6);
      this.voices[i].b.frequency.setTargetAtTime(midi(note), t, 1.6);
    });
  }

  stop() {
    window.clearInterval(this.timer);
    try {
      this.lfo.stop();
      this.voices.forEach(({ a, b }) => {
        a.stop();
        b.stop();
      });
    } catch {
      /* already stopped */
    }
  }
}

/**
 * Optional background music. Never starts by itself: the visitor has to switch
 * it on, and it dips while narration plays.
 */
export class MusicController {
  private state: MusicState;
  private listeners = new Set<() => void>();
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private pad: AmbientPad | null = null;
  private element: HTMLAudioElement | null = null;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    const cfg = siteConfig.music;
    this.state = {
      enabled: false,
      status: 'off',
      volume: readPrefs().musicVolume ?? cfg.defaultVolume,
      ducked: false,
      error: null,
      title: cfg.source.title,
      credit: cfg.source.credit,
    };
  }

  getState = () => this.state;
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  private set(patch: Partial<MusicState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  private target() {
    const { enabled, volume, ducked } = this.state;
    return enabled ? volume * (ducked ? siteConfig.music.duckTo : 1) * MAX_GAIN : 0;
  }

  private ramp(seconds = 0.8) {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(this.target(), t + seconds);
  }

  /** Call from a click handler. */
  async enable() {
    if (this.state.enabled) return;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) {
      this.set({ status: 'error', error: 'This browser does not support Web Audio.' });
      return;
    }
    this.set({ enabled: true, status: 'starting', error: null });
    try {
      if (!this.ctx) {
        this.ctx = new Ctx();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0;
        this.master.connect(this.ctx.destination);
        const src = siteConfig.music.source;
        if (src.type === 'file') {
          this.element = new Audio(new URL(this.baseUrl + src.src, window.location.href).href);
          this.element.loop = true;
          this.element.crossOrigin = 'anonymous';
          this.ctx.createMediaElementSource(this.element).connect(this.master);
        } else {
          this.pad = new AmbientPad(this.ctx, this.master);
          this.pad.start();
        }
      }
      await this.ctx.resume();
      if (this.element) await this.element.play();
      if (!this.state.enabled) return; // switched off while starting
      this.set({ status: 'on' });
      this.ramp(1.5);
    } catch (err) {
      this.set({ enabled: false, status: 'error', error: err instanceof Error ? err.message : 'Music could not start.' });
    }
  }

  disable() {
    if (!this.state.enabled) return;
    this.set({ enabled: false, status: 'off' });
    this.ramp(0.5);
    window.setTimeout(() => {
      if (this.state.enabled) return;
      this.element?.pause();
      void this.ctx?.suspend();
    }, 600);
  }

  toggle() {
    if (this.state.enabled) this.disable();
    else void this.enable();
  }

  setVolume(volume: number) {
    this.set({ volume: Math.min(1, Math.max(0, volume)) });
    this.ramp(0.15);
    writePrefs({ musicVolume: this.state.volume });
  }

  setDucked(ducked: boolean) {
    if (ducked === this.state.ducked) return;
    this.set({ ducked });
    this.ramp(ducked ? 0.4 : 1.2);
  }
}

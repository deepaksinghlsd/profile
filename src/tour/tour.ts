import { useSyncExternalStore } from 'react';
import { narration } from '../audio';
import { siteConfig } from '../config/site';
import type { SectionId } from '../data/types';
import { buildNarration } from '../narration/scripts';

export interface TourState {
  active: boolean;
  status: 'idle' | 'starting' | 'running' | 'paused' | 'finished';
  index: number;
  steps: SectionId[];
  /** 'audio' plays narration; 'silent' shows the transcript and advances on a timer. */
  mode: 'audio' | 'silent';
  /** Silent mode: 0..1 progress of the current step's reading timer. */
  stepProgress: number;
  notice: string | null;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

function scrollToSection(id: SectionId): Promise<void> {
  const el = document.getElementById(id);
  if (!el) return Promise.resolve();
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  if (Math.abs(el.getBoundingClientRect().top - margin) < 8) return wait(150).then(() => undefined);
  el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener('scrollend', finish);
      resolve();
    };
    window.addEventListener('scrollend', finish);
    window.setTimeout(finish, 1400);
  });
}

/**
 * Walks visitors through the sections in order: scroll, then narrate, then
 * move on. Scrolling stays free the whole time; the tour never locks the page.
 * Starting another narration while the tour runs pauses the tour.
 */
class TourController {
  private state: TourState = {
    active: false,
    status: 'idle',
    index: 0,
    steps: siteConfig.tour.order,
    mode: 'audio',
    stepProgress: 0,
    notice: null,
  };
  private listeners = new Set<() => void>();
  private run = 0;
  /** Set by skip(); honoured even when pressed between steps. */
  private skipPending = false;
  private exiting = false;
  /** The step's narration was cut off by another narration. */
  private interrupted = false;
  private resumeWaiters: (() => void)[] = [];
  private silent: { remaining: number; total: number; resolve: () => void; timer: number; last: number } | null = null;

  getState = () => this.state;
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  private set(patch: Partial<TourState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }
  private wake() {
    this.resumeWaiters.splice(0).forEach((f) => f());
  }
  private async untilRunning(run: number) {
    while (this.state.status === 'paused' && run === this.run) {
      await new Promise<void>((r) => this.resumeWaiters.push(r));
    }
  }

  /** Call from a click handler (audio unlock needs the gesture). */
  async start(from = 0) {
    narration.prime();
    this.exit();
    const run = ++this.run;
    this.set({ active: true, status: 'starting', index: from, mode: 'audio', notice: null, stepProgress: 0 });
    const canNarrate = await narration.canNarrate();
    if (run !== this.run) return;
    if (!canNarrate) {
      this.set({ mode: 'silent', notice: 'Narration is not available in this browser, so the tour shows each transcript instead.' });
    }
    void this.loop(from, run);
  }

  private async loop(from: number, run: number) {
    const { steps } = this.state;
    for (let i = from; i < steps.length; i++) {
      if (run !== this.run) return;
      this.set({ index: i, stepProgress: 0, status: this.state.status === 'paused' ? 'paused' : 'running' });
      this.interrupted = false;
      this.skipPending = false;
      await scrollToSection(steps[i]);
      await wait(siteConfig.tour.settleMs);
      await this.untilRunning(run);
      if (run !== this.run) return;
      if (this.skipPending) continue;

      if (this.state.mode === 'audio') {
        const result = await narration.play(steps[i]);
        if (run !== this.run) return;
        if (result === 'ended' || this.skipPending) continue;
        if (result === 'error') {
          this.set({ mode: 'silent', notice: 'Narration could not play here, so the tour continues with transcripts.' });
          i--; // redo this step silently
          continue;
        }
        // Stopped by something other than the tour: another narration started.
        this.interrupted = true;
        this.set({ status: 'paused', notice: 'Tour paused because another narration started. Resume to replay this step.' });
        return;
      }

      await this.silentStep(steps[i]);
    }
    if (run === this.run) this.set({ status: 'finished', stepProgress: 1 });
  }

  private silentStep(section: SectionId): Promise<void> {
    const words = buildNarration(section, narration.getState().lang).split(/\s+/).length;
    const cfg = siteConfig.tour;
    const seconds = Math.min(cfg.silentMaxSeconds, Math.max(cfg.silentMinSeconds, words / cfg.silentWordsPerSecond));
    return new Promise<void>((resolve) => {
      const s = { remaining: seconds * 1000, total: seconds * 1000, resolve, timer: 0, last: performance.now() };
      this.silent = s;
      s.timer = window.setInterval(() => {
        const now = performance.now();
        if (this.state.status === 'running') s.remaining -= now - s.last;
        s.last = now;
        this.set({ stepProgress: 1 - Math.max(0, s.remaining) / s.total });
        if (s.remaining <= 0) this.endSilent();
      }, 200);
    });
  }

  private endSilent() {
    const s = this.silent;
    if (!s) return;
    window.clearInterval(s.timer);
    this.silent = null;
    s.resolve();
  }

  pause() {
    if (!this.state.active || (this.state.status !== 'running' && this.state.status !== 'starting')) return;
    if (this.state.mode === 'audio') narration.pause();
    this.set({ status: 'paused' });
  }

  resume() {
    if (!this.state.active) return;
    if (this.state.status === 'running' && this.state.mode === 'audio') {
      narration.resume(); // paused from the player rather than the tour controls
      return;
    }
    if (this.state.status !== 'paused') return;
    if (this.interrupted) {
      this.interrupted = false;
      const run = ++this.run;
      this.set({ status: 'running', notice: null });
      void this.loop(this.state.index, run);
      return;
    }
    this.set({ status: 'running' });
    this.wake();
    if (this.state.mode === 'audio') narration.resume();
  }

  skip() {
    if (!this.state.active || this.state.status === 'finished') return;
    if (this.interrupted) {
      this.interrupted = false;
      const run = ++this.run;
      this.set({ status: 'running', notice: null });
      void this.loop(this.state.index + 1, run);
      return;
    }
    this.skipPending = true;
    this.set({ status: 'running' });
    this.wake();
    if (this.state.mode === 'audio') {
      const n = narration.getState();
      if (n.section === this.state.steps[this.state.index] && n.status !== 'idle' && n.status !== 'error') narration.stop();
    } else {
      this.endSilent();
    }
  }

  exit() {
    if (!this.state.active || this.exiting) return;
    this.exiting = true;
    this.run++;
    this.endSilent();
    this.wake();
    const n = narration.getState();
    // Only stop narration that belongs to the tour, not one the visitor started.
    if (!this.interrupted && n.section === this.state.steps[this.state.index] && n.status !== 'idle') narration.stop();
    this.interrupted = false;
    this.skipPending = false;
    this.set({ active: false, status: 'idle', notice: null, stepProgress: 0 });
    this.exiting = false;
  }
}

export const tour = new TourController();
export const useTour = () => useSyncExternalStore(tour.subscribe, tour.getState, tour.getState);

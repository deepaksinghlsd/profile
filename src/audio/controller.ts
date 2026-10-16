import { siteConfig, type Lang } from '../config/site';
import type { SectionId } from '../data/types';
import { buildNarration } from '../narration/scripts';
import { readPrefs, writePrefs } from './prefs';
import type {
  NarrationProvider,
  NarrationRequest,
  PlaybackHandle,
  PlaybackResult,
  PlaybackStatus,
  SourceKind,
} from './types';

export interface NarrationState {
  status: PlaybackStatus;
  /** Section currently loaded (kept after stop/end so "replay" works). */
  section: SectionId | null;
  lang: Lang;
  progress: number;
  elapsed: number;
  duration: number;
  source: SourceKind | null;
  sourceLabel: string | null;
  seekable: boolean;
  estimated: boolean;
  error: string | null;
  notice: string | null;
  volume: number;
  muted: boolean;
}

type Listener = () => void;

/**
 * The one place narration is played from. Every "Listen" button, the floating
 * player and the guided tour go through this controller, so two narrations can
 * never overlap: starting one always stops the other first.
 */
export class NarrationController {
  private state: NarrationState;
  private listeners = new Set<Listener>();
  private handle: PlaybackHandle | null = null;
  private token = 0;
  private pending: Promise<PlaybackResult> | null = null;
  private settle: ((r: PlaybackResult) => void) | null = null;
  private wantPaused = false;
  private readonly providers: NarrationProvider[];

  constructor(providers: NarrationProvider[]) {
    this.providers = providers;
    const prefs = readPrefs();
    const langs = siteConfig.narration.languages.map((l) => l.id);
    this.state = {
      status: 'idle',
      section: null,
      lang: prefs.lang && langs.includes(prefs.lang) ? prefs.lang : siteConfig.narration.defaultLang,
      progress: 0,
      elapsed: 0,
      duration: 0,
      source: null,
      sourceLabel: null,
      seekable: false,
      estimated: false,
      error: null,
      notice: null,
      volume: prefs.volume ?? 0.9,
      muted: prefs.muted ?? false,
    };
    if (typeof window !== 'undefined') window.addEventListener('pagehide', () => this.halt('stopped'));
  }

  getState = (): NarrationState => this.state;

  subscribe = (fn: Listener): (() => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  private set(patch: Partial<NarrationState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  private effectiveVolume() {
    return this.state.muted ? 0 : this.state.volume;
  }

  private finish(result: PlaybackResult) {
    const settle = this.settle;
    this.settle = null;
    this.pending = null;
    settle?.(result);
  }

  private halt(result: PlaybackResult) {
    this.token++;
    this.wantPaused = false;
    this.handle?.stop();
    this.handle = null;
    this.finish(result);
  }

  /** Unlock audio output; call synchronously inside a click handler. */
  prime() {
    this.providers.forEach((p) => p.prime());
  }

  /**
   * Play a section's narration. Resolves when that playback ends, is stopped
   * (including by another section starting), or fails. Call it from a click
   * handler so strict browsers allow audio.
   */
  play(section: SectionId): Promise<PlaybackResult> {
    if (this.state.section === section && this.pending) {
      if (this.state.status === 'paused') this.resume();
      return this.pending;
    }
    this.prime();
    this.halt('stopped');
    const token = this.token;
    const req: NarrationRequest = { section, lang: this.state.lang, text: buildNarration(section, this.state.lang) };
    this.pending = new Promise<PlaybackResult>((resolve) => {
      this.settle = resolve;
    });
    this.set({
      status: 'loading',
      section,
      progress: 0,
      elapsed: 0,
      duration: 0,
      source: null,
      sourceLabel: null,
      error: null,
      notice: null,
    });
    void this.startWith(req, token, this.providers, null);
    return this.pending;
  }

  private async startWith(req: NarrationRequest, token: number, providers: NarrationProvider[], notice: string | null) {
    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      let ok = false;
      try {
        ok = await provider.canPlay(req);
      } catch {
        ok = false;
      }
      if (token !== this.token) return;
      if (!ok) continue;

      const fallbacks = providers.slice(i + 1);
      const handle = provider.start(req, this.effectiveVolume(), {
        onPlaying: () => {
          if (token === this.token && this.state.status !== 'paused') this.set({ status: 'playing' });
        },
        onProgress: (progress, elapsed, duration) => {
          if (token === this.token) this.set({ progress, elapsed, duration });
        },
        onEnded: () => {
          if (token !== this.token) return;
          this.handle = null;
          this.set({ status: 'idle', progress: 1 });
          this.finish('ended');
        },
        onError: (err) => {
          if (token !== this.token) return;
          this.handle = null;
          if (fallbacks.length) {
            const why = provider.kind === 'file' ? 'The audio file could not be played' : 'The voice failed';
            void this.startWith(req, token, fallbacks, `${why}, so a fallback voice is reading instead.`);
            return;
          }
          this.set({ status: 'error', error: err.message || 'Narration failed.' });
          this.finish('error');
        },
      });
      this.handle = handle;
      this.set({
        source: provider.kind,
        sourceLabel: provider.describe(req),
        seekable: handle.seekable,
        estimated: handle.estimated,
        notice,
      });
      if (this.wantPaused) {
        handle.pause();
        this.set({ status: 'paused' });
      }
      return;
    }
    if (token !== this.token) return;
    this.set({
      status: 'error',
      error:
        req.lang === 'hi'
          ? 'No Hindi voice is available in this browser. Switch to English, or read the transcript below the section.'
          : 'Narration is not available in this browser. You can read the transcript below the section instead.',
    });
    this.finish('error');
  }

  toggle(section: SectionId) {
    const s = this.state;
    if (s.section === section && (s.status === 'playing' || s.status === 'loading')) this.pause();
    else void this.play(section);
  }

  pause() {
    const { status } = this.state;
    if (status !== 'playing' && status !== 'loading') return;
    if (this.handle) this.handle.pause();
    else this.wantPaused = true;
    this.set({ status: 'paused' });
  }

  resume() {
    if (this.state.status !== 'paused') return;
    if (this.handle) {
      this.handle.resume();
      this.set({ status: 'playing' });
    } else {
      this.wantPaused = false;
      this.set({ status: 'loading' });
    }
  }

  stop() {
    this.halt('stopped');
    this.set({ status: 'idle', progress: 0, elapsed: 0, notice: null, error: null });
  }

  replay() {
    const { section } = this.state;
    if (!section) return;
    this.halt('stopped');
    void this.play(section);
  }

  seek(fraction: number) {
    if (this.handle?.seekable) this.handle.seek(fraction);
  }

  setVolume(volume: number) {
    const v = Math.min(1, Math.max(0, volume));
    this.set({ volume: v, muted: v === 0 ? this.state.muted : false });
    this.handle?.setVolume(this.effectiveVolume());
    writePrefs({ volume: v, muted: this.state.muted });
  }

  toggleMute() {
    this.set({ muted: !this.state.muted });
    this.handle?.setVolume(this.effectiveVolume());
    writePrefs({ muted: this.state.muted });
  }

  setLang(lang: Lang) {
    if (lang === this.state.lang) return;
    this.halt('stopped');
    this.set({ lang, status: 'idle', progress: 0, elapsed: 0, error: null, notice: null });
    writePrefs({ lang });
  }

  /** Whether any provider can narrate in the current language (used by the tour). */
  async canNarrate(): Promise<boolean> {
    const lang = this.state.lang;
    const req: NarrationRequest = { section: 'home', lang, text: buildNarration('home', lang) };
    for (const p of this.providers) {
      try {
        if (await p.canPlay(req)) return true;
      } catch {
        /* try the next provider */
      }
    }
    return false;
  }
}

import { textHash } from '../../narration/hash';
import { MANIFEST_PATH, type NarrationManifest, type NarrationManifestEntry } from '../../narration/manifest';
import type { NarrationProvider, NarrationRequest, PlaybackEvents, PlaybackHandle } from '../types';

// Zero-length WAV, played once inside a click so iOS lets this element play later.
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

/**
 * Plays MP3 files generated ahead of time by scripts/generate-narration.ts.
 * A file is used only when its manifest hash matches the current text, so
 * editing portfolio content never plays stale audio.
 */
export class StaticFileProvider implements NarrationProvider {
  readonly kind = 'file' as const;
  private manifest: Promise<NarrationManifest | null> | null = null;
  private resolved = new Map<string, NarrationManifestEntry>();
  private audio: HTMLAudioElement | null = null;
  private primed = false;
  private readonly manifestUrl: string;

  constructor(baseUrl: string) {
    this.manifestUrl = new URL(baseUrl + MANIFEST_PATH, window.location.href).href;
  }

  loadManifest(): Promise<NarrationManifest | null> {
    this.manifest ??= fetch(this.manifestUrl, { cache: 'no-cache' })
      .then((r) => (r.ok ? (r.json() as Promise<NarrationManifest>) : null))
      .catch(() => null);
    return this.manifest;
  }

  private element(): HTMLAudioElement {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = 'auto';
    }
    return this.audio;
  }

  prime(): void {
    if (this.primed) return;
    this.primed = true;
    const audio = this.element();
    audio.src = SILENT_WAV;
    audio.play().catch(() => undefined);
  }

  async canPlay(req: NarrationRequest): Promise<boolean> {
    const manifest = await this.loadManifest();
    const entry = manifest?.entries?.[`${req.lang}/${req.section}`];
    if (!entry || entry.hash !== textHash(req.text)) {
      if (entry && import.meta.env.DEV) {
        console.info(`[narration] ${req.lang}/${req.section}.mp3 is stale; run "npm run narration:generate".`);
      }
      return false;
    }
    this.resolved.set(`${req.lang}/${req.section}`, entry);
    return true;
  }

  describe(req: NarrationRequest): string {
    const entry = this.resolved.get(`${req.lang}/${req.section}`);
    return entry ? `Pre-generated · ${entry.provider}` : 'Pre-generated audio';
  }

  start(req: NarrationRequest, volume: number, ev: PlaybackEvents): PlaybackHandle {
    const entry = this.resolved.get(`${req.lang}/${req.section}`);
    const audio = this.element();
    const ac = new AbortController();
    const on = { signal: ac.signal };
    const fail = (err: unknown) => {
      if (ac.signal.aborted) return;
      ac.abort();
      ev.onError(err instanceof Error ? err : new Error(String(err)));
    };

    audio.addEventListener('playing', () => ev.onPlaying(), on);
    audio.addEventListener(
      'timeupdate',
      () => {
        const d = audio.duration;
        if (Number.isFinite(d) && d > 0) ev.onProgress(audio.currentTime / d, audio.currentTime, d);
      },
      on,
    );
    audio.addEventListener(
      'ended',
      () => {
        ac.abort();
        ev.onEnded();
      },
      on,
    );
    audio.addEventListener('error', () => fail(new Error('The narration file could not be loaded.')), on);

    if (!entry) {
      queueMicrotask(() => fail(new Error('No narration file for this section.')));
    } else {
      audio.src = new URL(entry.file, this.manifestUrl).href;
      audio.volume = volume;
      audio.play().catch(fail);
    }

    return {
      seekable: true,
      estimated: false,
      pause: () => audio.pause(),
      resume: () => void audio.play().catch(fail),
      stop: () => {
        ac.abort();
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      },
      setVolume: (v) => {
        audio.volume = v;
      },
      seek: (f) => {
        if (Number.isFinite(audio.duration)) audio.currentTime = Math.min(Math.max(f, 0), 0.999) * audio.duration;
      },
    };
  }
}

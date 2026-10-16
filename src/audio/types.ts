import type { Lang } from '../config/site';
import type { SectionId } from '../data/types';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
/** How a playback request finished. */
export type PlaybackResult = 'ended' | 'stopped' | 'error';
export type SourceKind = 'file' | 'speech';

export interface NarrationRequest {
  section: SectionId;
  lang: Lang;
  text: string;
}

export interface PlaybackEvents {
  onPlaying(): void;
  /** progress 0..1, elapsed and duration in seconds (duration may be an estimate). */
  onProgress(progress: number, elapsed: number, duration: number): void;
  onEnded(): void;
  onError(error: Error): void;
}

export interface PlaybackHandle {
  pause(): void;
  resume(): void;
  stop(): void;
  /** Effective volume 0..1 (already 0 when muted). */
  setVolume(volume: number): void;
  seek(fraction: number): void;
  readonly seekable: boolean;
  /** True when duration/progress are estimates (browser speech). */
  readonly estimated: boolean;
}

/**
 * A source of narration audio. Add a provider (for example a server endpoint
 * that streams TTS) by implementing this interface and registering it in
 * src/audio/index.ts. Providers are tried in order; the first that can play
 * a request wins, and later ones act as fallbacks if it errors.
 */
export interface NarrationProvider {
  readonly kind: SourceKind;
  /** Called synchronously inside the click handler, to unlock audio on strict browsers (iOS Safari). */
  prime(): void;
  canPlay(req: NarrationRequest): Promise<boolean>;
  /** Short label for the player, e.g. "Pre-generated · elevenlabs". Valid after canPlay() resolved true. */
  describe(req: NarrationRequest): string;
  start(req: NarrationRequest, volume: number, events: PlaybackEvents): PlaybackHandle;
}

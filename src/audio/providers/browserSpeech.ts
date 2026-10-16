import { langConfig, siteConfig, type Lang } from '../../config/site';
import type { NarrationProvider, NarrationRequest, PlaybackEvents, PlaybackHandle } from '../types';

/** Rough speaking speed used to estimate progress (browsers do not report duration). */
const CHARS_PER_SECOND = 14.5;
const MAX_CHUNK = 180;

/**
 * Split narration into sentence-sized chunks. Long utterances stall in some
 * browsers (Chrome stops network voices after ~15 s), and chunking lets us
 * pause/resume and seek by sentence without relying on speechSynthesis.pause(),
 * which is unreliable on Android.
 */
export function splitIntoChunks(text: string): string[] {
  const sentences: string[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if ('.!?।'.includes(ch) && (i === text.length - 1 || /\s/.test(text[i + 1]))) {
      const word = text.slice(start, i).split(/\s+/).pop() ?? '';
      if (ch === '.' && word.length <= 2 && /^[A-Z]/.test(word)) continue; // "Dr.", "A. P. J."
      sentences.push(text.slice(start, i + 1).trim());
      start = i + 1;
    }
  }
  if (start < text.length && text.slice(start).trim()) sentences.push(text.slice(start).trim());

  const chunks: string[] = [];
  for (const s of sentences) {
    if (s.length <= MAX_CHUNK) {
      chunks.push(s);
      continue;
    }
    let rest = s;
    while (rest.length > MAX_CHUNK) {
      const cut = Math.max(rest.lastIndexOf(', ', MAX_CHUNK), rest.lastIndexOf(': ', MAX_CHUNK));
      const at = cut > 40 ? cut + 1 : MAX_CHUNK;
      chunks.push(rest.slice(0, at).trim());
      rest = rest.slice(at).trim();
    }
    if (rest) chunks.push(rest);
  }
  return chunks;
}

export class BrowserSpeechProvider implements NarrationProvider {
  readonly kind = 'speech' as const;
  readonly supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  private voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;
  private chosen = new Map<Lang, SpeechSynthesisVoice>();
  private primed = false;

  constructor() {
    if (this.supported) {
      // Chrome keeps speaking across reloads unless told otherwise.
      window.speechSynthesis.cancel();
      window.addEventListener('pagehide', () => window.speechSynthesis.cancel());
    }
  }

  private voices(): Promise<SpeechSynthesisVoice[]> {
    if (!this.supported) return Promise.resolve([]);
    const now = window.speechSynthesis.getVoices();
    if (now.length) return Promise.resolve(now);
    this.voicesPromise ??= new Promise<SpeechSynthesisVoice[]>((resolve) => {
      const done = () => resolve(window.speechSynthesis.getVoices());
      window.speechSynthesis.addEventListener('voiceschanged', done, { once: true });
      window.setTimeout(done, 1500);
    }).then((v) => {
      if (!v.length) this.voicesPromise = null; // try again next time
      return v;
    });
    return this.voicesPromise;
  }

  private pick(voices: SpeechSynthesisVoice[], lang: Lang): SpeechSynthesisVoice | null {
    const cfg = langConfig(lang);
    const prefs = [cfg.speechLang, ...cfg.speechFallbacks].map((p) => p.toLowerCase());
    let best: SpeechSynthesisVoice | null = null;
    let bestScore = -1;
    for (const v of voices) {
      const vl = v.lang.toLowerCase().replace('_', '-');
      const idx = prefs.findIndex((p) => vl === p || vl.startsWith(`${p}-`) || (p.length === 2 && vl.startsWith(p)));
      if (idx < 0) continue;
      let score = 100 - idx * 10;
      if (/natural|neural|online|enhanced|premium/i.test(v.name)) score += 8;
      if (/google/i.test(v.name)) score += 4;
      if (v.default) score += 1;
      if (score > bestScore) {
        best = v;
        bestScore = score;
      }
    }
    return best;
  }

  prime(): void {
    if (!this.supported || this.primed) return;
    this.primed = true;
    // An empty utterance inside the click unlocks speech on iOS Safari.
    const u = new SpeechSynthesisUtterance('');
    u.volume = 0;
    window.speechSynthesis.speak(u);
  }

  async canPlay(req: NarrationRequest): Promise<boolean> {
    if (!this.supported) return false;
    const voice = this.pick(await this.voices(), req.lang);
    if (voice) this.chosen.set(req.lang, voice);
    return !!voice;
  }

  describe(req: NarrationRequest): string {
    const v = this.chosen.get(req.lang);
    return v ? `Browser voice · ${v.name}` : 'Browser voice';
  }

  start(req: NarrationRequest, initialVolume: number, ev: PlaybackEvents): PlaybackHandle {
    const synth = window.speechSynthesis;
    const voice = this.chosen.get(req.lang) ?? null;
    const rate = siteConfig.narration.speechRate;
    const cps = CHARS_PER_SECOND * rate;
    const chunks = splitIntoChunks(req.text);
    const offsets: number[] = [];
    let total = 0;
    for (const c of chunks) {
      offsets.push(total);
      total += c.length + 1;
    }
    const duration = total / cps;

    let volume = initialVolume;
    let idx = 0;
    let boundary = 0; // char offset inside the current chunk at the last boundary event
    let boundaryAt = 0; // performance.now() of that boundary
    let gen = 0;
    let speaking = false;
    let done = false;
    let ticker = 0;
    let volumeTimer = 0;

    const position = () => {
      const chunkLen = chunks[idx]?.length ?? 0;
      const sinceBoundary = speaking ? ((performance.now() - boundaryAt) / 1000) * cps : 0;
      return (offsets[idx] ?? total) + Math.min(chunkLen, boundary + sinceBoundary);
    };
    const report = () => {
      const pos = Math.min(position(), total);
      ev.onProgress(pos / total, pos / cps, duration);
    };
    const startTicker = () => {
      window.clearInterval(ticker);
      ticker = window.setInterval(report, 250);
    };
    const stopTicker = () => window.clearInterval(ticker);
    const wordStart = (i: number, at: number) => {
      const before = chunks[i].slice(0, at);
      const sp = before.lastIndexOf(' ');
      return sp < 0 ? 0 : sp + 1;
    };

    const speakFrom = (i: number, offset: number) => {
      const my = ++gen;
      synth.cancel();
      idx = i;
      boundary = offset;
      boundaryAt = performance.now();
      const u = new SpeechSynthesisUtterance(chunks[i].slice(offset));
      if (voice) u.voice = voice;
      u.lang = voice?.lang ?? langConfig(req.lang).speechLang;
      u.rate = rate;
      u.volume = volume;
      u.onstart = () => {
        if (my !== gen) return;
        speaking = true;
        boundaryAt = performance.now();
        ev.onPlaying();
        startTicker();
      };
      u.onboundary = (e) => {
        if (my !== gen) return;
        boundary = offset + e.charIndex;
        boundaryAt = performance.now();
      };
      u.onend = () => {
        if (my !== gen) return;
        speaking = false;
        if (i + 1 < chunks.length) {
          speakFrom(i + 1, 0);
        } else {
          done = true;
          stopTicker();
          ev.onProgress(1, duration, duration);
          ev.onEnded();
        }
      };
      u.onerror = (e) => {
        if (my !== gen || e.error === 'interrupted' || e.error === 'canceled') return;
        done = true;
        speaking = false;
        stopTicker();
        ev.onError(
          new Error(e.error === 'not-allowed' ? 'The browser blocked speech. Click play to try again.' : `Speech failed (${e.error}).`),
        );
      };
      synth.speak(u);
    };

    const halt = () => {
      gen++;
      speaking = false;
      stopTicker();
      window.clearTimeout(volumeTimer);
      synth.cancel();
    };

    speakFrom(0, 0);

    return {
      seekable: true,
      estimated: true,
      pause: () => {
        if (done) return;
        boundary = wordStart(idx, Math.min(position() - offsets[idx], chunks[idx].length));
        halt();
        report();
      },
      resume: () => {
        if (!done) speakFrom(idx, boundary);
      },
      stop: () => {
        done = true;
        halt();
      },
      setVolume: (v) => {
        volume = v;
        if (!speaking || done) return;
        // Utterance volume is fixed once speaking starts; restart from the current word.
        window.clearTimeout(volumeTimer);
        volumeTimer = window.setTimeout(() => {
          if (speaking && !done) speakFrom(idx, wordStart(idx, Math.min(position() - offsets[idx], chunks[idx].length)));
        }, 300);
      },
      seek: (f) => {
        if (done) return;
        const target = f * total;
        let i = 0;
        while (i + 1 < chunks.length && offsets[i + 1] <= target) i++;
        if (speaking) speakFrom(i, 0);
        else {
          idx = i;
          boundary = 0;
          report();
        }
      },
    };
  }
}

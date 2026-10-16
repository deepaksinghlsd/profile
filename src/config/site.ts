// Site-wide configuration for narration, music and the guided tour.
// Node-safe (no import.meta / DOM), so the narration generator can import it.

import type { SectionId } from '../data/types.ts';

export type Lang = 'en' | 'hi';

export interface LangConfig {
  id: Lang;
  label: string;
  short: string;
  /** BCP-47 tag used to pick a browser voice and as the provider language. */
  speechLang: string;
  /** Other acceptable browser voice language prefixes, best first. */
  speechFallbacks: string[];
}

export const siteConfig = {
  narration: {
    defaultLang: 'en' as Lang,
    languages: [
      { id: 'en', label: 'English', short: 'EN', speechLang: 'en-IN', speechFallbacks: ['en-GB', 'en-US', 'en'] },
      { id: 'hi', label: 'हिन्दी / Hinglish', short: 'हिं', speechLang: 'hi-IN', speechFallbacks: ['hi'] },
    ] satisfies LangConfig[],
    /** Browser speech rate (1 = normal). */
    speechRate: 1,
    /** Use pre-generated audio files from public/audio/narration when they match the text. */
    usePreGenerated: true,
    /** Allow the browser's built-in speech synthesis as a free fallback. */
    useBrowserSpeech: true,
  },

  music: {
    /** Music never starts on its own; the visitor has to switch it on. */
    enabledByDefault: false,
    defaultVolume: 0.35,
    /** Music volume multiplier while narration is playing. */
    duckTo: 0.25,
    /**
     * 'synth' = an ambient pad generated live with the Web Audio API (no
     * recorded track, so no licensing question). To use a licensed track
     * instead, put it in public/audio/music/ and switch to:
     *   { type: 'file', src: 'audio/music/your-track.mp3', title: '...', credit: '...' }
     */
    source: {
      type: 'synth',
      title: 'Ambient pad',
      credit: 'Generated live in your browser with the Web Audio API. No recorded track.',
    } as { type: 'synth'; title: string; credit: string } | { type: 'file'; src: string; title: string; credit: string },
  },

  tour: {
    order: ['home', 'about', 'skills', 'projects', 'experience', 'education', 'ai-workflow', 'contact'] as SectionId[],
    /** Pause after scrolling before narration starts, in ms. */
    settleMs: 650,
    /** Silent mode (no narration available): reading speed and time bounds per step. */
    silentWordsPerSecond: 3.2,
    silentMinSeconds: 7,
    silentMaxSeconds: 30,
  },
};

export const langConfig = (id: Lang): LangConfig =>
  siteConfig.narration.languages.find((l) => l.id === id) ?? siteConfig.narration.languages[0];

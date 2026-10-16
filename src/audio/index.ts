import { useSyncExternalStore } from 'react';
import { siteConfig } from '../config/site';
import { NarrationController } from './controller';
import { MusicController } from './music';
import { BrowserSpeechProvider } from './providers/browserSpeech';
import { StaticFileProvider } from './providers/staticFile';
import type { NarrationProvider } from './types';

const base = import.meta.env.BASE_URL;

// Provider order = preference order. Pre-generated files (high-quality TTS
// made at build time, no secrets in the browser) first, then the visitor's
// built-in browser voice as a free fallback.
const fileProvider = new StaticFileProvider(base);
const providers: NarrationProvider[] = [];
if (siteConfig.narration.usePreGenerated) providers.push(fileProvider);
if (siteConfig.narration.useBrowserSpeech) providers.push(new BrowserSpeechProvider());

export const narration = new NarrationController(providers);
export const music = new MusicController(base);

// Warm the manifest so the first click starts quickly.
void fileProvider.loadManifest();

// Dip the music while narration is playing.
narration.subscribe(() => {
  const { status } = narration.getState();
  music.setDucked(status === 'playing' || status === 'loading');
});

export const useNarration = () => useSyncExternalStore(narration.subscribe, narration.getState, narration.getState);
export const useMusic = () => useSyncExternalStore(music.subscribe, music.getState, music.getState);

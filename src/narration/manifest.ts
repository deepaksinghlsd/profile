import type { SectionId } from '../data/types.ts';
import type { Lang } from '../config/site.ts';

/** Shape of public/audio/narration/manifest.json, written by scripts/generate-narration.ts. */
export interface NarrationManifestEntry {
  /** Path relative to the manifest, e.g. "en/home.mp3". */
  file: string;
  /** textHash() of the narration text the file was generated from. */
  hash: string;
  provider: string;
  voice: string;
  chars: number;
  bytes: number;
  generatedAt: string;
}

export interface NarrationManifest {
  version: 1;
  entries: Partial<Record<`${Lang}/${SectionId}`, NarrationManifestEntry>>;
}

export const MANIFEST_PATH = 'audio/narration/manifest.json';

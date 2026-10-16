import type { Lang } from '../config/site';

export interface AudioPrefs {
  lang?: Lang;
  volume?: number;
  muted?: boolean;
  musicVolume?: number;
}

const KEY = 'dks-audio-prefs';

// Per-visitor conveniences only. Storage can be missing or throw (private
// mode, blocked site data), so every access is guarded and optional.
export function readPrefs(): AudioPrefs {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AudioPrefs) : {};
  } catch {
    return {};
  }
}

export function writePrefs(patch: AudioPrefs) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...readPrefs(), ...patch }));
  } catch {
    /* ignore */
  }
}

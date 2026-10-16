import {
  AlertCircle,
  Headphones,
  Loader2,
  Music2,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Square,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { music, narration, useMusic, useNarration } from '../audio';
import { siteConfig } from '../config/site';
import { portfolio } from '../data/portfolio';
import { asset } from '../lib/asset';
import { buildNarration } from '../narration/scripts';
import { sectionLabel } from '../narration/sections';
import { tour, useTour } from '../tour/tour';
import { Wave } from './Wave';

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

const iconBtn =
  'grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-ink-100 transition hover:border-neon/50 hover:text-neon disabled:cursor-not-allowed disabled:opacity-40';

export function AudioDock() {
  const n = useNarration();
  const m = useMusic();
  const t = useTour();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const ids = { panel: useId(), vol: useId(), musicVol: useId(), pos: useId() };

  // Open the dock when a tour starts so its controls are visible.
  useEffect(() => {
    if (t.active) setOpen(true);
  }, [t.active]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && panelRef.current?.contains(document.activeElement)) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const playing = n.status === 'playing';
  const busy = n.status === 'loading';
  const current = n.section ? sectionLabel(n.section) : null;
  const stepId = t.steps[t.index];
  const tourPaused = t.status === 'paused' || (t.mode === 'audio' && n.status === 'paused');

  const announce = t.active
    ? t.status === 'finished'
      ? 'Guided tour complete.'
      : `Guided tour, step ${t.index + 1} of ${t.steps.length}: ${sectionLabel(stepId)}${tourPaused ? ', paused' : ''}.`
    : playing && current
      ? `Playing narration: ${current}.`
      : n.status === 'paused' && current
        ? `Narration paused: ${current}.`
        : '';

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      <div
        ref={panelRef}
        id={ids.panel}
        hidden={!open}
        role="region"
        aria-label="Audio guide"
        className="fixed inset-x-3 bottom-[76px] z-50 max-h-[calc(100svh-150px)] overflow-y-auto rounded-2xl border border-white/10 bg-ink-900/95 p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,.9)] backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:w-[380px]"
      >
        <div className="flex items-start gap-3">
          <img src={asset('images/avatar.webp')} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover ring-2 ring-neon/60" />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-white">Audio guide</p>
            <p className="text-xs text-ink-400">AI-generated voice · not {portfolio.personal.firstName}'s real voice</p>
          </div>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-lg text-ink-300 hover:text-white" onClick={() => setOpen(false)} aria-label="Close audio guide">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Guided tour */}
        <div className="mt-4 rounded-xl border border-neon/20 bg-neon/[0.04] p-3">
          {!t.active ? (
            <button type="button" className="btn-primary w-full" onClick={() => void tour.start()}>
              <Headphones className="h-4 w-4" aria-hidden="true" />
              Take the guided tour
            </button>
          ) : t.status === 'finished' ? (
            <div>
              <p className="text-sm font-semibold text-white">Tour complete. Thanks for listening!</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" className="btn-ghost !min-h-[40px] !py-2 text-sm" onClick={() => void tour.start()}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" /> Restart
                </button>
                <button type="button" className="btn-ghost !min-h-[40px] !py-2 text-sm" onClick={() => tour.exit()}>
                  <X className="h-4 w-4" aria-hidden="true" /> Close tour
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">
                  Guided tour <span className="font-normal text-ink-300">· {t.index + 1}/{t.steps.length}</span>
                </p>
                <p className="truncate text-sm text-neon">{sectionLabel(stepId)}</p>
              </div>
              <div className="mt-2.5 flex gap-1" aria-hidden="true">
                {t.steps.map((s, i) => (
                  <span key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-full origin-left bg-neon transition-transform"
                      style={{
                        transform: `scaleX(${
                          i < t.index ? 1 : i > t.index ? 0 : t.mode === 'audio' ? (n.section === s ? n.progress : 0) : t.stepProgress
                        })`,
                      }}
                    />
                  </span>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className="btn-ghost !min-h-[40px] !px-2 !py-2 text-sm"
                  onClick={() => (tourPaused ? tour.resume() : tour.pause())}
                  disabled={t.status === 'starting'}
                >
                  {tourPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
                  {tourPaused ? 'Resume' : 'Pause'}
                </button>
                <button type="button" className="btn-ghost !min-h-[40px] !px-2 !py-2 text-sm" onClick={() => tour.skip()} disabled={t.status === 'starting'}>
                  <SkipForward className="h-4 w-4" aria-hidden="true" /> Skip
                </button>
                <button type="button" className="btn-ghost !min-h-[40px] !px-2 !py-2 text-sm" onClick={() => tour.exit()}>
                  <X className="h-4 w-4" aria-hidden="true" /> Exit
                </button>
              </div>
              {t.notice && <p className="mt-2.5 text-xs leading-relaxed text-amber-300/90">{t.notice}</p>}
              {t.mode === 'silent' && (
                <p lang={n.lang} className="mt-3 max-h-36 overflow-y-auto rounded-lg bg-black/30 p-3 text-sm leading-relaxed text-ink-200">
                  {buildNarration(stepId, n.lang)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Now playing */}
        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="min-w-0 truncate text-sm font-semibold text-white">
              {current ?? 'Nothing playing yet'}
              {n.status === 'paused' && <span className="font-normal text-ink-400"> · paused</span>}
            </p>
            <p className="shrink-0 font-mono text-[11px] text-ink-400">
              {fmt(n.elapsed)} / {n.estimated ? '≈' : ''}
              {fmt(n.duration)}
            </p>
          </div>
          {n.sourceLabel && <p className="mt-0.5 truncate text-xs text-ink-400">{n.sourceLabel}</p>}
          <label htmlFor={ids.pos} className="sr-only">
            Narration position
          </label>
          <input
            id={ids.pos}
            type="range"
            min={0}
            max={1000}
            value={Math.round(n.progress * 1000)}
            disabled={!n.seekable || !n.section || n.status === 'idle' || n.status === 'error'}
            onChange={(e) => narration.seek(Number(e.target.value) / 1000)}
            aria-valuetext={`${Math.round(n.progress * 100)}%`}
            className="range mt-3 disabled:cursor-default disabled:opacity-50"
          />
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              className={`${iconBtn} !border-neon/40 !bg-neon !text-ink-950 hover:!bg-neon-soft`}
              onClick={() => (n.section ? narration.toggle(n.section) : void narration.play('home'))}
              aria-label={playing || busy ? 'Pause narration' : n.section ? 'Play narration' : 'Play introduction'}
            >
              {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </button>
            <button type="button" className={iconBtn} onClick={() => narration.stop()} disabled={n.status === 'idle' || n.status === 'error'} aria-label="Stop narration">
              <Square className="h-4 w-4 fill-current" />
            </button>
            <button type="button" className={iconBtn} onClick={() => narration.replay()} disabled={!n.section} aria-label="Replay from the start">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button type="button" className={iconBtn} onClick={() => narration.toggleMute()} aria-pressed={n.muted} aria-label={n.muted ? 'Unmute narration' : 'Mute narration'}>
              {n.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <label htmlFor={ids.vol} className="sr-only">
              Narration volume
            </label>
            <input
              id={ids.vol}
              type="range"
              min={0}
              max={100}
              value={Math.round((n.muted ? 0 : n.volume) * 100)}
              onChange={(e) => narration.setVolume(Number(e.target.value) / 100)}
              className="range min-w-0 flex-1"
            />
          </div>
          {n.notice && <p className="mt-2.5 text-xs text-ink-300">{n.notice}</p>}
          {n.status === 'error' && n.error && (
            <p role="alert" className="mt-2.5 flex gap-2 text-xs leading-relaxed text-amber-300/90">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {n.error}
            </p>
          )}
        </div>

        {/* Language */}
        <fieldset className="mt-4">
          <legend className="text-xs font-medium uppercase tracking-[0.16em] text-ink-400">Narration language</legend>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl border border-white/10 p-1">
            {siteConfig.narration.languages.map((l) => (
              <button
                key={l.id}
                type="button"
                lang={l.id}
                aria-pressed={n.lang === l.id}
                onClick={() => narration.setLang(l.id)}
                className={`min-h-[40px] rounded-lg text-sm font-semibold transition ${
                  n.lang === l.id ? 'bg-neon text-ink-950' : 'text-ink-200 hover:bg-white/5'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Music */}
        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-white">
              <Music2 className="h-4 w-4 text-neon" aria-hidden="true" />
              Background music
            </p>
            <button
              type="button"
              role="switch"
              aria-checked={m.enabled}
              onClick={() => music.toggle()}
              className={`relative h-7 w-12 rounded-full border transition ${m.enabled ? 'border-neon bg-neon/80' : 'border-white/15 bg-white/10'}`}
            >
              <span className="sr-only">Background music</span>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${m.enabled ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
          <label htmlFor={ids.musicVol} className="sr-only">
            Music volume
          </label>
          <input
            id={ids.musicVol}
            type="range"
            min={0}
            max={100}
            value={Math.round(m.volume * 100)}
            disabled={!m.enabled}
            onChange={(e) => music.setVolume(Number(e.target.value) / 100)}
            className="range mt-3 disabled:opacity-40"
          />
          <p className="mt-2 text-[11px] leading-relaxed text-ink-400">
            {m.title}: {m.credit} Dips automatically while narration plays.
          </p>
          {m.status === 'error' && m.error && <p className="mt-1 text-xs text-amber-300/90">{m.error}</p>}
        </div>
      </div>

      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={ids.panel}
        aria-label={open ? 'Close audio guide' : 'Open audio guide'}
        className="fixed bottom-4 right-3 z-50 inline-flex min-h-[48px] max-w-[calc(100vw-24px)] items-center gap-2.5 rounded-full border border-neon/30 bg-ink-900/90 p-2 sm:pr-4 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,.9)] backdrop-blur-xl transition hover:border-neon/70 sm:right-5"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neon text-ink-950">
          {playing ? <Wave /> : busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Headphones className="h-4 w-4" />}
        </span>
        <span className={`truncate ${t.active && t.status !== 'finished' ? 'pr-2 sm:pr-0' : 'hidden sm:inline'}`} aria-hidden="true">
          {t.active && t.status !== 'finished' ? `Tour ${t.index + 1}/${t.steps.length}` : playing || n.status === 'paused' ? current : 'Audio guide'}
        </span>
      </button>
    </>
  );
}

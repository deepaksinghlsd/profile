import { AlertCircle, FileText, Loader2, Pause, Play } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { narration, useNarration } from '../audio';
import type { SectionId } from '../data/types';
import { buildNarration } from '../narration/scripts';
import { Wave } from './Wave';

interface Props {
  section: SectionId;
  label?: string;
  className?: string;
}

/** "Listen to this section" control plus a toggleable transcript of exactly what is spoken. */
export function SectionNarration({ section, label = 'Listen to this section', className = '' }: Props) {
  const n = useNarration();
  const isThis = n.section === section;
  const status = isThis ? n.status : 'idle';
  const [open, setOpen] = useState(false);
  const text = useMemo(() => buildNarration(section, n.lang), [section, n.lang]);
  const panelId = `transcript-${section}`;

  // If narration fails here, open the transcript so the content is still reachable.
  useEffect(() => {
    if (isThis && n.status === 'error') setOpen(true);
  }, [isThis, n.status]);

  const button = {
    idle: { icon: <Play className="h-4 w-4 fill-current" />, text: label },
    loading: { icon: <Loader2 className="h-4 w-4 animate-spin" />, text: 'Preparing audio…' },
    playing: { icon: <Pause className="h-4 w-4 fill-current" />, text: 'Pause narration' },
    paused: { icon: <Play className="h-4 w-4 fill-current" />, text: 'Resume narration' },
    error: { icon: <AlertCircle className="h-4 w-4" />, text: 'Try narration again' },
  }[status];

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => narration.toggle(section)}
          className="group relative inline-flex min-h-[40px] items-center gap-2.5 overflow-hidden rounded-full border border-neon/30 bg-neon/[0.06] py-2 pl-2 pr-4 text-sm font-semibold text-neon transition hover:border-neon/60 hover:bg-neon/10"
          aria-pressed={status === 'playing'}
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-neon text-ink-950">{button.icon}</span>
          <span>{button.text}</span>
          {status === 'playing' && <Wave className="ml-1" />}
          {isThis && (status === 'playing' || status === 'paused') && (
            <span
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-neon"
              style={{ transform: `scaleX(${n.progress})` }}
              aria-hidden="true"
            />
          )}
        </button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-full px-3 py-2 text-sm text-ink-300 transition hover:text-white"
        >
          <FileText className="h-4 w-4" />
          {open ? 'Hide transcript' : 'Transcript'}
        </button>
      </div>
      {isThis && n.status === 'error' && n.error && (
        <p role="status" className="mt-2 text-sm text-amber-300/90">
          {n.error}
        </p>
      )}
      <div
        id={panelId}
        hidden={!open}
        lang={n.lang}
        className="mt-3 max-w-2xl rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-ink-200"
      >
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">
          Narration transcript · synthetic voice
        </p>
        {text}
      </div>
    </div>
  );
}

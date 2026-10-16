import type { ReactNode } from 'react';
import type { SectionId } from '../data/types';
import { SectionNarration } from './SectionNarration';

interface Props {
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  section: SectionId;
  className?: string;
}

export function SectionHeader({ index, eyebrow, title, intro, section, className = '' }: Props) {
  return (
    <header className={className}>
      <p className="eyebrow" data-reveal>
        <span className="h-px w-8 bg-neon" aria-hidden="true" />
        <span>
          {index} — {eyebrow}
        </span>
      </p>
      <h2 id={`${section}-title`} className="section-title mt-5 max-w-4xl" data-reveal>
        {title}
      </h2>
      {intro && (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg" data-reveal>
          {intro}
        </p>
      )}
      <div data-reveal>
        <SectionNarration section={section} className="mt-7" />
      </div>
    </header>
  );
}

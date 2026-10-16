import type { SectionId } from '../data/types.ts';

export interface SectionMeta {
  id: SectionId;
  /** Label in the navbar; null = not linked from the navbar. */
  nav: string | null;
  /** Human label used by the audio player and tour. */
  label: string;
}

/** Page order. The guided tour follows this order too. */
export const SECTIONS: SectionMeta[] = [
  { id: 'home', nav: null, label: 'Introduction' },
  { id: 'about', nav: 'About', label: 'About me' },
  { id: 'skills', nav: 'Skills', label: 'Skills' },
  { id: 'projects', nav: 'Projects', label: 'Projects' },
  { id: 'experience', nav: 'Journey', label: 'Experience' },
  { id: 'education', nav: null, label: 'Education' },
  { id: 'ai-workflow', nav: 'AI Workflow', label: 'AI tools & workflow' },
  { id: 'contact', nav: 'Contact', label: 'Contact' },
];

export const sectionLabel = (id: SectionId) => SECTIONS.find((s) => s.id === id)?.label ?? id;

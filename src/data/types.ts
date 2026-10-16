// Shared content types. Kept free of React/browser imports so the narration
// generator (scripts/generate-narration.ts) can load the same data in Node.

export type SectionId =
  | 'home'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'ai-workflow'
  | 'contact';

/** Year-month string, e.g. "2024-10". */
export type YearMonth = `${number}-${number}`;

/** Keys understood by components/TechIcon.tsx. */
export type IconKey =
  | 'react'
  | 'typescript'
  | 'javascript'
  | 'nodejs'
  | 'express'
  | 'mongodb'
  | 'postgresql'
  | 'mysql'
  | 'docker'
  | 'tailwind'
  | 'html5'
  | 'css'
  | 'shadcn'
  | 'reactquery'
  | 'redux'
  | 'drizzle'
  | 'socketio'
  | 'googlecloud'
  | 'git'
  | 'github'
  | 'githubactions'
  | 'elevenlabs'
  | 'axios'
  | 'jwt'
  | 'vite'
  | 'prisma'
  | 'claude';

export interface Personal {
  /** Full name exactly as on the resume. */
  name: string;
  /** Shorter name for headings and the logo. */
  displayName: string;
  firstName: string;
  role: string;
  /** Short positioning line shown under the hero headline. */
  tagline: string[];
  location: string;
  email: string;
  phone: string;
  /** Resume summary, verbatim. */
  summary: string;
  /** What the work focuses on (from the resume summary). */
  focus: string[];
  coreStack: string[];
  experienceLabel: string;
  /** Hindi version of experienceLabel, for the Hindi/Hinglish narration. */
  experienceLabelHi: string;
  /** Set to null to hide the availability badge. */
  availability: string | null;
  availabilityHi: string | null;
  links: {
    /** null = not on the resume yet; the button stays hidden until set. */
    linkedin: string | null;
    github: string | null;
    website: string | null;
  };
  resume: { href: string; fileName: string };
}

export interface Stat {
  value: string;
  label: string;
  /** Where the number comes from, for maintainers and the title tooltip. */
  source: string;
}

export interface Skill {
  name: string;
  icon?: IconKey;
  /** Qualifier shown after the name, e.g. "familiar". */
  note?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  blurb: string;
  skills: Skill[];
}

export type AiToolIcon = 'antigravity' | 'claude-code' | 'claude' | 'codex';

export interface AiTool {
  id: string;
  name: string;
  maker: string;
  icon: AiToolIcon;
  /** Neutral description of what the tool is. */
  what: string;
  /** The role it plays in this workflow. Edit to match how you actually use it. */
  howIUse: string;
  /** Hindi phrase for the narration: "<tool> का इस्तेमाल <howIUseHi> के लिए होता है". */
  howIUseHi: string;
}

export interface WorkflowStep {
  title: string;
  body: string;
}

export interface Role {
  id: string;
  title: string;
  company: string;
  product?: string;
  location: string;
  start: YearMonth;
  /** null = present */
  end: YearMonth | null;
  type: 'Full-time' | 'Freelance';
  /** One-sentence summary used on cards and in narration. */
  summary: string;
  /** Resume bullets, verbatim. */
  highlights: string[];
  stack: string[];
  website?: string;
}

export type MockupKind = 'voice-dashboard' | 'jobs' | 'payroll' | 'crm' | 'chat' | 'website';

export interface Project {
  id: string;
  name: string;
  tagline: string;
  status: string;
  kind: 'Professional work' | 'Personal project' | 'Freelance';
  context?: string;
  period?: string;
  problem: string;
  solution: string;
  contributions: string[];
  stack: string[];
  mockup: MockupKind;
  /** Optional real screenshot in /public; replaces the illustrative mockup. */
  image?: string;
  links: { live?: string; github?: string };
  /** Only published projects are rendered or narrated. */
  published: boolean;
  /** Where the facts come from. */
  source: string;
}

export interface Education {
  degree: string;
  field: string;
  specialization: string;
  institution: string;
  university: string;
  universitySpoken: string;
  location: string;
  start: string;
  end: string;
}

export interface Portfolio {
  personal: Personal;
  hero: { headline: string; note: string; now: { label: string; value: string } };
  stats: Stat[];
  about: { heading: string; paragraphs: string[]; facts: { label: string; value: string }[] };
  techStrip: { name: string; icon: IconKey }[];
  skillGroups: SkillGroup[];
  aiTools: AiTool[];
  aiWorkflow: { heading: string; intro: string; steps: WorkflowStep[]; principle: string; principleHi: string };
  experience: Role[];
  projects: Project[];
  education: Education[];
  certifications: string[];
}

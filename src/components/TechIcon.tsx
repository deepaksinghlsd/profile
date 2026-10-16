import { Code2, Orbit, SquareTerminal } from 'lucide-react';
import {
  siAxios,
  siClaude,
  siCss,
  siDocker,
  siDrizzle,
  siElevenlabs,
  siExpress,
  siGit,
  siGithub,
  siGithubactions,
  siGooglecloud,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siMongodb,
  siMysql,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siReact,
  siReactquery,
  siRedux,
  siShadcnui,
  siSocketdotio,
  siTailwindcss,
  siTypescript,
  siVite,
  type SimpleIcon,
} from 'simple-icons';
import type { AiToolIcon, IconKey } from '../data/types';

// Brand marks from Simple Icons (CC0). Trademarks belong to their owners.
const ICONS: Record<IconKey, SimpleIcon> = {
  react: siReact,
  typescript: siTypescript,
  javascript: siJavascript,
  nodejs: siNodedotjs,
  express: siExpress,
  mongodb: siMongodb,
  postgresql: siPostgresql,
  mysql: siMysql,
  docker: siDocker,
  tailwind: siTailwindcss,
  html5: siHtml5,
  css: siCss,
  shadcn: siShadcnui,
  reactquery: siReactquery,
  redux: siRedux,
  drizzle: siDrizzle,
  socketio: siSocketdotio,
  googlecloud: siGooglecloud,
  git: siGit,
  github: siGithub,
  githubactions: siGithubactions,
  elevenlabs: siElevenlabs,
  axios: siAxios,
  jwt: siJsonwebtokens,
  vite: siVite,
  prisma: siPrisma,
  claude: siClaude,
};

/** Near-black brand colours vanish on the dark theme; lift them to light grey. */
function displayColor(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum < 0.28 ? '#e8eaed' : `#${hex}`;
}

export function TechIcon({ icon, className = 'h-5 w-5', mono = false }: { icon: IconKey; className?: string; mono?: boolean }) {
  const si = ICONS[icon];
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d={si.path} fill={mono ? 'currentColor' : displayColor(si.hex)} />
    </svg>
  );
}

/**
 * AI tool marks. Claude uses its Simple Icons mark. Simple Icons has no marks
 * for Google Antigravity, Claude Code or OpenAI Codex, so those use neutral
 * Lucide icons in a matching colour.
 */
export function AiIcon({ icon, className = 'h-6 w-6' }: { icon: AiToolIcon; className?: string }) {
  switch (icon) {
    case 'claude':
      return <TechIcon icon="claude" className={className} />;
    case 'claude-code':
      return <SquareTerminal className={className} color="#D97757" aria-hidden="true" />;
    case 'antigravity':
      return <Orbit className={className} color="#8ab4f8" aria-hidden="true" />;
    case 'codex':
      return <Code2 className={className} color="#e8eaed" aria-hidden="true" />;
  }
}

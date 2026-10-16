import { ArrowUp } from 'lucide-react';
import { portfolio } from '../data/portfolio';

export function Footer() {
  const me = portfolio.personal;
  return (
    <footer className="border-t border-white/[0.06] bg-ink-950 pb-24 pt-10 sm:pb-10">
      <div className="container-x flex flex-col gap-6 text-sm text-ink-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-ink-200">
            © {new Date().getFullYear()} {me.name}
          </p>
          <p className="mt-1">Built with React, TypeScript, Tailwind CSS and GSAP.</p>
          <p className="mt-1">Narration uses an AI-generated synthetic voice. It is not {me.firstName}'s own voice.</p>
        </div>
        <a href="#home" className="inline-flex min-h-[44px] items-center gap-2 self-start font-semibold text-ink-200 hover:text-neon md:self-auto">
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
          Back to top
        </a>
      </div>
    </footer>
  );
}

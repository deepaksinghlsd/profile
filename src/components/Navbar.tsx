import { Code2, Headphones, Menu, MessageSquareText, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useActiveSection } from '../animation/useActiveSection';
import { portfolio } from '../data/portfolio';
import { SECTIONS } from '../narration/sections';
import { tour } from '../tour/tour';

const NAV = SECTIONS.filter((s) => s.nav);

export function Navbar() {
  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const active = useActiveSection(ids);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [first, ...rest] = portfolio.personal.displayName.toUpperCase().split(' ');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Education sits under "Journey" in the nav.
  const navActive = active === 'education' ? 'experience' : active;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-[var(--nav-h)] items-center justify-between gap-4" aria-label="Main">
        <a href="#home" className="flex items-center gap-3 text-lg font-extrabold tracking-wide text-white sm:text-xl">
          <Code2 className="h-6 w-6 text-neon" aria-hidden="true" />
          <span>
            {first} <span className="text-neon">{rest.join(' ')}</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={navActive === s.id ? 'true' : undefined}
                className={`relative rounded-lg px-4 py-2 text-[15px] font-medium transition ${
                  navActive === s.id ? 'text-white' : 'text-ink-300 hover:text-white'
                }`}
              >
                {s.nav}
                <span
                  className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-neon transition-transform duration-300 ${
                    navActive === s.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void tour.start()}
            className="hidden min-h-[44px] items-center gap-2 rounded-xl px-3 text-sm font-semibold text-ink-200 transition hover:text-neon md:inline-flex"
          >
            <Headphones className="h-4 w-4" aria-hidden="true" />
            Guided tour
          </button>
          <a href="#contact" className="btn-outline hidden !min-h-[44px] !py-2 sm:inline-flex">
            <MessageSquareText className="h-4 w-4" aria-hidden="true" />
            Let's Talk
          </a>
          <button
            ref={menuButton}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" hidden={!open} className="border-t border-white/[0.06] lg:hidden">
        <ul className="container-x grid gap-1 py-4">
          {NAV.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                aria-current={navActive === s.id ? 'true' : undefined}
                className={`flex min-h-[48px] items-center rounded-xl px-4 text-base font-medium ${
                  navActive === s.id ? 'bg-white/5 text-neon' : 'text-ink-100'
                }`}
              >
                {s.nav}
              </a>
            </li>
          ))}
          <li className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setOpen(false);
                void tour.start();
              }}
            >
              <Headphones className="h-4 w-4" aria-hidden="true" />
              Guided tour
            </button>
            <a href="#contact" className="btn-primary" onClick={() => setOpen(false)}>
              Let's Talk
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

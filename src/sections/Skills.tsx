import { ArrowDownRight } from 'lucide-react';
import { useRef } from 'react';
import { gsap, revealOnScroll, ScrollTrigger, useMotion } from '../animation/gsap';
import { SectionHeader } from '../components/SectionHeader';
import { AiIcon, TechIcon } from '../components/TechIcon';
import { portfolio } from '../data/portfolio';

export function Skills() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ q }) => {
    revealOnScroll(q('header [data-reveal]'));
    const cards = q('[data-skill-card]');
    gsap.set(cards, { opacity: 0, y: 40 });
    cards.forEach((card) => gsap.set(card.querySelectorAll('[data-chip]'), { opacity: 0, scale: 0.85 }));
    ScrollTrigger.batch(cards, {
      start: 'top 90%',
      once: true,
      onEnter: (els) => {
        gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 });
        els.forEach((card, i) =>
          gsap.to(card.querySelectorAll('[data-chip]'), {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(2)',
            stagger: 0.035,
            delay: 0.25 + i * 0.08,
          }),
        );
      },
    });
  });

  return (
    <section id="skills" ref={ref} aria-labelledby="skills-title" className="relative border-y border-white/[0.05] bg-ink-900/40 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          index="02"
          eyebrow="Skills"
          section="skills"
          title={
            <>
              Tools of the <span className="text-neon">trade.</span>
            </>
          }
          intro="Technologies from my resume, grouped by where they show up in my work."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {portfolio.skillGroups.map((g, i) => (
            <article key={g.id} data-skill-card className="card group p-5 transition-colors duration-300 hover:border-neon/30 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-white">{g.title}</h3>
                <span className="font-mono text-xs text-ink-400 transition-colors group-hover:text-neon">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="mt-1.5 text-sm text-ink-400">{g.blurb}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <li key={s.name} data-chip className="chip">
                    {s.icon && <TechIcon icon={s.icon} className="h-3.5 w-3.5" />}
                    {s.name}
                    {s.note && <span className="text-ink-400">· {s.note}</span>}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <article
            data-skill-card
            className="rounded-2xl border border-dashed border-neon/30 bg-neon/[0.03] p-5 sm:col-span-2 sm:p-6 xl:col-span-4"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">AI &amp; Developer Productivity Tools</h3>
                <p className="mt-1.5 max-w-md text-sm text-ink-400">Kept separate from the core stack: everyday tools, not credentials.</p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {portfolio.aiTools.map((t) => (
                  <li key={t.id} data-chip className="chip !py-1.5 text-[14px] text-white">
                    <AiIcon icon={t.icon} className="h-4 w-4" />
                    {t.name}
                  </li>
                ))}
              </ul>
              <a href="#ai-workflow" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-neon hover:underline">
                How I use them <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

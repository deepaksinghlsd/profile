import { ChevronDown, ExternalLink, MapPin } from 'lucide-react';
import { useRef, useState } from 'react';
import { gsap, revealOnScroll, ScrollTrigger, useMotion } from '../animation/gsap';
import { SectionHeader } from '../components/SectionHeader';
import { portfolio } from '../data/portfolio';
import type { Role, YearMonth } from '../data/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const parse = (ym: YearMonth) => ym.split('-').map(Number) as [number, number];
const fmt = (ym: YearMonth) => {
  const [y, m] = parse(ym);
  return `${MONTHS[m - 1]} ${y}`;
};

function duration(r: Role) {
  const [sy, sm] = parse(r.start);
  const now = new Date();
  const [ey, em] = r.end ? parse(r.end) : [now.getFullYear(), now.getMonth() + 1];
  const months = (ey - sy) * 12 + (em - sm) + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ');
}

function RoleCard({ r }: { r: Role }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? r.highlights : r.highlights.slice(0, 3);
  const listId = `role-${r.id}-highlights`;
  return (
    <div className="card p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-white sm:text-2xl">{r.title}</h3>
          <p className="mt-1 text-[15px] text-ink-200">
            {r.website ? (
              <a href={r.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-neon">
                {r.company} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : (
              r.company
            )}
            {r.product && <span className="text-ink-400"> · {r.product}</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!r.end && <span className="rounded-full bg-neon px-2.5 py-1 text-xs font-bold text-ink-950">Present</span>}
          <span className="chip !py-0.5 text-xs">{r.type}</span>
        </div>
      </div>
      <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-400">
        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        {r.location}
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-200">{r.summary}</p>
      <ul id={listId} className="mt-4 space-y-2">
        {visible.map((h) => (
          <li key={h} className="relative pl-5 text-[14.5px] leading-relaxed text-ink-300">
            <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-neon/70" aria-hidden="true" />
            {h}
          </li>
        ))}
      </ul>
      {r.highlights.length > 3 && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-controls={listId}
          className="mt-3 inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-neon"
        >
          {expanded ? 'Show less' : `Show all ${r.highlights.length} highlights`}
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      )}
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technology used">
        {r.stack.map((s) => (
          <li key={s} className="chip !text-xs">
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const roles = portfolio.experience;
  const earliest = roles[roles.length - 1];

  useMotion(ref, ({ q }) => {
    revealOnScroll(q('header [data-reveal]'));
    const list = q('[data-timeline]')[0];
    gsap.fromTo(
      q('[data-rail-fill]'),
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 70%', scrub: true } },
    );
    q('[data-role]').forEach((item) => {
      gsap.from(item.querySelector('[data-role-card]'), {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 85%', once: true },
      });
      ScrollTrigger.create({
        trigger: item,
        start: 'top 70%',
        onEnter: () => item.classList.add('is-active'),
        onLeaveBack: () => item.classList.remove('is-active'),
      });
    });
  });

  return (
    <section id="experience" ref={ref} aria-labelledby="experience-title" className="relative border-y border-white/[0.05] bg-ink-900/40 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          index="04"
          eyebrow="Journey"
          section="experience"
          title={
            <>
              Professional <span className="text-neon">journey.</span>
            </>
          }
          intro={`${roles.length} roles since ${fmt(earliest.start)}, most recent first.`}
        />

        <div data-timeline className="relative mt-16">
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10 md:left-[calc(10rem+2.5rem+7px)]" aria-hidden="true">
            <div data-rail-fill className="h-full w-full origin-top bg-gradient-to-b from-neon via-neon/70 to-neon/20" />
          </div>
          <ol className="relative">
          {roles.map((r) => (
            <li key={r.id} data-role className="group relative grid grid-cols-[minmax(0,1fr)] gap-x-10 pb-12 pl-10 last:pb-0 md:grid-cols-[10rem_minmax(0,1fr)] md:pl-0">
              <div className="md:pt-6 md:text-right">
                <p className="font-mono text-xs text-neon">
                  {fmt(r.start)} — {r.end ? fmt(r.end) : 'Present'}
                </p>
                <p className="mt-1 text-xs text-ink-400">{duration(r)}</p>
              </div>
              <span
                className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2 border-neon bg-ink-950 transition-all duration-500 group-[.is-active]:bg-neon group-[.is-active]:shadow-[0_0_18px_#c6f94e] md:left-[calc(10rem+2.5rem)] md:top-7"
                aria-hidden="true"
              />
              <div data-role-card className="mt-3 md:ml-10 md:mt-0">
                <RoleCard r={r} />
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

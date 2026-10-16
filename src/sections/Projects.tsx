import { Building2, Check, ExternalLink, Github } from 'lucide-react';
import { useRef } from 'react';
import { gsap, revealOnScroll, useMotion } from '../animation/gsap';
import { ProjectMockup, ProjectScreenshot } from '../components/ProjectMockup';
import { SectionHeader } from '../components/SectionHeader';
import { publishedProjects } from '../data/portfolio';
import type { Project } from '../data/types';
import { asset } from '../lib/asset';

const host = (url: string) => new URL(url).host;

function StatusBadge({ status }: { status: string }) {
  const live = status === 'Live';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] ${
        live ? 'border-neon/40 bg-neon/10 text-neon' : 'border-white/15 bg-white/[0.04] text-ink-200'
      }`}
    >
      {live && <span className="h-1.5 w-1.5 animate-blink rounded-full bg-neon" aria-hidden="true" />}
      {status}
    </span>
  );
}

function CaseStudy({ p, i }: { p: Project; i: number }) {
  const address = p.links.live ? host(p.links.live) : `${p.name} · illustrative`;
  return (
    <article data-case aria-labelledby={`case-${p.id}`} className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <div data-case-visual className={`relative ${i % 2 ? 'lg:order-2' : ''}`}>
        <div className="absolute -inset-3 -z-10 rounded-[40px] bg-neon/[0.06] blur-3xl sm:-inset-6" aria-hidden="true" />
        {p.image ? (
          <ProjectScreenshot src={asset(p.image)} alt={`Screenshot of ${p.name}`} address={address} />
        ) : (
          <div role="img" aria-label={`Illustrative mockup of ${p.name}, not a screenshot`}>
            <ProjectMockup kind={p.mockup} address={address} />
          </div>
        )}
        <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-ink-950/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-300 backdrop-blur">
          {p.image ? 'Screenshot' : 'Illustrative mockup'}
        </span>
      </div>

      <div data-case-body>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-400">
          <StatusBadge status={p.status} />
          {p.context && (
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              {p.context}
            </span>
          )}
          {p.period && <span className="font-mono text-xs">{p.period}</span>}
        </div>
        <h3 id={`case-${p.id}`} className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="mr-3 align-top font-mono text-sm text-neon">{String(i + 1).padStart(2, '0')}</span>
          {p.name}
        </h3>
        <p className="mt-2 text-lg text-ink-200">{p.tagline}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="card p-4">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-400">Problem</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-200">{p.problem}</p>
          </div>
          <div className="card border-neon/15 p-4">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-neon">Solution</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-200">{p.solution}</p>
          </div>
        </div>

        <h4 className="mt-7 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-300">My contribution</h4>
        <ul className="mt-3 space-y-2.5">
          {p.contributions.map((c) => (
            <li key={c} className="flex gap-3 text-[15px] leading-relaxed text-ink-200">
              <Check className="mt-1 h-4 w-4 shrink-0 text-neon" aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology used">
          {p.stack.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>

        {p.links.live || p.links.github ? (
          <div className="mt-7 flex flex-wrap gap-3">
            {p.links.live && (
              <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="btn-outline !min-h-[42px] !py-2 text-sm">
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Visit {host(p.links.live)}
              </a>
            )}
            {p.links.github && (
              <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="btn-ghost !min-h-[42px] !py-2 text-sm">
                <Github className="h-4 w-4" aria-hidden="true" />
                Source code
              </a>
            )}
          </div>
        ) : (
          p.context && <p className="mt-7 text-sm text-ink-400">Built at {p.context}. No public link listed.</p>
        )}
      </div>
    </article>
  );
}

export function Projects() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ q, isDesktop }) => {
    revealOnScroll(q('header [data-reveal]'));
    q('[data-case]').forEach((el, i) => {
      const visual = el.querySelector('[data-case-visual]');
      const body = el.querySelector('[data-case-body]');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 78%', once: true } });
      tl.fromTo(
        visual,
        { clipPath: 'inset(12% 12% 12% 12% round 28px)', opacity: 0, rotate: i % 2 ? 1.5 : -1.5 },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', opacity: 1, rotate: 0, duration: 1.1, ease: 'power3.out', clearProps: 'clipPath' },
      ).from(body, { opacity: 0, x: isDesktop ? (i % 2 ? -40 : 40) : 0, y: isDesktop ? 0 : 30, duration: 0.9, ease: 'power3.out' }, 0.15);
      if (isDesktop) {
        gsap.to(visual, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
    });
  });

  return (
    <section id="projects" ref={ref} aria-labelledby="projects-title" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          index="03"
          eyebrow="Projects"
          section="projects"
          title={
            <>
              Selected work &amp; <span className="text-neon">case studies.</span>
            </>
          }
          intro="Real projects from my resume. Company products are not public, so their visuals are illustrative mockups rather than screenshots."
        />
        <div className="mt-16 space-y-24 sm:mt-20 sm:space-y-32">
          {publishedProjects.map((p, i) => (
            <CaseStudy key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

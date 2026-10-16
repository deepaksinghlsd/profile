import { ShieldCheck } from 'lucide-react';
import { useRef } from 'react';
import { gsap, revealOnScroll, useMotion } from '../animation/gsap';
import { SectionHeader } from '../components/SectionHeader';
import { AiIcon } from '../components/TechIcon';
import { portfolio } from '../data/portfolio';
import { asset } from '../lib/asset';

export function AiWorkflow() {
  const ref = useRef<HTMLElement>(null);
  const { aiTools, aiWorkflow } = portfolio;

  useMotion(ref, ({ q, isDesktop }) => {
    revealOnScroll(q('[data-reveal]'));
    revealOnScroll(q('[data-tool]'), { y: 50, stagger: 0.1 });
    revealOnScroll(q('[data-step]'), { y: 30, stagger: 0.12 });
    gsap.fromTo(
      q('[data-step-line]'),
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { trigger: q('[data-steps]')[0], start: 'top 80%', end: 'bottom 60%', scrub: true } },
    );
    if (isDesktop) {
      gsap.fromTo(
        q('[data-silhouette]'),
        { yPercent: 8, opacity: 0 },
        { yPercent: -4, opacity: 0.55, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'center center', scrub: true } },
      );
    }
  });

  return (
    <section id="ai-workflow" ref={ref} aria-labelledby="ai-workflow-title" className="relative overflow-hidden border-y border-white/[0.05] bg-ink-900/40 py-24 sm:py-32">
      <img
        data-silhouette
        src={asset('images/portrait-cutout-640.webp')}
        alt=""
        width={640}
        height={960}
        loading="lazy"
        className="silhouette pointer-events-none absolute -right-16 top-24 hidden h-[720px] w-auto opacity-55 lg:block xl:right-0"
      />
      <div className="container-x relative">
        <SectionHeader index="06" eyebrow="AI & Developer Productivity Tools" section="ai-workflow" title={aiWorkflow.heading} intro={aiWorkflow.intro} />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:max-w-[66%]">
          {aiTools.map((t) => (
            <li key={t.id} data-tool className="card group relative overflow-hidden p-6 transition-colors duration-300 hover:border-neon/30">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-neon/0 blur-2xl transition-colors duration-500 group-hover:bg-neon/15" aria-hidden="true" />
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-ink-950/60">
                  <AiIcon icon={t.icon} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{t.name}</h3>
                  <p className="text-xs text-ink-400">by {t.maker}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-300">{t.what}</p>
              <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-neon">How I use it</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-100">{t.howIUse}</p>
            </li>
          ))}
        </ul>

        <div data-steps className="relative mt-16">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-white/10 lg:block" aria-hidden="true">
            <div data-step-line className="h-full origin-left bg-neon/70" />
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aiWorkflow.steps.map((s, i) => (
              <li key={s.title} data-step className="relative">
                <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-neon/40 bg-ink-950 font-mono text-sm font-semibold text-neon">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <p data-reveal className="mt-12 flex max-w-2xl items-start gap-3 rounded-2xl border border-neon/20 bg-neon/[0.04] p-4 text-[15px] text-ink-100">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-neon" aria-hidden="true" />
          {aiWorkflow.principle} These tools are listed as everyday tools, not certifications.
        </p>
      </div>
    </section>
  );
}

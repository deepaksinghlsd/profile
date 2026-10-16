import { ArrowRight, Download, Headphones, TrendingUp } from 'lucide-react';
import { Fragment, useRef } from 'react';
import { gsap, useMotion } from '../animation/gsap';
import { SectionNarration } from '../components/SectionNarration';
import { TechIcon } from '../components/TechIcon';
import { portfolio } from '../data/portfolio';
import { asset } from '../lib/asset';
import { tour } from '../tour/tour';

/** "Building *digital experiences* that..." → words, with *starred* runs accented. */
function headlineWords(text: string) {
  return text.split(/(\*[^*]+\*)/).flatMap((part) => {
    const accent = part.startsWith('*');
    return part
      .replace(/\*/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, accent }));
  });
}

const joinList = (items: string[]) => `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { personal: me, hero, stats, techStrip } = portfolio;

  useMotion(ref, ({ q, isDesktop }) => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(q('[data-portrait]'), { opacity: 0, y: 40, scale: 1.04, duration: 1.3 }, 0)
      .from(q('[data-hero-badge]'), { opacity: 0, y: 14, duration: 0.6 }, 0.15)
      .from(q('[data-word]'), { yPercent: 115, duration: 0.95, stagger: 0.055 }, 0.25)
      .from(q('[data-hero-fade]'), { opacity: 0, y: 22, duration: 0.8, stagger: 0.08 }, 0.7)
      .from(q('[data-hero-float]'), { opacity: 0, x: 24, duration: 0.9, stagger: 0.15 }, 1.0)
      .from(q('[data-strip] li'), { opacity: 0, y: 12, duration: 0.5, stagger: 0.04 }, 1.0);

    const scrub = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to(q('[data-portrait-inner]'), { yPercent: isDesktop ? 9 : 5, ease: 'none', scrollTrigger: scrub });
    gsap.to(q('[data-glow]'), { scale: 1.25, opacity: 0.5, ease: 'none', scrollTrigger: scrub });
    if (isDesktop) gsap.to(q('[data-hero-copy]'), { y: -70, opacity: 0.25, ease: 'none', scrollTrigger: scrub });
  });

  return (
    <section id="home" ref={ref} aria-labelledby="home-title" className="relative isolate overflow-hidden pt-[var(--nav-h)]">
      {/* Backdrop */}
      <div className="grid-bg absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_75%_65%_at_65%_40%,#000_35%,transparent_100%)]" aria-hidden="true" />
      <div className="absolute -right-40 top-10 -z-10 h-[620px] w-[620px] rounded-full bg-neon/[0.07] blur-[140px]" aria-hidden="true" />
      <svg className="absolute bottom-24 left-[35%] -z-10 hidden h-64 w-[55%] lg:block" viewBox="0 0 600 200" fill="none" aria-hidden="true">
        <path d="M0 190 C150 170 230 40 360 60 S520 150 600 20" stroke="url(#hero-line)" strokeWidth="1.5" />
        <defs>
          <linearGradient id="hero-line" x1="0" x2="1">
            <stop stopColor="#c6f94e" stopOpacity="0" />
            <stop offset=".6" stopColor="#c6f94e" stopOpacity=".5" />
            <stop offset="1" stopColor="#c6f94e" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="container-x grid grid-cols-[minmax(0,1fr)] items-end gap-0 lg:min-h-[calc(100svh-var(--nav-h)-92px)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
        {/* Copy */}
        <div data-hero-copy className="relative z-10 -mt-24 pb-12 sm:-mt-28 lg:mt-0 lg:self-center lg:py-6">
          {me.availability && (
            <p
              data-hero-badge
              className="inline-flex items-center gap-2.5 rounded-full border border-neon/25 bg-ink-950/70 px-4 py-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink-100 backdrop-blur sm:text-[11px] sm:tracking-[0.2em]"
            >
              <span className="h-2 w-2 animate-blink rounded-full bg-neon shadow-[0_0_10px_#c6f94e]" aria-hidden="true" />
              {me.availability}
            </p>
          )}

          <h1
            id="home-title"
            className="mt-5 text-[2.55rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white min-[400px]:text-[2.9rem] sm:text-6xl lg:text-[3.75rem] xl:text-[4.3rem]"
          >
            <span className="sr-only">{hero.headline.replace(/\*/g, '')}</span>
            <span aria-hidden="true">
              {headlineWords(hero.headline).map(({ word, accent }, i) => (
                <Fragment key={i}>
                  <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                    <span data-word className={`inline-block ${accent ? 'text-neon' : ''}`}>
                      {word}
                    </span>
                  </span>{' '}
                </Fragment>
              ))}
            </span>
          </h1>

          <p data-hero-fade className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-medium text-white sm:text-lg">
            {me.tagline.map((t, i) => (
              <Fragment key={t}>
                {i > 0 && (
                  <span className="text-neon" aria-hidden="true">
                    •
                  </span>
                )}
                <span>{t}</span>
              </Fragment>
            ))}
          </p>

          <p data-hero-fade className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-300 sm:text-base">
            Hi, I'm {me.displayName}, a software engineer with {me.experienceLabel} of experience building {joinList(me.focus)} with{' '}
            {joinList(me.coreStack)}.
          </p>

          <div data-hero-fade className="mt-7 flex flex-wrap gap-3">
            <a href="#projects" className="btn-primary">
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
              Explore My Work
            </a>
            <a href={asset(me.resume.href)} download={me.resume.fileName} className="btn-outline">
              <Download className="h-5 w-5" aria-hidden="true" />
              Download Resume
            </a>
          </div>

          <div data-hero-fade className="mt-5 flex flex-wrap items-start gap-x-4 gap-y-3">
            <button
              type="button"
              onClick={() => void tour.start()}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white transition hover:border-neon/60 hover:text-neon"
            >
              <Headphones className="h-4 w-4" aria-hidden="true" />
              Take a guided tour
            </button>
            <SectionNarration section="home" label="Listen to intro" />
          </div>

          <dl data-hero-fade className="mt-7 grid max-w-lg grid-cols-3 divide-x divide-white/10">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col px-3 first:pl-0 sm:px-5" title={s.source}>
                <dt className="order-2 mt-1 text-[12px] leading-snug text-ink-300 sm:text-sm">{s.label}</dt>
                <dd className="order-1 text-2xl font-bold text-neon sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Portrait */}
        <div className="relative order-first -mx-4 h-[400px] min-[400px]:h-[440px] sm:mx-0 sm:h-[560px] lg:order-none lg:h-full lg:min-h-[620px] lg:self-stretch">
          {/* The glow stays outside the animated wrapper: Chrome clips a child's blur to an animated layer's bounds. */}
          <div data-glow className="absolute left-1/2 top-[16%] h-[50%] w-[56%] -translate-x-1/2 rounded-full bg-neon/[0.14] blur-[80px]" aria-hidden="true" />
          <div data-portrait className="absolute inset-0">
          <div data-portrait-inner className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_62%,transparent_98%)] lg:[mask-image:linear-gradient(to_bottom,#000_80%,transparent)]">
            <img
              src={asset('images/portrait-cutout-1024.webp')}
              srcSet={`${asset('images/portrait-cutout-640.webp')} 640w, ${asset('images/portrait-cutout-1024.webp')} 1024w`}
              sizes="(min-width: 1024px) 34vw, 70vw"
              alt={`Portrait of ${me.name}`}
              width={1024}
              height={1536}
              fetchPriority="high"
              className="rim-glow absolute bottom-0 left-1/2 h-[104%] w-auto lg:left-[48%] lg:h-[98%] max-w-none -translate-x-1/2 object-contain object-bottom"
            />
          </div>

          <div
            data-hero-float
            className="absolute right-0 top-[4%] hidden items-center gap-4 rounded-2xl border border-white/10 bg-ink-900/70 px-5 py-4 backdrop-blur-md sm:flex lg:right-[-20px] xl:right-[-36px]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10">
              <TrendingUp className="h-5 w-5 text-neon" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-bold text-neon">{hero.now.label.toUpperCase()}</span>
              <span className="block text-[11px] uppercase tracking-[0.16em] text-ink-300">{hero.now.value}</span>
            </span>
          </div>

          <p data-hero-float className="absolute right-[-44px] top-[40%] hidden -rotate-[8deg] font-hand text-[1.6rem] leading-tight text-ink-200 xl:block" aria-hidden="true">
            {hero.note.split(' ').slice(0, 2).join(' ')}
            <br />
            {hero.note.split(' ').slice(2, 4).join(' ')}
            <br />
            {hero.note.split(' ').slice(4).join(' ')}
            <svg viewBox="0 0 160 30" className="mt-1 h-6 w-40 text-neon" fill="none" aria-hidden="true">
              <path d="M2 26 C50 22 110 14 158 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </p>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        className="absolute bottom-36 right-6 hidden flex-col items-center gap-3 text-ink-400 transition hover:text-neon xl:flex"
        aria-label="Scroll to About"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-current pt-1.5">
          <span className="h-2 w-0.5 animate-bounce rounded-full bg-current" />
        </span>
      </a>

      {/* Tech strip */}
      <div className="relative border-y border-white/[0.06] bg-ink-900/70 backdrop-blur">
        <div className="container-x overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] lg:[mask-image:none]">
          <ul data-strip className="flex w-max animate-marquee items-center gap-10 lg:w-full lg:animate-none lg:justify-between lg:gap-4" aria-label="Core technologies">
            {[...techStrip, ...techStrip].map((t, i) => (
              <li
                key={`${t.name}-${i}`}
                aria-hidden={i >= techStrip.length ? 'true' : undefined}
                className={`flex shrink-0 items-center gap-3 text-[15px] font-medium text-ink-100 ${
                  i >= 8 ? 'lg:hidden' : ''
                }`}
              >
                <TechIcon icon={t.icon} className="h-6 w-6" />
                {t.name}
              </li>
            ))}
            <li className="hidden shrink-0 text-sm text-ink-400 lg:block">and more…</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

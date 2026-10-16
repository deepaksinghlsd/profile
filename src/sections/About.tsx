import { MapPin } from 'lucide-react';
import { useRef } from 'react';
import { gsap, revealOnScroll, useMotion } from '../animation/gsap';
import { SectionHeader } from '../components/SectionHeader';
import { portfolio } from '../data/portfolio';
import { asset } from '../lib/asset';

const Corner = ({ className }: { className: string }) => (
  <span className={`absolute h-7 w-7 border-neon ${className}`} aria-hidden="true" />
);

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { about, personal: me } = portfolio;

  useMotion(ref, ({ q }) => {
    revealOnScroll(q('[data-reveal]'));
    const photo = q('[data-about-photo]')[0];
    gsap.fromTo(
      q('[data-about-img]'),
      { filter: 'grayscale(1) contrast(1.1) brightness(0.8)', scale: 1.12 },
      {
        filter: 'grayscale(0.15) contrast(1.05) brightness(1)',
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: photo, start: 'top 85%', end: 'center 45%', scrub: true },
      },
    );
    gsap.fromTo(
      q('[data-scan]'),
      { yPercent: -120 },
      { yPercent: 520, duration: 2.2, ease: 'power2.inOut', scrollTrigger: { trigger: photo, start: 'top 70%', once: true } },
    );
    gsap.from(q('[data-corner-wrap]'), { scale: 1.08, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: photo, start: 'top 80%', once: true } });
  });

  return (
    <section id="about" ref={ref} aria-labelledby="about-title" className="relative py-24 sm:py-32">
      <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <figure data-about-photo className="relative mx-auto w-full max-w-[420px]">
          <div data-corner-wrap className="pointer-events-none absolute -inset-3">
            <Corner className="left-0 top-0 rounded-tl-xl border-l-2 border-t-2" />
            <Corner className="right-0 top-0 rounded-tr-xl border-r-2 border-t-2" />
            <Corner className="bottom-0 left-0 rounded-bl-xl border-b-2 border-l-2" />
            <Corner className="bottom-0 right-0 rounded-br-xl border-b-2 border-r-2" />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border border-white/10 bg-ink-800">
            <img
              data-about-img
              src={asset('images/portrait-face.webp')}
              alt={`Close-up portrait of ${me.name}`}
              width={720}
              height={720}
              loading="lazy"
              className="h-full w-full object-cover object-[50%_35%]"
            />
            <div className="absolute inset-0 bg-neon/[0.07] mix-blend-color" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" aria-hidden="true" />
            <div data-scan className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-neon/20 to-transparent" aria-hidden="true" />
            <figcaption className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink-950/70 px-3 py-1.5 text-xs text-ink-100 backdrop-blur">
              <MapPin className="h-3.5 w-3.5 text-neon" aria-hidden="true" />
              {me.location}
            </figcaption>
          </div>
        </figure>

        <div>
          <SectionHeader index="01" eyebrow="About me" title={about.heading} section="about" />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-200 sm:text-[17px]">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} data-reveal>
                {p}
              </p>
            ))}
          </div>
          <dl className="mt-10 grid gap-3 sm:grid-cols-2">
            {about.facts.map((f) => (
              <div key={f.label} data-reveal className="card flex flex-col px-5 py-4">
                <dt className="order-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-400">{f.label}</dt>
                <dd className="order-2 mt-1.5 font-semibold text-white">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

import { Award, GraduationCap, MapPin } from 'lucide-react';
import { useRef } from 'react';
import { revealOnScroll, useMotion } from '../animation/gsap';
import { SectionHeader } from '../components/SectionHeader';
import { portfolio } from '../data/portfolio';

export function Education() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, ({ q }) => revealOnScroll(q('[data-reveal]')));

  return (
    <section id="education" ref={ref} aria-labelledby="education-title" className="relative py-24 sm:py-32">
      <div className="container-x grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <SectionHeader
          index="05"
          eyebrow="Education"
          section="education"
          title={
            <>
              Foundations in computer science <span className="text-neon">&amp; AI.</span>
            </>
          }
        />
        <div className="space-y-4 lg:pt-14">
          {portfolio.education.map((e) => (
            <article key={e.institution} data-reveal className="card relative overflow-hidden p-6 sm:p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neon/10 blur-3xl" aria-hidden="true" />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-neon/30 bg-neon/10">
                  <GraduationCap className="h-7 w-7 text-neon" aria-hidden="true" />
                </span>
                <p className="font-mono text-2xl font-medium text-white sm:text-3xl">
                  {e.start} <span className="text-neon">—</span> {e.end}
                </p>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-white">
                {e.degree} – {e.field}
              </h3>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/[0.06] px-3 py-1 text-sm font-medium text-neon">
                <Award className="h-4 w-4" aria-hidden="true" />
                {e.specialization} Specialization
              </p>
              <p className="mt-5 text-[17px] font-semibold text-ink-100">{e.institution}</p>
              <p className="mt-1 text-sm text-ink-300">
                {e.university} ({e.universitySpoken})
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink-400">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {e.location}
              </p>
            </article>
          ))}
          {portfolio.certifications.length > 0 && (
            <article data-reveal className="card p-6">
              <h3 className="font-bold text-white">Certifications</h3>
              <ul className="mt-3 space-y-1 text-ink-200">
                {portfolio.certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

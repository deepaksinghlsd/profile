import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '../animation/gsap';

/** Thin progress bar along the top edge showing how far down the page you are. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent" aria-hidden="true">
      <div ref={bar} className="h-full origin-left bg-neon shadow-[0_0_12px_rgba(198,249,78,.7)]" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}

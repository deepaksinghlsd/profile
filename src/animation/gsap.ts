import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, type DependencyList, type RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export interface MotionContext {
  isDesktop: boolean;
  /** Scoped selector: q('.foo') only matches inside the component. */
  q: (selector: string) => HTMLElement[];
}

/**
 * Runs GSAP setup for a component. Animations only run when the visitor has
 * not asked for reduced motion; otherwise the content simply renders static.
 * Everything created inside is reverted (tweens, ScrollTriggers, inline
 * styles) when the component unmounts or the media query changes.
 */
export function useMotion<T extends HTMLElement>(
  scope: RefObject<T | null>,
  setup: (ctx: MotionContext) => void | (() => void),
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);
    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 1024px)' },
      (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;
        return setup({
          isDesktop: desktop,
          q: (selector) => Array.from(root.querySelectorAll<HTMLElement>(selector)),
        });
      },
    );
    return () => mm.revert();
    // Callers pass their own deps, like a regular effect.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Fade/slide in every [data-reveal] element inside the scope as it scrolls
 * into view. Elements reveal once and stay visible.
 */
export function revealOnScroll(targets: HTMLElement[], opts: { y?: number; stagger?: number } = {}) {
  if (!targets.length) return;
  gsap.set(targets, { opacity: 0, y: opts.y ?? 32 });
  ScrollTrigger.batch(targets, {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: opts.stagger ?? 0.08,
        overwrite: true,
      }),
  });
  // Opacity (not visibility) keeps hidden items focusable; reveal at once when tabbed to.
  targets.forEach((el) =>
    el.addEventListener('focusin', () => gsap.to(el, { opacity: 1, y: 0, duration: 0.3, overwrite: true }), { once: true }),
  );
}

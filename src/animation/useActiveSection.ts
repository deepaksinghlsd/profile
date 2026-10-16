import { useEffect, useState } from 'react';
import type { SectionId } from '../data/types';
import { ScrollTrigger } from './gsap';

/** Tracks which section is in the middle of the viewport (for nav highlighting). */
export function useActiveSection(ids: SectionId[]): SectionId {
  const [active, setActive] = useState<SectionId>(ids[0]);

  useEffect(() => {
    const triggers = ids.flatMap((id) => {
      const el = document.getElementById(id);
      if (!el) return [];
      return [
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (self.isActive) setActive(id);
          },
        }),
      ];
    });
    return () => triggers.forEach((t) => t.kill());
  }, [ids]);

  return active;
}

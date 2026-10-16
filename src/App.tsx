import { useEffect } from 'react';
import { ScrollTrigger } from './animation/gsap';
import { AudioDock } from './components/AudioDock';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ScrollProgress } from './components/ScrollProgress';
import { About } from './sections/About';
import { AiWorkflow } from './sections/AiWorkflow';
import { Contact } from './sections/Contact';
import { Education } from './sections/Education';
import { Experience } from './sections/Experience';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';

export default function App() {
  // Fonts and images change layout after first paint; re-measure trigger positions.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    void document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-lg bg-neon px-4 py-2 font-semibold text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <AiWorkflow />
        <Contact />
      </main>
      <Footer />
      <AudioDock />
    </>
  );
}

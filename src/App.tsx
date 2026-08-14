import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Experience } from './sections/Experience';
import { Projects } from './sections/Projects';
import { Education } from './sections/Education';
import { ResumeSection } from './sections/ResumeSection';
import { Contact } from './sections/Contact';
import { Footer } from './components/Footer';

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Default to dark mode as primary theme
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; 
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (darkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 dark:selection:bg-cyan-500/30 overflow-x-hidden relative transition-colors duration-300">
      {/* Background radial overlays */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] max-h-[600px] bg-gradient-to-bl from-blue-500/5 to-transparent blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-0 w-[50vw] h-[50vw] max-h-[600px] bg-gradient-to-tr from-teal-500/5 to-transparent blur-[120px] rounded-full pointer-events-none z-0" />

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <ResumeSection />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;

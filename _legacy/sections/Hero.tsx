import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, Mail } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { SocialLinks } from '../components/SocialLinks';

export const Hero: React.FC = () => {
  const { name, title, subTitle, summary } = portfolioData.personal;

  const handleScrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 glow-spot bg-blue-500/10 dark:bg-blue-500/20" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 glow-spot bg-teal-500/10 dark:bg-teal-500/20" />
      
      {/* Dotted grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl flex flex-col items-start gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-cyan-400 text-xs font-mono font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-450 animate-pulse" />
            Available for Roles
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6.5xl font-extrabold tracking-tight leading-none"
          >
            Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400">{name}</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-200 tracking-tight"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-450 leading-relaxed bg-slate-100/50 dark:bg-slate-900/30 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/40"
          >
            {subTitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            {summary}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3.5 mt-4 w-full sm:w-auto"
          >
            <button
              onClick={() => handleScrollTo('#projects')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white dark:text-slate-950 font-semibold shadow-lg shadow-blue-500/10 dark:shadow-cyan-500/5 transition-all duration-300 hover:-translate-y-0.5"
            >
              View Projects
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="assets/Deepak_Kumar_Singh_Resume.pdf"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-white dark:hover:bg-slate-800/60"
            >
              View Resume
              <FileText className="w-4 h-4" />
            </a>
            <button
              onClick={() => handleScrollTo('#contact')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-blue-500/25 bg-blue-500/5 hover:bg-blue-500/10 text-blue-600 dark:text-cyan-400 font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              Contact Me
              <Mail className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 border-t border-slate-200 dark:border-slate-850/80 pt-6 w-full"
          >
            <SocialLinks />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

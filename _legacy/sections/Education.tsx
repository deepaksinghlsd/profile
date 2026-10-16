import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { GraduationCap, Calendar } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { motion } from 'framer-motion';

export const Education: React.FC = () => {
  const eduList = portfolioData.education;

  return (
    <section id="education" className="py-24 bg-slate-100/30 dark:bg-slate-900/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Education" 
          subtitle="My academic background in Computer Science Engineering." 
        />
        
        <div className="mt-12 space-y-6">
          {eduList.map((edu, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 shadow-sm flex flex-col md:flex-row md:items-center gap-6 group hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300"
            >
              <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">
                    {edu.degree}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
                    <Calendar className="w-3.5 h-3.5" />
                    {edu.period}
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-500 dark:text-cyan-400">
                  {edu.institution}
                </p>
                {edu.university && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Affiliated to {edu.university}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

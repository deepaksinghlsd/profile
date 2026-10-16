import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import type { Experience } from '../../data/portfolio';

interface ExperienceCardProps {
  exp: Experience;
  isLast?: boolean;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ exp, isLast }) => {
  return (
    <div className="flex gap-4 md:gap-6 group relative">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-500 dark:text-cyan-400 z-10 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-cyan-500 dark:group-hover:text-slate-950 transition-all duration-300">
          <Briefcase className="w-5 h-5" />
        </div>
        {!isLast && (
          <div className="w-[2px] grow bg-slate-200 dark:bg-slate-800/80 group-hover:bg-blue-500/30 dark:group-hover:bg-cyan-400/30 transition-colors duration-300 my-2" />
        )}
      </div>
      
      <div className="pb-8 flex-1">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300 relative"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
            <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {exp.role}
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <Calendar className="w-3.5 h-3.5" />
              {exp.period}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">
            <span className="text-blue-500 dark:text-cyan-400 font-semibold">{exp.company}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="flex items-center gap-1 text-xs md:text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {exp.location}
            </span>
          </div>
          
          <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300 list-none pl-0">
            {exp.highlights.map((highlight, idx) => (
              <li key={idx} className="flex gap-2 items-start">
                <span className="text-blue-500 dark:text-cyan-400 font-bold select-none mt-0.5">•</span>
                <span className="leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Layout, Server, Cpu, Globe, Cloud, ShieldCheck } from 'lucide-react';
import type { SkillCategory } from '../../data/portfolio';

const getCategoryIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('programming')) return <Code2 className="w-6 h-6 text-blue-500" />;
  if (t.includes('frontend')) return <Layout className="w-6 h-6 text-teal-400" />;
  if (t.includes('backend')) return <Server className="w-6 h-6 text-indigo-400" />;
  if (t.includes('telephony') || t.includes('ai')) return <Cpu className="w-6 h-6 text-rose-500" />;
  if (t.includes('api') || t.includes('real-time')) return <Globe className="w-6 h-6 text-cyan-400" />;
  if (t.includes('cloud') || t.includes('devops')) return <Cloud className="w-6 h-6 text-orange-400" />;
  if (t.includes('security') || t.includes('authentication')) return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
  return <Code2 className="w-6 h-6 text-slate-400" />;
};

interface SkillCardProps {
  category: SkillCategory;
}

export const SkillCard: React.FC<SkillCardProps> = ({ category }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300 relative group overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:from-blue-500/10 transition-all duration-300" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 group-hover:scale-110 transition-transform duration-300">
          {getCategoryIcon(category.title)}
        </div>
        <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">
          {category.title}
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2 relative z-10">
        {category.skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs font-mono font-medium rounded-lg bg-slate-100/80 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/60 hover:border-blue-500/30 dark:hover:border-cyan-500/30 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-12 text-center">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400">
          {title}
        </span>
      </motion.h2>
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-mono"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-20 h-[3px] bg-gradient-to-r from-blue-500 to-teal-400 mx-auto mt-4 rounded-full origin-center"
      />
    </div>
  );
};

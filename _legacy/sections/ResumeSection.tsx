import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { FileDown, Eye, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResumeSection: React.FC = () => {
  const resumePath = "assets/Deepak_Kumar_Singh_Resume.pdf";

  return (
    <section id="resume" className="py-24 relative overflow-hidden">
      {/* Background glow spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glow-spot bg-blue-500/5 dark:bg-blue-500/10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <SectionHeading 
          title="Resume" 
          subtitle="View or download my comprehensive professional resume." 
        />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 dark:text-cyan-400 flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">
              Deepak_Kumar_Singh_Resume.pdf
            </h3>
            <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-1">
              PDF Document
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <a
              href={resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-200 text-sm"
            >
              <Eye className="w-4 h-4" />
              View Resume
            </a>
            <a
              href={resumePath}
              download="Deepak_Kumar_Singh_Resume.pdf"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white dark:text-slate-950 font-semibold shadow-md dark:shadow-cyan-500/5 hover:shadow-lg transition-all duration-200 text-sm"
            >
              <FileDown className="w-4 h-4" />
              Download Resume
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

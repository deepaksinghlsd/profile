import React from 'react';
import { portfolioData } from '../data/portfolio';

export const Footer: React.FC = () => {
  const { name, title } = portfolioData.personal;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-850/80 bg-slate-100/50 dark:bg-slate-900/10 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-base md:text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            {name}
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
            {title}
          </p>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          &copy; {currentYear} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, FolderGit2 } from 'lucide-react';
import type { Project } from '../../data/portfolio';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between group h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:from-blue-500/10 transition-all duration-300" />
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div className="flex gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200"
                title="View GitHub Code"
                aria-label="View Source Code on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200"
                title="View Live Demo"
                aria-label="View Live Website"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-1 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-xs font-mono text-slate-450 dark:text-slate-500 mb-3">
          {project.subtitle}
        </p>
        <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed mb-4">
          {project.description}
        </p>

        {project.highlights.length > 0 && (
          <ul className="space-y-2 mb-6 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {project.highlights.map((item, index) => (
              <li key={index} className="flex gap-2 items-start">
                <span className="text-blue-500 dark:text-cyan-400 font-bold select-none">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2.5 py-0.5 text-[11px] font-mono rounded bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white dark:text-slate-950 text-xs font-semibold shadow-md dark:shadow-cyan-500/5 transition-all duration-300 hover:shadow-lg"
            >
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-semibold transition-all duration-300"
            >
              Code Source
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

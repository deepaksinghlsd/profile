import React from 'react';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

export const SocialLinks: React.FC = () => {
  const { github, linkedin, email, phone } = portfolioData.personal;

  const links = [
    { href: github, icon: <Github className="w-5 h-5" />, label: "GitHub" },
    { href: linkedin, icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn" },
    { href: `mailto:${email}`, icon: <Mail className="w-5 h-5" />, label: "Email" },
    { href: `tel:${phone}`, icon: <Phone className="w-5 h-5" />, label: "Phone" },
  ];

  return (
    <div className="flex items-center gap-3">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          target={link.href.startsWith('http') ? "_blank" : undefined}
          rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-cyan-400 hover:border-blue-500/30 dark:hover:border-cyan-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
          title={link.label}
          aria-label={link.label}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

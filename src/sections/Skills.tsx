import React, { useState } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { SkillCard } from '../components/cards/SkillCard';
import { portfolioData } from '../data/portfolio';

export const Skills: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'frontend' | 'backend' | 'telephony' | 'cloud'>('all');
  const categories = portfolioData.skills;

  const filteredCategories = categories.filter(cat => {
    if (selectedFilter === 'all') return true;
    const title = cat.title.toLowerCase();
    if (selectedFilter === 'frontend') return title.includes('frontend') || title.includes('languages');
    if (selectedFilter === 'backend') return title.includes('backend') || title.includes('api') || title.includes('real-time');
    if (selectedFilter === 'telephony') return title.includes('telephony') || title.includes('ai');
    if (selectedFilter === 'cloud') return title.includes('cloud') || title.includes('devops') || title.includes('security');
    return true;
  });

  const filterTabs = [
    { id: 'all', label: 'All Tech' },
    { id: 'frontend', label: 'Languages & UI' },
    { id: 'backend', label: 'Backend & APIs' },
    { id: 'telephony', label: 'AI & VoIP' },
    { id: 'cloud', label: 'DevOps & Security' }
  ] as const;

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading 
          title="Skills & Expertise" 
          subtitle="My technical stack divided into core domains of engineering." 
        />
        
        {/* Interactive Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4.5 py-2 text-xs font-mono font-bold rounded-xl transition-all duration-300 ${selectedFilter === tab.id ? 'bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-md shadow-blue-500/10 dark:shadow-cyan-500/5' : 'bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat, idx) => (
            <SkillCard key={idx} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { ExperienceCard } from '../components/cards/ExperienceCard';
import { portfolioData } from '../data/portfolio';

export const Experience: React.FC = () => {
  const experiences = portfolioData.experience;

  return (
    <section id="experience" className="py-24 bg-slate-100/30 dark:bg-slate-900/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Work History" 
          subtitle="My professional journey as a full-stack software engineer." 
        />
        
        <div className="mt-12 flex flex-col">
          {experiences.map((exp, idx) => (
            <ExperienceCard 
              key={idx} 
              exp={exp} 
              isLast={idx === experiences.length - 1} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

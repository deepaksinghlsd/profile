import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  const experiences = [
    "Scalable Web Applications",
    "Real-Time AI Agents",
    "Telephony SaaS Products",
    "Reusable UI Systems",
    "Real-Time Dashboards",
    "Multi-Tenant Applications",
    "High-Throughput Communication Backends"
  ];

  const stats = [
    { value: "2+", label: "Years Experience" },
    { value: "Multiple", label: "Production Projects" },
    { value: "Full-Stack", label: "Development" },
    { value: "AI & Real-Time", label: "Systems" }
  ];

  return (
    <section id="about" className="py-24 bg-slate-100/30 dark:bg-slate-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="About Me" 
          subtitle="Engineering specialized platforms with voice SaaS and modern full-stack workflows." 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Panel */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Specialized in Real-Time Voice Platforms & Full-Stack Development
            </h3>
            
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-350 leading-relaxed">
              I am a Full-Stack Software Engineer with a deep passion for building high-performance communication systems, telephony integrations, and real-time AI voice agents. Throughout my career, I have designed multi-tenant platforms, unified voice monitoring nodes, and modular React component libraries that accelerate frontend delivery.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {experiences.map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-center">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 dark:text-cyan-400 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 text-center hover:border-slate-300 dark:hover:border-slate-700/85 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
              >
                <p className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                  {stat.value}
                </p>
                <p className="text-[11px] md:text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

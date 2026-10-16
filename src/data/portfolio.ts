// Single source of truth for everything shown on the site and spoken by the
// narrator. Facts come from the resume (public/assets/Deepak-Kumar-Singh-Resume.pdf,
// October 2026 version). Anything not on the resume is marked TODO / VERIFY and
// listed in the README.

import type { Portfolio, Project } from './types.ts';

// Candidates mentioned in the build brief but NOT on the resume. They stay
// hidden (published: false) until confirmed and filled in with real details.
const unverifiedCandidates: Project[] = [
  'WhatsApp Automation SaaS',
  'E-commerce Application',
  'School Management Software',
  'AI Live Translation App',
].map((name) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  tagline: 'TODO: one-line description',
  status: 'Unverified',
  kind: 'Personal project',
  problem: 'TODO',
  solution: 'TODO',
  contributions: [],
  stack: [],
  mockup: 'website',
  links: {},
  published: false,
  source: 'Not on resume: confirm before publishing',
}));

export const portfolio: Portfolio = {
  personal: {
    name: 'Deepak Kumar Singh',
    displayName: 'Deepak Singh',
    firstName: 'Deepak',
    role: 'Full-Stack Developer',
    tagline: ['Full-Stack MERN Developer', 'React & TypeScript', 'AI Voice & Telephony SaaS'],
    location: 'Greater Noida, India',
    email: 'deepaksinghlsdd@gmail.com',
    phone: '+91-9523717267',
    summary:
      'Software Engineer with nearly 2 years of experience building scalable web applications, real-time AI voice agents, and telephony SaaS products using ReactJS, TypeScript, Node.js, and cloud technologies. Experienced in developing reusable UI components, integrating voice engines (TTS/STT), and building communication backends with FreeSWITCH, Twilio, and Plivo. Hands-on with multi-tenant systems, caching layers, and real-time dashboards in agile teams.',
    focus: ['scalable web applications', 'real-time AI voice agents', 'telephony SaaS products'],
    coreStack: ['React', 'TypeScript', 'Node.js'],
    experienceLabel: 'nearly 2 years',
    experienceLabelHi: 'लगभग दो साल',
    // VERIFY: not stated on the resume. Set to null to hide the badge.
    availability: 'Open to roles & freelance projects',
    availabilityHi: 'नए roles और freelance projects के लिए उपलब्ध',
    links: {
      // TODO: the resume's LinkedIn/GitHub hyperlinks are still placeholders
      // ("YOUR-LINKEDIN", "YOUR-GITHUB"). Paste the real URLs here.
      linkedin: null,
      github: null,
      website: 'https://primexsphere.com',
    },
    resume: { href: '/assets/Deepak-Kumar-Singh-Resume.pdf', fileName: 'Deepak-Kumar-Singh-Resume.pdf' },
  },

  hero: {
    headline: 'Building *digital experiences* that make a difference.',
    note: "Let's build something great together!",
    now: { label: 'Now', value: 'Freelance · PrimeXSphere' },
  },

  stats: [
    { value: '4', label: 'Roles since Oct 2024', source: 'Resume experience: BGM Game, Snowebs, Bisht Technologies, PrimeXSphere' },
    { value: '500+', label: 'Payroll users served', source: 'Resume: Snowebs payroll modules serving 500+ users' },
    { value: '30%', label: 'Less UI build effort', source: 'Resume: Bisht Technologies component library' },
  ],

  about: {
    heading: 'Engineer at the meeting point of web, voice and AI.',
    paragraphs: [
      "I'm a full-stack software engineer from Greater Noida, India, with nearly two years of professional experience. I work mostly in React, TypeScript and Node.js, and much of my recent work has been real-time AI voice agents and telephony SaaS.",
      'At Bisht Technologies I built key modules of AgentLabs, a multi-tenant platform for AI-powered bulk calling, connecting ElevenLabs, OpenAI, Twilio, Plivo and FreeSWITCH, and the React dashboards that monitor calls in real time. Before that I built payroll modules serving 500+ users at Snowebs, and a MERN-stack CRM at BGM Game.',
      'Today I run PrimeXSphere, a freelance practice delivering custom web applications, AI solutions and automation systems, and I handle each project end to end: requirements, development, deployment and client communication.',
    ],
    facts: [
      { label: 'Based in', value: 'Greater Noida, India' },
      { label: 'Experience', value: 'Nearly 2 years (since Oct 2024)' },
      { label: 'Education', value: 'B.Tech CSE (AI/ML), 2024' },
      { label: 'Currently', value: 'Freelance · PrimeXSphere' },
    ],
  },

  techStrip: [
    { name: 'React', icon: 'react' },
    { name: 'TypeScript', icon: 'typescript' },
    { name: 'Node.js', icon: 'nodejs' },
    { name: 'Express', icon: 'express' },
    { name: 'MongoDB', icon: 'mongodb' },
    { name: 'PostgreSQL', icon: 'postgresql' },
    { name: 'MySQL', icon: 'mysql' },
    { name: 'Docker', icon: 'docker' },
    { name: 'Tailwind CSS', icon: 'tailwind' },
    { name: 'Google Cloud', icon: 'googlecloud' },
    { name: 'ElevenLabs', icon: 'elevenlabs' },
  ],

  skillGroups: [
    {
      id: 'languages',
      title: 'Languages',
      blurb: 'Typed, modern JavaScript across the stack.',
      skills: [
        { name: 'JavaScript (ES6+)', icon: 'javascript' },
        { name: 'TypeScript', icon: 'typescript' },
      ],
    },
    {
      id: 'frontend',
      title: 'Frontend',
      blurb: 'Responsive interfaces and reusable component libraries.',
      skills: [
        { name: 'ReactJS', icon: 'react' },
        { name: 'HTML5', icon: 'html5' },
        { name: 'CSS3', icon: 'css' },
        { name: 'Tailwind CSS', icon: 'tailwind' },
        { name: 'Shadcn UI', icon: 'shadcn' },
        { name: 'Recharts' },
        { name: 'Responsive Design' },
      ],
    },
    {
      id: 'state',
      title: 'State Management',
      blurb: 'Server state, caching and app-wide state.',
      skills: [
        { name: 'Context API', icon: 'react' },
        { name: 'TanStack Query', icon: 'reactquery' },
        { name: 'Redux Toolkit', icon: 'redux', note: 'familiar' },
      ],
    },
    {
      id: 'backend',
      title: 'Backend & Databases',
      blurb: 'REST APIs, business workflows and data modelling.',
      skills: [
        { name: 'Node.js', icon: 'nodejs' },
        { name: 'Express.js', icon: 'express' },
        { name: 'PostgreSQL', icon: 'postgresql' },
        { name: 'MySQL', icon: 'mysql' },
        { name: 'MongoDB', icon: 'mongodb' },
        { name: 'Drizzle ORM', icon: 'drizzle' },
      ],
    },
    {
      id: 'voice',
      title: 'Telephony & AI',
      blurb: 'Low-latency voice agents and calling infrastructure.',
      skills: [
        { name: 'FreeSWITCH' },
        { name: 'VoIP' },
        { name: 'Text-to-Speech (TTS)' },
        { name: 'Speech-to-Text (STT)' },
        { name: 'ElevenLabs', icon: 'elevenlabs' },
        { name: 'OpenAI' },
        { name: 'Twilio' },
        { name: 'Plivo' },
      ],
    },
    {
      id: 'realtime',
      title: 'APIs & Real-Time',
      blurb: 'Integrations and live data over HTTP and sockets.',
      skills: [
        { name: 'REST APIs' },
        { name: 'Axios', icon: 'axios' },
        { name: 'WebSockets' },
        { name: 'Socket.IO', icon: 'socketio' },
        { name: 'Real-Time Data Handling' },
      ],
    },
    {
      id: 'cloud',
      title: 'Cloud & DevOps',
      blurb: 'Shipping and running what gets built.',
      skills: [
        { name: 'AWS' },
        { name: 'Google Cloud Platform', icon: 'googlecloud' },
        { name: 'Docker', icon: 'docker' },
        { name: 'CI/CD Pipelines', icon: 'githubactions' },
        { name: 'Git', icon: 'git' },
        { name: 'GitHub', icon: 'github' },
      ],
    },
    {
      id: 'security',
      title: 'Auth & Security',
      blurb: 'Who can see and do what.',
      skills: [
        { name: 'JWT', icon: 'jwt' },
        { name: 'OAuth 2.0' },
        { name: 'Role-Based Access Control (RBAC)' },
      ],
    },
  ],

  // Listed as everyday tools, not certifications. VERIFY the "howIUse" lines.
  aiTools: [
    {
      id: 'antigravity',
      name: 'Google Antigravity',
      maker: 'Google',
      icon: 'antigravity',
      what: "Google's agent-first development environment, where AI agents can work across the editor, terminal and browser.",
      howIUse: 'Handing multi-step tasks to an agent, then reviewing its plan and changes before accepting them.',
      howIUseHi: 'multi-step tasks agent को सौंपने, और accept करने से पहले उसके plan और changes को review करने',
    },
    {
      id: 'claude-code',
      name: 'Claude Code',
      maker: 'Anthropic',
      icon: 'claude-code',
      what: "Anthropic's agentic coding tool for the terminal and IDE: it reads the codebase, edits files and runs commands.",
      howIUse: 'Repository-wide changes, refactors and debugging, with every diff reviewed and the build run before merging.',
      howIUseHi: 'पूरे repository में changes, refactoring और debugging',
    },
    {
      id: 'claude',
      name: 'Claude',
      maker: 'Anthropic',
      icon: 'claude',
      what: "Anthropic's AI assistant for reasoning, writing and analysis.",
      howIUse: 'Talking through architecture options, understanding unfamiliar APIs and drafting documentation.',
      howIUseHi: 'architecture के options पर चर्चा, नए APIs समझने और documentation draft करने',
    },
    {
      id: 'codex',
      name: 'OpenAI Codex',
      maker: 'OpenAI',
      icon: 'codex',
      what: "OpenAI's coding agent, available in the terminal, the IDE and the cloud.",
      howIUse: 'Running well-scoped coding tasks in parallel and getting a second opinion in code review.',
      howIUseHi: 'साफ़ तौर पर तय coding tasks को parallel में चलाने और code review में second opinion',
    },
  ],

  aiWorkflow: {
    heading: 'AI speeds me up. I stay accountable for the code.',
    intro:
      'AI-assisted tools are part of my daily workflow for planning, building and reviewing. They are listed here as tools I use, not as certifications.',
    steps: [
      { title: 'Plan', body: 'Break the problem down and talk through approaches and edge cases before writing code.' },
      { title: 'Build', body: 'Delegate well-scoped tasks to coding agents inside the real repository.' },
      { title: 'Review', body: 'Read every diff, run the build and tests, and check auth and data handling by hand.' },
      { title: 'Ship', body: 'Commit in small steps and deploy through the usual Git and CI/CD workflow.' },
    ],
    principle: 'Every change is still reviewed and tested by hand.',
    principleHi: 'हर बदलाव को अब भी हाथ से review और test किया जाता है।',
  },

  experience: [
    {
      id: 'primexsphere',
      title: 'Freelance Software Developer',
      company: 'PrimeXSphere',
      location: 'Greater Noida, India',
      start: '2026-08',
      end: null,
      type: 'Freelance',
      website: 'https://primexsphere.com',
      summary: 'The practice delivers custom web applications, AI solutions and automation systems for businesses, with each project handled end to end.',
      highlights: [
        'Run PrimeXSphere, a freelance practice delivering custom web applications, AI solutions, and automation systems for businesses.',
        'Designed, built, and deployed the PrimeXSphere website and product showcase.',
        'Handle projects end to end: requirement gathering, development, deployment, and client communication.',
      ],
      stack: ['Web applications', 'AI solutions', 'Automation'],
    },
    {
      id: 'bisht',
      title: 'Software Engineer (Full-Stack)',
      company: 'Bisht Technologies',
      product: 'AgentLabs & AgentHR AI SaaS Platforms',
      location: 'Greater Noida, India',
      start: '2026-03',
      end: '2026-08',
      type: 'Full-time',
      summary:
        'The role centred on AgentLabs, a multi-tenant SaaS platform for AI-powered bulk calling, including real-time voice pipelines and analytics dashboards.',
      highlights: [
        'Architected and developed key modules for AgentLabs, a multi-tenant SaaS platform for AI-powered bulk calling, integrating ElevenLabs (TTS), OpenAI, Twilio, Plivo, and FreeSWITCH to support low-latency voice agents.',
        'Implemented real-time voice and call monitoring pipelines, configuring FreeSWITCH nodes and WebSockets to handle live Speech-to-Text (STT) and Text-to-Speech (TTS) streams.',
        'Developed and maintained a ReactJS application using TypeScript, Tailwind CSS, and Shadcn UI, delivering responsive and scalable user interfaces.',
        'Built reusable component libraries following design system principles, reducing development effort by 30% and ensuring UI consistency.',
        'Integrated REST APIs using TanStack Query for server-state management, caching, and background synchronization.',
        'Created analytics dashboards using Recharts to visualize call metrics, campaign performance, and agent productivity.',
        'Participated in code reviews, debugging, performance optimization, and deployments using Git workflows and CI/CD pipelines.',
      ],
      stack: ['React', 'TypeScript', 'Tailwind CSS', 'Shadcn UI', 'TanStack Query', 'Recharts', 'FreeSWITCH', 'WebSockets', 'ElevenLabs', 'OpenAI', 'Twilio', 'Plivo'],
    },
    {
      id: 'snowebs',
      title: 'Web Developer',
      company: 'Snowebs Software Technologies Pvt. Ltd.',
      location: 'Greater Noida, India',
      start: '2025-04',
      end: '2026-02',
      type: 'Full-time',
      summary: 'The work included Payroll Management System modules serving 500+ users, backed by secure REST APIs.',
      highlights: [
        'Developed and maintained business web applications using ReactJS, Node.js, JavaScript, and MySQL.',
        'Built Payroll Management System modules including employee dashboards, attendance, leave tracking, payslip generation, and admin panels serving 500+ users.',
        'Developed backend REST APIs using Express.js and MySQL, covering CRUD operations, form processing, and business workflows.',
        'Implemented authentication and authorization using JWT and Role-Based Access Control (RBAC).',
        'Improved application performance through modular architecture, efficient API integration, and database query optimization.',
      ],
      stack: ['React', 'Node.js', 'Express.js', 'MySQL', 'JavaScript', 'JWT', 'RBAC'],
    },
    {
      id: 'bgm',
      title: 'ReactJS Developer – MERN Stack',
      company: 'BGM Game Pvt. Ltd.',
      location: 'Gurugram, Haryana, India',
      start: '2024-10',
      end: '2025-03',
      type: 'Full-time',
      summary: 'The main project was a MERN-stack CRM platform with role-based dashboards, advanced search and OTP-based authentication.',
      highlights: [
        'Developed a CRM platform using ReactJS, Node.js, Express.js, and MongoDB with reusable UI components and role-based dashboards.',
        'Built advanced search, dynamic forms, reusable tables, and responsive interfaces for business users.',
        'Implemented OTP-based authentication, protected routes, and role-based access controls.',
        'Collaborated with backend developers to integrate APIs between frontend and backend.',
      ],
      stack: ['React', 'Node.js', 'Express.js', 'MongoDB'],
    },
  ],

  projects: [
    {
      id: 'agentlabs',
      name: 'AgentLabs',
      tagline: 'Multi-tenant SaaS for AI-powered bulk calling',
      status: 'Professional work',
      kind: 'Professional work',
      context: 'Bisht Technologies',
      period: 'Mar 2026 – Aug 2026',
      problem:
        'Teams running outbound calling campaigns need AI voice agents that respond with low latency, and live visibility into how calls and campaigns are going.',
      solution:
        'A multi-tenant platform that connects AI voice agents to telephony providers, with real-time call monitoring and analytics dashboards.',
      contributions: [
        'Architected and developed key modules integrating ElevenLabs (TTS), OpenAI, Twilio, Plivo and FreeSWITCH for low-latency voice agents.',
        'Implemented real-time voice and call monitoring pipelines, configuring FreeSWITCH nodes and WebSockets for live STT and TTS streams.',
        'Built reusable component libraries that reduced development effort by 30%.',
        'Created Recharts analytics dashboards for call metrics, campaign performance and agent productivity.',
      ],
      stack: ['React', 'TypeScript', 'Tailwind CSS', 'Shadcn UI', 'TanStack Query', 'Recharts', 'WebSockets', 'FreeSWITCH', 'ElevenLabs', 'OpenAI', 'Twilio', 'Plivo'],
      mockup: 'voice-dashboard',
      links: {},
      published: true,
      source: 'Resume: Bisht Technologies role',
    },
    {
      id: 'apnajob',
      name: 'ApnaJob',
      tagline: 'AI-powered job discovery platform',
      status: 'Personal project',
      kind: 'Personal project',
      problem:
        'Job seekers have to dig through listings that do not fit them, and candidate profiles hold personal data that should only reach genuine recruiters.',
      solution:
        'An AI-driven career-matching web app that connects job seekers with listings, notifies them about new opportunities, and protects candidate data.',
      contributions: [
        'Developed an AI-driven career matching and job discovery web application connecting job seekers with job listings.',
        'Built job-matching and search logic with notifications for new opportunities.',
        'Implemented encryption controls for candidate profiles and secure data transmission for verified recruiters.',
      ],
      stack: ['ReactJS', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      mockup: 'jobs',
      // VERIFY: from the resume, but the site did not respond when checked on 2026-10-17.
      links: { live: 'https://lsd.qzz.io' },
      published: true,
      source: 'Resume: Key Projects',
    },
    {
      id: 'payroll',
      name: 'Payroll Management System',
      tagline: 'Attendance, leave and payslips for 500+ users',
      status: 'Professional work',
      kind: 'Professional work',
      context: 'Snowebs Software Technologies',
      period: 'Apr 2025 – Feb 2026',
      problem: 'HR and admin teams need one place to manage attendance, leave and payslips, with each user seeing only what their role allows.',
      solution:
        'Payroll modules with employee dashboards, attendance, leave tracking, payslip generation and admin panels, backed by secure REST APIs.',
      contributions: [
        'Built employee dashboards, attendance, leave tracking, payslip generation and admin panels serving 500+ users.',
        'Developed Express.js and MySQL REST APIs for CRUD operations, form processing and business workflows.',
        'Implemented JWT authentication and role-based access control.',
        'Improved performance through modular architecture and database query optimization.',
      ],
      stack: ['ReactJS', 'Node.js', 'Express.js', 'MySQL', 'JWT', 'RBAC'],
      mockup: 'payroll',
      links: {},
      published: true,
      source: 'Resume: Snowebs role',
    },
    {
      id: 'primexsphere-site',
      name: 'PrimeXSphere Website',
      tagline: 'Agency website and product showcase',
      status: 'Live',
      kind: 'Freelance',
      context: 'PrimeXSphere',
      period: 'Aug 2026 – Present',
      problem: 'A new freelance practice needs a credible home for its services and products, where businesses can find it and get in touch.',
      solution: 'Designed, built and deployed the PrimeXSphere website and product showcase.',
      contributions: [
        'Designed, built, and deployed the PrimeXSphere website and product showcase.',
        'Handled the project end to end, from requirements to deployment.',
      ],
      // From the project repository (the resume does not list this stack).
      stack: ['React', 'Vite', 'Express', 'Prisma', 'PostgreSQL'],
      mockup: 'website',
      links: { live: 'https://primexsphere.com' },
      published: true,
      source: 'Resume: PrimeXSphere role; stack from project repository',
    },
    {
      id: 'crm',
      name: 'CRM Platform',
      tagline: 'Role-based CRM on the MERN stack',
      status: 'Professional work',
      kind: 'Professional work',
      context: 'BGM Game',
      period: 'Oct 2024 – Mar 2025',
      problem: 'Business users need to find, filter and update customer records quickly, with access limited by role.',
      solution: 'A CRM with role-based dashboards, advanced search, dynamic forms, reusable tables and OTP-based sign-in.',
      contributions: [
        'Developed the CRM using ReactJS, Node.js, Express.js and MongoDB with reusable UI components and role-based dashboards.',
        'Built advanced search, dynamic forms, reusable tables and responsive interfaces.',
        'Implemented OTP-based authentication, protected routes and role-based access controls.',
      ],
      stack: ['ReactJS', 'Node.js', 'Express.js', 'MongoDB'],
      mockup: 'crm',
      links: {},
      published: true,
      source: 'Resume: BGM Game role',
    },
    {
      id: 'chat',
      name: 'Real-Time Chat Application',
      tagline: 'Instant messaging with Socket.IO',
      status: 'Personal project',
      kind: 'Personal project',
      problem: 'Messaging needs to feel instant, and the interface has to stay smooth on both desktop and mobile.',
      solution: 'A real-time chat app using Socket.IO and React, with Context API state management and responsive UI components.',
      contributions: [
        'Developed real-time instant messaging using Socket.IO and ReactJS.',
        'Managed state with Context API and optimized rendering for a smoother user experience.',
        'Built responsive UI components for desktop and mobile devices.',
      ],
      stack: ['ReactJS', 'Node.js', 'Socket.IO', 'MongoDB', 'Context API'],
      mockup: 'chat',
      // TODO: add GitHub / demo links if they are public.
      links: {},
      published: true,
      source: 'Resume: Key Projects',
    },
    ...unverifiedCandidates,
  ],

  education: [
    {
      degree: 'B.Tech',
      field: 'Computer Science Engineering',
      specialization: 'AI/ML',
      institution: 'Greater Noida Institute of Technology',
      university: 'AKTU',
      universitySpoken: 'Dr. A. P. J. Abdul Kalam Technical University',
      location: 'Greater Noida, India',
      start: '2020',
      end: '2024',
    },
  ],

  // None listed on the resume.
  certifications: [],
};

export const publishedProjects = portfolio.projects.filter((p) => p.published);

export interface Skill {
  name: string;
  level?: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface Project {
  title: string;
  subtitle: string;
  technologies: string[];
  description: string;
  highlights: string[];
  demoUrl?: string;
  githubUrl?: string;
}

export interface Education {
  degree: string;
  period: string;
  institution: string;
  university?: string;
  location?: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    subTitle: string;
    location: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    summary: string;
  };
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Deepak Kumar Singh",
    title: "Full-Stack Software Engineer",
    subTitle: "React / TypeScript | Node.js | AI & Voice Agent Engineer | SaaS & Real-Time Developer",
    location: "Greater Noida, India",
    email: "deepaksinghlsdd@gmail.com",
    phone: "+91-9523717267",
    github: "https://github.com/deepaksinghlsd", // Configurable GitHub Link
    linkedin: "https://linkedin.com/in/deepak-kumar-singh", // Configurable LinkedIn Link
    summary: "Software Engineer with 2+ years of experience building scalable web applications, real-time AI agents, and telephony SaaS products using ReactJS, JavaScript (ES6+), TypeScript, Node.js, and modern cloud technologies. Expert in developing reusable UI components, integrating voice engines (TTS/STT), and implementing high-throughput communication backends. Strong track record of designing multi-tenant systems, caching layers, and real-time dashboards under agile methodologies."
  },
  skills: [
    {
      title: "Programming Languages",
      skills: [
        { name: "JavaScript ES6+" },
        { name: "TypeScript" }
      ]
    },
    {
      title: "Frontend Development",
      skills: [
        { name: "ReactJS" },
        { name: "HTML5" },
        { name: "CSS3" },
        { name: "Tailwind CSS" },
        { name: "Shadcn UI" },
        { name: "Responsive Design" },
        { name: "Context API" },
        { name: "TanStack Query" },
        { name: "Redux Toolkit" }
      ]
    },
    {
      title: "Backend Development",
      skills: [
        { name: "Node.js" },
        { name: "Express.js" },
        { name: "PostgreSQL" },
        { name: "MySQL" },
        { name: "MongoDB" },
        { name: "Drizzle ORM" }
      ]
    },
    {
      title: "AI / Telephony & Voice Systems",
      skills: [
        { name: "FreeSWITCH" },
        { name: "VoIP" },
        { name: "TTS (Text-to-Speech)" },
        { name: "STT (Speech-to-Text)" },
        { name: "ElevenLabs" },
        { name: "OpenAI API" },
        { name: "Twilio" },
        { name: "Plivo" }
      ]
    },
    {
      title: "APIs & Real-Time Systems",
      skills: [
        { name: "REST APIs" },
        { name: "Axios" },
        { name: "WebSockets" },
        { name: "Real-Time Data Handling" }
      ]
    },
    {
      title: "Cloud & DevOps",
      skills: [
        { name: "AWS" },
        { name: "Google Cloud Platform" },
        { name: "Docker" },
        { name: "CI/CD" },
        { name: "Git" },
        { name: "GitHub" }
      ]
    },
    {
      title: "Security & Authentication",
      skills: [
        { name: "JWT (JSON Web Tokens)" },
        { name: "OAuth 2.0" },
        { name: "RBAC (Role-Based Access Control)" }
      ]
    }
  ],
  experience: [
    {
      role: "Software Engineer (Full-Stack)",
      company: "Bisht Technologies — AgentLabs & AgentHR AI SaaS Platforms",
      location: "Greater Noida, India",
      period: "March 2026 – Present",
      highlights: [
        "Architected and developed key modules for AgentLabs, a multi-tenant SaaS platform for AI-powered bulk calling, integrating ElevenLabs (TTS), OpenAI, Twilio, Plivo, and FreeSWITCH to support low-latency voice agents.",
        "Implemented real-time voice and call monitoring pipelines, configuring FreeSWITCH nodes and WebSockets to handle real-time Speech-to-Text (STT) and Text-to-Speech (TTS) transformations.",
        "Developed and maintained a high-performance ReactJS application using TypeScript, Tailwind CSS, and Shadcn UI, delivering responsive and scalable user interfaces.",
        "Built and maintained reusable component libraries following design system principles, reducing development effort by 30% and ensuring UI consistency.",
        "Integrated REST APIs using TanStack Query (React Query) for efficient server-state management, caching, and background synchronization.",
        "Created interactive analytics dashboards using Recharts to visualize call metrics, campaign performance, and agent productivity data.",
        "Participated in code reviews, debugging, performance optimization, and deployment processes using Git-based workflows and CI/CD pipelines."
      ]
    },
    {
      role: "Web Developer",
      company: "Snowebs Software Technologies Pvt. Ltd.",
      location: "Greater Noida, India",
      period: "April 2025 – February 2026",
      highlights: [
        "Developed and maintained business web applications using ReactJS, Node.js, JavaScript, HTML5, CSS3, and MySQL.",
        "Built responsive Payroll Management System modules including employee dashboards, attendance management, leave tracking, payslip generation, and administrative panels serving 500+ users.",
        "Developed backend REST APIs using Express.js and MySQL, implementing CRUD operations, form processing, secure database design, and business workflow implementation.",
        "Integrated RESTful APIs and third-party services to enable seamless communication between frontend and backend systems.",
        "Implemented secure authentication and authorization mechanisms using JWT and Role-Based Access Control (RBAC).",
        "Optimized application performance through modular architecture improvements, efficient API integration, and database query optimization."
      ]
    },
    {
      role: "ReactJS Developer – MERN Stack",
      company: "BGM Game Pvt. Ltd.",
      location: "Gurugram, Haryana, India",
      period: "October 2024 – March 2025",
      highlights: [
        "Developed a CRM platform using ReactJS, Node.js, Express.js, and MongoDB with reusable UI components and role-based dashboards.",
        "Built advanced search functionality, dynamic forms, reusable tables, and responsive interfaces for business users.",
        "Implemented OTP-based authentication, protected routes, and role-based access controls across the application.",
        "Collaborated with backend developers to integrate APIs and ensure seamless frontend-backend communication."
      ]
    }
  ],
  projects: [
    {
      title: "ApnaJob",
      subtitle: "AI-Powered Job Discovery Platform",
      technologies: ["ReactJS", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS"],
      description: "AI-driven career matching and job discovery platform connecting job seekers with global listings.",
      highlights: [
        "AI career matching algorithms to match candidate profiles with relevant listings",
        "Job discovery and recommendations with real-time job-matching logic",
        "Large-scale search functionality engineered to handle millions of listings",
        "Real-time notifications for new job matches and recruiter messages",
        "Privacy-first encryption for candidate profiles and secure transmission of verified recruiter leads"
      ],
      demoUrl: "https://lsd.qzz.io", // Resume URL
      githubUrl: "https://github.com/deepaksinghlsd/apnajob-placeholder" // Configurable GitHub Link placeholder
    },
    {
      title: "Real-Time Chat Application",
      subtitle: "Instant Messaging Platform",
      technologies: ["ReactJS", "Node.js", "Socket.IO", "MongoDB", "Context API"],
      description: "A real-time chat application supporting instant, low-latency text messaging and optimized client rendering.",
      highlights: [
        "Instant messaging and bidirectional real-time communication using Socket.IO",
        "Optimized state management with React's Context API to reduce unnecessary component re-renders",
        "Clean, modern, responsive user interface ensuring perfect layouts on both desktop and mobile devices"
      ],
      demoUrl: "https://chat-app-placeholder.vercel.app", // Configurable placeholder
      githubUrl: "https://github.com/deepaksinghlsd/realtime-chat-placeholder" // Configurable placeholder
    }
  ],
  education: [
    {
      degree: "Bachelor of Technology (B.Tech) – Computer Science Engineering (AI/ML Specialization)",
      period: "2020 – 2024",
      institution: "Greater Noida Institute of Technology",
      university: "Dr. A.P.J. Abdul Kalam Technical University (AKTU)"
    }
  ]
};

import aboutImg from '../assets/images/portfolio_about_1783853603938.jpg';
import projectsImg from '../assets/images/portfolio_projects_1783853616443.jpg';
import experienceImg from '../assets/images/portfolio_experience_1783853628956.jpg';
import skillsImg from '../assets/images/portfolio_skills_1783853639171.jpg';
import contactImg from '../assets/images/portfolio_contact_1783853651642.jpg';

export interface Project {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  image: string;
  technologies: string[];
  category: string;
  year: string;
  status?: string;
  liveUrl?: string;
  githubUrl?: string;
  highlights?: string[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "zyphoria",
    number: "01",
    title: "ZYPHORIA'26",
    category: "Symposium Website",
    shortDescription: "Official symposium website for event information, registration, and live coordination.",
    fullDescription: "Official symposium platform built for participant registration, schedule management, event updates, and real-time live coordination across academic departments.",
    image: projectsImg,
    technologies: ["TypeScript", "Supabase", "React", "Vercel"],
    status: "Live in Prod",
    year: "2026",
    liveUrl: "https://zyphoria.vercel.app",
    githubUrl: "https://github.com/Josewa-Aghai/ZYPHORIA",
    highlights: [
      "Contributed to the official symposium platform",
      "Supported registrations, event information, and event operations",
      "Worked in a collaborative high-availability development environment"
    ],
    featured: true
  },
  {
    id: "billease",
    number: "02",
    title: "BillEase",
    category: "Bilingual Billing Platform",
    shortDescription: "Bilingual billing, quotation & invoice platform for real business workflow.",
    fullDescription: "Billing, quotation, and invoice generation platform architected for a real family-business workflow. Designed with bilingual Tamil and English support and instant PDF generation.",
    image: contactImg,
    technologies: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    status: "Active Use",
    year: "2025",
    liveUrl: "https://bill-ease-gamma.vercel.app",
    githubUrl: "https://github.com/Jxck007/BillEase",
    highlights: [
      "Added Tamil and English bilingual localization",
      "Cloud-backed realtime synchronization with Firebase",
      "Tailored for seamless usability by non-technical business operators"
    ],
    featured: true
  },
  {
    id: "mystery-box",
    number: "03",
    title: "Mystery Box",
    category: "Live Event Platform",
    shortDescription: "Real-time event & game platform used for 65+ teams with live leaderboards.",
    fullDescription: "Real-time game and event management platform deployed during a major college event for live team coordination, dynamic scoring algorithms, real-time leaderboard broadcast, and organizer administration.",
    image: experienceImg,
    technologies: ["TypeScript", "Supabase", "React", "Realtime API"],
    status: "Deployed Live",
    year: "2025",
    liveUrl: "https://mystery-box-seven.vercel.app",
    githubUrl: "https://github.com/Jxck007/Mystery-Box",
    highlights: [
      "Served as Assistant Coordinator for ~65 participating teams",
      "Engineered team flow, live scoring, leaderboards, and admin controls",
      "Supabase-backed low-latency websocket data handling"
    ],
    featured: true
  },
  {
    id: "forge-resume",
    number: "04",
    title: "Forge Resume",
    category: "AI Resume Builder",
    shortDescription: "AI-assisted resume builder with import, guided writing, and live preview.",
    fullDescription: "Modern resume-building product featuring document import, modular section editing, optional AI-assisted writing polish, instant live PDF compilation, and export pipelines.",
    image: aboutImg,
    technologies: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    status: "Live in Prod",
    year: "2025",
    liveUrl: "https://forge-resume-six.vercel.app/",
    githubUrl: "https://github.com/Jxck007/Forge-Resume",
    highlights: [
      "Built resume creation, editing, preview, and export workflows",
      "Optional AI-assisted writing tools and data import parsers",
      "Focused on transparent, student-friendly, and ATS-optimized output"
    ],
    featured: true
  }
];

export interface ArchiveProject {
  title: string;
  stack: string;
  description: string;
}

export const archiveProjects: ArchiveProject[] = [
  {
    title: "UniQScan",
    stack: "Flutter · Dart · Firebase",
    description: "Paperless OD and permission workflow system with digital verification and approval hierarchies"
  },
  {
    title: "QUBE / QR Aura",
    stack: "React · TypeScript",
    description: "Customizable QR generator with local history and custom styling presets"
  },
  {
    title: "RIT GrubPoint",
    stack: "Flutter · Firebase · Dart",
    description: "Student food-ordering application with digital wallet & reservations"
  },
  {
    title: "Mafia",
    stack: "Kotlin · Firebase · Gemini API",
    description: "Mobile Mafia multiplayer party game with AI narration"
  },
  {
    title: "Kimera Vel Tech",
    stack: "TypeScript · CSS",
    description: "Modern showcase and business presence website"
  },
  {
    title: "Edumate",
    stack: "Flutter · Dart",
    description: "Educational chatbot and student query assistant concept"
  },
  {
    title: "Predictive Load Balancer",
    stack: "JavaScript · Node · React · PostgreSQL",
    description: "Academic full-stack simulation project for predictive traffic distribution"
  }
];

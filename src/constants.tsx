import { Project, Experience, Software } from './types';
import { 
  SiCanva, 
  SiGooglesheets, 
  SiHubspot 
} from 'react-icons/si';
import {
  FaFilePowerpoint,
  FaFileExcel,
  FaFileWord
} from 'react-icons/fa';

const project1 = '/images/facebook1.webp';
const project2 = '/images/instagram.webp';
const project3 = '/images/facebook2.webp';

const pdf1 = '/files/project1.pdf';
const pdf2 = '/files/project2.pdf';

const canva = '/softwares/Canva.webp';
const capcut = '/softwares/Capcut.webp';
const notion = '/softwares/Notion.webp';
const clickup = '/softwares/ClickUp.webp';
const gmail = '/softwares/Gmail.webp';
const docs = '/softwares/Docs.webp';
const sheets = '/softwares/Sheets.webp';
const drive = '/softwares/Drive.webp';

export const EXPERIENCES_1: Experience[] = [
  {
    title: 'Trade Relations Supervisor',
    company: 'Cepat Kredit Financing Inc.',
    period: 'Jan 2026 – Present',
  },
  {
    title: 'Social Media Manager / Virtual Assistant',
    company: 'Part-time',
    period: 'Sep 2025 – Present',
  },
  {
    title: 'Marketing Role',
    company: 'Cepat Kredit Financing Inc.',
    period: 'Jul 2024 – Present',
  },
  {
    title: 'Digital Marketing Specialist',
    company: 'Cepat Kredit Financing Inc.',
    period: 'Jul 2024 – Dec 2025',
  },
];

export const EXPERIENCES_2: Experience[] = [
  {
    title: 'Digital Marketing Excellence',
    company: 'Growth & Strategy',
    period: 'Results-driven specialist with expertise in social media, content creation, and digital strategy.',
  },
  {
    title: 'Strategic Campaigns',
    company: 'Impact & Analytics',
    period: 'Experienced in building campaigns and driving measurable growth using creativity and analytics.',
  },
  {
    title: 'Education',
    company: 'BSBA Marketing Management',
    period: 'Pamantasan ng Lungsod ng Pasig (2020–2024). Dean’s List & President’s List Awardee.',
  },
];

export const SOFTWARES: Software[] = [
  { name: 'Canva', icon: canva },
  { name: 'CapCut', icon: capcut },
  { name: 'Notion', icon: notion },
  { name: 'ClickUp', icon: clickup },
  { name: 'Gmail', icon: gmail },
  { name: 'Docs', icon: docs },
  { name: 'Sheets', icon: sheets },
  { name: 'Drive', icon: drive },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'SOCIAL CONTENT MARKETING',
    description: 'Strategic social media content creation designed for maximum reach and engagement across platforms.',
    color: 'bg-proj-1',
    imageUrl: project1,
    number: '1',
    pdfUrl: pdf1,
  },
  {
    id: '2',
    title: 'PREMIUM BOOK DESIGN',
    description: 'Sophisticated editorial layout and cover design for high-end publications and boutique publishers.',
    color: 'bg-proj-2',
    imageUrl: project2,
    number: '2',
    pdfUrl: pdf2,
  },
  {
    id: '3',
    title: 'BRAND STORYTELLING',
    description: 'Developing cohesive social media content strategies that tell a compelling brand narrative.',
    color: 'bg-proj-3',
    imageUrl: project3,
    number: '3',
    pdfUrl: pdf1,
  },
];

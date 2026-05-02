import Hero from './components/Hero';
import Intro from './components/Intro';
import ExperienceContact from './components/ExperienceContact';
import ProjectContent from './components/ProjectContent';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-accent-beige selection:text-white overflow-x-hidden">
      {/* Background Grain Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <main>
        <Hero />
        <Intro />
        <ExperienceContact />
        <ProjectContent />
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}


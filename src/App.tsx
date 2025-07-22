import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import AboutCard from './components/AboutCard';
import ProjectsCard from './components/ProjectsCard';
import ExperienceCard from './components/ExperienceCard';
import EducationCard from './components/EducationCard';

const milestones = [
  { id: 'about', label: 'About', component: <AboutCard /> },
  { id: 'projects', label: 'Projects', component: <ProjectsCard /> },
  { id: 'experience', label: 'Experience', component: <ExperienceCard /> },
  { id: 'education', label: 'Education', component: <EducationCard /> },
];

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('about');

  // Track scroll progress for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      const scroll = el.scrollLeft || el.scrollTop;
      const max = (window.innerWidth > 768 ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight);
      setProgress(max ? scroll / max : 0);
      // Find active milestone
      for (let i = milestones.length - 1; i >= 0; i--) {
        const card = document.getElementById(milestones[i].id);
        if (card) {
          const rect = card.getBoundingClientRect();
          if ((window.innerWidth > 768 && rect.left < window.innerWidth / 2) ||
              (window.innerWidth <= 768 && rect.top < window.innerHeight / 2)) {
            setActive(milestones[i].id);
            break;
          }
        }
      }
    };
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', handleScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Snap to milestone on nav click
  const scrollToMilestone = (id: string) => {
    const card = document.getElementById(id);
    if (card && containerRef.current) {
      if (window.innerWidth > 768) {
        containerRef.current.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
      } else {
        containerRef.current.scrollTo({ top: card.offsetTop, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-fog to-accent font-sans">
      {/* Sticky Progress Bar/Nav */}
      <div className="fixed top-0 left-0 w-full z-40 flex flex-col items-center pointer-events-none">
        <div className="w-full max-w-3xl px-4 pt-4 flex justify-between items-center">
          {milestones.map((m) => (
            <button
              key={m.id}
              onClick={() => scrollToMilestone(m.id)}
              className={`pointer-events-auto px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300
                ${active === m.id ? 'bg-accent text-snow shadow-foggy' : 'text-earth hover:bg-accent/20'}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="w-full max-w-3xl h-1 bg-earth/10 rounded-full mt-2 overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            style={{ width: `${progress * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      {/* Timeline Gallery */}
      <div
        ref={containerRef}
        className="snap-x snap-mandatory flex md:flex-row flex-col overflow-x-auto overflow-y-auto md:overflow-y-hidden md:h-screen h-auto pt-24 pb-12 md:pb-0 md:pt-32 scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {milestones.map((m, i) => (
          <motion.section
            id={m.id}
            key={m.id}
            className="snap-center flex-shrink-0 w-full md:w-[80vw] max-w-xl h-auto md:h-[70vh] mx-auto my-8 md:my-0 md:mx-8 flex items-center justify-center"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.5 }}
          >
            {m.component}
          </motion.section>
        ))}
      </div>
    </div>
  );
};

export default App; 
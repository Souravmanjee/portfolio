import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface Skill {
  name: string;
  level: number;
  icon: string;
  color: string;
}

interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend Development',
    icon: '🎨',
    skills: [
      { name: 'React/Next.js', level: 90, icon: '⚛️', color: '#61DAFB' },
      { name: 'TypeScript', level: 85, icon: '📘', color: '#3178C6' },
      { name: 'Tailwind CSS', level: 88, icon: '🎨', color: '#38BDF8' },
      { name: 'Three.js/WebGL', level: 75, icon: '🎮', color: '#000000' },
      { name: 'Framer Motion', level: 80, icon: '✨', color: '#FF0055' }
    ]
  },
  {
    title: 'Backend Development',
    icon: '⚙️',
    skills: [
      { name: 'Node.js', level: 85, icon: '🟢', color: '#339933' },
      { name: 'Python', level: 80, icon: '🐍', color: '#3776AB' },
      { name: 'GraphQL', level: 75, icon: '📡', color: '#E10098' },
      { name: 'Database Design', level: 82, icon: '🗃️', color: '#336791' },
      { name: 'API Development', level: 88, icon: '🔌', color: '#FF6B35' }
    ]
  },
  {
    title: 'Tools & Workflow',
    icon: '🛠️',
    skills: [
      { name: 'Git/GitHub', level: 90, icon: '🐙', color: '#181717' },
      { name: 'Docker', level: 70, icon: '🐋', color: '#2496ED' },
      { name: 'AWS/Cloud', level: 75, icon: '☁️', color: '#FF9900' },
      { name: 'CI/CD', level: 78, icon: '🔄', color: '#2088FF' },
      { name: 'Testing', level: 82, icon: '🧪', color: '#97CA00' }
    ]
  },
  {
    title: 'Design & UX',
    icon: '🎯',
    skills: [
      { name: 'UI/UX Design', level: 85, icon: '🎨', color: '#FF5722' },
      { name: 'Figma/Sketch', level: 80, icon: '📐', color: '#F24E1E' },
      { name: 'Responsive Design', level: 92, icon: '📱', color: '#4CAF50' },
      { name: 'Animation', level: 85, icon: '🎬', color: '#9C27B0' },
      { name: 'Accessibility', level: 88, icon: '♿', color: '#FF9800' }
    ]
  }
];

export const Skills: React.FC = () => {
  const { isDark } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const categoryVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const skillVariants = {
    hidden: { 
      width: 0,
      opacity: 0 
    },
    visible: (level: number) => ({
      width: `${level}%`,
      opacity: 1,
      transition: {
        duration: 1,
        delay: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={categoryVariants} className="text-center">
        <div className="text-6xl mb-4">⚡</div>
        <h1 className="text-4xl font-display font-bold mb-4">
          Skills & Expertise
        </h1>
        <p className={`text-xl ${isDark ? 'text-mist' : 'text-stone'} max-w-2xl mx-auto`}>
          Like climbing gear, each skill serves a purpose in conquering different challenges 
          and reaching new heights in development.
        </p>
      </motion.div>

      {/* Skill Categories */}
      <div className="space-y-8">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            variants={categoryVariants}
            className={`p-6 rounded-xl ${isDark ? 'bg-stone/10' : 'bg-fog/30'} border ${isDark ? 'border-stone/20' : 'border-stone/10'}`}
          >
            {/* Category Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-3xl">{category.icon}</div>
              <h2 className="text-2xl font-display font-semibold">{category.title}</h2>
            </div>

            {/* Skills Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {category.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skill.name}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: categoryIndex * 0.1 + skillIndex * 0.05, 
                    duration: 0.4 
                  }}
                >
                  {/* Skill Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{skill.icon}</span>
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <span className={`text-sm font-bold ${isDark ? 'text-accent' : 'text-accent-dark'}`}>
                      {skill.level}%
                    </span>
                  </div>

                  {/* Skill Bar */}
                  <div className={`h-2 rounded-full ${isDark ? 'bg-stone/20' : 'bg-stone/10'} overflow-hidden`}>
                    <motion.div
                      className="h-full rounded-full relative"
                      style={{ backgroundColor: skill.color }}
                      variants={skillVariants}
                      custom={skill.level}
                      initial="hidden"
                      animate="visible"
                    >
                      {/* Glow effect */}
                      <div 
                        className="absolute inset-0 opacity-50"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${skill.color}80, transparent)`,
                          animation: 'shimmer 2s infinite'
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Learning Philosophy */}
      <motion.div variants={categoryVariants} className={`p-6 rounded-xl ${isDark ? 'bg-accent/10' : 'bg-accent/5'} border ${isDark ? 'border-accent/20' : 'border-accent/10'}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-2xl font-display font-semibold mb-4 text-accent">
            Continuous Learning Journey
          </h2>
          <p className={`${isDark ? 'text-mist' : 'text-stone'} max-w-3xl mx-auto text-lg leading-relaxed`}>
            Technology evolves rapidly, and so do I. Every project is an opportunity to learn something new, 
            refine existing skills, and discover innovative solutions. Like a mountain climber who studies 
            new routes and techniques, I'm always expanding my toolkit for the next challenge.
          </p>
        </div>
        
        {/* Learning Areas */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: '🧠', title: 'AI/ML Integration', desc: 'Exploring machine learning applications in web development' },
            { icon: '🌐', title: 'Web3 Technologies', desc: 'Learning blockchain and decentralized applications' },
            { icon: '🚀', title: 'Performance Optimization', desc: 'Advanced techniques for faster, more efficient apps' }
          ].map((area, index) => (
            <motion.div
              key={area.title}
              className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white/30'}`}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl mb-2">{area.icon}</div>
              <h3 className="font-semibold mb-2">{area.title}</h3>
              <p className={`text-sm ${isDark ? 'text-mist/80' : 'text-stone/80'}`}>
                {area.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div variants={categoryVariants} className="text-center">
        <motion.div
          className="inline-flex items-center space-x-2 text-accent"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-2xl">🏔️</span>
          <span className="font-medium">Ready to tackle your next project together?</span>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
};
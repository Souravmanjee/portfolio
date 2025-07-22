import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export const About: React.FC = () => {
  const { isDark } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
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

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center">
        <motion.div
          className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent to-accent-dark p-1"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`w-full h-full rounded-full ${isDark ? 'bg-cliff' : 'bg-snow'} flex items-center justify-center text-6xl`}>
            🧗‍♂️
          </div>
        </motion.div>
        
        <h1 className="text-4xl font-display font-bold mb-4">
          Welcome to My Journey!
        </h1>
        
        <p className={`text-xl ${isDark ? 'text-mist' : 'text-stone'} max-w-2xl mx-auto`}>
          I'm a passionate developer who loves turning ideas into reality through code, 
          just like scaling mountains - one step at a time.
        </p>
      </motion.div>

      {/* Personal Story */}
      <motion.div variants={itemVariants} className={`p-6 rounded-xl ${isDark ? 'bg-stone/10' : 'bg-fog/50'}`}>
        <h2 className="text-2xl font-display font-semibold mb-4 flex items-center">
          <span className="mr-3 text-3xl">📖</span>
          My Story
        </h2>
        <div className="space-y-4 text-lg leading-relaxed">
          <p>
            Just like every great mountain expedition starts with a single step, my journey in 
            technology began with curiosity and has evolved into a passionate pursuit of creating 
            meaningful digital experiences.
          </p>
          <p>
            I believe in the power of persistent learning, collaborative growth, and the 
            idea that the best solutions often come from the most challenging climbs.
          </p>
        </div>
      </motion.div>

      {/* Values & Interests */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-display font-semibold mb-6 flex items-center">
          <span className="mr-3 text-3xl">🎯</span>
          What Drives Me
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: '🚀',
              title: 'Innovation',
              description: 'Always seeking new ways to solve problems and push boundaries'
            },
            {
              icon: '🤝',
              title: 'Collaboration',
              description: 'Believing that the best solutions come from diverse perspectives'
            },
            {
              icon: '🎨',
              title: 'Design Thinking',
              description: 'Crafting experiences that are both functional and beautiful'
            },
            {
              icon: '📚',
              title: 'Continuous Learning',
              description: 'Staying curious and adapting to the ever-evolving tech landscape'
            }
          ].map((value, index) => (
            <motion.div
              key={value.title}
              className={`p-6 rounded-lg ${isDark ? 'bg-stone/10 hover:bg-stone/20' : 'bg-fog/30 hover:bg-fog/50'} transition-all duration-300 cursor-pointer group`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className={`${isDark ? 'text-mist' : 'text-stone'} leading-relaxed`}>
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Fun Facts */}
      <motion.div variants={itemVariants} className={`p-6 rounded-xl ${isDark ? 'bg-accent/10' : 'bg-accent/5'} border ${isDark ? 'border-accent/20' : 'border-accent/10'}`}>
        <h2 className="text-2xl font-display font-semibold mb-4 flex items-center text-accent">
          <span className="mr-3 text-3xl">⭐</span>
          Fun Facts About Me
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { emoji: '☕', text: 'Coffee enthusiast who codes better with good brew' },
            { emoji: '🌱', text: 'Always growing, always learning something new' },
            { emoji: '🎮', text: 'Gamer who appreciates good UI/UX design' },
            { emoji: '🏔️', text: 'Actual mountain climbing is on my bucket list!' },
            { emoji: '🎵', text: 'Music helps me think and code creatively' },
            { emoji: '📱', text: 'Mobile-first mindset in everything I build' }
          ].map((fact, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg bg-white/5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
            >
              <span className="text-2xl">{fact.emoji}</span>
              <span className="text-sm">{fact.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div variants={itemVariants} className="text-center pt-4">
        <motion.div
          className="inline-flex items-center space-x-2 text-accent"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-2xl">👆</span>
          <span className="font-medium">Keep scrolling to explore more of my journey!</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  status: 'completed' | 'in-progress' | 'planned';
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Mountain Weather App',
    description: 'Real-time weather conditions for mountain expeditions',
    longDescription: 'A comprehensive weather application specifically designed for mountain climbers and outdoor enthusiasts. Features real-time weather data, elevation-based forecasts, and safety alerts.',
    technologies: ['React', 'Node.js', 'Weather API', 'Three.js'],
    image: '🌦️',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Trail Mapping Platform',
    description: 'Interactive mapping system for hiking trails',
    longDescription: 'An interactive platform that allows hikers to discover, plan, and share hiking trails. Features GPS tracking, difficulty ratings, and community reviews.',
    technologies: ['TypeScript', 'React', 'Mapbox', 'Firebase'],
    image: '🗺️',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Gear Recommendation Engine',
    description: 'AI-powered outdoor gear recommendations',
    longDescription: 'An intelligent recommendation system that suggests optimal outdoor gear based on weather conditions, trail difficulty, and user preferences using machine learning.',
    technologies: ['Python', 'TensorFlow', 'React', 'FastAPI'],
    image: '🎒',
    status: 'in-progress'
  },
  {
    id: '4',
    title: 'Virtual Mountain Experience',
    description: 'VR application for immersive mountain exploration',
    longDescription: 'A virtual reality application that allows users to explore famous mountains from around the world using 360° photography and 3D modeling.',
    technologies: ['Unity', 'C#', 'WebXR', 'Blender'],
    image: '🥽',
    status: 'planned'
  }
];

export const Projects: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'in-progress':
        return 'bg-accent text-white';
      case 'planned':
        return 'bg-stone text-white';
      default:
        return 'bg-stone text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '⚡';
      case 'planned':
        return '📋';
      default:
        return '📋';
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={cardVariants} className="text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-4xl font-display font-bold mb-4">
          Project Expeditions
        </h1>
        <p className={`text-xl ${isDark ? 'text-mist' : 'text-stone'} max-w-2xl mx-auto`}>
          Each project is a unique adventure, combining creativity, technology, and problem-solving 
          to reach new digital summits.
        </p>
      </motion.div>

      {/* Projects Grid */}
      <motion.div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            variants={cardVariants}
            className={`p-6 rounded-xl ${isDark ? 'bg-stone/10 hover:bg-stone/20' : 'bg-fog/30 hover:bg-fog/50'} 
              border ${isDark ? 'border-stone/20' : 'border-stone/10'} cursor-pointer group
              transition-all duration-300 hover:shadow-xl hover:shadow-accent/10`}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedProject(project)}
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                  {project.image}
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold group-hover:text-accent transition-colors duration-200">
                    {project.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)} {project.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Description */}
            <p className={`${isDark ? 'text-mist' : 'text-stone'} mb-4 line-clamp-2`}>
              {project.description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.slice(0, 3).map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-accent/20 text-accent' : 'bg-accent/10 text-accent-dark'}`}
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-stone/20' : 'bg-stone/10'}`}>
                  +{project.technologies.length - 3} more
                </span>
              )}
            </div>

            {/* Click indicator */}
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-mist/70' : 'text-stone/70'} group-hover:text-accent transition-colors duration-200`}>
                Click to explore
              </span>
              <motion.div
                className="text-accent"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div variants={cardVariants} className="text-center">
        <div className={`p-6 rounded-xl ${isDark ? 'bg-accent/10' : 'bg-accent/5'} border ${isDark ? 'border-accent/20' : 'border-accent/10'}`}>
          <h2 className="text-2xl font-display font-semibold mb-4 text-accent">
            Ready to Collaborate?
          </h2>
          <p className={`${isDark ? 'text-mist' : 'text-stone'} mb-4`}>
            I'm always excited to work on new projects and explore innovative solutions!
          </p>
          <motion.button
            className="px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-full font-medium transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Build Something Amazing
          </motion.button>
        </div>
      </motion.div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className={`max-w-2xl w-full ${isDark ? 'bg-cliff text-snow' : 'bg-snow text-cliff'} 
                rounded-xl p-8 max-h-[80vh] overflow-y-auto`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-5xl">{selectedProject.image}</div>
                  <div>
                    <h2 className="text-3xl font-display font-bold">{selectedProject.title}</h2>
                    <div className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedProject.status)} inline-block mt-2`}>
                      {getStatusIcon(selectedProject.status)} {selectedProject.status.replace('-', ' ')}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-stone/20' : 'hover:bg-stone/10'} transition-colors duration-200`}
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <p className={`text-lg ${isDark ? 'text-mist' : 'text-stone'} mb-6 leading-relaxed`}>
                {selectedProject.longDescription}
              </p>

              {/* Technologies */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 py-2 text-sm rounded-lg ${isDark ? 'bg-accent/20 text-accent' : 'bg-accent/10 text-accent-dark'}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <motion.button
                  className="flex-1 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg font-medium transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Demo
                </motion.button>
                <motion.button
                  className={`flex-1 py-3 ${isDark ? 'bg-stone/20 hover:bg-stone/30' : 'bg-stone/10 hover:bg-stone/20'} 
                    rounded-lg font-medium transition-colors duration-200`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Code
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
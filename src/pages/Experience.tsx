import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
  type: 'work' | 'education' | 'project';
  location: string;
}

const experiences: Experience[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Mountain Tech Solutions',
    period: '2023 - Present',
    description: 'Leading the development of innovative web applications with a focus on user experience and performance optimization.',
    achievements: [
      'Built responsive applications serving 100K+ users',
      'Improved app performance by 40% through optimization',
      'Led a team of 4 developers on major product launches',
      'Implemented modern design systems and component libraries'
    ],
    technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL'],
    type: 'work',
    location: 'Remote'
  },
  {
    id: '2',
    title: 'Full-Stack Developer',
    company: 'Digital Peaks Agency',
    period: '2022 - 2023',
    description: 'Developed full-stack web solutions for clients across various industries, from startups to enterprise companies.',
    achievements: [
      'Delivered 15+ client projects on time and within budget',
      'Integrated third-party APIs and payment systems',
      'Optimized database queries reducing load time by 60%',
      'Mentored junior developers and established best practices'
    ],
    technologies: ['Node.js', 'React', 'MongoDB', 'Express', 'AWS'],
    type: 'work',
    location: 'San Francisco, CA'
  },
  {
    id: '3',
    title: 'Frontend Developer',
    company: 'StartUp Valley',
    period: '2021 - 2022',
    description: 'Joined an early-stage startup to build their core product from the ground up, focusing on mobile-first design.',
    achievements: [
      'Built the initial MVP used by first 1000 customers',
      'Implemented responsive design for mobile and web',
      'Created interactive prototypes for investor presentations',
      'Established CI/CD pipeline reducing deployment time'
    ],
    technologies: ['Vue.js', 'JavaScript', 'SCSS', 'Firebase', 'Docker'],
    type: 'work',
    location: 'Austin, TX'
  },
  {
    id: '4',
    title: 'Computer Science Degree',
    company: 'University of Tech Mountains',
    period: '2017 - 2021',
    description: 'Comprehensive study in computer science with focus on web development, algorithms, and software engineering principles.',
    achievements: [
      'Graduated Magna Cum Laude (GPA: 3.8/4.0)',
      'Led university hackathon team to 2nd place finish',
      'Teaching assistant for Web Development courses',
      'Published research on web accessibility standards'
    ],
    technologies: ['Java', 'Python', 'HTML/CSS', 'JavaScript', 'SQL'],
    type: 'education',
    location: 'Boulder, CO'
  }
];

export const Experience: React.FC = () => {
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

  const timelineVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const getExperienceIcon = (type: string) => {
    switch (type) {
      case 'work':
        return '💼';
      case 'education':
        return '🎓';
      case 'project':
        return '🚀';
      default:
        return '📍';
    }
  };

  const getExperienceColor = (type: string) => {
    switch (type) {
      case 'work':
        return '#0EA5E9';
      case 'education':
        return '#8B5CF6';
      case 'project':
        return '#F59E0B';
      default:
        return '#6B7280';
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
      <motion.div variants={timelineVariants} className="text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-4xl font-display font-bold mb-4">
          Professional Journey
        </h1>
        <p className={`text-xl ${isDark ? 'text-mist' : 'text-stone'} max-w-2xl mx-auto`}>
          Every step of my career has been like ascending a new peak, 
          each with its own challenges, learnings, and spectacular views.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className={`absolute left-8 top-0 bottom-0 w-0.5 ${isDark ? 'bg-stone/30' : 'bg-stone/20'}`} />

        {/* Experience Items */}
        <div className="space-y-12">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              variants={timelineVariants}
              className="relative flex items-start space-x-8"
            >
              {/* Timeline Dot */}
              <div className="relative flex-shrink-0">
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-white dark:border-cliff"
                  style={{ backgroundColor: getExperienceColor(experience.type) }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {getExperienceIcon(experience.type)}
                </motion.div>
                
                {/* Connecting Line */}
                {index < experiences.length - 1 && (
                  <div 
                    className={`absolute top-16 left-1/2 w-0.5 h-12 transform -translate-x-1/2 ${isDark ? 'bg-stone/30' : 'bg-stone/20'}`} 
                  />
                )}
              </div>

              {/* Experience Content */}
              <motion.div
                className={`flex-1 p-6 rounded-xl ${isDark ? 'bg-stone/10' : 'bg-fog/30'} border ${isDark ? 'border-stone/20' : 'border-stone/10'} group hover:shadow-lg transition-all duration-300`}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-display font-semibold group-hover:text-accent transition-colors duration-200">
                      {experience.title}
                    </h3>
                    <p className="text-lg text-accent font-medium">
                      {experience.company}
                    </p>
                    <div className={`flex items-center space-x-4 mt-2 text-sm ${isDark ? 'text-mist' : 'text-stone'}`}>
                      <span className="flex items-center space-x-1">
                        <span>📅</span>
                        <span>{experience.period}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>📍</span>
                        <span>{experience.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className={`${isDark ? 'text-mist' : 'text-stone'} mb-4 leading-relaxed`}>
                  {experience.description}
                </p>

                {/* Achievements */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="mr-2">✨</span>
                    Key Achievements
                  </h4>
                  <ul className="space-y-1">
                    {experience.achievements.map((achievement, achievementIndex) => (
                      <motion.li
                        key={achievementIndex}
                        className={`flex items-start space-x-2 text-sm ${isDark ? 'text-mist' : 'text-stone'}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + achievementIndex * 0.05, duration: 0.3 }}
                      >
                        <span className="text-accent">•</span>
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="mr-2">🛠️</span>
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        className={`px-3 py-1 text-xs rounded-full ${isDark ? 'bg-accent/20 text-accent' : 'bg-accent/10 text-accent-dark'}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + techIndex * 0.03, duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <motion.div 
        variants={timelineVariants} 
        className={`p-6 rounded-xl ${isDark ? 'bg-accent/10' : 'bg-accent/5'} border ${isDark ? 'border-accent/20' : 'border-accent/10'} text-center`}
      >
        <div className="text-4xl mb-4">📈</div>
        <h2 className="text-2xl font-display font-semibold mb-4 text-accent">
          The Journey Continues
        </h2>
        <p className={`${isDark ? 'text-mist' : 'text-stone'} max-w-3xl mx-auto text-lg leading-relaxed`}>
          Each role has been a stepping stone to greater heights. From my early days learning the fundamentals 
          to now leading complex projects, every experience has shaped my approach to problem-solving and collaboration. 
          The summit is always just another starting point for the next adventure!
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { number: '4+', label: 'Years Experience', icon: '🚀' },
            { number: '50+', label: 'Projects Completed', icon: '✅' },
            { number: '10+', label: 'Technologies Mastered', icon: '⚡' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white/30'}`}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-accent mb-1">{stat.number}</div>
              <div className={`text-sm ${isDark ? 'text-mist' : 'text-stone'}`}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
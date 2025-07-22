import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface DarkModeToggleProps {
  className?: string;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = '' }) => {
  const { isDark, toggleMode, sceneTime } = useTheme();

  // Get appropriate icons based on scene time
  const getIcons = () => {
    switch (sceneTime) {
      case 'sunset':
        return { light: '🌅', dark: '🌆' };
      case 'night':
        return { light: '🌙', dark: '✨' };
      default:
        return { light: '☀️', dark: '🌙' };
    }
  };

  const icons = getIcons();

  return (
    <motion.button
      onClick={toggleMode}
      className={`relative flex items-center w-16 h-8 rounded-full border-2 transition-all duration-300 ${
        isDark
          ? 'bg-night border-accent text-snow'
          : 'bg-snow border-accent-dark text-cliff'
      } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 rounded-full opacity-30 transition-all duration-500 ${
          isDark
            ? 'bg-gradient-to-r from-night to-cliff'
            : 'bg-gradient-to-r from-sky-200 to-yellow-200'
        }`}
      />
      
      {/* Toggle Switch */}
      <motion.div
        className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-lg ${
          isDark
            ? 'bg-cliff text-snow'
            : 'bg-yellow-400 text-yellow-900'
        }`}
        animate={{
          x: isDark ? 32 : 2,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          duration: 0.3
        }}
        style={{
          filter: isDark 
            ? 'drop-shadow(0 0 8px rgba(14, 165, 233, 0.5))'
            : 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))'
        }}
      >
        {isDark ? icons.dark : icons.light}
      </motion.div>

      {/* Scene time indicator */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-xs opacity-60">
        <motion.span
          animate={{ opacity: isDark ? 0.3 : 0.8 }}
          transition={{ duration: 0.3 }}
        >
          {icons.light}
        </motion.span>
        <motion.span
          animate={{ opacity: isDark ? 0.8 : 0.3 }}
          transition={{ duration: 0.3 }}
        >
          {icons.dark}
        </motion.span>
      </div>

      {/* Animated particles */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
          {Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-1 h-1 bg-accent rounded-full"
              style={{
                left: `${20 + index * 25}%`,
                top: '50%',
              }}
              animate={{
                y: [-2, 2, -2],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2 + index * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
};
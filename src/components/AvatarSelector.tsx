import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourneyState, Avatar } from '../hooks/useJourneyState';
import { useTheme } from '../contexts/ThemeContext';

const avatars: Avatar[] = [
  {
    id: 'hiker',
    name: 'Mountain Hiker',
    imagePath: '🧗‍♂️',
    description: 'A seasoned explorer ready for the climb'
  },
  {
    id: 'coder',
    name: 'Tech Explorer',
    imagePath: '👨‍💻',
    description: 'A developer navigating the digital peaks'
  },
  {
    id: 'adventurer',
    name: 'Bold Adventurer',
    imagePath: '🚀',
    description: 'Fearless and ready for any challenge'
  },
  {
    id: 'climber',
    name: 'Peak Climber',
    imagePath: '⛷️',
    description: 'Expert in reaching new heights'
  },
];

interface AvatarSelectorProps {
  className?: string;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark } = useTheme();
  const { selectedAvatar, selectAvatar } = useJourneyState();

  const handleAvatarSelect = (avatar: Avatar) => {
    selectAvatar(avatar);
    setIsOpen(false);
  };

  const currentAvatar = selectedAvatar || avatars[0];

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-full border-2 transition-all duration-300 ${
          isDark
            ? 'bg-cliff/50 border-accent/50 hover:border-accent text-snow'
            : 'bg-snow/50 border-accent-dark/50 hover:border-accent-dark text-cliff'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Select avatar"
      >
        {/* Avatar Icon */}
        <motion.div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xl"
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.1 : 1
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {currentAvatar.imagePath}
        </motion.div>

        {/* Avatar Name (hidden on mobile) */}
        <span className="hidden sm:block text-sm font-medium">
          {currentAvatar.name}
        </span>

        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm"
        >
          ▼
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Panel */}
            <motion.div
              className={`absolute top-full right-0 mt-2 w-72 rounded-xl shadow-2xl border z-20 ${
                isDark
                  ? 'bg-cliff border-stone/20'
                  : 'bg-snow border-stone/10'
              } backdrop-blur-md`}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Header */}
              <div className={`p-4 border-b ${
                isDark ? 'border-stone/20' : 'border-stone/10'
              }`}>
                <h3 className="text-lg font-display font-semibold flex items-center">
                  <span className="mr-2">🎭</span>
                  Choose Your Avatar
                </h3>
                <p className={`text-sm ${isDark ? 'text-mist' : 'text-stone'}`}>
                  Select your climbing companion for the journey
                </p>
              </div>

              {/* Avatar Options */}
              <div className="p-2 space-y-1">
                {avatars.map((avatar, index) => (
                  <motion.button
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      currentAvatar.id === avatar.id
                        ? isDark
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'bg-accent/10 text-accent-dark border border-accent/30'
                        : isDark
                        ? 'hover:bg-stone/10 text-snow'
                        : 'hover:bg-stone/5 text-cliff'
                    }`}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar Icon */}
                      <motion.div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                          currentAvatar.id === avatar.id
                            ? 'bg-accent/20'
                            : isDark
                            ? 'bg-stone/20'
                            : 'bg-stone/10'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {avatar.imagePath}
                      </motion.div>

                      {/* Avatar Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{avatar.name}</h4>
                          {currentAvatar.id === avatar.id && (
                            <motion.div
                              className="text-accent"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3, ease: "backOut" }}
                            >
                              ✓
                            </motion.div>
                          )}
                        </div>
                        <p className={`text-sm ${
                          currentAvatar.id === avatar.id
                            ? isDark ? 'text-accent/80' : 'text-accent-dark/80'
                            : isDark ? 'text-mist/80' : 'text-stone/80'
                        }`}>
                          {avatar.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className={`p-4 border-t ${
                isDark ? 'border-stone/20' : 'border-stone/10'
              }`}>
                <p className={`text-xs ${isDark ? 'text-mist/60' : 'text-stone/60'} text-center`}>
                  Your avatar will appear as you climb the mountain! 🏔️
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Avatar Animation Indicator */}
      {currentAvatar && (
        <motion.div
          className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white dark:border-cliff"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
};
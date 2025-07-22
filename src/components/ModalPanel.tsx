import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourneyState } from '../hooks/useJourneyState';
import { useTheme } from '../contexts/ThemeContext';

// Import page components
import { About } from '../pages/About';
import { Projects } from '../pages/Projects';
import { Skills } from '../pages/Skills';
import { Experience } from '../pages/Experience';
import { Contact } from '../pages/Contact';

interface ModalPanelProps {
  className?: string;
}

export const ModalPanel: React.FC<ModalPanelProps> = ({ className = '' }) => {
  const { isModalOpen, modalContent, closeModal, completePin } = useJourneyState();
  const { isDark } = useTheme();

  // Get the appropriate content component
  const getModalContent = () => {
    switch (modalContent) {
      case 'about':
        return <About />;
      case 'projects':
        return <Projects />;
      case 'skills':
        return <Skills />;
      case 'experience':
        return <Experience />;
      case 'contact':
        return <Contact />;
      default:
        return null;
    }
  };

  const handleClose = () => {
    if (modalContent) {
      completePin(modalContent);
    }
    closeModal();
  };

  // Modal backdrop variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Modal panel variants
  const panelVariants = {
    hidden: { 
      x: '100%',
      opacity: 0,
      scale: 0.95
    },
    visible: { 
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        duration: 0.6
      }
    },
    exit: { 
      x: '100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Content animation variants
  const contentVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className={`fixed inset-0 z-50 ${className}`}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className={`absolute inset-0 ${isDark ? 'bg-night/80' : 'bg-stone/60'} backdrop-blur-md`} />
          
          {/* Modal Panel */}
          <motion.div
            className={`absolute right-0 top-0 h-full w-full max-w-2xl ${
              isDark ? 'bg-cliff text-snow' : 'bg-snow text-cliff'
            } shadow-2xl overflow-hidden flex flex-col`}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              isDark ? 'border-stone/20' : 'border-stone/10'
            }`}>
              <div className="flex items-center space-x-3">
                {/* Pin indicator */}
                <motion.div
                  className="w-3 h-3 rounded-full bg-accent"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <h2 className="text-2xl font-display font-bold capitalize">
                  {modalContent}
                </h2>
              </div>
              
              {/* Close button */}
              <motion.button
                className={`p-2 rounded-full ${
                  isDark ? 'hover:bg-stone/20 text-mist' : 'hover:bg-stone/10 text-stone'
                } transition-colors duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
            
            {/* Content */}
            <motion.div
              className="flex-1 overflow-y-auto p-6"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              {getModalContent()}
            </motion.div>
            
            {/* Footer with character */}
            <div className={`p-6 border-t ${
              isDark ? 'border-stone/20' : 'border-stone/10'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Animated character */}
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center text-white text-2xl"
                    animate={{
                      y: [0, -2, 0],
                      rotate: [-5, 5, -5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    👋
                  </motion.div>
                  <div>
                    <p className="text-sm opacity-80">
                      Great job exploring this milestone!
                    </p>
                  </div>
                </div>
                
                {/* Continue button */}
                <motion.button
                  className="px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-full font-medium transition-colors duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                >
                  <span>Continue Climbing</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          {/* Floating decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Animated particles */}
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                className="absolute w-2 h-2 bg-accent/30 rounded-full"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + (index % 3) * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3
                }}
              />
            ))}
            
            {/* Mountain silhouette decoration */}
            <motion.div
              className="absolute bottom-0 left-0 w-full h-32 opacity-5"
              style={{
                background: 'linear-gradient(45deg, transparent 60%, currentColor 60.5%, currentColor 70%, transparent 70.5%)'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.05, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
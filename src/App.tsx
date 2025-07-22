import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { useJourneyState } from './hooks/useJourneyState';
import { useTheme } from './contexts/ThemeContext';

// Components
import { Navbar } from './components/Navbar';
import { MountainScene } from './components/3D/MountainScene';
import { TrailPath } from './components/TrailPath';
import { PinMarkers } from './components/PinMarker';
import { ModalPanel } from './components/ModalPanel';

// Main App Content Component (needs to be inside providers)
const AppContent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark, sceneTime } = useTheme();
  const { 
    setScrollProgress, 
    altitude, 
    hasReachedSummit,
    showCelebration,
    selectedAvatar,
    avatarPosition,
    moveAvatar,
    reachSummit
  } = useJourneyState();

  // Throttled scroll handler for performance
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = documentHeight - windowHeight;

    if (maxScroll > 0) {
      const scrollProgress = Math.min(scrollTop / maxScroll, 1);
      setScrollProgress(scrollProgress);

      // Move avatar based on scroll progress
      const newAvatarY = 95 - (scrollProgress * 90);
      const newAvatarX = 50 + Math.sin(scrollProgress * Math.PI * 2) * 10;
      moveAvatar(newAvatarX, newAvatarY);

      // Check if reached summit
      if (scrollProgress >= 0.95 && !hasReachedSummit) {
        reachSummit();
      }
    }
  }, [setScrollProgress, moveAvatar, hasReachedSummit, reachSummit]);

  // Throttled scroll event listener
  useEffect(() => {
    let ticking = false;

    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  // Background style based on theme and altitude
  const getBackgroundStyle = () => {
    const baseGradient = (() => {
      switch (sceneTime) {
        case 'night':
          return `linear-gradient(180deg, 
            #0F172A 0%, 
            #1E293B ${Math.max(30, 100 - altitude)}%, 
            #334155 ${Math.max(60, 100 - altitude/2)}%, 
            #475569 100%)`;
        case 'sunset':
          return `linear-gradient(180deg, 
            #FED7AA 0%, 
            #FB923C ${Math.max(30, 100 - altitude)}%, 
            #9A3412 ${Math.max(60, 100 - altitude/2)}%, 
            #7C2D12 100%)`;
        default:
          return `linear-gradient(180deg, 
            #87CEEB 0%, 
            #98D8E8 ${Math.max(30, 100 - altitude)}%, 
            #B0E0E6 ${Math.max(60, 100 - altitude/2)}%, 
            #E0F6FF 100%)`;
      }
    })();

    return {
      background: baseGradient,
      transition: 'background 1s ease-in-out'
    };
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden"
      style={getBackgroundStyle()}
    >
      {/* Navigation */}
      <Navbar />
      
      {/* Main Mountain Experience */}
      <div className="relative">
        {/* 3D Mountain Scene - Fixed Background */}
        <div className="fixed inset-0 z-0">
          <MountainScene />
        </div>

        {/* Trail Path Overlay */}
        <div className="fixed inset-0 z-10 pointer-events-none">
          <TrailPath />
        </div>

        {/* Pin Markers */}
        <div className="fixed inset-0 z-20">
          <PinMarkers />
        </div>

        {/* Avatar */}
        {selectedAvatar && (
          <motion.div
            className="fixed z-15 pointer-events-none"
            style={{
              left: `${avatarPosition.x}%`,
              top: `${avatarPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [-5, 5, -5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-4xl drop-shadow-lg">
              {selectedAvatar.imagePath}
            </div>
          </motion.div>
        )}

        {/* Scroll Content - This creates the scrollable height */}
        <div className="relative z-30">
          {/* Starting section */}
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              className="text-center max-w-4xl mx-auto px-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-display font-bold mb-6 text-white drop-shadow-2xl"
                animate={{ 
                  scale: [1, 1.02, 1],
                  textShadow: [
                    '0 4px 20px rgba(0,0,0,0.3)',
                    '0 8px 40px rgba(0,0,0,0.4)',
                    '0 4px 20px rgba(0,0,0,0.3)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                Welcome to My Journey
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed drop-shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                Embark on an immersive adventure through my professional story, 
                where each scroll takes you higher up the mountain of my career and skills.
              </motion.p>

              <motion.div
                className="flex flex-col items-center space-y-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-4xl">👇</div>
                <p className="text-white/80 font-medium">Scroll to begin your ascent</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Journey sections - create scroll height based on pins */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="min-h-screen" />
          ))}

          {/* Summit section */}
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              className="text-center max-w-4xl mx-auto px-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: hasReachedSummit ? 1 : 0.3,
                scale: hasReachedSummit ? 1 : 0.8
              }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                animate={showCelebration ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0]
                } : {}}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                <div className="text-8xl mb-8">🏆</div>
              </motion.div>
              
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white drop-shadow-2xl">
                Summit Reached!
              </h2>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed drop-shadow-lg">
                Congratulations! You've completed the journey through my portfolio. 
                From here, the view encompasses all my skills, projects, and experiences.
              </p>

              <motion.button
                className="px-8 py-4 bg-accent hover:bg-accent-dark text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <span className="flex items-center space-x-2">
                  <span>Start New Adventure</span>
                  <span>🔄</span>
                </span>
              </motion.button>

              {showCelebration && (
                <div className="fixed inset-0 pointer-events-none z-50">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-2xl"
                      initial={{
                        x: '50vw',
                        y: '50vh',
                        opacity: 0,
                        scale: 0
                      }}
                      animate={{
                        x: `${50 + (Math.random() - 0.5) * 100}vw`,
                        y: `${50 + (Math.random() - 0.5) * 100}vh`,
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0]
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                    >
                      {['🎉', '✨', '🌟', '🎊', '🏔️'][Math.floor(Math.random() * 5)]}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal Panel */}
      <ModalPanel />

      {/* Floating Progress Indicator */}
      <motion.div
        className={`fixed bottom-6 left-6 z-40 px-4 py-2 rounded-full ${
          isDark ? 'bg-night/80' : 'bg-snow/80'
        } backdrop-blur-md border ${
          isDark ? 'border-stone/20' : 'border-stone/10'
        } text-sm font-medium`}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span>Altitude: {Math.round(altitude)}%</span>
        </div>
      </motion.div>
    </div>
  );
};

// Main App Component with Providers
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App; 
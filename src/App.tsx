import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';

// Simple pin interface
interface Pin {
  id: string;
  label: string;
  x: number;
  y: number;
  altitude: number;
  icon: string;
  color: string;
}

const pins: Pin[] = [
  { id: 'about', label: 'About Me', x: 20, y: 85, altitude: 15, icon: '👋', color: '#059669' },
  { id: 'projects', label: 'Projects', x: 75, y: 65, altitude: 35, icon: '🚀', color: '#0EA5E9' },
  { id: 'skills', label: 'Skills', x: 30, y: 45, altitude: 55, icon: '⚡', color: '#8B5CF6' },
  { id: 'experience', label: 'Experience', x: 65, y: 25, altitude: 75, icon: '🏆', color: '#F59E0B' },
  { id: 'contact', label: 'Contact', x: 50, y: 5, altitude: 95, icon: '📧', color: '#EF4444' },
];

const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentAltitude, setCurrentAltitude] = useState(0);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Handle scroll progress
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = documentHeight - windowHeight;

    if (maxScroll > 0) {
      const progress = Math.min(scrollTop / maxScroll, 1);
      setScrollProgress(progress);
      setCurrentAltitude(Math.round(progress * 100));
    }
  }, []);

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

  // Mountain background style
  const mountainStyle = {
    background: isDark 
      ? `
        radial-gradient(ellipse at bottom, #1e293b 0%, #0f172a 100%),
        linear-gradient(135deg, #64748b 25%, transparent 25%),
        linear-gradient(225deg, #64748b 25%, transparent 25%),
        linear-gradient(45deg, #475569 25%, transparent 25%),
        linear-gradient(315deg, #475569 25%, #1e293b 25%)
      `
      : `
        radial-gradient(ellipse at bottom, #87ceeb 0%, #98d8e8 100%),
        linear-gradient(135deg, #a8dadc 25%, transparent 25%),
        linear-gradient(225deg, #a8dadc 25%, transparent 25%),
        linear-gradient(45deg, #457b9d 25%, transparent 25%),
        linear-gradient(315deg, #457b9d 25%, #f1faee 25%)
      `,
    backgroundSize: '60px 60px, 60px 60px, 60px 60px, 60px 60px, 60px 60px',
    transition: 'all 1s ease'
  };

  return (
    <div className="relative">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🏔️</span>
              <h1 className="text-xl font-bold text-white">Mountain Journey</h1>
            </div>

            <div className="flex items-center space-x-6">
              {pins.map((pin) => (
                <button
                  key={pin.id}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    currentAltitude >= pin.altitude - 10 
                      ? 'text-white bg-white/20 hover:bg-white/30' 
                      : 'text-white/50 cursor-not-allowed'
                  }`}
                  onClick={() => currentAltitude >= pin.altitude - 10 && setSelectedPin(pin.id)}
                >
                  <span className="mr-2">{pin.icon}</span>
                  {pin.label}
                </button>
              ))}
              
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </nav>

      {/* Mountain Scene */}
      <div 
        className="fixed inset-0 z-0"
        style={mountainStyle}
      >
        {/* Altitude Indicator */}
        <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">📈</span>
            <span className="font-semibold">{currentAltitude}% Altitude</span>
          </div>
        </div>

        {/* Trail Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="trailGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <path
            d={`M 50 95 Q 30 75 20 85 Q 40 55 75 65 Q 50 35 30 45 Q 55 15 65 25 Q 45 5 50 5`}
            fill="none"
            stroke="url(#trailGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1000"
            strokeDashoffset={1000 - (scrollProgress * 1000)}
            style={{ 
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
              transition: 'stroke-dashoffset 0.3s ease'
            }}
          />
        </svg>

        {/* Interactive Pins */}
        {pins.map((pin) => {
          const isAccessible = currentAltitude >= pin.altitude - 15;
          const isActive = currentAltitude >= pin.altitude - 10 && currentAltitude <= pin.altitude + 10;
          
          return (
            <motion.button
              key={pin.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                isAccessible 
                  ? 'bg-white/90 hover:bg-white hover:scale-110 shadow-lg cursor-pointer' 
                  : 'bg-gray-500/50 cursor-not-allowed'
              } ${
                isActive ? 'ring-4 ring-white/50 animate-pulse' : ''
              }`}
              style={{
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                boxShadow: isAccessible ? `0 4px 20px ${pin.color}40` : 'none'
              }}
              onClick={() => isAccessible && setSelectedPin(pin.id)}
              whileHover={isAccessible ? { scale: 1.1 } : {}}
              whileTap={isAccessible ? { scale: 0.95 } : {}}
            >
              {isAccessible ? pin.icon : '🔒'}
            </motion.button>
          );
        })}

        {/* Avatar Character */}
        <motion.div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 text-4xl z-10"
          style={{
            left: `${50 + Math.sin(scrollProgress * Math.PI * 2) * 10}%`,
            top: `${95 - (scrollProgress * 90)}%`
          }}
          animate={{
            rotate: [-5, 5, -5],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🧗‍♂️
        </motion.div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Welcome Section */}
        <section className="min-h-screen flex items-center justify-center text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-8 drop-shadow-2xl">
              Welcome to My Journey
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Scroll to climb the mountain of my professional story
            </p>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              👇
            </motion.div>
          </motion.div>
        </section>

        {/* Journey Sections */}
        {Array.from({ length: 5 }, (_, i) => (
          <section key={i} className="min-h-screen" />
        ))}

        {/* Summit Section */}
        <section className="min-h-screen flex items-center justify-center text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: currentAltitude >= 90 ? 1 : 0.3,
              scale: currentAltitude >= 90 ? 1 : 0.8
            }}
            className="max-w-4xl"
          >
            <div className="text-8xl mb-8">🏆</div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Summit Reached!
            </h2>
            <p className="text-xl mb-8">
              Congratulations! You've completed the journey through my portfolio.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform"
            >
              Start New Adventure 🔄
            </button>
          </motion.div>
        </section>
      </div>

      {/* Modal */}
      {selectedPin && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedPin(null)}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-6 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {pins.find(p => p.id === selectedPin) && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-bold flex items-center">
                    <span className="mr-3 text-4xl">
                      {pins.find(p => p.id === selectedPin)?.icon}
                    </span>
                    {pins.find(p => p.id === selectedPin)?.label}
                  </h3>
                  <button
                    onClick={() => setSelectedPin(null)}
                    className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Welcome to the <strong>{pins.find(p => p.id === selectedPin)?.label}</strong> section of my journey!
                  </p>
                  <p>
                    This milestone represents an important part of my professional story. 
                    Each step up this mountain has been a learning experience, bringing new challenges and growth.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🎯 Key Highlights:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Professional growth and development</li>
                      <li>Technical skills and expertise</li>
                      <li>Project achievements and milestones</li>
                      <li>Collaborative experiences and leadership</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setSelectedPin(null)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform"
                  >
                    Continue Climbing 🏔️
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default App; 
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useJourneyState } from '../hooks/useJourneyState';
import { DarkModeToggle } from './DarkModeToggle';
import { AvatarSelector } from './AvatarSelector';

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const { isDark } = useTheme();
  const { pins, currentPin, altitude } = useJourneyState();

  const scrollToPin = (pinId: string) => {
    const pin = pins.find(p => p.id === pinId);
    if (pin) {
      // Calculate the scroll position based on altitude
      const targetAltitude = pin.altitudePercent;
      const scrollProgress = targetAltitude / 100;
      const scrollTop = scrollProgress * (document.documentElement.scrollHeight - window.innerHeight);
      
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-40 ${className}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={`backdrop-blur-md border-b ${
        isDark 
          ? 'bg-night/80 border-stone/20' 
          : 'bg-snow/80 border-stone/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl">🏔️</div>
              <div>
                <h1 className="text-xl font-display font-bold">Mountain Journey</h1>
                <p className={`text-xs ${isDark ? 'text-mist' : 'text-stone'}`}>
                  Portfolio Adventure
                </p>
              </div>
            </motion.div>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {pins.map((pin) => (
                <motion.button
                  key={pin.id}
                  onClick={() => scrollToPin(pin.id)}
                  className={`relative px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    currentPin === pin.id
                      ? 'text-accent bg-accent/10'
                      : isDark
                      ? 'text-mist hover:text-accent hover:bg-accent/5'
                      : 'text-stone hover:text-accent hover:bg-accent/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center space-x-2">
                    <span>{pin.icon}</span>
                    <span>{pin.label}</span>
                  </span>
                  
                  {/* Active indicator */}
                  {currentPin === pin.id && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-accent"
                      layoutId="activeNav"
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              <AvatarSelector />
              <DarkModeToggle />
              
              {/* Mobile menu button */}
              <motion.button
                className={`md:hidden p-2 rounded-lg ${
                  isDark ? 'hover:bg-stone/20' : 'hover:bg-stone/10'
                } transition-colors duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-1">
          <div className={`absolute inset-0 ${
            isDark ? 'bg-stone/20' : 'bg-stone/10'
          }`} />
          <motion.div
            className="absolute inset-y-0 left-0 bg-accent"
            style={{ width: `${altitude}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          
          {/* Trail markers on progress bar */}
          {pins.map((pin) => (
            <motion.div
              key={pin.id}
              className={`absolute top-0 w-3 h-full ${
                altitude >= pin.altitudePercent - 5 ? 'bg-success' : 'bg-stone/40'
              } transition-colors duration-300`}
              style={{ left: `${pin.altitudePercent}%`, transform: 'translateX(-50%)' }}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        {/* Altitude display */}
        <motion.div
          className={`absolute top-full right-4 mt-2 px-3 py-1 rounded-full text-xs font-medium ${
            isDark 
              ? 'bg-cliff/90 text-snow' 
              : 'bg-snow/90 text-cliff'
          } backdrop-blur-sm border ${
            isDark ? 'border-stone/20' : 'border-stone/10'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <span>📈</span>
            <span>{Math.round(altitude)}% Altitude</span>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};
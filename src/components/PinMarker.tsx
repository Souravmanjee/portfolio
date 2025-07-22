import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourneyState, JourneyPin } from '../hooks/useJourneyState';
import { useTheme } from '../contexts/ThemeContext';

interface PinMarkerProps {
  pin: JourneyPin;
  isActive: boolean;
  isCompleted: boolean;
  onPinClick: (pinId: string) => void;
  className?: string;
}

export const PinMarker: React.FC<PinMarkerProps> = ({
  pin,
  isActive,
  isCompleted,
  onPinClick,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { sceneTime } = useTheme();
  const altitude = useJourneyState(state => state.altitude);

  // Determine if pin is accessible (within altitude range)
  const isAccessible = altitude >= pin.altitudePercent - 15;
  const isNearby = Math.abs(altitude - pin.altitudePercent) <= 10;

  // Dynamic pin colors based on state and theme
  const getPinColors = () => {
    if (isCompleted) {
      return {
        bg: '#10B981',
        glow: '#34D399',
        border: '#059669'
      };
    }
    
    if (isActive) {
      return {
        bg: pin.color,
        glow: pin.color,
        border: '#FFFFFF'
      };
    }
    
    if (!isAccessible) {
      return {
        bg: sceneTime === 'night' ? '#374151' : '#9CA3AF',
        glow: 'transparent',
        border: sceneTime === 'night' ? '#6B7280' : '#D1D5DB'
      };
    }
    
    return {
      bg: pin.color,
      glow: isHovered ? pin.color : 'transparent',
      border: sceneTime === 'night' ? '#E5E7EB' : '#374151'
    };
  };

  const colors = getPinColors();

  // Pin bounce animation when becoming accessible
  const accessibleAnimation = isAccessible && !isCompleted ? {
    scale: [1, 1.2, 1],
    transition: { duration: 0.6, ease: "backOut" }
  } : {};

  const handleClick = () => {
    if (!isAccessible) return;
    onPinClick(pin.id);
  };

  return (
    <div 
      className={`absolute ${className}`}
      style={{
        left: `${pin.x}%`,
        top: `${pin.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isActive ? 30 : isNearby ? 20 : 10,
      }}
    >
      {/* Pin marker */}
      <motion.div
        className={`relative cursor-pointer ${!isAccessible ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          ...accessibleAnimation
        }}
        whileHover={isAccessible ? { scale: 1.1 } : {}}
        whileTap={isAccessible ? { scale: 0.95 } : {}}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Glow effect */}
        {(isActive || isHovered) && isAccessible && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.glow}40 0%, transparent 70%)`,
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
        
        {/* Main pin body */}
        <motion.div
          className="relative w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg"
          style={{
            backgroundColor: colors.bg,
            borderColor: colors.border,
            boxShadow: isAccessible ? 
              `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 8px ${colors.glow}40` :
              '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
          animate={isActive ? {
            scale: [1, 1.1, 1],
            transition: { duration: 2, repeat: Infinity }
          } : {}}
        >
          {/* Pin icon */}
          <span className="text-lg">
            {isCompleted ? '✓' : pin.icon}
          </span>
          
          {/* Accessibility indicator */}
          {!isAccessible && (
            <motion.div
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-white text-xs">🔒</span>
            </motion.div>
          )}
        </motion.div>
        
        {/* Pin tooltip */}
        <AnimatePresence>
          {isHovered && isAccessible && (
            <motion.div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap backdrop-blur-sm"
              initial={{ opacity: 0, y: 5, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {pin.label}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Altitude requirement indicator */}
        {!isAccessible && isHovered && (
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-red-600/90 text-white text-xs rounded whitespace-nowrap backdrop-blur-sm"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            Reach {pin.altitudePercent}% altitude
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-red-600/90" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Ripple effect for active pin */}
      {isActive && isAccessible && (
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: colors.glow }}
          animate={{
            scale: [1, 2, 3],
            opacity: [0.8, 0.3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      )}
      
      {/* Progress indicator line to ground */}
      {isAccessible && (
        <motion.div
          className="absolute top-full left-1/2 w-0.5 bg-gradient-to-b opacity-30"
          style={{
            background: `linear-gradient(to bottom, ${colors.bg}, transparent)`,
            height: `${Math.max(0, 95 - pin.y)}vh`,
            transform: 'translateX(-50%)',
          }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      )}
    </div>
  );
};

// Container component for all pins
interface PinMarkersProps {
  className?: string;
}

export const PinMarkers: React.FC<PinMarkersProps> = ({ className = '' }) => {
  const { pins, currentPin, completedPins, openModal } = useJourneyState();

  const handlePinClick = (pinId: string) => {
    openModal(pinId);
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {pins.map((pin) => (
        <PinMarker
          key={pin.id}
          pin={pin}
          isActive={currentPin === pin.id}
          isCompleted={completedPins.includes(pin.id)}
          onPinClick={handlePinClick}
          className="pointer-events-auto"
        />
      ))}
    </div>
  );
};
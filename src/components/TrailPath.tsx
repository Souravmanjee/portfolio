import React, { useMemo, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useJourneyState } from '../hooks/useJourneyState';
import { useTheme } from '../contexts/ThemeContext';

interface TrailPathProps {
  className?: string;
}

export const TrailPath: React.FC<TrailPathProps> = ({ className = '' }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const controls = useAnimation();
  const { sceneTime } = useTheme();
  const { pins, trailProgress, completedPins } = useJourneyState();

  // Generate curved path connecting all pins
  const pathData = useMemo(() => {
    if (pins.length === 0) return '';

    const sortedPins = [...pins].sort((a, b) => b.altitudePercent - a.altitudePercent);
    
    // Convert pin positions to SVG coordinates (viewBox is 100x100)
    const pathPoints = sortedPins.map(pin => ({
      x: pin.x,
      y: pin.y,
      id: pin.id
    }));

    // Add starting point at the bottom
    pathPoints.push({ x: 50, y: 95, id: 'start' });

    // Create smooth curved path using quadratic curves
    let pathString = `M ${pathPoints[pathPoints.length - 1].x} ${pathPoints[pathPoints.length - 1].y}`;

    for (let i = pathPoints.length - 2; i >= 0; i--) {
      const current = pathPoints[i];
      const previous = pathPoints[i + 1] || pathPoints[i];
      
      // Calculate control point for smooth curve
      const controlX = (current.x + previous.x) / 2 + (Math.random() - 0.5) * 10;
      const controlY = (current.y + previous.y) / 2;
      
      pathString += ` Q ${controlX} ${controlY} ${current.x} ${current.y}`;
    }

    return pathString;
  }, [pins]);

  // Calculate path length for animation
  const pathLength = useMemo(() => {
    if (!pathRef.current) return 1000;
    return pathRef.current.getTotalLength();
  }, [pathData]);

  // Animate path based on scroll progress
  useEffect(() => {
    const drawLength = (trailProgress / 100) * pathLength;
    
    if (pathRef.current) {
      pathRef.current.style.strokeDasharray = `${pathLength}`;
      pathRef.current.style.strokeDashoffset = `${pathLength - drawLength}`;
    }
  }, [trailProgress, pathLength]);

  // Dynamic trail colors based on theme
  const trailColors = useMemo(() => {
    switch (sceneTime) {
      case 'night':
        return {
          main: '#0EA5E9',
          glow: '#38BDF8',
          completed: '#10B981'
        };
      case 'sunset':
        return {
          main: '#F59E0B',
          glow: '#FBBF24',
          completed: '#EF4444'
        };
      default:
        return {
          main: '#059669',
          glow: '#10B981',
          completed: '#3B82F6'
        };
    }
  }, [sceneTime]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Background path (full route) */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2,2"
        />
        
        {/* Main animated trail */}
        <path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke={trailColors.main}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 4px ${trailColors.glow})`,
            transition: 'stroke-dashoffset 0.3s ease-out'
          }}
        />
        
        {/* Completed sections with different styling */}
        {completedPins.map((pinId, index) => {
          const pin = pins.find(p => p.id === pinId);
          if (!pin) return null;
          
          return (
            <motion.circle
              key={pinId}
              cx={pin.x}
              cy={pin.y}
              r="1"
              fill={trailColors.completed}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              style={{
                filter: `drop-shadow(0 0 3px ${trailColors.completed})`
              }}
            />
          );
        })}
        
        {/* Animated progress indicator */}
        {trailProgress > 0 && (
          <motion.circle
            cx="50"
            cy={95 - (trailProgress * 0.9)}
            r="1.5"
            fill={trailColors.glow}
            initial={{ scale: 0 }}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              filter: `drop-shadow(0 0 6px ${trailColors.glow})`
            }}
          />
        )}
        
        {/* Trail sparkles for visual appeal */}
        {trailProgress > 20 && (
          <g>
            {[0.3, 0.6, 0.8].map((position, index) => (
              <motion.circle
                key={index}
                cx={50 + (Math.sin(position * Math.PI) * 15)}
                cy={95 - (position * trailProgress * 0.9)}
                r="0.5"
                fill="rgba(255, 255, 255, 0.8)"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </g>
        )}
        
        {/* Summit celebration effect */}
        {trailProgress >= 95 && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
          >
            {/* Flag at summit */}
            <rect
              x="48"
              y="3"
              width="4"
              height="6"
              fill={trailColors.completed}
              rx="0.5"
            />
            <path
              d="M 52 3 L 58 5 L 52 7 Z"
              fill={trailColors.main}
            />
            
            {/* Celebration sparkles */}
            {Array.from({ length: 8 }).map((_, index) => {
              const angle = (index / 8) * 2 * Math.PI;
              const radius = 4;
              const x = 50 + Math.cos(angle) * radius;
              const y = 5 + Math.sin(angle) * radius;
              
              return (
                <motion.circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="0.3"
                  fill="gold"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                />
              );
            })}
          </motion.g>
        )}
      </svg>
    </div>
  );
};
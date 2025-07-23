import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Cloud, Text, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { create } from 'zustand';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Zustand store for state management
interface JourneyState {
  scrollProgress: number;
  currentAltitude: number;
  selectedPin: string | null;
  isDark: boolean;
  unlockedPins: string[];
  setScrollProgress: (progress: number) => void;
  setCurrentAltitude: (altitude: number) => void;
  setSelectedPin: (pin: string | null) => void;
  toggleTheme: () => void;
  unlockPin: (pin: string) => void;
}

const useJourneyStore = create<JourneyState>((set) => ({
  scrollProgress: 0,
  currentAltitude: 0,
  selectedPin: null,
  isDark: false,
  unlockedPins: [],
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setCurrentAltitude: (altitude) => set({ currentAltitude: altitude }),
  setSelectedPin: (pin) => set({ selectedPin: pin }),
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
  unlockPin: (pin) => set((state) => ({ 
    unlockedPins: state.unlockedPins.includes(pin) ? state.unlockedPins : [...state.unlockedPins, pin]
  })),
}));

// Pin data
const pins = [
  { id: 'about', label: 'About Me', x: -2, y: 1, z: -1, altitude: 15, icon: '👋', color: '#059669' },
  { id: 'projects', label: 'Projects', x: 2, y: 2.5, z: -2, altitude: 35, icon: '🚀', color: '#0EA5E9' },
  { id: 'skills', label: 'Skills', x: -1, y: 4, z: -1.5, altitude: 55, icon: '⚡', color: '#8B5CF6' },
  { id: 'experience', label: 'Experience', x: 1.5, y: 5.5, z: -2.5, altitude: 75, icon: '🏆', color: '#F59E0B' },
  { id: 'contact', label: 'Contact', x: 0, y: 7, z: -1, altitude: 95, icon: '📧', color: '#EF4444' },
];

// 3D Mountain Component
const Mountain: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scrollProgress, isDark } = useJourneyStore();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = scrollProgress * 0.5;
      meshRef.current.position.y = -2 + scrollProgress * 0.5;
    }
  });

  // Generate mountain geometry
  const mountainGeometry = React.useMemo(() => {
    const geometry = new THREE.ConeGeometry(4, 8, 32);
    const positions = geometry.attributes.position.array as Float32Array;
    
    // Add some randomness to make it look more natural
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Add noise to vertices
      if (y > -3) {
        positions[i] += (Math.random() - 0.5) * 0.3;
        positions[i + 2] += (Math.random() - 0.5) * 0.3;
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <group>
      {/* Main Mountain */}
      <mesh ref={meshRef} geometry={mountainGeometry} position={[0, -2, -5]}>
        <meshLambertMaterial 
          color={isDark ? '#374151' : '#6B7280'} 
          wireframe={false}
        />
      </mesh>
      
      {/* Snow Cap */}
      <mesh position={[0, 4, -5]}>
        <coneGeometry args={[1.5, 2, 16]} />
        <meshLambertMaterial color={isDark ? '#E5E7EB' : '#FFFFFF'} />
      </mesh>
      
      {/* Background Mountains */}
      <mesh position={[-8, -1, -15]} scale={[0.7, 0.7, 0.7]}>
        <coneGeometry args={[3, 6, 16]} />
        <meshLambertMaterial color={isDark ? '#1F2937' : '#9CA3AF'} />
      </mesh>
      
      <mesh position={[8, -1.5, -12]} scale={[0.8, 0.8, 0.8]}>
        <coneGeometry args={[3.5, 7, 16]} />
        <meshLambertMaterial color={isDark ? '#1F2937' : '#9CA3AF'} />
      </mesh>
    </group>
  );
};

// Interactive Pin Component
const InteractivePin: React.FC<{ pin: any }> = ({ pin }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { currentAltitude, setSelectedPin, unlockedPins } = useJourneyStore();
  const isUnlocked = currentAltitude >= pin.altitude - 10 || unlockedPins.includes(pin.id);
  const isActive = currentAltitude >= pin.altitude - 5 && currentAltitude <= pin.altitude + 10;

  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.position.y = pin.y + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={[pin.x, pin.y, pin.z]}>
      <mesh
        ref={meshRef}
        onClick={() => isUnlocked && setSelectedPin(pin.id)}
        onPointerOver={() => document.body.style.cursor = isUnlocked ? 'pointer' : 'not-allowed'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={isUnlocked ? pin.color : '#6B7280'}
          emissive={isActive ? pin.color : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </mesh>
      
      {/* Pin Icon */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color={isUnlocked ? '#FFFFFF' : '#9CA3AF'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {isUnlocked ? pin.icon : '🔒'}
      </Text>
      
      {/* Pin Label */}
      {isUnlocked && (
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.15}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.woff"
        >
          {pin.label}
        </Text>
      )}
    </group>
  );
};

// Climbing Avatar Component
const ClimbingAvatar: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { scrollProgress } = useJourneyStore();

  useFrame(() => {
    if (meshRef.current) {
      const targetY = -2 + scrollProgress * 9;
      const targetX = Math.sin(scrollProgress * Math.PI) * 1.5;
      meshRef.current.position.y = targetY;
      meshRef.current.position.x = targetX;
      meshRef.current.rotation.z = Math.sin(scrollProgress * Math.PI * 4) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, -2, -3]}>
      <Text
        fontSize={0.5}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
      >
        🧗‍♂️
      </Text>
    </group>
  );
};

// Scene Lighting
const SceneLighting: React.FC = () => {
  const { isDark } = useJourneyStore();
  
  return (
    <>
      <ambientLight intensity={isDark ? 0.3 : 0.6} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={isDark ? 0.5 : 1}
        color={isDark ? '#4F46E5' : '#FFFFFF'}
        castShadow
      />
      <pointLight 
        position={[-5, 3, 3]} 
        intensity={isDark ? 0.8 : 0.4}
        color={isDark ? '#EC4899' : '#FFF7ED'}
      />
    </>
  );
};

// Navigation Component
const Navigation: React.FC = () => {
  const { currentAltitude, scrollProgress, isDark, toggleTheme, setSelectedPin } = useJourneyStore();

  return (
    <motion.nav 
      className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl">🏔️</span>
            <h1 className="text-xl font-bold text-white">Mountain Journey</h1>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            {pins.map((pin) => (
              <motion.button
                key={pin.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentAltitude >= pin.altitude - 10 
                    ? 'text-white bg-white/20 hover:bg-white/30' 
                    : 'text-white/50 cursor-not-allowed'
                }`}
                onClick={() => currentAltitude >= pin.altitude - 10 && setSelectedPin(pin.id)}
                whileHover={currentAltitude >= pin.altitude - 10 ? { scale: 1.05 } : {}}
                whileTap={currentAltitude >= pin.altitude - 10 ? { scale: 0.95 } : {}}
              >
                <span className="mr-2">{pin.icon}</span>
                {pin.label}
              </motion.button>
            ))}
            
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? '☀️' : '🌙'}
            </motion.button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 w-full bg-white/10 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
            style={{ width: `${scrollProgress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.nav>
  );
};

// Modal Component
const Modal: React.FC = () => {
  const { selectedPin, setSelectedPin, isDark } = useJourneyStore();
  const currentPin = pins.find(p => p.id === selectedPin);

  if (!selectedPin || !currentPin) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedPin(null)}
      >
        <motion.div
          className={`rounded-xl p-8 max-w-2xl w-full mx-6 max-h-[80vh] overflow-y-auto ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold flex items-center">
              <span className="mr-3 text-4xl">{currentPin.icon}</span>
              {currentPin.label}
            </h3>
            <button
              onClick={() => setSelectedPin(null)}
              className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg">
              Welcome to the <strong>{currentPin.label}</strong> section of my journey!
            </p>
            <p>
              This milestone represents an important part of my professional story. 
              Each step up this mountain has been a learning experience, bringing new challenges and growth.
            </p>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
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
            <motion.button
              onClick={() => setSelectedPin(null)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Climbing 🏔️
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Altitude Indicator
const AltitudeIndicator: React.FC = () => {
  const { currentAltitude } = useJourneyStore();

  return (
    <motion.div 
      className="fixed bottom-6 right-6 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg z-40"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">📈</span>
        <span className="font-semibold">{currentAltitude}% Altitude</span>
      </div>
    </motion.div>
  );
};

// Main App Component
const App: React.FC = () => {
  const { setScrollProgress, setCurrentAltitude, isDark, unlockPin } = useJourneyStore();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;

      if (maxScroll > 0) {
        const progress = Math.min(scrollTop / maxScroll, 1);
        const altitude = Math.round(progress * 100);
        
        setScrollProgress(progress);
        setCurrentAltitude(altitude);

        // Unlock pins based on altitude
        pins.forEach(pin => {
          if (altitude >= pin.altitude - 10) {
            unlockPin(pin.id);
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress, setCurrentAltitude, unlockPin]);

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-sky-400 to-sky-200'}`}>
      <Navigation />
      <AltitudeIndicator />
      <Modal />

      {/* 3D Scene */}
      <div className="fixed inset-0 z-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} />
          <Suspense fallback={null}>
            <SceneLighting />
            <Mountain />
            <ClimbingAvatar />
            {pins.map((pin) => (
              <InteractivePin key={pin.id} pin={pin} />
            ))}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
            {isDark && <Cloud opacity={0.2} speed={0.4} width={10} depth={1.5} segments={20} />}
          </Suspense>
          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 6}
          />
        </Canvas>
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
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-8 drop-shadow-2xl"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Welcome to My Journey
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 1 }}
            >
              Scroll to climb the mountain of my professional story
            </motion.p>
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
            className="max-w-4xl"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-8xl mb-8">🏆</div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Summit Reached!
            </h2>
            <p className="text-xl mb-8">
              Congratulations! You've completed the journey through my portfolio.
            </p>
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start New Adventure 🔄
            </motion.button>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default App; 
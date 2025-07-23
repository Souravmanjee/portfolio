import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Cloud, Text, PerspectiveCamera, Sky } from '@react-three/drei';
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
  { id: 'about', label: 'About Me', x: -3, y: 1, z: -2, altitude: 15, icon: '👋', color: '#059669' },
  { id: 'projects', label: 'Projects', x: 3, y: 3, z: -3, altitude: 35, icon: '🚀', color: '#0EA5E9' },
  { id: 'skills', label: 'Skills', x: -2, y: 5, z: -2, altitude: 55, icon: '⚡', color: '#8B5CF6' },
  { id: 'experience', label: 'Experience', x: 2, y: 7, z: -4, altitude: 75, icon: '🏆', color: '#F59E0B' },
  { id: 'contact', label: 'Contact', x: 0, y: 9, z: -2, altitude: 95, icon: '📧', color: '#EF4444' },
];

// Mountain Skybox Component
const MountainSkybox: React.FC = () => {
  const { isDark } = useJourneyStore();
  
  // Create skybox geometry and material
  const skyboxGeometry = React.useMemo(() => new THREE.SphereGeometry(500, 60, 40), []);
  
  const skyboxMaterial = React.useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      color: isDark ? 0x1a1a2e : 0x87ceeb,
      side: THREE.BackSide,
    });
    
    // Create gradient texture for sky
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d')!;
    
    // Create gradient
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    if (isDark) {
      gradient.addColorStop(0, '#0f172a'); // Dark sky
      gradient.addColorStop(0.5, '#1e293b');
      gradient.addColorStop(1, '#374151'); // Horizon
    } else {
      gradient.addColorStop(0, '#87ceeb'); // Light blue sky
      gradient.addColorStop(0.7, '#98d8e8');
      gradient.addColorStop(1, '#e0f6ff'); // Light horizon
    }
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    material.map = texture;
    
    return material;
  }, [isDark]);

  return (
    <mesh geometry={skyboxGeometry} material={skyboxMaterial} />
  );
};

// Mountain Terrain Component
const MountainTerrain: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { scrollProgress, isDark } = useJourneyStore();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(scrollProgress * Math.PI) * 0.1;
      meshRef.current.position.y = -1 + scrollProgress * 0.3;
    }
  });

  // Generate multiple mountains
  const mountains = React.useMemo(() => {
    const mountainsArray = [];
    
    // Main mountain
    const mainGeometry = new THREE.ConeGeometry(6, 12, 32);
    const positions = mainGeometry.attributes.position.array as Float32Array;
    
    // Add natural variation to vertices
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      if (y > -4) {
        positions[i] += (Math.random() - 0.5) * 0.8;
        positions[i + 2] += (Math.random() - 0.5) * 0.8;
      }
    }
    
    mainGeometry.attributes.position.needsUpdate = true;
    mainGeometry.computeVertexNormals();
    
    mountainsArray.push({
      geometry: mainGeometry,
      position: [0, -3, -8] as [number, number, number],
      color: isDark ? '#4a5568' : '#8B7355',
      scale: 1.2
    });
    
    // Background mountains
    for (let i = 0; i < 5; i++) {
      const bgGeometry = new THREE.ConeGeometry(
        3 + Math.random() * 2, 
        8 + Math.random() * 4, 
        16
      );
      mountainsArray.push({
        geometry: bgGeometry,
        position: [
          (Math.random() - 0.5) * 40,
          -2 - Math.random() * 2,
          -15 - Math.random() * 10
        ] as [number, number, number],
        color: isDark ? '#2d3748' : '#A0AEC0',
        scale: 0.6 + Math.random() * 0.4
      });
    }
    
    return mountainsArray;
  }, [isDark]);

  return (
    <group ref={meshRef}>
      {mountains.map((mountain, index) => (
        <mesh
          key={index}
          geometry={mountain.geometry}
          position={mountain.position}
          scale={mountain.scale}
        >
          <meshLambertMaterial 
            color={mountain.color}
            transparent
            opacity={index === 0 ? 0.9 : 0.6}
          />
        </mesh>
      ))}
      
      {/* Snow caps */}
      <mesh position={[0, 6, -8]}>
        <coneGeometry args={[2, 3, 16]} />
        <meshLambertMaterial color={isDark ? '#f7fafc' : '#ffffff'} />
      </mesh>
      
      <mesh position={[-8, 4, -20]} scale={0.7}>
        <coneGeometry args={[1.5, 2, 12]} />
        <meshLambertMaterial color={isDark ? '#edf2f7' : '#ffffff'} />
      </mesh>
      
      <mesh position={[12, 5, -18]} scale={0.8}>
        <coneGeometry args={[1.8, 2.5, 12]} />
        <meshLambertMaterial color={isDark ? '#edf2f7' : '#ffffff'} />
      </mesh>
    </group>
  );
};

// Ground/Terrain Component
const Ground: React.FC = () => {
  const { isDark, scrollProgress } = useJourneyStore();
  
  return (
    <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshLambertMaterial 
        color={isDark ? '#2d3748' : '#68d391'}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

// Interactive Pin Component
const InteractivePin: React.FC<{ pin: any }> = ({ pin }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { currentAltitude, setSelectedPin, unlockedPins } = useJourneyStore();
  const isUnlocked = currentAltitude >= pin.altitude - 10 || unlockedPins.includes(pin.id);
  const isActive = currentAltitude >= pin.altitude - 5 && currentAltitude <= pin.altitude + 10;

  useFrame((state) => {
    if (meshRef.current) {
      if (isActive) {
        meshRef.current.position.y = pin.y + Math.sin(state.clock.elapsedTime * 2) * 0.2;
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
      } else {
        meshRef.current.position.y = pin.y;
        meshRef.current.scale.setScalar(1);
      }
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
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color={isUnlocked ? pin.color : '#6B7280'}
          emissive={isActive ? pin.color : '#000000'}
          emissiveIntensity={isActive ? 0.4 : 0}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Glow effect for active pins */}
      {isActive && (
        <mesh scale={1.5}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial 
            color={pin.color}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Pin Icon as 3D Text */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.4}
        color={isUnlocked ? '#FFFFFF' : '#9CA3AF'}
        anchorX="center"
        anchorY="middle"
      >
        {isUnlocked ? pin.icon : '🔒'}
      </Text>
      
      {/* Pin Label */}
      {isUnlocked && (
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.2}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
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
      const targetY = -2 + scrollProgress * 12;
      const targetX = Math.sin(scrollProgress * Math.PI * 2) * 2;
      const targetZ = -2 + Math.cos(scrollProgress * Math.PI) * 1;
      
      meshRef.current.position.y = targetY;
      meshRef.current.position.x = targetX;
      meshRef.current.position.z = targetZ;
      meshRef.current.rotation.z = Math.sin(scrollProgress * Math.PI * 4) * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={[0, -2, -2]}>
      <Text
        fontSize={0.8}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
      >
        🧗‍♂️
      </Text>
      {/* Add a small glow around the avatar */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial 
          color="#FFD700"
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
};

// Enhanced Scene Lighting
const SceneLighting: React.FC = () => {
  const { isDark } = useJourneyStore();
  
  return (
    <>
      <ambientLight intensity={isDark ? 0.4 : 0.8} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={isDark ? 0.6 : 1.2}
        color={isDark ? '#4F46E5' : '#FFFFFF'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight 
        position={[-10, 5, 5]} 
        intensity={isDark ? 1 : 0.5}
        color={isDark ? '#EC4899' : '#FFF7ED'}
      />
      <pointLight 
        position={[0, 15, -10]} 
        intensity={0.3}
        color={isDark ? '#8B5CF6' : '#87CEEB'}
      />
    </>
  );
};

// Navigation Component
const Navigation: React.FC = () => {
  const { currentAltitude, scrollProgress, isDark, toggleTheme, setSelectedPin } = useJourneyStore();

  return (
    <motion.nav 
      className="fixed top-0 left-0 w-full z-50 glass-dark border-b border-white/10"
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
                    ? 'text-white bg-white/20 hover:bg-white/30 shadow-lg' 
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
      className="fixed bottom-6 right-6 glass-dark text-white px-4 py-3 rounded-lg z-40"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">📈</span>
        <span className="font-semibold">{currentAltitude}% Altitude</span>
      </div>
      <div className="text-xs opacity-70 mt-1">
        {currentAltitude < 20 && "Base Camp"}
        {currentAltitude >= 20 && currentAltitude < 50 && "Lower Slopes"}
        {currentAltitude >= 50 && currentAltitude < 80 && "High Altitude"}
        {currentAltitude >= 80 && currentAltitude < 95 && "Near Summit"}
        {currentAltitude >= 95 && "Summit Zone!"}
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
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress, setCurrentAltitude, unlockPin]);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      isDark 
        ? 'bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500'
    }`}>
      <Navigation />
      <AltitudeIndicator />
      <Modal />

      {/* 3D Scene */}
      <div className="fixed inset-0 z-0">
        <Canvas 
          shadows 
          camera={{ position: [0, 5, 12], fov: 75 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <SceneLighting />
            <MountainSkybox />
            <MountainTerrain />
            <Ground />
            <ClimbingAvatar />
            {pins.map((pin) => (
              <InteractivePin key={pin.id} pin={pin} />
            ))}
            <Stars 
              radius={100} 
              depth={50} 
              count={isDark ? 8000 : 3000} 
              factor={4} 
              saturation={0} 
              fade 
            />
            {isDark && (
              <Cloud 
                opacity={0.1} 
                speed={0.2} 
                width={20} 
                depth={3} 
                segments={40} 
              />
            )}
          </Suspense>
          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 6}
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
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
              className="text-6xl md:text-8xl font-bold mb-8 text-shadow-xl"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Welcome to My Journey
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 opacity-90 text-shadow-md"
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
        {Array.from({ length: 6 }, (_, i) => (
          <section key={i} className="min-h-screen flex items-center justify-center">
            <div className="text-center text-white opacity-30">
              <h2 className="text-2xl font-bold mb-4">Climbing Higher...</h2>
              <p>Keep scrolling to unlock more pins and reach the summit!</p>
            </div>
          </section>
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
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-shadow-xl">
              Summit Reached!
            </h2>
            <p className="text-xl mb-8 text-shadow-md">
              Congratulations! You've completed the journey through my portfolio.
            </p>
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-2xl"
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
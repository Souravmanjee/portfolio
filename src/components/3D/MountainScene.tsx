import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../contexts/ThemeContext';
import { useJourneyState } from '../../hooks/useJourneyState';

// Mountain geometry component
const Mountain: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { sceneTime } = useTheme();
  const altitude = useJourneyState(state => state.altitude);
  
  // Create mountain geometry based on altitude
  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(8, 12, 32);
    const positions = geo.attributes.position.array as Float32Array;
    
    // Add noise and detail to make it look more natural
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Add random noise for natural mountain texture
      const noise = (Math.random() - 0.5) * 0.3;
      positions[i] = x + noise;
      positions[i + 2] = z + noise;
    }
    
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);
  
  // Dynamic material based on theme and altitude
  const material = useMemo(() => {
    let baseColor, snowColor, rockColor;
    
    switch (sceneTime) {
      case 'night':
        baseColor = new THREE.Color('#1E293B');
        snowColor = new THREE.Color('#475569');
        rockColor = new THREE.Color('#0F172A');
        break;
      case 'sunset':
        baseColor = new THREE.Color('#FB923C');
        snowColor = new THREE.Color('#FED7AA');
        rockColor = new THREE.Color('#9A3412');
        break;
      default:
        baseColor = new THREE.Color('#22C55E');
        snowColor = new THREE.Color('#F8FAFC');
        rockColor = new THREE.Color('#64748B');
    }
    
    return new THREE.MeshLambertMaterial({
      color: altitude > 70 ? snowColor : altitude > 40 ? rockColor : baseColor,
      flatShading: false,
    });
  }, [sceneTime, altitude]);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle rotation for dynamic effect
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });
  
  return (
    <mesh ref={meshRef} geometry={geometry} material={material} position={[0, -2, 0]} />
  );
};

// Clouds component
const Clouds: React.FC = () => {
  const cloudRefs = useRef<THREE.Group>(null);
  const { sceneTime } = useTheme();
  const altitude = useJourneyState(state => state.altitude);
  
  const cloudPositions = useMemo(() => [
    { x: -5, y: 3, z: -3, scale: 1 },
    { x: 4, y: 5, z: -2, scale: 0.8 },
    { x: -2, y: 7, z: -4, scale: 1.2 },
    { x: 6, y: 8, z: -1, scale: 0.9 },
  ], []);
  
  const cloudOpacity = useMemo(() => {
    switch (sceneTime) {
      case 'night': return 0.3;
      case 'sunset': return 0.6;
      default: return 0.8;
    }
  }, [sceneTime]);
  
  useFrame((state) => {
    if (cloudRefs.current) {
      cloudRefs.current.children.forEach((cloud, index) => {
        // Floating animation
        cloud.position.y += Math.sin(state.clock.elapsedTime + index) * 0.002;
        cloud.position.x += Math.cos(state.clock.elapsedTime * 0.5 + index) * 0.001;
      });
    }
  });
  
  return (
    <group ref={cloudRefs}>
      {cloudPositions.map((pos, index) => (
        <Sphere 
          key={index}
          args={[0.8 * pos.scale, 8, 6]} 
          position={[pos.x, pos.y + altitude * 0.02, pos.z]}
        >
          <meshBasicMaterial 
            color="#F1F5F9" 
            transparent 
            opacity={cloudOpacity}
          />
        </Sphere>
      ))}
    </group>
  );
};

// Lighting setup
const SceneLighting: React.FC = () => {
  const { sceneTime } = useTheme();
  const altitude = useJourneyState(state => state.altitude);
  
  const lightSettings = useMemo(() => {
    switch (sceneTime) {
      case 'night':
        return {
          ambient: { color: '#334155', intensity: 0.3 },
          directional: { color: '#CBD5E1', intensity: 0.5, position: [-5, 10, 5] },
          point: { color: '#F8FAFC', intensity: 0.8, position: [0, 8, 0] }
        };
      case 'sunset':
        return {
          ambient: { color: '#FB923C', intensity: 0.4 },
          directional: { color: '#FED7AA', intensity: 0.8, position: [8, 5, 5] },
          point: { color: '#FDBA74', intensity: 0.6, position: [0, 6, 0] }
        };
      default:
        return {
          ambient: { color: '#87CEEB', intensity: 0.6 },
          directional: { color: '#FFFFFF', intensity: 1.0, position: [5, 10, 5] },
          point: { color: '#F8FAFC', intensity: 0.4, position: [0, 8, 0] }
        };
    }
  }, [sceneTime]);
  
  return (
    <>
      <ambientLight 
        color={lightSettings.ambient.color} 
        intensity={lightSettings.ambient.intensity} 
      />
      <directionalLight
        color={lightSettings.directional.color}
        intensity={lightSettings.directional.intensity}
        position={lightSettings.directional.position}
        castShadow
      />
      <pointLight
        color={lightSettings.point.color}
        intensity={lightSettings.point.intensity * (1 + altitude * 0.01)}
        position={lightSettings.point.position}
      />
    </>
  );
};

// Background/Sky component
const Sky: React.FC = () => {
  const { sceneTime } = useTheme();
  
  const skyGradient = useMemo(() => {
    switch (sceneTime) {
      case 'night':
        return 'linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #334155 100%)';
      case 'sunset':
        return 'linear-gradient(180deg, #FED7AA 0%, #FB923C 50%, #9A3412 100%)';
      default:
        return 'linear-gradient(180deg, #87CEEB 0%, #98D8E8 50%, #B0E0E6 100%)';
    }
  }, [sceneTime]);
  
  return (
    <Plane args={[50, 50]} position={[0, 0, -10]} rotation={[0, 0, 0]}>
      <meshBasicMaterial color="#87CEEB" />
    </Plane>
  );
};

// Main Mountain Scene Component
interface MountainSceneProps {
  className?: string;
}

export const MountainScene: React.FC<MountainSceneProps> = ({ className = '' }) => {
  const { sceneTime } = useTheme();
  const altitude = useJourneyState(state => state.altitude);
  
  // Dynamic background based on theme and altitude
  const sceneStyle = useMemo(() => {
    let backgroundColor;
    switch (sceneTime) {
      case 'night':
        backgroundColor = '#0F172A';
        break;
      case 'sunset':
        backgroundColor = '#9A3412';
        break;
      default:
        backgroundColor = '#87CEEB';
    }
    
    return {
      background: `linear-gradient(180deg, ${backgroundColor} 0%, rgba(255,255,255,0.1) 100%)`,
      transition: 'background 1s ease-in-out'
    };
  }, [sceneTime]);
  
  return (
    <div 
      className={`w-full h-full ${className}`}
      style={sceneStyle}
    >
      <Canvas
        camera={{ 
          position: [0, 2, 15], 
          fov: 45,
          near: 0.1,
          far: 1000 
        }}
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <SceneLighting />
        <Sky />
        <Mountain />
        <Clouds />
        
        {/* Subtle camera controls for interaction */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          maxAzimuthAngle={Math.PI / 4}
          minAzimuthAngle={-Math.PI / 4}
        />
      </Canvas>
      
      {/* Altitude indicator */}
      <div className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🏔️</span>
          <span>{Math.round(altitude)}% to summit</span>
        </div>
      </div>
    </div>
  );
};
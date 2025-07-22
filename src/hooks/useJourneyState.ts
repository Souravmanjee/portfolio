import { create } from 'zustand';

export interface JourneyPin {
  id: string;
  label: string;
  x: number;
  y: number;
  altitudePercent: number;
  color: string;
  icon: string;
}

export interface Avatar {
  id: string;
  name: string;
  imagePath: string;
  description: string;
}

export interface JourneyState {
  // Scroll and progress
  scrollProgress: number;
  altitude: number;
  currentPin: string | null;
  isClimbing: boolean;
  
  // Pins and trail
  pins: JourneyPin[];
  trailProgress: number;
  completedPins: string[];
  
  // Modal state
  isModalOpen: boolean;
  modalContent: string | null;
  
  // Avatar state
  selectedAvatar: Avatar | null;
  avatarPosition: { x: number; y: number };
  isAvatarMoving: boolean;
  
  // Celebration state
  hasReachedSummit: boolean;
  showCelebration: boolean;
  
  // Actions
  setScrollProgress: (progress: number) => void;
  setCurrentPin: (pinId: string | null) => void;
  setClimbing: (climbing: boolean) => void;
  openModal: (content: string) => void;
  closeModal: () => void;
  selectAvatar: (avatar: Avatar) => void;
  moveAvatar: (x: number, y: number) => void;
  completePin: (pinId: string) => void;
  reachSummit: () => void;
  resetJourney: () => void;
}

const defaultPins: JourneyPin[] = [
  {
    id: 'about',
    label: 'About Me',
    x: 20,
    y: 85,
    altitudePercent: 15,
    color: '#059669',
    icon: '👋'
  },
  {
    id: 'projects',
    label: 'Projects',
    x: 75,
    y: 65,
    altitudePercent: 35,
    color: '#0EA5E9',
    icon: '🚀'
  },
  {
    id: 'skills',
    label: 'Skills',
    x: 30,
    y: 45,
    altitudePercent: 55,
    color: '#8B5CF6',
    icon: '⚡'
  },
  {
    id: 'experience',
    label: 'Experience',
    x: 65,
    y: 25,
    altitudePercent: 75,
    color: '#F59E0B',
    icon: '🏆'
  },
  {
    id: 'contact',
    label: 'Contact',
    x: 50,
    y: 5,
    altitudePercent: 95,
    color: '#EF4444',
    icon: '📧'
  },
];

const defaultAvatars: Avatar[] = [
  {
    id: 'hiker',
    name: 'Mountain Hiker',
    imagePath: '/avatars/hiker.svg',
    description: 'A seasoned explorer ready for the climb'
  },
  {
    id: 'coder',
    name: 'Tech Explorer',
    imagePath: '/avatars/coder.svg',
    description: 'A developer navigating the digital peaks'
  },
  {
    id: 'adventurer',
    name: 'Bold Adventurer',
    imagePath: '/avatars/adventurer.svg',
    description: 'Fearless and ready for any challenge'
  },
];

export const useJourneyState = create<JourneyState>((set, get) => ({
  // Initial state
  scrollProgress: 0,
  altitude: 0,
  currentPin: null,
  isClimbing: false,
  
  pins: defaultPins,
  trailProgress: 0,
  completedPins: [],
  
  isModalOpen: false,
  modalContent: null,
  
  selectedAvatar: defaultAvatars[0],
  avatarPosition: { x: 50, y: 95 },
  isAvatarMoving: false,
  
  hasReachedSummit: false,
  showCelebration: false,
  
  // Actions
  setScrollProgress: (progress) => {
    const altitude = Math.min(progress * 100, 100);
    const trailProgress = Math.min(progress * 100, 100);
    
    // Determine current pin based on altitude
    const currentPin = get().pins.find(pin => 
      altitude >= (pin.altitudePercent - 10) && altitude <= (pin.altitudePercent + 10)
    )?.id || null;
    
    // Check if reached summit
    const hasReachedSummit = altitude >= 95;
    
    set({
      scrollProgress: progress,
      altitude,
      trailProgress,
      currentPin,
      hasReachedSummit,
      showCelebration: hasReachedSummit && !get().hasReachedSummit, // Show celebration on first reach
    });
  },
  
  setCurrentPin: (pinId) => set({ currentPin: pinId }),
  
  setClimbing: (climbing) => set({ isClimbing: climbing }),
  
  openModal: (content) => set({ 
    isModalOpen: true, 
    modalContent: content 
  }),
  
  closeModal: () => set({ 
    isModalOpen: false, 
    modalContent: null 
  }),
  
  selectAvatar: (avatar) => set({ selectedAvatar: avatar }),
  
  moveAvatar: (x, y) => {
    set({ 
      avatarPosition: { x, y },
      isAvatarMoving: true 
    });
    
    // Reset moving state after animation
    setTimeout(() => {
      set({ isAvatarMoving: false });
    }, 800);
  },
  
  completePin: (pinId) => {
    const completedPins = get().completedPins;
    if (!completedPins.includes(pinId)) {
      set({ completedPins: [...completedPins, pinId] });
    }
  },
  
  reachSummit: () => set({ 
    hasReachedSummit: true,
    showCelebration: true 
  }),
  
  resetJourney: () => set({
    scrollProgress: 0,
    altitude: 0,
    currentPin: null,
    isClimbing: false,
    trailProgress: 0,
    completedPins: [],
    isModalOpen: false,
    modalContent: null,
    avatarPosition: { x: 50, y: 95 },
    isAvatarMoving: false,
    hasReachedSummit: false,
    showCelebration: false,
  }),
}));
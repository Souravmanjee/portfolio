# 🏔️ Mountain Journey Portfolio

A professional, immersive scroll-based portfolio website that simulates a mountain climbing adventure. Built with modern web technologies to create a unique, story-driven user experience.

## ✨ Features

### 🌄 Core Experience
- **3D Mountain Scene**: Interactive Three.js mountain with dynamic lighting and weather effects
- **Scroll-Based Journey**: Smooth scrolling mechanics that simulate climbing upward
- **Animated Trail Path**: SVG path that draws dynamically as you scroll, connecting all milestones
- **Interactive Pins**: Clickable markers at different altitudes representing career/life stages
- **Immersive Modals**: Slide-in panels with rich content and character interactions

### 🎨 Visual Excellence
- **Day/Night Toggle**: Seamless theme switching with mountain scene lighting changes
- **Avatar System**: Choose your climbing companion from multiple animated characters
- **Parallax Effects**: Multi-layer depth with fog, clouds, and mountain elements
- **Dynamic Colors**: Theme-aware color schemes that change based on altitude and time of day
- **Celebration Effects**: Summit achievement with confetti and special animations

### 🚀 Technical Highlights
- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Advanced Animations**: Framer Motion with GSAP for smooth transitions
- **3D Graphics**: React Three Fiber for WebGL rendering
- **State Management**: Zustand for journey progress and modal states
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Performance Optimized**: Lazy loading, throttled scrolling, GPU acceleration

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom mountain-themed design system
- **3D Graphics**: Three.js with React Three Fiber and Drei
- **Animations**: Framer Motion for UI animations, GSAP for scroll effects
- **State Management**: Zustand for global state, React Context for themes
- **Icons & Assets**: Emoji-based iconography for universal compatibility

## 📁 Project Structure

```
src/
├── components/
│   ├── 3D/
│   │   └── MountainScene.tsx          # 3D mountain with lighting
│   ├── TrailPath.tsx                  # Animated SVG trail
│   ├── PinMarker.tsx                  # Interactive milestone markers
│   ├── ModalPanel.tsx                 # Slide-in content panels
│   ├── AvatarSelector.tsx             # Character selection dropdown
│   ├── DarkModeToggle.tsx             # Theme switching control
│   └── Navbar.tsx                     # Navigation with progress bar
│
├── pages/
│   ├── About.tsx                      # Personal story & values
│   ├── Projects.tsx                   # Portfolio projects with details
│   ├── Skills.tsx                     # Technical expertise with progress bars
│   ├── Experience.tsx                 # Career timeline
│   └── Contact.tsx                    # Contact form & social links
│
├── hooks/
│   └── useJourneyState.ts            # Zustand store for journey progress
│
├── contexts/
│   └── ThemeContext.tsx              # Theme management
│
├── App.tsx                           # Main application orchestrator
└── main.tsx                          # Application entry point
```

## 🎯 Key Interactions

### 🧗 The Climbing Experience
1. **Start at Base**: Begin your journey at the bottom of the mountain
2. **Scroll to Climb**: Each scroll action moves you higher up the mountain
3. **Discover Pins**: Milestone markers become accessible as you reach their altitude
4. **Explore Content**: Click pins to open detailed panels about each life stage
5. **Reach Summit**: Complete the journey with a celebration at 100% altitude
6. **Avatar Companion**: Your selected character follows you up the mountain

### 🎭 Interactive Elements
- **Pin Accessibility**: Markers are locked until you reach their altitude level
- **Trail Animation**: The path draws dynamically based on your progress
- **Scene Transitions**: Mountain lighting and colors change with themes
- **Smooth Animations**: All interactions use eased transitions for fluid UX
- **Responsive Feedback**: Visual and animation cues for user actions

## 🌟 Design Philosophy

This portfolio transforms the traditional scrolling website into an **adventure narrative**. Instead of just displaying information, it tells the story of professional growth through the metaphor of mountain climbing - where each career milestone is a waypoint on the journey to greater heights.

### Key Principles:
- **Storytelling**: Every element reinforces the climbing narrative
- **Progressive Disclosure**: Content unlocks as you progress, maintaining engagement
- **Emotional Connection**: The journey creates investment in reaching the summit
- **Technical Excellence**: Smooth performance enhances the immersive experience

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Customization

### Color Scheme
The mountain-themed color palette is defined in `tailwind.config.js`:
- **Snow/Ice**: Light theme backgrounds
- **Stone/Rock**: Medium tones and borders  
- **Earth/Cliff**: Dark theme backgrounds
- **Accent**: Interactive elements and highlights

### Content
Update the following files to customize your story:
- `src/hooks/useJourneyState.ts`: Pin locations and data
- `src/pages/*.tsx`: Your personal content for each section
- `src/components/3D/MountainScene.tsx`: 3D scene parameters

### Animations
Adjust animation settings in:
- `tailwind.config.js`: Animation definitions
- `src/index.css`: Additional keyframes and transitions
- Individual components: Framer Motion variants

## 🏔️ Mountain Metaphors

- **Altitude = Progress**: Your scroll position represents how high you've climbed
- **Pins = Milestones**: Career achievements and life stages as waypoints
- **Trail = Journey**: The path connects all experiences into a cohesive story
- **Summit = Achievement**: Reaching 100% represents mastery and accomplishment
- **Avatar = Identity**: Your climbing companion represents your professional persona

## 📱 Responsive Design

- **Mobile-First**: Optimized for touch interactions and smaller screens
- **Tablet-Friendly**: Adapted layouts for medium screen sizes
- **Desktop-Enhanced**: Full experience with hover effects and larger displays
- **Cross-Browser**: Compatible with modern browsers and WebGL support

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Friendly**: Semantic HTML and ARIA labels
- **Reduced Motion**: Respects user preferences for reduced animations
- **High Contrast**: Support for high contrast accessibility modes
- **Focus Indicators**: Clear visual focus states for navigation

## 🎬 Performance Features

- **Throttled Scrolling**: Optimized scroll event handling for smooth performance
- **GPU Acceleration**: Hardware-accelerated animations and 3D rendering
- **Lazy Loading**: Images and components load as needed
- **Efficient Rendering**: React optimizations and minimal re-renders
- **Bundle Optimization**: Code splitting and tree shaking with Vite

---

**Ready to embark on your own mountain climbing portfolio adventure?** 🏔️

The summit awaits! Each scroll brings you closer to showcasing your professional journey in the most engaging way possible.
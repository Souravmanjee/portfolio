import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

export type SceneTime = 'day' | 'sunset' | 'night';

interface ThemeContextValue {
  mode: ThemeMode;
  sceneTime: SceneTime;
  toggleMode: () => void;
  setSceneTime: (time: SceneTime) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme-mode');
      return (stored as ThemeMode) || 'light';
    }
    return 'light';
  });

  const [sceneTime, setSceneTime] = useState<SceneTime>('day');

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
    
    // Automatically adjust scene time based on theme
    if (newMode === 'dark') {
      setSceneTime('night');
    } else {
      setSceneTime('day');
    }
  };

  const updateSceneTime = (time: SceneTime) => {
    setSceneTime(time);
    // Optionally sync theme mode with scene time
    if (time === 'night' && mode === 'light') {
      setMode('dark');
      localStorage.setItem('theme-mode', 'dark');
    } else if (time !== 'night' && mode === 'dark') {
      setMode('light');
      localStorage.setItem('theme-mode', 'light');
    }
  };

  useEffect(() => {
    // Apply theme to document
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const value: ThemeContextValue = {
    mode,
    sceneTime,
    toggleMode,
    setSceneTime: updateSceneTime,
    isDark: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
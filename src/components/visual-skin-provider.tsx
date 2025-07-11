/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeConfig, themeConfigs } from '../utils/theme-configs';

interface VisualSkinContextType {
  currentTheme: Theme;
  themeConfig: ThemeConfig;
  setTheme: (theme: Theme) => void;
  isTransitioning: boolean;
}

const VisualSkinContext = createContext<VisualSkinContextType | undefined>(undefined);

export const useVisualSkin = () => {
  const context = useContext(VisualSkinContext);
  if (!context) {
    throw new Error('useVisualSkin must be used within VisualSkinProvider');
  }
  return context;
};

interface VisualSkinProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const VisualSkinProvider: React.FC<VisualSkinProviderProps> = ({
  children,
  defaultTheme = 'cosmic'
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const themeConfig = themeConfigs[currentTheme];

  const setTheme = (newTheme: Theme) => {
    if (newTheme === currentTheme) return;
    
    setIsTransitioning(true);
    
    // Smooth theme transition
    setTimeout(() => {
      setCurrentTheme(newTheme);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 200);
  };

  // Apply theme to document root for global CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const config = themeConfigs[currentTheme];
    
    // Set CSS custom properties for global theming
    root.style.setProperty('--theme-primary', config.colors.primary);
    root.style.setProperty('--theme-secondary', config.colors.secondary);
    root.style.setProperty('--theme-accent', config.colors.accent);
    root.style.setProperty('--theme-background', config.colors.background);
    root.style.setProperty('--theme-text', config.colors.text);
    root.style.setProperty('--theme-glow', config.colors.glow);
    
    // Apply background pattern class
    root.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  const contextValue: VisualSkinContextType = {
    currentTheme,
    themeConfig,
    setTheme,
    isTransitioning
  };

  return (
    <VisualSkinContext.Provider value={contextValue}>
      <div 
        className={`visual-skin-container theme-${currentTheme} transition-all duration-500`}
        style={{
          backgroundColor: themeConfig.colors.background,
          color: themeConfig.colors.text,
          fontFamily: themeConfig.typography.primary
        }}
      >
        {children}
      </div>
    </VisualSkinContext.Provider>
  );
};
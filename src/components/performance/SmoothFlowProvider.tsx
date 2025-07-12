/**
 * SmoothFlow Provider
 * Global performance and fluidity management for the entire interface
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSmoothFlow } from '@/hooks/useSmoothFlow';
import { PerformanceMonitor } from '@/components/debug/PerformanceMonitor';

interface SmoothFlowContextType {
  performanceLevel: 'excellent' | 'fair' | 'poor';
  currentFPS: number;
  isOptimizing: boolean;
  enabledFeatures: {
    particleAnimations: boolean;
    backgroundEffects: boolean;
    transitionAnimations: boolean;
    ambientMotion: boolean;
  };
}

const SmoothFlowContext = createContext<SmoothFlowContextType | undefined>(undefined);

export const useSmoothFlowContext = () => {
  const context = useContext(SmoothFlowContext);
  if (!context) {
    throw new Error('useSmoothFlowContext must be used within SmoothFlowProvider');
  }
  return context;
};

interface SmoothFlowProviderProps {
  children: React.ReactNode;
  showPerformanceMonitor?: boolean;
}

export const SmoothFlowProvider: React.FC<SmoothFlowProviderProps> = ({
  children,
  showPerformanceMonitor = false
}) => {
  const { performanceLevel, currentFPS, isOptimizing } = useSmoothFlow();
  const [enabledFeatures, setEnabledFeatures] = useState({
    particleAnimations: true,
    backgroundEffects: true,
    transitionAnimations: true,
    ambientMotion: true
  });

  // Adaptive feature management based on performance
  useEffect(() => {
    setEnabledFeatures(prev => {
      switch (performanceLevel) {
        case 'poor':
          return {
            particleAnimations: false,
            backgroundEffects: false,
            transitionAnimations: true,
            ambientMotion: false
          };
        case 'fair':
          return {
            particleAnimations: prev.particleAnimations && currentFPS > 45,
            backgroundEffects: false,
            transitionAnimations: true,
            ambientMotion: false
          };
        case 'excellent':
        default:
          return {
            particleAnimations: true,
            backgroundEffects: true,
            transitionAnimations: true,
            ambientMotion: true
          };
      }
    });
  }, [performanceLevel, currentFPS]);

  // Apply global CSS variables for performance-based styling
  useEffect(() => {
    const root = document.documentElement;
    
    // Set CSS custom properties based on performance
    root.style.setProperty('--smooth-transition-duration', 
      performanceLevel === 'poor' ? '0.2s' : 
      performanceLevel === 'fair' ? '0.3s' : '0.4s'
    );
    
    root.style.setProperty('--smooth-animation-duration',
      performanceLevel === 'poor' ? '0.5s' :
      performanceLevel === 'fair' ? '0.8s' : '1.2s'
    );
    
    root.style.setProperty('--smooth-particle-density',
      performanceLevel === 'poor' ? '0.3' :
      performanceLevel === 'fair' ? '0.6' : '1'
    );
    
    root.style.setProperty('--smooth-blur-intensity',
      performanceLevel === 'poor' ? '0px' :
      performanceLevel === 'fair' ? '2px' : '4px'
    );

    // Set animation preference
    root.style.setProperty('--smooth-reduce-motion',
      performanceLevel === 'poor' ? 'reduce' : 'no-preference'
    );
  }, [performanceLevel]);

  const contextValue: SmoothFlowContextType = {
    performanceLevel: performanceLevel as 'excellent' | 'fair' | 'poor',
    currentFPS,
    isOptimizing,
    enabledFeatures
  };

  return (
    <SmoothFlowContext.Provider value={contextValue}>
      <div className="smooth-flow-container">
        {showPerformanceMonitor && <PerformanceMonitor showDetails />}
        {children}
      </div>
    </SmoothFlowContext.Provider>
  );
};
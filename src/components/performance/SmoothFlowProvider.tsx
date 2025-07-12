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

  // EMERGENCY PERFORMANCE MODE - Adaptive features based on performance
  useEffect(() => {
    setEnabledFeatures({
      particleAnimations: performanceLevel !== 'poor',
      backgroundEffects: performanceLevel === 'excellent',
      transitionAnimations: performanceLevel !== 'poor',
      ambientMotion: performanceLevel === 'excellent'
    });
  }, [performanceLevel]);

  // Apply performance-based CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    if (performanceLevel === 'poor') {
      root.style.setProperty('--smooth-transition-duration', '0.1s');
      root.style.setProperty('--smooth-animation-duration', '0.2s');
      root.style.setProperty('--smooth-particle-density', '0.2');
      root.style.setProperty('--smooth-blur-intensity', '1px');
      root.style.setProperty('--smooth-reduce-motion', 'reduce');
    } else if (performanceLevel === 'fair') {
      root.style.setProperty('--smooth-transition-duration', '0.2s');
      root.style.setProperty('--smooth-animation-duration', '0.4s');
      root.style.setProperty('--smooth-particle-density', '0.5');
      root.style.setProperty('--smooth-blur-intensity', '2px');
      root.style.setProperty('--smooth-reduce-motion', 'no-preference');
    } else {
      root.style.setProperty('--smooth-transition-duration', '0.3s');
      root.style.setProperty('--smooth-animation-duration', '0.6s');
      root.style.setProperty('--smooth-particle-density', '0.8');
      root.style.setProperty('--smooth-blur-intensity', '3px');
      root.style.setProperty('--smooth-reduce-motion', 'no-preference');
    }
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
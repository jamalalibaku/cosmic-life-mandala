/**
 * Performance Mode Provider - Simplified context for direct performance control
 * Provides easy-to-use performance mode state management
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAdaptivePerformance } from './AdaptivePerformanceManager';

interface PerformanceModeContextType {
  isPerformanceMode: boolean;
  togglePerformanceMode: () => void;
  enablePerformanceMode: () => void;
  disablePerformanceMode: () => void;
  
  // Performance checks for components
  shouldRenderAnimation: (animationType: 'pulse' | 'breathing' | 'wind' | 'particles' | 'glow') => boolean;
  shouldUseDetailedGeometry: () => boolean;
  shouldRenderBackgroundEffects: () => boolean;
  getAnimationQuality: () => 'none' | 'low' | 'medium' | 'high';
}

const PerformanceModeContext = createContext<PerformanceModeContextType | undefined>(undefined);

export const usePerformanceMode = () => {
  const context = useContext(PerformanceModeContext);
  if (!context) {
    throw new Error('usePerformanceMode must be used within PerformanceModeProvider');
  }
  return context;
};

interface PerformanceModeProviderProps {
  children: React.ReactNode;
}

export const PerformanceModeProvider: React.FC<PerformanceModeProviderProps> = ({ children }) => {
  const [manualPerformanceMode, setManualPerformanceMode] = useState(false);
  const { 
    performanceLevel, 
    isEmergencyMode, 
    enablePerformanceMode: adaptiveEnable, 
    disablePerformanceMode: adaptiveDisable,
    shouldRender 
  } = useAdaptivePerformance();

  // Determine if performance mode is active (manual or adaptive)
  const isPerformanceMode = manualPerformanceMode || isEmergencyMode || performanceLevel.level === 'low';

  const togglePerformanceMode = useCallback(() => {
    if (isPerformanceMode) {
      setManualPerformanceMode(false);
      adaptiveDisable();
    } else {
      setManualPerformanceMode(true);
      adaptiveEnable();
    }
  }, [isPerformanceMode, adaptiveEnable, adaptiveDisable]);

  const enablePerformanceMode = useCallback(() => {
    setManualPerformanceMode(true);
    adaptiveEnable();
  }, [adaptiveEnable]);

  const disablePerformanceMode = useCallback(() => {
    setManualPerformanceMode(false);
    adaptiveDisable();
  }, [adaptiveDisable]);

  // Performance-aware rendering decisions
  const shouldRenderAnimation = useCallback((animationType: 'pulse' | 'breathing' | 'wind' | 'particles' | 'glow') => {
    if (isPerformanceMode) {
      // In performance mode, only allow breathing animation
      return animationType === 'breathing';
    }
    
    // Use adaptive performance system for fine-grained control
    switch (animationType) {
      case 'pulse':
        return shouldRender('backgroundPulse');
      case 'breathing':
        return shouldRender('breathingAnimations');
      case 'wind':
        return shouldRender('windEffects');
      case 'particles':
        return shouldRender('particleEffects');
      case 'glow':
        return shouldRender('glowEffects');
      default:
        return true;
    }
  }, [isPerformanceMode, shouldRender]);

  const shouldUseDetailedGeometry = useCallback(() => {
    if (isPerformanceMode) return false;
    return shouldRender('detailedSVGPaths');
  }, [isPerformanceMode, shouldRender]);

  const shouldRenderBackgroundEffects = useCallback(() => {
    if (isPerformanceMode) return false;
    return shouldRender('backgroundPulse') && shouldRender('glowEffects');
  }, [isPerformanceMode, shouldRender]);

  const getAnimationQuality = useCallback((): 'none' | 'low' | 'medium' | 'high' => {
    if (isPerformanceMode) return 'none';
    
    switch (performanceLevel.animationQuality) {
      case 'ultra':
        return 'high';
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return 'none';
    }
  }, [isPerformanceMode, performanceLevel.animationQuality]);

  const contextValue: PerformanceModeContextType = {
    isPerformanceMode,
    togglePerformanceMode,
    enablePerformanceMode,
    disablePerformanceMode,
    shouldRenderAnimation,
    shouldUseDetailedGeometry,
    shouldRenderBackgroundEffects,
    getAnimationQuality
  };

  return (
    <PerformanceModeContext.Provider value={contextValue}>
      {children}
    </PerformanceModeContext.Provider>
  );
};
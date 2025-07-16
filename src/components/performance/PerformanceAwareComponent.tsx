/**
 * Performance-Aware Component Example
 * Demonstrates how to use the PerformanceMode context in components
 */

import React from 'react';
import { usePerformanceMode } from '@/components/performance/PerformanceModeProvider';
import { OptimizedAnimationWrapper } from '@/components/performance/OptimizedAnimationWrapper';

interface PerformanceAwareComponentProps {
  children: React.ReactNode;
  componentType: 'core' | 'weather' | 'background' | 'interaction';
}

export const PerformanceAwareComponent: React.FC<PerformanceAwareComponentProps> = ({
  children,
  componentType
}) => {
  const { 
    isPerformanceMode, 
    shouldRenderAnimation, 
    shouldUseDetailedGeometry,
    shouldRenderBackgroundEffects,
    getAnimationQuality 
  } = usePerformanceMode();

  // Component-specific performance decisions
  const getComponentConfig = () => {
    const quality = getAnimationQuality();
    
    switch (componentType) {
      case 'core':
        return {
          showBreathing: shouldRenderAnimation('breathing'),
          showPulse: shouldRenderAnimation('pulse'),
          useDetailed: shouldUseDetailedGeometry(),
          animationDuration: quality === 'none' ? 0 : quality === 'low' ? 0.2 : 1.0
        };
      
      case 'weather':
        return {
          showWind: shouldRenderAnimation('wind'),
          showParticles: shouldRenderAnimation('particles'),
          useDetailed: shouldUseDetailedGeometry(),
          animationDuration: quality === 'none' ? 0 : quality === 'low' ? 0.3 : 0.8
        };
      
      case 'background':
        return {
          showEffects: shouldRenderBackgroundEffects(),
          showGlow: shouldRenderAnimation('glow'),
          useDetailed: false, // Background never needs detailed geometry
          animationDuration: quality === 'none' ? 0 : quality === 'low' ? 0.5 : 2.0
        };
      
      case 'interaction':
        return {
          showHover: !isPerformanceMode,
          showTransitions: quality !== 'none',
          useDetailed: shouldUseDetailedGeometry(),
          animationDuration: quality === 'none' ? 0 : 0.2
        };
      
      default:
        return {
          showBreathing: false,
          showPulse: false,
          useDetailed: false,
          animationDuration: 0
        };
    }
  };

  const config = getComponentConfig();

  // In performance mode, render simplified version
  if (isPerformanceMode && componentType === 'background') {
    return (
      <div className="performance-optimized">
        {/* Simplified background - no effects */}
        {children}
      </div>
    );
  }

  // Regular rendering with performance-aware optimizations
  return (
    <OptimizedAnimationWrapper
      animationType={componentType === 'core' ? 'breathing' : 'transition'}
      priority={componentType === 'core' ? 'critical' : 'medium'}
      baseDuration={config.animationDuration}
      renderCondition={() => config.animationDuration > 0}
    >
      <div 
        className={`
          performance-aware-component
          ${config.useDetailed ? 'detailed-geometry' : 'simple-geometry'}
          ${isPerformanceMode ? 'performance-mode' : 'full-mode'}
        `}
        data-component-type={componentType}
        data-performance-mode={isPerformanceMode}
        data-animation-quality={getAnimationQuality()}
      >
        {children}
      </div>
    </OptimizedAnimationWrapper>
  );
};

// Export hook for direct usage in components
export const useComponentPerformance = (componentType: PerformanceAwareComponentProps['componentType']) => {
  const { 
    isPerformanceMode, 
    shouldRenderAnimation, 
    shouldUseDetailedGeometry,
    shouldRenderBackgroundEffects,
    getAnimationQuality 
  } = usePerformanceMode();

  return {
    isPerformanceMode,
    shouldAnimate: (type: 'pulse' | 'breathing' | 'wind' | 'particles' | 'glow') => shouldRenderAnimation(type),
    shouldUseDetailedGeometry: () => shouldUseDetailedGeometry(),
    shouldRenderEffects: () => shouldRenderBackgroundEffects(),
    animationQuality: getAnimationQuality(),
    
    // Component-specific optimizations
    getCSSVars: () => ({
      '--animation-duration': getAnimationQuality() === 'none' ? '0s' : 
                             getAnimationQuality() === 'low' ? '0.2s' : '1s',
      '--detail-level': shouldUseDetailedGeometry() ? '1' : '0.3',
      '--effect-opacity': shouldRenderBackgroundEffects() ? '1' : '0',
    })
  };
};
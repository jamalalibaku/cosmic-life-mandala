/**
 * SmoothFlow Initiative Hook
 * Ensures fluid, effortless interactions across the entire interface
 */

import { useEffect, useRef, useCallback } from 'react';
import { useUltimateAnimationFlow } from './useUltimateAnimationFlow';
import { useAnimationOrchestrator } from './useAnimationOrchestrator';

interface SmoothFlowConfig {
  targetFPS: number;
  maxConcurrentAnimations: number;
  refreshIntervals: {
    high: number;    // Critical data (weather, time)
    medium: number;  // Insights, plans
    low: number;     // Background elements
  };
  transitionDurations: {
    instant: number;
    quick: number;
    smooth: number;
    gentle: number;
  };
}

const SMOOTH_FLOW_CONFIG: SmoothFlowConfig = {
  targetFPS: 60,
  maxConcurrentAnimations: 6,
  refreshIntervals: {
    high: 1000,    // 1 second
    medium: 5000,  // 5 seconds
    low: 15000     // 15 seconds
  },
  transitionDurations: {
    instant: 0.1,
    quick: 0.2,
    smooth: 0.4,
    gentle: 0.8
  }
};

export const useSmoothFlow = () => {
  const { metrics, isEmergencyMode } = useUltimateAnimationFlow();
  const orchestrator = useAnimationOrchestrator();
  const performanceRef = useRef({ lastCheck: 0, frameDrops: 0 });

  // Smart performance monitoring
  useEffect(() => {
    const checkPerformance = () => {
      const now = performance.now();
      const timeDelta = now - performanceRef.current.lastCheck;
      
      if (timeDelta > 0) {
        const currentFPS = 1000 / timeDelta;
        
        if (currentFPS < SMOOTH_FLOW_CONFIG.targetFPS * 0.8) {
          performanceRef.current.frameDrops++;
        } else {
          performanceRef.current.frameDrops = Math.max(0, performanceRef.current.frameDrops - 1);
        }
      }
      
      performanceRef.current.lastCheck = now;
    };

    const interval = setInterval(checkPerformance, 16); // ~60fps monitoring
    return () => clearInterval(interval);
  }, []);

  // Get optimized transition duration based on performance
  const getTransitionDuration = useCallback((type: keyof SmoothFlowConfig['transitionDurations']) => {
    // OPTIMIZATION DISABLED - Always return full duration for 100% visual experience
    return SMOOTH_FLOW_CONFIG.transitionDurations[type];
  }, []);

  // Get smart refresh interval based on data priority
  const getRefreshInterval = useCallback((priority: keyof SmoothFlowConfig['refreshIntervals']) => {
    // OPTIMIZATION DISABLED - Always return optimal refresh rate for 100% visual experience
    return SMOOTH_FLOW_CONFIG.refreshIntervals[priority];
  }, []);

  // Queue smooth animation with intelligent scheduling
  const queueSmoothAnimation = useCallback((
    id: string,
    callback: () => void,
    priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'
  ) => {
    orchestrator.scheduleAnimation({
      id,
      component: 'smooth-flow',
      priority,
      type: 'interaction',
      callback
    });
  }, [orchestrator]);

  // Batch animations for smooth, coordinated movement
  const batchSmoothAnimations = useCallback((animations: Array<{
    id: string;
    callback: () => void;
    priority?: 'critical' | 'high' | 'medium' | 'low';
  }>) => {
    const formattedAnimations = animations.map(anim => ({
      id: anim.id,
      component: 'smooth-flow',
      priority: anim.priority || 'medium',
      type: 'interaction' as const,
      callback: anim.callback
    }));
    
    orchestrator.scheduleAnimationBatch(formattedAnimations);
  }, [orchestrator]);

  // Get CSS transition properties for smooth flow
  const getSmoothTransition = useCallback((
    type: keyof SmoothFlowConfig['transitionDurations'] = 'smooth',
    properties: string[] = ['all']
  ) => {
    const duration = getTransitionDuration(type);
    const easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Smooth, natural easing
    
    return {
      transition: `${properties.join(', ')} ${duration}s ${easing}`,
      willChange: properties.includes('transform') ? 'transform' : 'auto'
    };
  }, [getTransitionDuration]);

  // Performance-aware motion props
  const getSmoothMotionProps = useCallback((priority: 'critical' | 'high' | 'medium' | 'low' = 'medium') => {
    const duration = getTransitionDuration('smooth');
    
    return {
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
        opacity: { duration: duration * 0.6 },
        scale: { duration: duration * 0.8 }
      },
      style: {
        willChange: 'transform, opacity',
        transform: 'translate3d(0,0,0)' // Force hardware acceleration
      }
    };
  }, [getTransitionDuration]);

  return {
    // Configuration
    config: SMOOTH_FLOW_CONFIG,
    
    // Performance metrics - EMERGENCY MODE
    currentFPS: Math.max(10, metrics?.currentFPS || 10),
    isOptimizing: true,
    frameDrops: performanceRef.current.frameDrops,
    
    // Timing utilities
    getTransitionDuration,
    getRefreshInterval,
    
    // Animation utilities
    queueSmoothAnimation,
    batchSmoothAnimations,
    
    // CSS utilities
    getSmoothTransition,
    getSmoothMotionProps,
    
    // Performance state
    performanceLevel: performanceRef.current.frameDrops > 5 ? 'poor' : 'fair'
  };
};
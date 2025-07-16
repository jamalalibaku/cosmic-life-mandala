/**
 * Ultimate Animation Flow Manager
 * Comprehensive system to optimize all animations and prevent lag
 */

import { useRef, useCallback, useEffect, useState } from 'react';
import { usePerformanceOptimizer } from './usePerformanceOptimizer';

interface AnimationState {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'svg' | 'dom' | 'transform' | 'opacity';
  duration: number;
  component: string;
  startTime: number;
}

interface PerformanceMetrics {
  frameRate: number;
  currentFPS: number;
  activeAnimations: number;
  droppedFrames: number;
  memoryUsage: number;
}

export const useUltimateAnimationFlow = () => {
  const [activeAnimations, setActiveAnimations] = useState<Map<string, AnimationState>>(new Map());
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    frameRate: 60,
    currentFPS: 60,
    activeAnimations: 0,
    droppedFrames: 0,
    memoryUsage: 0
  });

  const frameTimeRef = useRef<number[]>([]);
  const lastFrameTime = useRef(performance.now());
  const animationFrame = useRef<number>();
  const performanceBudget = useRef(16.67); // 60fps budget
  
  // Critical performance thresholds
  const MAX_CONCURRENT_ANIMATIONS = 8;
  const MAX_SVG_ANIMATIONS = 4;
  const MAX_DOM_ANIMATIONS = 6;
  const PRIORITY_LIMITS = {
    critical: 999,
    high: 4,
    medium: 2,
    low: 1
  };

  // Performance optimizer integration
  const { scheduleAnimation, getPerformanceMetrics } = usePerformanceOptimizer({
    batchSize: 2,
    staggerDelay: 200,
    throttleMs: 33, // 30fps throttling
    maxConcurrent: MAX_CONCURRENT_ANIMATIONS
  });

  // Monitor frame rate and performance
  const monitorPerformance = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastFrameTime.current;
    
    frameTimeRef.current.push(deltaTime);
    if (frameTimeRef.current.length > 60) {
      frameTimeRef.current.shift();
    }
    
    // Calculate current FPS
    const avgFrameTime = frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length;
    const currentFPS = 1000 / avgFrameTime;
    
    // Detect dropped frames
    const droppedFrames = frameTimeRef.current.filter(time => time > 20).length;
    
    setMetrics(prev => ({
      frameRate: Math.round(currentFPS),
      currentFPS: Math.round(currentFPS),
      activeAnimations: activeAnimations.size,
      droppedFrames,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
    }));
    
    // Adaptive performance adjustment
    if (currentFPS < 45) {
      performanceBudget.current = 20; // Reduce to 50fps
    } else if (currentFPS > 55) {
      performanceBudget.current = 16.67; // Back to 60fps
    }
    
    lastFrameTime.current = now;
    animationFrame.current = requestAnimationFrame(monitorPerformance);
  }, [activeAnimations.size]);

  // Disabled performance monitoring
  useEffect(() => {
    return () => {};
  }, []);

  // Register animation with intelligent queueing
  const registerAnimation = useCallback((
    id: string,
    priority: AnimationState['priority'],
    type: AnimationState['type'],
    duration: number,
    component: string,
    callback: () => void
  ) => {
    // Check if we can run this animation based on current load
    const currentTypeCount = Array.from(activeAnimations.values())
      .filter(anim => anim.type === type).length;
    
    const typeLimit = type === 'svg' ? MAX_SVG_ANIMATIONS : MAX_DOM_ANIMATIONS;
    
    if (currentTypeCount >= typeLimit && priority !== 'critical') {
      // Queue for later execution
      scheduleAnimation(id, callback, getPriorityValue(priority), duration);
      return false;
    }

    // Check priority limits
    const priorityCount = Array.from(activeAnimations.values())
      .filter(anim => anim.priority === priority).length;
    
    if (priorityCount >= PRIORITY_LIMITS[priority] && priority !== 'critical') {
      scheduleAnimation(id, callback, getPriorityValue(priority), duration);
      return false;
    }

    // Register and execute animation
    const animationState: AnimationState = {
      id,
      priority,
      type,
      duration,
      component,
      startTime: performance.now()
    };

    setActiveAnimations(prev => new Map(prev).set(id, animationState));
    
    // Execute animation
    callback();
    
    // Auto-cleanup after duration
    setTimeout(() => {
      setActiveAnimations(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    }, duration);

    return true;
  }, [activeAnimations, scheduleAnimation]);

  // Priority value mapping
  const getPriorityValue = (priority: AnimationState['priority']): number => {
    switch (priority) {
      case 'critical': return 10;
      case 'high': return 7;
      case 'medium': return 4;
      case 'low': return 1;
      default: return 1;
    }
  };

  // Cancel animation
  const cancelAnimation = useCallback((id: string) => {
    setActiveAnimations(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  // Batch cancel animations by component
  const cancelAnimationsByComponent = useCallback((component: string) => {
    setActiveAnimations(prev => {
      const newMap = new Map(prev);
      for (const [id, anim] of newMap) {
        if (anim.component === component) {
          newMap.delete(id);
        }
      }
      return newMap;
    });
  }, []);

  // Get optimized animation props for Framer Motion
  const getOptimizedMotionProps = useCallback((priority: AnimationState['priority'] = 'medium') => {
    const isLowPerf = metrics.frameRate < 50;
    
    return {
      // Reduce animation quality on low performance
      transition: {
        duration: isLowPerf ? 0.2 : 0.4,
        ease: isLowPerf ? "linear" : "easeOut",
        type: isLowPerf ? undefined : "spring",
        stiffness: isLowPerf ? undefined : 300,
        damping: isLowPerf ? undefined : 25
      },
      // Disable animations for critical performance issues
      animate: metrics.frameRate < 30 && priority === 'low' ? false : true,
      // Use transform3d for GPU acceleration
      style: { 
        transform: 'translate3d(0,0,0)',
        willChange: 'transform, opacity'
      }
    };
  }, [metrics.frameRate]);

  // Emergency performance mode DISABLED - Show 100% result
  const isEmergencyMode = false; // Always disabled for full visual experience

  return {
    registerAnimation,
    cancelAnimation,
    cancelAnimationsByComponent,
    getOptimizedMotionProps,
    metrics,
    isEmergencyMode,
    activeAnimationCount: activeAnimations.size,
    canRunAnimation: (priority: AnimationState['priority']) => {
      if (priority === 'critical') return true;
      if (isEmergencyMode && priority === 'low') return false;
      return activeAnimations.size < MAX_CONCURRENT_ANIMATIONS;
    }
  };
};
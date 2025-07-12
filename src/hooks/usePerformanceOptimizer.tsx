/**
 * Performance Optimizer Hook - Batches updates and adds stagger logic
 * Prevents animation lag and timing jumps in complex SVG scenes
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceConfig {
  batchSize: number;        // Number of animations to update per frame
  staggerDelay: number;     // Base delay between staggered animations (ms)
  throttleMs: number;       // Throttle rapid updates
  maxConcurrent: number;    // Max concurrent animations
}

interface StaggeredAnimation {
  id: string;
  delay: number;
  duration: number;
  priority: number;
  callback: () => void;
}

export const usePerformanceOptimizer = (config: PerformanceConfig = {
  batchSize: 3,
  staggerDelay: 100,
  throttleMs: 16,
  maxConcurrent: 8
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeAnimations, setActiveAnimations] = useState<Set<string>>(new Set());
  const animationQueue = useRef<StaggeredAnimation[]>([]);
  const lastUpdate = useRef(0);
  const frameId = useRef<number>();

  // Add animation to staggered queue
  const scheduleAnimation = useCallback((
    id: string,
    callback: () => void,
    priority: number = 0,
    duration: number = 1000
  ) => {
    const delay = animationQueue.current.length * config.staggerDelay;
    
    const animation: StaggeredAnimation = {
      id,
      delay,
      duration,
      priority,
      callback
    };

    // Insert based on priority
    const insertIndex = animationQueue.current.findIndex(
      anim => anim.priority < priority
    );
    
    if (insertIndex === -1) {
      animationQueue.current.push(animation);
    } else {
      animationQueue.current.splice(insertIndex, 0, animation);
    }

    processQueue();
  }, [config.staggerDelay]);

  // Process animation queue with batching
  const processQueue = useCallback(() => {
    if (isOptimizing || animationQueue.current.length === 0) return;
    if (activeAnimations.size >= config.maxConcurrent) return;

    const now = Date.now();
    if (now - lastUpdate.current < config.throttleMs) {
      frameId.current = requestAnimationFrame(processQueue);
      return;
    }

    setIsOptimizing(true);
    lastUpdate.current = now;

    // Process batch
    const batch = animationQueue.current.splice(0, config.batchSize);
    
    batch.forEach((animation, index) => {
      setTimeout(() => {
        if (activeAnimations.size < config.maxConcurrent) {
          setActiveAnimations(prev => new Set(prev).add(animation.id));
          animation.callback();
          
          // Clean up after animation duration
          setTimeout(() => {
            setActiveAnimations(prev => {
              const newSet = new Set(prev);
              newSet.delete(animation.id);
              return newSet;
            });
          }, animation.duration);
        }
      }, animation.delay + (index * 50)); // Small additional stagger within batch
    });

    setIsOptimizing(false);

    // Continue processing if queue has items
    if (animationQueue.current.length > 0) {
      frameId.current = requestAnimationFrame(processQueue);
    }
  }, [config, isOptimizing, activeAnimations]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, []);

  // Smooth easing function generator
  const createSmoothEasing = useCallback((type: 'organic' | 'cosmic' | 'golden') => {
    switch (type) {
      case 'organic':
        // Biomimetic easing with golden ratio
        return [0.23, 1, 0.32, 1];
      case 'cosmic':
        // Celestial motion inspired
        return [0.25, 0.46, 0.45, 0.94];
      case 'golden':
        // Golden ratio based
        return [0.382, 0, 0.618, 1];
      default:
        return [0.4, 0, 0.2, 1];
    }
  }, []);

  // Performance metrics
  const getPerformanceMetrics = useCallback(() => ({
    queueLength: animationQueue.current.length,
    activeAnimations: activeAnimations.size,
    isOptimizing,
    maxConcurrent: config.maxConcurrent,
    utilizationPercent: (activeAnimations.size / config.maxConcurrent) * 100
  }), [activeAnimations, isOptimizing, config.maxConcurrent]);

  return {
    scheduleAnimation,
    createSmoothEasing,
    getPerformanceMetrics,
    isOptimizing,
    activeAnimationsCount: activeAnimations.size
  };
};
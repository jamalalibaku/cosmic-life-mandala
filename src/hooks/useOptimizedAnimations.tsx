/**
 * Optimized Animation Manager Hook
 * Prevents lag by intelligently managing animation scheduling and throttling
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface AnimationQueueItem {
  id: string;
  priority: number;
  callback: () => void;
  delay: number;
}

export const useOptimizedAnimations = () => {
  const [activeAnimations, setActiveAnimations] = useState(new Set<string>());
  const animationQueue = useRef<AnimationQueueItem[]>([]);
  const lastFrameTime = useRef(0);
  const frameId = useRef<number>();
  
  // Performance thresholds
  const MAX_CONCURRENT = 6;  // Reduced from previous values
  const FRAME_BUDGET = 16.67; // 60fps budget
  const STAGGER_DELAY = 150;   // ms between animation starts

  // Intelligent frame scheduler
  const scheduleFrame = useCallback(() => {
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }
    
    frameId.current = requestAnimationFrame((timestamp) => {
      const deltaTime = timestamp - lastFrameTime.current;
      
      // Only process if we have frame budget
      if (deltaTime >= FRAME_BUDGET && animationQueue.current.length > 0 && activeAnimations.size < MAX_CONCURRENT) {
        const nextAnimation = animationQueue.current.shift();
        
        if (nextAnimation) {
          setActiveAnimations(prev => new Set(prev).add(nextAnimation.id));
          
          setTimeout(() => {
            nextAnimation.callback();
            
            // Remove from active after completion
            setTimeout(() => {
              setActiveAnimations(prev => {
                const newSet = new Set(prev);
                newSet.delete(nextAnimation.id);
                return newSet;
              });
            }, 1000); // Assumed animation duration
          }, nextAnimation.delay);
        }
        
        lastFrameTime.current = timestamp;
      }
      
      // Continue processing if needed
      if (animationQueue.current.length > 0 || activeAnimations.size > 0) {
        scheduleFrame();
      }
    });
  }, [activeAnimations.size]);

  // Add animation to queue with intelligent priority
  const queueAnimation = useCallback((
    id: string, 
    callback: () => void, 
    priority: number = 0
  ) => {
    // Remove existing animation with same ID
    animationQueue.current = animationQueue.current.filter(item => item.id !== id);
    
    // Calculate delay based on queue position
    const delay = animationQueue.current.length * STAGGER_DELAY;
    
    const animation: AnimationQueueItem = {
      id,
      priority,
      callback,
      delay: Math.min(delay, 2000) // Cap delay at 2 seconds
    };

    // Insert by priority
    const insertIndex = animationQueue.current.findIndex(item => item.priority < priority);
    if (insertIndex === -1) {
      animationQueue.current.push(animation);
    } else {
      animationQueue.current.splice(insertIndex, 0, animation);
    }

    scheduleFrame();
  }, [scheduleFrame]);

  // Batch update multiple animations
  const batchAnimations = useCallback((animations: Array<{
    id: string;
    callback: () => void;
    priority?: number;
  }>) => {
    animations.forEach((anim, index) => {
      queueAnimation(
        anim.id, 
        anim.callback, 
        anim.priority ?? 0
      );
    });
  }, [queueAnimation]);

  // Performance metrics
  const metrics = useMemo(() => ({
    queueLength: animationQueue.current.length,
    activeCount: activeAnimations.size,
    utilizationPercent: (activeAnimations.size / MAX_CONCURRENT) * 100,
    frameRate: 1000 / Math.max(FRAME_BUDGET, 16.67)
  }), [activeAnimations.size]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, []);

  return {
    queueAnimation,
    batchAnimations,
    metrics,
    isOverloaded: activeAnimations.size >= MAX_CONCURRENT
  };
};
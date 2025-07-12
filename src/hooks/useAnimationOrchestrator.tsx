/**
 * Animation Orchestrator - Final optimization for Day 4 completion
 * Coordinates all animations for smooth, lag-free experience
 */

import { useCallback, useRef, useEffect } from 'react';
import { useUltimateAnimationFlow } from './useUltimateAnimationFlow';
import { useOptimizedAnimations } from './useOptimizedAnimations';

interface AnimationRequest {
  id: string;
  component: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'entrance' | 'loop' | 'interaction' | 'transition';
  callback: () => void;
  duration?: number;
}

export const useAnimationOrchestrator = () => {
  const { registerAnimation, metrics, isEmergencyMode, getOptimizedMotionProps } = useUltimateAnimationFlow();
  const { queueAnimation, batchAnimations, isOverloaded } = useOptimizedAnimations();
  
  const pendingQueue = useRef<AnimationRequest[]>([]);
  const processingRef = useRef(false);

  // Process animation queue when performance allows
  const processQueue = useCallback(() => {
    if (processingRef.current || pendingQueue.current.length === 0) return;
    
    processingRef.current = true;
    
    const now = performance.now();
    const framesBudget = isEmergencyMode ? 2 : 4; // Reduce in emergency mode
    let processed = 0;
    
    while (pendingQueue.current.length > 0 && processed < framesBudget) {
      const request = pendingQueue.current.shift();
      if (!request) break;
      
      const success = registerAnimation(
        request.id,
        request.priority,
        'dom', // Default to DOM for now
        request.duration || 300,
        request.component,
        request.callback
      );
      
      if (!success) {
        // Re-queue with lower priority
        const loweredPriority = request.priority === 'critical' ? 'high' : 
                              request.priority === 'high' ? 'medium' : 'low';
        
        if (loweredPriority !== 'low') {
          pendingQueue.current.unshift({
            ...request,
            priority: loweredPriority
          });
        }
      }
      
      processed++;
    }
    
    processingRef.current = false;
    
    // Schedule next processing if queue has items
    if (pendingQueue.current.length > 0) {
      requestAnimationFrame(processQueue);
    }
  }, [isEmergencyMode, registerAnimation]);

  // Smart animation scheduler
  const scheduleAnimation = useCallback((request: AnimationRequest) => {
    // Critical animations bypass queue
    if (request.priority === 'critical' && !isEmergencyMode) {
      registerAnimation(
        request.id,
        request.priority,
        'dom',
        request.duration || 300,
        request.component,
        request.callback
      );
      return;
    }
    
    // Add to queue for processing
    pendingQueue.current.push(request);
    
    // Start processing if not already running
    if (!processingRef.current) {
      requestAnimationFrame(processQueue);
    }
  }, [isEmergencyMode, registerAnimation, processQueue]);

  // Batch schedule multiple animations
  const scheduleAnimationBatch = useCallback((requests: AnimationRequest[]) => {
    // Sort by priority
    const sorted = requests.sort((a, b) => {
      const priorities = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });
    
    // Use optimized animation batching
    const animationBatch = sorted.map(req => ({
      id: req.id,
      callback: req.callback,
      priority: req.priority === 'critical' ? 10 : 
               req.priority === 'high' ? 7 : 
               req.priority === 'medium' ? 4 : 1
    }));
    
    batchAnimations(animationBatch);
  }, [batchAnimations]);

  // Get optimized props for different scenarios
  const getAnimationProps = useCallback((
    priority: 'critical' | 'high' | 'medium' | 'low' = 'medium',
    type: 'entrance' | 'loop' | 'interaction' | 'transition' = 'interaction'
  ) => {
    const baseProps = getOptimizedMotionProps(priority);
    
    // Adjust based on type and performance
    if (isEmergencyMode) {
      return {
        ...baseProps,
        transition: { duration: 0.1 },
        animate: priority === 'low' ? false : baseProps.animate
      };
    }
    
    switch (type) {
      case 'entrance':
        return {
          ...baseProps,
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { ...baseProps.transition, duration: 0.3 }
        };
        
      case 'loop':
        return {
          ...baseProps,
          animate: {
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
        
      case 'interaction':
        return {
          ...baseProps,
          whileHover: { scale: 1.05, opacity: 0.9 },
          whileTap: { scale: 0.95 },
          transition: { duration: 0.2 }
        };
        
      case 'transition':
        return {
          ...baseProps,
          transition: { ...baseProps.transition, duration: 0.4 }
        };
        
      default:
        return baseProps;
    }
  }, [getOptimizedMotionProps, isEmergencyMode]);

  // Performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if (metrics.frameRate < 30) {
        console.log('🚨 Performance Alert: FPS dropped to', metrics.frameRate);
      }
      
      if (pendingQueue.current.length > 10) {
        console.log('📊 Animation Queue Length:', pendingQueue.current.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [metrics.frameRate]);

  return {
    scheduleAnimation,
    scheduleAnimationBatch,
    getAnimationProps,
    metrics,
    isEmergencyMode,
    isOverloaded,
    queueLength: pendingQueue.current.length
  };
};
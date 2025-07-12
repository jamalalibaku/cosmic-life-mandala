/**
 * Optimized Motion Components
 * Pre-configured Framer Motion components with performance optimizations
 */

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import { useUltimateAnimationFlow } from '@/hooks/useUltimateAnimationFlow';

// Optimized Motion Div with automatic performance adjustments
export const OptimizedMotion = memo<MotionProps & { priority?: 'critical' | 'high' | 'medium' | 'low' }>((
  { priority = 'medium', children, ...props }
) => {
  const { getOptimizedMotionProps, isEmergencyMode, canRunAnimation } = useUltimateAnimationFlow();
  
  // Skip animation in emergency mode for low priority
  if (isEmergencyMode && priority === 'low') {
    return <div {...(props as any)}>{children}</div>;
  }
  
  const optimizedProps = getOptimizedMotionProps(priority);
  
  return (
    <motion.div
      {...props}
      style={{
        transform: 'translate3d(0,0,0)',
        willChange: 'transform, opacity',
        ...props.style
      }}
      transition={{
        duration: optimizedProps.transition.duration,
        ease: "easeOut",
        ...props.transition
      }}
    >
      {children}
    </motion.div>
  );
});

OptimizedMotion.displayName = 'OptimizedMotion';

// SVG-optimized motion component
export const OptimizedSVGMotion = memo<MotionProps & { priority?: 'critical' | 'high' | 'medium' | 'low' }>((
  { priority = 'medium', children, ...props }
) => {
  const { getOptimizedMotionProps, isEmergencyMode } = useUltimateAnimationFlow();
  
  if (isEmergencyMode && priority !== 'critical') {
    return <g {...(props as any)}>{children}</g>;
  }
  
  const optimizedProps = getOptimizedMotionProps(priority);
  
  return (
    <motion.g
      {...props}
      transition={{
        duration: optimizedProps.transition.duration,
        ease: "easeOut",
        ...props.transition
      }}
    >
      {children}
    </motion.g>
  );
});

OptimizedSVGMotion.displayName = 'OptimizedSVGMotion';

// Optimized AnimatePresence with reduced overhead
export const OptimizedPresence = memo<{ children: React.ReactNode; mode?: 'wait' | 'sync' | 'popLayout' }>((
  { children, mode = 'wait' }
) => {
  const { isEmergencyMode } = useUltimateAnimationFlow();
  
  // Skip AnimatePresence in emergency mode
  if (isEmergencyMode) {
    return <>{children}</>;
  }
  
  return (
    <AnimatePresence mode={mode}>
      {children}
    </AnimatePresence>
  );
});

OptimizedPresence.displayName = 'OptimizedPresence';

// High-performance fade animation
export const FadeMotion = memo<MotionProps & { isVisible: boolean; priority?: 'critical' | 'high' | 'medium' | 'low' }>((
  { isVisible, priority = 'medium', children, ...props }
) => {
  const { getOptimizedMotionProps } = useUltimateAnimationFlow();
  const optimizedProps = getOptimizedMotionProps(priority);
  
  return (
    <OptimizedPresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...props}
          transition={{
            duration: optimizedProps.transition.duration * 0.5, // Faster fades
            ease: 'easeOut'
          }}
        >
          {children}
        </motion.div>
      )}
    </OptimizedPresence>
  );
});

FadeMotion.displayName = 'FadeMotion';

// Scale animation optimized for performance
export const ScaleMotion = memo<MotionProps & { scale?: number; priority?: 'critical' | 'high' | 'medium' | 'low' }>((
  { scale = 1, priority = 'medium', children, ...props }
) => {
  const optimizedProps = useUltimateAnimationFlow().getOptimizedMotionProps(priority);
  
  return (
    <motion.div
      animate={{ scale }}
      {...props}
      transition={{
        duration: optimizedProps.transition.duration * 0.7,
        ease: "easeOut"
      }}
      style={{
        transform: 'translate3d(0,0,0)',
        willChange: 'transform',
        ...props.style
      }}
    >
      {children}
    </motion.div>
  );
});

ScaleMotion.displayName = 'ScaleMotion';
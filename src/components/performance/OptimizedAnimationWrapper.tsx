/**
 * Optimized Animation Wrapper - Performance-aware animation container
 * Automatically throttles and optimizes animations based on performance
 */

import React, { useRef, useCallback, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAdaptivePerformance } from './AdaptivePerformanceManager';

interface OptimizedAnimationWrapperProps {
  children: React.ReactNode;
  animationType: 'breathing' | 'rotation' | 'pulse' | 'hover' | 'transition' | 'particle';
  priority: 'critical' | 'high' | 'medium' | 'low';
  className?: string;
  style?: React.CSSProperties;
  
  // Animation config
  baseDuration?: number;
  delay?: number;
  repeat?: boolean;
  
  // Performance config
  gpuAccelerated?: boolean;
  throttleMs?: number;
  
  // Conditional rendering
  renderCondition?: () => boolean;
}

export const OptimizedAnimationWrapper: React.FC<OptimizedAnimationWrapperProps> = ({
  children,
  animationType,
  priority,
  className = '',
  style = {},
  baseDuration = 1,
  delay = 0,
  repeat = true,
  gpuAccelerated = true,
  throttleMs = 16,
  renderCondition
}) => {
  const { shouldRender, getAnimationDuration, performanceLevel, isEmergencyMode } = useAdaptivePerformance();
  const prefersReducedMotion = useReducedMotion();
  const lastAnimationTime = useRef(0);
  const animationFrame = useRef<number>();

  // Check if this animation type should be rendered
  const shouldRenderAnimation = useCallback((): boolean => {
    // User preference for reduced motion
    if (prefersReducedMotion) return false;
    
    // Custom render condition
    if (renderCondition && !renderCondition()) return false;
    
    // Emergency mode - only critical animations
    if (isEmergencyMode && priority !== 'critical') return false;
    
    // Performance-based feature checks
    switch (animationType) {
      case 'breathing':
        return shouldRender('breathingAnimations');
      case 'rotation':
        return shouldRender('rotationAnimations');
      case 'pulse':
        return shouldRender('backgroundPulse');
      case 'hover':
        return shouldRender('hoverTooltips');
      case 'transition':
        return shouldRender('smoothTransitions');
      case 'particle':
        return shouldRender('particleEffects');
      default:
        return true;
    }
  }, [shouldRender, animationType, isEmergencyMode, priority, prefersReducedMotion, renderCondition]);

  // Get optimized animation properties
  const getAnimationProps = useCallback(() => {
    const duration = getAnimationDuration(baseDuration);
    
    // Base animation variants by type
    const animations = {
      breathing: {
        animate: {
          scale: [1, 1.02, 1],
          opacity: [0.8, 1, 0.8]
        },
        transition: {
          duration,
          repeat: repeat ? Infinity : 0,
          ease: "easeInOut",
          delay
        }
      },
      rotation: {
        animate: {
          rotate: 360
        },
        transition: {
          duration: duration * 10, // Slower rotation
          repeat: repeat ? Infinity : 0,
          ease: "linear",
          delay
        }
      },
      pulse: {
        animate: {
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.05, 1]
        },
        transition: {
          duration: duration * 2,
          repeat: repeat ? Infinity : 0,
          ease: "easeInOut",
          delay
        }
      },
      hover: {
        whileHover: {
          scale: 1.05,
          transition: { duration: duration * 0.2 }
        },
        whileTap: {
          scale: 0.95,
          transition: { duration: duration * 0.1 }
        }
      },
      transition: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: {
          duration,
          ease: "easeOut",
          delay
        }
      },
      particle: {
        animate: {
          y: [-10, 10, -10],
          x: [-5, 5, -5],
          opacity: [0.3, 0.7, 0.3]
        },
        transition: {
          duration: duration * 3,
          repeat: repeat ? Infinity : 0,
          ease: "easeInOut",
          delay
        }
      }
    };

    return animations[animationType] || {};
  }, [animationType, baseDuration, repeat, delay, getAnimationDuration]);

  // Throttled animation frame for performance
  const throttledAnimate = useCallback(() => {
    const now = performance.now();
    if (now - lastAnimationTime.current >= throttleMs) {
      lastAnimationTime.current = now;
      // Animation logic would go here if needed
    }
    
    if (shouldRenderAnimation()) {
      animationFrame.current = requestAnimationFrame(throttledAnimate);
    }
  }, [throttleMs, shouldRenderAnimation]);

  // Start/stop animation based on conditions
  useEffect(() => {
    if (shouldRenderAnimation() && animationType === 'particle') {
      // Only start custom animation loop for particle effects
      throttledAnimate();
    }
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [shouldRenderAnimation, throttledAnimate, animationType]);

  // If animation shouldn't render, return static content
  if (!shouldRenderAnimation()) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  // Get animation properties
  const animationProps = getAnimationProps();
  
  // Enhanced style with performance optimizations
  const optimizedStyle = {
    ...style,
    ...(gpuAccelerated && {
      willChange: 'transform, opacity',
      transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
      backfaceVisibility: 'hidden' as const,
    })
  };

  return (
    <motion.div
      className={className}
      style={optimizedStyle}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
};

// Performance-optimized SVG animation wrapper
export const OptimizedSVGAnimationWrapper: React.FC<OptimizedAnimationWrapperProps> = (props) => {
  const { shouldRender, isEmergencyMode } = useAdaptivePerformance();
  
  // SVG animations are more expensive, so be more conservative
  if (isEmergencyMode && props.priority !== 'critical') {
    return <g>{props.children}</g>;
  }
  
  return (
    <OptimizedAnimationWrapper {...props}>
      {props.children}
    </OptimizedAnimationWrapper>
  );
};
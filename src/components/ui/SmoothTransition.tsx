/**
 * SmoothTransition Component
 * Provides fluid, natural transitions for all UI elements
 */

import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import { useSmoothFlow } from '@/hooks/useSmoothFlow';
import { cn } from '@/lib/utils';

interface SmoothTransitionProps extends MotionProps {
  children: React.ReactNode;
  type?: 'instant' | 'quick' | 'smooth' | 'gentle';
  priority?: 'critical' | 'high' | 'medium' | 'low';
  className?: string;
  isVisible?: boolean;
  variant?: 'fade' | 'slide' | 'scale' | 'none';
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const SmoothTransition = forwardRef<HTMLDivElement, SmoothTransitionProps>(({
  children,
  type = 'smooth',
  priority = 'medium',
  className,
  isVisible = true,
  variant = 'fade',
  direction = 'up',
  ...props
}, ref) => {
  const { getSmoothMotionProps, getTransitionDuration } = useSmoothFlow();
  
  const smoothProps = getSmoothMotionProps(priority);
  const duration = getTransitionDuration(type);

  // Animation variants based on type
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { 
        opacity: 0,
        x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
        y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0
      },
      animate: { 
        opacity: 1,
        x: 0,
        y: 0
      },
      exit: { 
        opacity: 0,
        x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0,
        y: direction === 'up' ? -20 : direction === 'down' ? 20 : 0
      }
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 }
    },
    none: {
      initial: {},
      animate: {},
      exit: {}
    }
  };

  const currentVariant = variants[variant];

  if (variant === 'none') {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          ref={ref}
          className={cn("w-full", className)}
          initial={currentVariant.initial}
          animate={currentVariant.animate}
          exit={currentVariant.exit}
          transition={{
            duration,
            ease: "easeOut"
          }}
          style={{
            ...smoothProps.style,
            ...props.style
          }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SmoothTransition.displayName = 'SmoothTransition';

// Hover transition component for interactive elements
interface SmoothHoverProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverOpacity?: number;
  disabled?: boolean;
}

export const SmoothHover = forwardRef<HTMLDivElement, SmoothHoverProps>(({
  children,
  className,
  hoverScale = 1.02,
  hoverOpacity = 0.9,
  disabled = false
}, ref) => {
  const { getSmoothTransition } = useSmoothFlow();
  
  if (disabled) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("cursor-pointer", className)}
      whileHover={{
        scale: hoverScale,
        opacity: hoverOpacity
      }}
      whileTap={{ scale: 0.98 }}
      style={getSmoothTransition('quick', ['transform', 'opacity'])}
    >
      {children}
    </motion.div>
  );
});

SmoothHover.displayName = 'SmoothHover';

// Breathing animation for ambient elements
interface SmoothBreatheProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  duration?: number;
}

export const SmoothBreathe = forwardRef<HTMLDivElement, SmoothBreatheProps>(({
  children,
  className,
  intensity = 0.02,
  duration = 4
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={className}
      animate={{
        scale: [1, 1 + intensity, 1],
        opacity: [1, 0.95, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
});

SmoothBreathe.displayName = 'SmoothBreathe';
/**
 * CSS Motion Components - Replaces Framer Motion for better performance
 * Uses pure CSS animations with performance mode awareness
 */

import React, { memo, ReactNode } from 'react';
import { usePerformanceMode } from '@/components/performance/PerformanceModeProvider';

interface CSSMotionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in' | 'fade-out' | 'scale-in' | 'slide-up' | 'slide-down' | 'breathe' | 'pulse-soft' | 'rotate-slow' | 'float';
  performance?: boolean; // If true, animation is disabled in performance mode
  delay?: number; // Delay in ms
  duration?: number; // Duration in ms (overrides default)
}

export const CSSMotion = memo<CSSMotionProps>(({ 
  children, 
  className = '', 
  animation = 'fade-in',
  performance = false,
  delay = 0,
  duration
}) => {
  const { isPerformanceMode } = usePerformanceMode();
  
  // Disable performance-sensitive animations in performance mode
  const shouldAnimate = !(performance && isPerformanceMode);
  
  const animationClass = shouldAnimate ? `animate-${performance ? 'performance-' : ''}${animation}` : '';
  
  const style: React.CSSProperties = {
    animationDelay: delay ? `${delay}ms` : undefined,
    animationDuration: duration ? `${duration}ms` : undefined,
  };

  return (
    <div 
      className={`${animationClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
});

CSSMotion.displayName = 'CSSMotion';

// Specialized components for common use cases
export const FadeIn = memo<Omit<CSSMotionProps, 'animation'>>(({ children, ...props }) => (
  <CSSMotion animation="fade-in" {...props}>
    {children}
  </CSSMotion>
));

export const ScaleIn = memo<Omit<CSSMotionProps, 'animation'>>(({ children, ...props }) => (
  <CSSMotion animation="scale-in" {...props}>
    {children}
  </CSSMotion>
));

export const Breathe = memo<Omit<CSSMotionProps, 'animation'>>(({ children, ...props }) => (
  <CSSMotion animation="breathe" performance={true} {...props}>
    {children}
  </CSSMotion>
));

export const PulseSoft = memo<Omit<CSSMotionProps, 'animation'>>(({ children, ...props }) => (
  <CSSMotion animation="pulse-soft" performance={true} {...props}>
    {children}
  </CSSMotion>
));

export const RotateSlow = memo<Omit<CSSMotionProps, 'animation'>>(({ children, ...props }) => (
  <CSSMotion animation="rotate-slow" performance={true} {...props}>
    {children}
  </CSSMotion>
));

export const Float = memo<Omit<CSSMotionProps, 'animation'>>(({ children, ...props }) => (
  <CSSMotion animation="float" performance={true} {...props}>
    {children}
  </CSSMotion>
));

FadeIn.displayName = 'FadeIn';
ScaleIn.displayName = 'ScaleIn';
Breathe.displayName = 'Breathe';
PulseSoft.displayName = 'PulseSoft';
RotateSlow.displayName = 'RotateSlow';
Float.displayName = 'Float';
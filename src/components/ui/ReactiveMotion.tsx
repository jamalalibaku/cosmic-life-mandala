/**
 * Reactive Motion Components
 * Provides mouse-reactive elements that respond to proximity with subtle animation
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useReactiveMotion } from '@/hooks/useMouseProximity';
import { useSmoothFlowContext } from '@/components/performance/SmoothFlowProvider';

interface ReactiveElementProps {
  children: React.ReactNode;
  center: { x: number; y: number };
  intensity?: number;
  maxDistance?: number;
  className?: string;
  type?: 'glyph' | 'arc' | 'bar' | 'blob';
}

export const ReactiveElement = forwardRef<HTMLDivElement, ReactiveElementProps>(({
  children,
  center,
  intensity = 1,
  maxDistance = 200,
  className = '',
  type = 'glyph'
}, ref) => {
  const { enabledFeatures, performanceLevel } = useSmoothFlowContext();
  const motion = useReactiveMotion(center, intensity, maxDistance);

  // Skip reactive motion in poor performance mode
  if (performanceLevel === 'poor' || !enabledFeatures.ambientMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  // Different motion behaviors based on element type
  const getMotionProps = () => {
    switch (type) {
      case 'glyph':
        return {
          x: motion.x,
          y: motion.y,
          scale: motion.scale,
          rotate: motion.rotate
        };
      case 'arc':
        return {
          x: motion.x * 0.5,
          y: motion.y * 0.5,
          scale: motion.scale,
          rotateZ: motion.rotate * 0.3
        };
      case 'bar':
        return {
          x: motion.x * 0.7,
          y: motion.y * 0.7,
          scaleY: motion.scale,
          skewX: motion.rotate * 0.5
        };
      case 'blob':
        return {
          x: motion.x * 0.3,
          y: motion.y * 0.3,
          scale: motion.scale,
          borderRadius: `${50 + motion.intensity * 20}%`
        };
      default:
        return {
          x: motion.x,
          y: motion.y,
          scale: motion.scale
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={getMotionProps()}
      transition={{
        type: 'spring',
        stiffness: performanceLevel === 'fair' ? 100 : 120,
        damping: 10,
        mass: 0.5
      }}
      style={{
        filter: motion.isActive ? `drop-shadow(0 0 ${motion.glow * 10}px hsl(var(--primary) / 0.5))` : 'none',
        willChange: 'transform'
      }}
    >
      {children}
    </motion.div>
  );
});

ReactiveElement.displayName = 'ReactiveElement';

// SVG-specific reactive component
interface ReactiveSVGElementProps {
  children: React.ReactNode;
  center: { x: number; y: number };
  intensity?: number;
  maxDistance?: number;
  type?: 'path' | 'circle' | 'rect';
}

export const ReactiveSVGElement = forwardRef<SVGGElement, ReactiveSVGElementProps>(({
  children,
  center,
  intensity = 1,
  maxDistance = 200,
  type = 'path'
}, ref) => {
  const { enabledFeatures, performanceLevel } = useSmoothFlowContext();
  const motion = useReactiveMotion(center, intensity, maxDistance);

  if (performanceLevel === 'poor' || !enabledFeatures.ambientMotion) {
    return <g ref={ref}>{children}</g>;
  }

  return (
    <motion.g
      ref={ref}
      animate={{
        x: motion.x,
        y: motion.y,
        scale: motion.scale,
        rotate: motion.rotate
      }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 10
      }}
      style={{
        filter: motion.isActive ? `drop-shadow(0 0 ${motion.glow * 8}px hsl(var(--primary) / 0.3))` : 'none',
        transformOrigin: 'center'
      }}
    >
      {children}
    </motion.g>
  );
});

ReactiveSVGElement.displayName = 'ReactiveSVGElement';

// Reactive ripple effect for larger areas
interface ReactiveRippleProps {
  center: { x: number; y: number };
  radius: number;
  isVisible: boolean;
}

export const ReactiveRipple: React.FC<ReactiveRippleProps> = ({
  center,
  radius,
  isVisible
}) => {
  const motion = useReactiveMotion(center, 1, radius);

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: center.x - radius,
        top: center.y - radius,
        width: radius * 2,
        height: radius * 2,
        background: `radial-gradient(circle, 
          hsl(var(--primary) / ${motion.intensity * 0.1}) 0%, 
          hsl(var(--primary) / ${motion.intensity * 0.05}) 50%, 
          transparent 70%)`
      }}
      animate={{
        scale: 1 + motion.intensity * 0.1,
        opacity: motion.isActive ? 0.8 : 0.3
      }}
      transition={{
        type: 'spring',
        stiffness: 80,
        damping: 15
      }}
    />
  );
};
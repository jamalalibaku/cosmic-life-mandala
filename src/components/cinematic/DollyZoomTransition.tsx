/**
 * Cinematic Dolly-Zoom Transition Engine
 * Inspired by Hitchcock's vertigo effect for seamless view transitions
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TimeScale } from '@/components/fractal-time-zoom-manager';

interface DollyZoomTransitionProps {
  fromScale: TimeScale;
  toScale: TimeScale;
  isActive: boolean;
  duration?: number;
  onComplete?: () => void;
  children: React.ReactNode;
}

const scaleFactors = {
  day: 1.0,
  week: 0.85,
  month: 0.7,
  year: 0.55
};

const perspectiveFactors = {
  day: 1.0,
  week: 1.1,
  month: 1.25,
  year: 1.4
};

export const DollyZoomTransition: React.FC<DollyZoomTransitionProps> = ({
  fromScale,
  toScale,
  isActive,
  duration = 2000,
  onComplete,
  children
}) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (isActive && onComplete) {
      timeoutRef.current = setTimeout(onComplete, duration);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, duration, onComplete]);

  const fromFactor = scaleFactors[fromScale];
  const toFactor = scaleFactors[toScale];
  const fromPerspective = perspectiveFactors[fromScale];
  const toPerspective = perspectiveFactors[toScale];
  
  const scaleDirection = toFactor > fromFactor ? 'zoom-in' : 'zoom-out';
  
  return (
    <motion.div
      className="w-full h-full"
      style={{ 
        transformOrigin: 'center center',
        perspective: '1000px'
      }}
      animate={isActive ? {
        scale: [fromFactor, toFactor],
        rotateX: [0, scaleDirection === 'zoom-out' ? 2 : -2, 0],
        rotateY: [0, scaleDirection === 'zoom-out' ? -1 : 1, 0],
        filter: [
          'blur(0px) brightness(1)',
          'blur(1px) brightness(1.1)',
          'blur(0px) brightness(1)'
        ]
      } : {}}
      transition={{
        duration: duration / 1000,
        ease: [0.25, 0.46, 0.45, 0.94], // Smooth cinematic easing
        times: [0, 0.5, 1]
      }}
    >
      {/* Perspective overlay for depth effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, 
              transparent 40%, 
              rgba(0,0,0,0.1) 70%, 
              rgba(0,0,0,0.2) 100%)`
          }}
          animate={{
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: duration / 1000,
            times: [0, 0.5, 1]
          }}
        />
      )}
      
      {children}
    </motion.div>
  );
};
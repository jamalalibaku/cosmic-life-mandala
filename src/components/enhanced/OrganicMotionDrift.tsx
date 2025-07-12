/**
 * (c) 2025 Cosmic Life Mandala – Organic Motion Drift
 * Adds slow, smooth rotational drift and orbit wobble to static elements
 */

import React from 'react';
import { motion } from 'framer-motion';

interface OrganicMotionDriftProps {
  children: React.ReactNode;
  type: 'gentle-rotation' | 'orbit-wobble' | 'breathing-scale' | 'float-drift';
  intensity?: number; // 0-1, default 0.5
  duration?: number; // seconds, default varies by type
  className?: string;
}

export const OrganicMotionDrift: React.FC<OrganicMotionDriftProps> = ({
  children,
  type,
  intensity = 0.5,
  duration,
  className = ''
}) => {
  
  // Motion configurations for different drift types
  const getMotionConfig = () => {
    const baseIntensity = Math.max(0.1, Math.min(1, intensity));
    
    switch (type) {
      case 'gentle-rotation':
        return {
          animate: {
            rotate: [0, 360]
          },
          transition: {
            duration: duration || (60 + Math.random() * 40), // 60-100 seconds
            repeat: Infinity,
            ease: "linear" as const
          }
        };
      
      case 'orbit-wobble':
        return {
          animate: {
            x: [0, baseIntensity * 3, 0, -baseIntensity * 3, 0],
            y: [0, -baseIntensity * 2, 0, baseIntensity * 2, 0],
            rotate: [0, baseIntensity * 2, 0, -baseIntensity * 2, 0]
          },
          transition: {
            duration: duration || (8 + Math.random() * 4), // 8-12 seconds
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        };
      
      case 'breathing-scale':
        return {
          animate: {
            scale: [1, 1 + baseIntensity * 0.05, 1, 1 - baseIntensity * 0.03, 1]
          },
          transition: {
            duration: duration || (6 + Math.random() * 2), // 6-8 seconds
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        };
      
      case 'float-drift':
        return {
          animate: {
            y: [0, -baseIntensity * 5, 0, baseIntensity * 3, 0],
            x: [0, baseIntensity * 2, 0, -baseIntensity * 2, 0]
          },
          transition: {
            duration: duration || (10 + Math.random() * 6), // 10-16 seconds
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        };
      
      default:
        return {
          animate: {},
          transition: {}
        };
    }
  };
  
  const motionConfig = getMotionConfig();
  
  return (
    <motion.div
      className={className}
      {...motionConfig}
      style={{
        willChange: 'transform'
      }}
    >
      {children}
    </motion.div>
  );
};

// Specialized wrapper components for common use cases
export const GentleRotatingRing: React.FC<{
  children: React.ReactNode;
  speed?: 'slow' | 'medium' | 'fast';
  className?: string;
}> = ({ children, speed = 'slow', className }) => {
  const durations = {
    slow: 120,
    medium: 80,
    fast: 40
  };
  
  return (
    <OrganicMotionDrift
      type="gentle-rotation"
      duration={durations[speed]}
      className={className}
    >
      {children}
    </OrganicMotionDrift>
  );
};

export const FloatingParticles: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}> = ({ children, intensity = 0.3, className }) => {
  return (
    <OrganicMotionDrift
      type="float-drift"
      intensity={intensity}
      className={className}
    >
      {children}
    </OrganicMotionDrift>
  );
};

export const BreathingLayer: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  rhythm?: 'calm' | 'active' | 'deep';
  className?: string;
}> = ({ children, intensity = 0.5, rhythm = 'calm', className }) => {
  const durations = {
    calm: 8,
    active: 4,
    deep: 12
  };
  
  return (
    <OrganicMotionDrift
      type="breathing-scale"
      intensity={intensity}
      duration={durations[rhythm]}
      className={className}
    >
      {children}
    </OrganicMotionDrift>
  );
};

export const WobblingOrbit: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}> = ({ children, intensity = 0.4, className }) => {
  return (
    <OrganicMotionDrift
      type="orbit-wobble"
      intensity={intensity}
      className={className}
    >
      {children}
    </OrganicMotionDrift>
  );
};
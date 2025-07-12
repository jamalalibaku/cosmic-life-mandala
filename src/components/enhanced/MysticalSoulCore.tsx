/**
 * Mystical Soul Core - Center presence with aura and consciousness pulse
 * Replaces static temperature display with living, breathing center
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useUnifiedMotion } from '@/hooks/useUnifiedMotion';

interface MysticalSoulCoreProps {
  radius: number;
  center: { x: number; y: number };
  moodData?: any;
  sleepData?: any;
  className?: string;
}

export const MysticalSoulCore: React.FC<MysticalSoulCoreProps> = ({
  radius,
  center,
  moodData,
  sleepData,
  className = ''
}) => {
  const { breathing } = useUnifiedMotion();
  
  // Generate colors based on mood/sleep data
  const getCoreColors = () => {
    const defaultColors = {
      primary: 'hsl(280 60% 60%)',
      secondary: 'hsl(320 50% 70%)',
      glow: 'hsl(300 70% 75%)'
    };
    
    if (moodData?.emotion) {
      switch (moodData.emotion) {
        case 'joy':
          return {
            primary: 'hsl(45 80% 65%)',
            secondary: 'hsl(55 70% 75%)',
            glow: 'hsl(50 90% 80%)'
          };
        case 'calm':
          return {
            primary: 'hsl(200 60% 60%)',
            secondary: 'hsl(220 50% 70%)',
            glow: 'hsl(210 70% 75%)'
          };
        case 'creative':
          return {
            primary: 'hsl(280 70% 65%)',
            secondary: 'hsl(300 60% 75%)',
            glow: 'hsl(290 80% 80%)'
          };
        default:
          return defaultColors;
      }
    }
    
    return defaultColors;
  };

  const colors = getCoreColors();
  const pulseScale = 1 + (breathing * 0.03);
  
  return (
    <motion.g
      className={className}
      animate={{ scale: pulseScale }}
      transition={{
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <defs>
        {/* Mystical gradient */}
        <radialGradient 
          id="mystical-core-gradient" 
          cx="50%" 
          cy="50%" 
          r="50%"
        >
          <stop offset="0%" stopColor={colors.glow} stopOpacity={0.9} />
          <stop offset="40%" stopColor={colors.primary} stopOpacity={0.8} />
          <stop offset="80%" stopColor={colors.secondary} stopOpacity={0.6} />
          <stop offset="100%" stopColor="hsl(0 0% 0%)" stopOpacity={0.3} />
        </radialGradient>

        {/* Inner light gradient */}
        <radialGradient 
          id="inner-light-gradient" 
          cx="50%" 
          cy="50%" 
          r="30%"
        >
          <stop offset="0%" stopColor={colors.glow} stopOpacity={1} />
          <stop offset="100%" stopColor={colors.glow} stopOpacity={0} />
        </radialGradient>

        {/* Glow filter */}
        <filter id="mystical-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer aura rings */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r={radius * 1.8}
        fill="none"
        stroke={colors.glow}
        strokeWidth={1}
        opacity={0.2}
        animate={{
          r: [radius * 1.8, radius * 2.1, radius * 1.8],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.circle
        cx={center.x}
        cy={center.y}
        r={radius * 1.4}
        fill="none"
        stroke={colors.primary}
        strokeWidth={1}
        opacity={0.3}
        animate={{
          r: [radius * 1.4, radius * 1.6, radius * 1.4],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Main soul core */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r={radius}
        fill="url(#mystical-core-gradient)"
        filter="url(#mystical-glow)"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Inner light core */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r={radius * 0.4}
        fill="url(#inner-light-gradient)"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      {/* Rotating shimmer particles */}
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const angle = (index / 6) * 2 * Math.PI;
        const particleRadius = radius * 0.8;
        const x = center.x + Math.cos(angle) * particleRadius;
        const y = center.y + Math.sin(angle) * particleRadius;

        return (
          <motion.circle
            key={index}
            r={2}
            fill={colors.glow}
            opacity={0.7}
            animate={{
              x: [
                center.x + Math.cos(angle) * particleRadius,
                center.x + Math.cos(angle + Math.PI * 2) * particleRadius
              ],
              y: [
                center.y + Math.sin(angle) * particleRadius,
                center.y + Math.sin(angle + Math.PI * 2) * particleRadius
              ],
              opacity: [0.7, 0.3, 0.7]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.5
            }}
          />
        );
      })}

      {/* Consciousness pulse - responds to mood */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r={radius * 0.7}
        fill="none"
        stroke={colors.secondary}
        strokeWidth={2}
        strokeDasharray="4,8"
        opacity={0.5}
        animate={{
          rotate: 360,
          strokeDashoffset: [0, -24, 0]
        }}
        transition={{
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          },
          strokeDashoffset: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{ transformOrigin: `${center.x}px ${center.y}px` }}
      />
    </motion.g>
  );
};
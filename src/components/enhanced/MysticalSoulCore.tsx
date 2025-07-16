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
  
  // Enhanced wobble using Perlin-like noise to avoid loops
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    // Disabled interval - no constant updates needed
    return () => {};
  }, []);
  
  // Generate colors based on mood/sleep data
  const getCoreColors = () => {
    const defaultColors = {
      primary: 'hsl(45 85% 70%)',
      secondary: 'hsl(35 80% 75%)',
      glow: 'hsl(50 95% 80%)',
      highlight: 'hsl(55 100% 90%)',
      shadow: 'hsl(25 60% 45%)'
    };
    
    if (moodData?.emotion) {
      switch (moodData.emotion) {
        case 'joy':
          return {
            primary: 'hsl(45 85% 70%)',
            secondary: 'hsl(35 80% 75%)',
            glow: 'hsl(50 95% 80%)',
            highlight: 'hsl(55 100% 90%)',
            shadow: 'hsl(25 60% 45%)'
          };
        case 'calm':
          return {
            primary: 'hsl(200 65% 65%)',
            secondary: 'hsl(220 55% 75%)',
            glow: 'hsl(210 75% 80%)',
            highlight: 'hsl(190 85% 85%)',
            shadow: 'hsl(230 45% 40%)'
          };
        case 'creative':
          return {
            primary: 'hsl(280 75% 70%)',
            secondary: 'hsl(300 65% 75%)',
            glow: 'hsl(290 85% 80%)',
            highlight: 'hsl(270 95% 85%)',
            shadow: 'hsl(310 55% 45%)'
          };
        default:
          return defaultColors;
      }
    }
    
    return defaultColors;
  };

  const colors = getCoreColors();
  
  // Organic wobble using golden ratio and prime numbers to avoid loops
  const φ = 1.618033988749; // Golden ratio
  const wobbleX = Math.sin(time * φ * 0.3) * Math.cos(time * 0.7) * 0.02;
  const wobbleY = Math.cos(time * φ * 0.2) * Math.sin(time * 0.5) * 0.02;
  const wobbleScale = 1 + Math.sin(time * φ * 0.4) * 0.015;
  
  // Enhanced breathing with smoother transitions
  const pulseScale = 1 + (breathing * 0.025) + (wobbleScale - 1);
  
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
        {/* 3D Soul Core Gradient with depth */}
        <radialGradient 
          id="soul-core-3d-gradient" 
          cx="35%" 
          cy="25%" 
          r="65%"
        >
          <stop offset="0%" stopColor={colors.highlight} stopOpacity={0.95} />
          <stop offset="15%" stopColor={colors.glow} stopOpacity={0.9} />
          <stop offset="45%" stopColor={colors.primary} stopOpacity={0.85} />
          <stop offset="70%" stopColor={colors.secondary} stopOpacity={0.7} />
          <stop offset="85%" stopColor={colors.shadow} stopOpacity={0.6} />
          <stop offset="100%" stopColor="hsl(0 0% 0%)" stopOpacity={0.4} />
        </radialGradient>

        {/* Inner luminous core */}
        <radialGradient 
          id="inner-luminous-gradient" 
          cx="40%" 
          cy="30%" 
          r="35%"
        >
          <stop offset="0%" stopColor={colors.highlight} stopOpacity={1} />
          <stop offset="50%" stopColor={colors.glow} stopOpacity={0.8} />
          <stop offset="100%" stopColor={colors.glow} stopOpacity={0} />
        </radialGradient>

        {/* Enhanced glow with 3D depth */}
        <filter id="enhanced-soul-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="12" result="glow1"/>
          <feGaussianBlur stdDeviation="6" result="glow2"/>
          <feGaussianBlur stdDeviation="3" result="glow3"/>
          <feMerge>
            <feMergeNode in="glow1"/>
            <feMergeNode in="glow2"/>
            <feMergeNode in="glow3"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Ripple effect gradient */}
        <radialGradient 
          id="ripple-gradient" 
          cx="50%" 
          cy="50%" 
          r="50%"
        >
          <stop offset="0%" stopColor={colors.glow} stopOpacity={0} />
          <stop offset="80%" stopColor={colors.glow} stopOpacity={0.3} />
          <stop offset="90%" stopColor={colors.glow} stopOpacity={0.6} />
          <stop offset="100%" stopColor={colors.glow} stopOpacity={0} />
        </radialGradient>
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

      {/* Enhanced 3D Soul Core */}
      <motion.circle
        cx={center.x + wobbleX * radius}
        cy={center.y + wobbleY * radius}
        r={radius}
        fill="url(#soul-core-3d-gradient)"
        filter="url(#enhanced-soul-glow)"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.9, 1, 0.9]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: [0.25, 0.1, 0.25, 1], // Custom cubic bezier for organic feel
        }}
        style={{
          transform: `scale(${pulseScale})`,
          transformOrigin: `${center.x}px ${center.y}px`
        }}
      />

      {/* Inner luminous core with wobble */}
      <motion.circle
        cx={center.x + wobbleX * radius * 0.5}
        cy={center.y + wobbleY * radius * 0.5}
        r={radius * 0.45}
        fill="url(#inner-luminous-gradient)"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 0.95, 0.7]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
          delay: 0.3
        }}
      />

      {/* Occasional ripple bursts */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r={radius * 1.5}
        fill="url(#ripple-gradient)"
        opacity={0}
        animate={{
          scale: [0.5, 2],
          opacity: [0, 0.6, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeOut",
          delay: Math.sin(time * 0.1) * 2 + 3 // Irregular timing
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
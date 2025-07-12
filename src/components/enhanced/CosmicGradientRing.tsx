/**
 * Cosmic Gradient Ring - Inspired by Solar Eclipse Imagery
 * Creates a beautiful warm-to-cool gradient ring with stellar atmosphere
 */

import React from 'react';
import { motion } from 'framer-motion';

interface CosmicGradientRingProps {
  centerX: number;
  centerY: number;
  radius: number;
  thickness?: number;
  rotationSpeed?: number;
  intensity?: number;
  className?: string;
}

export const CosmicGradientRing: React.FC<CosmicGradientRingProps> = ({
  centerX,
  centerY,
  radius,
  thickness = 40,
  rotationSpeed = 0.5,
  intensity = 1,
  className = ''
}) => {
  const innerRadius = radius - thickness;
  const outerRadius = radius + thickness;

  return (
    <g className={`cosmic-gradient-ring ${className}`}>
      <defs>
        {/* Day-to-Night cosmic gradient - realistic day/night transition */}
        <radialGradient id="cosmic-eclipse-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(0 0% 8%)" stopOpacity="1" />
          <stop offset="30%" stopColor="hsl(25 100% 65%)" stopOpacity="0.9" />
          <stop offset="70%" stopColor="hsl(195 100% 85%)" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(220 90% 15%)" stopOpacity="0.8" />
        </radialGradient>

        {/* Enhanced rotating gradient with day/night colors */}
        <linearGradient id="rotating-cosmic-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(25 100% 70%)" stopOpacity="1" />
          <stop offset="25%" stopColor="hsl(195 100% 90%)" stopOpacity="1" />
          <stop offset="50%" stopColor="hsl(220 80% 25%)" stopOpacity="0.9" />
          <stop offset="75%" stopColor="hsl(240 90% 20%)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="hsl(25 100% 70%)" stopOpacity="1" />
          
          <animateTransform
            attributeName="gradientTransform"
            type="rotate"
            values="0 50 50;360 50 50"
            dur={`${60 / rotationSpeed}s`}
            repeatCount="indefinite"
          />
        </linearGradient>

        {/* Enhanced atmospheric glow with neon luminance */}
        <filter id="cosmic-atmosphere" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="12" result="outerGlow"/>
          <feGaussianBlur stdDeviation="6" result="middleGlow"/>
          <feGaussianBlur stdDeviation="3" result="innerGlow"/>
          <feGaussianBlur stdDeviation="1" result="sharpGlow"/>
          <feColorMatrix 
            in="outerGlow" 
            type="matrix" 
            values="1.5 0 0 0 0  0 1.5 0 0 0  0 0 2 0 0  0 0 0 1 0"
            result="enhancedOuter"
          />
          <feMerge>
            <feMergeNode in="enhancedOuter"/>
            <feMergeNode in="middleGlow"/>
            <feMergeNode in="innerGlow"/>
            <feMergeNode in="sharpGlow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* High luminance neon filter */}
        <filter id="neon-boost" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="neonGlow"/>
          <feColorMatrix 
            in="neonGlow" 
            type="matrix" 
            values="2 0 0 0 0  0 2 0 0 0  0 0 3 0 0  0 0 0 1.5 0"
            result="boostedNeon"
          />
          <feMerge>
            <feMergeNode in="boostedNeon"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Stellar sparkle filter */}
        <filter id="stellar-sparkle" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="4" 
            result="stars"
          >
            <animate
              attributeName="seed"
              values="1;5;3;7;1"
              dur="20s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix in="stars" type="saturate" values="0" result="greyStars"/>
          <feComponentTransfer in="greyStars" result="brightStars">
            <feFuncA type="discrete" tableValues="0 .5 0 0 0 0 0 .75 0 0 1 0 0 0 0 0 0.5 0"/>
          </feComponentTransfer>
        </filter>
      </defs>

      {/* Background stellar field */}
      <circle
        cx={centerX}
        cy={centerY}
        r={outerRadius + 50}
        fill="url(#stellar-sparkle)"
        opacity={0.3 * intensity}
        className="pointer-events-none"
      />

      {/* Outer atmospheric glow with subtle shake */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={outerRadius + 15}
        fill="none"
        stroke="url(#rotating-cosmic-gradient)"
        strokeWidth="35"
        opacity={0.4 * intensity}
        filter="url(#cosmic-atmosphere)"
        animate={{
          strokeWidth: [30, 40, 30],
          opacity: [0.3 * intensity, 0.5 * intensity, 0.3 * intensity],
          x: [0, 0.5, -0.5, 0.5, 0],
          y: [0, -0.3, 0.4, -0.2, 0]
        }}
        transition={{
          strokeWidth: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Main gradient ring with enhanced neon and shake */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="url(#rotating-cosmic-gradient)"
        strokeWidth={thickness}
        filter="url(#neon-boost)"
        opacity={1 * intensity}
        animate={{
          strokeWidth: [thickness * 0.85, thickness * 1.15, thickness * 0.85],
          opacity: [0.9 * intensity, 1.1 * intensity, 0.9 * intensity],
          x: [0, 0.8, -0.8, 0.4, 0],
          y: [0, -0.6, 0.7, -0.4, 0]
        }}
        transition={{
          strokeWidth: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 1.3, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Inner luminous core ring with enhanced neon and shake */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={innerRadius - 5}
        fill="none"
        stroke="url(#rotating-cosmic-gradient)"
        strokeWidth="3"
        opacity={0.9 * intensity}
        filter="url(#neon-boost)"
        animate={{
          opacity: [0.7 * intensity, 1.1 * intensity, 0.7 * intensity],
          strokeWidth: [2, 4, 2],
          x: [0, 0.3, -0.3, 0.2, 0],
          y: [0, -0.2, 0.4, -0.1, 0]
        }}
        transition={{
          opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          strokeWidth: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Enhanced floating light particles with neon glow and shake */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const particleRadius = radius + (Math.sin(i) * 25);
        const x = centerX + Math.cos(angle) * particleRadius;
        const y = centerY + Math.sin(angle) * particleRadius;
        
        return (
          <motion.circle
            key={`particle-${i}`}
            cx={x}
            cy={y}
            r="2"
            fill="hsl(195 100% 90%)"
            opacity={0}
            filter="url(#neon-boost)"
            animate={{
              opacity: [0, 1.2, 0],
              scale: [0.3, 2, 0.3],
              r: [1, 3.5, 1],
              x: [0, Math.sin(i) * 2, -Math.sin(i) * 2, 0],
              y: [0, Math.cos(i) * 1.5, -Math.cos(i) * 1.5, 0]
            }}
            transition={{
              opacity: { duration: 2.5 + (i * 0.15), repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 2.5 + (i * 0.15), repeat: Infinity, ease: "easeInOut" },
              r: { duration: 2.5 + (i * 0.15), repeat: Infinity, ease: "easeInOut" },
              x: { duration: 1 + (i * 0.05), repeat: Infinity, ease: "easeInOut" },
              y: { duration: 0.8 + (i * 0.05), repeat: Infinity, ease: "easeInOut" },
              delay: i * 0.2
            }}
          />
        );
      })}

      {/* Central void with enhanced nighttime darkness and subtle shake */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={innerRadius - thickness * 0.3}
        fill="hsl(220 40% 3%)"
        stroke="hsl(195 70% 40%)"
        strokeWidth="2"
        opacity={0.95}
        filter="url(#neon-boost)"
        animate={{
          x: [0, 0.2, -0.2, 0.1, 0],
          y: [0, -0.1, 0.3, -0.05, 0],
          strokeWidth: [1.5, 2.5, 1.5]
        }}
        transition={{
          x: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
          strokeWidth: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />
    </g>
  );
};
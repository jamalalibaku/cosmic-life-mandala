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
        {/* Main cosmic gradient - warm orange to cool blue */}
        <radialGradient id="cosmic-eclipse-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(0 0% 5%)" stopOpacity="1" />
          <stop offset="30%" stopColor="hsl(25 90% 45%)" stopOpacity="0.8" />
          <stop offset="70%" stopColor="hsl(35 95% 55%)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(200 80% 60%)" stopOpacity="0.7" />
        </radialGradient>

        {/* Rotating gradient for the ring */}
        <linearGradient id="rotating-cosmic-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(25 95% 60%)" stopOpacity="0.9" />
          <stop offset="25%" stopColor="hsl(45 100% 65%)" stopOpacity="1" />
          <stop offset="50%" stopColor="hsl(180 70% 55%)" stopOpacity="0.8" />
          <stop offset="75%" stopColor="hsl(220 80% 65%)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(25 95% 60%)" stopOpacity="0.9" />
          
          <animateTransform
            attributeName="gradientTransform"
            type="rotate"
            values="0 50 50;360 50 50"
            dur={`${60 / rotationSpeed}s`}
            repeatCount="indefinite"
          />
        </linearGradient>

        {/* Atmospheric glow filter */}
        <filter id="cosmic-atmosphere" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" result="outerGlow"/>
          <feGaussianBlur stdDeviation="4" result="middleGlow"/>
          <feGaussianBlur stdDeviation="2" result="innerGlow"/>
          <feMerge>
            <feMergeNode in="outerGlow"/>
            <feMergeNode in="middleGlow"/>
            <feMergeNode in="innerGlow"/>
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

      {/* Outer atmospheric glow */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={outerRadius + 15}
        fill="none"
        stroke="url(#rotating-cosmic-gradient)"
        strokeWidth="30"
        opacity={0.2 * intensity}
        filter="url(#cosmic-atmosphere)"
        animate={{
          strokeWidth: [25, 35, 25],
          opacity: [0.15 * intensity, 0.25 * intensity, 0.15 * intensity]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main gradient ring */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="url(#rotating-cosmic-gradient)"
        strokeWidth={thickness}
        filter="url(#cosmic-atmosphere)"
        opacity={0.8 * intensity}
        animate={{
          strokeWidth: [thickness * 0.9, thickness * 1.1, thickness * 0.9],
          opacity: [0.7 * intensity, 0.9 * intensity, 0.7 * intensity]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Inner luminous core ring */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={innerRadius - 5}
        fill="none"
        stroke="url(#rotating-cosmic-gradient)"
        strokeWidth="2"
        opacity={0.6 * intensity}
        filter="url(#cosmic-atmosphere)"
        animate={{
          opacity: [0.4 * intensity, 0.8 * intensity, 0.4 * intensity],
          strokeWidth: [1, 3, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating light particles */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const particleRadius = radius + (Math.sin(i) * 20);
        const x = centerX + Math.cos(angle) * particleRadius;
        const y = centerY + Math.sin(angle) * particleRadius;
        
        return (
          <motion.circle
            key={`particle-${i}`}
            cx={x}
            cy={y}
            r="1.5"
            fill="hsl(45 100% 80%)"
            opacity={0}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.5, 0.5],
              r: [1, 2.5, 1]
            }}
            transition={{
              duration: 3 + (i * 0.2),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
          />
        );
      })}

      {/* Central void with subtle edge */}
      <circle
        cx={centerX}
        cy={centerY}
        r={innerRadius - thickness * 0.3}
        fill="hsl(0 0% 2%)"
        stroke="hsl(200 50% 20%)"
        strokeWidth="1"
        opacity={0.8}
      />
    </g>
  );
};
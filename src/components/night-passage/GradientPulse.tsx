/**
 * Gradient Pulse - Inspired by Weather Report "Night Passage"
 * Seasonal wave or insight burst that ripples through the Mandala like auroras
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GradientPulseProps {
  centerX: number;
  centerY: number;
  maxRadius: number;
  type: 'seasonal' | 'insight' | 'aurora' | 'cosmic';
  intensity: number; // 0-1 scale
  theme: string;
  isActive: boolean;
  direction?: 'inward' | 'outward';
  className?: string;
}

export const GradientPulse: React.FC<GradientPulseProps> = ({
  centerX,
  centerY,
  maxRadius,
  type,
  intensity,
  theme,
  isActive,
  direction = 'outward',
  className = ''
}) => {
  // Type-specific color schemes
  const typeColors = useMemo(() => {
    const schemes = {
      seasonal: {
        spring: { primary: 'hsl(120 60% 65%)', secondary: 'hsl(100 50% 55%)', accent: 'hsl(140 70% 75%)' },
        summer: { primary: 'hsl(50 80% 70%)', secondary: 'hsl(30 70% 60%)', accent: 'hsl(70 90% 80%)' },
        autumn: { primary: 'hsl(25 70% 60%)', secondary: 'hsl(15 60% 50%)', accent: 'hsl(35 80% 70%)' },
        winter: { primary: 'hsl(200 50% 60%)', secondary: 'hsl(220 40% 50%)', accent: 'hsl(180 60% 70%)' }
      },
      insight: {
        primary: 'hsl(280 70% 65%)',
        secondary: 'hsl(260 60% 55%)',
        accent: 'hsl(300 80% 75%)'
      },
      aurora: {
        primary: 'hsl(160 80% 60%)',
        secondary: 'hsl(180 70% 50%)',
        accent: 'hsl(140 90% 70%)'
      },
      cosmic: {
        primary: 'hsl(240 60% 55%)',
        secondary: 'hsl(260 50% 45%)',
        accent: 'hsl(220 70% 65%)'
      }
    };

    if (type === 'seasonal') {
      // Determine season based on current date
      const month = new Date().getMonth();
      const season = month < 3 ? 'winter' : month < 6 ? 'spring' : month < 9 ? 'summer' : 'autumn';
      return schemes.seasonal[season];
    }

    return schemes[type] || schemes.insight;
  }, [type]);

  // Generate wave pattern based on type
  const generateWavePattern = (radius: number, waveIndex: number) => {
    const points = 60; // Number of points for smooth curve
    const angleStep = (Math.PI * 2) / points;
    let path = '';
    
    for (let i = 0; i <= points; i++) {
      const angle = i * angleStep;
      let r = radius;
      
      // Add wave distortion based on type
      switch (type) {
        case 'seasonal':
          r += Math.sin(angle * 3 + waveIndex) * (intensity * 15);
          break;
        case 'insight':
          r += Math.sin(angle * 5 + waveIndex * 2) * (intensity * 20);
          break;
        case 'aurora':
          r += Math.sin(angle * 4 + waveIndex * 1.5) * (intensity * 25) + 
               Math.cos(angle * 7 + waveIndex * 0.8) * (intensity * 10);
          break;
        case 'cosmic':
          r += Math.sin(angle * 6 + waveIndex * 3) * (intensity * 12) +
               Math.sin(angle * 2 + waveIndex) * (intensity * 8);
          break;
      }
      
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    path += ' Z';
    return path;
  };

  if (!isActive || intensity < 0.05) return null;

  const waveCount = Math.floor(intensity * 5 + 2); // 2-7 waves based on intensity

  return (
    <g className={`gradient-pulse ${className}`}>
      <defs>
        <radialGradient
          id={`pulse-gradient-${type}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={typeColors.accent} stopOpacity="0.8" />
          <stop offset="50%" stopColor={typeColors.primary} stopOpacity="0.4" />
          <stop offset="100%" stopColor={typeColors.secondary} stopOpacity="0.1" />
        </radialGradient>
        
        <linearGradient
          id={`pulse-linear-${type}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={typeColors.primary} stopOpacity="0.6" />
          <stop offset="50%" stopColor={typeColors.accent} stopOpacity="0.8" />
          <stop offset="100%" stopColor={typeColors.secondary} stopOpacity="0.3" />
        </linearGradient>
        
        <filter id="pulse-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="pulse-shimmer" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feTurbulence type="fractalNoise" baseFrequency="0.3" numOctaves="2"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComposite operator="multiply" in2="SourceGraphic"/>
        </filter>
      </defs>

      {/* Main pulse waves */}
      {Array.from({ length: waveCount }, (_, i) => {
        const radiusMultiplier = direction === 'outward' ? (i + 1) / waveCount : (waveCount - i) / waveCount;
        const radius = maxRadius * radiusMultiplier * intensity;
        const opacity = direction === 'outward' ? (waveCount - i) / waveCount : (i + 1) / waveCount;
        
        return (
          <motion.path
            key={i}
            d={generateWavePattern(radius, i)}
            fill="none"
            stroke={`url(#pulse-linear-${type})`}
            strokeWidth={3 - i * 0.3}
            strokeOpacity={opacity * 0.7}
            filter="url(#pulse-glow)"
            initial={{
              scale: direction === 'outward' ? 0 : 1.5,
              opacity: 0,
              rotate: 0
            }}
            animate={{
              scale: direction === 'outward' ? [0, 1.2, 1] : [1.5, 1, 0.8],
              opacity: [0, opacity * 0.8, opacity * 0.4, 0],
              rotate: type === 'cosmic' ? [0, 360] : [0, 45]
            }}
            transition={{
              scale: {
                duration: 3 + i * 0.5,
                ease: "easeOut",
                delay: i * 0.3
              },
              opacity: {
                duration: 4,
                ease: "easeInOut",
                delay: i * 0.2
              },
              rotate: {
                duration: type === 'cosmic' ? 8 : 6,
                ease: "linear",
                repeat: type === 'aurora' ? Infinity : 0
              }
            }}
          />
        );
      })}

      {/* Filled pulse regions for aurora type */}
      {type === 'aurora' && Array.from({ length: 3 }, (_, i) => {
        const radius = maxRadius * (0.3 + i * 0.25) * intensity;
        
        return (
          <motion.path
            key={`fill-${i}`}
            d={generateWavePattern(radius, i * 2)}
            fill={`url(#pulse-gradient-${type})`}
            fillOpacity={0.2 - i * 0.05}
            filter="url(#pulse-shimmer)"
            initial={{
              scale: 0,
              opacity: 0
            }}
            animate={{
              scale: [0, 1.1, 1],
              opacity: [0, 0.3, 0.1, 0]
            }}
            transition={{
              duration: 5 + i,
              ease: "easeOut",
              delay: i * 0.8
            }}
          />
        );
      })}

      {/* Central burst point */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={8 + intensity * 12}
        fill={`url(#pulse-radial-${type})`}
        filter="url(#pulse-glow)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 2, 1.5, 1],
          opacity: [0, 1, 0.6, 0]
        }}
        transition={{
          duration: 3,
          ease: "easeOut"
        }}
      />

      {/* Particle effects for cosmic type */}
      {type === 'cosmic' && Array.from({ length: Math.floor(intensity * 12 + 6) }, (_, i) => {
        const angle = (i / (intensity * 12 + 6)) * Math.PI * 2;
        const distance = 50 + Math.random() * maxRadius * 0.6;
        const particleX = centerX + Math.cos(angle) * distance;
        const particleY = centerY + Math.sin(angle) * distance;
        
        return (
          <motion.circle
            key={`particle-${i}`}
            cx={particleX}
            cy={particleY}
            r={1 + Math.random() * 2}
            fill={typeColors.accent}
            filter="url(#pulse-glow)"
            initial={{
              scale: 0,
              opacity: 0,
              x: centerX,
              y: centerY
            }}
            animate={{
              scale: [0, 2, 0],
              opacity: [0, 1, 0],
              x: particleX,
              y: particleY
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        );
      })}
    </g>
  );
};
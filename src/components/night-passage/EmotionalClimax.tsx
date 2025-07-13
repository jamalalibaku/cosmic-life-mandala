/**
 * Emotional Climax - Inspired by Weather Report "Night Passage"
 * Vertical burst of color that appears when emotions spike or deep events unfold
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface EmotionalClimaxProps {
  centerX: number;
  centerY: number;
  intensity: number; // 0-1 scale
  emotion: 'joy' | 'excitement' | 'stress' | 'calm' | 'sadness' | 'anger' | 'love' | 'surprise';
  theme: string;
  isActive: boolean;
  className?: string;
}

export const EmotionalClimax: React.FC<EmotionalClimaxProps> = ({
  centerX,
  centerY,
  intensity,
  emotion,
  theme,
  isActive,
  className = ''
}) => {
  // Emotion-specific color mappings
  const emotionColors = useMemo(() => {
    const baseColors = {
      joy: { primary: 'hsl(50 90% 70%)', secondary: 'hsl(40 80% 60%)', accent: 'hsl(60 100% 80%)' },
      excitement: { primary: 'hsl(10 100% 65%)', secondary: 'hsl(20 90% 55%)', accent: 'hsl(0 100% 75%)' },
      stress: { primary: 'hsl(0 80% 55%)', secondary: 'hsl(15 70% 45%)', accent: 'hsl(345 90% 65%)' },
      calm: { primary: 'hsl(200 60% 65%)', secondary: 'hsl(180 50% 55%)', accent: 'hsl(220 70% 75%)' },
      sadness: { primary: 'hsl(240 50% 45%)', secondary: 'hsl(220 40% 35%)', accent: 'hsl(260 60% 55%)' },
      anger: { primary: 'hsl(0 90% 60%)', secondary: 'hsl(350 80% 50%)', accent: 'hsl(10 100% 70%)' },
      love: { primary: 'hsl(330 80% 65%)', secondary: 'hsl(320 70% 55%)', accent: 'hsl(340 90% 75%)' },
      surprise: { primary: 'hsl(280 70% 60%)', secondary: 'hsl(270 60% 50%)', accent: 'hsl(290 80% 70%)' }
    };
    return baseColors[emotion] || baseColors.calm;
  }, [emotion]);

  // Calculate burst height based on intensity
  const burstHeight = useMemo(() => {
    return 100 + (intensity * 200); // 100px to 300px height
  }, [intensity]);

  // Generate flame-like path for the vertical burst
  const generateFlamePath = (height: number, width: number) => {
    const baseY = centerY;
    const peakY = centerY - height;
    const leftX = centerX - width / 2;
    const rightX = centerX + width / 2;
    
    // Create organic flame shape with multiple control points
    return `
      M ${centerX} ${baseY}
      Q ${leftX} ${baseY - height * 0.3} ${leftX + width * 0.2} ${peakY + height * 0.4}
      Q ${centerX - width * 0.1} ${peakY + height * 0.2} ${centerX} ${peakY}
      Q ${centerX + width * 0.1} ${peakY + height * 0.2} ${rightX - width * 0.2} ${peakY + height * 0.4}
      Q ${rightX} ${baseY - height * 0.3} ${centerX} ${baseY}
      Z
    `;
  };

  if (!isActive || intensity < 0.1) return null;

  return (
    <g className={`emotional-climax ${className}`}>
      <defs>
        <linearGradient
          id={`climax-gradient-${emotion}`}
          x1="0%"
          y1="100%"
          x2="0%"
          y2="0%"
        >
          <stop offset="0%" stopColor={emotionColors.primary} stopOpacity="1" />
          <stop offset="50%" stopColor={emotionColors.secondary} stopOpacity="0.8" />
          <stop offset="100%" stopColor={emotionColors.accent} stopOpacity="0.4" />
        </linearGradient>
        
        <radialGradient
          id={`climax-radial-${emotion}`}
          cx="50%"
          cy="80%"
          r="60%"
        >
          <stop offset="0%" stopColor={emotionColors.accent} stopOpacity="0.8" />
          <stop offset="50%" stopColor={emotionColors.primary} stopOpacity="0.6" />
          <stop offset="100%" stopColor={emotionColors.secondary} stopOpacity="0.2" />
        </radialGradient>
        
        <filter id="climax-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="climax-flicker" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0.1 0.2 0.3 0.2 0.1"/>
          </feComponentTransfer>
          <feComposite operator="over" in2="SourceGraphic"/>
        </filter>
      </defs>

      {/* Main flame burst */}
      <motion.path
        d={generateFlamePath(burstHeight, 40 + intensity * 30)}
        fill={`url(#climax-gradient-${emotion})`}
        filter="url(#climax-glow)"
        initial={{ 
          scale: 0, 
          opacity: 0,
          pathLength: 0
        }}
        animate={{
          scale: [0, 1.2, 1],
          opacity: [0, 1, 0.8, 0],
          pathLength: [0, 1]
        }}
        transition={{
          scale: { duration: 1.5, ease: "easeOut" },
          opacity: { duration: 3, times: [0, 0.3, 0.7, 1] },
          pathLength: { duration: 1, ease: "easeInOut" }
        }}
      />

      {/* Secondary flame layers for depth */}
      {[1, 2].map((layer) => (
        <motion.path
          key={layer}
          d={generateFlamePath(burstHeight * (1 - layer * 0.2), (40 + intensity * 30) * (1 - layer * 0.3))}
          fill={emotionColors.primary}
          opacity={0.6 / layer}
          filter="url(#climax-flicker)"
          initial={{ 
            scale: 0, 
            opacity: 0
          }}
          animate={{
            scale: [0, 1.1, 1],
            opacity: [0, 0.6 / layer, 0]
          }}
          transition={{
            scale: { 
              duration: 1.5 + layer * 0.3, 
              ease: "easeOut",
              delay: layer * 0.2
            },
            opacity: { 
              duration: 2.5, 
              delay: layer * 0.1
            }
          }}
        />
      ))}

      {/* Sparks and particles around the flame */}
      {Array.from({ length: Math.floor(intensity * 8 + 3) }, (_, i) => {
        const angle = (i / (intensity * 8 + 3)) * Math.PI * 2;
        const distance = 30 + Math.random() * 40;
        const sparkX = centerX + Math.cos(angle) * distance;
        const sparkY = centerY - burstHeight * 0.3 + Math.sin(angle) * distance * 0.5;
        
        return (
          <motion.circle
            key={i}
            cx={sparkX}
            cy={sparkY}
            r={2 + Math.random() * 3}
            fill={emotionColors.accent}
            filter="url(#climax-glow)"
            initial={{ 
              scale: 0, 
              opacity: 0,
              x: centerX,
              y: centerY
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              x: sparkX,
              y: sparkY
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: Math.random() * 1.5,
              ease: "easeOut"
            }}
          />
        );
      })}

      {/* Base glow at the origin point */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={20 + intensity * 15}
        fill={`url(#climax-radial-${emotion})`}
        filter="url(#climax-glow)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.3, 1],
          opacity: [0, 0.8, 0.4, 0]
        }}
        transition={{
          duration: 3,
          ease: "easeOut"
        }}
      />

      {/* Intensity indicator text */}
      <motion.text
        x={centerX}
        y={centerY - burstHeight - 20}
        textAnchor="middle"
        className="text-sm font-bold uppercase tracking-wider"
        fill={emotionColors.accent}
        filter="url(#climax-glow)"
        initial={{ opacity: 0, y: centerY }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: centerY - burstHeight - 20
        }}
        transition={{
          duration: 2.5,
          ease: "easeOut"
        }}
      >
        {emotion.toUpperCase()}
      </motion.text>
    </g>
  );
};
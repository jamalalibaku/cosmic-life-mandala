/**
 * Founder Mode Theme Overlay - Signature Harmonic Skin
 * Combines world cultural aesthetics with refined motion and poetic data visualization
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ThemeOverlay, ThemeOverlayProps } from './ThemeOverlaySystem';

// Ornamental patterns inspired by global art traditions
const OrnamentalPattern: React.FC<{ 
  centerX: number; 
  centerY: number; 
  radius: number; 
  opacity: number;
}> = ({ centerX, centerY, radius, opacity }) => (
  <g opacity={opacity}>
    {/* Persian-inspired geometric motifs */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const radian = (angle * Math.PI) / 180;
      const x = centerX + Math.cos(radian) * radius;
      const y = centerY + Math.sin(radian) * radius;
      
      return (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: i * 0.1,
            duration: 2,
            ease: "easeOut"
          }}
        >
          {/* Anatolian textile inspired diamond */}
          <path
            d={`M ${x} ${y-6} L ${x+4} ${y} L ${x} ${y+6} L ${x-4} ${y} Z`}
            fill="hsl(15 70% 45%)"
            opacity="0.3"
          />
          {/* Mughal miniature dot detail */}
          <circle
            cx={x}
            cy={y}
            r="1.5"
            fill="hsl(45 85% 50%)"
            opacity="0.6"
          />
        </motion.g>
      );
    })}
  </g>
);

// Kandinsky-inspired data shapes with cultural symbolism
const KandinskyDataShape: React.FC<{
  x: number;
  y: number;
  type: 'mood' | 'sleep' | 'mobility' | 'weather';
  intensity: number;
  phase: number;
}> = ({ x, y, type, intensity, phase }) => {
  const baseSize = 4 + intensity * 3;
  const pulseScale = 1 + Math.sin(phase) * 0.2;
  
  switch (type) {
    case 'mood':
      // Japanese calligraphy-inspired spiral
      return (
        <motion.g
          animate={{ 
            scale: pulseScale,
            rotate: phase * 20 
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <path
            d={`M ${x} ${y} Q ${x+baseSize} ${y-baseSize/2} ${x+baseSize/2} ${y+baseSize/2} Q ${x-baseSize/2} ${y+baseSize} ${x} ${y}`}
            stroke="hsl(15 70% 45%)"
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
        </motion.g>
      );
      
    case 'sleep':
      // Berber carpet triangle motif
      return (
        <motion.g
          animate={{ scale: pulseScale }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <path
            d={`M ${x} ${y-baseSize} L ${x+baseSize*0.8} ${y+baseSize*0.6} L ${x-baseSize*0.8} ${y+baseSize*0.6} Z`}
            fill="hsl(200 60% 35%)"
            opacity="0.6"
          />
          <circle
            cx={x}
            cy={y}
            r={baseSize * 0.3}
            fill="hsl(45 85% 50%)"
            opacity="0.4"
          />
        </motion.g>
      );
      
    case 'mobility':
      // Celtic knot-inspired flowing form
      return (
        <motion.g
          animate={{ 
            scale: pulseScale,
            rotate: -phase * 15 
          }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        >
          <ellipse
            cx={x}
            cy={y}
            rx={baseSize * 1.2}
            ry={baseSize * 0.6}
            fill="hsl(120 50% 40%)"
            opacity="0.5"
            transform={`rotate(${phase * 30} ${x} ${y})`}
          />
        </motion.g>
      );
      
    case 'weather':
      // Byzantine mosaic-inspired orb
      return (
        <motion.g
          animate={{ scale: pulseScale }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <circle
            cx={x}
            cy={y}
            r={baseSize}
            fill="url(#founderGradient)"
            opacity="0.7"
          />
          <circle
            cx={x-1}
            cy={y-1}
            r={baseSize * 0.6}
            fill="hsl(45 85% 50%)"
            opacity="0.3"
          />
        </motion.g>
      );
      
    default:
      return null;
  }
};

// Multi-directional drift pattern (Van Gogh inspired)
const FounderDriftPattern: React.FC<{
  centerX: number;
  centerY: number;
  maxRadius: number;
  time: number;
}> = ({ centerX, centerY, maxRadius, time }) => {
  const driftElements = 12;
  
  return (
    <g opacity="0.1">
      {Array.from({ length: driftElements }).map((_, i) => {
        const angle = (i / driftElements) * Math.PI * 2;
        const radius = maxRadius * (0.7 + 0.3 * Math.sin(time * 0.001 + i));
        const x = centerX + Math.cos(angle + time * 0.0005) * radius;
        const y = centerY + Math.sin(angle + time * 0.0005) * radius;
        
        return (
          <motion.line
            key={i}
            x1={x}
            y1={y}
            x2={x + Math.cos(angle + Math.PI/2) * 20}
            y2={y + Math.sin(angle + Math.PI/2) * 20}
            stroke="hsl(15 70% 45%)"
            strokeWidth="1"
            animate={{
              opacity: [0.1, 0.3, 0.1],
              strokeWidth: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </g>
  );
};

export const founderModeOverlay: ThemeOverlay = {
  id: 'founder',
  name: 'Founder Mode',
  colors: {
    primary: 'hsl(15 70% 45%)',
    secondary: 'hsl(200 60% 35%)',
    accent: 'hsl(45 85% 50%)',
    background: 'hsl(230 25% 12%)'
  },
  haiku: "Ancient wisdom flows / Through patterns of digital time / Sacred rhythms guide",
  renderOverlay: ({ centerX, centerY, maxRadius, motionState }) => {
    const time = Date.now();
    const breathingPhase = Math.sin(time * 0.002) * 0.1;
    const driftPhase = time * 0.001;
    
    return (
      <g>
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="founderGradient" cx="0.3" cy="0.3">
            <stop offset="0%" stopColor="hsl(45 85% 50%)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(15 70% 45%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(200 60% 35%)" stopOpacity="0.3" />
          </radialGradient>
          
          <radialGradient id="founderBackground" cx="0.5" cy="0.5">
            <stop offset="0%" stopColor="hsl(230 25% 15%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(230 25% 8%)" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Deep cosmic background */}
        <circle
          cx={centerX}
          cy={centerY}
          r={maxRadius * 1.2}
          fill="url(#founderBackground)"
        />

        {/* Van Gogh inspired drift patterns */}
        <FounderDriftPattern 
          centerX={centerX}
          centerY={centerY}
          maxRadius={maxRadius}
          time={time}
        />

        {/* Ornamental patterns at layer boundaries */}
        <OrnamentalPattern
          centerX={centerX}
          centerY={centerY}
          radius={maxRadius * 0.3}
          opacity={0.2 + breathingPhase}
        />
        
        <OrnamentalPattern
          centerX={centerX}
          centerY={centerY}
          radius={maxRadius * 0.6}
          opacity={0.15 + breathingPhase * 0.5}
        />
        
        <OrnamentalPattern
          centerX={centerX}
          centerY={centerY}
          radius={maxRadius * 0.9}
          opacity={0.1 + breathingPhase * 0.3}
        />

        {/* Sample Kandinsky data shapes for demonstration */}
        {[
          { type: 'mood' as const, x: centerX + 50, y: centerY - 30, intensity: 0.7 },
          { type: 'sleep' as const, x: centerX - 40, y: centerY + 40, intensity: 0.5 },
          { type: 'mobility' as const, x: centerX + 30, y: centerY + 50, intensity: 0.8 },
          { type: 'weather' as const, x: centerX - 60, y: centerY - 20, intensity: 0.6 }
        ].map((shape, i) => (
          <KandinskyDataShape
            key={i}
            x={shape.x}
            y={shape.y}
            type={shape.type}
            intensity={shape.intensity}
            phase={driftPhase + i}
          />
        ))}

        {/* Gentle shimmer effect around the center */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={15}
          fill="none"
          stroke="hsl(45 85% 50%)"
          strokeWidth="2"
          opacity="0.3"
          animate={{
            r: [15, 20, 15],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </g>
    );
  }
};
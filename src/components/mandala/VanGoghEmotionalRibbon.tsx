/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Van Gogh Emotional Ribbon - Structured mood spirals with painterly expression
 */

import React from "react";
import { motion } from "framer-motion";
import vanGoghTheme from "@/themes/van-gogh";

interface VanGoghEmotionalRibbonProps {
  startAngle: number;
  arcLength: number;
  intensity: number;
  valence: number;
  arousal: number;
  emotion: string;
  radius: number;
}

export const VanGoghEmotionalRibbon = ({ 
  startAngle, 
  arcLength, 
  intensity, 
  valence, 
  arousal, 
  emotion,
  radius
}: VanGoghEmotionalRibbonProps) => {
  const color = vanGoghTheme.getEmotionColor(emotion, valence, intensity);
  const strokeWidth = 8 + intensity * 12;
  
  // Create flowing ribbon path
  const createRibbonPath = () => {
    const endAngle = (startAngle + arcLength) * Math.PI / 180;
    const startRad = startAngle * Math.PI / 180;
    const segments = Math.max(8, Math.floor(arcLength / 10));
    
    let path = `M ${radius * Math.cos(startRad)} ${radius * Math.sin(startRad)}`;
    
    for (let i = 1; i <= segments; i++) {
      const progress = i / segments;
      const currentAngle = startRad + (endAngle - startRad) * progress;
      
      // Add Van Gogh style curvature
      const flowOffset = Math.sin(progress * Math.PI * 3) * valence * 15;
      const energyOffset = Math.cos(progress * Math.PI * 2) * intensity * 10;
      
      const currentRadius = radius + flowOffset + energyOffset;
      const x = currentRadius * Math.cos(currentAngle);
      const y = currentRadius * Math.sin(currentAngle);
      
      // Create smooth curves
      if (i === 1) {
        path += ` Q ${x} ${y}`;
      } else {
        path += ` ${x} ${y}`;
        if (i < segments) {
          path += ` S`;
        }
      }
    }
    
    return path;
  };

  return (
    <g style={{ cursor: 'pointer', pointerEvents: 'all' }}>
      <defs>
        <filter id={`ribbonGlow-${emotion}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feTurbulence 
            baseFrequency="0.01 0.02" 
            numOctaves="2"
            type="fractalNoise"
          />
          <feColorMatrix values="1 0.8 0.3 0 0 0.9 0.9 0.2 0 0 0.3 0.5 1 0 0 0 0 0 1 0"/>
          <feComposite in2="coloredBlur" operator="multiply"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <linearGradient id={`ribbonGradient-${emotion}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: color, stopOpacity: 0.8}} />
          <stop offset="50%" style={{stopColor: color, stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: color, stopOpacity: 0.6}} />
        </linearGradient>
      </defs>

      {/* Main ribbon stroke */}
      <motion.path
        d={createRibbonPath()}
        stroke={`url(#ribbonGradient-${emotion})`}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={0.8 + arousal * 0.2}
        filter={`url(#ribbonGlow-${emotion})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={() => console.log(`Van Gogh ${emotion} ribbon clicked!`)}
        animate={{
          strokeWidth: [strokeWidth * 0.9, strokeWidth, strokeWidth * 0.9],
          opacity: [0.7, 0.9, 0.7]
        }}
        transition={{
          duration: 3 + intensity * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Inner highlight for intense emotions */}
      {intensity > 0.6 && (
        <motion.path
          d={createRibbonPath()}
          stroke="hsl(45, 100%, 80%)"
          strokeWidth={strokeWidth * 0.3}
          fill="none"
          opacity={0.4}
          strokeLinecap="round"
          animate={{
            opacity: [0.2, 0.6, 0.2],
            strokeWidth: [strokeWidth * 0.2, strokeWidth * 0.4, strokeWidth * 0.2]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </g>
  );
};
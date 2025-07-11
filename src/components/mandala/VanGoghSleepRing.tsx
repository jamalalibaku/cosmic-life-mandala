/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Van Gogh Sleep Ring - Structured sleep visualization with soft, dreamy brushwork
 */

import React from "react";
import { motion } from "framer-motion";
import vanGoghTheme from "@/themes/van-gogh";

interface VanGoghSleepRingProps {
  depth: number;
  phase: 'deep' | 'REM' | 'light';
  duration: number;
  startAngle: number;
  radius: number;
}

export const VanGoghSleepRing = ({ depth, phase, duration, startAngle, radius }: VanGoghSleepRingProps) => {
  const color = vanGoghTheme.getSleepColor(phase);
  const strokeWidth = 3 + depth * 4;
  const opacity = 0.4 + depth * 0.4;

  // Create soft, breathing ring
  const createSleepArc = () => {
    const arcLength = (duration / 300) * 360; // Convert duration to degrees
    const endAngle = startAngle + arcLength;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = radius * Math.cos(startRad);
    const y1 = radius * Math.sin(startRad);
    const x2 = radius * Math.cos(endRad);
    const y2 = radius * Math.sin(endRad);
    
    const largeArcFlag = arcLength > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  return (
    <g style={{ cursor: 'pointer', pointerEvents: 'all' }}>
      <defs>
        <filter id={`sleepGlow-${phase}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="softBlur"/>
          <feTurbulence 
            baseFrequency="0.005 0.01" 
            numOctaves="1"
            type="fractalNoise"
          />
          <feColorMatrix values="0.2 0.3 1 0 0 0.1 0.2 0.8 0 0 0.05 0.1 0.6 0 0 0 0 0 1 0"/>
          <feComposite in2="softBlur" operator="multiply"/>
          <feMerge>
            <feMergeNode in="softBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main sleep arc */}
      <motion.path
        d={createSleepArc()}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={opacity}
        filter={`url(#sleepGlow-${phase})`}
        strokeLinecap="round"
        strokeDasharray={phase === 'light' ? "6,4" : phase === 'REM' ? "8,2,2,2" : "none"}
        onClick={() => console.log(`Van Gogh ${phase} sleep clicked!`)}
        animate={{
          strokeWidth: [strokeWidth * 0.8, strokeWidth, strokeWidth * 0.8],
          opacity: [opacity * 0.7, opacity, opacity * 0.7]
        }}
        transition={{
          duration: 6 + depth * 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Breathing aura for deep sleep */}
      {phase === 'deep' && (
        <motion.circle
          cx={0}
          cy={0}
          r={radius}
          stroke={color}
          strokeWidth={1}
          fill="none"
          opacity={0.2}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* REM dream particles */}
      {phase === 'REM' && (
        <>
          {Array.from({ length: 3 }, (_, i) => (
            <motion.circle
              key={i}
              cx={radius * Math.cos((startAngle + i * 30) * Math.PI / 180)}
              cy={radius * Math.sin((startAngle + i * 30) * Math.PI / 180)}
              r={2}
              fill={color}
              opacity={0.6}
              animate={{
                scale: [0.5, 1.5, 0.5],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8
              }}
            />
          ))}
        </>
      )}
    </g>
  );
};
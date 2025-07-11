/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Van Gogh Sleep Swirl – Deep blue dream currents
 */

import React from "react";
import { motion } from "framer-motion";
import vanGoghTheme from "@/themes/van-gogh";

interface VanGoghSleepSwirlProps {
  depth: number;
  phase: 'deep' | 'REM' | 'light';
  duration: number;
  angle: number;
}

export const VanGoghSleepSwirl = ({ depth, phase, duration, angle }: VanGoghSleepSwirlProps) => {
  const baseRadius = 80;
  const r = baseRadius + (1 - depth) * 40;
  const color = vanGoghTheme.getSleepColor(phase);
  const strokeWidth = 2 + depth * 4;
  const opacity = 0.5 + depth * 0.3;

  // Create swirling sleep patterns like Van Gogh's night sky
  const createSwirlPath = (radius: number, swirls: number = 2) => {
    let path = `M ${radius} 0`;
    const steps = 120;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const swirlAngle = progress * Math.PI * 2 + (progress * swirls * Math.PI * 2);
      const r = radius * (0.3 + progress * 0.7);
      const turbulence = Math.sin(progress * Math.PI * 8) * 10 * depth;
      
      const x = Math.cos(swirlAngle) * r + turbulence;
      const y = Math.sin(swirlAngle) * r + turbulence * 0.5;
      
      if (i === 0) {
        path += ` M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    
    return path;
  };

  // Create concentric dream rings for REM sleep
  const createRemnants = () => {
    if (phase !== 'REM') return [];
    
    return [0, 1, 2].map(i => ({
      radius: r - i * 15,
      opacity: opacity * (0.8 - i * 0.2),
      strokeWidth: strokeWidth - i,
      delay: i * 0.8
    }));
  };

  const remRings = createRemnants();

  return (
    <g transform={`rotate(${angle})`}>
      <defs>
        <filter id={`sleepSwirl-${phase}`} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence 
            baseFrequency="0.01 0.02" 
            numOctaves="3"
            type="fractalNoise"
          />
          <feColorMatrix values="0 0 1 0 0 0 0.5 1 0 0 0.2 0.3 1 0 0 0 0 0 1 0"/>
          <feComposite in2="SourceGraphic" operator="multiply"/>
          <feGaussianBlur stdDeviation="2" result="softBlur"/>
          <feMerge>
            <feMergeNode in="softBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <radialGradient id={`sleepGradient-${phase}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{stopColor: color, stopOpacity: opacity}} />
          <stop offset="70%" style={{stopColor: color, stopOpacity: opacity * 0.7}} />
          <stop offset="100%" style={{stopColor: color, stopOpacity: 0.2}} />
        </radialGradient>
      </defs>

      {/* Main sleep circle with Van Gogh texture */}
      <motion.circle
        cx={0} cy={0} r={r}
        stroke={color}
        strokeWidth={strokeWidth}
        fill={phase === 'deep' ? `url(#sleepGradient-${phase})` : 'none'}
        opacity={opacity}
        filter={`url(#sleepSwirl-${phase})`}
        strokeDasharray={phase === 'light' ? "8,4" : "none"}
        animate={{
          scale: [1, 1.02, 1],
          opacity: [opacity * 0.7, opacity, opacity * 0.7]
        }}
        transition={{
          duration: 6 + depth * 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Swirling sleep currents */}
      {phase !== 'light' && (
        <motion.path
          d={createSwirlPath(r * 0.8, phase === 'REM' ? 3 : 1.5)}
          stroke={color}
          strokeWidth={strokeWidth * 0.6}
          fill="none"
          opacity={opacity * 0.6}
          filter={`url(#sleepSwirl-${phase})`}
          strokeLinecap="round"
          animate={{
            rotate: [0, phase === 'REM' ? 360 : 180],
            opacity: [opacity * 0.4, opacity * 0.8, opacity * 0.4]
          }}
          transition={{
            duration: phase === 'REM' ? 20 : 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}

      {/* REM dream ripples */}
      {remRings.map((ring, i) => (
        <motion.circle
          key={i}
          cx={0} cy={0}
          r={ring.radius}
          stroke={color}
          strokeWidth={ring.strokeWidth}
          fill="none"
          opacity={ring.opacity}
          strokeDasharray="6,6"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, i % 2 === 0 ? 360 : -360],
            opacity: [ring.opacity * 0.5, ring.opacity, ring.opacity * 0.5]
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: ring.delay
          }}
        />
      ))}

      {/* Deep sleep breathing aura */}
      {phase === 'deep' && (
        <motion.circle
          cx={0} cy={0}
          r={r + 20}
          stroke={color}
          strokeWidth={1}
          fill="none"
          opacity={0.3}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </g>
  );
};
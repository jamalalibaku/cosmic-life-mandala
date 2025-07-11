/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Van Gogh Mobility Comet - Structured movement trails like shooting stars
 */

import React from "react";
import { motion } from "framer-motion";
import vanGoghTheme from "@/themes/van-gogh";

interface VanGoghMobilityCometProps {
  activity: 'walk' | 'run' | 'bike';
  intensity: number;
  distance: number;
  angle: number;
  time: string;
  radius: number;
}

export const VanGoghMobilityComet = ({ 
  activity, 
  intensity, 
  distance, 
  angle, 
  time,
  radius
}: VanGoghMobilityCometProps) => {
  const color = vanGoghTheme.getActivityColor(activity);
  const strokeWidth = 4 + intensity * 8;
  const trailLength = 40 + distance * 0.8;
  
  // Create comet trail from center outward
  const createCometPath = () => {
    const startX = radius * Math.cos(angle);
    const startY = radius * Math.sin(angle);
    const endX = (radius + trailLength) * Math.cos(angle);
    const endY = (radius + trailLength) * Math.sin(angle);
    
    // Add Van Gogh style curve to the trail
    const midX = ((startX + endX) / 2) + (intensity * 20 * Math.sin(angle + Math.PI/2));
    const midY = ((startY + endY) / 2) + (intensity * 20 * Math.cos(angle + Math.PI/2));
    
    return `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
  };

  return (
    <g style={{ cursor: 'pointer', pointerEvents: 'all' }}>
      <defs>
        <filter id={`cometGlow-${activity}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feTurbulence 
            baseFrequency="0.02 0.05" 
            numOctaves="2"
            type="fractalNoise"
          />
          <feColorMatrix values="1 0.7 0.2 0 0 0.8 1 0.3 0 0 0.2 0.4 1 0 0 0 0 0 1 0"/>
          <feComposite in2="coloredBlur" operator="multiply"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <linearGradient id={`cometGradient-${activity}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: color, stopOpacity: 1}} />
          <stop offset="70%" style={{stopColor: color, stopOpacity: 0.8}} />
          <stop offset="100%" style={{stopColor: color, stopOpacity: 0.2}} />
        </linearGradient>
      </defs>

      {/* Main comet trail */}
      <motion.path
        d={createCometPath()}
        stroke={`url(#cometGradient-${activity})`}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={0.8}
        filter={`url(#cometGlow-${activity})`}
        strokeLinecap="round"
        onClick={() => console.log(`Van Gogh ${activity} comet clicked!`)}
        animate={{
          strokeWidth: [strokeWidth * 0.8, strokeWidth, strokeWidth * 0.8],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 3 + intensity * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Comet head */}
      <motion.circle
        cx={(radius + trailLength) * Math.cos(angle)}
        cy={(radius + trailLength) * Math.sin(angle)}
        r={3 + intensity * 3}
        fill={color}
        opacity={0.9}
        filter={`url(#cometGlow-${activity})`}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Activity icon */}
      <motion.g
        transform={`translate(${(radius + trailLength + 15) * Math.cos(angle)}, ${(radius + trailLength + 15) * Math.sin(angle)})`}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <circle
          cx={0}
          cy={0}
          r={10}
          fill={color}
          opacity={0.3}
        />
        <text
          x={0}
          y={4}
          textAnchor="middle"
          fill={color}
          fontSize={12}
          fontWeight="bold"
        >
          {activity === 'walk' ? '🚶' : activity === 'run' ? '🏃' : '🚴'}
        </text>
      </motion.g>

      {/* Time label */}
      <motion.text
        x={(radius - 20) * Math.cos(angle)}
        y={(radius - 20) * Math.sin(angle)}
        textAnchor="middle"
        fill={color}
        fontSize={9}
        opacity={0.8}
        animate={{
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {time}
      </motion.text>
    </g>
  );
};
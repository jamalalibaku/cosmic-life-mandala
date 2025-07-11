/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Van Gogh Mobility Trail – Movement like shooting stars
 */

import React from "react";
import { motion } from "framer-motion";
import vanGoghTheme from "@/themes/van-gogh";

interface VanGoghMobilityTrailProps {
  activity: 'walk' | 'run' | 'bike';
  intensity: number;
  distance: number;
  angle: number;
  time: string;
}

export const VanGoghMobilityTrail = ({ 
  activity, 
  intensity, 
  distance, 
  angle, 
  time 
}: VanGoghMobilityTrailProps) => {
  const startRadius = 180;
  const trailLength = 60 + distance * 1.2;
  const color = vanGoghTheme.getActivityColor(activity);
  const strokeWidth = 3 + intensity * 6;
  
  // Create Van Gogh style movement trails
  const createMovementTrail = () => {
    const points = [];
    const segments = Math.floor(8 + intensity * 12);
    
    for (let i = 0; i <= segments; i++) {
      const progress = i / segments;
      const currentRadius = startRadius + (trailLength * progress);
      
      // Add Van Gogh style curvature and energy
      const energy = Math.sin(progress * Math.PI * 4) * intensity * 15;
      const curve = Math.cos(progress * Math.PI * 2) * intensity * 10;
      
      const x = Math.cos(angle + progress * 0.2) * currentRadius + curve;
      const y = Math.sin(angle + progress * 0.2) * currentRadius + energy;
      
      points.push({ x, y, intensity: 1 - progress * 0.7 });
    }
    
    return points;
  };

  const trailPoints = createMovementTrail();
  
  // Create path string
  const pathString = trailPoints.reduce((acc, point, i) => {
    if (i === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return acc + ` L ${point.x} ${point.y}`;
  }, '');

  // Activity-specific trail patterns
  const getActivityPattern = () => {
    switch (activity) {
      case 'walk':
        return {
          dashArray: "8,4",
          glowIntensity: 2,
          particleCount: 3
        };
      case 'run':
        return {
          dashArray: "12,2",
          glowIntensity: 4,
          particleCount: 6
        };
      case 'bike':
        return {
          dashArray: "16,8,4,8",
          glowIntensity: 3,
          particleCount: 4
        };
      default:
        return {
          dashArray: "8,4",
          glowIntensity: 2,
          particleCount: 3
        };
    }
  };

  const pattern = getActivityPattern();

  return (
    <g>
      <defs>
        <filter id={`mobilityGlow-${activity}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={pattern.glowIntensity} result="coloredBlur"/>
          <feTurbulence 
            baseFrequency="0.05 0.1" 
            numOctaves="2"
            type="fractalNoise"
          />
          <feColorMatrix values="1 0.5 0 0 0 0.5 1 0.5 0 0 0 0.5 1 0 0 0 0 0 1 0"/>
          <feComposite in2="coloredBlur" operator="multiply"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <linearGradient id={`trailGradient-${activity}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: color, stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: color, stopOpacity: 0.8}} />
          <stop offset="100%" style={{stopColor: color, stopOpacity: 0.2}} />
        </linearGradient>
      </defs>

      {/* Main trail path */}
      <motion.path
        d={pathString}
        stroke={`url(#trailGradient-${activity})`}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={0.8}
        filter={`url(#mobilityGlow-${activity})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pattern.dashArray}
        animate={{
          strokeDashoffset: [0, -50],
          opacity: [0.6, 1, 0.6],
          strokeWidth: [strokeWidth * 0.8, strokeWidth, strokeWidth * 0.8]
        }}
        transition={{
          duration: 4 + intensity * 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Energy particles along the trail */}
      {Array.from({ length: pattern.particleCount }, (_, i) => {
        const pointIndex = Math.floor((trailPoints.length - 1) * (i / pattern.particleCount));
        const point = trailPoints[pointIndex];
        
        return point ? (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={2 + intensity * 2}
            fill={color}
            opacity={0.7}
            animate={{
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.8, 0.3],
              r: [1, 3 + intensity * 2, 1]
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
          />
        ) : null;
      })}

      {/* Activity icon at the end of trail */}
      <motion.g
        transform={`translate(${trailPoints[trailPoints.length - 1]?.x || 0}, ${trailPoints[trailPoints.length - 1]?.y || 0})`}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <circle
          cx={0}
          cy={0}
          r={8}
          fill={color}
          opacity={0.3}
        />
        <text
          x={0}
          y={4}
          textAnchor="middle"
          fill={color}
          fontSize={10}
          fontWeight="bold"
        >
          {activity === 'walk' ? '🚶' : activity === 'run' ? '🏃' : '🚴'}
        </text>
      </motion.g>

      {/* Time label */}
      <motion.text
        x={trailPoints[0]?.x || 0}
        y={(trailPoints[0]?.y || 0) - 15}
        textAnchor="middle"
        fill={color}
        fontSize={8}
        opacity={0.7}
        animate={{
          opacity: [0.5, 0.9, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {time}
      </motion.text>
    </g>
  );
};
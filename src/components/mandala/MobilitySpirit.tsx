/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { motion } from "framer-motion";
import mandalaExpressiveTheme from "@/themes/mandala-expressive";

interface MobilitySpiritProps {
  activity: 'walk' | 'run' | 'bike';
  intensity: number; // 0–1
  distance: number;
  angle: number;
}

export const MobilitySpirit = ({ activity, intensity, distance, angle }: MobilitySpiritProps) => {
  const length = 60 + distance * 0.8;
  const color = mandalaExpressiveTheme.getActivityColor(activity);
  const strokeWidth = 2 + intensity * 3;
  
  // Create flowing trail effect
  const x2 = length * Math.cos(angle);
  const y2 = length * Math.sin(angle);
  
  // Add curve for more organic movement
  const midX = (x2 * 0.7) + (intensity * 10 * Math.sin(angle + Math.PI/2));
  const midY = (y2 * 0.7) + (intensity * 10 * Math.cos(angle + Math.PI/2));
  
  const path = `M 0 0 Q ${midX} ${midY} ${x2} ${y2}`;
  
  return (
    <motion.g
      animate={{ 
        opacity: [0.5, 0.8, 0.5],
        scale: [1, 1.05, 1]
      }}
      transition={{ 
        duration: 3 + intensity * 2, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      <defs>
        <filter id={`mobilityGlow-${activity}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id={`mobilityGradient-${activity}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: color, stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: color, stopOpacity: 0.3}} />
        </linearGradient>
      </defs>
      <path
        d={path}
        stroke={`url(#mobilityGradient-${activity})`}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={0.7 + intensity * 0.2}
        filter={`url(#mobilityGlow-${activity})`}
        strokeLinecap="round"
      />
    </motion.g>
  );
};
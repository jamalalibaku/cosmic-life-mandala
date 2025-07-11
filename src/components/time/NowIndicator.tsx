/**
 * [Phase: ZIP9-Delta | Fixed Break: Stabilization]
 * NOW Indicator - Fixed at 0° (North) position
 * 
 * Purpose: Visual representation of current time position - ALWAYS AT TOP
 * Features: Fixed north alignment, subtle pulse, no rotation
 * Dependencies: TimeAxisContext (for data only, not rotation)
 */

import React from 'react';
import { motion } from 'framer-motion';

interface NowIndicatorProps {
  centerX: number;
  centerY: number;
  radius: number;
  theme?: string;
  isStable?: boolean; // Flag to control animations during stabilization
}

export const NowIndicator: React.FC<NowIndicatorProps> = ({
  centerX,
  centerY,
  radius,
  theme = 'default',
  isStable = true
}) => {
  // NOW is ALWAYS at 0° (North) - Fixed position
  const lineLength = radius + 30;
  const nowRadian = 0; // FIXED at 0° (North)
  const lineEndX = centerX + lineLength * Math.cos(nowRadian - Math.PI/2); // -π/2 to make 0° point North
  const lineEndY = centerY + lineLength * Math.sin(nowRadian - Math.PI/2);
  
  return (
    <g>
      {/* Fixed NOW line - NEVER rotates */}
      <motion.line
        x1={centerX}
        y1={centerY}
        x2={lineEndX}
        y2={lineEndY}
        stroke="hsl(45, 80%, 60%)"
        strokeWidth="2"
        opacity="0.9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* NOW marker - stable pulse only when system is stable */}
      <motion.circle
        cx={lineEndX}
        cy={lineEndY}
        r="4"
        fill="hsl(45, 80%, 60%)"
        opacity="1"
        animate={isStable ? {
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        } : {
          scale: 1,
          opacity: 1
        }}
        transition={isStable ? {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        } : { duration: 0 }}
      />
      
      {/* NOW text - fixed position */}
      <text
        x={lineEndX + 10}
        y={lineEndY + 4}
        fill="hsl(45, 80%, 70%)"
        fontSize="10"
        fontWeight="500"
        fontFamily="Inter, system-ui, sans-serif"
        opacity="0.9"
      >
        NOW
      </text>
    </g>
  );
};
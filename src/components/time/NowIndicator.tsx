/**
 * [Phase: ZIP9-Beta | Lap 2: Visual Confirmation]
 * NOW Indicator - Time flow visualization
 * 
 * Purpose: Visual representation of current time position
 * Features: Pulse animation, north alignment, time awareness
 * Dependencies: TimeAxisContext
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTimeAxis } from '@/contexts/TimeAxisContext';

interface NowIndicatorProps {
  centerX: number;
  centerY: number;
  radius: number;
  theme?: string;
}

export const NowIndicator: React.FC<NowIndicatorProps> = ({
  centerX,
  centerY,
  radius,
  theme = 'default'
}) => {
  const { nowAngle } = useTimeAxis();
  
  // Calculate NOW line endpoint
  const lineLength = radius + 30;
  const nowRadian = (nowAngle * Math.PI) / 180;
  const lineEndX = centerX + lineLength * Math.cos(nowRadian);
  const lineEndY = centerY + lineLength * Math.sin(nowRadian);
  
  return (
    <g>
      {/* Glowing NOW line */}
      <motion.line
        x1={centerX}
        y1={centerY}
        x2={lineEndX}
        y2={lineEndY}
        stroke="hsl(45, 100%, 70%)"
        strokeWidth="3"
        opacity="0.9"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: [0.6, 1, 0.6],
          strokeWidth: [2, 4, 2]
        }}
        transition={{ 
          pathLength: { duration: 1, ease: "easeOut" },
          opacity: { duration: 2, repeat: Infinity },
          strokeWidth: { duration: 2, repeat: Infinity }
        }}
      />
      
      {/* Radial glow at NOW position */}
      <motion.circle
        cx={lineEndX}
        cy={lineEndY}
        r="8"
        fill="hsl(45, 100%, 70%)"
        opacity="0.8"
        animate={{
          r: [6, 12, 6],
          opacity: [0.8, 0.4, 0.8]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* NOW text label */}
      <motion.text
        x={lineEndX + 15}
        y={lineEndY + 5}
        fill="hsl(45, 100%, 80%)"
        fontSize="12"
        fontWeight="600"
        fontFamily="Inter, system-ui, sans-serif"
        letterSpacing="0.1em"
        initial={{ opacity: 0, x: lineEndX, y: lineEndY }}
        animate={{ 
          opacity: [0.7, 1, 0.7],
          x: lineEndX + 15,
          y: lineEndY + 5
        }}
        transition={{
          opacity: { duration: 2, repeat: Infinity },
          duration: 0.5
        }}
      >
        NOW
      </motion.text>
      
      {/* Time pulse rings */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r="20"
        fill="none"
        stroke="hsl(45, 80%, 60%)"
        strokeWidth="1"
        opacity="0.3"
        animate={{
          r: [20, 40, 60],
          opacity: [0.3, 0.1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
    </g>
  );
};
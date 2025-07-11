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
      {/* Minimal NOW line - data-focused, not decorative */}
      <motion.line
        x1={centerX}
        y1={centerY}
        x2={lineEndX}
        y2={lineEndY}
        stroke="hsl(45, 80%, 60%)"
        strokeWidth="2"
        opacity="0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      
      {/* Data point at NOW position - subtle presence */}
      <motion.circle
        cx={lineEndX}
        cy={lineEndY}
        r="4"
        fill="hsl(45, 80%, 60%)"
        opacity="0.9"
        animate={{
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* NOW text - minimal, data-label only */}
      <text
        x={lineEndX + 10}
        y={lineEndY + 4}
        fill="hsl(45, 80%, 70%)"
        fontSize="10"
        fontWeight="400"
        fontFamily="Inter, system-ui, sans-serif"
        opacity="0.8"
      >
        NOW
      </text>
    </g>
  );
};
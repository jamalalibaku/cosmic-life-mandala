/**
 * [Phase: ZIP9-Beta | Lap 4: Interactive Insight & Response Logic]
 * Insight Trigger Zone - Interactive slice that responds to clicks/hovers
 * 
 * Purpose: Enable user interaction with time slices to trigger insights and neural impulses
 * Features: Click handlers, hover effects, metadata capture for future AI insights
 * Dependencies: TimeAxisContext, InsightEngine
 */

import React from 'react';
import { motion } from 'framer-motion';

interface SliceInteractionData {
  slice: any;
  layerType: string;
  timestamp: string;
  dataValue: any;
  angle: number;
}

interface InsightTriggerZoneProps {
  slice: any;
  layerType: string;
  radius: number;
  angle: number;
  color: string;
  size?: number;
  onSliceInteraction: (data: SliceInteractionData) => void;
  isReviewed?: boolean;
}

export const InsightTriggerZone: React.FC<InsightTriggerZoneProps> = ({
  slice,
  layerType,
  radius,
  angle,
  color,
  size = 4,
  onSliceInteraction,
  isReviewed = false
}) => {
  const radian = (angle * Math.PI) / 180;
  const x = radius * Math.cos(radian);
  const y = radius * Math.sin(radian);

  const handleClick = () => {
    console.log('🧠 InsightTriggerZone clicked:', {
      layerType,
      slice: slice.id,
      timestamp: slice.timestamp || slice.date?.toISOString(),
      angle
    });

    onSliceInteraction({
      slice,
      layerType,
      timestamp: slice.timestamp || slice.date?.toISOString(),
      dataValue: slice.data?.[layerType],
      angle
    });
  };

  return (
    <motion.g>
      {/* Interaction Zone */}
      <motion.circle
        cx={x}
        cy={y}
        r={size + 2} // Larger hit area
        fill="transparent"
        cursor="pointer"
        onClick={handleClick}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      />
      
      {/* Visual Indicator */}
      <motion.circle
        cx={x}
        cy={y}
        r={size}
        fill={color}
        opacity={isReviewed ? 0.4 : 0.8}
        stroke={isReviewed ? "hsl(var(--primary))" : "transparent"}
        strokeWidth={isReviewed ? 1 : 0}
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          opacity: isReviewed ? 0.4 : [0.6, 0.9, 0.6]
        }}
        transition={{
          scale: { duration: 0.3 },
          opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          filter: isReviewed ? "saturate(0.6)" : "saturate(1.2)"
        }}
      />
      
      {/* Reviewed Memory Halo */}
      {isReviewed && (
        <motion.circle
          cx={x}
          cy={y}
          r={size + 3}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          opacity="0.3"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.g>
  );
};
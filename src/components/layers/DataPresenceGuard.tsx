/**
 * [Phase: ZIP9-Beta | Lap 2: Data-First Visual Hierarchy]
 * Data Presence Guard - Only render layers with actual data
 * 
 * Purpose: Hide empty layers, show only data-bearing content
 * Features: Data validation, conditional rendering, clean visual hierarchy
 * Dependencies: TimeAxisContext
 */

import React from 'react';
import { motion } from 'framer-motion';

interface DataPresenceGuardProps {
  children: React.ReactNode;
  dataPoints: any[];
  layerName: string;
  minDataThreshold?: number;
}

export const DataPresenceGuard: React.FC<DataPresenceGuardProps> = ({
  children,
  dataPoints,
  layerName,
  minDataThreshold = 1
}) => {
  const hasValidData = dataPoints && dataPoints.length >= minDataThreshold;
  
  if (!hasValidData) {
    console.log(`📊 DataPresenceGuard: ${layerName} hidden (${dataPoints?.length || 0} data points < ${minDataThreshold})`);
    return null;
  }
  
  console.log(`📊 DataPresenceGuard: ${layerName} visible (${dataPoints.length} data points)`);
  
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.g>
  );
};

interface MinimalLayerRingProps {
  centerX: number;
  centerY: number;
  radius: number;
  hasData: boolean;
  layerName: string;
}

export const MinimalLayerRing: React.FC<MinimalLayerRingProps> = ({
  centerX,
  centerY,
  radius,
  hasData,
  layerName
}) => {
  if (!hasData) return null;
  
  return (
    <circle
      cx={centerX}
      cy={centerY}
      r={radius}
      fill="none"
      stroke="hsl(240, 20%, 40%)"
      strokeWidth="1"
      opacity="0.2"
      strokeDasharray="2,4"
    />
  );
};
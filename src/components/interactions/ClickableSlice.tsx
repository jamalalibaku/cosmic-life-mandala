/**
 * Clickable Slice System
 * Individual time slices that can be clicked for focus zoom
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface SliceData {
  angle: number;
  timeData: any;
  sliceType: 'past' | 'present' | 'future';
  radius: number;
}

export interface ClickableSliceProps {
  slice: SliceData;
  color: string;
  onClick?: (sliceData: SliceData) => void;
  onFocusZoom?: (sliceData: SliceData) => void;
  children: React.ReactNode;
}

export const ClickableSlice: React.FC<ClickableSliceProps> = ({
  slice,
  color,
  onClick,
  onFocusZoom,
  children
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = () => {
    onClick?.(slice);
  };

  const handleDoubleClick = () => {
    setIsFocused(true);
    onFocusZoom?.(slice);
    
    // Reset focus after animation
    setTimeout(() => setIsFocused(false), 1000);
  };

  const sliceOpacity = slice.sliceType === 'present' ? 1 : 
                     slice.sliceType === 'past' ? 0.7 : 0.4;

  return (
    <motion.g
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      animate={{
        scale: isFocused ? 1.1 : isHovered ? 1.05 : 1,
        opacity: isHovered ? Math.min(sliceOpacity + 0.2, 1) : sliceOpacity
      }}
      transition={{
        duration: isFocused ? 0.5 : 0.2,
        ease: isFocused ? "easeInOut" : "easeOut"
      }}
    >
      {/* Slice highlight on hover */}
      {isHovered && (
        <motion.path
          d={`M 0 0 L ${Math.cos(slice.angle) * slice.radius} ${Math.sin(slice.angle) * slice.radius} 
             A ${slice.radius} ${slice.radius} 0 0 1 ${Math.cos(slice.angle + 0.1) * slice.radius} ${Math.sin(slice.angle + 0.1) * slice.radius} Z`}
          fill={color}
          opacity={0.3}
          style={{
            filter: `drop-shadow(0 0 6px ${color}60)`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* Focus zoom indicator */}
      {isFocused && (
        <motion.circle
          cx={Math.cos(slice.angle) * slice.radius * 0.7}
          cy={Math.sin(slice.angle) * slice.radius * 0.7}
          r={8}
          fill={color}
          stroke="white"
          strokeWidth={2}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0.8]
          }}
          transition={{ duration: 0.5 }}
        />
      )}
      
      {children}
    </motion.g>
  );
};
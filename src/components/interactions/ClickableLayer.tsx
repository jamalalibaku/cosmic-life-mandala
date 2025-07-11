/**
 * Clickable Layer System
 * Makes entire rings, slices, and elements interactive
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface ClickableLayerProps {
  radius: number;
  color: string;
  name: string;
  layerType?: string;
  onClick?: (layerData: any) => void;
  onHover?: (isHovered: boolean) => void;
  children: React.ReactNode;
}

export const ClickableLayer: React.FC<ClickableLayerProps> = ({
  radius,
  color,
  name,
  layerType,
  onClick,
  onHover,
  children
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    onHover?.(false);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    onClick?.({
      name,
      layerType,
      radius,
      color,
      timestamp: new Date()
    });
  };

  return (
    <motion.g
      style={{ cursor: 'pointer' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      animate={{
        scale: isPressed ? 0.98 : isHovered ? 1.02 : 1,
        opacity: isHovered ? 1 : 0.9
      }}
      transition={{
        duration: 0.15,
        ease: "easeOut"
      }}
    >
      {/* Invisible clickable area */}
      <circle
        cx={0}
        cy={0}
        r={radius + 15}
        fill="transparent"
        stroke="none"
      />
      
      {/* Hover highlight ring */}
      {isHovered && (
        <motion.circle
          cx={0}
          cy={0}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3}
          opacity={0.6}
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
            strokeDasharray: "5,5"
          }}
          animate={{
            strokeDashoffset: [0, -10],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            strokeDashoffset: {
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            },
            opacity: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          initial={{ opacity: 0 }}
        />
      )}
      
      {/* Ripple effect on click */}
      {isPressed && (
        <motion.circle
          cx={0}
          cy={0}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={2}
          initial={{
            scale: 1,
            opacity: 0.8
          }}
          animate={{
            scale: [1, 1.3],
            opacity: [0.8, 0],
            strokeWidth: [2, 0.5]
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut"
          }}
        />
      )}
      
      {children}
    </motion.g>
  );
};
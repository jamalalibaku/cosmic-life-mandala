/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Cosmic Radial Ticks - Symbolic time markers
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useVisualSkin } from '../visual-skin-provider';

interface CosmicRadialTicksProps {
  center: { x: number; y: number };
  radius: number;
  tickCount?: number;
  className?: string;
}

export const CosmicRadialTicks: React.FC<CosmicRadialTicksProps> = ({
  center,
  radius,
  tickCount = 24, // 24 hour markers by default
  className = ''
}) => {
  const { themeConfig } = useVisualSkin();

  // Only render for Cosmic theme
  if (themeConfig.name !== 'Cosmic Default') return null;

  const ticks = Array.from({ length: tickCount }, (_, index) => {
    const angle = (index / tickCount) * 2 * Math.PI - Math.PI / 2;
    const innerRadius = radius * 0.96;
    const outerRadius = radius * 1.02;
    
    const x1 = center.x + Math.cos(angle) * innerRadius;
    const y1 = center.y + Math.sin(angle) * innerRadius;
    const x2 = center.x + Math.cos(angle) * outerRadius;
    const y2 = center.y + Math.sin(angle) * outerRadius;

    // Major ticks every 6 hours (0, 6, 12, 18)
    const isMajor = index % 6 === 0;
    
    return {
      x1, y1, x2, y2,
      isMajor,
      opacity: isMajor ? 0.15 : 0.08,
      strokeWidth: isMajor ? 0.8 : 0.4
    };
  });

  return (
    <g className={`cosmic-radial-ticks ${className}`} style={{ zIndex: 0 }}>
      {/* Gradient definition for ticks */}
      <defs>
        <linearGradient id="cosmic-tick-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={themeConfig.colors.text} stopOpacity={0} />
          <stop offset="50%" stopColor={themeConfig.colors.text} stopOpacity={1} />
          <stop offset="100%" stopColor={themeConfig.colors.text} stopOpacity={0} />
        </linearGradient>
        
        <filter id="cosmic-tick-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </defs>

      {ticks.map((tick, index) => (
        <motion.line
          key={`cosmic-tick-${index}`}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke="url(#cosmic-tick-gradient)"
          strokeWidth={tick.strokeWidth}
          strokeLinecap="round"
          opacity={tick.opacity}
          filter="url(#cosmic-tick-blur)"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: tick.opacity,
            strokeWidth: tick.strokeWidth 
          }}
          transition={{
            duration: 2,
            delay: index * 0.05,
            ease: "easeOut"
          }}
        />
      ))}
    </g>
  );
};
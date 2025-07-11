/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Cosmic Background Pulse - Subtle celestial rhythm
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useVisualSkin } from '../visual-skin-provider';
import { useUnifiedMotion } from '../../hooks/useUnifiedMotion';

interface CosmicBackgroundPulseProps {
  center: { x: number; y: number };
  layers: Array<{ radius: number; offset: number }>;
  className?: string;
}

export const CosmicBackgroundPulse: React.FC<CosmicBackgroundPulseProps> = ({
  center,
  layers,
  className = ''
}) => {
  const { themeConfig } = useVisualSkin();
  const { breathing, timeAccumulator } = useUnifiedMotion();
  const [pulsePhases, setPulsePhases] = useState<number[]>([]);

  // Initialize phase offsets for each ring
  useEffect(() => {
    const phases = layers.map((_, index) => Math.random() * Math.PI * 2);
    setPulsePhases(phases);
  }, [layers.length]);

  // Only render for Cosmic theme
  if (themeConfig.name !== 'Cosmic Default') return null;

  return (
    <g className={`cosmic-background-pulse ${className}`} style={{ zIndex: 0 }}>
      {/* Background gradient definition */}
      <defs>
        <radialGradient id="cosmic-pulse-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={themeConfig.colors.primary} stopOpacity={0.02} />
          <stop offset="70%" stopColor={themeConfig.colors.secondary} stopOpacity={0.05} />
          <stop offset="100%" stopColor={themeConfig.colors.accent} stopOpacity={0.01} />
        </radialGradient>
        
        <filter id="cosmic-depth-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.3 0"/>
        </filter>
      </defs>

      {/* Pulsing background rings */}
      {layers.map((layer, index) => {
        const phase = pulsePhases[index] || 0;
        const pulseTime = timeAccumulator * 0.0008 + phase; // Very slow pulse
        const opacity = 0.05 + Math.sin(pulseTime + layer.offset) * 0.03; // 0.02-0.08 range
        const scale = 1 + Math.sin(pulseTime + layer.offset * 0.7) * 0.008; // Minimal scale variation

        return (
          <motion.circle
            key={`cosmic-pulse-${index}`}
            cx={center.x}
            cy={center.y}
            r={layer.radius}
            fill="none"
            stroke="url(#cosmic-pulse-gradient)"
            strokeWidth={0.5}
            opacity={opacity}
            filter="url(#cosmic-depth-blur)"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: `${center.x}px ${center.y}px`
            }}
            transition={{
              opacity: { duration: 8, ease: [0.4, 0, 0.6, 1] },
              transform: { duration: 12, ease: [0.4, 0, 0.6, 1] }
            }}
          />
        );
      })}
    </g>
  );
};
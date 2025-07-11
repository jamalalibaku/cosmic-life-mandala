/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Ripple Trails for Mandala Layer Interactions
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualSkin } from '../visual-skin-provider';
import { useUnifiedMotion } from '../../hooks/useUnifiedMotion';

interface RippleTrail {
  id: string;
  x: number;
  y: number;
  intensity: number;
  layer: string;
}

interface RippleTrailsProps {
  center: { x: number; y: number };
  className?: string;
}

export const RippleTrails: React.FC<RippleTrailsProps> = ({
  center,
  className = ''
}) => {
  const { themeConfig } = useVisualSkin();
  const { breathing } = useUnifiedMotion();
  const [ripples, setRipples] = useState<RippleTrail[]>([]);

  // Generate ripples based on breathing pulse
  useEffect(() => {
    if (themeConfig.name !== 'Mandala Expressive') return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance per cycle
        const angle = Math.random() * 2 * Math.PI;
        const radius = 50 + Math.random() * 150;
        const newRipple: RippleTrail = {
          id: `ripple-${Date.now()}-${Math.random()}`,
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius,
          intensity: breathing * 0.8 + 0.2,
          layer: ['mood', 'sleep', 'mobility', 'weather'][Math.floor(Math.random() * 4)]
        };

        setRipples(prev => [...prev.slice(-3), newRipple]); // Keep max 4 ripples
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [breathing, center, themeConfig.name]);

  if (themeConfig.name !== 'Mandala Expressive') return null;

  return (
    <g className={className}>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.circle
            key={ripple.id}
            cx={ripple.x}
            cy={ripple.y}
            r={0}
            fill="none"
            stroke={themeConfig.colors.accent}
            strokeWidth={1}
            initial={{ 
              r: 0, 
              opacity: ripple.intensity,
              strokeWidth: 2
            }}
            animate={{ 
              r: 40,
              opacity: 0,
              strokeWidth: 0.5
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3,
              ease: "easeOut"
            }}
            onAnimationComplete={() => {
              setRipples(prev => prev.filter(r => r.id !== ripple.id));
            }}
          />
        ))}
      </AnimatePresence>
    </g>
  );
};
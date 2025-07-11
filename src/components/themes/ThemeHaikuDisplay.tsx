/**
 * [Phase: ZIP9-Beta | Lap 2: Visual Confirmation]
 * Theme Haiku Display - Poetry overlay system
 * 
 * Purpose: Expressive text overlays for current theme
 * Features: Animated appearance, theme-aware positioning
 * Dependencies: ThemeOverlaySystem
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeHaikuDisplayProps {
  theme: string;
  centerX: number;
  centerY: number;
  maxRadius: number;
  isVisible?: boolean;
}

const themeHaikus = {
  floral: {
    lines: ["Petals drift through time", "Memories bloom in spirals", "Life's garden unfolds"],
    color: "hsl(300, 60%, 80%)",
    position: "bottom-left"
  },
  noir: {
    lines: ["Shadows tell stories", "Memories in black and white", "Time's silent witness"],
    color: "hsl(45, 100%, 60%)",
    position: "top-right"
  },
  techHud: {
    lines: ["Data streams flowing", "Digital life patterns", "Future's pulse beats strong"],
    color: "hsl(180, 100%, 60%)",
    position: "bottom-right"
  },
  mandalaExpressive: {
    lines: ["Circles within circles", "Life spirals ever inward", "Center holds all time"],
    color: "hsl(280, 70%, 70%)",
    position: "top-left"
  },
  default: {
    lines: ["Time flows like water", "Each moment a ripple", "Life's rhythm eternal"],
    color: "hsl(240, 50%, 70%)",
    position: "bottom-center"
  }
};

export const ThemeHaikuDisplay: React.FC<ThemeHaikuDisplayProps> = ({
  theme,
  centerX,
  centerY,
  maxRadius,
  isVisible = true
}) => {
  const haiku = themeHaikus[theme as keyof typeof themeHaikus] || themeHaikus.default;
  
  // Calculate position based on haiku.position
  const getPosition = () => {
    const offset = maxRadius + 40;
    switch (haiku.position) {
      case 'top-left':
        return { x: centerX - offset, y: centerY - offset };
      case 'top-right':
        return { x: centerX + offset - 120, y: centerY - offset };
      case 'bottom-left':
        return { x: centerX - offset, y: centerY + offset - 60 };
      case 'bottom-right':
        return { x: centerX + offset - 120, y: centerY + offset - 60 };
      case 'bottom-center':
        return { x: centerX - 60, y: centerY + offset - 30 };
      default:
        return { x: centerX - 60, y: centerY + offset };
    }
  };
  
  const { x, y } = getPosition();
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {/* Subtle background - minimal presence */}
          <rect
            x={x - 5}
            y={y - 5}
            width="120"
            height="60"
            rx="4"
            fill="hsl(0, 0%, 0%)"
            opacity="0.1"
          />
          
          {/* Haiku lines - background text only */}
          {haiku.lines.map((line, index) => (
            <text
              key={index}
              x={x}
              y={y + (index * 16) + 16}
              fill={haiku.color}
              fontSize="9"
              fontWeight="200"
              fontFamily="serif"
              fontStyle="italic"
              opacity="0.4"
            >
              {line}
            </text>
          ))}
        </motion.g>
      )}
    </AnimatePresence>
  );
};
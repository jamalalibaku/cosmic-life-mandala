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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Background glow */}
          <motion.rect
            x={x - 10}
            y={y - 10}
            width="140"
            height="80"
            rx="8"
            fill="hsl(0, 0%, 0%)"
            opacity="0.7"
            animate={{
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Haiku lines */}
          {haiku.lines.map((line, index) => (
            <motion.text
              key={index}
              x={x}
              y={y + (index * 20) + 20}
              fill={haiku.color}
              fontSize="11"
              fontWeight="300"
              fontFamily="serif"
              fontStyle="italic"
              letterSpacing="0.05em"
              initial={{ opacity: 0, x: x - 20 }}
              animate={{ 
                opacity: [0.8, 1, 0.8],
                x: x
              }}
              transition={{
                opacity: { 
                  duration: 3, 
                  repeat: Infinity,
                  delay: index * 0.5
                },
                x: { duration: 0.8, delay: index * 0.3 }
              }}
            >
              {line}
            </motion.text>
          ))}
          
          {/* Decorative accent */}
          <motion.circle
            cx={x + 130}
            cy={y + 35}
            r="3"
            fill={haiku.color}
            animate={{
              r: [2, 4, 2],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>
      )}
    </AnimatePresence>
  );
};
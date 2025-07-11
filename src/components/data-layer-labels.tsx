/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayerButton {
  key: string;
  label: string;
  icon: string;
  color: string;
}

interface DataLayerLabelsProps {
  activeControls?: Record<string, boolean>;
  theme: string;
  onToggle: (layerKey: string) => void;
  centerX: number;
  centerY: number;
}

export const DataLayerLabels: React.FC<DataLayerLabelsProps> = ({
  activeControls = {},
  theme,
  onToggle,
  centerX,
  centerY,
}) => {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const layerData = [
    { 
      key: 'weather', 
      label: 'Weather', 
      icon: '☀️',
      color: 'from-orange-400 to-red-500'
    },
    { 
      key: 'plans', 
      label: 'Plans', 
      icon: '📋',
      color: 'from-blue-400 to-purple-500'
    },
    { 
      key: 'mobility', 
      label: 'Mobility', 
      icon: '🚶',
      color: 'from-green-400 to-teal-500'
    },
    { 
      key: 'sleep', 
      label: 'Sleep', 
      icon: '😴',
      color: 'from-purple-400 to-indigo-500'
    },
    { 
      key: 'emotional', 
      label: 'Emotional', 
      icon: '💭',
      color: 'from-pink-400 to-rose-500'
    },
  ];

  // Fibonacci spiral positioning based on golden ratio
  const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21];
  const goldenRatio = 1.618033988749;
  const baseRadius = 420; // Distance from center
  
  // Calculate positions using Fibonacci spiral
  const calculatePosition = (index: number) => {
    const angle = (index / layerData.length) * 2 * Math.PI - Math.PI / 2; // Start from top
    const spiralRadius = baseRadius + (fibonacci[index] || fibonacci[fibonacci.length - 1]) * 5;
    
    return {
      x: centerX + Math.cos(angle) * spiralRadius,
      y: centerY + Math.sin(angle) * spiralRadius,
      angle: angle * (180 / Math.PI), // For rotation if needed
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {layerData.map((layer, index) => {
        const isActive = activeControls?.[layer.key] || false;
        const isHovered = hoveredLabel === layer.key;
        const position = calculatePosition(index);
        
        return (
          <motion.div
            key={layer.key}
            className="absolute pointer-events-auto"
            style={{
              left: position.x - 24, // Center the 48px button
              top: position.y - 24,
            }}
            initial={{ 
              opacity: 0, 
              scale: 0,
              x: centerX - position.x,
              y: centerY - position.y,
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: 0,
              y: 0,
            }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.15,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
            }}
            onMouseEnter={() => setHoveredLabel(layer.key)}
            onMouseLeave={() => setHoveredLabel(null)}
          >
            <motion.button
              onClick={() => onToggle(layer.key)}
              className={`
                relative overflow-hidden
                w-12 h-12 rounded-full
                flex items-center justify-center
                text-lg font-bold
                backdrop-blur-sm
                transition-all duration-300
                border-2
                ${isActive 
                  ? 'border-white/60 shadow-2xl' 
                  : 'border-white/30 hover:border-white/50'
                }
              `}
              style={{
                background: isActive 
                  ? `radial-gradient(circle, ${layer.color.split(' ')[1]}, ${layer.color.split(' ')[3]})`
                  : `radial-gradient(circle, rgba(255,255,255,0.15), rgba(255,255,255,0.05))`,
                filter: isActive 
                  ? `drop-shadow(0 0 20px ${layer.color.includes('orange') ? '#f97316' : 
                      layer.color.includes('blue') ? '#3b82f6' : 
                      layer.color.includes('green') ? '#10b981' : 
                      layer.color.includes('purple') ? '#8b5cf6' : '#ec4899'}50)` 
                  : 'none',
                transform: `rotate(${position.angle / 4}deg)`, // Subtle rotation based on position
              }}
              whileHover={{ 
                scale: 1.15,
                rotate: 0, // Reset rotation on hover
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="relative z-10 drop-shadow-lg" style={{ transform: `rotate(${-position.angle / 4}deg)` }}>
                {layer.icon}
              </span>
              
              {/* Fibonacci spiral glow effect */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full opacity-50"
                  style={{
                    background: `conic-gradient(from ${position.angle}deg, ${layer.color.split(' ')[1]}, ${layer.color.split(' ')[3]}, ${layer.color.split(' ')[1]})`,
                    filter: `blur(8px) brightness(1.3)`
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                    rotate: [0, 360],
                  }}
                  transition={{
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  }}
                />
              )}
              
              {/* Fibonacci connection lines */}
              {isActive && index > 0 && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: index * 0.15 + 0.5 }}
                >
                  <svg 
                    className="absolute inset-0 w-full h-full"
                    style={{ 
                      width: baseRadius * 2, 
                      height: baseRadius * 2,
                      left: -baseRadius + 24,
                      top: -baseRadius + 24,
                    }}
                  >
                    <path
                      d={`M ${baseRadius} ${baseRadius} Q ${position.x - centerX + baseRadius} ${position.y - centerY + baseRadius} ${calculatePosition(index - 1).x - centerX + baseRadius} ${calculatePosition(index - 1).y - centerY + baseRadius}`}
                      stroke={layer.color.includes('orange') ? '#f97316' : 
                              layer.color.includes('blue') ? '#3b82f6' : 
                              layer.color.includes('green') ? '#10b981' : 
                              layer.color.includes('purple') ? '#8b5cf6' : '#ec4899'}
                      strokeWidth="1"
                      fill="none"
                      opacity="0.3"
                      strokeDasharray="4,8"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>

            {/* Enhanced label tooltip with golden ratio positioning */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute pointer-events-none z-50"
                  style={{
                    left: position.x > centerX ? -120 : 60, // Position based on side of circle
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-black/90 text-white px-4 py-2 rounded-xl text-sm
                                 backdrop-blur-md border border-white/20 whitespace-nowrap
                                 shadow-2xl">
                    {layer.label}
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2"
                      style={{
                        [position.x > centerX ? 'right' : 'left']: -4,
                      }}
                    >
                      <div 
                        className="border-4 border-transparent"
                        style={{
                          [position.x > centerX ? 'borderLeftColor' : 'borderRightColor']: 'rgba(0,0,0,0.9)',
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
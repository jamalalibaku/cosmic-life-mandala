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

  // Layer definitions with ring-specific radii and colors
  const layerData = [
    { 
      key: 'weather', 
      label: 'Weather', 
      icon: '☀️',
      color: 'hsl(45, 70%, 70%)',
      glowColor: '#f59e0b',
      radius: 310, // Weather ring radius
      labelOffset: 15
    },
    { 
      key: 'plans', 
      label: 'Plans', 
      icon: '📋',
      color: 'hsl(200, 60%, 70%)',
      glowColor: '#3b82f6',
      radius: 285, // Plans ring radius
      labelOffset: 12
    },
    { 
      key: 'mobility', 
      label: 'Mobility', 
      icon: '🚶',
      color: 'hsl(120, 50%, 70%)',
      glowColor: '#10b981',
      radius: 245, // Mobility ring radius
      labelOffset: 10
    },
    { 
      key: 'mood', 
      label: 'Mood', 
      icon: '💭',
      color: 'hsl(320, 60%, 70%)',
      glowColor: '#ec4899',
      radius: 205, // Mood ring radius
      labelOffset: 8
    },
    { 
      key: 'sleep', 
      label: 'Sleep', 
      icon: '😴',
      color: 'hsl(260, 50%, 70%)',
      glowColor: '#8b5cf6',
      radius: 165, // Sleep ring radius
      labelOffset: 6
    },
  ];

  // Calculate curved positions along the ring
  const calculateRingPosition = (layer: typeof layerData[0], angleOffset: number = 0) => {
    // Position label at the top-right of each ring for better visibility
    const angle = (Math.PI / 4) + angleOffset; // 45 degrees + offset
    const x = centerX + Math.cos(angle) * layer.radius;
    const y = centerY + Math.sin(angle) * layer.radius;
    
    return {
      x,
      y,
      angle: angle * (180 / Math.PI), // Convert to degrees
      tangentAngle: angle + Math.PI / 2 // Perpendicular to radius for tangential text
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* SVG overlay for curved text labels */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {layerData.map((layer) => (
            <path
              key={`path-${layer.key}`}
              id={`ring-path-${layer.key}`}
              d={`M ${centerX - layer.radius} ${centerY} A ${layer.radius} ${layer.radius} 0 1 1 ${centerX + layer.radius} ${centerY} A ${layer.radius} ${layer.radius} 0 1 1 ${centerX - layer.radius} ${centerY}`}
              fill="none"
            />
          ))}
        </defs>
        
        {layerData.map((layer, index) => {
          const isActive = activeControls?.[layer.key] || false;
          const isHovered = hoveredLabel === layer.key;
          
          return (
            <g key={layer.key}>
              {/* Curved text label */}
              <text
                className="pointer-events-auto cursor-pointer text-sm font-medium tracking-wide"
                style={{
                  fill: isActive ? 'white' : layer.color,
                  filter: isActive 
                    ? `drop-shadow(0 0 8px ${layer.glowColor}) drop-shadow(0 0 16px ${layer.glowColor}60)` 
                    : `drop-shadow(0 1px 2px rgba(0,0,0,0.8))`,
                  fontSize: '13px',
                  letterSpacing: '1px',
                  fontWeight: isActive ? '600' : '500'
                }}
                onClick={() => onToggle(layer.key)}
                onMouseEnter={() => setHoveredLabel(layer.key)}
                onMouseLeave={() => setHoveredLabel(null)}
              >
                <textPath
                  href={`#ring-path-${layer.key}`}
                  startOffset="25%" // Position along the path
                  textAnchor="middle"
                >
                  <motion.tspan
                    animate={isActive ? {
                      opacity: [1, 0.8, 1],
                    } : {}}
                    transition={isActive ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    } : {}}
                  >
                    {layer.icon} {layer.label}
                  </motion.tspan>
                </textPath>
              </text>
              
              {/* Harmonic vibration ring for active layers */}
              {isActive && (
                <motion.circle
                  cx={centerX}
                  cy={centerY}
                  r={layer.radius}
                  fill="none"
                  stroke={layer.glowColor}
                  strokeWidth="1"
                  opacity="0.4"
                  strokeDasharray="2,8"
                  animate={{
                    strokeDashoffset: [0, -10],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    strokeDashoffset: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    opacity: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }
                  }}
                />
              )}
              
              {/* Portal activation ripple */}
              {isHovered && (
                <motion.circle
                  cx={centerX}
                  cy={centerY}
                  r={layer.radius}
                  fill="none"
                  stroke={layer.glowColor}
                  strokeWidth="2"
                  opacity="0.6"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ 
                    scale: [0.95, 1.02, 1],
                    opacity: [0, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Interactive click zones for better UX */}
      {layerData.map((layer, index) => {
        const position = calculateRingPosition(layer);
        const isActive = activeControls?.[layer.key] || false;
        
        return (
          <motion.div
            key={`click-zone-${layer.key}`}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: position.x - 40,
              top: position.y - 15,
              width: 80,
              height: 30,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            onClick={() => onToggle(layer.key)}
            onMouseEnter={() => setHoveredLabel(layer.key)}
            onMouseLeave={() => setHoveredLabel(null)}
          >
            {/* Invisible but functional click area */}
            <div className="w-full h-full" />
          </motion.div>
        );
      })}
    </div>
  );
};
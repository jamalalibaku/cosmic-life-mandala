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
}

export const DataLayerLabels: React.FC<DataLayerLabelsProps> = ({
  activeControls = {},
  theme,
  onToggle,
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

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
      {layerData.map((layer, index) => {
        const isActive = activeControls?.[layer.key] || false;
        const isHovered = hoveredLabel === layer.key;
        
        return (
          <motion.div
            key={layer.key}
            className="relative group"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut" 
            }}
            onMouseEnter={() => setHoveredLabel(layer.key)}
            onMouseLeave={() => setHoveredLabel(null)}
          >
            <motion.button
              onClick={() => onToggle(layer.key)}
              className={`
                relative overflow-hidden
                w-12 h-12 rounded-lg
                flex items-center justify-center
                text-lg font-bold
                backdrop-blur-sm
                transition-all duration-300
                border
                ${isActive 
                  ? 'border-white/40 shadow-xl' 
                  : 'border-white/20 hover:border-white/30'
                }
              `}
              style={{
                background: isActive 
                  ? `linear-gradient(135deg, ${layer.color.split(' ')[1]}, ${layer.color.split(' ')[3]})`
                  : `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
                filter: isActive 
                  ? `drop-shadow(0 0 15px ${layer.color.includes('orange') ? '#f97316' : 
                      layer.color.includes('blue') ? '#3b82f6' : 
                      layer.color.includes('green') ? '#10b981' : 
                      layer.color.includes('purple') ? '#8b5cf6' : '#ec4899'}60)` 
                  : 'none'
              }}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 drop-shadow-sm">
                {layer.icon}
              </span>
              
              {/* Enhanced glow effect */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-lg opacity-40"
                  style={{
                    background: `linear-gradient(135deg, ${layer.color.split(' ')[1]}, ${layer.color.split(' ')[3]})`,
                    filter: `blur(6px) brightness(1.5)`
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.button>

            {/* Label tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute top-14 left-1/2 transform -translate-x-1/2
                             bg-black/80 text-white px-3 py-1 rounded-lg text-sm
                             backdrop-blur-sm border border-white/20 whitespace-nowrap"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {layer.label}
                  {/* Arrow pointer */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2">
                    <div className="border-4 border-transparent border-b-black/80"></div>
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
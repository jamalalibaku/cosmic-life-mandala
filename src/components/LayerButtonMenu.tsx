/**
 * [Layer Button Menu - Vertical Right Side]
 * Beautiful layer access portals with quantum shimmer effects
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Calendar, 
  Footprints, 
  Heart, 
  Moon, 
  Wallet,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';


interface LayerButtonMenuProps {
  onLayerClick: (layerType: string, position: { x: number; y: number }, layerData: any) => void;
  activeLayer?: string;
  theme: string;
  className?: string;
}

const layerData = [
  { 
    key: 'weather', 
    label: 'Weather', 
    icon: Sun,
    color: 'hsl(45, 70%, 70%)',
    glowColor: '#f59e0b',
    description: 'Atmospheric dance'
  },
  { 
    key: 'plans', 
    label: 'Plans', 
    icon: Calendar,
    color: 'hsl(200, 60%, 70%)',
    glowColor: '#3b82f6',
    description: 'Future pathways'
  },
  { 
    key: 'mobility', 
    label: 'Mobility', 
    icon: Footprints,
    color: 'hsl(120, 50%, 70%)',
    glowColor: '#10b981',
    description: 'Body wisdom'
  },
  { 
    key: 'mood', 
    label: 'Mood', 
    icon: Heart,
    color: 'hsl(320, 60%, 70%)',
    glowColor: '#ec4899',
    description: 'Emotional tides'
  },
  { 
    key: 'sleep', 
    label: 'Sleep', 
    icon: Moon,
    color: 'hsl(260, 50%, 70%)',
    glowColor: '#8b5cf6',
    description: 'Rest rhythms'
  },
  { 
    key: 'wallet', 
    label: 'Wallet', 
    icon: Wallet,
    color: 'hsl(45, 80%, 75%)',
    glowColor: '#f59e0b',
    description: 'Life energy'
  }
];

export const LayerButtonMenu: React.FC<LayerButtonMenuProps> = ({
  onLayerClick,
  activeLayer,
  theme,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  

  const handleLayerClick = (layer: typeof layerData[0], event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left,
      y: rect.top + rect.height / 2
    };
    
    // Mock layer data - in real app this would come from data sources
    const mockLayerData = Array.from({ length: 12 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      value: Math.random() * 0.8 + 0.2,
      intensity: Math.random()
    }));
    
    onLayerClick(layer.key, position, mockLayerData);
  };

  return (
    <div 
      className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-30 ${className}`}
      style={{ transform: `translateY(-50%)` }}
    >
      <motion.div
        className="flex flex-col items-end"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-4 w-12 h-12 rounded-full bg-black/80 backdrop-blur-md 
                     border border-white/20 flex items-center justify-center
                     text-white/80 hover:text-white transition-all duration-300
                     shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 1 }}
          >
            {isExpanded ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </motion.div>
          
          {/* Cosmic iris aperture effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${
                isExpanded ? '#8b5cf660' : '#3b82f660'
              }, transparent)`
            }}
            animate={{ rotate: isExpanded ? 360 : 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </motion.button>

        {/* Layer Buttons */}
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 50 }}
              transition={{ duration: 1, staggerChildren: 0.1 }}
            >
              {layerData.map((layer, index) => {
                const IconComponent = layer.icon;
                const isActive = activeLayer === layer.key;
                const isHovered = hoveredLayer === layer.key;
                
                return (
                  <motion.div
                    key={layer.key}
                    className="relative flex items-center gap-3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredLayer(layer.key)}
                    onMouseLeave={() => setHoveredLayer(null)}
                  >
                    {/* Label - appears on hover */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          className="flex flex-col items-end mr-2"
                          initial={{ opacity: 0, x: 20, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 20, scale: 0.9 }}
                          transition={{ duration: 1 }}
                        >
                          <div className="bg-black/90 backdrop-blur-md px-3 py-2 rounded-lg
                                        border border-white/20 text-white text-sm whitespace-nowrap
                                        shadow-xl">
                            <div className="font-medium">{layer.label}</div>
                            <div 
                              className="text-xs opacity-80 italic"
                              style={{ color: layer.color }}
                            >
                              {layer.description}
                            </div>
                          </div>
                          {/* Arrow pointing to button */}
                          <div 
                            className="w-3 h-3 bg-black/90 transform rotate-45 
                                     border-r border-b border-white/20 -mt-1.5 mr-4"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Main Button */}
                    <motion.button
                      onClick={(e) => handleLayerClick(layer, e)}
                      className={`
                        relative w-14 h-14 rounded-full 
                        flex items-center justify-center
                        backdrop-blur-md transition-all duration-300
                        border-2 overflow-hidden group
                        ${isActive 
                          ? 'border-white/60 shadow-2xl' 
                          : 'border-white/20 hover:border-white/40'
                        }
                      `}
                      style={{
                        background: isActive 
                          ? `radial-gradient(circle at center, ${layer.color}88, ${layer.color}44)`
                          : `radial-gradient(circle at center, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
                        boxShadow: isActive 
                          ? `0 0 30px ${layer.glowColor}60, inset 0 0 20px ${layer.glowColor}30`
                          : 'none'
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 1 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Quantum shimmer effect on hover */}
                      {isHovered && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `conic-gradient(from 0deg, transparent, ${layer.glowColor}40, transparent, ${layer.glowColor}60, transparent)`
                          }}
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                          }}
                        />
                      )}
                      
                      {/* Icon */}
                      <IconComponent 
                        size={20} 
                        className="relative z-10"
                        style={{ 
                          color: isActive ? 'white' : layer.color,
                          filter: isActive ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' : 'none'
                        }}
                      />
                      
                      {/* Holographic portal effect for active state */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full border border-white/30"
                          style={{
                            background: `radial-gradient(circle at 30% 30%, ${layer.glowColor}20, transparent 70%)`
                          }}
                          animate={{
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                      
                      {/* Harmonic vibration effect */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `radial-gradient(circle, transparent 60%, ${layer.glowColor}30 100%)`
                          }}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0, 0.6, 0],
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.2
                          }}
                        />
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
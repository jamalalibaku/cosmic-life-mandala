/**
 * (c) 2025 Cosmic Life Mandala – Enhanced Tooltip System
 * Clean, pixel-perfect tooltips with semantic content
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipData {
  title: string;
  content: string;
  value?: string;
  metadata?: string;
  type: 'weather' | 'plans' | 'mobility' | 'mood' | 'sleep' | 'essence';
}

interface EnhancedTooltipSystemProps {
  tooltip: TooltipData | null;
  position: { x: number; y: number } | null;
  isVisible: boolean;
  onClose?: () => void;
}

export const EnhancedTooltipSystem: React.FC<EnhancedTooltipSystemProps> = ({
  tooltip,
  position,
  isVisible,
  onClose
}) => {
  if (!tooltip || !position) return null;
  
  // Calculate smart positioning to avoid screen edges
  const adjustedPosition = React.useMemo(() => {
    if (!position) return { x: 0, y: 0 };
    
    const padding = 20;
    const tooltipWidth = 200;
    const tooltipHeight = 80;
    
    let { x, y } = position;
    
    // Adjust horizontal position
    if (x + tooltipWidth > window.innerWidth - padding) {
      x = window.innerWidth - tooltipWidth - padding;
    }
    if (x < padding) {
      x = padding;
    }
    
    // Adjust vertical position
    if (y + tooltipHeight > window.innerHeight - padding) {
      y = y - tooltipHeight - 20;
    }
    
    return { x, y };
  }, [position]);
  
  const getTypeColor = (type: TooltipData['type']) => {
    const colors = {
      weather: 'hsl(200, 70%, 65%)',
      plans: 'hsl(280, 60%, 70%)', 
      mobility: 'hsl(120, 65%, 60%)',
      mood: 'hsl(340, 70%, 65%)',
      sleep: 'hsl(260, 55%, 70%)',
      essence: 'hsl(45, 80%, 70%)'
    };
    return colors[type];
  };
  
  const getPoetryForType = (type: TooltipData['type'], content: string) => {
    const poetry = {
      weather: `The sky ${content.toLowerCase()}`,
      plans: `Intent shaped: ${content}`,
      mobility: `Journey through ${content}`,
      mood: `Heart whispers: ${content}`,
      sleep: `Dreams of ${content}`,
      essence: `Soul essence: ${content}`
    };
    return poetry[type] || content;
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ 
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="fixed z-50 pointer-events-auto"
          style={{
            left: adjustedPosition.x,
            top: adjustedPosition.y
          }}
        >
          <div className="relative">
            {/* Tooltip container with clean design */}
            <div 
              className="px-4 py-3 rounded-lg backdrop-blur-md border shadow-lg max-w-xs"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                borderColor: getTypeColor(tooltip.type) + '40',
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px ${getTypeColor(tooltip.type)}20`
              }}
            >
              {/* Title with type-specific color */}
              <div 
                className="text-sm font-medium mb-1"
                style={{ color: getTypeColor(tooltip.type) }}
              >
                {tooltip.title}
              </div>
              
              {/* Poetic content */}
              <div className="text-white text-xs leading-relaxed mb-2">
                {getPoetryForType(tooltip.type, tooltip.content)}
              </div>
              
              {/* Value display */}
              {tooltip.value && (
                <div className="text-gray-300 text-xs font-mono">
                  {tooltip.value}
                </div>
              )}
              
              {/* Metadata */}
              {tooltip.metadata && (
                <div className="text-gray-400 text-xs mt-1 opacity-70">
                  {tooltip.metadata}
                </div>
              )}
              
              {/* Close button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path 
                      d="M9 3L3 9M3 3L9 9" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                    />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Subtle indicator pointing to source */}
            <div 
              className="absolute w-2 h-2 transform rotate-45 -translate-x-1/2"
              style={{
                backgroundColor: getTypeColor(tooltip.type) + '60',
                left: '50%',
                top: '-4px'
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
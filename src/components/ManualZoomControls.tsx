/**
 * [Lap 12 – Manual Zoom Controls]
 * Manual Time Scale Controls - Replace scroll zoom with deliberate navigation
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, CalendarDays, CalendarCheck } from 'lucide-react';
import { TimeScale } from './fractal-time-zoom-manager';

interface ManualZoomControlsProps {
  currentScale: TimeScale;
  onScaleChange: (scale: TimeScale) => void;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const scaleConfig = {
  day: { 
    label: 'Day', 
    icon: Clock, 
    description: 'Hourly rhythms',
    shortcut: 'D'
  },
  week: { 
    label: 'Week', 
    icon: Calendar, 
    description: '7-day patterns',
    shortcut: 'W'
  },
  month: { 
    label: 'Month', 
    icon: CalendarDays, 
    description: 'Monthly cycles',
    shortcut: 'M'
  },
  year: { 
    label: 'Year', 
    icon: CalendarCheck, 
    description: 'Seasonal wisdom',
    shortcut: 'Y'
  }
};

const scaleOrder: TimeScale[] = ['day', 'week', 'month', 'year'];

export const ManualZoomControls: React.FC<ManualZoomControlsProps> = ({
  currentScale,
  onScaleChange,
  className = '',
  position = 'bottom'
}) => {
  const currentIndex = scaleOrder.indexOf(currentScale);
  
  const canZoomIn = currentIndex > 0;
  const canZoomOut = currentIndex < scaleOrder.length - 1;
  
  const zoomIn = () => {
    if (canZoomIn) {
      onScaleChange(scaleOrder[currentIndex - 1]);
    }
  };
  
  const zoomOut = () => {
    if (canZoomOut) {
      onScaleChange(scaleOrder[currentIndex + 1]);
    }
  };

  const positionClasses = {
    top: 'top-4 left-1/2 -translate-x-1/2',
    bottom: 'bottom-6 left-1/2 -translate-x-1/2',
    left: 'left-4 top-1/2 -translate-y-1/2 flex-col',
    right: 'right-4 top-1/2 -translate-y-1/2 flex-col'
  };

  return (
    <motion.div
      className={`fixed z-30 ${positionClasses[position]} ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Controls */}
      <div className={`flex ${position === 'left' || position === 'right' ? 'flex-col' : 'flex-row'} items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-2`}>
        
        {/* Zoom In Button */}
        <motion.button
          onClick={zoomIn}
          disabled={!canZoomIn}
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
            canZoomIn 
              ? 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white' 
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
          whileHover={canZoomIn ? { scale: 1.05 } : {}}
          whileTap={canZoomIn ? { scale: 0.95 } : {}}
          title={canZoomIn ? `Zoom to ${scaleConfig[scaleOrder[currentIndex - 1]].label}` : 'Maximum zoom level'}
        >
          <ChevronLeft size={18} className={position === 'left' || position === 'right' ? 'rotate-90' : ''} />
        </motion.button>

        {/* Current Scale Display */}
        <div className="flex flex-col items-center gap-1 px-3">
          <div className="flex items-center gap-2">
            {React.createElement(scaleConfig[currentScale].icon, { 
              size: 16, 
              className: 'text-white/80' 
            })}
            <span className="text-white/90 font-medium text-sm">
              {scaleConfig[currentScale].label}
            </span>
          </div>
          <span className="text-white/60 text-xs">
            {scaleConfig[currentScale].description}
          </span>
        </div>

        {/* Zoom Out Button */}
        <motion.button
          onClick={zoomOut}
          disabled={!canZoomOut}
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
            canZoomOut 
              ? 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white' 
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
          whileHover={canZoomOut ? { scale: 1.05 } : {}}
          whileTap={canZoomOut ? { scale: 0.95 } : {}}
          title={canZoomOut ? `Zoom to ${scaleConfig[scaleOrder[currentIndex + 1]].label}` : 'Maximum zoom level'}
        >
          <ChevronRight size={18} className={position === 'left' || position === 'right' ? 'rotate-90' : ''} />
        </motion.button>
      </div>

      {/* Quick Scale Selector */}
      <div className={`flex ${position === 'left' || position === 'right' ? 'flex-col' : 'flex-row'} gap-1 mt-2`}>
        {scaleOrder.map((scale) => {
          const config = scaleConfig[scale];
          const isActive = scale === currentScale;
          
          return (
            <motion.button
              key={scale}
              onClick={() => onScaleChange(scale)}
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
                isActive 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={`${config.label} View (${config.shortcut})`}
            >
              {React.createElement(config.icon, { size: 12 })}
            </motion.button>
          );
        })}
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-white/40 text-xs text-center mt-2 max-w-32">
        Press D/W/M/Y for quick switching
      </div>
    </motion.div>
  );
};
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
  onTimeNavigate?: (direction: 'past' | 'future') => void;
  currentDate?: Date;
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
  onTimeNavigate,
  currentDate = new Date(),
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

  // Time navigation functions
  const navigatePast = () => {
    onTimeNavigate?.('past');
  };

  const navigateFuture = () => {
    onTimeNavigate?.('future');
  };

  // Format current date based on scale
  const formatCurrentPeriod = () => {
    const options: Intl.DateTimeFormatOptions = {};
    switch (currentScale) {
      case 'day':
        return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      case 'week':
        return `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'month':
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'year':
        return currentDate.getFullYear().toString();
      default:
        return currentDate.toLocaleDateString();
    }
  };

  const positionClasses = {
    top: 'top-4 right-4',
    bottom: 'bottom-6 left-1/2 -translate-x-1/2',
    left: 'left-4 top-1/2 -translate-y-1/2 flex-col',
    right: 'right-4 top-1/2 -translate-y-1/2 flex-col'
  };

  return (
    <motion.div
      className={`fixed z-30 ${positionClasses[position]} ${className}`}
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Enhanced Navigation Container */}
      <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Time Navigation Row */}
        <div className="flex items-center gap-0 p-2 border-b border-white/10">
          <motion.button
            onClick={navigatePast}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all duration-200 group"
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            title={`Previous ${currentScale}`}
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </motion.button>

          <div className="flex-1 text-center px-4 min-w-[140px]">
            <motion.div 
              key={formatCurrentPeriod()}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/95 font-medium text-sm tracking-wide"
            >
              {formatCurrentPeriod()}
            </motion.div>
          </div>

          <motion.button
            onClick={navigateFuture}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all duration-200 group"
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            title={`Next ${currentScale}`}
          >
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>

        {/* Scale Selection Grid */}
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              {React.createElement(scaleConfig[currentScale].icon, { 
                size: 18, 
                className: 'text-white/90' 
              })}
              <span className="text-white/95 font-semibold text-sm">
                {scaleConfig[currentScale].label}
              </span>
            </div>
            <div className="text-white/60 text-xs italic">
              {scaleConfig[currentScale].description}
            </div>
          </div>
          
          {/* Unified Scale Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {scaleOrder.map((scale) => {
              const config = scaleConfig[scale];
              const isActive = scale === currentScale;
              
              return (
                <motion.button
                  key={scale}
                  onClick={() => onScaleChange(scale)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-lg border border-white/30' 
                      : 'bg-white/5 hover:bg-white/15 text-white/70 hover:text-white/90 border border-white/10 hover:border-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={`Switch to ${config.label} view`}
                >
                  {React.createElement(config.icon, { 
                    size: 14,
                    className: isActive ? 'text-white' : 'text-white/60'
                  })}
                  <span className="text-xs font-medium">{config.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        {/* Subtle keyboard hint */}
        <div className="text-white/30 text-xs text-center py-2 border-t border-white/5">
          <span className="font-mono">D • W • M • Y</span>
        </div>
      </div>
    </motion.div>
  );
};
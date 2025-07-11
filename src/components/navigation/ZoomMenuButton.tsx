/**
 * Consolidated Zoom Controls Menu - Elegant pop-up navigation
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Calendar, Clock, CalendarDays, CalendarCheck } from 'lucide-react';
import { TimeScale } from '../fractal-time-zoom-manager';

interface ZoomMenuButtonProps {
  currentScale: TimeScale;
  onScaleChange: (scale: TimeScale) => void;
  onTimeNavigate?: (direction: 'past' | 'future') => void;
  currentDate?: Date;
  className?: string;
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

export const ZoomMenuButton: React.FC<ZoomMenuButtonProps> = ({
  currentScale,
  onScaleChange,
  onTimeNavigate,
  currentDate = new Date(),
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Format current date based on scale
  const formatCurrentPeriod = () => {
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

  const handleScaleChange = (scale: TimeScale) => {
    onScaleChange(scale);
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay to allow moving to menu
    setHoverTimeout(timeout);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Zoom Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-12 h-12 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/20 text-white/90 hover:text-white hover:bg-black/80 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Zoom Controls"
      >
        <Search size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        
        {/* Subtle pulse when active */}
        {isOpen && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-white/10"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Pop-up Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 z-50"
          >
            <div 
              className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden min-w-[280px]"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              
              {/* Time Navigation Row */}
              <div className="flex items-center gap-0 p-3 border-b border-white/10">
                <motion.button
                  onClick={() => onTimeNavigate?.('past')}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all duration-200 group"
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={`Previous ${currentScale}`}
                >
                  <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                </motion.button>

                <div className="flex-1 text-center px-4">
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
                  onClick={() => onTimeNavigate?.('future')}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all duration-200 group"
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  title={`Next ${currentScale}`}
                >
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </div>

              {/* Scale Selection */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
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
                
                {/* Scale Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {scaleOrder.map((scale) => {
                    const config = scaleConfig[scale];
                    const isActive = scale === currentScale;
                    
                    return (
                      <motion.button
                        key={scale}
                        onClick={() => handleScaleChange(scale)}
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
              
              {/* Keyboard hints */}
              <div className="text-white/30 text-xs text-center py-2 border-t border-white/5">
                <span className="font-mono">D • W • M • Y</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
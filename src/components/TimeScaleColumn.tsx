/**
 * Time Scale Column - Elegant vertical time controls
 * Positioned on the left side for better visual balance
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CalendarDays, CalendarCheck } from 'lucide-react';
import { TimeScale } from './fractal-time-zoom-manager';

interface TimeScaleColumnProps {
  currentScale: TimeScale;
  onScaleChange: (scale: TimeScale) => void;
  className?: string;
}

const timeScaleOptions = [
  { scale: 'day' as TimeScale, label: 'Day', icon: Clock, shortcut: 'D' },
  { scale: 'week' as TimeScale, label: 'Week', icon: Calendar, shortcut: 'W' },
  { scale: 'month' as TimeScale, label: 'Month', icon: CalendarDays, shortcut: 'M' },
  { scale: 'year' as TimeScale, label: 'Year', icon: CalendarCheck, shortcut: 'Y' }
];

export const TimeScaleColumn: React.FC<TimeScaleColumnProps> = ({
  currentScale,
  onScaleChange,
  className = ""
}) => {
  return (
    <div className={`fixed left-8 top-1/2 transform -translate-y-1/2 z-40 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-3"
      >
        {timeScaleOptions.map((option, index) => {
          const isActive = currentScale === option.scale;
          const Icon = option.icon;
          
          return (
            <motion.button
              key={option.scale}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => onScaleChange(option.scale)}
              className={`
                relative group flex flex-col items-center p-3 rounded-lg
                transition-all duration-300 backdrop-blur-sm
                ${isActive 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'bg-background/40 text-muted-foreground border border-border/20 hover:bg-primary/10 hover:text-primary'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Icon */}
              <motion.div
                animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                className="mb-1"
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              
              {/* Label */}
              <span className="text-xs font-medium">{option.label}</span>
              
              {/* Keyboard shortcut */}
              <span className="text-[10px] opacity-60 mt-0.5">({option.shortcut})</span>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeScale"
                  className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-r"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Hover glow */}
              <div 
                className={`
                  absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  ${isActive ? 'bg-primary/10' : 'bg-primary/5'}
                `} 
              />
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};
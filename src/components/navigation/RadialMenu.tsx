/**
 * (c) 2025 Cosmic Life Mandala – Radial Menu System
 * Orbital navigation that matches the mandala's circular language
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  ZoomIn, 
  ZoomOut, 
  Palette, 
  Calendar,
  Map,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/button';

interface RadialMenuProps {
  onSettingsClick?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onThemeChange?: () => void;
  onTimeScale?: () => void;
  onLocationToggle?: () => void;
  className?: string;
}

const menuItems = [
  { icon: Settings, label: 'Settings', action: 'settings', angle: 0 },
  { icon: ZoomIn, label: 'Zoom In', action: 'zoomIn', angle: 45 },
  { icon: ZoomOut, label: 'Zoom Out', action: 'zoomOut', angle: 90 },
  { icon: Palette, label: 'Theme', action: 'theme', angle: 135 },
  { icon: Calendar, label: 'Time Scale', action: 'timeScale', angle: 180 },
  { icon: Map, label: 'Location', action: 'location', angle: 225 }
];

export const RadialMenu: React.FC<RadialMenuProps> = ({
  onSettingsClick,
  onZoomIn,
  onZoomOut,
  onThemeChange,
  onTimeScale,
  onLocationToggle,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleAction = (action: string) => {
    switch (action) {
      case 'settings':
        onSettingsClick?.();
        break;
      case 'zoomIn':
        onZoomIn?.();
        break;
      case 'zoomOut':
        onZoomOut?.();
        break;
      case 'theme':
        onThemeChange?.();
        break;
      case 'timeScale':
        onTimeScale?.();
        break;
      case 'location':
        onLocationToggle?.();
        break;
    }
    setIsOpen(false);
  };

  const getItemPosition = (angle: number, radius: number = 80) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius
    };
  };

  return (
    <div className={`relative ${className}`}>
      {/* Central Menu Toggle */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="sm"
          className="relative w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 shadow-lg"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.div>
        </Button>
      </motion.div>

      {/* Radial Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute inset-0">
            {/* Background Blur Circle */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-background/20 backdrop-blur-sm rounded-full"
              style={{ width: 200, height: 200, left: -94, top: -94 }}
            />

            {/* Menu Items */}
            {menuItems.map((item, index) => {
              const position = getItemPosition(item.angle);
              const IconComponent = item.icon;
              
              return (
                <motion.div
                  key={item.action}
                  initial={{ 
                    scale: 0, 
                    opacity: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    x: position.x,
                    y: position.y
                  }}
                  exit={{ 
                    scale: 0, 
                    opacity: 0,
                    x: 0,
                    y: 0
                  }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 5
                    }}
                    whileTap={{ scale: 0.9 }}
                    onHoverStart={() => setHoveredItem(item.action)}
                    onHoverEnd={() => setHoveredItem(null)}
                  >
                    <Button
                      onClick={() => handleAction(item.action)}
                      size="sm"
                      variant="outline"
                      className="w-10 h-10 rounded-full bg-background/90 hover:bg-background border-primary/30 hover:border-primary/50 shadow-lg backdrop-blur-sm"
                    >
                      <IconComponent className="h-4 w-4" />
                    </Button>
                  </motion.div>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredItem === item.action && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 shadow-lg"
                      >
                        <span className="text-xs text-foreground whitespace-nowrap">
                          {item.label}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Central Connection Lines */}
            <svg className="absolute inset-0 pointer-events-none" style={{ width: 200, height: 200, left: -94, top: -94 }}>
              {menuItems.map((item, index) => {
                const position = getItemPosition(item.angle, 80);
                return (
                  <motion.line
                    key={`line-${index}`}
                    x1={100}
                    y1={100}
                    x2={100 + position.x}
                    y2={100 + position.y}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    opacity="0.2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  />
                );
              })}
            </svg>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
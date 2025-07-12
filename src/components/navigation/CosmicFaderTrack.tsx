/**
 * Cosmic Fader Track - Musical slider interface for time navigation
 * Inspired by analog audio mixer faders with cosmic aesthetics
 */

import React, { useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useDateNavigation } from '@/contexts/DateNavigationContext';

interface FaderStop {
  id: string;
  label: string;
  value: "day" | "week" | "month" | "year";
  position: number; // 0-1 along track
}

const FADER_STOPS: FaderStop[] = [
  { id: 'day', label: 'Day', value: 'day', position: 0 },
  { id: 'week', label: 'Week', value: 'week', position: 0.33 },
  { id: 'month', label: 'Month', value: 'month', position: 0.66 },
  { id: 'year', label: 'Year', value: 'year', position: 1 }
];

export const CosmicFaderTrack: React.FC = () => {
  const { zoomLevel, setZoomLevel } = useDateNavigation();
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredStop, setHoveredStop] = useState<string | null>(null);

  // Find current position based on zoom level
  const getCurrentPosition = () => {
    const currentStop = FADER_STOPS.find(stop => stop.value === zoomLevel);
    return currentStop?.position || 0;
  };

  const y = useMotionValue(getCurrentPosition() * 200); // Track height = 200px
  const [currentPosition, setCurrentPosition] = useState(getCurrentPosition());

  // Snap to nearest stop
  const snapToNearestStop = useCallback((position: number) => {
    let nearestStop = FADER_STOPS[0];
    let minDistance = Math.abs(position - nearestStop.position);

    FADER_STOPS.forEach(stop => {
      const distance = Math.abs(position - stop.position);
      if (distance < minDistance) {
        minDistance = distance;
        nearestStop = stop;
      }
    });

    return nearestStop;
  }, []);

  const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const trackHeight = 200;
    const newPosition = Math.max(0, Math.min(1, info.point.y / trackHeight));
    setCurrentPosition(newPosition);
  }, []);

  const handleDragEnd = useCallback(() => {
    const nearestStop = snapToNearestStop(currentPosition);
    setCurrentPosition(nearestStop.position);
    setZoomLevel(nearestStop.value);
    setIsDragging(false);
    
    // Animate to exact position
    y.set(nearestStop.position * 200);
  }, [currentPosition, snapToNearestStop, setZoomLevel, y]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const keyMap: Record<string, "day" | "week" | "month" | "year"> = {
        'd': 'day',
        'w': 'week',
        'm': 'month',
        'y': 'year'
      };
      
      const newZoom = keyMap[e.key.toLowerCase()];
      if (newZoom) {
        setZoomLevel(newZoom);
        const stop = FADER_STOPS.find(s => s.value === newZoom);
        if (stop) {
          setCurrentPosition(stop.position);
          y.set(stop.position * 200);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setZoomLevel, y]);

  // Update position when zoom level changes externally
  React.useEffect(() => {
    const newPosition = getCurrentPosition();
    setCurrentPosition(newPosition);
    y.set(newPosition * 200);
  }, [zoomLevel, y]);

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30">
      <div className="relative">
        {/* Track background */}
        <div className="relative w-3 h-50 bg-black/20 backdrop-blur-sm rounded-full border border-white/10">
          {/* Quantum glass effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-full" />
          
          {/* Active trail */}
          <motion.div
            className="absolute left-0 top-0 w-full bg-gradient-to-b from-primary/60 to-primary/20 rounded-full"
            style={{
              height: useTransform(y, [0, 200], ['8px', `${currentPosition * 200 + 8}px`])
            }}
          />

          {/* Stop markers */}
          {FADER_STOPS.map((stop) => (
            <motion.div
              key={stop.id}
              className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                stop.value === zoomLevel 
                  ? 'bg-primary shadow-lg shadow-primary/50' 
                  : 'bg-white/30'
              }`}
              style={{ top: `${stop.position * 200}px` }}
              whileHover={{ scale: 1.5 }}
              onHoverStart={() => setHoveredStop(stop.id)}
              onHoverEnd={() => setHoveredStop(null)}
            />
          ))}

          {/* Fader handle (ruchka) */}
          <motion.div
            className={`absolute left-1/2 -translate-x-1/2 w-6 h-4 bg-gradient-to-r from-primary to-secondary rounded-md border border-white/20 cursor-grab shadow-lg transition-all duration-200 ${
              isDragging ? 'cursor-grabbing scale-110 shadow-xl shadow-primary/50' : ''
            }`}
            drag="y"
            dragConstraints={{ top: 0, bottom: 200 }}
            dragElastic={0}
            onDrag={handleDrag}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ 
              y,
              top: -8, // Center the handle
            }}
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: isDragging 
                ? "0 0 20px hsl(var(--primary) / 0.8)" 
                : "0 4px 12px hsl(var(--primary) / 0.3)"
            }}
          >
            {/* Handle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-md animate-pulse opacity-50" />
            
            {/* Handle grip lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-px bg-white/60" />
            </div>
          </motion.div>
        </div>

        {/* Labels */}
        <div className="absolute left-8 top-0 space-y-12">
          {FADER_STOPS.map((stop) => (
            <motion.div
              key={stop.id}
              className={`relative transition-all duration-300 ${
                stop.value === zoomLevel 
                  ? 'text-primary font-medium' 
                  : 'text-white/60'
              }`}
              style={{ top: `${stop.position * 180 - 6}px` }}
              animate={{
                scale: stop.value === zoomLevel ? 1.1 : 1,
                x: stop.value === zoomLevel ? 4 : 0
              }}
            >
              <span className="text-sm tracking-wider">{stop.label}</span>
              
              {/* Pulse effect when active */}
              {stop.value === zoomLevel && (
                <motion.div
                  className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Hover tooltip */}
        {hoveredStop && (
          <motion.div
            className="absolute left-12 top-0 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10"
            style={{ 
              top: `${FADER_STOPS.find(s => s.id === hoveredStop)?.position! * 200 - 12}px` 
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <span className="text-xs text-white/80">
              {FADER_STOPS.find(s => s.id === hoveredStop)?.label} View
            </span>
          </motion.div>
        )}

        {/* Keyboard shortcuts hint */}
        <div className="absolute -bottom-8 left-0 text-xs text-white/40">
          D/W/M/Y
        </div>
      </div>
    </div>
  );
};
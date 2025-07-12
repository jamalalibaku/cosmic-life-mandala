/**
 * NOW Line Collision System - "The Musical Stylus of Time"
 * 
 * Adria's Vision:
 * The NOW line acts as a vibrational stylus, playing the rings of life
 * like a cosmic vinyl record. When it touches data glyphs, it creates
 * ripples of intention and awareness.
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { DataBlob } from '../data-blob-ring';

export interface CollisionGlyph {
  id: string;
  x: number;
  y: number;
  type: 'mood' | 'weather' | 'sleep' | 'mobility' | 'plans';
  intensity: number;
  angle: number; // position angle on the ring
  data?: any; // original data point
}

export interface RippleEvent {
  id: string;
  x: number;
  y: number;
  type: string;
  intensity: number;
  timestamp: number;
  color: string;
}

interface NowLineCollisionSystemProps {
  centerX: number;
  centerY: number;
  nowAngle: number; // current angle of NOW line in degrees
  nowRadius: number; // how far the NOW line extends
  glyphs: CollisionGlyph[]; // all data glyphs that can be "played"
  onCollision: (glyph: CollisionGlyph) => void;
  onRippleCreate: (ripple: RippleEvent) => void;
  detectionRadius?: number; // collision detection radius in pixels
  enabled?: boolean;
}

export const NowLineCollisionSystem: React.FC<NowLineCollisionSystemProps> = ({
  centerX,
  centerY,
  nowAngle,
  nowRadius,
  glyphs,
  onCollision,
  onRippleCreate,
  detectionRadius = 15,
  enabled = true
}) => {
  const lastPlayedRef = useRef<string | null>(null);
  const [activeCollisions, setActiveCollisions] = useState<Set<string>>(new Set());

  // Calculate NOW line endpoint
  const nowEndpoint = React.useMemo(() => {
    const radians = (nowAngle * Math.PI) / 180;
    return {
      x: centerX + Math.cos(radians) * nowRadius,
      y: centerY + Math.sin(radians) * nowRadius
    };
  }, [centerX, centerY, nowAngle, nowRadius]);

  // Distance calculation utility
  const calculateDistance = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }, []);

  // Glyph color mapping
  const getGlyphColor = useCallback((type: string): string => {
    const colorMap: Record<string, string> = {
      mood: 'hsl(280, 70%, 65%)',
      weather: 'hsl(200, 80%, 60%)',
      sleep: 'hsl(220, 60%, 70%)',
      mobility: 'hsl(120, 80%, 60%)',
      plans: 'hsl(45, 80%, 60%)'
    };
    return colorMap[type] || 'hsl(0, 0%, 80%)';
  }, []);

  // Main collision detection logic
  useEffect(() => {
    if (!enabled || !glyphs.length) return;

    const checkCollisions = () => {
      const newCollisions = new Set<string>();

      for (const glyph of glyphs) {
        const distance = calculateDistance(
          nowEndpoint.x,
          nowEndpoint.y,
          glyph.x,
          glyph.y
        );

        if (distance <= detectionRadius) {
          newCollisions.add(glyph.id);

          // Only trigger if this is a new collision
          if (!activeCollisions.has(glyph.id) && lastPlayedRef.current !== glyph.id) {
            lastPlayedRef.current = glyph.id;
            
            // Trigger collision event
            onCollision(glyph);

            // Create ripple effect
            const ripple: RippleEvent = {
              id: `ripple-${glyph.id}-${Date.now()}`,
              x: glyph.x,
              y: glyph.y,
              type: glyph.type,
              intensity: glyph.intensity,
              timestamp: Date.now(),
              color: getGlyphColor(glyph.type)
            };
            
            onRippleCreate(ripple);
          }
        }
      }

      setActiveCollisions(newCollisions);
    };

    // Run collision detection on animation frame
    const animationFrame = requestAnimationFrame(checkCollisions);
    return () => cancelAnimationFrame(animationFrame);
  }, [
    enabled,
    glyphs,
    nowEndpoint.x,
    nowEndpoint.y,
    detectionRadius,
    activeCollisions,
    onCollision,
    onRippleCreate,
    calculateDistance,
    getGlyphColor
  ]);

  // Clear last played when NOW line moves significantly
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeCollisions.size === 0) {
        lastPlayedRef.current = null;
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [nowAngle, activeCollisions.size]);

  // This component is purely logical - no visual rendering
  return null;
};

// Helper function to convert data blobs to collision glyphs
export const convertDataBlobsToGlyphs = (
  dataBlobs: DataBlob[],
  centerX: number,
  centerY: number,
  ringRadius: number,
  type: 'mood' | 'sleep' | 'mobility'
): CollisionGlyph[] => {
  const currentHour = new Date().getHours();
  const segmentAngle = 360 / 24;
  const rotationOffset = -currentHour * segmentAngle - 90;

  return dataBlobs
    .filter(blob => blob.intensity > 0.1) // Only meaningful data points
    .map((blob, index) => {
      const angle = rotationOffset + (blob.hour * segmentAngle);
      const rad = (angle * Math.PI) / 180;
      
      const x = centerX + Math.cos(rad) * ringRadius;
      const y = centerY + Math.sin(rad) * ringRadius;

      return {
        id: `${type}-${blob.hour}-${index}`,
        x,
        y,
        type,
        intensity: blob.intensity,
        angle,
        data: blob
      };
    });
};

// Helper function to create weather glyphs (if needed)
export const convertWeatherToGlyphs = (
  weatherData: any[],
  centerX: number,
  centerY: number,
  ringRadius: number
): CollisionGlyph[] => {
  return weatherData.map((weather, index) => {
    const angle = (index / weatherData.length) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    
    const x = centerX + Math.cos(rad) * ringRadius;
    const y = centerY + Math.sin(rad) * ringRadius;

    return {
      id: `weather-${index}`,
      x,
      y,
      type: 'weather',
      intensity: weather.intensity || 0.5,
      angle,
      data: weather
    };
  });
};
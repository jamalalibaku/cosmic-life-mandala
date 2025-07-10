/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TimeScale } from '../components/fractal-time-zoom-manager';
import { goldenRatio, PHI } from '../utils/golden-ratio';

interface FractalMorphConfig {
  scale: TimeScale;
  targetDate?: Date;
  transitionProgress: number;
  isTransitioning: boolean;
}

interface GeometryPoint {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

interface FractalGeometry {
  segments: GeometryPoint[];
  centerOffset: { x: number; y: number };
  globalRotation: number;
  containerScale: number;
}

export const useFractalMorph = ({ 
  scale, 
  targetDate = new Date(), 
  transitionProgress, 
  isTransitioning 
}: FractalMorphConfig) => {
  
  // Golden ratio timing constants
  const TRANSITION_DURATION = PHI * 1000; // 1.618 seconds
  const MORPH_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

  // Generate base geometry for each scale
  const getBaseGeometry = useCallback((timeScale: TimeScale, centerX = 300, centerY = 300, radius = 200): FractalGeometry => {
    switch (timeScale) {
      case 'day': {
        // Circular clock with 24 segments
        const segments = Array.from({ length: 24 }, (_, i) => {
          const angle = (i / 24) * 2 * Math.PI - Math.PI / 2; // Start at top
          return {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            scale: 1,
            rotation: angle + Math.PI / 2,
            opacity: 1
          };
        });
        return {
          segments,
          centerOffset: { x: 0, y: 0 },
          globalRotation: 0,
          containerScale: 1
        };
      }

      case 'week': {
        // 7 petal-shaped day circles arranged like a flower
        const segments = Array.from({ length: 7 }, (_, i) => {
          const angle = (i / 7) * 2 * Math.PI - Math.PI / 2;
          const petalRadius = radius * goldenRatio.smaller(1);
          return {
            x: centerX + Math.cos(angle) * petalRadius,
            y: centerY + Math.sin(angle) * petalRadius,
            scale: 0.7,
            rotation: angle,
            opacity: 1
          };
        });
        return {
          segments,
          centerOffset: { x: 0, y: 0 },
          globalRotation: 0,
          containerScale: 0.9
        };
      }

      case 'month': {
        // 4-5 flower-shaped weeks in gentle spiral
        const weeksInMonth = 4;
        const segments = Array.from({ length: weeksInMonth }, (_, i) => {
          const spiralAngle = (i / weeksInMonth) * 2 * Math.PI * 0.8; // Gentle spiral
          const spiralRadius = radius * (0.4 + i * 0.15); // Expanding spiral
          return {
            x: centerX + Math.cos(spiralAngle) * spiralRadius,
            y: centerY + Math.sin(spiralAngle) * spiralRadius,
            scale: 0.5 + i * 0.1,
            rotation: spiralAngle,
            opacity: 1
          };
        });
        return {
          segments,
          centerOffset: { x: 0, y: 0 },
          globalRotation: Math.PI / 8,
          containerScale: 0.8
        };
      }

      case 'year': {
        // 12 orbiting month bubbles in seasonal arcs
        const segments = Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
          const seasonalRadius = radius * (0.8 + Math.sin(angle * 2) * 0.1); // Elliptical seasons
          return {
            x: centerX + Math.cos(angle) * seasonalRadius,
            y: centerY + Math.sin(angle) * seasonalRadius,
            scale: 0.4,
            rotation: angle,
            opacity: 1
          };
        });
        return {
          segments,
          centerOffset: { x: 0, y: 0 },
          globalRotation: 0,
          containerScale: 0.7
        };
      }

      default:
        return {
          segments: [],
          centerOffset: { x: 0, y: 0 },
          globalRotation: 0,
          containerScale: 1
        };
    }
  }, []);

  // Current geometry based on scale
  const currentGeometry = useMemo(() => 
    getBaseGeometry(scale), [scale, getBaseGeometry]
  );

  // Morph between geometries during transitions
  const morphedGeometry = useMemo(() => {
    if (!isTransitioning || transitionProgress === 0) {
      return currentGeometry;
    }

    // Apply fractal morphing effects during transition
    const morphFactor = Math.sin(transitionProgress * Math.PI);
    const scaleFactor = 1 + morphFactor * 0.1;
    const rotationOffset = morphFactor * Math.PI / 8;

    return {
      ...currentGeometry,
      segments: currentGeometry.segments.map(segment => ({
        ...segment,
        scale: segment.scale * scaleFactor,
        rotation: segment.rotation + rotationOffset,
        opacity: segment.opacity * (1 - morphFactor * 0.3)
      })),
      globalRotation: currentGeometry.globalRotation + rotationOffset,
      containerScale: currentGeometry.containerScale * scaleFactor
    };
  }, [currentGeometry, isTransitioning, transitionProgress]);

  // Get visual metaphor for current scale
  const getVisualMetaphor = useCallback((timeScale: TimeScale) => {
    const metaphors = {
      day: { name: 'Vinyl/Sun', pattern: 'circular-clock' },
      week: { name: 'Lotus/Wheel', pattern: 'flower-petals' },
      month: { name: 'Constellation/Hive', pattern: 'spiral-flowers' },
      year: { name: 'Galaxy/Solar System', pattern: 'orbital-constellation' }
    };
    return metaphors[timeScale];
  }, []);

  // Get time anchor point (NOW position)
  const getTimeAnchor = useCallback((timeScale: TimeScale, date: Date = new Date()) => {
    const now = date;
    
    switch (timeScale) {
      case 'day': {
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        const progress = totalMinutes / (24 * 60);
        return {
          segmentIndex: Math.floor(progress * 24),
          segmentProgress: (progress * 24) % 1,
          angle: progress * 2 * Math.PI - Math.PI / 2
        };
      }
      
      case 'week': {
        const dayOfWeek = now.getDay();
        return {
          segmentIndex: dayOfWeek,
          segmentProgress: 0,
          angle: (dayOfWeek / 7) * 2 * Math.PI - Math.PI / 2
        };
      }
      
      case 'month': {
        const dayOfMonth = now.getDate() - 1;
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const weekIndex = Math.floor(dayOfMonth / 7);
        return {
          segmentIndex: Math.min(weekIndex, 3),
          segmentProgress: (dayOfMonth % 7) / 7,
          angle: (dayOfMonth / daysInMonth) * 2 * Math.PI - Math.PI / 2
        };
      }
      
      case 'year': {
        const monthIndex = now.getMonth();
        return {
          segmentIndex: monthIndex,
          segmentProgress: 0,
          angle: (monthIndex / 12) * 2 * Math.PI - Math.PI / 2
        };
      }
      
      default:
        return { segmentIndex: 0, segmentProgress: 0, angle: -Math.PI / 2 };
    }
  }, []);

  // Smooth transition utilities
  const getTransitionStyle = useCallback((duration = TRANSITION_DURATION) => ({
    transition: `all ${duration}ms ${MORPH_EASING}`,
    transformOrigin: 'center center'
  }), []);

  return {
    geometry: morphedGeometry,
    visualMetaphor: getVisualMetaphor(scale),
    timeAnchor: getTimeAnchor(scale, targetDate),
    transitionStyle: getTransitionStyle(),
    constants: {
      TRANSITION_DURATION,
      MORPH_EASING,
      PHI
    }
  };
};
/**
 * [Phase: ZIP9-Delta | Lap 5: Wheel of Time & Skin Consolidation]
 * Wheel of Time Rotation Engine - Timeline rotates beneath fixed NOW
 * 
 * Purpose: Implement time flow where NOW stays fixed and slices rotate
 * Features: Past/present/future visual states, rotation calculation
 * Dependencies: TimeAxisContext, LayerDataAnimator
 */

import { TimeZoomLevel } from '@/contexts/TimeAxisContext';

/**
 * Calculate rotation angle for the wheel of time
 * NOW stays at 0° (North), timeline rotates counterclockwise beneath it
 */
export const calculateWheelRotation = (
  currentTime: Date,
  zoomLevel: TimeZoomLevel,
  baseDate: Date
): number => {
  const now = currentTime.getTime();
  const base = baseDate.getTime();
  
  switch (zoomLevel) {
    case 'hour':
      // Rotate 360° every hour (6°/minute)
      const minutesElapsed = (now - base) / (1000 * 60);
      return -(minutesElapsed * 6) % 360;
      
    case 'day':
      // Rotate 360° every 24 hours (15°/hour)
      const hoursElapsed = (now - base) / (1000 * 60 * 60);
      return -(hoursElapsed * 15) % 360;
      
    case 'week':
      // Rotate 360° every 7 days (~51.4°/day)
      const daysElapsed = (now - base) / (1000 * 60 * 60 * 24);
      return -(daysElapsed * 51.43) % 360;
      
    case 'month':
      // Rotate 360° every 30 days (12°/day)
      const monthDaysElapsed = (now - base) / (1000 * 60 * 60 * 24);
      return -(monthDaysElapsed * 12) % 360;
      
    case 'year':
      // Rotate 360° every 365 days (~0.99°/day)
      const yearDaysElapsed = (now - base) / (1000 * 60 * 60 * 24);
      return -(yearDaysElapsed * 0.986) % 360;
      
    default:
      return 0;
  }
};

/**
 * Determine slice temporal state relative to NOW
 */
export const getSliceTemporalState = (
  sliceAngle: number,
  nowAngle: number,
  rotationOffset: number
): 'past' | 'present' | 'future' => {
  // Adjust slice angle by rotation offset
  const adjustedAngle = (sliceAngle + rotationOffset) % 360;
  const normalizedAngle = adjustedAngle < 0 ? adjustedAngle + 360 : adjustedAngle;
  
  // NOW is at 0° (top), slice is present if within ±10° of NOW
  const angleDiff = Math.abs(normalizedAngle - 0);
  const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
  
  if (normalizedDiff <= 10) {
    return 'present';
  } else if (normalizedAngle > 0 && normalizedAngle <= 180) {
    return 'future';
  } else {
    return 'past';
  }
};

/**
 * Get visual properties for slice based on temporal state
 */
export const getTemporalVisualProps = (state: 'past' | 'present' | 'future') => {
  switch (state) {
    case 'present':
      return {
        opacity: 1.0,
        scale: 1.0,
        blur: 0,
        saturation: 1.2,
        strokeDashArray: 'none',
        glow: true
      };
      
    case 'past':
      return {
        opacity: 0.6,
        scale: 0.95,
        blur: 0.5,
        saturation: 0.8,
        strokeDashArray: 'none',
        glow: false
      };
      
    case 'future':
      return {
        opacity: 0.4,
        scale: 0.9,
        blur: 1,
        saturation: 0.6,
        strokeDashArray: '2 2',
        glow: false
      };
  }
};

/**
 * Apply wheel of time rotation to a layer group
 */
export const applyWheelRotation = (
  rotationAngle: number
): string => {
  return `rotate(${rotationAngle}deg)`;
};
/**
 * Mouse Position & Proximity Tracking Hook
 * Tracks mouse position and calculates proximity to elements for reactive motion
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface ProximityData {
  distance: number;
  proximity: number; // 0-1, where 1 is closest
  angle: number; // radians from element center
  isNear: boolean; // within interaction threshold
}

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);
      
      // Reset moving state after mouse stops
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setIsMoving(false), 150);
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { mousePosition, isMoving };
};

export const useMouseProximity = (
  elementCenter: { x: number; y: number },
  maxDistance: number = 200
) => {
  const { mousePosition, isMoving } = useMousePosition();
  
  const calculateProximity = useCallback((): ProximityData => {
    const deltaX = mousePosition.x - elementCenter.x;
    const deltaY = mousePosition.y - elementCenter.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const proximity = Math.max(0, 1 - distance / maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    const isNear = distance < maxDistance * 0.6;

    return {
      distance,
      proximity,
      angle,
      isNear
    };
  }, [mousePosition, elementCenter, maxDistance]);

  return {
    ...calculateProximity(),
    isMoving,
    mousePosition
  };
};

// Utility for calculating reactive motion based on proximity
export const useReactiveMotion = (
  elementCenter: { x: number; y: number },
  intensity: number = 1,
  maxDistance: number = 200
) => {
  const { proximity, angle, isNear, isMoving } = useMouseProximity(elementCenter, maxDistance);
  
  const motionValues = {
    // Subtle movement based on proximity
    x: Math.cos(angle) * proximity * intensity * 8,
    y: Math.sin(angle) * proximity * intensity * 8,
    
    // Scale and rotation effects
    scale: 1 + proximity * intensity * 0.05,
    rotate: proximity * intensity * (Math.cos(angle * 2) * 2),
    
    // Opacity and glow effects
    opacity: 1 + proximity * 0.1,
    glow: proximity * intensity,
    
    // State flags
    isActive: isNear && isMoving,
    intensity: proximity * intensity
  };

  return motionValues;
};
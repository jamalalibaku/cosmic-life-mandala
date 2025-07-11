/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * ZIP11-GOLF: Zoom Scale Compensation Hook
 */

import { useEffect, useState } from 'react';
import { zoomCompensation } from '../utils/theme-configs';

export type ViewScale = 'day' | 'week' | 'month' | 'year';

interface UseZoomCompensationProps {
  currentView: ViewScale;
  transitionDuration?: number;
}

export const useZoomCompensation = ({ 
  currentView, 
  transitionDuration = 800 
}: UseZoomCompensationProps) => {
  const [compensatedZoom, setCompensatedZoom] = useState(100);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    
    // Apply zoom compensation after a brief delay to let the view settle
    const timer = setTimeout(() => {
      const targetZoom = zoomCompensation[currentView];
      setCompensatedZoom(targetZoom);
      
      // Complete transition
      setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentView, transitionDuration]);

  // Calculate CSS transform based on zoom level
  const getZoomTransform = () => {
    const scale = compensatedZoom / 100;
    return {
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
      transition: isTransitioning ? `transform ${transitionDuration}ms ease-out` : 'none'
    };
  };

  // Get zoom-adjusted radius for elements
  const getAdjustedRadius = (baseRadius: number) => {
    return baseRadius * (compensatedZoom / 100);
  };

  return {
    compensatedZoom,
    isTransitioning,
    getZoomTransform,
    getAdjustedRadius,
    zoomScale: compensatedZoom / 100
  };
};
/**
 * Hover-Based Insights - Context-aware insight notifications
 * Appears when hovering near data points or on periodic triggers
 */

import React, { useState, useEffect } from 'react';
import { AwarenessNotification } from './AwarenessNotification';

interface HoverBasedInsightsProps {
  children: React.ReactNode;
  currentTimeSlices?: any[];
  recentInteractions?: Array<{ layerType: string; timestamp: string; dataValue: any; }>;
  awarenessState: {
    awarenessMessage: string | null;
  };
  onDismiss: () => void;
  onExplore?: () => void;
}

export const HoverBasedInsights: React.FC<HoverBasedInsightsProps> = ({
  children,
  currentTimeSlices,
  recentInteractions,
  awarenessState,
  onDismiss,
  onExplore
}) => {
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [showInsight, setShowInsight] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    const target = event.target as Element;
    
    // Performance guard - check if awarenessState exists
    if (!awarenessState || !awarenessState.awarenessMessage) {
      return;
    }
    
    // Check if hovering near data-related elements
    const isNearDataPoint = target.closest('[data-layer-type]') || 
                           target.closest('.data-blob-ring') ||
                           target.closest('.enhanced-weather-layer') ||
                           target.closest('.plans-layer-ring');
    
    if (isNearDataPoint && awarenessState.awarenessMessage) {
      // Clear existing timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      
      // Set new timeout for showing insight
      const timeout = setTimeout(() => {
        setHoverPosition({ x: clientX, y: clientY });
        setShowInsight(true);
      }, 800); // Delay before showing
      
      setHoverTimeout(timeout);
    } else {
      // Clear timeout and hide insight when moving away
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setShowInsight(false);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    
    // Delayed hide to allow moving to notification
    setTimeout(() => {
      setShowInsight(false);
    }, 200);
  };

  const handleDismiss = () => {
    setShowInsight(false);
    onDismiss();
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  return (
    <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
      
      {/* Hover-based insight notification */}
      {showInsight && hoverPosition && awarenessState.awarenessMessage && (
        <AwarenessNotification
          message={awarenessState.awarenessMessage}
          isVisible={true}
          onDismiss={handleDismiss}
          onExplore={onExplore}
          isHoverBased={true}
          x={hoverPosition.x}
          y={hoverPosition.y}
        />
      )}
    </div>
  );
};
/**
 * Layer Culling System - Intelligent layer visibility based on zoom and performance
 * Only renders relevant layers to maintain high FPS
 */

import React from 'react';
import { useAdaptivePerformance } from './AdaptivePerformanceManager';

interface LayerCullingSystemProps {
  children: React.ReactNode;
  layerType: string;
  zoomLevel: 'day' | 'week' | 'month' | 'year' | 'side';
  priority: 'critical' | 'high' | 'medium' | 'low';
  fallback?: React.ReactNode;
}

export const LayerCullingSystem: React.FC<LayerCullingSystemProps> = ({
  children,
  layerType,
  zoomLevel,
  priority,
  fallback = null
}) => {
  const { shouldLimitLayer, performanceLevel, isEmergencyMode } = useAdaptivePerformance();

  // Layer culling rules based on zoom level
  const shouldCullForZoom = (): boolean => {
    switch (zoomLevel) {
      case 'year':
        // In year view, only show essential layers
        return !['core', 'plans', 'mood', 'time'].includes(layerType);
      
      case 'month':
        // In month view, hide detailed layers
        return !['core', 'plans', 'mood', 'weather', 'time'].includes(layerType);
      
      case 'week':
        // In week view, hide only the most detailed layers
        return ['emotional-morphing', 'particle-effects', 'wind-effects'].includes(layerType);
      
      case 'day':
        // In day view, show all layers unless performance demands otherwise
        return false;
      
      case 'side':
        // Side view has different culling rules
        return ['weather-sunburst', 'plans-layer', 'friend-orbit'].includes(layerType);
      
      default:
        return false;
    }
  };

  // Performance-based culling
  const shouldCullForPerformance = (): boolean => {
    if (isEmergencyMode) {
      return priority === 'low' || priority === 'medium';
    }
    
    if (performanceLevel.level === 'low') {
      return priority === 'low';
    }
    
    return false;
  };

  // Advanced culling based on layer complexity
  const shouldCullForComplexity = (): boolean => {
    const complexLayers = [
      'wind-effects',
      'particle-effects',
      'supernova-waves',
      'emotional-morphing',
      'background-pulse',
      'shadow-effects'
    ];
    
    if (complexLayers.includes(layerType)) {
      return performanceLevel.level === 'low' || performanceLevel.level === 'emergency';
    }
    
    return false;
  };

  // Decide whether to render the layer
  const shouldRenderLayer = (): boolean => {
    // Critical layers always render
    if (priority === 'critical') {
      return true;
    }
    
    // Check all culling conditions
    if (shouldCullForZoom()) return false;
    if (shouldCullForPerformance()) return false;
    if (shouldCullForComplexity()) return false;
    if (shouldLimitLayer(zoomLevel, layerType)) return false;
    
    return true;
  };

  if (!shouldRenderLayer()) {
    return fallback;
  }

  return <>{children}</>;
};

// Helper hook for manual layer visibility checks
export const useLayerVisibility = () => {
  const { shouldLimitLayer, performanceLevel, isEmergencyMode } = useAdaptivePerformance();
  
  return {
    isLayerVisible: (layerType: string, zoomLevel: string, priority: 'critical' | 'high' | 'medium' | 'low') => {
      if (priority === 'critical') return true;
      if (isEmergencyMode && priority !== 'high') return false;
      return !shouldLimitLayer(zoomLevel, layerType);
    },
    getLayerOpacity: (layerType: string, baseopacity: number = 1) => {
      if (performanceLevel.level === 'emergency') return baseopacity * 0.3;
      if (performanceLevel.level === 'low') return baseopacity * 0.6;
      if (performanceLevel.level === 'medium') return baseopacity * 0.8;
      return baseopacity;
    },
    shouldShowLayerDetails: () => {
      return performanceLevel.enabledFeatures.detailedSVGPaths;
    }
  };
};
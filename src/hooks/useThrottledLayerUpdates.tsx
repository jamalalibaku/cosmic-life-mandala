/**
 * Performance-Optimized Layer Refresh Manager
 * Reduces high-frequency updates to 10fps with smooth interpolation
 */

import { useRef, useCallback, useEffect } from 'react';

interface LayerThrottleConfig {
  layerType: string;
  updateFrequency: number; // ms between updates
  interpolationSteps: number; // steps to fill gaps
}

const LAYER_CONFIGS: LayerThrottleConfig[] = [
  { layerType: 'mood', updateFrequency: 100, interpolationSteps: 10 },
  { layerType: 'mobility', updateFrequency: 100, interpolationSteps: 8 },
  { layerType: 'weather', updateFrequency: 200, interpolationSteps: 5 },
  { layerType: 'sleep', updateFrequency: 500, interpolationSteps: 3 },
  { layerType: 'plans', updateFrequency: 1000, interpolationSteps: 2 }
];

export const useThrottledLayerUpdates = () => {
  const lastUpdateTimes = useRef<Map<string, number>>(new Map());
  const interpolationCache = useRef<Map<string, any[]>>(new Map());

  const shouldUpdateLayer = useCallback((layerType: string): boolean => {
    const config = LAYER_CONFIGS.find(c => c.layerType === layerType);
    if (!config) return true;

    const now = performance.now();
    const lastUpdate = lastUpdateTimes.current.get(layerType) || 0;
    
    if (now - lastUpdate >= config.updateFrequency) {
      lastUpdateTimes.current.set(layerType, now);
      return true;
    }
    
    return false;
  }, []);

  const getInterpolatedValue = useCallback((
    layerType: string, 
    currentValue: any, 
    targetValue: any
  ): any => {
    const config = LAYER_CONFIGS.find(c => c.layerType === layerType);
    if (!config) return targetValue;

    // Simple linear interpolation for smooth transitions
    if (typeof currentValue === 'number' && typeof targetValue === 'number') {
      const progress = 0.1; // Smooth interpolation step
      return currentValue + (targetValue - currentValue) * progress;
    }

    return targetValue;
  }, []);

  const throttleLayerData = useCallback((layerType: string, newData: any[]) => {
    if (shouldUpdateLayer(layerType)) {
      interpolationCache.current.set(layerType, newData);
      return newData;
    }

    // Return cached data with interpolation
    const cached = interpolationCache.current.get(layerType);
    return cached || newData;
  }, [shouldUpdateLayer]);

  return {
    shouldUpdateLayer,
    getInterpolatedValue,
    throttleLayerData
  };
};
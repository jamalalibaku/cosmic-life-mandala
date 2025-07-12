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
  { layerType: 'mood', updateFrequency: 1000, interpolationSteps: 10 },
  { layerType: 'mobility', updateFrequency: 1000, interpolationSteps: 8 },
  { layerType: 'weather', updateFrequency: 1000, interpolationSteps: 5 },
  { layerType: 'sleep', updateFrequency: 1000, interpolationSteps: 3 },
  { layerType: 'plans', updateFrequency: 1000, interpolationSteps: 2 }
];

export const useThrottledLayerUpdates = () => {
  const intervalIds = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const interpolationCache = useRef<Map<string, any[]>>(new Map());
  const updateCallbacks = useRef<Map<string, () => void>>(new Map());

  const startLayerInterval = useCallback((layerType: string, callback: () => void) => {
    // Clear existing interval if any
    const existingInterval = intervalIds.current.get(layerType);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Start new event-driven interval
    const intervalId = setInterval(() => {
      callback();
    }, 1000); // 1 second for all layers

    intervalIds.current.set(layerType, intervalId);
    updateCallbacks.current.set(layerType, callback);
  }, []);

  const stopLayerInterval = useCallback((layerType: string) => {
    const intervalId = intervalIds.current.get(layerType);
    if (intervalId) {
      clearInterval(intervalId);
      intervalIds.current.delete(layerType);
      updateCallbacks.current.delete(layerType);
    }
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
    interpolationCache.current.set(layerType, newData);
    return newData;
  }, []);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      intervalIds.current.forEach(intervalId => clearInterval(intervalId));
      intervalIds.current.clear();
      updateCallbacks.current.clear();
    };
  }, []);

  return {
    startLayerInterval,
    stopLayerInterval,
    getInterpolatedValue,
    throttleLayerData
  };
};
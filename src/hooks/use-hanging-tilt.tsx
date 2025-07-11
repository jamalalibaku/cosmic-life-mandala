/**
 * Hanging Tilt Effect Hook
 * Creates gentle swaying motion for cosmic layers with harmonious timing
 */

import { useEffect, useState } from 'react';

interface HangingTiltOptions {
  enabled?: boolean;
  amplitude?: number; // Degrees of tilt
  period?: number; // Base period in seconds
  phaseOffset?: number; // Phase offset for variation
  dampening?: number; // Dampening factor (0-1)
  layerIndex?: number; // For per-layer variation
}

export const useHangingTilt = ({
  enabled = true,
  amplitude = 2,
  period = 8,
  phaseOffset = 0,
  dampening = 0.8,
  layerIndex = 0
}: HangingTiltOptions = {}) => {
  const [tiltAngle, setTiltAngle] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setTiltAngle(0);
      return;
    }

    let animationFrame: number;
    const startTime = Date.now();

    const updateTilt = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      setTime(currentTime);

      // Create harmonious but varied motion for each layer
      const baseFreq = (2 * Math.PI) / period;
      const layerVariation = layerIndex * 0.3; // Phase variation per layer
      const harmonicOffset = Math.sin(currentTime * baseFreq * 0.5) * 0.2; // Slower harmonic
      
      // Main tilt calculation with golden ratio influenced timing
      const goldenRatio = 1.618033988749;
      const primaryTilt = Math.sin(currentTime * baseFreq + phaseOffset + layerVariation) * amplitude;
      const secondaryTilt = Math.cos(currentTime * baseFreq * goldenRatio + harmonicOffset) * amplitude * 0.3;
      
      // Combine with dampening for natural feel
      const combinedTilt = (primaryTilt + secondaryTilt) * dampening;
      
      setTiltAngle(combinedTilt);
      animationFrame = requestAnimationFrame(updateTilt);
    };

    updateTilt();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [enabled, amplitude, period, phaseOffset, dampening, layerIndex]);

  // Generate transform string for CSS
  const getTiltTransform = (additionalTransforms = '') => {
    const tilt = `rotate(${tiltAngle}deg)`;
    return additionalTransforms ? `${additionalTransforms} ${tilt}` : tilt;
  };

  // Get SVG transform attribute
  const getSVGTiltTransform = (centerX: number, centerY: number, additionalTransforms = '') => {
    const tilt = `rotate(${tiltAngle} ${centerX} ${centerY})`;
    return additionalTransforms ? `${additionalTransforms} ${tilt}` : tilt;
  };

  return {
    tiltAngle,
    time,
    getTiltTransform,
    getSVGTiltTransform,
    isEnabled: enabled
  };
};

// Preset configurations for different layer types
export const TiltPresets = {
  main: {
    amplitude: 1.5,
    period: 12,
    phaseOffset: 0,
    dampening: 0.9
  },
  weather: {
    amplitude: 2.5,
    period: 10,
    phaseOffset: 0.2,
    dampening: 0.7
  },
  plans: {
    amplitude: 1.8,
    period: 14,
    phaseOffset: 0.8,
    dampening: 0.85
  },
  mobility: {
    amplitude: 2.2,
    period: 9,
    phaseOffset: 1.2,
    dampening: 0.75
  },
  mood: {
    amplitude: 3.0,
    period: 11,
    phaseOffset: 1.8,
    dampening: 0.6
  },
  sleep: {
    amplitude: 1.2,
    period: 16,
    phaseOffset: 2.4,
    dampening: 0.95
  },
  core: {
    amplitude: 0.8,
    period: 20,
    phaseOffset: 0,
    dampening: 1.0
  }
};
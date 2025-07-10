/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { useState, useEffect, useCallback } from 'react';

interface BreathingConfig {
  enabled: boolean;
  cycleMs: number;      // breathing cycle in milliseconds
  intensity: number;    // 0-1 how much breathing affects scale
  phaseOffset: number;  // offset for multiple elements to breathe in sync
  easingType: 'smooth' | 'sharp' | 'organic';
}

interface BreathingState {
  scale: number;        // current breathing scale multiplier
  phase: number;        // current phase in cycle (0-1)
  opacity: number;      // breathing opacity (0.8-1.0)
}

export const useBreathingPulse = (config: BreathingConfig = {
  enabled: true,
  cycleMs: 6000,
  intensity: 0.1,
  phaseOffset: 0,
  easingType: 'smooth'
}) => {
  const [breathingState, setBreathingState] = useState<BreathingState>({
    scale: 1,
    phase: 0,
    opacity: 1
  });

  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!config.enabled) {
      setBreathingState({ scale: 1, phase: 0, opacity: 1 });
      return;
    }

    let animationId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const cyclePosition = ((elapsed + config.phaseOffset * config.cycleMs) % config.cycleMs) / config.cycleMs;
      
      let easedPhase: number;
      
      // Apply different easing types
      switch (config.easingType) {
        case 'sharp':
          // Sharp inhale, slow exhale
          easedPhase = cyclePosition < 0.3 
            ? Math.pow(cyclePosition / 0.3, 0.5) * 0.5
            : 0.5 + Math.pow((cyclePosition - 0.3) / 0.7, 2) * 0.5;
          break;
          
        case 'organic':
          // Natural breathing with slight pause at top
          if (cyclePosition < 0.45) {
            easedPhase = Math.sin(cyclePosition / 0.45 * Math.PI / 2);
          } else if (cyclePosition < 0.55) {
            easedPhase = 1; // Pause at top
          } else {
            easedPhase = Math.cos((cyclePosition - 0.55) / 0.45 * Math.PI / 2);
          }
          break;
          
        default: // smooth
          easedPhase = 0.5 * (1 + Math.sin((cyclePosition * 2 - 0.5) * Math.PI));
          break;
      }

      const scale = 1 + (easedPhase - 0.5) * config.intensity * 2;
      const opacity = 0.85 + easedPhase * 0.15; // 0.85 to 1.0

      setBreathingState({
        scale,
        phase: cyclePosition,
        opacity
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [config, startTime]);

  // Helper to apply breathing to any transform
  const applyBreathingTransform = useCallback((
    baseTransform: string = '',
    centerX: number = 0,
    centerY: number = 0
  ) => {
    if (!config.enabled) return baseTransform;
    
    const scaleTransform = `scale(${breathingState.scale})`;
    const originTransform = centerX && centerY ? `translate(${centerX} ${centerY}) ${scaleTransform} translate(${-centerX} ${-centerY})` : scaleTransform;
    
    return baseTransform ? `${baseTransform} ${originTransform}` : originTransform;
  }, [config.enabled, breathingState.scale]);

  // Helper to apply breathing to radius
  const applyBreathingRadius = useCallback((baseRadius: number) => {
    return config.enabled ? baseRadius * breathingState.scale : baseRadius;
  }, [config.enabled, breathingState.scale]);

  // Helper to apply breathing to opacity
  const applyBreathingOpacity = useCallback((baseOpacity: number) => {
    return config.enabled ? baseOpacity * breathingState.opacity : baseOpacity;
  }, [config.enabled, breathingState.opacity]);

  return {
    breathingState,
    applyBreathingTransform,
    applyBreathingRadius,
    applyBreathingOpacity,
    config
  };
};
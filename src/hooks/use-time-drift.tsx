/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { useState, useEffect, useCallback } from 'react';

interface TimeDriftConfig {
  enabled: boolean;
  speed: number; // multiplier for drift speed (1 = real time)
  breathingEnabled: boolean;
  breathingIntensity: number; // 0-1
}

interface TimeDriftState {
  driftAngle: number; // current drift rotation in degrees
  breathingScale: number; // current breathing scale (0.95-1.05)
  realTimeAngle: number; // current real time position in degrees
}

export const useTimeDrift = (config: TimeDriftConfig = {
  enabled: true,
  speed: 1,
  breathingEnabled: true,
  breathingIntensity: 0.015
}) => {
  const [driftState, setDriftState] = useState<TimeDriftState>({
    driftAngle: 0,
    breathingScale: 1,
    realTimeAngle: 0
  });

  // Calculate real-time angle based on current time
  const calculateRealTimeAngle = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Convert to total minutes and then to degrees
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    return (totalMinutes / (24 * 60)) * 360; // 0° = midnight, 180° = noon
  }, []);

  useEffect(() => {
    if (!config.enabled) return;

    const startTime = Date.now();
    let animationId: number;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000; // seconds

      // Calculate drift rotation (slow clockwise rotation)
      const driftSpeed = 360 / (24 * 60 * 60); // degrees per second for 24h rotation
      const driftAngle = (elapsed * driftSpeed * config.speed) % 360;

      // Calculate breathing scale
      let breathingScale = 1;
      if (config.breathingEnabled) {
        const breathingCycle = 4; // 4 second breathing cycle
        const breathingPhase = (elapsed % breathingCycle) / breathingCycle;
        breathingScale = 1 + Math.sin(breathingPhase * Math.PI * 2) * config.breathingIntensity;
      }

      // Calculate real-time angle
      const realTimeAngle = calculateRealTimeAngle();

      setDriftState({
        driftAngle,
        breathingScale,
        realTimeAngle
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [config, calculateRealTimeAngle]);

  // Helper function to apply drift to any angle
  const applyDrift = useCallback((baseAngle: number) => {
    return config.enabled ? baseAngle + driftState.driftAngle : baseAngle;
  }, [config.enabled, driftState.driftAngle]);

  // Helper function to apply breathing to any scale value
  const applyBreathing = useCallback((baseScale: number = 1) => {
    return config.enabled && config.breathingEnabled 
      ? baseScale * driftState.breathingScale 
      : baseScale;
  }, [config.enabled, config.breathingEnabled, driftState.breathingScale]);

  // Helper to get the current "NOW" position (accounting for drift)
  const getNowAngle = useCallback(() => {
    // NOW stays fixed at top (270° or -90°) while everything else drifts
    return -90; // Fixed at top
  }, []);

  // Helper to get drift-adjusted transform
  const getDriftTransform = useCallback((centerX: number, centerY: number) => {
    if (!config.enabled) return '';
    
    return `rotate(${driftState.driftAngle} ${centerX} ${centerY})`;
  }, [config.enabled, driftState.driftAngle]);

  return {
    driftState,
    applyDrift,
    applyBreathing,
    getNowAngle,
    getDriftTransform,
    config
  };
};
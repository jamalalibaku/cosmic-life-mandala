/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { useState, useEffect, useCallback } from 'react';
import { useBreathingPulse } from './use-breathing-pulse';

interface MotionSignature {
  type: 'drift' | 'bulge' | 'wobble' | 'ripple' | 'compress' | 'heartbeat';
  intensity: number;
  frequency: number;
  dataInfluence: number;
}

interface LayerMotionConfig {
  layerType: string;
  baseRadius: number;
  dataPoints?: any[];
  moodVolatility?: number;
  isNightTime?: boolean;
}

interface OrbitMotionState {
  deformationPath: number[];
  rotationOffset: number;
  pulseScale: number;
  windDrift: number;
}

export const useOrganicOrbitMotion = (config: LayerMotionConfig) => {
  const breathingPulse = useBreathingPulse({
    enabled: true,
    cycleMs: 8000,
    intensity: 0.05,
    phaseOffset: Math.random(),
    easingType: 'organic'
  });

  const [motionState, setMotionState] = useState<OrbitMotionState>({
    deformationPath: [],
    rotationOffset: 0,
    pulseScale: 1,
    windDrift: 0
  });

  const [startTime] = useState(Date.now());

  // Define motion signatures per layer type
  const getMotionSignature = useCallback((layerType: string): MotionSignature => {
    switch (layerType.toLowerCase()) {
      case 'weather':
        return { type: 'drift', intensity: 0.08, frequency: 0.3, dataInfluence: 0.1 };
      case 'plans':
        return { type: 'bulge', intensity: 0.12, frequency: 0.8, dataInfluence: 0.3 };
      case 'mobility':
        return { type: 'wobble', intensity: 0.15, frequency: 1.2, dataInfluence: 0.25 };
      case 'mood':
        return { type: 'ripple', intensity: 0.2, frequency: 0.9, dataInfluence: 0.4 };
      case 'sleep':
        return { type: 'compress', intensity: 0.1, frequency: 0.4, dataInfluence: 0.2 };
      case 'self':
        return { type: 'heartbeat', intensity: 0.06, frequency: 1.0, dataInfluence: 0.1 };
      default:
        return { type: 'wobble', intensity: 0.05, frequency: 0.5, dataInfluence: 0.1 };
    }
  }, []);

  // Calculate deformation for polar coordinates
  const calculateDeformation = useCallback((angle: number, signature: MotionSignature, time: number): number => {
    const dataFactor = Math.min((config.dataPoints?.length || 0) / 10, 1);
    const moodFactor = config.moodVolatility || 0.5;
    const nightFactor = config.isNightTime ? 1.5 : 1;
    
    let deformation = 0;
    
    switch (signature.type) {
      case 'drift':
        // Wind-like horizontal drift
        deformation = Math.sin(time * 0.001 + angle * signature.frequency) * signature.intensity;
        deformation += Math.cos(time * 0.0008) * signature.intensity * 0.3;
        break;
        
      case 'bulge':
        // Data-responsive bulging at specific angles
        const bulgePoints = Math.floor(dataFactor * 4) + 2;
        deformation = Math.sin(angle * bulgePoints + time * 0.0005) * signature.intensity * dataFactor;
        break;
        
      case 'wobble':
        // High-frequency vibration with movement
        deformation = Math.sin(angle * signature.frequency + time * 0.002) * signature.intensity;
        deformation += Math.sin(angle * 3 + time * 0.003) * signature.intensity * 0.4;
        break;
        
      case 'ripple':
        // Mood-responsive emotional waves
        const emotionalWave = Math.sin(angle * 2 + time * 0.001 * moodFactor) * moodFactor;
        deformation = emotionalWave * signature.intensity;
        // Occasional tremors
        if (Math.sin(time * 0.0003) > 0.8) {
          deformation += Math.random() * signature.intensity * 0.5;
        }
        break;
        
      case 'compress':
        // Sleep compression - inward at night
        const compressionBase = config.isNightTime ? -signature.intensity : signature.intensity * 0.3;
        deformation = Math.sin(angle * 0.5 + time * 0.0004) * compressionBase * nightFactor;
        break;
        
      case 'heartbeat':
        // Central heartbeat pulse
        const heartRate = 0.002; // ~60 BPM equivalent
        const heartbeat = Math.abs(Math.sin(time * heartRate)) ** 3;
        deformation = heartbeat * signature.intensity;
        break;
    }
    
    return deformation * (1 + signature.dataInfluence * dataFactor);
  }, [config]);

  // Generate deformed path points
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      const currentTime = Date.now();
      const signature = getMotionSignature(config.layerType);
      
      // Generate 72 points for smooth circle (every 5 degrees)
      const points = [];
      for (let i = 0; i < 72; i++) {
        const angle = (i / 72) * Math.PI * 2;
        const deformation = calculateDeformation(angle, signature, currentTime);
        const adjustedRadius = config.baseRadius + (deformation * config.baseRadius);
        points.push(adjustedRadius);
      }
      
      // Calculate wind drift for weather layer
      let windDrift = 0;
      if (config.layerType.toLowerCase() === 'weather') {
        windDrift = Math.sin(currentTime * 0.0003) * 2; // 2 degree drift
      }
      
      setMotionState({
        deformationPath: points,
        rotationOffset: windDrift,
        pulseScale: breathingPulse.breathingState.scale,
        windDrift
      });
      
      // Throttle to ~20fps for performance
      setTimeout(() => {
        animationId = requestAnimationFrame(animate);
      }, 50);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [config, getMotionSignature, calculateDeformation, breathingPulse.breathingState.scale]);

  // Generate SVG path for deformed orbit
  const generateOrbitPath = useCallback((centerX: number, centerY: number): string => {
    if (motionState.deformationPath.length === 0) {
      // Fallback to perfect circle
      const r = config.baseRadius * motionState.pulseScale;
      return `M ${centerX + r} ${centerY} A ${r} ${r} 0 1 1 ${centerX - r} ${centerY} A ${r} ${r} 0 1 1 ${centerX + r} ${centerY}`;
    }
    
    const points = motionState.deformationPath.map((radius, index) => {
      const angle = (index / motionState.deformationPath.length) * Math.PI * 2 + (motionState.rotationOffset * Math.PI / 180);
      const adjustedRadius = radius * motionState.pulseScale;
      const x = centerX + Math.cos(angle) * adjustedRadius;
      const y = centerY + Math.sin(angle) * adjustedRadius;
      return { x, y };
    });
    
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // Use quadratic curves for smooth deformation
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      const controlX = (current.x + next.x) / 2;
      const controlY = (current.y + next.y) / 2;
      path += ` Q ${current.x} ${current.y} ${controlX} ${controlY}`;
    }
    
    path += ' Z';
    return path;
  }, [motionState, config.baseRadius]);

  // Get deformed radius at specific angle
  const getRadiusAtAngle = useCallback((angle: number): number => {
    if (motionState.deformationPath.length === 0) {
      return config.baseRadius * motionState.pulseScale;
    }
    
    const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const index = Math.floor((normalizedAngle / (Math.PI * 2)) * motionState.deformationPath.length);
    const radius = motionState.deformationPath[index] || config.baseRadius;
    
    return radius * motionState.pulseScale;
  }, [motionState, config.baseRadius]);

  return {
    motionState,
    generateOrbitPath,
    getRadiusAtAngle,
    breathingPulse: breathingPulse.breathingState,
    rotationOffset: motionState.rotationOffset
  };
};
/**
 * [Phase: ZIP9-Alpha | Digest Phase]
 * Unified Motion Engine - Consolidated physics system
 * 
 * Purpose: Replace scattered motion hooks with single system
 * Breaking Changes: Replaces useMotionField, individual motion hooks
 * Dependencies: All animated components, RadialLayerSystem
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface MotionConfig {
  // Core physics
  gravity: number;
  windStrength: number;
  friction: number;
  
  // Heartbeat/pulse
  heartbeatEnabled: boolean;
  heartbeatInterval: number; // ms
  heartbeatIntensity: number;
  
  // Drift behavior
  driftEnabled: boolean;
  driftSpeed: number;
  
  // Breathing
  breathingEnabled: boolean;
  breathingCycle: number; // ms for full inhale/exhale
  breathingDepth: number;
}

export interface MotionState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  scale: number;
  opacity: number;
  
  // Computed values
  heartbeat: number; // 0-1 pulse value
  drift: { x: number; y: number };
  breathing: number; // 0-1 breathing cycle
}

const defaultConfig: MotionConfig = {
  gravity: 0.001,
  windStrength: 0.002,
  friction: 0.98,
  heartbeatEnabled: true,
  heartbeatInterval: 1000,
  heartbeatIntensity: 0.1,
  driftEnabled: true,
  driftSpeed: 0.001,
  breathingEnabled: true,
  breathingCycle: 4000,
  breathingDepth: 0.05
};

export const useUnifiedMotion = (config: Partial<MotionConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const timeAccumulator = useRef<number>(0);
  
  const [motionState, setMotionState] = useState<MotionState>({
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    rotation: 0,
    scale: 1,
    opacity: 1,
    heartbeat: 0,
    drift: { x: 0, y: 0 },
    breathing: 0
  });

  const updateMotion = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    timeAccumulator.current += deltaTime;
    
    setMotionState(prevState => {
      let newState = { ...prevState };
      
      // Apply gravity (settling toward center)
      if (finalConfig.gravity > 0) {
        newState.velocityX -= newState.x * finalConfig.gravity;
        newState.velocityY -= newState.y * finalConfig.gravity;
      }
      
      // Apply wind (random gentle drift)
      if (finalConfig.driftEnabled) {
        const windX = (Math.random() - 0.5) * finalConfig.windStrength;
        const windY = (Math.random() - 0.5) * finalConfig.windStrength;
        newState.velocityX += windX;
        newState.velocityY += windY;
        
        // Update drift accumulator
        newState.drift.x += windX * finalConfig.driftSpeed;
        newState.drift.y += windY * finalConfig.driftSpeed;
        
        // Keep drift bounded
        newState.drift.x = Math.max(-10, Math.min(10, newState.drift.x));
        newState.drift.y = Math.max(-10, Math.min(10, newState.drift.y));
      }
      
      // Apply friction
      newState.velocityX *= finalConfig.friction;
      newState.velocityY *= finalConfig.friction;
      
      // Update position
      newState.x += newState.velocityX;
      newState.y += newState.velocityY;
      
      // Heartbeat pulse
      if (finalConfig.heartbeatEnabled) {
        const heartbeatPhase = (timeAccumulator.current % finalConfig.heartbeatInterval) / finalConfig.heartbeatInterval;
        // Create a quick pulse (fast rise, slower fall)
        if (heartbeatPhase < 0.1) {
          newState.heartbeat = Math.sin(heartbeatPhase * Math.PI * 10) * finalConfig.heartbeatIntensity;
        } else {
          newState.heartbeat = Math.exp(-(heartbeatPhase - 0.1) * 5) * finalConfig.heartbeatIntensity;
        }
      }
      
      // Breathing cycle
      if (finalConfig.breathingEnabled) {
        const breathingPhase = (timeAccumulator.current % finalConfig.breathingCycle) / finalConfig.breathingCycle;
        newState.breathing = Math.sin(breathingPhase * Math.PI * 2) * finalConfig.breathingDepth;
      }
      
      // Apply heartbeat and breathing to scale
      newState.scale = 1 + newState.heartbeat + newState.breathing;
      
      return newState;
    });
    
    animationRef.current = requestAnimationFrame(updateMotion);
  }, [finalConfig]);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(updateMotion);
    
    console.log('🌊 UnifiedMotion started:', {
      config: finalConfig,
      timestamp: new Date().toLocaleTimeString()
    });
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateMotion]);

  // External impulse function
  const addImpulse = useCallback((forceX: number, forceY: number) => {
    setMotionState(prev => ({
      ...prev,
      velocityX: prev.velocityX + forceX,
      velocityY: prev.velocityY + forceY
    }));
  }, []);

  // Reset motion
  const resetMotion = useCallback(() => {
    setMotionState({
      x: 0,
      y: 0,
      velocityX: 0,
      velocityY: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      heartbeat: 0,
      drift: { x: 0, y: 0 },
      breathing: 0
    });
    timeAccumulator.current = 0;
  }, []);

  // Get transform values for Framer Motion
  const getMotionTransform = useCallback(() => ({
    x: motionState.x + motionState.drift.x,
    y: motionState.y + motionState.drift.y,
    rotate: motionState.rotation,
    scale: motionState.scale,
    opacity: motionState.opacity
  }), [motionState]);

  // Get CSS transform string
  const getTransformString = useCallback(() => {
    const { x, y, drift, rotation, scale } = motionState;
    return `translate(${x + drift.x}px, ${y + drift.y}px) rotate(${rotation}deg) scale(${scale})`;
  }, [motionState]);

  return {
    motionState,
    addImpulse,
    resetMotion,
    getMotionTransform,
    getTransformString,
    
    // Individual motion components for granular control
    heartbeat: motionState.heartbeat,
    breathing: motionState.breathing,
    drift: motionState.drift,
    
    // State queries
    isSettled: Math.abs(motionState.velocityX) < 0.001 && Math.abs(motionState.velocityY) < 0.001
  };
};

/**
 * [Phase: ZIP9-Delta | Fixed Break: Stabilization]
 * Stabilized Unified Motion Engine - Prevents animation loops
 * 
 * Purpose: Controlled physics system with proper cleanup and bounds
 * Breaking Changes: Added stability controls, animation frame management
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

  // FIXED BREAK: Stability controls
  isStabilized: boolean;
  maxScale: number;
  minScale: number;
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
  windStrength: 0.001, // Reduced for stability
  friction: 0.99, // Increased for faster settling
  heartbeatEnabled: true,
  heartbeatInterval: 3000, // Slower heartbeat
  heartbeatIntensity: 0.03, // Reduced intensity
  driftEnabled: true,
  driftSpeed: 0.0005, // Reduced drift
  breathingEnabled: true,
  breathingCycle: 6000, // Slower breathing
  breathingDepth: 0.02, // Reduced depth
  isStabilized: true,
  maxScale: 1.1,
  minScale: 0.95
};

export const useUnifiedMotion = (config: Partial<MotionConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const timeAccumulator = useRef<number>(0);
  const isActiveRef = useRef<boolean>(true);
  
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
    if (!isActiveRef.current) return;
    
    const deltaTime = Math.min(currentTime - lastTimeRef.current, 16); // Cap delta time
    lastTimeRef.current = currentTime;
    timeAccumulator.current += deltaTime;
    
    setMotionState(prevState => {
      let newState = { ...prevState };
      
      // FIXED BREAK: Only apply physics if stabilized mode allows it
      if (finalConfig.isStabilized) {
        // Minimal gravity for gentle centering
        if (finalConfig.gravity > 0) {
          newState.velocityX -= newState.x * finalConfig.gravity * 0.5; // Gentler gravity
          newState.velocityY -= newState.y * finalConfig.gravity * 0.5;
        }
        
        // Controlled wind drift
        if (finalConfig.driftEnabled) {
          const windX = (Math.random() - 0.5) * finalConfig.windStrength;
          const windY = (Math.random() - 0.5) * finalConfig.windStrength;
          newState.velocityX += windX;
          newState.velocityY += windY;
          
          // Update drift with bounds
          newState.drift.x += windX * finalConfig.driftSpeed;
          newState.drift.y += windY * finalConfig.driftSpeed;
          
          // Tight drift bounds
          newState.drift.x = Math.max(-2, Math.min(2, newState.drift.x));
          newState.drift.y = Math.max(-2, Math.min(2, newState.drift.y));
        }
        
        // Apply friction
        newState.velocityX *= finalConfig.friction;
        newState.velocityY *= finalConfig.friction;
        
        // Update position with bounds
        newState.x += newState.velocityX;
        newState.y += newState.velocityY;
        
        // Clamp position to prevent explosion
        newState.x = Math.max(-20, Math.min(20, newState.x));
        newState.y = Math.max(-20, Math.min(20, newState.y));
      }
      
      // Controlled heartbeat pulse
      if (finalConfig.heartbeatEnabled && finalConfig.isStabilized) {
        const heartbeatPhase = (timeAccumulator.current % finalConfig.heartbeatInterval) / finalConfig.heartbeatInterval;
        if (heartbeatPhase < 0.1) {
          newState.heartbeat = Math.sin(heartbeatPhase * Math.PI * 10) * finalConfig.heartbeatIntensity;
        } else {
          newState.heartbeat = Math.exp(-(heartbeatPhase - 0.1) * 3) * finalConfig.heartbeatIntensity;
        }
      } else {
        newState.heartbeat = 0;
      }
      
      // Controlled breathing cycle
      if (finalConfig.breathingEnabled && finalConfig.isStabilized) {
        const breathingPhase = (timeAccumulator.current % finalConfig.breathingCycle) / finalConfig.breathingCycle;
        newState.breathing = Math.sin(breathingPhase * Math.PI * 2) * finalConfig.breathingDepth;
      } else {
        newState.breathing = 0;
      }
      
      // FIXED BREAK: Clamped scale to prevent zoom loops
      const targetScale = 1 + newState.heartbeat + newState.breathing;
      newState.scale = Math.max(finalConfig.minScale, Math.min(finalConfig.maxScale, targetScale));
      
      return newState;
    });
    
    if (isActiveRef.current) {
      animationRef.current = requestAnimationFrame(updateMotion);
    }
  }, [finalConfig]);

  useEffect(() => {
    isActiveRef.current = true;
    lastTimeRef.current = performance.now();
    
    // FIXED BREAK: Clean start
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(updateMotion);
    
    console.log('🔧 UnifiedMotion STABILIZED:', {
      config: finalConfig,
      timestamp: new Date().toLocaleTimeString()
    });
    
    return () => {
      isActiveRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [updateMotion]);

  // FIXED BREAK: Controlled impulse with bounds
  const addImpulse = useCallback((forceX: number, forceY: number) => {
    if (!finalConfig.isStabilized) return;
    
    const clampedForceX = Math.max(-0.5, Math.min(0.5, forceX));
    const clampedForceY = Math.max(-0.5, Math.min(0.5, forceY));
    
    setMotionState(prev => ({
      ...prev,
      velocityX: prev.velocityX + clampedForceX,
      velocityY: prev.velocityY + clampedForceY
    }));
  }, [finalConfig.isStabilized]);

  // FIXED BREAK: Clean reset
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

  // Get transform values for Framer Motion with bounds
  const getMotionTransform = useCallback(() => ({
    x: motionState.x + motionState.drift.x,
    y: motionState.y + motionState.drift.y,
    rotate: motionState.rotation,
    scale: Math.max(finalConfig.minScale, Math.min(finalConfig.maxScale, motionState.scale)),
    opacity: motionState.opacity
  }), [motionState, finalConfig.minScale, finalConfig.maxScale]);

  return {
    motionState,
    addImpulse,
    resetMotion,
    getMotionTransform,
    
    // Individual motion components for granular control
    heartbeat: motionState.heartbeat,
    breathing: motionState.breathing,
    drift: motionState.drift,
    
    // State queries
    isSettled: Math.abs(motionState.velocityX) < 0.001 && Math.abs(motionState.velocityY) < 0.001,
    isStabilized: finalConfig.isStabilized
  };
};
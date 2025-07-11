/**
 * Motion Field Engine - Living System Physics
 * Implements gravity, wind, and heartbeat forces for organic UI motion
 */

import { useEffect, useRef, useState } from 'react';

interface MotionState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  scale: number;
}

interface MotionFieldConfig {
  gravity: number;
  windStrength: number;
  heartbeatInterval: number;
  heartbeatIntensity: number;
}

const defaultConfig: MotionFieldConfig = {
  gravity: 0.985, // Natural decay coefficient
  windStrength: 0.2, // Ambient drift intensity
  heartbeatInterval: 6000, // 6 seconds between heartbeats
  heartbeatIntensity: 0.08 // Scale factor for heartbeat pulse
};

export const useMotionField = (config: Partial<MotionFieldConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const [motionState, setMotionState] = useState<MotionState>({
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    rotation: 0,
    scale: 1
  });

  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());
  const heartbeatPhaseRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = currentTime;

      setMotionState(prevState => {
        // Apply gravity (velocity decay)
        const newVelocityX = prevState.velocityX * finalConfig.gravity;
        const newVelocityY = prevState.velocityY * finalConfig.gravity;

        // Apply wind (subtle rotational drift)
        const windTime = currentTime * 0.0005; // Slow wind cycle
        const windRotation = Math.sin(windTime) * finalConfig.windStrength;
        const newRotation = prevState.rotation + windRotation * deltaTime;

        // Apply heartbeat (rhythmic scale pulse)
        heartbeatPhaseRef.current += deltaTime * 1000; // Convert back to milliseconds
        const heartbeatProgress = (heartbeatPhaseRef.current % finalConfig.heartbeatInterval) / finalConfig.heartbeatInterval;
        const heartbeatWave = Math.sin(heartbeatProgress * Math.PI * 2) * finalConfig.heartbeatIntensity;
        const newScale = 1 + heartbeatWave;

        // Update position based on velocity
        const newX = prevState.x + newVelocityX * deltaTime;
        const newY = prevState.y + newVelocityY * deltaTime;

        return {
          x: newX,
          y: newY,
          velocityX: newVelocityX,
          velocityY: newVelocityY,
          rotation: newRotation,
          scale: newScale
        };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [finalConfig]);

  // Function to add impulse (for external forces like clicks, emotions)
  const addImpulse = (forceX: number, forceY: number) => {
    setMotionState(prevState => ({
      ...prevState,
      velocityX: prevState.velocityX + forceX,
      velocityY: prevState.velocityY + forceY
    }));
  };

  // Get motion transform for framer-motion
  const getMotionTransform = () => ({
    x: motionState.x,
    y: motionState.y,
    rotate: motionState.rotation,
    scale: motionState.scale
  });

  // Get motion values for direct CSS transforms
  const getTransformString = () => 
    `translate(${motionState.x}px, ${motionState.y}px) rotate(${motionState.rotation}deg) scale(${motionState.scale})`;

  return {
    motionState,
    addImpulse,
    getMotionTransform,
    getTransformString
  };
};
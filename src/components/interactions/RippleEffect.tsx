/**
 * Ripple Effect - "Waves of Intention and Resonance"
 * 
 * Adria's Vision:
 * When the NOW line touches a glyph, it creates a ripple of energy
 * that flows outward, showing the resonance of that moment.
 * Each ripple carries the essence of its data type.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RippleEvent } from './NowLineCollisionSystem';

interface RippleEffectProps {
  ripple: RippleEvent;
  onComplete: (rippleId: string) => void;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  ripple,
  onComplete
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-remove ripple after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete(ripple.id);
    }, 2000); // 2 second ripple duration

    return () => clearTimeout(timer);
  }, [ripple.id, onComplete]);

  // Ripple characteristics based on data type
  const getRippleCharacteristics = (type: string, intensity: number) => {
    const characteristics = {
      mood: {
        maxScale: 1.5 + intensity * 1.0,
        strokeWidth: 2 + intensity * 2,
        duration: 1.5 + intensity * 0.5,
        easing: "easeOut",
        pattern: "smooth"
      },
      weather: {
        maxScale: 1.8 + intensity * 0.8,
        strokeWidth: 1.5 + intensity * 1.5,
        duration: 2.0 + intensity * 0.3,
        easing: "easeInOut",
        pattern: "fluid"
      },
      sleep: {
        maxScale: 1.2 + intensity * 0.6,
        strokeWidth: 3 + intensity * 1,
        duration: 2.5 + intensity * 0.2,
        easing: "easeOut",
        pattern: "gentle"
      },
      mobility: {
        maxScale: 1.6 + intensity * 1.2,
        strokeWidth: 1 + intensity * 2,
        duration: 1.0 + intensity * 0.4,
        easing: "easeOut",
        pattern: "energetic"
      },
      plans: {
        maxScale: 1.4 + intensity * 0.9,
        strokeWidth: 2 + intensity * 1.5,
        duration: 1.8 + intensity * 0.4,
        easing: "easeInOut",
        pattern: "structured"
      }
    };

    return characteristics[type] || characteristics.mood;
  };

  const chars = getRippleCharacteristics(ripple.type, ripple.intensity);

  // Create multiple ripple rings for depth
  const createRippleRings = () => {
    const rings = [];
    const ringCount = Math.floor(2 + ripple.intensity * 3); // 2-5 rings based on intensity

    for (let i = 0; i < ringCount; i++) {
      const delay = i * 0.2;
      const scaleMultiplier = 1 + (i * 0.3);
      
      rings.push(
        <motion.circle
          key={`ripple-ring-${i}`}
          cx={ripple.x}
          cy={ripple.y}
          r={5}
          fill="none"
          stroke={ripple.color}
          strokeWidth={chars.strokeWidth}
          opacity={0}
          initial={{
            scale: 0,
            opacity: 0,
            strokeWidth: chars.strokeWidth
          }}
          animate={{
            scale: chars.maxScale * scaleMultiplier,
            opacity: [0, 0.8 - (i * 0.15), 0],
            strokeWidth: [chars.strokeWidth, chars.strokeWidth * 0.3, 0]
          }}
          transition={{
            duration: chars.duration + (i * 0.2),
            ease: chars.easing,
            delay
          }}
          style={{
            filter: `drop-shadow(0 0 ${4 + ripple.intensity * 4}px ${ripple.color})`
          }}
        />
      );
    }

    return rings;
  };

  // Create energy particles that spiral outward
  const createEnergyParticles = () => {
    const particles = [];
    const particleCount = Math.floor(4 + ripple.intensity * 6);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * 360;
      const distance = 20 + ripple.intensity * 30;
      
      particles.push(
        <motion.circle
          key={`particle-${i}`}
          cx={ripple.x}
          cy={ripple.y}
          r={1}
          fill={ripple.color}
          opacity={0}
          initial={{
            scale: 0,
            opacity: 0,
            x: 0,
            y: 0
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.9, 0],
            x: Math.cos((angle * Math.PI) / 180) * distance,
            y: Math.sin((angle * Math.PI) / 180) * distance
          }}
          transition={{
            duration: chars.duration * 0.8,
            ease: "easeOut",
            delay: i * 0.05
          }}
        />
      );
    }

    return particles;
  };

  // Central glow effect
  const createCentralGlow = () => (
    <motion.circle
      cx={ripple.x}
      cy={ripple.y}
      r={8}
      fill={ripple.color}
      opacity={0}
      initial={{
        scale: 0,
        opacity: 0
      }}
      animate={{
        scale: [0, 1.5, 0.8, 0],
        opacity: [0, 0.7, 0.4, 0]
      }}
      transition={{
        duration: chars.duration * 0.6,
        ease: "easeOut"
      }}
      style={{
        filter: `blur(2px)`
      }}
    />
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <g className="ripple-effect" data-ripple-type={ripple.type}>
          <defs>
            <filter id={`ripple-glow-${ripple.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Central glow */}
          {createCentralGlow()}

          {/* Main ripple rings */}
          {createRippleRings()}

          {/* Energy particles */}
          {createEnergyParticles()}

          {/* Optional: Type-specific visual elements */}
          {ripple.type === 'mood' && (
            <motion.text
              x={ripple.x}
              y={ripple.y - 15}
              textAnchor="middle"
              className="text-xs font-bold"
              fill={ripple.color}
              opacity={0}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 0.8, 0], 
                scale: [0.5, 1.2, 1.5],
                y: [ripple.y - 15, ripple.y - 30, ripple.y - 40]
              }}
              transition={{
                duration: chars.duration * 0.7,
                ease: "easeOut"
              }}
            >
              ✨
            </motion.text>
          )}

          {ripple.type === 'weather' && (
            <motion.circle
              cx={ripple.x}
              cy={ripple.y}
              r={3}
              fill="none"
              stroke={ripple.color}
              strokeWidth="1"
              strokeDasharray="2,2"
              opacity={0}
              initial={{ 
                scale: 0,
                opacity: 0,
                rotate: 0
              }}
              animate={{ 
                scale: [0, 2, 3],
                opacity: [0, 0.6, 0],
                rotate: 360
              }}
              transition={{
                duration: chars.duration,
                ease: "linear"
              }}
            />
          )}
        </g>
      )}
    </AnimatePresence>
  );
};

// Container component to manage multiple ripples
interface RippleContainerProps {
  ripples: RippleEvent[];
  onRippleComplete: (rippleId: string) => void;
}

export const RippleContainer: React.FC<RippleContainerProps> = ({
  ripples,
  onRippleComplete
}) => {
  return (
    <g className="ripple-container">
      {ripples.map(ripple => (
        <RippleEffect
          key={ripple.id}
          ripple={ripple}
          onComplete={onRippleComplete}
        />
      ))}
    </g>
  );
};
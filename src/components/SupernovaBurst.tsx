/**
 * Supernova Burst - Emotional Explosion Animation
 * Triggered when emotional intensity exceeds threshold
 * Creates radial expanding waves with glow, blur, and fade
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SupernovaBurstProps {
  isActive: boolean;
  centerX?: number;
  centerY?: number;
  intensity?: number; // 0-1 scale
  emotionColor?: string;
  onComplete?: () => void;
}

interface BurstRing {
  id: number;
  radius: number;
  opacity: number;
  strokeWidth: number;
}

export const SupernovaBurst: React.FC<SupernovaBurstProps> = ({
  isActive,
  centerX = 0,
  centerY = 0,
  intensity = 1,
  emotionColor = "hsl(45, 90%, 65%)", // Default to joy/energy color
  onComplete
}) => {
  const [burstRings, setBurstRings] = useState<BurstRing[]>([]);
  const [burstActive, setBurstActive] = useState(false);

  useEffect(() => {
    if (isActive && !burstActive) {
      console.log('💥 SupernovaBurst activated!', { centerX, centerY, intensity, emotionColor });
      setBurstActive(true);
      triggerBurst();
    }
  }, [isActive, burstActive]);

  const triggerBurst = () => {
    // Create multiple expanding rings based on intensity
    const ringCount = Math.ceil(intensity * 5) + 2; // 3-7 rings
    const rings: BurstRing[] = [];

    for (let i = 0; i < ringCount; i++) {
      rings.push({
        id: i,
        radius: 20 + (i * 15), // Staggered starting radii
        opacity: 0.8 - (i * 0.1),
        strokeWidth: 4 - (i * 0.4)
      });
    }

    setBurstRings(rings);

    // Auto-complete after animation
    setTimeout(() => {
      setBurstActive(false);
      setBurstRings([]);
      onComplete?.();
    }, 2000);
  };

  const getBlurIntensity = () => Math.ceil(intensity * 8) + 4;
  const getGlowSpread = () => Math.ceil(intensity * 20) + 10;

  return (
    <AnimatePresence>
      {burstActive && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <defs>
            <filter id={`supernovaGlow-${centerX}-${centerY}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={getBlurIntensity()} result="coloredBlur"/>
              <feFlood floodColor={emotionColor} floodOpacity={intensity * 0.6}/>
              <feComposite in2="coloredBlur" operator="multiply"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <radialGradient id={`burstGradient-${centerX}-${centerY}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={emotionColor} stopOpacity={intensity * 0.9} />
              <stop offset="30%" stopColor={emotionColor} stopOpacity={intensity * 0.6} />
              <stop offset="70%" stopColor={emotionColor} stopOpacity={intensity * 0.3} />
              <stop offset="100%" stopColor={emotionColor} stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* Central flash */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={8}
            fill={`url(#burstGradient-${centerX}-${centerY})`}
            filter={`url(#supernovaGlow-${centerX}-${centerY})`}
            initial={{ scale: 0, opacity: intensity }}
            animate={{ 
              scale: [0, intensity * 3, intensity * 1.5, 0],
              opacity: [intensity, intensity * 0.8, intensity * 0.4, 0]
            }}
            transition={{ 
              duration: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94] // easeOutQuart
            }}
          />

          {/* Expanding rings */}
          {burstRings.map((ring, index) => (
            <motion.circle
              key={ring.id}
              cx={centerX}
              cy={centerY}
              r={ring.radius}
              stroke={emotionColor}
              strokeWidth={ring.strokeWidth}
              fill="none"
              opacity={ring.opacity}
              filter={`url(#supernovaGlow-${centerX}-${centerY})`}
              style={{
                strokeLinecap: "round",
              }}
              initial={{ 
                scale: 0,
                opacity: ring.opacity * intensity,
                strokeWidth: ring.strokeWidth * 2
              }}
              animate={{ 
                scale: [0, intensity * 8, intensity * 12],
                opacity: [ring.opacity * intensity, ring.opacity * intensity * 0.6, 0],
                strokeWidth: [ring.strokeWidth * 2, ring.strokeWidth, ring.strokeWidth * 0.2]
              }}
              transition={{ 
                duration: 1.8,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1] // easeOutQuint
              }}
            />
          ))}

          {/* Particle sparkles */}
          {Array.from({ length: Math.ceil(intensity * 8) + 4 }, (_, i) => {
            const angle = (i / (intensity * 8 + 4)) * Math.PI * 2;
            const distance = 30 + (intensity * 40);
            const sparkleX = centerX + Math.cos(angle) * distance;
            const sparkleY = centerY + Math.sin(angle) * distance;
            
            return (
              <motion.circle
                key={`sparkle-${i}`}
                cx={sparkleX}
                cy={sparkleY}
                r={1.5}
                fill={emotionColor}
                initial={{ 
                  scale: 0,
                  opacity: intensity * 0.8,
                  x: centerX,
                  y: centerY
                }}
                animate={{ 
                  scale: [0, intensity * 2, 0],
                  opacity: [intensity * 0.8, intensity * 0.4, 0],
                  x: [centerX, sparkleX],
                  y: [centerY, sparkleY]
                }}
                transition={{ 
                  duration: 1.2,
                  delay: 0.3 + (i * 0.05),
                  ease: "easeOut"
                }}
              />
            );
          })}
        </motion.g>
      )}
    </AnimatePresence>
  );
};
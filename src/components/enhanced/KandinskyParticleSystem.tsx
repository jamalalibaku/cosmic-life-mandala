/**
 * (c) 2025 Cosmic Life Mandala – Kandinsky Clarity Pass
 * Enhanced particle system with blur radius, soft inner glow, and organic motion
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { goldenRatio } from '@/utils/golden-ratio';

interface ParticleData {
  id: string;
  x: number;
  y: number;
  type: 'weather' | 'plans' | 'mobility' | 'mood' | 'sleep';
  intensity: number; // 0-1
  value: number; // 0-1
  timestamp: Date;
  size?: number;
}

interface KandinskyParticleSystemProps {
  particles: ParticleData[];
  centerX: number;
  centerY: number;
  radius: number;
  className?: string;
}

export const KandinskyParticleSystem: React.FC<KandinskyParticleSystemProps> = ({
  particles,
  centerX,
  centerY,
  radius,
  className = ''
}) => {
  
  // Enhanced particle configuration with blur and glow
  const enhancedParticles = useMemo(() => {
    return particles.map((particle, index) => {
      // Variable size with organic randomness
      const baseSize = 4 + (particle.intensity * 8); // 4-12px base
      const sizeVariation = 0.8 + (Math.random() * 0.4); // 0.8-1.2x variation
      const finalSize = baseSize * sizeVariation;
      
      // Blur radius based on intensity
      const blurRadius = 2 + (particle.intensity * 4); // 2-6px blur
      
      // Motion jitter for organic feel
      const jitterX = (Math.random() - 0.5) * 8;
      const jitterY = (Math.random() - 0.5) * 8;
      
      // Enhanced positioning with radial spacing that breathes
      const angle = (index / particles.length) * 360 * 1.618; // Golden ratio spiral
      const radiusVariation = 0.9 + (Math.random() * 0.2); // 0.9-1.1x variation
      const actualRadius = radius * radiusVariation;
      
      const rad = goldenRatio.toRadians(angle);
      const x = centerX + Math.cos(rad) * actualRadius + jitterX;
      const y = centerY + Math.sin(rad) * actualRadius + jitterY;
      
      // Color and glow based on type and intensity
      const colorConfig = getParticleColorConfig(particle.type, particle.intensity);
      
      return {
        ...particle,
        x,
        y,
        size: finalSize,
        blurRadius,
        angle,
        colorConfig,
        animationDelay: index * 0.1
      };
    });
  }, [particles, centerX, centerY, radius]);
  
  return (
    <g className={`kandinsky-particle-system ${className}`}>
      <defs>
        {/* Dynamic blur filters for each particle type */}
        {enhancedParticles.map((particle) => (
          <filter
            key={`blur-${particle.id}`}
            id={`particle-blur-${particle.id}`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation={particle.blurRadius} result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        ))}
        
        {/* Radial gradients for soft inner glow */}
        {['weather', 'plans', 'mobility', 'mood', 'sleep'].map(type => (
          <radialGradient key={`gradient-${type}`} id={`particle-gradient-${type}`}>
            <stop offset="0%" stopColor={getParticleColorConfig(type as any, 1).inner} stopOpacity="0.9" />
            <stop offset="60%" stopColor={getParticleColorConfig(type as any, 1).primary} stopOpacity="0.7" />
            <stop offset="100%" stopColor={getParticleColorConfig(type as any, 1).outer} stopOpacity="0.3" />
          </radialGradient>
        ))}
      </defs>
      
      {enhancedParticles.map((particle) => (
        <motion.g
          key={particle.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.6, 1, 0.8],
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.animationDelay
          }}
        >
          {/* Main particle with soft glow */}
          <circle
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={`url(#particle-gradient-${particle.type})`}
            filter={`url(#particle-blur-${particle.id})`}
            opacity={0.7 + particle.intensity * 0.3}
          />
          
          {/* Inner bright core for high-intensity particles */}
          {particle.intensity > 0.7 && (
            <circle
              cx={particle.x}
              cy={particle.y}
              r={particle.size * 0.4}
              fill={particle.colorConfig.bright}
              opacity="0.8"
            />
          )}
          
          {/* Outer aura for very high values */}
          {particle.value > 0.8 && (
            <motion.circle
              cx={particle.x}
              cy={particle.y}
              r={particle.size * 1.8}
              fill="none"
              stroke={particle.colorConfig.aura}
              strokeWidth="1"
              opacity="0.3"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          )}
        </motion.g>
      ))}
      
      {/* Connecting threads between nearby particles */}
      {enhancedParticles.map((particle, index) => {
        const nearbyParticles = enhancedParticles.filter((other, otherIndex) => {
          if (otherIndex >= index) return false;
          const distance = Math.sqrt(
            Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
          );
          return distance < 40 && particle.type === other.type;
        });
        
        return nearbyParticles.map((nearbyParticle) => (
          <line
            key={`connection-${particle.id}-${nearbyParticle.id}`}
            x1={particle.x}
            y1={particle.y}
            x2={nearbyParticle.x}
            y2={nearbyParticle.y}
            stroke={particle.colorConfig.connection}
            strokeWidth="0.5"
            opacity={Math.min(particle.intensity, nearbyParticle.intensity) * 0.4}
            className="pointer-events-none"
          />
        ));
      })}
    </g>
  );
};

// Enhanced color configuration for each particle type
function getParticleColorConfig(type: ParticleData['type'], intensity: number) {
  const configs = {
    weather: {
      primary: 'hsl(200, 70%, 65%)',
      inner: 'hsl(200, 80%, 80%)',
      outer: 'hsl(200, 60%, 45%)',
      bright: 'hsl(200, 90%, 85%)',
      aura: 'hsl(200, 60%, 70%)',
      connection: 'hsl(200, 50%, 60%)'
    },
    plans: {
      primary: 'hsl(280, 60%, 70%)',
      inner: 'hsl(280, 70%, 85%)',
      outer: 'hsl(280, 50%, 50%)',
      bright: 'hsl(280, 80%, 90%)',
      aura: 'hsl(280, 60%, 75%)',
      connection: 'hsl(280, 50%, 65%)'
    },
    mobility: {
      primary: 'hsl(120, 65%, 60%)',
      inner: 'hsl(120, 75%, 75%)',
      outer: 'hsl(120, 55%, 40%)',
      bright: 'hsl(120, 85%, 80%)',
      aura: 'hsl(120, 65%, 65%)',
      connection: 'hsl(120, 55%, 55%)'
    },
    mood: {
      primary: 'hsl(340, 70%, 65%)',
      inner: 'hsl(340, 80%, 80%)',
      outer: 'hsl(340, 60%, 45%)',
      bright: 'hsl(340, 90%, 85%)',
      aura: 'hsl(340, 70%, 70%)',
      connection: 'hsl(340, 60%, 60%)'
    },
    sleep: {
      primary: 'hsl(260, 55%, 70%)',
      inner: 'hsl(260, 65%, 85%)',
      outer: 'hsl(260, 45%, 50%)',
      bright: 'hsl(260, 75%, 90%)',
      aura: 'hsl(260, 55%, 75%)',
      connection: 'hsl(260, 45%, 65%)'
    }
  };
  
  return configs[type];
}
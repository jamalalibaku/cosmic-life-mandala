/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect, useMemo } from 'react';
import { goldenRatio, PHI } from '../utils/golden-ratio';

interface SunAuraRingProps {
  centerX: number;
  centerY: number;
  radius: number;
  theme: string;
  isPlaybackActive?: boolean;
  className?: string;
}

export const SunAuraRing: React.FC<SunAuraRingProps> = ({
  centerX,
  centerY,
  radius,
  theme,
  isPlaybackActive = false,
  className = ''
}) => {
  const [time, setTime] = useState(0);

  // Breathing animation timer
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      setTime((Date.now() - startTime) / 1000);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Theme-specific aura effects
  const auraConfig = useMemo(() => {
    const configs = {
      default: {
        baseColor: 'hsl(45 80% 60%)',
        glowColor: 'hsl(45 100% 70%)',
        pattern: 'flame',
        intensity: 0.6
      },
      tattoo: {
        baseColor: 'hsl(0 80% 50%)',
        glowColor: 'hsl(0 100% 60%)',
        pattern: 'burst',
        intensity: 0.8
      },
      floral: {
        baseColor: 'hsl(300 60% 65%)',
        glowColor: 'hsl(320 80% 75%)',
        pattern: 'petal',
        intensity: 0.5
      },
      techHUD: {
        baseColor: 'hsl(180 80% 50%)',
        glowColor: 'hsl(180 100% 60%)',
        pattern: 'circuit',
        intensity: 0.9
      },
      vinyl: {
        baseColor: 'hsl(45 70% 55%)',
        glowColor: 'hsl(45 90% 65%)',
        pattern: 'groove',
        intensity: 0.7
      },
      noir: {
        baseColor: 'hsl(240 30% 40%)',
        glowColor: 'hsl(240 60% 50%)',
        pattern: 'smoke',
        intensity: 0.4
      },
      pastelParadise: {
        baseColor: 'hsl(280 50% 70%)',
        glowColor: 'hsl(300 70% 80%)',
        pattern: 'wave',
        intensity: 0.6
      }
    };
    return configs[theme] || configs.default;
  }, [theme]);

  // Breathing scale with golden ratio
  const breathingScale = useMemo(() => {
    return goldenRatio.breathingScale(time * 1000, 4000); // 4 second breathing cycle
  }, [time]);

  // Playback spiral flare
  const spiralFlare = useMemo(() => {
    if (!isPlaybackActive) return null;
    
    const flareAngle = time * 30; // Slow rotation
    const flareRadius = radius * (1 + Math.sin(time * 2) * 0.1);
    const flareX = centerX + Math.cos(goldenRatio.toRadians(flareAngle)) * flareRadius;
    const flareY = centerY + Math.sin(goldenRatio.toRadians(flareAngle)) * flareRadius;
    
    return { x: flareX, y: flareY, angle: flareAngle };
  }, [isPlaybackActive, time, centerX, centerY, radius]);

  // Generate aura patterns based on theme
  const auraPatterns = useMemo(() => {
    const patternCount = auraConfig.pattern === 'circuit' ? 8 : 12;
    const patterns = [];
    
    for (let i = 0; i < patternCount; i++) {
      const angle = (i / patternCount) * 360 + (time * 10);
      const waveRadius = radius * (0.8 + Math.sin(time * 1.5 + i) * 0.2);
      const opacity = auraConfig.intensity * (0.3 + Math.sin(time * 0.8 + i * 0.5) * 0.2);
      
      patterns.push({
        id: i,
        angle,
        radius: waveRadius,
        opacity,
        size: 8 + Math.sin(time + i) * 4
      });
    }
    
    return patterns;
  }, [auraConfig, radius, time]);

  return (
    <g className={`sun-aura-ring ${className}`}>
      <defs>
        {/* Aura gradient */}
        <radialGradient
          id={`aura-gradient-${theme}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={auraConfig.glowColor} stopOpacity="0.8" />
          <stop offset="30%" stopColor={auraConfig.baseColor} stopOpacity="0.6" />
          <stop offset="70%" stopColor={auraConfig.baseColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={auraConfig.baseColor} stopOpacity="0.1" />
        </radialGradient>
        
        {/* Aura blur filter */}
        <filter id="aura-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Intense glow for playback flare */}
        <filter id="flare-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main breathing aura */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * breathingScale}
        fill={`url(#aura-gradient-${theme})`}
        filter="url(#aura-glow)"
        opacity={auraConfig.intensity}
        className="pointer-events-none"
      />

      {/* Theme-specific aura patterns */}
      {auraPatterns.map(pattern => {
        const x = centerX + Math.cos(goldenRatio.toRadians(pattern.angle)) * pattern.radius;
        const y = centerY + Math.sin(goldenRatio.toRadians(pattern.angle)) * pattern.radius;
        
        return (
          <g key={`pattern-${pattern.id}`} className="pointer-events-none">
            {auraConfig.pattern === 'flame' && (
              <ellipse
                cx={x}
                cy={y}
                rx={pattern.size * 0.6}
                ry={pattern.size * 1.4}
                fill={auraConfig.glowColor}
                opacity={pattern.opacity}
                filter="url(#aura-glow)"
                transform={`rotate(${pattern.angle + 90} ${x} ${y})`}
              />
            )}
            
            {auraConfig.pattern === 'burst' && (
              <polygon
                points={`${x},${y-pattern.size} ${x+pattern.size*0.3},${y} ${x},${y+pattern.size} ${x-pattern.size*0.3},${y}`}
                fill={auraConfig.glowColor}
                opacity={pattern.opacity}
                filter="url(#aura-glow)"
                transform={`rotate(${pattern.angle} ${x} ${y})`}
              />
            )}
            
            {auraConfig.pattern === 'petal' && (
              <ellipse
                cx={x}
                cy={y}
                rx={pattern.size * 0.8}
                ry={pattern.size * 1.2}
                fill={auraConfig.glowColor}
                opacity={pattern.opacity}
                filter="url(#aura-glow)"
                transform={`rotate(${pattern.angle + 45} ${x} ${y})`}
              />
            )}
            
            {(auraConfig.pattern === 'circuit' || auraConfig.pattern === 'groove' || auraConfig.pattern === 'smoke' || auraConfig.pattern === 'wave') && (
              <circle
                cx={x}
                cy={y}
                r={pattern.size}
                fill={auraConfig.glowColor}
                opacity={pattern.opacity}
                filter="url(#aura-glow)"
              />
            )}
          </g>
        );
      })}

      {/* Playback spiral flare */}
      {spiralFlare && (
        <g className="spiral-flare pointer-events-none">
          <circle
            cx={spiralFlare.x}
            cy={spiralFlare.y}
            r={20}
            fill={auraConfig.glowColor}
            opacity="0.8"
            filter="url(#flare-glow)"
          />
          <circle
            cx={spiralFlare.x}
            cy={spiralFlare.y}
            r={12}
            fill="white"
            opacity="0.6"
          />
        </g>
      )}

      {/* Pulse rings */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * (1.2 + Math.sin(time * 1.5) * 0.1)}
        fill="none"
        stroke={auraConfig.baseColor}
        strokeWidth="1"
        opacity={0.2 + Math.sin(time * 2) * 0.1}
        filter="url(#aura-glow)"
        className="pointer-events-none"
      />
    </g>
  );
};
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
  activeLayerRadius?: number; // Anchor to outermost active layer
  timeOfDay?: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'sunset' | 'dusk' | 'night';
  className?: string;
}

export const SunAuraRing: React.FC<SunAuraRingProps> = ({
  centerX,
  centerY,
  radius,
  theme,
  isPlaybackActive = false,
  activeLayerRadius,
  timeOfDay = 'noon',
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

  // Smooth breathing with damped easing instead of raw Math.sin
  const breathingScale = useMemo(() => {
    const cycle = 6000; // 6 second breathing cycle
    const phase = (time * 1000) % cycle / cycle;
    // Use cubic easing for smoother breathing
    const eased = 0.5 * (1 + Math.sin((phase * 2 - 0.5) * Math.PI));
    return 0.95 + (eased * 0.1); // Range: 0.95 to 1.05
  }, [time]);

  // Calculate structural anchor radius (outermost active layer)
  const structuralRadius = useMemo(() => {
    return activeLayerRadius || radius;
  }, [activeLayerRadius, radius]);

  // Time-of-day intensity modulation
  const timeIntensity = useMemo(() => {
    const intensities = {
      dawn: 0.8,
      morning: 1.0,
      noon: 1.2,
      afternoon: 1.0,
      sunset: 1.1,
      dusk: 0.7,
      night: 0.4
    };
    return intensities[timeOfDay] || 1.0;
  }, [timeOfDay]);

  // Layered aura rings using golden ratio spacing
  const layeredAuras = useMemo(() => {
    const layers = [];
    const baseRadius = structuralRadius * breathingScale;
    
    for (let i = 0; i < 3; i++) {
      const layerRadius = baseRadius * Math.pow(goldenRatio.larger(1), i * 0.3);
      const opacity = (auraConfig.intensity * timeIntensity * (0.8 - i * 0.2));
      const blur = 4 + i * 3;
      
      layers.push({
        id: i,
        radius: layerRadius,
        opacity: Math.max(0.1, opacity),
        blur,
        strokeWidth: 2 - i * 0.5
      });
    }
    
    return layers;
  }, [structuralRadius, breathingScale, auraConfig.intensity, timeIntensity]);

  // Smooth orbital patterns - no flickering
  const orbitalPatterns = useMemo(() => {
    const patternCount = 8;
    const patterns = [];
    
    for (let i = 0; i < patternCount; i++) {
      const baseAngle = (i / patternCount) * 360;
      const driftAngle = time * 3; // Slow drift
      const angle = baseAngle + driftAngle;
      
      const orbitRadius = structuralRadius * (0.7 + i * 0.05);
      const x = centerX + Math.cos(goldenRatio.toRadians(angle)) * orbitRadius;
      const y = centerY + Math.sin(goldenRatio.toRadians(angle)) * orbitRadius;
      
      // Smooth pulsing without harsh Math.sin transitions
      const pulsePhase = (time + i * 0.5) % 3; // 3 second pulse cycle
      const smoothPulse = 0.5 + 0.5 * Math.cos(pulsePhase * 2 * Math.PI / 3);
      
      patterns.push({
        id: i,
        x,
        y,
        angle,
        size: 6 + smoothPulse * 4,
        opacity: auraConfig.intensity * timeIntensity * (0.4 + smoothPulse * 0.3)
      });
    }
    
    return patterns;
  }, [structuralRadius, centerX, centerY, time, auraConfig.intensity, timeIntensity]);

  // Playback spiral flare
  const spiralFlare = useMemo(() => {
    if (!isPlaybackActive) return null;
    
    const flareAngle = time * 30; // Slow rotation
    const flareRadius = structuralRadius * (1 + Math.sin(time * 2) * 0.1);
    const flareX = centerX + Math.cos(goldenRatio.toRadians(flareAngle)) * flareRadius;
    const flareY = centerY + Math.sin(goldenRatio.toRadians(flareAngle)) * flareRadius;
    
    return { x: flareX, y: flareY, angle: flareAngle };
  }, [isPlaybackActive, time, centerX, centerY, structuralRadius]);

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

      {/* Layered breathing aura rings */}
      {layeredAuras.map(layer => (
        <circle
          key={`aura-layer-${layer.id}`}
          cx={centerX}
          cy={centerY}
          r={layer.radius}
          fill="none"
          stroke={auraConfig.glowColor}
          strokeWidth={layer.strokeWidth}
          opacity={layer.opacity}
          filter={`url(#aura-glow)`}
          className="pointer-events-none"
        />
      ))}

      {/* Orbital patterns - smooth theme-specific shapes */}
      {orbitalPatterns.map(pattern => (
        <g key={`orbital-${pattern.id}`} className="pointer-events-none">
          {auraConfig.pattern === 'flame' && (
            <ellipse
              cx={pattern.x}
              cy={pattern.y}
              rx={pattern.size * 0.6}
              ry={pattern.size * 1.4}
              fill={auraConfig.glowColor}
              opacity={pattern.opacity}
              filter="url(#aura-glow)"
              transform={`rotate(${pattern.angle + 90} ${pattern.x} ${pattern.y})`}
            />
          )}
          
          {auraConfig.pattern === 'burst' && (
            <polygon
              points={`${pattern.x},${pattern.y-pattern.size} ${pattern.x+pattern.size*0.3},${pattern.y} ${pattern.x},${pattern.y+pattern.size} ${pattern.x-pattern.size*0.3},${pattern.y}`}
              fill={auraConfig.glowColor}
              opacity={pattern.opacity}
              filter="url(#aura-glow)"
              transform={`rotate(${pattern.angle} ${pattern.x} ${pattern.y})`}
            />
          )}
          
          {auraConfig.pattern === 'petal' && (
            <ellipse
              cx={pattern.x}
              cy={pattern.y}
              rx={pattern.size * 0.8}
              ry={pattern.size * 1.2}
              fill={auraConfig.glowColor}
              opacity={pattern.opacity}
              filter="url(#aura-glow)"
              transform={`rotate(${pattern.angle + 45} ${pattern.x} ${pattern.y})`}
            />
          )}
          
          {(auraConfig.pattern === 'circuit' || auraConfig.pattern === 'groove' || auraConfig.pattern === 'smoke' || auraConfig.pattern === 'wave') && (
            <circle
              cx={pattern.x}
              cy={pattern.y}
              r={pattern.size}
              fill={auraConfig.glowColor}
              opacity={pattern.opacity}
              filter="url(#aura-glow)"
            />
          )}
        </g>
      ))}

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
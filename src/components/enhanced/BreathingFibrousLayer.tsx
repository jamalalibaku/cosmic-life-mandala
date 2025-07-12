/**
 * Enhanced Fibrous Ring Layer - "Hair Groove Rhythm" with Dynamic Density
 * Implements Ad's vision of breathing gaps and wind curvature memory
 * Organic distortions create living, flowing textures that dance with data
 */

import React, { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BreathingFiber {
  id: string;
  angle: number;
  startRadius: number;
  endRadius: number;
  color: string;
  opacity: number;
  thickness: number;
  windCurve: number;
  breathPhase: number;
  densityZone: 'dense' | 'breathing' | 'sparse';
}

interface BreathingFibrousLayerProps {
  radius: number;
  center: { x: number; y: number };
  data: any[];
  layerType: 'sleep' | 'mood' | 'weather' | 'mobility' | 'plans' | 'essence';
  baseColor: string;
  thickness?: number;
  className?: string;
}

export const BreathingFibrousLayer: React.FC<BreathingFibrousLayerProps> = ({
  radius,
  center,
  data,
  layerType,
  baseColor,
  thickness = 12,
  className = ''
}) => {
  const time = useRef(0);
  
  useEffect(() => {
    const animate = () => {
      time.current += 0.016; // ~60fps
      requestAnimationFrame(animate);
    };
    animate();
    return () => {};
  }, []);

  // Generate breathing fiber system with dynamic density zones
  const fibers = useMemo(() => {
    const generatedFibers: BreathingFiber[] = [];
    const totalSegments = data.length || 24;
    
    data.forEach((dataPoint, segmentIndex) => {
      const segmentAngle = (2 * Math.PI) / totalSegments;
      const baseAngle = segmentIndex * segmentAngle;
      
      // Extract data intensity for this segment
      let intensity = 0.5;
      if (layerType === 'sleep') {
        intensity = Math.max(0.2, Math.min(1, (dataPoint.intensity || dataPoint.duration || 0.5)));
      } else if (layerType === 'mood') {
        intensity = Math.max(0.2, Math.min(1, (dataPoint.mood || dataPoint.value || 0.5)));
      } else if (layerType === 'weather') {
        intensity = Math.max(0.2, Math.min(1, (dataPoint.temperature || 20) / 40));
      } else {
        intensity = Math.max(0.2, Math.min(1, (dataPoint.intensity || dataPoint.value || Math.random() * 0.6 + 0.3)));
      }
      
      // Breathing density - creates gaps and clusters based on data intensity
      const densityPattern = calculateBreathingDensity(intensity, segmentIndex, totalSegments);
      const fiberCount = Math.floor(densityPattern.count * (8 + intensity * 16));
      
      for (let fiberIndex = 0; fiberIndex < fiberCount; fiberIndex++) {
        const fiberId = `${layerType}-breath-${segmentIndex}-${fiberIndex}`;
        
        // Organic angle distribution within segment
        const angleProgress = fiberIndex / Math.max(1, fiberCount - 1);
        const angleSpread = segmentAngle * densityPattern.spread;
        const angleOffset = (segmentAngle - angleSpread) / 2;
        const fiberAngle = baseAngle + angleOffset + angleProgress * angleSpread;
        
        // Add Perlin-like noise for organic distribution
        const noiseX = Math.sin(fiberAngle * 3 + segmentIndex * 0.5) * 0.1;
        const noiseY = Math.cos(fiberAngle * 4 + segmentIndex * 0.3) * 0.08;
        const organicAngle = fiberAngle + noiseX + (Math.random() - 0.5) * segmentAngle * 0.15;
        
        // Dynamic radius based on breathing pattern and wind memory
        const radiusVariation = thickness * (0.6 + intensity * 0.8);
        const windInfluence = Math.sin(organicAngle * 2 + segmentIndex * 0.7) * thickness * 0.3;
        const startRadius = radius - radiusVariation + windInfluence;
        const endRadius = radius + radiusVariation + windInfluence * 0.5;
        
        // Color evolution based on layer type and position
        const colorShift = getEnhancedColorShift(baseColor, layerType, intensity, fiberIndex, segmentIndex);
        
        generatedFibers.push({
          id: fiberId,
          angle: organicAngle,
          startRadius: Math.max(10, startRadius),
          endRadius: Math.max(20, endRadius),
          color: colorShift.color,
          opacity: colorShift.opacity * densityPattern.opacity,
          thickness: 0.5 + intensity * 1.5 + Math.random() * 0.4,
          windCurve: (Math.sin(organicAngle * 1.5) + Math.cos(organicAngle * 2.3)) * 0.2,
          breathPhase: (segmentIndex + fiberIndex * 0.1) % (Math.PI * 2),
          densityZone: densityPattern.zone
        });
      }
    });
    
    return generatedFibers;
  }, [data, radius, layerType, baseColor, thickness]);

  // Generate organic fiber path with wind curvature memory
  const generateBreathingPath = (fiber: BreathingFiber): string => {
    const { angle, startRadius, endRadius, windCurve, breathPhase } = fiber;
    
    // Breathing effect - radius oscillates gently
    const breatheScale = 1 + Math.sin(time.current * 0.8 + breathPhase) * 0.08;
    const adjustedStartRadius = startRadius * breatheScale;
    const adjustedEndRadius = endRadius * breatheScale;
    
    // Start point (inner)
    const x1 = center.x + Math.cos(angle) * adjustedStartRadius;
    const y1 = center.y + Math.sin(angle) * adjustedStartRadius;
    
    // End point (outer) 
    const x2 = center.x + Math.cos(angle) * adjustedEndRadius;
    const y2 = center.y + Math.sin(angle) * adjustedEndRadius;
    
    // Wind curvature - creates organic, flowing fiber paths
    const midRadius = (adjustedStartRadius + adjustedEndRadius) / 2;
    const windAngle = angle + windCurve + Math.sin(time.current * 0.5 + breathPhase) * 0.1;
    const cx = center.x + Math.cos(windAngle) * midRadius;
    const cy = center.y + Math.sin(windAngle) * midRadius;
    
    // Additional control point for more organic curves
    const curve2Angle = angle + windCurve * 0.5;
    const curve2Radius = midRadius + Math.sin(time.current * 0.7 + breathPhase) * thickness * 0.3;
    const cx2 = center.x + Math.cos(curve2Angle) * curve2Radius;
    const cy2 = center.y + Math.sin(curve2Angle) * curve2Radius;
    
    return `M ${x1} ${y1} Q ${cx} ${cy} ${cx2} ${cy2} T ${x2} ${y2}`;
  };

  return (
    <motion.g
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <defs>
        {/* Enhanced breathing glow filter */}
        <filter id={`breathing-glow-${layerType}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.5" result="softGlow"/>
          <feGaussianBlur stdDeviation="0.3" result="sharpCore"/>
          <feGaussianBlur stdDeviation="3" result="atmosphereGlow"/>
          <feMerge>
            <feMergeNode in="atmosphereGlow"/>
            <feMergeNode in="softGlow"/>
            <feMergeNode in="sharpCore"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Organic noise texture for wind memory */}
        <feTurbulence 
          id={`organic-noise-${layerType}`}
          baseFrequency="0.02 0.01" 
          numOctaves="3" 
          result="noise"
        />
      </defs>

      {/* Render breathing fibers */}
      {fibers.map((fiber) => (
        <motion.path
          key={fiber.id}
          d={generateBreathingPath(fiber)}
          stroke={fiber.color}
          strokeWidth={fiber.thickness}
          strokeLinecap="round"
          fill="none"
          opacity={fiber.opacity}
          filter={`url(#breathing-glow-${layerType})`}
          animate={{
            opacity: [
              fiber.opacity * 0.6, 
              fiber.opacity, 
              fiber.opacity * 0.8,
              fiber.opacity
            ],
            strokeWidth: [
              fiber.thickness * 0.8, 
              fiber.thickness, 
              fiber.thickness * 1.1,
              fiber.thickness
            ]
          }}
          transition={{
            duration: 4 + Math.sin(fiber.breathPhase) * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: fiber.breathPhase * 0.5
          }}
          style={{
            filter: `drop-shadow(0 0 ${fiber.thickness * 0.8}px ${fiber.color}60)`,
            mixBlendMode: fiber.densityZone === 'sparse' ? 'screen' : 'normal'
          }}
        />
      ))}
      
      {/* Celestial breath markers for high-intensity zones */}
      {fibers
        .filter(fiber => fiber.densityZone === 'dense' && Math.random() < 0.1)
        .map((fiber) => {
          const markerRadius = (fiber.startRadius + fiber.endRadius) / 2;
          const markerX = center.x + Math.cos(fiber.angle) * markerRadius;
          const markerY = center.y + Math.sin(fiber.angle) * markerRadius;
          
          return (
            <motion.circle
              key={`breath-marker-${fiber.id}`}
              cx={markerX}
              cy={markerY}
              r={2}
              fill={fiber.color}
              opacity={0}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0.3, 1.2, 0.3],
                r: [1, 3, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 6
              }}
            />
          );
        })}
    </motion.g>
  );
};

// Calculate breathing density pattern - creates organic gaps and clusters
function calculateBreathingDensity(
  intensity: number, 
  segmentIndex: number, 
  totalSegments: number
): { count: number; spread: number; opacity: number; zone: 'dense' | 'breathing' | 'sparse' } {
  
  // Create wave-like density pattern around the circle
  const wavePhase = (segmentIndex / totalSegments) * Math.PI * 2;
  const densityWave = Math.sin(wavePhase * 3) * 0.3 + Math.cos(wavePhase * 1.7) * 0.2;
  
  // Intensity-driven base density
  const baseCount = 0.3 + intensity * 0.7;
  const waveDensity = baseCount + densityWave;
  
  // Create breathing gaps - some areas are intentionally sparse
  const breathingGap = Math.sin(wavePhase * 0.8) < -0.4;
  
  if (breathingGap) {
    return {
      count: waveDensity * 0.2,
      spread: 0.4,
      opacity: 0.3,
      zone: 'sparse'
    };
  } else if (waveDensity > 0.7) {
    return {
      count: waveDensity * 1.2,
      spread: 0.9,
      opacity: 0.8,
      zone: 'dense'
    };
  } else {
    return {
      count: waveDensity,
      spread: 0.7,
      opacity: 0.6,
      zone: 'breathing'
    };
  }
}

// Enhanced color shift with layer-specific palettes
function getEnhancedColorShift(
  baseColor: string, 
  layerType: string, 
  intensity: number, 
  fiberIndex: number,
  segmentIndex: number
): { color: string; opacity: number } {
  
  const baseHue = extractHue(baseColor);
  const time = Date.now() * 0.001;
  
  // Layer-specific color evolution
  switch (layerType) {
    case 'sleep':
      // Deep ocean to starlight progression
      const sleepHue = (baseHue + Math.sin(segmentIndex * 0.5 + time * 0.2) * 20) % 360;
      const sleepSat = 60 + intensity * 25;
      const sleepLight = 35 + intensity * 40;
      return {
        color: `hsl(${sleepHue} ${sleepSat}% ${sleepLight}%)`,
        opacity: 0.4 + intensity * 0.5
      };
      
    case 'mood':
      // Emotional aurora spectrum
      const moodHue = (baseHue + fiberIndex * 15 + Math.sin(time * 0.3) * 30) % 360;
      const moodSat = 70 + intensity * 20;
      const moodLight = 45 + intensity * 35;
      return {
        color: `hsl(${moodHue} ${moodSat}% ${moodLight}%)`,
        opacity: 0.5 + intensity * 0.4
      };
      
    case 'weather':
      // Sky dynamics - from storm to sunshine
      const weatherHue = (baseHue + Math.cos(segmentIndex * 0.3) * 25) % 360;
      const weatherSat = 50 + intensity * 30;
      const weatherLight = 50 + intensity * 25;
      return {
        color: `hsl(${weatherHue} ${weatherSat}% ${weatherLight}%)`,
        opacity: 0.3 + intensity * 0.6
      };
      
    default:
      // Gentle cosmic variations
      const defaultHue = (baseHue + fiberIndex * 8 + segmentIndex * 3) % 360;
      const defaultSat = 65 + intensity * 20;
      const defaultLight = 50 + intensity * 30;
      return {
        color: `hsl(${defaultHue} ${defaultSat}% ${defaultLight}%)`,
        opacity: 0.4 + intensity * 0.5
      };
  }
}

// Extract hue from HSL color string
function extractHue(color: string): number {
  const hslMatch = color.match(/hsl\((\d+)/);
  return hslMatch ? parseInt(hslMatch[1]) : 45;
}
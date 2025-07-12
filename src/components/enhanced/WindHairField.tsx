/**
 * Wind-Responsive Hair Field - "Flag in Wind" behavior
 * 
 * Purpose: Transform the sunburst hair into flowing, textile-like motion
 * Features: Perlin noise wind simulation, local curvature waves, emotional response
 * Design: Organic ripples like a flag caught in slow, responsive wind
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface WindHairFieldProps {
  radius: number;
  center: { x: number; y: number };
  dataLayers: any[];
  windSpeed?: number;
  windDirection?: number;
  emotionalIntensity?: number;
  className?: string;
}

interface HairFiber {
  angle: number;
  baseLength: number;
  segments: { x: number; y: number; curve: number }[];
  intensity: number;
  windResistance: number;
  emotionalResonance: number;
  color: string;
  opacity: number;
}

// Perlin noise approximation for organic wind patterns
class SimpleNoise {
  private p: number[];
  
  constructor() {
    this.p = [];
    for (let i = 0; i < 512; i++) {
      this.p[i] = Math.floor(Math.random() * 256);
    }
  }
  
  fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }
  
  grad(hash: number, x: number, y: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  
  noise(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = this.fade(x);
    const v = this.fade(y);
    
    const A = this.p[X] + Y;
    const AA = this.p[A & 255];
    const AB = this.p[(A + 1) & 255];
    const B = this.p[(X + 1) & 255] + Y;
    const BA = this.p[B & 255];
    const BB = this.p[(B + 1) & 255];
    
    return this.lerp(v, 
      this.lerp(u, this.grad(this.p[AA & 255], x, y), this.grad(this.p[BA & 255], x - 1, y)),
      this.lerp(u, this.grad(this.p[AB & 255], x, y - 1), this.grad(this.p[BB & 255], x - 1, y - 1))
    );
  }
}

export const WindHairField: React.FC<WindHairFieldProps> = ({
  radius,
  center,
  dataLayers,
  windSpeed = 0.5,
  windDirection = 0,
  emotionalIntensity = 0.5,
  className
}) => {
  const [time, setTime] = useState(0);
  const [noiseGenerator] = useState(() => new SimpleNoise());
  
  // Animation loop
  useEffect(() => {
    let animationId: number;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      setTime(elapsed * 0.001); // Convert to seconds
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Extract emotional data from layers
  const emotionalData = useMemo(() => {
    const emotions: number[] = [];
    
    if (dataLayers && Array.isArray(dataLayers)) {
      dataLayers.forEach(layer => {
        if (layer?.data && Array.isArray(layer.data)) {
          layer.data.forEach((point: any) => {
            if (point.mood) {
              emotions.push(point.mood.valence || 0.5);
            } else if (point.emotion) {
              emotions.push(point.emotion.intensity || 0.5);
            }
          });
        }
      });
    }
    
    // Generate emotional baseline if no data
    if (emotions.length === 0) {
      for (let i = 0; i < 360; i++) {
        emotions.push(0.3 + 0.4 * Math.sin((i / 360) * Math.PI * 2));
      }
    }
    
    return emotions;
  }, [dataLayers]);

  // Generate hair fibers with wind physics
  const hairFibers = useMemo(() => {
    const fiberCount = 480; // Dense but performance-conscious
    const fibers: HairFiber[] = [];
    
    for (let i = 0; i < fiberCount; i++) {
      const angle = (i / fiberCount) * Math.PI * 2;
      const emotionalIndex = Math.floor((i / fiberCount) * emotionalData.length);
      const localEmotion = emotionalData[emotionalIndex] || 0.5;
      
      // Base length influenced by emotional resonance
      const baseLength = 15 + localEmotion * 35 + emotionalIntensity * 20;
      
      // Wind resistance varies by fiber - some are more sensitive
      const windResistance = 0.3 + Math.random() * 0.7;
      
      // Color shifts based on emotional state
      const hue = 45 + localEmotion * 15; // Golden to warm orange
      const saturation = 40 + localEmotion * 40;
      const lightness = 65 + localEmotion * 25;
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      
      // Create segmented fiber for fluid motion
      const segmentCount = 5;
      const segments = [];
      for (let s = 0; s < segmentCount; s++) {
        const segmentRadius = radius + (s / (segmentCount - 1)) * baseLength;
        segments.push({
          x: center.x + Math.cos(angle) * segmentRadius,
          y: center.y + Math.sin(angle) * segmentRadius,
          curve: 0
        });
      }
      
      fibers.push({
        angle,
        baseLength,
        segments,
        intensity: localEmotion,
        windResistance,
        emotionalResonance: localEmotion,
        color,
        opacity: 0.3 + localEmotion * 0.5
      });
    }
    
    return fibers;
  }, [radius, center, emotionalData, emotionalIntensity]);

  // Calculate wind-influenced fiber paths
  const calculateWindPath = (fiber: HairFiber, fiberIndex: number): string => {
    const windPhase = time * windSpeed;
    const segments = [...fiber.segments];
    
    // Apply wind influence to each segment
    for (let i = 1; i < segments.length; i++) {
      const segmentRatio = i / (segments.length - 1);
      
      // Multi-octave noise for complex wind patterns
      const noiseX = fiber.angle * 2 + windPhase;
      const noiseY = segmentRatio * 3 + windPhase * 0.7;
      
      const windNoise1 = noiseGenerator.noise(noiseX, noiseY) * 0.5;
      const windNoise2 = noiseGenerator.noise(noiseX * 2, noiseY * 2) * 0.25;
      const windNoise3 = noiseGenerator.noise(noiseX * 4, noiseY * 4) * 0.125;
      const combinedNoise = windNoise1 + windNoise2 + windNoise3;
      
      // Wind direction influence
      const windInfluence = Math.cos(fiber.angle - windDirection) * windSpeed;
      
      // Emotional turbulence
      const emotionalTurbulence = fiber.emotionalResonance * emotionalIntensity * 0.3;
      
      // Calculate displacement
      const windDisplacement = combinedNoise * fiber.windResistance * 8 * segmentRatio;
      const directionalDisplacement = windInfluence * 6 * segmentRatio;
      const emotionalDisplacement = emotionalTurbulence * Math.sin(windPhase * 2 + fiber.angle) * 4;
      
      const totalDisplacement = windDisplacement + directionalDisplacement + emotionalDisplacement;
      
      // Apply displacement perpendicular to fiber direction
      const perpAngle = fiber.angle + Math.PI / 2;
      segments[i].x += Math.cos(perpAngle) * totalDisplacement;
      segments[i].y += Math.sin(perpAngle) * totalDisplacement;
      
      // Add local curvature waves
      const wavePhase = windPhase * 1.5 + fiberIndex * 0.02;
      const localWave = Math.sin(wavePhase + segmentRatio * Math.PI) * 2 * fiber.emotionalResonance;
      segments[i].x += Math.cos(perpAngle) * localWave;
      segments[i].y += Math.sin(perpAngle) * localWave;
    }
    
    // Generate smooth path through segments
    if (segments.length < 3) return '';
    
    let path = `M ${segments[0].x} ${segments[0].y}`;
    
    for (let i = 1; i < segments.length - 1; i++) {
      const curr = segments[i];
      const next = segments[i + 1];
      const controlX = curr.x + (next.x - curr.x) * 0.3;
      const controlY = curr.y + (next.y - curr.y) * 0.3;
      
      path += ` Q ${controlX} ${controlY} ${next.x} ${next.y}`;
    }
    
    return path;
  };

  return (
    <motion.g 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 4,
        ease: [0.23, 1, 0.32, 1] // Dramatic ease-out
      }}
    >
      <defs>
        {/* Wind-responsive gradient */}
        <radialGradient id="windHairGradient">
          <stop offset="0%" stopColor="hsl(50, 60%, 70%)" stopOpacity="0.8" />
          <stop offset="70%" stopColor="hsl(45, 80%, 60%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(40, 70%, 50%)" stopOpacity="0.1" />
        </radialGradient>
        
        {/* Soft glow filter for organic feel */}
        <filter id="organicGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Render wind-responsive hair fibers */}
      {hairFibers.map((fiber, index) => {
        const path = calculateWindPath(fiber, index);
        const isHighEmotion = fiber.emotionalResonance > 0.7;
        
        return (
          <motion.path
            key={`wind-hair-${index}`}
            d={path}
            stroke={fiber.color}
            strokeWidth={isHighEmotion ? 1.2 : 0.7}
            strokeOpacity={fiber.opacity}
            fill="none"
            strokeLinecap="round"
            filter="url(#organicGlow)"
            animate={{
              strokeOpacity: [
                fiber.opacity * 0.6,
                fiber.opacity,
                fiber.opacity * 0.8
              ]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.005
            }}
          />
        );
      })}
      
      {/* Emotional surge markers */}
      {hairFibers
        .filter(f => f.emotionalResonance > 0.8)
        .map((fiber, index) => {
          const tipX = fiber.segments[fiber.segments.length - 1]?.x || center.x;
          const tipY = fiber.segments[fiber.segments.length - 1]?.y || center.y;
          
          return (
            <motion.circle
              key={`emotion-surge-${index}`}
              cx={tipX}
              cy={tipY}
              r="2"
              fill={fiber.color}
              opacity="0.6"
              animate={{
                r: [1.5, 3, 1.5],
                opacity: [0.4, 0.8, 0.4],
                scale: [0.8, 1.3, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1
              }}
            />
          );
        })}
    </motion.g>
  );
};
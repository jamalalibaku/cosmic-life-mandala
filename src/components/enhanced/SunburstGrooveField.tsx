/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SunburstGrooveFieldProps {
  radius: number;
  center: { x: number; y: number };
  dataLayers: any[];
  className?: string;
}

interface Filament {
  angle: number;
  baseLength: number;
  currentLength: number;
  intensity: number;
  curvature: number;
  color: string;
  opacity: number;
}

export const SunburstGrooveField: React.FC<SunburstGrooveFieldProps> = ({ 
  radius, 
  center, 
  dataLayers, 
  className 
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Generate 1440 filaments (one per minute of day) for ultra-dense field
  const filamentCount = 720; // Reduced for performance but still dense
  
  // Extract energy data from all layers to drive filament behavior
  const energyData = useMemo(() => {
    const allDataPoints: number[] = [];
    
    dataLayers.forEach(layer => {
      if (layer.data && Array.isArray(layer.data)) {
        layer.data.forEach((point: any) => {
          let intensity = 0.5; // default
          
          if (point.intensity) intensity = point.intensity;
          else if (point.value) intensity = point.value;
          else if (point.mood) intensity = point.mood;
          else if (point.energy) intensity = point.energy;
          else if (typeof point === 'number') intensity = point;
          
          // Normalize to 0-1 range
          intensity = Math.max(0, Math.min(1, intensity));
          allDataPoints.push(intensity);
        });
      }
    });
    
    // If no data, create gentle baseline energy pattern
    if (allDataPoints.length === 0) {
      for (let i = 0; i < filamentCount; i++) {
        const baseEnergy = 0.3 + 0.2 * Math.sin((i / filamentCount) * Math.PI * 4);
        allDataPoints.push(baseEnergy);
      }
    }
    
    // Interpolate data to match filament count
    const interpolatedData: number[] = [];
    for (let i = 0; i < filamentCount; i++) {
      const sourceIndex = (i / filamentCount) * allDataPoints.length;
      const lowerIndex = Math.floor(sourceIndex);
      const upperIndex = Math.ceil(sourceIndex);
      const fraction = sourceIndex - lowerIndex;
      
      const lowerValue = allDataPoints[lowerIndex] || 0.3;
      const upperValue = allDataPoints[upperIndex] || lowerValue;
      const interpolatedValue = lowerValue + (upperValue - lowerValue) * fraction;
      
      interpolatedData.push(interpolatedValue);
    }
    
    return interpolatedData;
  }, [dataLayers, filamentCount]);

  // Generate filament array with groove physics
  const filaments = useMemo(() => {
    const filaments: Filament[] = [];
    
    for (let i = 0; i < filamentCount; i++) {
      const angle = (i / filamentCount) * Math.PI * 2;
      const baseIntensity = energyData[i] || 0.3;
      
      // Add neighboring influence for groove effect
      const leftNeighbor = energyData[(i - 1 + filamentCount) % filamentCount] || baseIntensity;
      const rightNeighbor = energyData[(i + 1) % filamentCount] || baseIntensity;
      const neighborInfluence = (leftNeighbor + rightNeighbor) * 0.1;
      
      const finalIntensity = Math.min(1, baseIntensity + neighborInfluence);
      
      // Calculate length based on intensity
      const baseLength = 20 + finalIntensity * 40; // 20-60px range
      
      // Calculate curvature - high intensity filaments start to bend
      const curvature = finalIntensity > 0.7 ? (finalIntensity - 0.7) * 2 : 0;
      
      // Color shifts from golden to white based on intensity
      const hue = 45; // Golden base
      const saturation = Math.max(20, 70 - finalIntensity * 30);
      const lightness = 60 + finalIntensity * 30;
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      
      filaments.push({
        angle,
        baseLength,
        currentLength: baseLength,
        intensity: finalIntensity,
        curvature,
        color,
        opacity: 0.4 + finalIntensity * 0.4
      });
    }
    
    return filaments;
  }, [energyData, filamentCount]);

  // Animation loop for groove dynamics
  useEffect(() => {
    let animationId: number;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const phase = (elapsed * 0.0008) % (Math.PI * 2); // 8-second cycle
      setAnimationPhase(phase);
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Generate dynamic filament paths with groove curvature
  const generateFilamentPath = (filament: Filament, index: number): string => {
    const { angle, baseLength, curvature, intensity } = filament;
    
    // Add breathing animation
    const breathingScale = 1 + 0.1 * Math.sin(animationPhase + index * 0.01);
    const dynamicLength = baseLength * breathingScale;
    
    // Start point at mandala edge
    const startX = center.x + Math.cos(angle) * radius;
    const startY = center.y + Math.sin(angle) * radius;
    
    if (curvature < 0.1) {
      // Straight filament
      const endX = center.x + Math.cos(angle) * (radius + dynamicLength);
      const endY = center.y + Math.sin(angle) * (radius + dynamicLength);
      
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    } else {
      // Curved filament with groove attraction
      const midLength = dynamicLength * 0.6;
      const endLength = dynamicLength;
      
      // Add wave-like curvature influenced by neighbors
      const waveOffset = curvature * 15 * Math.sin(animationPhase * 2 + angle * 8);
      
      const midX = center.x + Math.cos(angle) * (radius + midLength) + Math.cos(angle + Math.PI/2) * waveOffset;
      const midY = center.y + Math.sin(angle) * (radius + midLength) + Math.sin(angle + Math.PI/2) * waveOffset;
      
      const endX = center.x + Math.cos(angle) * (radius + endLength);
      const endY = center.y + Math.sin(angle) * (radius + endLength);
      
      return `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
    }
  };

  return (
    <motion.g 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3 }}
    >
      <defs>
        {/* Gradient for filament glow effect */}
        <linearGradient id="filamentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(45, 70%, 60%)" stopOpacity={0.2} />
          <stop offset="50%" stopColor="hsl(45, 80%, 80%)" stopOpacity={0.8} />
          <stop offset="100%" stopColor="hsl(50, 90%, 90%)" stopOpacity={0.1} />
        </linearGradient>
        
        {/* Intense glow filter for high-energy filaments */}
        <filter id="sunburstGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Plasma glow for curved filaments */}
        <filter id="plasmaGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feColorMatrix type="matrix" values="1.2 0 0 0 0  0 1.1 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Render all filaments */}
      {filaments.map((filament, index) => {
        const path = generateFilamentPath(filament, index);
        const isHighEnergy = filament.intensity > 0.7;
        const isCurved = filament.curvature > 0.1;
        
        return (
          <motion.path
            key={`filament-${index}`}
            d={path}
            stroke={filament.color}
            strokeWidth={isHighEnergy ? 1.5 : 0.8}
            strokeOpacity={filament.opacity}
            fill="none"
            strokeLinecap="round"
            filter={isCurved ? "url(#plasmaGlow)" : "url(#sunburstGlow)"}
            animate={{
              strokeOpacity: [
                filament.opacity * 0.7, 
                filament.opacity, 
                filament.opacity * 0.7
              ],
              strokeWidth: isHighEnergy ? [1.5, 2, 1.5] : [0.8, 1, 0.8]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.01
            }}
          />
        );
      })}

      {/* Additional plasma corona effects for very high energy regions */}
      {filaments
        .filter(f => f.intensity > 0.85)
        .map((filament, index) => {
          const angle = filament.angle;
          const coronaRadius = radius + filament.baseLength * 1.2;
          const coronaX = center.x + Math.cos(angle) * coronaRadius;
          const coronaY = center.y + Math.sin(angle) * coronaRadius;
          
          return (
            <motion.circle
              key={`corona-${index}`}
              cx={coronaX}
              cy={coronaY}
              r={3}
              fill="hsl(50, 90%, 85%)"
              opacity={0.3}
              filter="url(#plasmaGlow)"
              animate={{
                r: [2, 4, 2],
                opacity: [0.3, 0.6, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2
              }}
            />
          );
        })}
    </motion.g>
  );
};
/**
 * Fibrous Ring Layer - Transforms data into organic, thread-like textures
 * Each data segment becomes a bundle of delicate, shimmering threads
 * Creating a painterly, alive visualization of life's woven experiences
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FibrousThread {
  id: string;
  startAngle: number;
  endAngle: number;
  startRadius: number;
  endRadius: number;
  color: string;
  opacity: number;
  thickness: number;
  curvature: number;
  shimmerPhase: number;
}

interface FibrousRingLayerProps {
  radius: number;
  center: { x: number; y: number };
  data: any[];
  layerType: 'sleep' | 'mood' | 'weather' | 'mobility' | 'plans' | 'moon' | 'places';
  baseColor: string;
  thickness?: number;
  threadDensity?: number;
  className?: string;
}

export const FibrousRingLayer: React.FC<FibrousRingLayerProps> = ({
  radius,
  center,
  data,
  layerType,
  baseColor,
  thickness = 8,
  threadDensity = 12,
  className = ''
}) => {
  // Generate organic thread bundles from data
  const threads = useMemo(() => {
    const generatedThreads: FibrousThread[] = [];
    
    data.forEach((dataPoint, index) => {
      const segmentAngle = (2 * Math.PI) / data.length;
      const baseAngle = index * segmentAngle;
      
      // Extract intensity/value from different data types
      let intensity = 0.5;
      if (layerType === 'sleep') {
        intensity = dataPoint.intensity || dataPoint.duration || 0.3;
      } else if (layerType === 'mood') {
        intensity = dataPoint.mood || dataPoint.value || 0.5;
      } else if (layerType === 'weather') {
        intensity = (dataPoint.temperature || 20) / 40; // Normalize temperature
      } else {
        intensity = dataPoint.intensity || dataPoint.value || Math.random() * 0.5 + 0.3;
      }
      
      // Create thread bundle for this data segment
      const threadsInBundle = Math.floor(threadDensity * intensity);
      
      for (let threadIndex = 0; threadIndex < threadsInBundle; threadIndex++) {
        const threadId = `${layerType}-${index}-thread-${threadIndex}`;
        
        // Organic variation within the segment
        const angleSpread = segmentAngle * 0.8; // Don't fill entire segment
        const angleOffset = (segmentAngle - angleSpread) / 2;
        const threadAngleStart = baseAngle + angleOffset + (threadIndex / threadsInBundle) * angleSpread;
        
        // Subtle randomization for organic feel
        const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.2;
        const startAngle = threadAngleStart + randomOffset;
        const endAngle = startAngle + segmentAngle * 0.15 * (0.8 + Math.random() * 0.4);
        
        // Radius variation for fibrous texture
        const radiusVariation = thickness * (0.7 + Math.random() * 0.6);
        const startRadius = radius - radiusVariation;
        const endRadius = radius + radiusVariation;
        
        // Color variations based on data and thread position
        const colorVariations = getColorVariations(baseColor, layerType, intensity, threadIndex);
        
        generatedThreads.push({
          id: threadId,
          startAngle,
          endAngle,
          startRadius,
          endRadius,
          color: colorVariations.color,
          opacity: colorVariations.opacity * intensity,
          thickness: 0.8 + Math.random() * 0.6,
          curvature: (Math.random() - 0.5) * 0.3,
          shimmerPhase: Math.random() * Math.PI * 2
        });
      }
    });
    
    return generatedThreads;
  }, [data, radius, layerType, baseColor, thickness, threadDensity]);

  // Generate SVG path for each fibrous thread
  const generateThreadPath = (thread: FibrousThread): string => {
    const { startAngle, endAngle, startRadius, endRadius, curvature } = thread;
    
    // Start point
    const x1 = center.x + Math.cos(startAngle) * startRadius;
    const y1 = center.y + Math.sin(startAngle) * startRadius;
    
    // End point
    const x2 = center.x + Math.cos(endAngle) * endRadius;
    const y2 = center.y + Math.sin(endAngle) * endRadius;
    
    // Control point for organic curve
    const midAngle = (startAngle + endAngle) / 2;
    const midRadius = (startRadius + endRadius) / 2 + curvature * thickness;
    const cx = center.x + Math.cos(midAngle) * midRadius;
    const cy = center.y + Math.sin(midAngle) * midRadius;
    
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  return (
    <motion.g
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <defs>
        {/* Fibrous glow filter */}
        <filter id={`fibrous-glow-${layerType}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="softGlow"/>
          <feGaussianBlur stdDeviation="0.5" result="sharpGlow"/>
          <feMerge>
            <feMergeNode in="softGlow"/>
            <feMergeNode in="sharpGlow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Shimmer gradient */}
        <linearGradient id={`shimmer-gradient-${layerType}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={baseColor} stopOpacity={0.3} />
          <stop offset="50%" stopColor={baseColor} stopOpacity={0.8} />
          <stop offset="100%" stopColor={baseColor} stopOpacity={0.3} />
        </linearGradient>
      </defs>

      {/* Render each fibrous thread */}
      {threads.map((thread) => (
        <motion.path
          key={thread.id}
          d={generateThreadPath(thread)}
          stroke={thread.color}
          strokeWidth={thread.thickness}
          strokeLinecap="round"
          fill="none"
          opacity={thread.opacity}
          filter={`url(#fibrous-glow-${layerType})`}
          animate={{
            opacity: [thread.opacity * 0.7, thread.opacity, thread.opacity * 0.7],
            strokeWidth: [thread.thickness * 0.8, thread.thickness, thread.thickness * 0.8]
          }}
          transition={{
            duration: 3 + Math.sin(thread.shimmerPhase) * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: thread.shimmerPhase
          }}
          style={{
            filter: `drop-shadow(0 0 ${thread.thickness * 0.5}px ${thread.color}40)`
          }}
        />
      ))}
      
      {/* Occasional sparkle effects for living texture */}
      {threads.filter((_, index) => index % 8 === 0).map((thread) => {
        const sparkleAngle = (thread.startAngle + thread.endAngle) / 2;
        const sparkleRadius = (thread.startRadius + thread.endRadius) / 2;
        const sparkleX = center.x + Math.cos(sparkleAngle) * sparkleRadius;
        const sparkleY = center.y + Math.sin(sparkleAngle) * sparkleRadius;
        
        return (
          <motion.circle
            key={`sparkle-${thread.id}`}
            cx={sparkleX}
            cy={sparkleY}
            r={1}
            fill={thread.color}
            opacity={0}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 4
            }}
          />
        );
      })}
    </motion.g>
  );
};

// Helper function to generate color variations based on layer type and data
function getColorVariations(
  baseColor: string, 
  layerType: string, 
  intensity: number, 
  threadIndex: number
): { color: string; opacity: number } {
  const hue = extractHue(baseColor);
  const saturation = 70 + intensity * 20;
  const lightness = 50 + intensity * 30;
  
  // Layer-specific color characteristics
  switch (layerType) {
    case 'sleep':
      // Deep blues to soft purples for sleep
      const sleepHue = (hue + (threadIndex % 3) * 15 - 15) % 360;
      return {
        color: `hsl(${sleepHue} ${saturation}% ${lightness + 10}%)`,
        opacity: 0.6 + intensity * 0.4
      };
      
    case 'mood':
      // Warm spectrum for emotions
      const moodHue = (hue + (threadIndex % 5) * 20 - 40) % 360;
      return {
        color: `hsl(${moodHue} ${saturation + 10}% ${lightness}%)`,
        opacity: 0.7 + intensity * 0.3
      };
      
    case 'weather':
      // Natural sky tones
      const weatherHue = (hue + (threadIndex % 4) * 10 - 20) % 360;
      return {
        color: `hsl(${weatherHue} ${saturation - 10}% ${lightness + 15}%)`,
        opacity: 0.5 + intensity * 0.5
      };
      
    default:
      // Gentle variations for other layers
      const defaultHue = (hue + (threadIndex % 3) * 10 - 10) % 360;
      return {
        color: `hsl(${defaultHue} ${saturation}% ${lightness}%)`,
        opacity: 0.6 + intensity * 0.4
      };
  }
}

// Extract hue value from HSL color string
function extractHue(color: string): number {
  const hslMatch = color.match(/hsl\((\d+)/);
  return hslMatch ? parseInt(hslMatch[1]) : 45; // Default to warm yellow
}
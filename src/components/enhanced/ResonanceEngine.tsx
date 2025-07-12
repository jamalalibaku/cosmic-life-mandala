/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * 
 * Resonance Engine - Heart of the NOW RECORDER system
 * Detects intersections between the NOW stylus and data layers, 
 * creating ripples with unique signatures for each layer type.
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  angle: number;
  intensity: number;
  type: 'sleep' | 'mood' | 'weather' | 'mobility' | 'plans';
  radius: number;
}

interface ResonanceEngineProps {
  nowAngle: number;
  dataLayers: Array<{
    name: string;
    data: any[];
    radius: number;
    layerType: string;
  }>;
  centerX: number;
  centerY: number;
  recorderRadius: number;
}

interface RippleProps {
  centerX: number;
  centerY: number;
  angle: number;
  intensity: number;
  type: 'sleep' | 'mood' | 'weather' | 'mobility' | 'plans';
  lineIndex: number;
}

const RippleVisual: React.FC<RippleProps> = ({ centerX, centerY, angle, intensity, type, lineIndex }) => {
  const radians = (angle * Math.PI) / 180;
  const baseRadius = 280 + lineIndex * 5; // Stagger ripples by line
  
  // Calculate ripple position
  const rippleX = centerX + Math.cos(radians) * baseRadius;
  const rippleY = centerY + Math.sin(radians) * baseRadius;
  
  // Adria's signature styles for each layer type
  const getRippleStyle = () => {
    switch (type) {
      case 'sleep':
        // "low, slow, deep hum" - soft, wide, pulsing wave of indigo and deep violet
        return {
          colors: ['hsl(240, 60%, 40%)', 'hsl(260, 50%, 30%)', 'hsl(220, 70%, 50%)'],
          animation: 'hum',
          scale: intensity * 2.5 + 1,
          duration: 4 + intensity * 2,
        };
      
      case 'mood':
        // "undulating, breathing pulse" - swells and recedes, colored with emotion
        return {
          colors: ['hsl(45, 70%, 60%)', 'hsl(200, 60%, 70%)', 'hsl(320, 50%, 65%)'],
          animation: 'pulse',
          scale: intensity * 2 + 0.8,
          duration: 3 + intensity * 1.5,
        };
      
      case 'weather':
        // "sharp, crystalline crackle" - fast, shimmering, electric burst
        return {
          colors: ['hsl(180, 80%, 70%)', 'hsl(200, 90%, 80%)', 'hsl(160, 70%, 75%)'],
          animation: 'crackle',
          scale: intensity * 1.5 + 0.5,
          duration: 1.5 + intensity * 0.8,
        };
      
      case 'mobility':
      case 'plans':
        // "clean, directional dash" - sharp, focused trail like a comet's tail
        return {
          colors: ['hsl(140, 60%, 60%)', 'hsl(260, 50%, 70%)', 'hsl(30, 60%, 65%)'],
          animation: 'dash',
          scale: intensity * 1.8 + 0.6,
          duration: 2 + intensity * 1.2,
        };
      
      default:
        return {
          colors: ['hsl(0, 0%, 80%)'],
          animation: 'pulse',
          scale: intensity + 0.5,
          duration: 2,
        };
    }
  };
  
  const style = getRippleStyle();
  
  // Animation variants for each signature type
  const getAnimationVariants = () => {
    const baseScale = style.scale;
    const duration = style.duration;
    
    switch (style.animation) {
      case 'hum':
        return {
          initial: { scale: 0, opacity: 0 },
          animate: {
            scale: [0, baseScale * 0.7, baseScale, baseScale * 0.8, 0],
            opacity: [0, 0.6, 0.8, 0.4, 0],
          },
          transition: {
            duration,
            ease: "easeInOut"
          }
        };
      
      case 'pulse':
        return {
          initial: { scale: 0, opacity: 0 },
          animate: {
            scale: [0, baseScale * 1.2, baseScale * 0.6, baseScale, 0],
            opacity: [0, 0.9, 0.7, 0.5, 0],
          },
          transition: {
            duration,
            ease: "easeInOut"
          }
        };
      
      case 'crackle':
        return {
          initial: { scale: 0, opacity: 0 },
          animate: {
            scale: [0, baseScale * 1.5, baseScale * 0.3, baseScale * 1.1, 0],
            opacity: [0, 1, 0.8, 0.6, 0],
          },
          transition: {
            duration,
            ease: "anticipate"
          }
        };
      
      case 'dash':
        return {
          initial: { scale: 0, opacity: 0, x: 0 },
          animate: {
            scale: [0, baseScale, baseScale * 0.8, 0],
            opacity: [0, 0.9, 0.6, 0],
            x: [0, Math.cos(radians) * 20, Math.cos(radians) * 40, Math.cos(radians) * 60],
            y: [0, Math.sin(radians) * 20, Math.sin(radians) * 40, Math.sin(radians) * 60],
          },
          transition: {
            duration,
            ease: "easeOut"
          }
        };
      
      default:
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: baseScale, opacity: 0.6 },
          transition: { duration }
        };
    }
  };
  
  const variants = getAnimationVariants();
  
  return (
    <g>
      {/* Multi-layered ripple for depth */}
      {style.colors.map((color, index) => (
        <motion.circle
          key={`ripple-${lineIndex}-${index}`}
          cx={rippleX}
          cy={rippleY}
          r={8 + index * 4}
          fill="none"
          stroke={color}
          strokeWidth={Math.max(1, 3 - index)}
          opacity={0}
          initial={variants.initial}
          animate={variants.animate}
          transition={{
            duration: variants.transition.duration,
            delay: index * 0.1, // Stagger layers
          }}
          style={{
            filter: `blur(${index}px) drop-shadow(0 0 ${4 + index * 2}px ${color}50)`,
          }}
        />
      ))}
      
      {/* Core ripple */}
      <motion.circle
        cx={rippleX}
        cy={rippleY}
        r={4}
        fill={style.colors[0]}
        opacity={0}
        initial={variants.initial}
        animate={variants.animate}
        transition={{ duration: variants.transition.duration }}
        style={{
          filter: `drop-shadow(0 0 8px ${style.colors[0]}80)`,
        }}
      />
    </g>
  );
};

export const ResonanceEngine: React.FC<ResonanceEngineProps> = ({
  nowAngle,
  dataLayers,
  centerX,
  centerY,
  recorderRadius
}) => {
  // Calculate intersections for all 24 recorder lines
  const intersections = useMemo(() => {
    const results: Array<{
      lineIndex: number;
      angle: number;
      dataPoint: DataPoint;
      intensity: number;
    }> = [];
    
    // Check each of the 24 recorder lines
    for (let i = 0; i < 24; i++) {
      const lineAngle = nowAngle + (i * 15); // 360/24 = 15 degrees per line
      const normalizedLineAngle = ((lineAngle % 360) + 360) % 360;
      
      // Check intersections with each data layer
      for (const layer of dataLayers) {
        if (!layer.data || layer.data.length === 0) continue;
        
        // Simple intersection detection based on angular proximity
        for (const dataItem of layer.data) {
          if (!dataItem.date) continue;
          
          // Calculate data point angle based on time
          let dataAngle = 0;
          if (dataItem.date instanceof Date) {
            const hours = dataItem.date.getHours();
            const minutes = dataItem.date.getMinutes();
            dataAngle = ((hours * 60 + minutes) / 1440) * 360;
          }
          
          // Check if line intersects with data point (within 8 degrees)
          const angleDiff = Math.abs(normalizedLineAngle - dataAngle);
          const adjustedDiff = Math.min(angleDiff, 360 - angleDiff);
          
          if (adjustedDiff <= 8) {
            // Calculate intersection intensity based on proximity and data intensity
            const proximityFactor = 1 - (adjustedDiff / 8);
            const dataIntensity = dataItem.intensity || dataItem.valence || dataItem.energy || 0.5;
            const finalIntensity = proximityFactor * dataIntensity;
            
            if (finalIntensity > 0.1) { // Threshold for meaningful intersection
              results.push({
                lineIndex: i,
                angle: lineAngle,
                dataPoint: {
                  angle: dataAngle,
                  intensity: dataIntensity,
                  type: layer.layerType as any || 'mood',
                  radius: layer.radius
                },
                intensity: finalIntensity
              });
            }
          }
        }
      }
    }
    
    return results;
  }, [nowAngle, dataLayers]);
  
  // Create interconnected ripple system
  const rippleSystem = useMemo(() => {
    const ripples: JSX.Element[] = [];
    
    intersections.forEach((intersection, index) => {
      // Add primary ripple
      ripples.push(
        <RippleVisual
          key={`primary-${index}`}
          centerX={centerX}
          centerY={centerY}
          angle={intersection.angle}
          intensity={intersection.intensity}
          type={intersection.dataPoint.type}
          lineIndex={intersection.lineIndex}
        />
      );
      
      // Add neighboring ripples for interconnection (gravity system)
      const neighbors = [-1, 1].map(offset => intersection.lineIndex + offset)
        .filter(neighborIndex => neighborIndex >= 0 && neighborIndex < 24);
      
      neighbors.forEach(neighborIndex => {
        const neighborAngle = nowAngle + (neighborIndex * 15);
        const neighborIntensity = intersection.intensity * 0.3; // Reduced for neighbors
        
        if (neighborIntensity > 0.05) {
          ripples.push(
            <RippleVisual
              key={`neighbor-${index}-${neighborIndex}`}
              centerX={centerX}
              centerY={centerY}
              angle={neighborAngle}
              intensity={neighborIntensity}
              type={intersection.dataPoint.type}
              lineIndex={neighborIndex}
            />
          );
        }
      });
    });
    
    return ripples;
  }, [intersections, centerX, centerY, nowAngle]);
  
  return (
    <g className="resonance-engine">
      {rippleSystem}
    </g>
  );
};
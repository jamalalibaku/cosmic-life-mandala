/**
 * Sun Core Mesh - Data-reactive multidimensional texture grid
 * Creates a living light field where data values shape intersecting grids
 */

import { motion } from '@/components/ui/NoAnimationMotion';
import { useMemo, useRef, useEffect } from 'react';
import { useMouseProximity } from '@/hooks/useMouseProximity';

interface SunCoreMeshProps {
  centerX: number;
  centerY: number;
  radius: number;
  verticalData: number[]; // Data stream A (temperature, steps, etc.)
  horizontalData: number[]; // Data stream B (mood, sleep quality, etc.)
  intensity?: number;
  isActive?: boolean;
}

interface WaveParams {
  amplitude: number;
  frequency: number;
  phase: number;
  opacity: number;
}

export const SunCoreMesh: React.FC<SunCoreMeshProps> = ({
  centerX,
  centerY,
  radius,
  verticalData,
  horizontalData,
  intensity = 0.7,
  isActive = true
}) => {
  const meshRef = useRef<SVGGElement>(null);
  const { proximity, angle } = useMouseProximity({ x: centerX, y: centerY });
  
  // Generate wave parameters from data
  const verticalWaves = useMemo(() => {
    return verticalData.slice(0, 12).map((value, i): WaveParams => ({
      amplitude: radius * 0.3 * (0.5 + value * 0.5),
      frequency: 0.02 + value * 0.01,
      phase: i * 0.5 + Math.floor(Date.now() / 1000),
      opacity: 0.1 + value * 0.4
    }));
  }, [verticalData, radius]);

  const horizontalWaves = useMemo(() => {
    return horizontalData.slice(0, 12).map((value, i): WaveParams => ({
      amplitude: radius * 0.25 * (0.5 + value * 0.5),
      frequency: 0.015 + value * 0.008,
      phase: i * 0.4 + Math.floor(Date.now() / 1000) * 0.8,
      opacity: 0.08 + value * 0.35
    }));
  }, [horizontalData, radius]);

  // Generate curved line path
  const generateCurvedPath = (
    type: 'vertical' | 'horizontal',
    index: number,
    wave: WaveParams
  ): string => {
    const points: string[] = [];
    const steps = 40;
    const time = Math.floor(Date.now() / 1000);
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      let x: number, y: number;
      
      if (type === 'vertical') {
        // Vertical lines with horizontal wave distortion
        const baseX = centerX + (index - 5.5) * (radius * 0.15);
        const waveOffset = Math.sin(t * Math.PI * 4 + wave.phase + time) * wave.amplitude * 0.3;
        x = baseX + waveOffset;
        y = centerY - radius * 0.6 + t * radius * 1.2;
      } else {
        // Horizontal lines with vertical wave distortion
        const baseY = centerY + (index - 5.5) * (radius * 0.15);
        const waveOffset = Math.sin(t * Math.PI * 3 + wave.phase + time * 0.8) * wave.amplitude * 0.25;
        x = centerX - radius * 0.6 + t * radius * 1.2;
        y = baseY + waveOffset;
      }
      
      points.push(i === 0 ? `M${x},${y}` : `L${x},${y}`);
    }
    
    return points.join(' ');
  };

  // Generate intersection sparkles
  const sparklePoints = useMemo(() => {
    const sparkles: Array<{x: number, y: number, intensity: number}> = [];
    const time = Math.floor(Date.now() / 1000) * 2;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time;
      const sparkleRadius = radius * (0.2 + Math.sin(time + i) * 0.1);
      const x = centerX + Math.cos(angle) * sparkleRadius;
      const y = centerY + Math.sin(angle) * sparkleRadius;
      const intensity = 0.3 + Math.sin(time * 2 + i) * 0.4;
      
      sparkles.push({ x, y, intensity });
    }
    
    return sparkles;
  }, [centerX, centerY, radius]);

  if (!isActive) return null;

  return (
    <g ref={meshRef} className="sun-core-mesh">
      {/* Radial glow mask */}
      <defs>
        <radialGradient id="sunCoreMask" cx="50%" cy="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
          <stop offset="50%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        
        <filter id="sunCoreGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Central energy field */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.15}
        fill="url(#sunCoreMask)"
        opacity={0.3}
        animate={{
          r: [radius * 0.15, radius * 0.18, radius * 0.15],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut"
        }}
      />

      {/* Vertical grid lines with luminescent trails */}
      {verticalWaves.map((wave, i) => (
        <g key={`vertical-group-${i}`}>
          {/* Rotating trail effect */}
          <motion.path
            d={generateCurvedPath('vertical', i, wave)}
            stroke="hsl(var(--primary))"
            strokeWidth={1.5 + proximity * 0.8}
            strokeOpacity={0.1}
            fill="none"
            filter="blur(3px) drop-shadow(0 0 8px hsl(var(--primary)))"
            animate={{
              rotate: 360,
              strokeOpacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              rotate: {
                duration: 20 + i * 3,
                repeat: Infinity,
                ease: "linear"
              },
              strokeOpacity: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }
            }}
          />
          {/* Main line */}
          <motion.path
            d={generateCurvedPath('vertical', i, wave)}
            stroke="hsl(var(--primary))"
            strokeWidth={0.5 + proximity * 0.5}
            strokeOpacity={wave.opacity * intensity * 0.6}
            fill="none"
            filter="blur(1px) url(#sunCoreGlow)"
            animate={{
              strokeOpacity: [
                wave.opacity * intensity * 0.6,
                wave.opacity * intensity * 1.0,
                wave.opacity * intensity * 0.6
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + i * 0.2,
              ease: "easeInOut"
            }}
          />
        </g>
      ))}

      {/* Horizontal grid lines */}
      {horizontalWaves.map((wave, i) => (
        <motion.path
          key={`horizontal-${i}`}
          d={generateCurvedPath('horizontal', i, wave)}
          stroke="hsl(var(--secondary))"
          strokeWidth={0.5 + proximity * 0.5}
          strokeOpacity={wave.opacity * intensity * 0.8}
          fill="none"
          filter="url(#sunCoreGlow)"
          animate={{
            strokeOpacity: [
              wave.opacity * intensity * 0.8,
              wave.opacity * intensity * 1.1,
              wave.opacity * intensity * 0.8
            ]
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5 + i * 0.15,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Intersection sparkles */}
      {sparklePoints.map((sparkle, i) => (
        <motion.circle
          key={`sparkle-${i}`}
          cx={sparkle.x}
          cy={sparkle.y}
          r={1}
          fill="hsl(var(--accent))"
          opacity={sparkle.intensity * proximity}
          animate={{
            r: [0.5, 2, 0.5],
            opacity: [
              sparkle.intensity * proximity,
              sparkle.intensity * proximity * 1.5,
              sparkle.intensity * proximity
            ]
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5 + i * 0.3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Tesla coil filaments on high intensity */}
      {intensity > 0.8 && (
        <>
          {Array.from({length: 6}).map((_, i) => {
            const filamentAngle = (i / 6) * Math.PI * 2;
            const x1 = centerX + Math.cos(filamentAngle) * radius * 0.1;
            const y1 = centerY + Math.sin(filamentAngle) * radius * 0.1;
            const x2 = centerX + Math.cos(filamentAngle) * radius * 0.4;
            const y2 = centerY + Math.sin(filamentAngle) * radius * 0.4;
            
            return (
              <motion.line
                key={`filament-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--primary))"
                strokeWidth={0.3}
                strokeOpacity={0.6}
                animate={{
                  strokeOpacity: [0.6, 0.9, 0.6],
                  strokeWidth: [0.3, 0.5, 0.3]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + i * 0.1,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </>
      )}
    </g>
  );
};
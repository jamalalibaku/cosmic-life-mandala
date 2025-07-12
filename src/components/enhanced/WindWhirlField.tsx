/**
 * Wind Whirl Field - Continuous flowing lines around the mandala
 * Replaces static north indicators with dynamic wind patterns
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface WindWhirlFieldProps {
  centerX: number;
  centerY: number;
  radius: number;
  className?: string;
}

// Mock data sources for wind patterns
const generateMockWindData = () => {
  const windLines = [];
  const numLines = 8; // Number of wind whirl lines
  
  for (let i = 0; i < numLines; i++) {
    const baseAngle = (i / numLines) * 360;
    const frequency = 0.5 + Math.random() * 2; // Random frequency 0.5-2.5
    const amplitude = 10 + Math.random() * 15; // Wave amplitude 10-25
    const thickness = 1 + Math.random() * 3; // Line thickness 1-4
    const speed = 0.5 + Math.random() * 1.5; // Rotation speed
    const gravity = thickness * 0.3; // Gravity based on thickness
    
    windLines.push({
      id: i,
      baseAngle,
      frequency,
      amplitude,
      thickness,
      speed,
      gravity,
      phase: Math.random() * Math.PI * 2
    });
  }
  
  return windLines;
};

export const WindWhirlField: React.FC<WindWhirlFieldProps> = ({
  centerX,
  centerY,
  radius,
  className = ""
}) => {
  const windData = useMemo(() => generateMockWindData(), []);
  
  // Generate path for each wind line with wave patterns and gravity effects
  const generateWindPath = (windLine: any, time: number) => {
    const points = [];
    const numPoints = 120; // Points around the circle
    
    for (let i = 0; i <= numPoints; i++) {
      const progress = i / numPoints;
      const angle = progress * Math.PI * 2;
      
      // Base position on circle
      const baseRadius = radius + 20; // Slightly outside main circle
      
      // Wave calculation with frequency and amplitude
      const waveOffset = Math.sin(angle * windLine.frequency + windLine.phase + time * windLine.speed) * windLine.amplitude;
      
      // Gravity effect from nearby thicker lines
      let gravityOffset = 0;
      windData.forEach(otherLine => {
        if (otherLine.id !== windLine.id) {
          const angleDiff = Math.abs(angle - (otherLine.baseAngle * Math.PI / 180));
          const distance = Math.min(angleDiff, Math.PI * 2 - angleDiff);
          if (distance < 1) { // Within influence range
            const influence = (1 - distance) * otherLine.gravity;
            gravityOffset += influence * Math.sin(angle * 2 + time * 0.5);
          }
        }
      });
      
      const finalRadius = baseRadius + waveOffset + gravityOffset;
      const x = centerX + finalRadius * Math.cos(angle);
      const y = centerY + finalRadius * Math.sin(angle);
      
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    
    // Close the path
    points.push('Z');
    return points.join(' ');
  };

  return (
    <g className={className}>
      {/* Wind whirl lines */}
      {windData.map((windLine, index) => (
        <motion.path
          key={windLine.id}
          d={generateWindPath(windLine, 0)}
          fill="none"
          stroke={`hsl(var(--primary) / ${0.3 + windLine.thickness * 0.1})`}
          strokeWidth={windLine.thickness}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.6 + windLine.thickness * 0.1}
          animate={{
            d: [
              generateWindPath(windLine, 0),
              generateWindPath(windLine, Math.PI),
              generateWindPath(windLine, Math.PI * 2)
            ]
          }}
          transition={{
            duration: 3 + windLine.speed,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            filter: `blur(${windLine.thickness > 2 ? 0.5 : 0}px)`,
            mixBlendMode: 'screen'
          }}
        />
      ))}
      
      {/* Gravity field visualization - thicker lines create visible distortion zones */}
      {windData
        .filter(line => line.thickness > 2.5)
        .map((heavyLine) => (
          <motion.circle
            key={`gravity-${heavyLine.id}`}
            cx={centerX + (radius + 30) * Math.cos(heavyLine.baseAngle * Math.PI / 180)}
            cy={centerY + (radius + 30) * Math.sin(heavyLine.baseAngle * Math.PI / 180)}
            r={heavyLine.gravity * 8}
            fill="none"
            stroke={`hsl(var(--accent) / 0.1)`}
            strokeWidth="1"
            strokeDasharray="2 4"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
          />
        ))}
      
      {/* Wind direction indicators - small arrows showing flow */}
      {windData.slice(0, 4).map((windLine, index) => {
        const arrowAngle = windLine.baseAngle * Math.PI / 180;
        const arrowX = centerX + (radius + 40) * Math.cos(arrowAngle);
        const arrowY = centerY + (radius + 40) * Math.sin(arrowAngle);
        
        return (
          <motion.g
            key={`arrow-${windLine.id}`}
            animate={{
              rotate: [0, 10, -10, 0],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2 + windLine.speed,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: `${arrowX}px ${arrowY}px` }}
          >
            <path
              d={`M ${arrowX - 4} ${arrowY} L ${arrowX + 4} ${arrowY} M ${arrowX + 2} ${arrowY - 2} L ${arrowX + 4} ${arrowY} L ${arrowX + 2} ${arrowY + 2}`}
              stroke={`hsl(var(--muted-foreground))`}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />
          </motion.g>
        );
      })}
    </g>
  );
};
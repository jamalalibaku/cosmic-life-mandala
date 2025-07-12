/**
 * Invisible Disco Ball - Subtle sparkle field for the cosmic mandala
 * Creates that "flickering" bedazzlement feeling throughout the visualization
 */

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useMouseProximity } from '@/hooks/useMouseProximity';

interface SparkleOrb {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  color: string;
  speed: number;
  phase: number;
}

interface InvisibleDiscoBallProps {
  centerX: number;
  centerY: number;
  radius: number;
  intensity: number;
  sparkleCount?: number;
  isActive?: boolean;
}

export const InvisibleDiscoBall: React.FC<InvisibleDiscoBallProps> = ({
  centerX,
  centerY,
  radius,
  intensity,
  sparkleCount = 20,
  isActive = true
}) => {
  const { proximity } = useMouseProximity({ x: centerX, y: centerY });
  
  // Generate constellation of sparkle orbs
  const sparkleOrbs = useMemo((): SparkleOrb[] => {
    const orbs: SparkleOrb[] = [];
    
    for (let i = 0; i < sparkleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      orbs.push({
        x,
        y,
        radius: 0.5 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.4,
        color: i % 4 === 0 ? 'white' :
               i % 4 === 1 ? 'hsl(var(--primary))' :
               i % 4 === 2 ? 'hsl(var(--secondary))' :
               'hsl(var(--accent))',
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2
      });
    }
    
    return orbs;
  }, [centerX, centerY, radius, sparkleCount]);

  if (!isActive) return null;

  return (
    <g className="invisible-disco-ball">
      {/* Main disco ball core - very subtle */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.1}
        fill="rgba(255,255,255,0.05)"
        animate={{
          opacity: [0.05, 0.15 + intensity * 0.1, 0.05],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Sparkle orb constellation */}
      {sparkleOrbs.map((orb, i) => (
        <motion.circle
          key={`sparkle-orb-${i}`}
          cx={orb.x}
          cy={orb.y}
          r={orb.radius}
          fill={orb.color}
          opacity={orb.opacity + proximity * 0.3}
          animate={{
            opacity: [
              orb.opacity,
              orb.opacity * (1.5 + intensity * 0.5),
              orb.opacity
            ],
            scale: [0.8, 1.2, 0.8],
            x: [
              orb.x,
              orb.x + Math.sin(orb.phase) * 5,
              orb.x
            ],
            y: [
              orb.y,
              orb.y + Math.cos(orb.phase) * 5,
              orb.y
            ]
          }}
          transition={{
            duration: 2 + orb.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1
          }}
        />
      ))}

      {/* Flicker field - ambient sparkle */}
      {Array.from({length: 12}).map((_, i) => {
        const flickerAngle = (i / 12) * Math.PI * 2;
        const flickerRadius = radius * (0.3 + Math.random() * 0.6);
        const flickerX = centerX + Math.cos(flickerAngle) * flickerRadius;
        const flickerY = centerY + Math.sin(flickerAngle) * flickerRadius;
        
        return (
          <motion.circle
            key={`flicker-${i}`}
            cx={flickerX}
            cy={flickerY}
            r={0.3}
            fill="white"
            opacity={0.1}
            animate={{
              opacity: [0.1, 0.4 + intensity * 0.2, 0.1],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          />
        );
      })}

      {/* Bedazzlement rays */}
      {Array.from({length: 6}).map((_, i) => {
        const rayAngle = (i / 6) * Math.PI * 2;
        const rayLength = radius * 0.8;
        const x1 = centerX + Math.cos(rayAngle) * (radius * 0.15);
        const y1 = centerY + Math.sin(rayAngle) * (radius * 0.15);
        const x2 = centerX + Math.cos(rayAngle) * rayLength;
        const y2 = centerY + Math.sin(rayAngle) * rayLength;
        
        return (
          <motion.line
            key={`ray-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={0.5}
            animate={{
              strokeOpacity: [0.1, 0.3 + intensity * 0.2, 0.1],
              strokeWidth: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        );
      })}
    </g>
  );
};
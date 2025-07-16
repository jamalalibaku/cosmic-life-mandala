/**
 * Celestial Glyph - Data point visualization
 * Simple geometric representation for data points
 */

import { motion } from '@/components/ui/NoAnimationMotion';
import { useMemo } from 'react';
import { useMouseProximity } from '@/hooks/useMouseProximity';

interface CelestialGlyphProps {
  x: number;
  y: number;
  size: number;
  intensity: number;
  type: 'data' | 'insight' | 'memory' | 'essence';
  isActive?: boolean;
  data?: any;
}

interface SparklePoint {
  x: number;
  y: number;
  opacity: number;
  delay: number;
  scale: number;
}

export const CelestialGlyph: React.FC<CelestialGlyphProps> = ({
  x,
  y,
  size,
  intensity,
  type,
  isActive = true,
  data
}) => {
  const { proximity } = useMouseProximity({ x, y });
  
  // Generate sparkle constellation around the glyph
  const sparklePoints = useMemo((): SparklePoint[] => {
    const points: SparklePoint[] = [];
    const sparkleCount = Math.floor(4 + intensity * 8);
    
    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i / sparkleCount) * Math.PI * 2;
      const radius = size * (0.6 + Math.random() * 0.8);
      const sparkleX = Math.cos(angle) * radius;
      const sparkleY = Math.sin(angle) * radius;
      
      points.push({
        x: sparkleX,
        y: sparkleY,
        opacity: 0.3 + Math.random() * 0.4,
        delay: Math.random() * 2,
        scale: 0.5 + Math.random() * 0.5
      });
    }
    
    return points;
  }, [size, intensity]);

  // Dynamic glyph colors based on type
  const glyphColors = {
    data: 'hsl(var(--primary))',
    insight: 'hsl(var(--secondary))', 
    memory: 'hsl(var(--accent))',
    essence: 'hsl(var(--muted-foreground))'
  };

  // Simple glow effect
  const shimmerVariants = {
    idle: {
      scale: 1,
      opacity: 0.7,
      rotate: 0,
      filter: 'brightness(1) saturate(1)'
    },
    sparkle: {
      scale: [1, 1.15, 1],
      opacity: [0.7, 1, 0.7],
      rotate: [0, 5, 0],
      filter: [
        'brightness(1) saturate(1)',
        'brightness(1.3) saturate(1.4)',
        'brightness(1) saturate(1)'
      ]
    }
  };

  if (!isActive) return null;

  return (
    <g className="celestial-glyph">
      {/* Luminescent trail system */}
      {Array.from({length: 8}).map((_, i) => (
        <motion.circle
          key={`trail-${i}`}
          cx={x}
          cy={y}
          r={size * (1 + i * 0.1)}
          fill="none"
          stroke={glyphColors[type]}
          strokeWidth={0.3}
          opacity={0.1 - i * 0.012}
          filter="blur(1px) drop-shadow(0 0 4px currentColor)"
          animate={{
            rotate: 360,
            opacity: [0.1 - i * 0.012, 0.05 - i * 0.008, 0.1 - i * 0.012]
          }}
          transition={{
            rotate: {
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear"
            },
            opacity: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }
          }}
        />
      ))}

      {/* Main glyph core */}
      <motion.circle
        cx={x}
        cy={y}
        r={size}
        fill={glyphColors[type]}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={0.5}
        opacity={0.7}
        filter="blur(0.5px) drop-shadow(0 0 8px currentColor)"
        variants={shimmerVariants}
        initial="idle"
        animate={proximity > 0.3 ? "sparkle" : "idle"}
        transition={{
          duration: 1.5 + Math.random() * 0.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Hair groove rhythm - fibrous tendrils */}
      {Array.from({length: 6}).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const length = size * (1.5 + intensity * 0.8);
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;
        
        return (
          <motion.line
            key={`tendril-${i}`}
            x1={x}
            y1={y}
            x2={endX}
            y2={endY}
            stroke={glyphColors[type]}
            strokeWidth={0.3}
            strokeOpacity={0.4}
            animate={{
              strokeOpacity: [0.4, 0.7, 0.4],
              strokeWidth: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        );
      })}

      {/* Sparkle constellation */}
      {sparklePoints.map((sparkle, i) => (
        <motion.circle
          key={`sparkle-${i}`}
          cx={x + sparkle.x}
          cy={y + sparkle.y}
          r={1 * sparkle.scale}
          fill="white"
          opacity={sparkle.opacity}
          animate={{
            scale: [sparkle.scale, sparkle.scale * 1.5, sparkle.scale],
            opacity: [sparkle.opacity, sparkle.opacity * 1.8, sparkle.opacity]
          }}
          transition={{
            duration: 1.2 + sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: sparkle.delay
          }}
        />
      ))}

      {/* Dynamic energy ring that pulses with data intensity */}
      <motion.circle
        cx={x}
        cy={y}
        r={size * 1.8}
        fill="none"
        stroke={glyphColors[type]}
        strokeWidth={1}
        strokeOpacity={0.2}
        animate={{
          r: [size * 1.8, size * 2.2, size * 1.8],
          strokeOpacity: [0.2, 0.4 + intensity * 0.3, 0.2]
        }}
        transition={{
          duration: 3 + intensity,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Flicker field - subtle background sparkle */}
      {Array.from({length: 3}).map((_, i) => {
        const flickerRadius = size * (2.5 + i * 0.8);
        const flickerAngle = (Math.floor(Date.now() / 1000) + i * 0.7) % (Math.PI * 2);
        const flickerX = x + Math.cos(flickerAngle) * flickerRadius;
        const flickerY = y + Math.sin(flickerAngle) * flickerRadius;
        
        return (
          <motion.circle
            key={`flicker-${i}`}
            cx={flickerX}
            cy={flickerY}
            r={0.5}
            fill="white"
            opacity={0.1 + proximity * 0.2}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4
            }}
          />
        );
      })}
    </g>
  );
};
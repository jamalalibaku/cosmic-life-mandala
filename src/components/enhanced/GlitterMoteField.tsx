/**
 * Glitter Mote Field - 24-hour orbital decay system
 * Randomized shapes that spiral toward center, leaving boat-wake trails
 */

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface GlitterMote {
  id: number;
  shape: 'circle' | 'diamond' | 'star' | 'triangle' | 'square' | 'hexagon';
  startX: number;
  startY: number;
  startRadius: number;
  color: string;
  speed: number;
  hourOffset: number;
  trailPoints: { x: number; y: number; size: number; opacity: number }[];
}

interface GlitterMoteFieldProps {
  centerX: number;
  centerY: number;
  fieldRadius: number;
  moteCount?: number;
  currentHour?: number; // 0-23
  isActive?: boolean;
}

export const GlitterMoteField: React.FC<GlitterMoteFieldProps> = ({
  centerX,
  centerY,
  fieldRadius,
  moteCount = 30,
  currentHour = new Date().getHours(),
  isActive = true
}) => {
  
  // Generate glitter motes with randomized properties
  const glitterMotes = useMemo((): GlitterMote[] => {
    const motes: GlitterMote[] = [];
    const shapes: GlitterMote['shape'][] = ['circle', 'diamond', 'star', 'triangle', 'square', 'hexagon'];
    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--secondary))',
      'hsl(var(--accent))',
      'rgba(255,255,255,0.8)',
      'rgba(255,215,0,0.6)', // gold
      'rgba(255,192,203,0.6)', // pink
      'rgba(173,216,230,0.6)' // light blue
    ];
    
    for (let i = 0; i < moteCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = fieldRadius * (0.7 + Math.random() * 0.3);
      const startX = centerX + Math.cos(angle) * distance;
      const startY = centerY + Math.sin(angle) * distance;
      
      // Generate trail points (boat wake effect)
      const trailPoints = [];
      for (let t = 0; t < 8; t++) {
        const trailAngle = angle + (Math.random() - 0.5) * 0.3;
        const trailDistance = distance + t * 20;
        trailPoints.push({
          x: centerX + Math.cos(trailAngle) * trailDistance,
          y: centerY + Math.sin(trailAngle) * trailDistance,
          size: (8 - t) * 0.5,
          opacity: (8 - t) * 0.08
        });
      }
      
      motes.push({
        id: i,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        startX,
        startY,
        startRadius: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.8 + Math.random() * 0.6,
        hourOffset: Math.random() * 24,
        trailPoints
      });
    }
    
    return motes;
  }, [centerX, centerY, fieldRadius, moteCount]);

  // Calculate current position based on 24-hour cycle
  const calculateMotePosition = (mote: GlitterMote) => {
    const totalHours = (currentHour + mote.hourOffset) % 24;
    const progress = totalHours / 24; // 0 to 1 over 24 hours
    
    // Spiral toward center
    const currentDistance = fieldRadius * (1 - progress * 0.9); // almost disappear at center
    const currentSize = mote.startRadius * (1 - progress * 0.8);
    const spiralAngle = Math.atan2(mote.startY - centerY, mote.startX - centerX) + progress * Math.PI * 4;
    
    return {
      x: centerX + Math.cos(spiralAngle) * currentDistance,
      y: centerY + Math.sin(spiralAngle) * currentDistance,
      size: Math.max(currentSize, 0.2),
      opacity: 0.8 - progress * 0.6
    };
  };

  // Render different shapes
  const renderShape = (mote: GlitterMote, position: any) => {
    const baseProps = {
      fill: mote.color,
      opacity: position.opacity,
      filter: "blur(0.5px) drop-shadow(0 0 4px currentColor)"
    };

    switch (mote.shape) {
      case 'circle':
        return (
          <motion.circle
            cx={position.x}
            cy={position.y}
            r={position.size}
            {...baseProps}
          />
        );
      
      case 'diamond':
        const d = position.size;
        return (
          <motion.polygon
            points={`${position.x},${position.y-d} ${position.x+d},${position.y} ${position.x},${position.y+d} ${position.x-d},${position.y}`}
            {...baseProps}
          />
        );
      
      case 'star':
        const r = position.size;
        const points = [];
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const radius = i % 2 === 0 ? r : r * 0.5;
          points.push(`${position.x + Math.cos(angle) * radius},${position.y + Math.sin(angle) * radius}`);
        }
        return (
          <motion.polygon
            points={points.join(' ')}
            {...baseProps}
          />
        );
      
      case 'triangle':
        const t = position.size;
        return (
          <motion.polygon
            points={`${position.x},${position.y-t} ${position.x+t},${position.y+t} ${position.x-t},${position.y+t}`}
            {...baseProps}
          />
        );
      
      case 'square':
        const s = position.size;
        return (
          <motion.rect
            x={position.x - s}
            y={position.y - s}
            width={s * 2}
            height={s * 2}
            {...baseProps}
          />
        );
      
      case 'hexagon':
        const h = position.size;
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          hexPoints.push(`${position.x + Math.cos(angle) * h},${position.y + Math.sin(angle) * h}`);
        }
        return (
          <motion.polygon
            points={hexPoints.join(' ')}
            {...baseProps}
          />
        );
      
      default:
        return null;
    }
  };

  if (!isActive) return null;

  return (
    <g className="glitter-mote-field">
      {glitterMotes.map((mote) => {
        const position = calculateMotePosition(mote);
        
        return (
          <g key={`mote-${mote.id}`}>
            {/* Boat-wake trail behind each mote */}
            {mote.trailPoints.map((trail, t) => (
              <motion.circle
                key={`trail-${mote.id}-${t}`}
                cx={trail.x}
                cy={trail.y}
                r={trail.size}
                fill={mote.color}
                opacity={trail.opacity * position.opacity}
                filter="blur(1px)"
                animate={{
                  opacity: [trail.opacity * position.opacity, trail.opacity * position.opacity * 0.5, trail.opacity * position.opacity],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 3 + t * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: t * 0.1
                }}
              />
            ))}
            
            {/* Main glitter mote */}
            <motion.g
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: {
                  duration: 6 + mote.speed,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 2 + mote.speed * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              {renderShape(mote, position)}
            </motion.g>
            
            {/* Hourly scatter effect - expands when mote moves */}
            <motion.circle
              cx={position.x}
              cy={position.y}
              r={position.size * 3}
              fill="none"
              stroke={mote.color}
              strokeWidth={0.3}
              opacity={0.2 * position.opacity}
              animate={{
                r: [position.size * 3, position.size * 6, position.size * 3],
                strokeOpacity: [0.2 * position.opacity, 0.05, 0.2 * position.opacity]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: mote.hourOffset
              }}
            />
          </g>
        );
      })}
    </g>
  );
};
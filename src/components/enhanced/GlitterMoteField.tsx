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
  waveAmplitude: number;
  waveFrequency: number;
  lastPeakTime: number;
  trailPoints: { x: number; y: number; size: number; opacity: number }[];
  sparkles: { 
    x: number; 
    y: number; 
    size: number; 
    opacity: number; 
    age: number; 
    maxAge: number;
    velocity: { x: number; y: number };
  }[];
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
        startRadius: 1 + Math.random() * 2, // Decreased size
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.8 + Math.random() * 0.6,
        hourOffset: Math.random() * 24,
        waveAmplitude: 20 + Math.random() * 30, // Sine wave amplitude
        waveFrequency: 1, // 1 cycle per hour
        lastPeakTime: 0,
        trailPoints,
        sparkles: []
      });
    }
    
    return motes;
  }, [centerX, centerY, fieldRadius, moteCount]);

  // Calculate current position with sinusoidal dance
  const calculateMotePosition = (mote: GlitterMote) => {
    const totalHours = (currentHour + mote.hourOffset) % 24;
    const progress = totalHours / 24; // 0 to 1 over 24 hours
    
    // Spiral toward center
    const currentDistance = fieldRadius * (1 - progress * 0.9);
    const currentSize = mote.startRadius * (1 - progress * 0.6); // Reduced size decrease
    const spiralAngle = Math.atan2(mote.startY - centerY, mote.startX - centerX) + progress * Math.PI * 4;
    
    // Sinusoidal wave motion (1 hour = 1 full cycle)
    const wavePhase = (totalHours * mote.waveFrequency * 2 * Math.PI) % (2 * Math.PI);
    const waveOffset = Math.sin(wavePhase) * mote.waveAmplitude;
    
    // Calculate perpendicular direction for wave motion
    const perpAngle = spiralAngle + Math.PI / 2;
    const waveX = Math.cos(perpAngle) * waveOffset;
    const waveY = Math.sin(perpAngle) * waveOffset;
    
    const baseX = centerX + Math.cos(spiralAngle) * currentDistance;
    const baseY = centerY + Math.sin(spiralAngle) * currentDistance;
    
    // Detect peaks for sparkle generation
    const isAtPeak = Math.abs(Math.sin(wavePhase)) > 0.95; // Near peak/trough
    const currentTime = Date.now();
    
    return {
      x: baseX + waveX,
      y: baseY + waveY,
      size: Math.max(currentSize, 0.1),
      opacity: 0.9 - progress * 0.4,
      wavePhase,
      isAtPeak,
      currentTime,
      baseX,
      baseY,
      perpAngle
    };
  };

  // Generate sparkles at wave peaks
  const generateSparkles = (mote: GlitterMote, position: any) => {
    if (position.isAtPeak && position.currentTime - mote.lastPeakTime > 500) {
      // Generate 3-5 sparkles
      const sparkleCount = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < sparkleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1;
        mote.sparkles.push({
          x: position.x,
          y: position.y,
          size: 0.5 + Math.random() * 1,
          opacity: 0.8,
          age: 0,
          maxAge: 2000 + Math.random() * 1000, // 2-3 seconds
          velocity: {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
          }
        });
      }
      mote.lastPeakTime = position.currentTime;
    }
    
    // Update existing sparkles
    mote.sparkles = mote.sparkles.filter(sparkle => {
      sparkle.age += 16; // roughly 60fps
      sparkle.x += sparkle.velocity.x;
      sparkle.y += sparkle.velocity.y;
      sparkle.size += 0.02; // Grow over time
      sparkle.opacity = Math.max(0, 0.8 * (1 - sparkle.age / sparkle.maxAge));
      return sparkle.age < sparkle.maxAge;
    });
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
        generateSparkles(mote, position);
        
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
            
            {/* Main glitter mote with wave tracing */}
            <motion.g
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1] // Smaller scale animation
              }}
              transition={{
                rotate: {
                  duration: 8 + mote.speed, // Slower rotation
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
            
            {/* Wave trace line - connecting previous positions */}
            <motion.circle
              cx={position.baseX}
              cy={position.baseY}
              r={0.3}
              fill={mote.color}
              opacity={0.3}
              animate={{
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Peak sparkle burst */}
            {mote.sparkles.map((sparkle, s) => (
              <motion.circle
                key={`sparkle-${mote.id}-${s}-${sparkle.age}`}
                cx={sparkle.x}
                cy={sparkle.y}
                r={sparkle.size}
                fill={mote.color}
                opacity={sparkle.opacity}
                filter="blur(0.5px) drop-shadow(0 0 2px currentColor)"
              />
            ))}
            
            {/* Sinusoidal energy ring */}
            <motion.circle
              cx={position.x}
              cy={position.y}
              r={position.size * 2}
              fill="none"
              stroke={mote.color}
              strokeWidth={0.2}
              opacity={0.15 * position.opacity}
              animate={{
                r: [position.size * 2, position.size * 3, position.size * 2],
                strokeOpacity: [0.15 * position.opacity, 0.05, 0.15 * position.opacity]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: mote.hourOffset * 0.1
              }}
            />
          </g>
        );
      })}
    </g>
  );
};
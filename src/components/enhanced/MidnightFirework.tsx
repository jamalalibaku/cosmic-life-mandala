/**
 * Midnight Firework - Daily celebration sparkle burst at 00:00
 * Simple, beautiful 3-second animation focused on pure sparkle magic
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
  shape: 'circle' | 'star' | 'diamond';
}

interface MidnightFireworkProps {
  centerX: number;
  centerY: number;
  isActive?: boolean;
}

export const MidnightFirework: React.FC<MidnightFireworkProps> = ({
  centerX,
  centerY,
  isActive = true
}) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [hasTriggeredToday, setHasTriggeredToday] = useState(false);

  // Check for midnight trigger
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const currentDate = now.toDateString();
      
      // Reset daily trigger at 00:01
      if (currentTime === 1) {
        setHasTriggeredToday(false);
      }
      
      // Trigger at exactly 00:00
      if (currentTime === 0 && !hasTriggeredToday) {
        setIsTriggered(true);
        setHasTriggeredToday(true);
        
        // Reset after 3 seconds
        setTimeout(() => {
          setIsTriggered(false);
        }, 3000);
      }
    };

    const interval = setInterval(checkMidnight, 60000); // Check every minute
    checkMidnight(); // Check immediately

    return () => clearInterval(interval);
  }, [hasTriggeredToday]);

  // Generate sparkle particles
  const sparkleParticles = useMemo((): SparkleParticle[] => {
    const particles: SparkleParticle[] = [];
    const colors = [
      'rgba(255,255,255,0.9)',
      'rgba(255,215,0,0.8)', // gold
      'rgba(255,192,203,0.7)', // pink
      'rgba(173,216,230,0.8)', // light blue
      'hsl(var(--primary))',
      'hsl(var(--secondary))',
      'hsl(var(--accent))'
    ];
    
    const shapes: SparkleParticle['shape'][] = ['circle', 'star', 'diamond'];
    
    // Create burst pattern
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const speed = 50 + Math.random() * 100;
      
      particles.push({
        id: i,
        x: centerX,
        y: centerY,
        angle,
        speed,
        size: 1 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      });
    }
    
    return particles;
  }, [centerX, centerY]);

  // Render sparkle shapes
  const renderSparkle = (particle: SparkleParticle, progress: number) => {
    const distance = particle.speed * progress;
    const x = particle.x + Math.cos(particle.angle) * distance;
    const y = particle.y + Math.sin(particle.angle) * distance;
    const size = particle.size * (1 + progress * 2); // Grow as they travel
    const opacity = 1 - progress; // Fade out

    const baseProps = {
      fill: particle.color,
      opacity,
      filter: "blur(0.3px) drop-shadow(0 0 6px currentColor)"
    };

    switch (particle.shape) {
      case 'circle':
        return (
          <motion.circle
            cx={x}
            cy={y}
            r={size}
            {...baseProps}
          />
        );
      
      case 'star':
        const r = size;
        const points = [];
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const radius = i % 2 === 0 ? r : r * 0.4;
          points.push(`${x + Math.cos(angle) * radius},${y + Math.sin(angle) * radius}`);
        }
        return (
          <motion.polygon
            points={points.join(' ')}
            {...baseProps}
          />
        );
      
      case 'diamond':
        const d = size;
        return (
          <motion.polygon
            points={`${x},${y-d} ${x+d},${y} ${x},${y+d} ${x-d},${y}`}
            {...baseProps}
          />
        );
      
      default:
        return null;
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isTriggered && (
        <g className="midnight-firework">
          {/* Central burst core */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={5}
            fill="white"
            initial={{ opacity: 1, scale: 0 }}
            animate={{ 
              opacity: [1, 0.8, 0],
              scale: [0, 3, 8]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            filter="blur(1px) drop-shadow(0 0 20px white)"
          />
          
          {/* Sparkle burst particles */}
          {sparkleParticles.map((particle) => (
            <motion.g
              key={particle.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ 
                duration: 3, 
                ease: "easeOut",
                delay: Math.random() * 0.2 
              }}
            >
              <motion.g
                animate={{
                  pathLength: [0, 1],
                  opacity: [1, 0.8, 0]
                }}
                transition={{ 
                  duration: 3,
                  ease: "easeOut"
                }}
              >
                {/* Render sparkle at different progress points for trail effect */}
                {[0.2, 0.5, 0.8, 1].map((progress, i) => (
                  <motion.g
                    key={i}
                    animate={{
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 0.5,
                      delay: progress * 2.5,
                      ease: "easeOut"
                    }}
                  >
                    {renderSparkle(particle, progress)}
                  </motion.g>
                ))}
              </motion.g>
            </motion.g>
          ))}
          
          {/* Concentric sparkle rings */}
          {[1, 2, 3].map((ring) => (
            <motion.circle
              key={`ring-${ring}`}
              cx={centerX}
              cy={centerY}
              r={ring * 30}
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={0.5}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 2, 4],
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: 3,
                delay: ring * 0.1,
                ease: "easeOut"
              }}
              filter="blur(0.5px) drop-shadow(0 0 8px white)"
            />
          ))}
          
          {/* Additional micro sparkles */}
          {Array.from({length: 20}).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 80 + Math.random() * 50;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            return (
              <motion.circle
                key={`micro-${i}`}
                cx={x}
                cy={y}
                r={0.5 + Math.random()}
                fill="white"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 2, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: 0.5 + Math.random() * 1.5,
                  ease: "easeOut"
                }}
                filter="blur(0.2px) drop-shadow(0 0 4px white)"
              />
            );
          })}
        </g>
      )}
    </AnimatePresence>
  );
};
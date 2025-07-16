/**
 * Water Flow Visuals - Completing Day 4 Dynamics
 * Adds flowing, organic motion between layers
 */

import React from 'react';
import { motion } from 'framer-motion';


interface WaterFlowVisualsProps {
  centerX: number;
  centerY: number;
  radius: number;
  flow: 'inward' | 'outward' | 'circular' | 'tidal';
  intensity: number; // 0-1
  color?: string;
  theme: string;
}

export const WaterFlowVisuals: React.FC<WaterFlowVisualsProps> = ({
  centerX,
  centerY,
  radius,
  flow,
  intensity,
  color = 'hsl(200 70% 60%)',
  theme
}) => {
  // Generate flow particles
  const particleCount = Math.min(12, Math.max(4, Math.floor(intensity * 16)));
  
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * 2 * Math.PI;
    return {
      id: i,
      startAngle: angle,
      baseRadius: radius + (Math.random() - 0.5) * 20
    };
  });

  const getFlowPath = (particle: typeof particles[0], time: number) => {
    const t = (time / 4000) % 1; // 4 second cycle
    
    switch (flow) {
      case 'inward':
        const currentRadius = particle.baseRadius * (1 - t * 0.3);
        return {
          x: centerX + currentRadius * Math.cos(particle.startAngle + t * 0.5),
          y: centerY + currentRadius * Math.sin(particle.startAngle + t * 0.5),
          opacity: 1 - t
        };
        
      case 'outward':
        const expandRadius = particle.baseRadius * (1 + t * 0.4);
        return {
          x: centerX + expandRadius * Math.cos(particle.startAngle - t * 0.3),
          y: centerY + expandRadius * Math.sin(particle.startAngle - t * 0.3),
          opacity: 1 - t
        };
        
      case 'circular':
        return {
          x: centerX + particle.baseRadius * Math.cos(particle.startAngle + t * 2 * Math.PI),
          y: centerY + particle.baseRadius * Math.sin(particle.startAngle + t * 2 * Math.PI),
          opacity: 0.6 + 0.4 * Math.sin(t * Math.PI * 4)
        };
        
      case 'tidal':
        const tidalRadius = particle.baseRadius + Math.sin(t * Math.PI * 2) * 15;
        return {
          x: centerX + tidalRadius * Math.cos(particle.startAngle + t * 0.2),
          y: centerY + tidalRadius * Math.sin(particle.startAngle + t * 0.2),
          opacity: 0.5 + 0.3 * Math.sin(t * Math.PI * 3)
        };
        
      default:
        return { x: centerX, y: centerY, opacity: 0 };
    }
  };

  return (
    <g className="water-flow-visuals">
      {/* Flow streams */}
      {particles.map((particle) => (
        <motion.g
          key={particle.id}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 3 + particle.id * 0.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Particle trail */}
          <motion.path
            d={`M ${centerX + particle.baseRadius * Math.cos(particle.startAngle)} ${centerY + particle.baseRadius * Math.sin(particle.startAngle)} 
                Q ${centerX + particle.baseRadius * 0.5 * Math.cos(particle.startAngle + 0.5)} ${centerY + particle.baseRadius * 0.5 * Math.sin(particle.startAngle + 0.5)}
                  ${centerX + particle.baseRadius * 0.2 * Math.cos(particle.startAngle + 1)} ${centerY + particle.baseRadius * 0.2 * Math.sin(particle.startAngle + 1)}`}
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity={intensity * 0.4}
            strokeDasharray="2,3"
            animate={{
              strokeDashoffset: [0, -10],
              opacity: [intensity * 0.4, intensity * 0.8, intensity * 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Particle */}
          <motion.circle
            r="2"
            fill={color}
            opacity={intensity * 0.6}
            animate={{
              cx: [
                centerX + particle.baseRadius * Math.cos(particle.startAngle),
                centerX + particle.baseRadius * 0.3 * Math.cos(particle.startAngle + 1)
              ],
              cy: [
                centerY + particle.baseRadius * Math.sin(particle.startAngle),
                centerY + particle.baseRadius * 0.3 * Math.sin(particle.startAngle + 1)
              ]
            }}
            transition={{
              duration: 4 + particle.id * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>
      ))}
      
      {/* Center flow source */}
      {flow !== 'circular' && (
        <g>
          <motion.circle
            cx={centerX}
            cy={centerY}
            r="6"
            fill="none"
            stroke={color}
            strokeWidth="2"
            opacity={intensity * 0.5}
            animate={{
              r: [4, 8, 4],
              opacity: [intensity * 0.3, intensity * 0.8, intensity * 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Ripples */}
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={centerX}
              cy={centerY}
              r="0"
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity="0"
              animate={{
                r: [0, 30],
                opacity: [intensity * 0.6, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeOut"
              }}
            />
          ))}
        </g>
      )}
    </g>
  );
};
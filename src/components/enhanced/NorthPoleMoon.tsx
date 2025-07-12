/**
 * North Pole Moon - Relocated moon with orbital animation
 * Replaces center moon with elegant north pole positioning
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { calculateMoonPhase } from '../../utils/moon-phase-calendar';

interface NorthPoleMoonProps {
  center: { x: number; y: number };
  radius: number;
  moonPhase?: number; // 0-1, where 0 is new moon, 0.5 is full moon
  className?: string;
  showTooltip?: boolean;
}

export const NorthPoleMoon: React.FC<NorthPoleMoonProps> = ({
  center,
  radius,
  moonPhase,
  className = '',
  showTooltip = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get current moon phase if not provided
  const currentMoonData = useMemo(() => calculateMoonPhase(new Date()), []);
  const actualMoonPhase = moonPhase ?? currentMoonData.phase;
  // Calculate moon position (north pole with slight hover)
  const moonPosition = useMemo(() => {
    const northAngle = -Math.PI / 2; // North pole
    const hoverDistance = radius + 40; // Distance from outer ring
    
    return {
      x: center.x + Math.cos(northAngle) * hoverDistance,
      y: center.y + Math.sin(northAngle) * hoverDistance
    };
  }, [center, radius]);

  // Calculate moon phase appearance
  const getMoonPath = (phase: number, moonRadius: number) => {
    // Convert phase to illumination (0 = new, 0.5 = full, 1 = new)
    const illumination = phase <= 0.5 ? phase * 2 : (1 - phase) * 2;
    const isWaxing = phase <= 0.5;
    
    if (illumination === 0) {
      // New moon - just a thin outline
      return {
        lightPath: `M ${moonPosition.x - moonRadius} ${moonPosition.y} A ${moonRadius} ${moonRadius} 0 0 1 ${moonPosition.x + moonRadius} ${moonPosition.y} A ${moonRadius} ${moonRadius} 0 0 1 ${moonPosition.x - moonRadius} ${moonPosition.y}`,
        shadowPath: `M ${moonPosition.x - moonRadius} ${moonPosition.y} A ${moonRadius} ${moonRadius} 0 0 1 ${moonPosition.x + moonRadius} ${moonPosition.y} A ${moonRadius} ${moonRadius} 0 0 1 ${moonPosition.x - moonRadius} ${moonPosition.y}`,
        lightOpacity: 0.2,
        shadowOpacity: 0.8
      };
    }
    
    if (illumination === 1) {
      // Full moon
      return {
        lightPath: `M ${moonPosition.x - moonRadius} ${moonPosition.y} A ${moonRadius} ${moonRadius} 0 0 1 ${moonPosition.x + moonRadius} ${moonPosition.y} A ${moonRadius} ${moonRadius} 0 0 1 ${moonPosition.x - moonRadius} ${moonPosition.y}`,
        shadowPath: '',
        lightOpacity: 1,
        shadowOpacity: 0
      };
    }
    
    // Partial moon phases
    const terminatorX = moonPosition.x + (isWaxing ? -1 : 1) * moonRadius * (1 - illumination * 2);
    const lightSweep = illumination > 0.5 ? 1 : 0;
    
    return {
      lightPath: isWaxing 
        ? `M ${moonPosition.x} ${moonPosition.y - moonRadius} A ${moonRadius} ${moonRadius} 0 0 1 ${moonPosition.x} ${moonPosition.y + moonRadius} A ${Math.abs(terminatorX - moonPosition.x)} ${moonRadius} 0 0 ${lightSweep} ${moonPosition.x} ${moonPosition.y - moonRadius}`
        : `M ${moonPosition.x} ${moonPosition.y - moonRadius} A ${Math.abs(terminatorX - moonPosition.x)} ${moonRadius} 0 0 ${1 - lightSweep} ${moonPosition.x} ${moonPosition.y + moonRadius} A ${moonRadius} ${moonRadius} 0 0 1 ${moonPosition.x} ${moonPosition.y - moonRadius}`,
      shadowPath: `M ${moonPosition.x - moonRadius} ${moonPosition.y} A ${moonRadius} ${moonRadius} 0 0 1 ${moonPosition.x + moonRadius} ${moonPosition.y} A ${moonRadius} ${moonRadius} 0 0 1 ${moonPosition.x - moonRadius} ${moonPosition.y}`,
      lightOpacity: 0.9,
      shadowOpacity: 0.3
    };
  };

  const moonRadius = 12;
  const moonPaths = getMoonPath(actualMoonPhase, moonRadius);

  return (
    <motion.g
      className={className}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <defs>
        {/* Moon glow */}
        <radialGradient 
          id="moon-glow" 
          cx="50%" 
          cy="50%" 
          r="50%"
        >
          <stop offset="0%" stopColor="hsl(45 80% 90%)" stopOpacity={0.8} />
          <stop offset="50%" stopColor="hsl(50 70% 85%)" stopOpacity={0.4} />
          <stop offset="100%" stopColor="hsl(55 60% 80%)" stopOpacity={0} />
        </radialGradient>

        {/* Moon surface gradient */}
        <radialGradient 
          id="moon-surface" 
          cx="30%" 
          cy="30%" 
          r="70%"
        >
          <stop offset="0%" stopColor="hsl(45 40% 85%)" />
          <stop offset="70%" stopColor="hsl(40 30% 75%)" />
          <stop offset="100%" stopColor="hsl(35 25% 65%)" />
        </radialGradient>

        {/* Moon shadow */}
        <radialGradient 
          id="moon-shadow" 
          cx="50%" 
          cy="50%" 
          r="50%"
        >
          <stop offset="0%" stopColor="hsl(240 20% 20%)" stopOpacity={0.7} />
          <stop offset="100%" stopColor="hsl(240 30% 15%)" stopOpacity={0.9} />
        </radialGradient>
      </defs>

      {/* Orbital glow halo */}
      <motion.circle
        cx={moonPosition.x}
        cy={moonPosition.y}
        r={moonRadius * 2}
        fill="url(#moon-glow)"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Gentle orbital motion */}
      <motion.g
        animate={{
          x: [0, 3, 0, -3, 0],
          y: [0, -2, 0, 2, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{ cursor: showTooltip ? 'pointer' : 'default' }}
      >
        {/* Moon shadow (dark side) */}
        <path
          d={moonPaths.shadowPath}
          fill="url(#moon-shadow)"
          opacity={moonPaths.shadowOpacity}
        />

        {/* Moon illuminated side */}
        <path
          d={moonPaths.lightPath}
          fill="url(#moon-surface)"
          opacity={moonPaths.lightOpacity}
        />

        {/* Moon outline */}
        <circle
          cx={moonPosition.x}
          cy={moonPosition.y}
          r={moonRadius}
          fill="none"
          stroke="hsl(45 30% 70%)"
          strokeWidth={1}
          opacity={0.6}
        />

        {/* Subtle surface details */}
        <circle
          cx={moonPosition.x - 3}
          cy={moonPosition.y - 2}
          r={2}
          fill="hsl(35 20% 60%)"
          opacity={0.4}
        />
        <circle
          cx={moonPosition.x + 2}
          cy={moonPosition.y + 3}
          r={1.5}
          fill="hsl(35 20% 60%)"
          opacity={0.3}
        />
      </motion.g>

      {/* Levitation sparkles */}
      {[0, 1, 2].map((index) => {
        const sparkleAngle = (index / 3) * 2 * Math.PI;
        const sparkleDistance = moonRadius * 1.8;
        const sparkleX = moonPosition.x + Math.cos(sparkleAngle) * sparkleDistance;
        const sparkleY = moonPosition.y + Math.sin(sparkleAngle) * sparkleDistance;

        return (
          <motion.circle
            key={index}
            r={1}
            fill="hsl(45 80% 85%)"
            animate={{
              x: [sparkleX, sparkleX + Math.cos(sparkleAngle) * 8, sparkleX],
              y: [sparkleY, sparkleY + Math.sin(sparkleAngle) * 8, sparkleY],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 1.3
            }}
          />
        );
      })}
      
      {/* Moon phase tooltip */}
      {showTooltip && isHovered && (
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <motion.rect
            x={moonPosition.x + 20}
            y={moonPosition.y - 25}
            width={120}
            height={40}
            rx={6}
            fill="hsl(220, 15%, 10%)"
            fillOpacity={0.95}
            stroke="hsl(220, 20%, 25%)"
            strokeWidth={1}
          />
          <motion.text
            x={moonPosition.x + 80}
            y={moonPosition.y - 15}
            textAnchor="middle"
            fill="hsl(220, 10%, 90%)"
            fontSize={10}
            fontWeight="500"
          >
            {currentMoonData.phaseName}
          </motion.text>
          <motion.text
            x={moonPosition.x + 80}
            y={moonPosition.y - 5}
            textAnchor="middle"
            fill="hsl(220, 10%, 70%)"
            fontSize={9}
          >
            {currentMoonData.illumination}% illuminated
          </motion.text>
        </motion.g>
      )}
    </motion.g>
  );
};
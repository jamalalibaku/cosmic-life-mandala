/**
 * Urban Grounding - Inspired by Weather Report "Night Passage"
 * Base ring becomes a subtle city silhouette tied to location
 */

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface UrbanGroundingProps {
  centerX: number;
  centerY: number;
  baseRadius: number;
  silhouetteType: 'city' | 'mountains' | 'forest' | 'desert' | 'coastal';
  theme: string;
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  className?: string;
}

export const UrbanGrounding: React.FC<UrbanGroundingProps> = ({
  centerX,
  centerY,
  baseRadius,
  silhouetteType,
  theme,
  timeOfDay,
  className = ''
}) => {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  // Update time every hour for lighting changes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000); // Check every minute for hour changes
    return () => clearInterval(timer);
  }, []);

  // Determine time of day based on current hour
  const actualTimeOfDay = useMemo(() => {
    if (currentHour >= 6 && currentHour < 9) return 'dawn';
    if (currentHour >= 9 && currentHour < 17) return 'day';
    if (currentHour >= 17 && currentHour < 20) return 'dusk';
    return 'night';
  }, [currentHour]);

  // Time-based color schemes
  const timeColors = useMemo(() => {
    const schemes = {
      dawn: {
        silhouette: 'hsl(15 30% 25%)',
        glow: 'hsl(30 60% 40%)',
        accent: 'hsl(45 70% 60%)',
        background: 'hsl(20 40% 15%)'
      },
      day: {
        silhouette: 'hsl(210 15% 20%)',
        glow: 'hsl(200 30% 50%)',
        accent: 'hsl(190 40% 70%)',
        background: 'hsl(200 20% 30%)'
      },
      dusk: {
        silhouette: 'hsl(280 25% 20%)',
        glow: 'hsl(290 50% 40%)',
        accent: 'hsl(300 60% 60%)',
        background: 'hsl(270 30% 15%)'
      },
      night: {
        silhouette: 'hsl(240 20% 15%)',
        glow: 'hsl(220 40% 30%)',
        accent: 'hsl(200 50% 50%)',
        background: 'hsl(230 25% 10%)'
      }
    };
    return schemes[actualTimeOfDay];
  }, [actualTimeOfDay]);

  // Generate silhouette path based on type
  const generateSilhouettePath = () => {
    const points = 72; // 5-degree increments
    const angleStep = (Math.PI * 2) / points;
    let path = '';
    
    for (let i = 0; i <= points; i++) {
      const angle = i * angleStep;
      let heightVariation = 0;
      
      switch (silhouetteType) {
        case 'city':
          // Create building-like skyline
          const buildingIndex = Math.floor(i / 4);
          const buildingHeight = Math.sin(buildingIndex * 0.7) * 40 + 
                                Math.sin(buildingIndex * 2.3) * 20 + 
                                Math.random() * 15;
          heightVariation = Math.max(10, buildingHeight);
          // Add occasional tall buildings
          if (i % 8 === 0) heightVariation *= 1.5;
          break;
          
        case 'mountains':
          // Create mountain peaks
          heightVariation = Math.sin(angle * 3) * 50 + 
                           Math.sin(angle * 5) * 25 + 
                           Math.sin(angle * 1.5) * 30;
          break;
          
        case 'forest':
          // Create tree-like variations
          heightVariation = Math.sin(angle * 8) * 15 + 
                           Math.sin(angle * 12) * 10 + 
                           Math.sin(angle * 20) * 5;
          break;
          
        case 'desert':
          // Create dune-like curves
          heightVariation = Math.sin(angle * 2) * 20 + 
                           Math.sin(angle * 0.5) * 35;
          break;
          
        case 'coastal':
          // Create coastal cliff variations
          heightVariation = Math.sin(angle * 4) * 30 + 
                           Math.cos(angle * 7) * 15 + 
                           Math.sin(angle * 1.2) * 25;
          break;
      }
      
      const r = baseRadius + heightVariation;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    path += ' Z';
    return path;
  };

  // Generate windows/lights for city silhouette at night
  const generateCityLights = () => {
    if (silhouetteType !== 'city' || (actualTimeOfDay !== 'night' && actualTimeOfDay !== 'dusk')) {
      return [];
    }
    
    const lights = [];
    const lightCount = 60; // Number of windows/lights
    
    for (let i = 0; i < lightCount; i++) {
      const angle = (i / lightCount) * Math.PI * 2;
      const distance = baseRadius + 15 + Math.random() * 40;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      // Random chance for light to be on
      if (Math.random() > 0.3) {
        lights.push({ x, y, id: i });
      }
    }
    
    return lights;
  };

  const cityLights = generateCityLights();

  return (
    <g className={`urban-grounding ${className}`}>
      <defs>
        <radialGradient
          id={`grounding-gradient-${silhouetteType}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={timeColors.background} stopOpacity="0.1" />
          <stop offset="80%" stopColor={timeColors.glow} stopOpacity="0.3" />
          <stop offset="100%" stopColor={timeColors.silhouette} stopOpacity="0.8" />
        </radialGradient>
        
        <linearGradient
          id={`grounding-linear-${silhouetteType}`}
          x1="0%"
          y1="100%"
          x2="0%"
          y2="0%"
        >
          <stop offset="0%" stopColor={timeColors.silhouette} stopOpacity="1" />
          <stop offset="50%" stopColor={timeColors.glow} stopOpacity="0.6" />
          <stop offset="100%" stopColor={timeColors.accent} stopOpacity="0.2" />
        </linearGradient>
        
        <filter id="grounding-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="light-twinkle" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComposite operator="multiply" in2="SourceGraphic"/>
        </filter>
      </defs>

      {/* Base circle for reference */}
      <circle
        cx={centerX}
        cy={centerY}
        r={baseRadius}
        fill="none"
        stroke={timeColors.glow}
        strokeWidth="1"
        strokeOpacity="0.2"
        strokeDasharray="2,4"
      />

      {/* Main silhouette */}
      <motion.path
        d={generateSilhouettePath()}
        fill={`url(#grounding-linear-${silhouetteType})`}
        stroke={timeColors.silhouette}
        strokeWidth="2"
        filter="url(#grounding-glow)"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 1],
          scale: [0.8, 1]
        }}
        transition={{
          duration: 2,
          ease: "easeOut"
        }}
      />

      {/* Atmospheric glow behind silhouette */}
      <motion.path
        d={generateSilhouettePath()}
        fill={`url(#grounding-gradient-${silhouetteType})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{
          duration: 3,
          ease: "easeInOut"
        }}
      />

      {/* City lights (for night/dusk only) */}
      {cityLights.map((light) => (
        <motion.circle
          key={light.id}
          cx={light.x}
          cy={light.y}
          r="1.5"
          fill={timeColors.accent}
          filter="url(#light-twinkle)"
          initial={{ 
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            opacity: [0, 1, 0.7, 1],
            scale: [0, 1.2, 0.8, 1]
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Environmental elements based on silhouette type */}
      {silhouetteType === 'forest' && actualTimeOfDay === 'night' && (
        // Fireflies for forest at night
        Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
          const distance = baseRadius + 20 + Math.random() * 30;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          return (
            <motion.circle
              key={`firefly-${i}`}
              cx={x}
              cy={y}
              r="0.8"
              fill="hsl(60 100% 80%)"
              filter="url(#grounding-glow)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0, 1, 0],
                x: [x, x + (Math.random() - 0.5) * 20],
                y: [y, y + (Math.random() - 0.5) * 15]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                delay: Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })
      )}

      {/* Time of day indicator */}
      <motion.text
        x={centerX}
        y={centerY + baseRadius + 40}
        textAnchor="middle"
        className="text-xs font-light uppercase tracking-widest"
        fill={timeColors.accent}
        filter="url(#grounding-glow)"
        initial={{ opacity: 0, y: centerY + baseRadius + 60 }}
        animate={{
          opacity: [0, 0.8, 0.6],
          y: centerY + baseRadius + 40
        }}
        transition={{
          duration: 2,
          ease: "easeOut"
        }}
      >
        {silhouetteType.toUpperCase()} • {actualTimeOfDay.toUpperCase()}
      </motion.text>
    </g>
  );
};
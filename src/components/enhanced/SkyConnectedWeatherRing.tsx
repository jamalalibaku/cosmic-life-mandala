/**
 * Sky Connected Weather Ring - Revolutionary Time-Based Sky Integration
 * Features: Sky color integration, Sun path visualization, Light/shadow effects, Sunrise/sunset markers
 */

import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useVisualSkin } from '../visual-skin-provider';
import { useUnifiedMotion } from '../../hooks/useUnifiedMotion';

interface SkyConnectedWeatherRingProps {
  radius: number;
  center: { x: number; y: number };
  weatherData?: any[];
  className?: string;
}

interface SkyColors {
  dawn: { primary: string; secondary: string; }
  morning: { primary: string; secondary: string; }
  noon: { primary: string; secondary: string; }
  afternoon: { primary: string; secondary: string; }
  sunset: { primary: string; secondary: string; }
  night: { primary: string; secondary: string; }
}

const skyColorPalette: SkyColors = {
  dawn: { 
    primary: 'hsl(340 60% 75%)', // soft rose
    secondary: 'hsl(280 45% 80%)' // lavender
  },
  morning: { 
    primary: 'hsl(45 85% 85%)', // pastel gold
    secondary: 'hsl(50 70% 90%)'
  },
  noon: { 
    primary: 'hsl(200 85% 85%)', // light blue
    secondary: 'hsl(220 70% 90%)'
  },
  afternoon: { 
    primary: 'hsl(200 75% 75%)', // deeper sky
    secondary: 'hsl(210 65% 80%)'
  },
  sunset: { 
    primary: 'hsl(25 90% 70%)', // golden orange
    secondary: 'hsl(320 80% 75%)' // magenta
  },
  night: { 
    primary: 'hsl(230 70% 15%)', // midnight blue
    secondary: 'hsl(250 60% 20%)' // deep indigo
  }
};

export const SkyConnectedWeatherRing: React.FC<SkyConnectedWeatherRingProps> = ({
  radius,
  center,
  weatherData = [],
  className = ''
}) => {
  const { themeConfig } = useVisualSkin();
  const { breathing } = useUnifiedMotion();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate sun position and timing
  const sunData = useMemo(() => {
    const now = currentTime;
    const hour = now.getHours();
    const minute = now.getMinutes();
    const totalMinutes = hour * 60 + minute;
    
    // Approximate sunrise/sunset (6 AM - 6 PM for simplicity)
    const sunriseMinutes = 6 * 60; // 6:00 AM
    const sunsetMinutes = 18 * 60; // 6:00 PM
    const dayLength = sunsetMinutes - sunriseMinutes;
    
    const isDaytime = totalMinutes >= sunriseMinutes && totalMinutes <= sunsetMinutes;
    
    let sunProgress = 0;
    if (isDaytime) {
      sunProgress = (totalMinutes - sunriseMinutes) / dayLength;
    }
    
    // Sun path arc (180 degrees from sunrise to sunset)
    const sunAngle = sunProgress * Math.PI; // 0 to PI
    const sunPathRadius = radius * 0.9;
    
    // Calculate sun position on the arc
    const sunX = center.x + Math.cos(Math.PI - sunAngle) * sunPathRadius;
    const sunY = center.y + Math.sin(Math.PI - sunAngle) * sunPathRadius;
    
    return {
      isDaytime,
      sunProgress,
      sunAngle,
      sunX,
      sunY,
      sunriseAngle: Math.PI,
      sunsetAngle: 0,
      hour,
      minute
    };
  }, [currentTime, radius, center]);

  // Get current sky colors based on time
  const currentSkyColors = useMemo(() => {
    const hour = sunData.hour;
    
    if (hour >= 5 && hour < 7) return skyColorPalette.dawn;
    if (hour >= 7 && hour < 11) return skyColorPalette.morning;
    if (hour >= 11 && hour < 15) return skyColorPalette.noon;
    if (hour >= 15 && hour < 18) return skyColorPalette.afternoon;
    if (hour >= 18 && hour < 20) return skyColorPalette.sunset;
    return skyColorPalette.night;
  }, [sunData.hour]);

  // Generate sky gradient for the ring
  const skyGradient = useMemo(() => {
    const { primary, secondary } = currentSkyColors;
    return `conic-gradient(from 0deg at 50% 50%, ${primary}, ${secondary}, ${primary})`;
  }, [currentSkyColors]);

  // Create sun path curve data
  const sunPathData = useMemo(() => {
    if (!sunData.isDaytime) return '';
    
    const pathRadius = radius * 0.9;
    const startX = center.x + Math.cos(Math.PI) * pathRadius;
    const startY = center.y + Math.sin(Math.PI) * pathRadius;
    const endX = center.x + Math.cos(0) * pathRadius;
    const endY = center.y + Math.sin(0) * pathRadius;
    
    return `M ${startX} ${startY} A ${pathRadius} ${pathRadius} 0 0 0 ${endX} ${endY}`;
  }, [sunData.isDaytime, radius, center]);

  // Neural network connection calculations
  const connectionLines = useMemo(() => {
    const lines: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      strength: number;
      color: string;
      type: 'strong' | 'medium' | 'weak';
    }> = [];

    weatherData.forEach((point1, i) => {
      const angle1 = (i / weatherData.length) * 2 * Math.PI - Math.PI / 2;
      const x1 = center.x + Math.cos(angle1) * radius;
      const y1 = center.y + Math.sin(angle1) * radius;

      // Connect to nearby points and data-related points
      weatherData.forEach((point2, j) => {
        if (i >= j) return; // Avoid duplicate lines
        
        const angle2 = (j / weatherData.length) * 2 * Math.PI - Math.PI / 2;
        const x2 = center.x + Math.cos(angle2) * radius;
        const y2 = center.y + Math.sin(angle2) * radius;
        
        // Calculate connection strength based on proximity and data correlation
        const angleDiff = Math.abs(angle1 - angle2);
        const proximity = Math.min(angleDiff, 2 * Math.PI - angleDiff);
        
        // Mock data correlation (in real app, this would be actual weather correlation)
        const dataCorrelation = Math.random() * 0.5 + 0.3; // 0.3 to 0.8
        
        // Only show connections for nearby points or strongly correlated data
        if (proximity < Math.PI / 2.5 || dataCorrelation > 0.7) { // Within ~72 degrees or high correlation
          const proximityFactor = 1 - (proximity / Math.PI);
          const strength = Math.max(0.1, (proximityFactor * 0.6) + (dataCorrelation * 0.4));
          
          let connectionColor: string;
          let connectionType: 'strong' | 'medium' | 'weak';
          
          if (strength > 0.7) {
            connectionColor = 'hsl(50, 100%, 70%)'; // Golden - strong correlation
            connectionType = 'strong';
          } else if (strength > 0.4) {
            connectionColor = 'hsl(200, 80%, 60%)'; // Blue - medium correlation
            connectionType = 'medium';
          } else {
            connectionColor = 'hsl(280, 60%, 50%)'; // Purple - weak correlation
            connectionType = 'weak';
          }
          
          lines.push({
            x1, y1, x2, y2,
            strength,
            color: connectionColor,
            type: connectionType
          });
        }
      });
    });

    return lines;
  }, [weatherData, center, radius]);

  // Calculate light effects for particles
  const getLightEffect = (particleAngle: number) => {
    if (!sunData.isDaytime) {
      return { brightness: 0.6, warmth: 0 };
    }
    
    // Calculate how close particle is to sun position
    const sunAngleFromTop = Math.PI - sunData.sunAngle;
    const particleAngleFromTop = particleAngle;
    const angleDiff = Math.abs(sunAngleFromTop - particleAngleFromTop);
    
    // Particles near sun get more light
    const maxLightDistance = Math.PI / 3; // 60 degrees
    const lightIntensity = Math.max(0, 1 - (angleDiff / maxLightDistance));
    
    return {
      brightness: 0.6 + (lightIntensity * 0.4),
      warmth: lightIntensity
    };
  };

  // Breathing pulse scale
  const pulseScale = 1 + (breathing * 0.02);

  return (
    <motion.g
      className={className}
      animate={{ scale: pulseScale }}
      transition={{
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <defs>
        {/* Sky gradient definition */}
        <radialGradient 
          id="sky-ring-gradient" 
          cx="50%" 
          cy="50%" 
          r="50%"
        >
          <stop offset="0%" stopColor={currentSkyColors.primary} stopOpacity={0.8} />
          <stop offset="100%" stopColor={currentSkyColors.secondary} stopOpacity={0.6} />
        </radialGradient>

        {/* Golden sun glow gradient */}
        <radialGradient 
          id="sun-glow-gradient" 
          cx="50%" 
          cy="50%" 
          r="50%"
        >
          <stop offset="0%" stopColor="hsl(45 100% 85%)" stopOpacity={0.9} />
          <stop offset="50%" stopColor="hsl(35 95% 70%)" stopOpacity={0.7} />
          <stop offset="100%" stopColor="hsl(25 90% 60%)" stopOpacity={0.3} />
        </radialGradient>

        {/* Soft glow filter */}
        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Neural connection glow filters */}
        <filter id="connection-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Sky background ring with time-based colors */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r={radius}
        fill="none"
        stroke="url(#sky-ring-gradient)"
        strokeWidth={6}
        opacity={0.7}
        filter="url(#soft-glow)"
        style={{ zIndex: 1 }}
      />

      {/* Neural connection lines - glowing interconnections between weather data points */}
      {connectionLines.map((line, index) => (
        <motion.line
          key={`connection-${index}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={line.color}
          strokeWidth={line.type === 'strong' ? 2 : line.type === 'medium' ? 1.5 : 1}
          strokeOpacity={line.strength * 0.7}
          filter="url(#connection-glow)"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: line.strength * 0.7,
            strokeWidth: line.type === 'strong' ? [2, 3, 2] : line.type === 'medium' ? [1.5, 2.5, 1.5] : [1, 1.5, 1]
          }}
          transition={{ 
            duration: 3 + Math.random() * 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.1
          }}
        />
      ))}

      {/* Sun path visualization (only during daylight) */}
      {sunData.isDaytime && (
        <motion.path
          d={sunPathData}
          fill="none"
          stroke="url(#sun-glow-gradient)"
          strokeWidth={3}
          opacity={0.8}
          filter="url(#soft-glow)"
          style={{ zIndex: 2 }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: sunData.sunProgress }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      )}

      {/* Sunrise marker */}
      <motion.g
        transform={`translate(${center.x + Math.cos(Math.PI) * radius * 0.9}, ${center.y + Math.sin(Math.PI) * radius * 0.9})`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: sunData.isDaytime ? 1 : 0.5, 
          opacity: sunData.hour >= 5 && sunData.hour <= 8 ? 1 : 0.6 
        }}
        transition={{ duration: 1.5 }}
      >
        <circle r="6" fill="hsl(45 100% 75%)" opacity={0.8} />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          className="text-xs"
          fill="hsl(45 100% 95%)"
        >
          🌅
        </text>
      </motion.g>

      {/* Sunset marker */}
      <motion.g
        transform={`translate(${center.x + Math.cos(0) * radius * 0.9}, ${center.y + Math.sin(0) * radius * 0.9})`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: sunData.isDaytime ? 1 : 0.5, 
          opacity: sunData.hour >= 17 && sunData.hour <= 20 ? 1 : 0.6 
        }}
        transition={{ duration: 1.5 }}
      >
        <circle r="6" fill="hsl(25 90% 65%)" opacity={0.8} />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          className="text-xs"
          fill="hsl(25 100% 95%)"
        >
          🌇
        </text>
      </motion.g>

      {/* Current sun position (only during daylight) */}
      {sunData.isDaytime && (
        <motion.g
          transform={`translate(${sunData.sunX}, ${sunData.sunY})`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <circle r="8" fill="url(#sun-glow-gradient)" />
          <circle r="4" fill="hsl(45 100% 90%)" />
        </motion.g>
      )}

      {/* Enhanced weather data points as neural nodes */}
      {weatherData.map((data, index) => {
        const angle = (index / weatherData.length) * 2 * Math.PI - Math.PI / 2;
        const x = center.x + Math.cos(angle) * radius;
        const y = center.y + Math.sin(angle) * radius;
        
        const lightEffect = getLightEffect(angle + Math.PI / 2); // Adjust for our coordinate system
        
        // Node size and color based on data importance and correlation
        const nodeSize = 5 + ((data.value || 50) / 100) * 3; // 5-8px radius
        const nodeColors = [
          'hsl(50, 100%, 70%)',   // Golden
          'hsl(200, 80%, 60%)',   // Blue  
          'hsl(120, 60%, 50%)',   // Green
          'hsl(280, 60%, 50%)',   // Purple
          'hsl(15, 90%, 60%)',    // Orange
          'hsl(340, 70%, 60%)'    // Pink
        ];
        const nodeColor = nodeColors[index % nodeColors.length];
        
        return (
          <motion.g key={`weather-node-${index}`} transform={`translate(${x}, ${y})`}>
            {/* Outer neural glow ring */}
            <motion.circle
              r={nodeSize + 3}
              fill={nodeColor}
              fillOpacity="0.2"
              filter="url(#node-glow)"
              animate={{
                r: [nodeSize + 3, nodeSize + 6, nodeSize + 3],
                fillOpacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Light effect halo for sunlit nodes */}
            {lightEffect.warmth > 0.3 && (
              <motion.circle
                r={nodeSize + 2}
                fill={`hsl(45 80% 80%)`}
                opacity={lightEffect.warmth * 0.3}
                filter="url(#soft-glow)"
                animate={{
                  opacity: [lightEffect.warmth * 0.2, lightEffect.warmth * 0.4, lightEffect.warmth * 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
            
            {/* Main neural node */}
            <motion.circle
              r={nodeSize}
              fill={nodeColor}
              fillOpacity={lightEffect.brightness}
              filter="url(#node-glow)"
              style={{
                filter: lightEffect.warmth > 0.5 
                  ? `url(#node-glow) drop-shadow(0 0 6px hsl(45 100% 70%))` 
                  : `url(#node-glow) drop-shadow(0 0 3px ${nodeColor})`
              }}
              initial={{ scale: 0 }}
              animate={{
                scale: [1, 1.2, 1],
                fillOpacity: [lightEffect.brightness * 0.8, lightEffect.brightness, lightEffect.brightness * 0.8]
              }}
              transition={{
                duration: 3 + (index * 0.3),
                delay: index * 0.1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.4,
                fillOpacity: 1,
                transition: { duration: 0.2 }
              }}
            />
            
            {/* Inner sparkle core */}
            <motion.circle
              r={nodeSize * 0.3}
              fill="white"
              fillOpacity="0.9"
              animate={{
                fillOpacity: [0.7, 1, 0.7],
                r: [nodeSize * 0.2, nodeSize * 0.4, nodeSize * 0.2]
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.g>
        );
      })}

      {/* Temperature display positioned near sun arc */}
      {sunData.isDaytime && (
        <motion.g
          transform={`translate(${sunData.sunX + 25}, ${sunData.sunY - 10})`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          {/* Temperature background glow */}
          <circle
            r={18}
            fill="url(#sun-glow-gradient)"
            opacity={0.6}
            filter="url(#soft-glow)"
          />
          
          {/* Temperature value */}
          <text
            textAnchor="middle"
            dominantBaseline="central"
            className="text-sm font-semibold"
            fill="hsl(45 100% 95%)"
            style={{ 
              filter: 'drop-shadow(0 0 2px hsl(25 100% 50%))',
              fontSize: '14px'
            }}
          >
            {weatherData.length > 0 && weatherData[0].temperature ? 
              `${Math.round(weatherData[0].temperature)}°` : 
              '23°'
            }
          </text>
        </motion.g>
      )}

      {/* Inner glow that reflects skylight into inner layers */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r={radius * 0.8}
        fill="none"
        stroke={currentSkyColors.primary}
        strokeWidth={1}
        opacity={0.3}
        style={{
          filter: `drop-shadow(0 0 8px ${currentSkyColors.primary}50)`,
          zIndex: 3
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.g>
  );
};
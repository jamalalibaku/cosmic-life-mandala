/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * ZIP11-GOLF: Enhanced Weather Ring with Breathing Pulse & Gradient Shifts
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useVisualSkin } from '../visual-skin-provider';
import { useUnifiedMotion } from '../../hooks/useUnifiedMotion';

interface BreathingWeatherRingProps {
  radius: number;
  center: { x: number; y: number };
  weatherData?: any[];
  className?: string;
}

export const BreathingWeatherRing: React.FC<BreathingWeatherRingProps> = ({
  radius,
  center,
  weatherData = [],
  className = ''
}) => {
  const { themeConfig } = useVisualSkin();
  const { breathing } = useUnifiedMotion();
  const [hourlyGradient, setHourlyGradient] = useState('');

  // Generate hourly gradient shift
  useEffect(() => {
    const currentHour = new Date().getHours();
    const dayProgress = currentHour / 24;
    
    // Create a gradient that shifts through the day
    const hue1 = (240 + dayProgress * 120) % 360; // Blue to purple to pink
    const hue2 = (hue1 + 60) % 360;
    
    setHourlyGradient(`linear-gradient(${dayProgress * 360}deg, 
      hsl(${hue1} 30% 15%), 
      hsl(${hue2} 25% 12%))`);
  }, []);

  // Breathing pulse scale
  const pulseScale = 1 + (breathing * 0.03); // Subtle 3% scale variation

  return (
    <motion.g
      className={className}
      animate={{
        scale: pulseScale
      }}
      transition={{
        duration: 6, // Slow breathing rhythm
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      {/* Background ring with gradient */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r={radius}
        fill="none"
        stroke="url(#weather-gradient)"
        strokeWidth={themeConfig.animations.speed === 'fast' ? 1 : 3}
        opacity={0.4}
        style={{
          filter: `drop-shadow(0 0 8px ${themeConfig.colors.glow}40)`
        }}
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="weather-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={themeConfig.colors.secondary} stopOpacity={0.6} />
          <stop offset="50%" stopColor={themeConfig.colors.accent} stopOpacity={0.4} />
          <stop offset="100%" stopColor={themeConfig.colors.primary} stopOpacity={0.6} />
        </linearGradient>
      </defs>

      {/* Weather data points */}
      {weatherData.map((data, index) => {
        const angle = (index / weatherData.length) * 2 * Math.PI - Math.PI / 2;
        const x = center.x + Math.cos(angle) * radius;
        const y = center.y + Math.sin(angle) * radius;

        return (
          <motion.circle
            key={`weather-${index}`}
            cx={x}
            cy={y}
            r={4}
            fill={themeConfig.colors.accent}
            initial={{ scale: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 4,
              delay: index * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </motion.g>
  );
};
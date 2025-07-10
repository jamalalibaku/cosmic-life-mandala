/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect, useMemo } from 'react';
import { goldenRatio } from '../utils/golden-ratio';

interface SkyArcGradientProps {
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  theme: string;
  showSunMoon?: boolean;
  className?: string;
}

export const SkyArcGradient: React.FC<SkyArcGradientProps> = ({
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  theme,
  showSunMoon = true,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time-based colors and position
  const timeData = useMemo(() => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    // Convert to degrees (0° = midnight, 90° = 6am, 180° = noon, 270° = 6pm)
    const timeAngle = (totalMinutes / (24 * 60)) * 360;
    
    // Time of day colors
    const getTimeColors = (hour: number) => {
      if (hour >= 5 && hour < 7) {
        // Dawn
        return {
          primary: 'hsl(25 80% 60%)',
          secondary: 'hsl(45 70% 70%)',
          accent: 'hsl(15 90% 55%)'
        };
      } else if (hour >= 7 && hour < 11) {
        // Morning
        return {
          primary: 'hsl(200 60% 70%)',
          secondary: 'hsl(45 80% 75%)',
          accent: 'hsl(210 50% 80%)'
        };
      } else if (hour >= 11 && hour < 15) {
        // Noon
        return {
          primary: 'hsl(45 90% 80%)',
          secondary: 'hsl(50 95% 85%)',
          accent: 'hsl(40 85% 75%)'
        };
      } else if (hour >= 15 && hour < 18) {
        // Afternoon
        return {
          primary: 'hsl(35 75% 65%)',
          secondary: 'hsl(45 80% 70%)',
          accent: 'hsl(25 70% 60%)'
        };
      } else if (hour >= 18 && hour < 20) {
        // Sunset
        return {
          primary: 'hsl(15 85% 55%)',
          secondary: 'hsl(280 60% 60%)',
          accent: 'hsl(25 90% 50%)'
        };
      } else if (hour >= 20 && hour < 22) {
        // Dusk
        return {
          primary: 'hsl(240 50% 45%)',
          secondary: 'hsl(260 40% 50%)',
          accent: 'hsl(220 60% 40%)'
        };
      } else {
        // Night
        return {
          primary: 'hsl(240 30% 25%)',
          secondary: 'hsl(220 40% 20%)',
          accent: 'hsl(260 25% 30%)'
        };
      }
    };
    
    const colors = getTimeColors(hours);
    
    // Sun and moon positions (opposite each other)
    const sunAngle = timeAngle - 90; // Offset so noon is at top
    const moonAngle = sunAngle + 180;
    
    return {
      timeAngle,
      sunAngle,
      moonAngle,
      colors,
      hours,
      minutes,
      isDay: hours >= 6 && hours < 18
    };
  }, [currentTime]);

  // Theme-specific sky modifications
  const themeColors = useMemo(() => {
    const base = timeData.colors;
    
    switch (theme) {
      case 'tattoo':
        return {
          primary: base.primary.replace(/hsl\((\d+)/, 'hsl(0'),
          secondary: base.secondary.replace(/hsl\((\d+)/, 'hsl(15'),
          accent: base.accent.replace(/hsl\((\d+)/, 'hsl(345')
        };
      case 'floral':
        return {
          primary: base.primary.replace(/hsl\((\d+)/, 'hsl(300'),
          secondary: base.secondary.replace(/hsl\((\d+)/, 'hsl(320'),
          accent: base.accent.replace(/hsl\((\d+)/, 'hsl(280')
        };
      case 'techHUD':
        return {
          primary: base.primary.replace(/hsl\((\d+)/, 'hsl(180'),
          secondary: base.secondary.replace(/hsl\((\d+)/, 'hsl(200'),
          accent: base.accent.replace(/hsl\((\d+)/, 'hsl(160')
        };
      case 'noir':
        return {
          primary: 'hsl(0 0% 20%)',
          secondary: 'hsl(0 0% 15%)',
          accent: 'hsl(0 0% 25%)'
        };
      case 'vinyl':
        return {
          primary: base.primary.replace(/hsl\((\d+)/, 'hsl(45'),
          secondary: base.secondary.replace(/hsl\((\d+)/, 'hsl(50'),
          accent: base.accent.replace(/hsl\((\d+)/, 'hsl(40')
        };
      default:
        return base;
    }
  }, [theme, timeData.colors]);

  // Create gradient path for sky arc
  const createSkyPath = () => {
    const startAngle = -90; // Start at top
    const endAngle = 270; // Complete circle
    
    const outerStartX = centerX + Math.cos(goldenRatio.toRadians(startAngle)) * outerRadius;
    const outerStartY = centerY + Math.sin(goldenRatio.toRadians(startAngle)) * outerRadius;
    const outerEndX = centerX + Math.cos(goldenRatio.toRadians(endAngle)) * outerRadius;
    const outerEndY = centerY + Math.sin(goldenRatio.toRadians(endAngle)) * outerRadius;
    
    const innerStartX = centerX + Math.cos(goldenRatio.toRadians(startAngle)) * innerRadius;
    const innerStartY = centerY + Math.sin(goldenRatio.toRadians(startAngle)) * innerRadius;
    const innerEndX = centerX + Math.cos(goldenRatio.toRadians(endAngle)) * innerRadius;
    const innerEndY = centerY + Math.sin(goldenRatio.toRadians(endAngle)) * innerRadius;
    
    return `
      M ${outerStartX} ${outerStartY}
      A ${outerRadius} ${outerRadius} 0 1 1 ${outerEndX} ${outerEndY}
      L ${innerEndX} ${innerEndY}
      A ${innerRadius} ${innerRadius} 0 1 0 ${innerStartX} ${innerStartY}
      Z
    `;
  };

  return (
    <g className={`sky-arc-gradient ${className}`}>
      <defs>
        {/* Sky gradient based on time of day */}
        <linearGradient
          id={`sky-gradient-${theme}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientTransform={`rotate(${timeData.timeAngle} ${centerX} ${centerY})`}
        >
          <stop offset="0%" stopColor={themeColors.primary} stopOpacity="0.3" />
          <stop offset="25%" stopColor={themeColors.secondary} stopOpacity="0.2" />
          <stop offset="50%" stopColor={themeColors.accent} stopOpacity="0.4" />
          <stop offset="75%" stopColor={themeColors.secondary} stopOpacity="0.2" />
          <stop offset="100%" stopColor={themeColors.primary} stopOpacity="0.3" />
        </linearGradient>
        
        {/* Sun/Moon glow */}
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(45 100% 80%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(45 100% 60%)" stopOpacity="0.2" />
        </radialGradient>
        
        <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(240 30% 80%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(240 30% 60%)" stopOpacity="0.1" />
        </radialGradient>
        
        {/* Soft glow filter */}
        <filter id="sky-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Sky gradient arc */}
      <path
        d={createSkyPath()}
        fill={`url(#sky-gradient-${theme})`}
        filter="url(#sky-glow)"
        className="pointer-events-none"
      />

      {/* Time indicator line */}
      <line
        x1={centerX}
        y1={centerY}
        x2={centerX + Math.cos(goldenRatio.toRadians(timeData.timeAngle - 90)) * outerRadius}
        y2={centerY + Math.sin(goldenRatio.toRadians(timeData.timeAngle - 90)) * outerRadius}
        stroke={themeColors.accent}
        strokeWidth="2"
        opacity="0.5"
        filter="url(#sky-glow)"
        className="pointer-events-none"
      />

      {/* Sun and Moon indicators */}
      {showSunMoon && (
        <g className="celestial-bodies">
          {/* Sun */}
          <g
            transform={`translate(${centerX + Math.cos(goldenRatio.toRadians(timeData.sunAngle)) * (innerRadius + 15)}, ${centerY + Math.sin(goldenRatio.toRadians(timeData.sunAngle)) * (innerRadius + 15)})`}
            opacity={timeData.isDay ? 0.8 : 0.3}
          >
            <circle
              r="12"
              fill="url(#sun-glow)"
              filter="url(#sky-glow)"
            />
            <text
              textAnchor="middle"
              dy="4"
              className="text-sm font-light"
              fill="hsl(45 100% 90%)"
            >
              ☀️
            </text>
          </g>
          
          {/* Moon */}
          <g
            transform={`translate(${centerX + Math.cos(goldenRatio.toRadians(timeData.moonAngle)) * (innerRadius + 15)}, ${centerY + Math.sin(goldenRatio.toRadians(timeData.moonAngle)) * (innerRadius + 15)})`}
            opacity={!timeData.isDay ? 0.8 : 0.3}
          >
            <circle
              r="10"
              fill="url(#moon-glow)"
              filter="url(#sky-glow)"
            />
            <text
              textAnchor="middle"
              dy="3"
              className="text-sm font-light"
              fill="hsl(240 30% 90%)"
            >
              🌙
            </text>
          </g>
        </g>
      )}

      {/* Time display */}
      <g className="time-display">
        <text
          x={centerX}
          y={centerY - outerRadius - 30}
          textAnchor="middle"
          className="text-xs font-light opacity-60"
          fill={themeColors.accent}
        >
          {timeData.hours.toString().padStart(2, '0')}:{timeData.minutes.toString().padStart(2, '0')}
        </text>
      </g>
    </g>
  );
};
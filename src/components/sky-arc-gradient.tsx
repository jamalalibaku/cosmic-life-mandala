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
    
    // Time of day colors with smooth transitions
    const getTimeColors = (hour: number, minute: number) => {
      const totalHours = hour + minute / 60;
      
      // Define key time points with smooth interpolation
      if (totalHours >= 5 && totalHours < 6.5) {
        // Dawn transition
        const progress = (totalHours - 5) / 1.5;
        return {
          primary: `hsl(${15 + progress * 10} 80% ${60 + progress * 10}%)`,
          secondary: `hsl(${35 + progress * 10} 70% ${70 + progress * 5}%)`,
          accent: `hsl(${5 + progress * 10} 90% ${55 + progress * 5}%)`
        };
      } else if (totalHours >= 6.5 && totalHours < 10) {
        // Morning progression
        const progress = (totalHours - 6.5) / 3.5;
        return {
          primary: `hsl(${200 - progress * 50} ${60 + progress * 20}% ${70 + progress * 5}%)`,
          secondary: `hsl(${45} ${80}% ${75 + progress * 5}%)`,
          accent: `hsl(${210 - progress * 30} ${50 + progress * 30}% ${80}%)`
        };
      } else if (totalHours >= 10 && totalHours < 15) {
        // Midday peak
        const progress = Math.abs(totalHours - 12.5) / 2.5;
        return {
          primary: `hsl(${45} ${90 + progress * 5}% ${80 + progress * 5}%)`,
          secondary: `hsl(${50} ${95}% ${85}%)`,
          accent: `hsl(${40} ${85}% ${75}%)`
        };
      } else if (totalHours >= 15 && totalHours < 18) {
        // Afternoon warmth
        const progress = (totalHours - 15) / 3;
        return {
          primary: `hsl(${35 - progress * 10} ${75 + progress * 10}% ${65}%)`,
          secondary: `hsl(${45 - progress * 5} ${80}% ${70}%)`,
          accent: `hsl(${25 - progress * 5} ${70 + progress * 20}% ${60}%)`
        };
      } else if (totalHours >= 18 && totalHours < 20) {
        // Sunset magic
        const progress = (totalHours - 18) / 2;
        return {
          primary: `hsl(${15 - progress * 5} ${85}% ${55 - progress * 10}%)`,
          secondary: `hsl(${280 + progress * 20} ${60 + progress * 20}% ${60}%)`,
          accent: `hsl(${25} ${90}% ${50}%)`
        };
      } else if (totalHours >= 20 && totalHours < 22) {
        // Dusk transition
        const progress = (totalHours - 20) / 2;
        return {
          primary: `hsl(${240} ${50 - progress * 10}% ${45 - progress * 15}%)`,
          secondary: `hsl(${260} ${40}% ${50 - progress * 20}%)`,
          accent: `hsl(${220 + progress * 20} ${60 - progress * 20}% ${40 - progress * 10}%)`
        };
      } else {
        // Night depth
        const nightProgress = totalHours > 22 ? (totalHours - 22) / 7 : (totalHours + 2) / 7;
        return {
          primary: `hsl(${240} ${30 - nightProgress * 5}% ${25 - nightProgress * 10}%)`,
          secondary: `hsl(${220} ${40 - nightProgress * 10}% ${20 - nightProgress * 5}%)`,
          accent: `hsl(${260} ${25}% ${30 - nightProgress * 10}%)`
        };
      }
    };
    
    const colors = getTimeColors(hours, minutes);
    
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
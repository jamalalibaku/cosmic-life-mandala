/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TimeScale } from './fractal-time-zoom-manager';
import { useBreathingPulse } from '../hooks/use-breathing-pulse';

interface NowIndicatorProps {
  centerX: number;
  centerY: number;
  radius: number;
  timeScale: TimeScale;
  theme: string;
  className?: string;
}

export const NowIndicator: React.FC<NowIndicatorProps> = ({
  centerX,
  centerY,
  radius,
  timeScale,
  theme,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Enhanced pulse effect - like a time compass (Phase 19)
  const { applyBreathingRadius, applyBreathingOpacity } = useBreathingPulse({
    enabled: true,
    cycleMs: 4000, // Slightly slower for more meditative feel
    intensity: 0.2, // Slightly stronger pulse
    phaseOffset: 0,
    easingType: 'smooth'
  });

  // Calculate the "NOW" angle based on time scale
  const nowAngle = useMemo(() => {
    const now = currentTime;
    
    switch (timeScale) {
      case 'day': {
        // Position based on current time of day
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        return (totalMinutes / (24 * 60)) * 360 - 90; // -90 to start at top
      }
      
      case 'week': {
        // Position based on day of week
        const dayOfWeek = now.getDay(); // 0 = Sunday
        const hours = now.getHours();
        const totalHours = dayOfWeek * 24 + hours;
        return (totalHours / (7 * 24)) * 360 - 90;
      }
      
      case 'month': {
        // Position based on day of month
        const dayOfMonth = now.getDate() - 1; // 0-based
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        return (dayOfMonth / daysInMonth) * 360 - 90;
      }
      
      case 'year': {
        // Position based on day of year
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        const daysInYear = 365 + (now.getFullYear() % 4 === 0 ? 1 : 0);
        return (dayOfYear / daysInYear) * 360 - 90;
      }
      
      default:
        return -90; // Top position
    }
  }, [currentTime, timeScale]);

  // Calculate the position on the circle
  const nowPosition = useMemo(() => {
    const radians = (nowAngle * Math.PI) / 180;
    return {
      x: centerX + Math.cos(radians) * radius,
      y: centerY + Math.sin(radians) * radius
    };
  }, [centerX, centerY, radius, nowAngle]);

  // Theme-specific colors
  const themeColors = useMemo(() => {
    const colors = {
      default: { primary: 'hsl(45 80% 60%)', glow: 'hsl(45 100% 70%)' },
      tattoo: { primary: 'hsl(0 80% 50%)', glow: 'hsl(0 100% 60%)' },
      floral: { primary: 'hsl(300 60% 65%)', glow: 'hsl(320 80% 75%)' },
      techHUD: { primary: 'hsl(180 80% 50%)', glow: 'hsl(180 100% 60%)' },
      vinyl: { primary: 'hsl(45 70% 55%)', glow: 'hsl(45 90% 65%)' },
      noir: { primary: 'hsl(240 30% 40%)', glow: 'hsl(240 60% 50%)' },
      pastelParadise: { primary: 'hsl(280 50% 70%)', glow: 'hsl(300 70% 80%)' }
    };
    return colors[theme] || colors.default;
  }, [theme]);

  return (
    <g className={`now-indicator ${className}`}>
      <defs>
        <radialGradient
          id={`now-gradient-${theme}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={themeColors.glow} stopOpacity="1" />
          <stop offset="50%" stopColor={themeColors.primary} stopOpacity="0.8" />
          <stop offset="100%" stopColor={themeColors.primary} stopOpacity="0.3" />
        </radialGradient>
        
        <filter id="now-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="now-intense-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Radial guide line */}
      <line
        x1={centerX}
        y1={centerY}
        x2={nowPosition.x}
        y2={nowPosition.y}
        stroke={themeColors.primary}
        strokeWidth="2"
        opacity={applyBreathingOpacity(0.4)}
        strokeDasharray="2,4"
        filter="url(#now-glow)"
      />

      {/* Outer glow ring */}
      <circle
        cx={nowPosition.x}
        cy={nowPosition.y}
        r={applyBreathingRadius(20)}
        fill="none"
        stroke={themeColors.glow}
        strokeWidth="1"
        opacity={applyBreathingOpacity(0.3)}
        filter="url(#now-intense-glow)"
      />

      {/* Main NOW indicator */}
      <circle
        cx={nowPosition.x}
        cy={nowPosition.y}
        r={applyBreathingRadius(8)}
        fill={`url(#now-gradient-${theme})`}
        stroke={themeColors.glow}
        strokeWidth="2"
        filter="url(#now-glow)"
        className="pointer-events-none"
      />

      {/* Inner core */}
      <circle
        cx={nowPosition.x}
        cy={nowPosition.y}
        r={applyBreathingRadius(4)}
        fill="white"
        opacity={applyBreathingOpacity(0.9)}
        className="pointer-events-none"
      />

      {/* NOW label */}
      <text
        x={nowPosition.x}
        y={nowPosition.y - 25}
        textAnchor="middle"
        className="text-xs font-bold fill-white"
        filter="url(#now-glow)"
        opacity={applyBreathingOpacity(0.8)}
      >
        NOW
      </text>

      {/* Time display */}
      <text
        x={nowPosition.x}
        y={nowPosition.y + 35}
        textAnchor="middle"
        className="text-xs font-light"
        fill={themeColors.primary}
        opacity={applyBreathingOpacity(0.7)}
      >
        {timeScale === 'day' && currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        {timeScale === 'week' && currentTime.toLocaleDateString([], { weekday: 'short' })}
        {timeScale === 'month' && currentTime.getDate()}
        {timeScale === 'year' && currentTime.toLocaleDateString([], { month: 'short' })}
      </text>
    </g>
  );
};
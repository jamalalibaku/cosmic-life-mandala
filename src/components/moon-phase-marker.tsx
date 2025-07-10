/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useMemo } from 'react';
import { useBreathingPulse } from '@/hooks/use-breathing-pulse';

interface MoonPhaseMarkerProps {
  centerX: number;
  centerY: number;
  radius: number;
  theme: string;
  className?: string;
}

export const MoonPhaseMarker: React.FC<MoonPhaseMarkerProps> = ({
  centerX,
  centerY,
  radius,
  theme,
  className = ''
}) => {
  // Breathing pulse for gentle animation
  const { applyBreathingRadius, applyBreathingOpacity } = useBreathingPulse({
    enabled: true,
    cycleMs: 8000,
    intensity: 0.08,
    phaseOffset: Math.PI / 4,
    easingType: 'smooth'
  });

  // Calculate current moon phase (simplified)
  const moonPhase = useMemo(() => {
    const now = new Date();
    const dayOfCycle = (now.getTime() / (1000 * 60 * 60 * 24)) % 29.53; // Lunar cycle ~29.53 days
    
    if (dayOfCycle < 1) return { phase: 'new', icon: '🌑', name: 'New Moon' };
    if (dayOfCycle < 7.4) return { phase: 'waxing-crescent', icon: '🌒', name: 'Waxing Crescent' };
    if (dayOfCycle < 8.4) return { phase: 'first-quarter', icon: '🌓', name: 'First Quarter' };
    if (dayOfCycle < 14.8) return { phase: 'waxing-gibbous', icon: '🌔', name: 'Waxing Gibbous' };
    if (dayOfCycle < 15.8) return { phase: 'full', icon: '🌕', name: 'Full Moon' };
    if (dayOfCycle < 22.1) return { phase: 'waning-gibbous', icon: '🌖', name: 'Waning Gibbous' };
    if (dayOfCycle < 23.1) return { phase: 'last-quarter', icon: '🌗', name: 'Last Quarter' };
    return { phase: 'waning-crescent', icon: '🌘', name: 'Waning Crescent' };
  }, []);

  // Calculate moon position (enhanced with smooth orbit)
  const moonPosition = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Enhanced moonrise calculation with smooth transitions
    let moonriseHour = 18; // Default evening rise
    
    switch (moonPhase.phase) {
      case 'new': moonriseHour = 6; break;
      case 'waxing-crescent': moonriseHour = 9; break;
      case 'first-quarter': moonriseHour = 12; break;
      case 'waxing-gibbous': moonriseHour = 15; break;
      case 'full': moonriseHour = 18; break;
      case 'waning-gibbous': moonriseHour = 21; break;
      case 'last-quarter': moonriseHour = 0; break;
      case 'waning-crescent': moonriseHour = 3; break;
    }
    
    // Position at 45-60° (top-right arc as specified)
    const baseAngle = 45 + (15 * Math.sin((hour + minute / 60) * Math.PI / 12)); // Slow orbital drift
    const radians = (baseAngle * Math.PI) / 180;
    
    // Enhanced visibility calculation
    const isVisible = hour >= moonriseHour - 2 && hour <= moonriseHour + 10;
    const visibility = isVisible ? 1 : 0.4;
    
    return {
      x: centerX + Math.cos(radians) * radius,
      y: centerY + Math.sin(radians) * radius,
      angle: baseAngle,
      visibility,
      isOptimalViewing: isVisible && (hour >= 20 || hour <= 6)
    };
  }, [centerX, centerY, radius, moonPhase.phase]);

  // Theme-specific colors
  const themeColors = useMemo(() => {
    const colors = {
      default: { 
        primary: 'hsl(240 30% 80%)', 
        glow: 'hsl(240 50% 90%)',
        orbit: 'hsl(240 20% 60%)'
      },
      floral: { 
        primary: 'hsl(280 40% 85%)', 
        glow: 'hsl(300 60% 95%)',
        orbit: 'hsl(280 30% 70%)'
      },
      noir: { 
        primary: 'hsl(240 20% 70%)', 
        glow: 'hsl(240 30% 80%)',
        orbit: 'hsl(240 15% 50%)'
      },
      vinyl: { 
        primary: 'hsl(50 30% 80%)', 
        glow: 'hsl(50 50% 90%)',
        orbit: 'hsl(50 20% 60%)'
      },
      techHUD: { 
        primary: 'hsl(180 40% 80%)', 
        glow: 'hsl(180 60% 90%)',
        orbit: 'hsl(180 30% 60%)'
      }
    };
    return colors[theme] || colors.default;
  }, [theme]);

  return (
    <g className={`moon-phase-marker ${className}`}>
      <defs>
        <radialGradient
          id={`moon-glow-${theme}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={themeColors.glow} stopOpacity="0.8" />
          <stop offset="70%" stopColor={themeColors.primary} stopOpacity="0.4" />
          <stop offset="100%" stopColor={themeColors.primary} stopOpacity="0.1" />
        </radialGradient>
        
        <filter id="moon-soft-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Orbital path indicator */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={themeColors.orbit}
        strokeWidth="1"
        opacity={applyBreathingOpacity(0.15)}
        strokeDasharray="1,6"
      />

      {/* Moon glow */}
      <circle
        cx={moonPosition.x}
        cy={moonPosition.y}
        r={applyBreathingRadius(12)}
        fill={`url(#moon-glow-${theme})`}
        opacity={applyBreathingOpacity(moonPosition.visibility * 0.6)}
        filter="url(#moon-soft-glow)"
      />

      {/* Moon marker */}
      <circle
        cx={moonPosition.x}
        cy={moonPosition.y}
        r={6}
        fill={themeColors.primary}
        stroke={themeColors.glow}
        strokeWidth="1"
        opacity={moonPosition.visibility}
      />

      {/* Moon phase icon */}
      <text
        x={moonPosition.x}
        y={moonPosition.y + 2}
        textAnchor="middle"
        className="text-xs"
        opacity={moonPosition.visibility}
      >
        {moonPhase.icon}
      </text>

      {/* Enhanced moon phase label with tooltip */}
      <g className="moon-label" opacity={applyBreathingOpacity(0.8)}>
        {/* Subtle glow trail */}
        <circle
          cx={moonPosition.x}
          cy={moonPosition.y}
          r="20"
          fill="none"
          stroke={themeColors.orbit}
          strokeWidth="1"
          opacity={moonPosition.visibility * 0.15}
          strokeDasharray="1,4"
        />
        
        <text
          x={moonPosition.x}
          y={moonPosition.y - 15}
          textAnchor="middle"
          className="text-xs font-light"
          fill={themeColors.primary}
          opacity={moonPosition.visibility * 0.9}
        >
          {moonPhase.name}
        </text>
        
        {/* Enhanced visibility context */}
        <text
          x={moonPosition.x}
          y={moonPosition.y + 25}
          textAnchor="middle"
          className="text-xs font-light"
          fill={themeColors.primary}
          opacity={moonPosition.visibility * 0.7}
        >
          {moonPosition.isOptimalViewing ? 'Prime viewing' : 'Visible tonight'}
        </text>
      </g>
    </g>
  );
};
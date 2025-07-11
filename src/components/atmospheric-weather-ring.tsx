/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useMemo, useState } from 'react';
import { WeatherSegment, WeatherCondition } from './weather-sunburst-ring';
import { WeatherTooltipOverlay } from './weather-tooltip-overlay';
import { goldenRatio } from '../utils/golden-ratio';
import { useSkyDrift } from '../hooks/use-sky-drift';

interface AtmosphericWeatherRingProps {
  weatherData: WeatherSegment[];
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  theme?: string;
  showDebug?: boolean;
  className?: string;
}

// Atmospheric visual definitions for each weather condition
const atmosphericStyles: Record<WeatherCondition, {
  baseColor: string;
  accentColor: string;
  pattern: 'radial' | 'flowing' | 'scattered' | 'pulsing' | 'layered';
  intensity: number;
}> = {
  'sunny': {
    baseColor: 'hsl(45 100% 70%)',
    accentColor: 'hsl(35 90% 80%)',
    pattern: 'radial',
    intensity: 0.9
  },
  'cloudy': {
    baseColor: 'hsl(220 20% 60%)',
    accentColor: 'hsl(220 15% 70%)',
    pattern: 'flowing',
    intensity: 0.6
  },
  'rainy': {
    baseColor: 'hsl(200 80% 50%)',
    accentColor: 'hsl(200 70% 60%)',
    pattern: 'scattered',
    intensity: 0.8
  },
  'storm': {
    baseColor: 'hsl(260 60% 40%)',
    accentColor: 'hsl(280 70% 50%)',
    pattern: 'pulsing',
    intensity: 1.0
  },
  'snowy': {
    baseColor: 'hsl(180 30% 90%)',
    accentColor: 'hsl(180 40% 95%)',
    pattern: 'scattered',
    intensity: 0.7
  },
  'clear-night': {
    baseColor: 'hsl(230 50% 20%)',
    accentColor: 'hsl(240 60% 30%)',
    pattern: 'layered',
    intensity: 0.4
  }
};

export const AtmosphericWeatherRing: React.FC<AtmosphericWeatherRingProps> = ({
  weatherData,
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  theme = 'cosmic',
  showDebug = false,
  className = ''
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  
  const skyDrift = useSkyDrift({ driftSpeed: 1, enabled: true });
  
  const segments = useMemo(() => {
    const segmentAngle = 360 / 24;
    
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const weatherSegment = weatherData.find(w => w.hour === hour);
      const condition = weatherSegment?.condition || 'clear-night';
      const temperature = weatherSegment?.temperature;
      
      const startAngle = i * segmentAngle - 90; // Start from top
      const endAngle = startAngle + segmentAngle;
      const midAngle = startAngle + (segmentAngle / 2);
      
      const style = atmosphericStyles[condition];
      
      return {
        hour,
        condition,
        temperature,
        startAngle,
        endAngle,
        midAngle,
        style
      };
    });
  }, [weatherData]);

  const createAtmosphericPath = (segment: typeof segments[0]) => {
    const { startAngle, endAngle } = segment;
    const startRad = goldenRatio.toRadians(startAngle);
    const endRad = goldenRatio.toRadians(endAngle);
    
    const innerStartX = centerX + Math.cos(startRad) * innerRadius;
    const innerStartY = centerY + Math.sin(startRad) * innerRadius;
    const outerStartX = centerX + Math.cos(startRad) * outerRadius;
    const outerStartY = centerY + Math.sin(startRad) * outerRadius;
    
    const innerEndX = centerX + Math.cos(endRad) * innerRadius;
    const innerEndY = centerY + Math.sin(endRad) * innerRadius;
    const outerEndX = centerX + Math.cos(endRad) * outerRadius;
    const outerEndY = centerY + Math.sin(endRad) * outerRadius;
    
    return `
      M ${innerStartX} ${innerStartY}
      L ${outerStartX} ${outerStartY}
      A ${outerRadius} ${outerRadius} 0 0 1 ${outerEndX} ${outerEndY}
      L ${innerEndX} ${innerEndY}
      A ${innerRadius} ${innerRadius} 0 0 0 ${innerStartX} ${innerStartY}
      Z
    `;
  };

  const createAtmosphericPattern = (segment: typeof segments[0], index: number) => {
    const { style, midAngle, condition } = segment;
    const midRad = goldenRatio.toRadians(midAngle);
    const patternRadius = (innerRadius + outerRadius) / 2;
    const centerX_pattern = centerX + Math.cos(midRad) * patternRadius;
    const centerY_pattern = centerY + Math.sin(midRad) * patternRadius;
    
    switch (style.pattern) {
      case 'radial': // Sun rays
        return Array.from({ length: 6 }, (_, i) => {
          const rayAngle = midAngle + (i - 3) * 3;
          const rayRad = goldenRatio.toRadians(rayAngle);
          const rayLength = 15 + skyDrift.atmosphericPulse * 5;
          const rayStartR = innerRadius + 5;
          const rayEndR = rayStartR + rayLength;
          
          const rayStartX = centerX + Math.cos(rayRad) * rayStartR;
          const rayStartY = centerY + Math.sin(rayRad) * rayStartR;
          const rayEndX = centerX + Math.cos(rayRad) * rayEndR;
          const rayEndY = centerY + Math.sin(rayRad) * rayEndR;
          
          return (
            <line
              key={`ray-${index}-${i}`}
              x1={rayStartX}
              y1={rayStartY}
              x2={rayEndX}
              y2={rayEndY}
              stroke={style.accentColor}
              strokeWidth="2"
              opacity={0.6 + skyDrift.atmosphericPulse * 0.3}
              className="pointer-events-none"
            />
          );
        });
        
      case 'flowing': // Cloud wisps
        return Array.from({ length: 3 }, (_, i) => {
          const wispOffset = skyDrift.cloudOffset + i * 15;
          const wispAngle = midAngle + Math.sin(goldenRatio.toRadians(wispOffset)) * 8;
          const wispRad = goldenRatio.toRadians(wispAngle);
          const wispR = patternRadius + Math.sin(goldenRatio.toRadians(wispOffset * 2)) * 8;
          
          const wispX = centerX + Math.cos(wispRad) * wispR;
          const wispY = centerY + Math.sin(wispRad) * wispR;
          
          return (
            <circle
              key={`wisp-${index}-${i}`}
              cx={wispX}
              cy={wispY}
              r={4 + i}
              fill={style.baseColor}
              opacity={0.3 - i * 0.1}
              className="pointer-events-none"
            />
          );
        });
        
      case 'scattered': // Rain drops or snow flakes
        return Array.from({ length: 8 }, (_, i) => {
          const dropAngle = midAngle + (i - 4) * 2;
          const dropRad = goldenRatio.toRadians(dropAngle);
          const dropR = innerRadius + 10 + (i % 3) * 8;
          const dropSpeed = condition === 'snowy' ? 0.5 : 2;
          const dropOffset = (skyDrift.cloudOffset * dropSpeed + i * 30) % 60;
          
          const dropX = centerX + Math.cos(dropRad) * dropR;
          const dropY = centerY + Math.sin(dropRad) * dropR + dropOffset - 30;
          
          if (condition === 'snowy') {
            return (
              <circle
                key={`drop-${index}-${i}`}
                cx={dropX}
                cy={dropY}
                r={1.5}
                fill={style.accentColor}
                opacity={0.6}
                className="pointer-events-none"
              />
            );
          } else {
            return (
              <line
                key={`drop-${index}-${i}`}
                x1={dropX}
                y1={dropY}
                x2={dropX}
                y2={dropY + 6}
                stroke={style.baseColor}
                strokeWidth="1"
                opacity={0.5}
                className="pointer-events-none"
              />
            );
          }
        });
        
      case 'pulsing': // Storm energy
        return (
          <circle
            key={`pulse-${index}`}
            cx={centerX_pattern}
            cy={centerY_pattern}
            r={8 + skyDrift.atmosphericPulse * 4}
            fill="none"
            stroke={style.accentColor}
            strokeWidth="2"
            opacity={0.4 + skyDrift.atmosphericPulse * 0.4}
            className="pointer-events-none"
          />
        );
        
      default: // Layered (night)
        return (
          <circle
            key={`layer-${index}`}
            cx={centerX_pattern}
            cy={centerY_pattern}
            r={3}
            fill={style.accentColor}
            opacity={0.3 + skyDrift.atmosphericPulse * 0.2}
            className="pointer-events-none"
          />
        );
    }
  };

  const handleMouseEnter = (segmentIndex: number, event: React.MouseEvent) => {
    setHoveredSegment(segmentIndex);
    const segment = segments[segmentIndex];
    const midRad = goldenRatio.toRadians(segment.midAngle);
    const tooltipRadius = outerRadius + 20;
    setTooltipPos({
      x: centerX + Math.cos(midRad) * tooltipRadius,
      y: centerY + Math.sin(midRad) * tooltipRadius
    });
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
    setTooltipPos(null);
  };

  return (
    <g className={`atmospheric-weather-ring ${className}`}>
      <defs>
        {/* Sky gradient for atmospheric base */}
        <radialGradient
          id="atmospheric-base"
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor="hsl(220 30% 15%)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="hsl(220 30% 25%)" stopOpacity="0.3" />
        </radialGradient>
        
        {/* Atmospheric filter for organic textures */}
        <filter id="atmospheric-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Atmospheric base layer */}
      <circle
        cx={centerX}
        cy={centerY}
        r={(innerRadius + outerRadius) / 2}
        fill="url(#atmospheric-base)"
        stroke="none"
        strokeWidth={outerRadius - innerRadius}
        opacity="0.2"
        className="pointer-events-none"
      />

      {/* Weather segments with organic patterns */}
      {segments.map((segment, index) => (
        <g key={`atmospheric-segment-${index}`} className="atmospheric-segment">
          {/* Base atmospheric segment */}
          <path
            d={createAtmosphericPath(segment)}
            fill={segment.style.baseColor}
            stroke={segment.style.accentColor}
            strokeWidth="0.5"
            opacity={hoveredSegment === index ? 0.6 : 0.3}
            filter="url(#atmospheric-glow)"
            onMouseEnter={(e) => handleMouseEnter(index, e)}
            onMouseLeave={handleMouseLeave}
            className="transition-all duration-300 ease-out cursor-pointer"
          />
          
          {/* Atmospheric patterns */}
          {createAtmosphericPattern(segment, index)}
          
          {/* Debug overlay */}
          {showDebug && (
            <text
              x={centerX + Math.cos(goldenRatio.toRadians(segment.midAngle)) * ((innerRadius + outerRadius) / 2)}
              y={centerY + Math.sin(goldenRatio.toRadians(segment.midAngle)) * ((innerRadius + outerRadius) / 2)}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-xs fill-white pointer-events-none"
            >
              {segment.hour}:{segment.condition}
            </text>
          )}
        </g>
      ))}

      {/* Hover tooltip */}
      {hoveredSegment !== null && tooltipPos && (
        <g className="atmospheric-tooltip">
          <rect
            x={tooltipPos.x - 35}
            y={tooltipPos.y - 30}
            width="70"
            height="45"
            rx="4"
            fill="rgba(0, 0, 0, 0.9)"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
          <text
            x={tooltipPos.x}
            y={tooltipPos.y - 15}
            textAnchor="middle"
            className="fill-white text-xs font-medium"
          >
            {segments[hoveredSegment].hour.toString().padStart(2, '0')}:00
          </text>
          <text
            x={tooltipPos.x}
            y={tooltipPos.y}
            textAnchor="middle"
            className="fill-gray-300 text-xs"
          >
            {segments[hoveredSegment].condition}
          </text>
          {segments[hoveredSegment].temperature && (
            <text
              x={tooltipPos.x}
              y={tooltipPos.y + 15}
              textAnchor="middle"
              className="fill-gray-300 text-xs"
            >
              {segments[hoveredSegment].temperature}°C
            </text>
          )}
        </g>
      )}
    </g>
  );
};
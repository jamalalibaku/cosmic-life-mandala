/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useMemo, useState } from 'react';
import { WeatherSegment } from './weather-sunburst-ring';
import { goldenRatio } from '../utils/golden-ratio';
import { useSkyDrift } from '../hooks/use-sky-drift';
import { useBreathingPulse } from '../hooks/use-breathing-pulse';

interface FluidWeatherContinuumProps {
  weatherData: WeatherSegment[];
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  theme?: string;
  weatherStyle?: 'canvas' | 'svg' | 'gradient';
  showWeatherSegments?: boolean;
  showSkyPulse?: boolean;
  className?: string;
}

export const FluidWeatherContinuum: React.FC<FluidWeatherContinuumProps> = ({
  weatherData,
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  theme = 'cosmic',
  weatherStyle = 'gradient',
  showWeatherSegments = false,
  showSkyPulse = true,
  className = ''
}) => {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  
  const skyDrift = useSkyDrift({ driftSpeed: 0.5, enabled: true });
  const { breathingState } = useBreathingPulse({ 
    enabled: showSkyPulse,
    cycleMs: 6000,
    intensity: 0.1,
    phaseOffset: 0,
    easingType: 'smooth'
  });

  // Create continuous weather gradient stops
  const weatherGradient = useMemo(() => {
    const stops = [];
    const currentHour = new Date().getHours();
    
    // Create smooth blended transitions between weather conditions
    for (let i = 0; i < 24; i++) {
      const hour = (i + currentHour) % 24;
      const weatherSegment = weatherData.find(w => w.hour === hour);
      const condition = weatherSegment?.condition || 'clear-night';
      const percentage = (i / 24) * 100;
      
      // Get daylight factor for realistic sky blending
      const isDaylight = hour >= 6 && hour <= 18;
      const dawnDusk = (hour >= 5 && hour <= 7) || (hour >= 17 && hour <= 19);
      
      let color;
      switch (condition) {
        case 'sunny':
          color = isDaylight 
            ? `hsl(45 ${80 + breathingState.phase * 15}% ${70 + breathingState.phase * 10}%)`
            : 'hsl(35 60% 30%)';
          break;
        case 'cloudy':
          color = isDaylight
            ? `hsl(220 ${20 + breathingState.phase * 10}% ${60 + breathingState.phase * 5}%)`
            : 'hsl(220 30% 25%)';
          break;
        case 'rainy':
          color = `hsl(200 ${70 + breathingState.phase * 10}% ${isDaylight ? 45 : 25}%)`;
          break;
        case 'storm':
          color = `hsl(260 ${50 + breathingState.phase * 20}% ${isDaylight ? 35 : 15}%)`;
          break;
        case 'snowy':
          color = isDaylight
            ? `hsl(180 ${25 + breathingState.phase * 10}% ${85 + breathingState.phase * 5}%)`
            : 'hsl(180 40% 70%)';
          break;
        default: // clear-night
          if (dawnDusk) {
            color = 'hsl(25 70% 50%)'; // Dawn/dusk glow
          } else if (isDaylight) {
            color = 'hsl(200 60% 75%)'; // Clear day sky
          } else {
            color = `hsl(230 ${40 + breathingState.phase * 10}% ${15 + breathingState.phase * 5}%)`;
          }
      }
      
      stops.push({ offset: percentage, color, condition, hour });
    }
    
    return stops;
  }, [weatherData, breathingState.phase]);

  // Create flowing weather patterns
  const createFlowingPatterns = () => {
    const patterns = [];
    
    weatherGradient.forEach((stop, index) => {
      const angle = (stop.offset / 100) * 360 - 90;
      const rad = goldenRatio.toRadians(angle);
      const patternRadius = (innerRadius + outerRadius) / 2;
      
      // Wind trails
      if (stop.condition === 'cloudy' || stop.condition === 'storm') {
        const windStrength = stop.condition === 'storm' ? 2 : 1;
        for (let i = 0; i < 3 * windStrength; i++) {
          const windAngle = angle + skyDrift.windAngle + (i * 15);
          const windRad = goldenRatio.toRadians(windAngle);
          const windR = patternRadius + Math.sin(goldenRatio.toRadians(skyDrift.cloudOffset + i * 30)) * 8;
          const windLength = 20 + skyDrift.atmosphericPulse * 10;
          
          const windX1 = centerX + Math.cos(windRad) * (windR - windLength/2);
          const windY1 = centerY + Math.sin(windRad) * (windR - windLength/2);
          const windX2 = centerX + Math.cos(windRad) * (windR + windLength/2);
          const windY2 = centerY + Math.sin(windRad) * (windR + windLength/2);
          
          patterns.push(
            <path
              key={`wind-${index}-${i}`}
              d={`M ${windX1} ${windY1} Q ${centerX + Math.cos(windRad) * windR} ${centerY + Math.sin(windRad) * windR} ${windX2} ${windY2}`}
              stroke={stop.color}
              strokeWidth={windStrength}
              fill="none"
              opacity={0.3 + skyDrift.atmosphericPulse * 0.2}
              className="pointer-events-none"
            />
          );
        }
      }
      
      // Solar tongues/rays
      if (stop.condition === 'sunny') {
        for (let i = 0; i < 8; i++) {
          const rayAngle = angle + (i - 4) * 5 + skyDrift.windAngle * 0.2;
          const rayRad = goldenRatio.toRadians(rayAngle);
          const rayLength = 15 + breathingState.phase * 8 + skyDrift.atmosphericPulse * 5;
          const rayR = outerRadius + 5;
          
          const rayX1 = centerX + Math.cos(rayRad) * rayR;
          const rayY1 = centerY + Math.sin(rayRad) * rayR;
          const rayX2 = centerX + Math.cos(rayRad) * (rayR + rayLength);
          const rayY2 = centerY + Math.sin(rayRad) * (rayR + rayLength);
          
          patterns.push(
            <line
              key={`ray-${index}-${i}`}
              x1={rayX1}
              y1={rayY1}
              x2={rayX2}
              y2={rayY2}
              stroke={stop.color}
              strokeWidth="2"
              opacity={0.4 + breathingState.phase * 0.3}
              className="pointer-events-none"
            />
          );
        }
      }
      
      // Rain morphs
      if (stop.condition === 'rainy') {
        for (let i = 0; i < 12; i++) {
          const dropAngle = angle + (i - 6) * 3;
          const dropRad = goldenRatio.toRadians(dropAngle);
          const dropR = innerRadius + 8 + (i % 3) * 6;
          const dropSpeed = 1.5;
          const dropOffset = (skyDrift.cloudOffset * dropSpeed + i * 20) % 40;
          
          const dropX = centerX + Math.cos(dropRad) * dropR;
          const dropY = centerY + Math.sin(dropRad) * dropR + dropOffset - 20;
          
          patterns.push(
            <line
              key={`rain-${index}-${i}`}
              x1={dropX}
              y1={dropY}
              x2={dropX + 1}
              y2={dropY + 8}
              stroke={stop.color}
              strokeWidth="1"
              opacity={0.5}
              className="pointer-events-none"
            />
          );
        }
      }
      
      // Snow flakes (floating, no fall)
      if (stop.condition === 'snowy') {
        for (let i = 0; i < 6; i++) {
          const flakeAngle = angle + (i - 3) * 4;
          const flakeRad = goldenRatio.toRadians(flakeAngle + skyDrift.cloudOffset * 0.1);
          const flakeR = patternRadius + Math.sin(goldenRatio.toRadians(skyDrift.windAngle + i * 60)) * 5;
          
          const flakeX = centerX + Math.cos(flakeRad) * flakeR;
          const flakeY = centerY + Math.sin(flakeRad) * flakeR;
          
          patterns.push(
            <circle
              key={`snow-${index}-${i}`}
              cx={flakeX}
              cy={flakeY}
              r={2}
              fill={stop.color}
              opacity={0.6 + skyDrift.atmosphericPulse * 0.2}
              className="pointer-events-none"
            />
          );
        }
      }
      
      // Storm electric flicker
      if (stop.condition === 'storm') {
        const flickerIntensity = Math.sin(Date.now() / 200) * 0.5 + 0.5;
        patterns.push(
          <circle
            key={`storm-${index}`}
            cx={centerX + Math.cos(rad) * patternRadius}
            cy={centerY + Math.sin(rad) * patternRadius}
            r={6 + flickerIntensity * 4}
            fill="none"
            stroke={stop.color}
            strokeWidth="2"
            opacity={0.3 + flickerIntensity * 0.4}
            className="pointer-events-none"
          />
        );
      }
    });
    
    return patterns;
  };

  // Create the continuous ring path
  const createContinuousRing = () => {
    const startAngle = -90;
    const endAngle = 270;
    
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
    <g className={`fluid-weather-continuum ${className}`}>
      <defs>
        {/* Continuous weather gradient */}
        <linearGradient
          id={`fluid-weather-gradient-${theme}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientTransform={`rotate(${skyDrift.cloudOffset} ${centerX} ${centerY})`}
        >
          {weatherGradient.map((stop, index) => (
            <stop
              key={index}
              offset={`${stop.offset}%`}
              stopColor={stop.color}
              stopOpacity="0.8"
            />
          ))}
        </linearGradient>
        
        {/* Atmospheric blur filter */}
        <filter id="atmospheric-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feOffset in="coloredBlur" dx="0" dy="1" result="offsetBlur"/>
          <feMerge>
            <feMergeNode in="offsetBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Depth layering filter */}
        <filter id="depth-layer" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="hsl(220 30% 10%)" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Continuous weather ring */}
      <path
        d={createContinuousRing()}
        fill={`url(#fluid-weather-gradient-${theme})`}
        filter="url(#atmospheric-blur)"
        opacity={0.6 + breathingState.phase * 0.2}
        className="pointer-events-none"
      />
      
      {/* Depth layer for atmospheric feeling */}
      <path
        d={createContinuousRing()}
        fill="none"
        stroke={`url(#fluid-weather-gradient-${theme})`}
        strokeWidth="1"
        filter="url(#depth-layer)"
        opacity={0.3}
        className="pointer-events-none"
      />

      {/* Flowing weather patterns */}
      <g className="flowing-patterns">
        {createFlowingPatterns()}
      </g>

      {/* Optional segment debugging overlay */}
      {showWeatherSegments && (
        <g className="weather-segments-debug">
          {weatherGradient.map((stop, index) => {
            const angle = (stop.offset / 100) * 360 - 90;
            const rad = goldenRatio.toRadians(angle);
            const labelRadius = (innerRadius + outerRadius) / 2;
            
            return (
              <g key={index}>
                <line
                  x1={centerX + Math.cos(rad) * innerRadius}
                  y1={centerY + Math.sin(rad) * innerRadius}
                  x2={centerX + Math.cos(rad) * outerRadius}
                  y2={centerY + Math.sin(rad) * outerRadius}
                  stroke="hsl(0 0% 100%)"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <text
                  x={centerX + Math.cos(rad) * labelRadius}
                  y={centerY + Math.sin(rad) * labelRadius}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-xs fill-white opacity-60 pointer-events-none"
                >
                  {stop.hour}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
};
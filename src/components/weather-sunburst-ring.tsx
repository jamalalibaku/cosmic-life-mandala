import React, { useMemo, useState } from 'react';
import { goldenRatio } from '../utils/golden-ratio';

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'storm' | 'snowy' | 'clear-night';

export type WeatherSegment = {
  hour: number; // 0–23
  condition: WeatherCondition;
  temperature?: number;
}

interface WeatherSunburstRingProps {
  weatherData: WeatherSegment[];
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  theme?: 'cosmic' | 'natural' | 'minimal';
  className?: string;
}

const weatherColorMap: Record<WeatherCondition, { primary: string; secondary: string; glow: string }> = {
  'sunny': {
    primary: 'hsl(45 100% 70%)',
    secondary: 'hsl(35 90% 60%)',
    glow: 'hsl(45 100% 80%)'
  },
  'cloudy': {
    primary: 'hsl(220 20% 60%)',
    secondary: 'hsl(220 15% 50%)',
    glow: 'hsl(220 25% 70%)'
  },
  'rainy': {
    primary: 'hsl(200 80% 50%)',
    secondary: 'hsl(200 70% 40%)',
    glow: 'hsl(200 85% 60%)'
  },
  'storm': {
    primary: 'hsl(260 60% 40%)',
    secondary: 'hsl(260 50% 30%)',
    glow: 'hsl(260 70% 50%)'
  },
  'snowy': {
    primary: 'hsl(180 30% 90%)',
    secondary: 'hsl(180 20% 80%)',
    glow: 'hsl(180 40% 95%)'
  },
  'clear-night': {
    primary: 'hsl(230 50% 20%)',
    secondary: 'hsl(230 40% 15%)',
    glow: 'hsl(230 60% 30%)'
  }
};

export const WeatherSunburstRing: React.FC<WeatherSunburstRingProps> = ({
  weatherData,
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  theme = 'cosmic',
  className = ''
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const segments = useMemo(() => {
    // Create 24 segments with proper rotation (current hour at top)
    const currentHour = new Date().getHours();
    const segmentAngle = 360 / 24; // 15 degrees per hour
    const rotationOffset = -currentHour * segmentAngle - 90; // -90 to start from top
    
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const weatherSegment = weatherData.find(w => w.hour === hour);
      const condition = weatherSegment?.condition || 'clear-night';
      const temperature = weatherSegment?.temperature;
      
      const startAngle = rotationOffset + (i * segmentAngle);
      const endAngle = startAngle + segmentAngle;
      const midAngle = startAngle + (segmentAngle / 2);
      
      // Convert to radians for calculations
      const startRad = goldenRatio.toRadians(startAngle);
      const endRad = goldenRatio.toRadians(endAngle);
      const midRad = goldenRatio.toRadians(midAngle);
      
      // Calculate segment path
      const innerStartX = centerX + Math.cos(startRad) * innerRadius;
      const innerStartY = centerY + Math.sin(startRad) * innerRadius;
      const outerStartX = centerX + Math.cos(startRad) * outerRadius;
      const outerStartY = centerY + Math.sin(startRad) * outerRadius;
      
      const innerEndX = centerX + Math.cos(endRad) * innerRadius;
      const innerEndY = centerY + Math.sin(endRad) * innerRadius;
      const outerEndX = centerX + Math.cos(endRad) * outerRadius;
      const outerEndY = centerY + Math.sin(endRad) * outerRadius;
      
      // Create path with small gaps between segments
      const gapAngle = goldenRatio.toRadians(1); // 1 degree gap
      const adjustedStartRad = startRad + gapAngle/2;
      const adjustedEndRad = endRad - gapAngle/2;
      
      const adjustedInnerStartX = centerX + Math.cos(adjustedStartRad) * innerRadius;
      const adjustedInnerStartY = centerY + Math.sin(adjustedStartRad) * innerRadius;
      const adjustedOuterStartX = centerX + Math.cos(adjustedStartRad) * outerRadius;
      const adjustedOuterStartY = centerY + Math.sin(adjustedStartRad) * outerRadius;
      
      const adjustedInnerEndX = centerX + Math.cos(adjustedEndRad) * innerRadius;
      const adjustedInnerEndY = centerY + Math.sin(adjustedEndRad) * innerRadius;
      const adjustedOuterEndX = centerX + Math.cos(adjustedEndRad) * outerRadius;
      const adjustedOuterEndY = centerY + Math.sin(adjustedEndRad) * outerRadius;
      
      const pathData = [
        `M ${adjustedInnerStartX} ${adjustedInnerStartY}`,
        `L ${adjustedOuterStartX} ${adjustedOuterStartY}`,
        `A ${outerRadius} ${outerRadius} 0 0 1 ${adjustedOuterEndX} ${adjustedOuterEndY}`,
        `L ${adjustedInnerEndX} ${adjustedInnerEndY}`,
        `A ${innerRadius} ${innerRadius} 0 0 0 ${adjustedInnerStartX} ${adjustedInnerStartY}`,
        'Z'
      ].join(' ');
      
      // Tooltip position
      const tooltipRadius = (innerRadius + outerRadius) / 2;
      const tooltipX = centerX + Math.cos(midRad) * tooltipRadius;
      const tooltipY = centerY + Math.sin(midRad) * tooltipRadius;
      
      return {
        hour,
        condition,
        temperature,
        pathData,
        midAngle,
        tooltipX,
        tooltipY,
        colors: weatherColorMap[condition]
      };
    });
  }, [weatherData, centerX, centerY, innerRadius, outerRadius]);

  const handleMouseEnter = (segmentIndex: number, event: React.MouseEvent) => {
    setHoveredSegment(segmentIndex);
    const segment = segments[segmentIndex];
    setTooltipPos({ x: segment.tooltipX, y: segment.tooltipY });
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
    setTooltipPos(null);
  };

  return (
    <g className={`weather-sunburst-ring ${className}`}>
      {/* Gradient definitions */}
      <defs>
        {Object.entries(weatherColorMap).map(([condition, colors]) => (
          <radialGradient
            key={`weather-gradient-${condition}`}
            id={`weather-gradient-${condition}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor={colors.glow} stopOpacity="0.8" />
            <stop offset="50%" stopColor={colors.primary} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.7" />
          </radialGradient>
        ))}
        
        <filter id="weather-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Weather segments */}
      {segments.map((segment, index) => (
        <g key={`weather-segment-${index}`} className="weather-segment">
          <path
            d={segment.pathData}
            fill={`url(#weather-gradient-${segment.condition})`}
            stroke={segment.colors.glow}
            strokeWidth="0.5"
            opacity={hoveredSegment === index ? 1 : 0.8}
            filter="url(#weather-glow)"
            onMouseEnter={(e) => handleMouseEnter(index, e)}
            onMouseLeave={handleMouseLeave}
            className="transition-all duration-300 ease-out cursor-pointer"
            style={{
              transform: hoveredSegment === index ? 'scale(1.05)' : 'scale(1)',
              transformOrigin: `${centerX}px ${centerY}px`,
              animationDelay: `${index * 50}ms`
            }}
          />
          
          {/* Subtle animation pulse for active conditions */}
          {(segment.condition === 'rainy' || segment.condition === 'storm') && (
            <path
              d={segment.pathData}
              fill="none"
              stroke={segment.colors.glow}
              strokeWidth="1"
              opacity="0.4"
              className="animate-pulse"
              style={{
                animationDuration: '2s',
                animationDelay: `${index * 100}ms`
              }}
            />
          )}
        </g>
      ))}
      
      {/* Tooltip */}
      {hoveredSegment !== null && tooltipPos && (
        <g className="weather-tooltip">
          <rect
            x={tooltipPos.x - 30}
            y={tooltipPos.y - 25}
            width="60"
            height="40"
            rx="4"
            fill="rgba(0, 0, 0, 0.9)"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
          <text
            x={tooltipPos.x}
            y={tooltipPos.y - 10}
            textAnchor="middle"
            className="fill-white text-xs font-medium"
          >
            {segments[hoveredSegment].hour.toString().padStart(2, '0')}:00
          </text>
          <text
            x={tooltipPos.x}
            y={tooltipPos.y + 5}
            textAnchor="middle"
            className="fill-gray-300 text-xs"
          >
            {segments[hoveredSegment].condition}
          </text>
          {segments[hoveredSegment].temperature && (
            <text
              x={tooltipPos.x}
              y={tooltipPos.y + 18}
              textAnchor="middle"
              className="fill-gray-300 text-xs"
            >
              {segments[hoveredSegment].temperature}°C
            </text>
          )}
        </g>
      )}
      
      {/* Current time indicator */}
      <circle
        cx={centerX}
        cy={centerY - (innerRadius + outerRadius) / 2}
        r="2"
        fill="hsl(45 100% 70%)"
        className="animate-pulse"
      />
    </g>
  );
};
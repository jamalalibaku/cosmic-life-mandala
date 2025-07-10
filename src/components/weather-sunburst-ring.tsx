import React, { useMemo, useState, useEffect } from 'react';
import { WeatherTooltipOverlay } from './weather-tooltip-overlay';
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
  theme?: 'cosmic' | 'natural' | 'minimal' | 'floral' | 'tech' | 'vinyl' | 'tattoo' | 'noir';
  showIcons?: boolean;
  showSkyGradient?: boolean;
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

// Weather icons mapping
const weatherIcons: Record<WeatherCondition, string> = {
  'sunny': '☀️',
  'cloudy': '☁️',
  'rainy': '🌧',
  'storm': '⚡',
  'snowy': '❄️',
  'clear-night': '🌙'
};

// Theme color variations
const themeVariations = {
  cosmic: { saturation: 1, brightness: 1 },
  natural: { saturation: 0.8, brightness: 1.1 },
  minimal: { saturation: 0.5, brightness: 0.9 },
  floral: { saturation: 1.2, brightness: 1.1 },
  tech: { saturation: 0.7, brightness: 0.8 },
  vinyl: { saturation: 1.1, brightness: 0.9 },
  tattoo: { saturation: 1.3, brightness: 0.7 },
  noir: { saturation: 0.3, brightness: 0.6 }
};

export const WeatherSunburstRing: React.FC<WeatherSunburstRingProps> = ({
  weatherData,
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  theme = 'cosmic',
  showIcons = true,
  showSkyGradient = true,
  className = ''
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [clickedSegment, setClickedSegment] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for smooth pointer movement
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate smooth "now" pointer position
  const nowPointerPosition = useMemo(() => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    // Calculate precise angle for smooth movement
    const segmentAngle = 360 / 24; // 15 degrees per hour
    const minutesPerSegment = 60;
    const currentSegmentProgress = minutes / minutesPerSegment;
    const currentAngle = (hours + currentSegmentProgress) * segmentAngle;
    
    // Position at top (12 o'clock) and rotate to current time
    const angle = currentAngle - 90; // -90 to start from top
    const rad = goldenRatio.toRadians(angle);
    const pointerRadius = (innerRadius + outerRadius) / 2;
    
    return {
      x: centerX + Math.cos(rad) * pointerRadius,
      y: centerY + Math.sin(rad) * pointerRadius,
      angle
    };
  }, [currentTime, centerX, centerY, innerRadius, outerRadius]);

  // Sky gradient for 24-hour cycle
  const skyGradient = useMemo(() => {
    const gradientStops = [];
    for (let hour = 0; hour < 24; hour++) {
      const angle = (hour / 24) * 100; // Percentage around the circle
      let color;
      
      if (hour >= 6 && hour < 8) {
        // Sunrise
        color = 'hsl(25 100% 60%)';
      } else if (hour >= 8 && hour < 18) {
        // Day
        color = 'hsl(200 100% 70%)';
      } else if (hour >= 18 && hour < 20) {
        // Sunset
        color = 'hsl(15 90% 50%)';
      } else {
        // Night
        color = 'hsl(230 60% 20%)';
      }
      
      gradientStops.push(`${color} ${angle}%`);
    }
    return gradientStops.join(', ');
  }, []);

  const segments = useMemo(() => {
    // Create 24 segments with proper rotation (current hour at top)
    const currentHour = currentTime.getHours();
    const segmentAngle = 360 / 24; // 15 degrees per hour
    const rotationOffset = -currentHour * segmentAngle - 90; // -90 to start from top
    const themeVariation = themeVariations[theme];
    
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
      
      // Calculate temperature-based opacity (normalized 0-1)
      const minTemp = -10;
      const maxTemp = 40;
      const tempOpacity = temperature 
        ? Math.max(0.3, Math.min(1, (temperature - minTemp) / (maxTemp - minTemp)))
        : 0.7;
      
      // Icon position (middle of segment, between inner and outer radius)
      const iconRadius = (innerRadius + outerRadius) / 2;
      const iconX = centerX + Math.cos(midRad) * iconRadius;
      const iconY = centerY + Math.sin(midRad) * iconRadius;
      
      // Tooltip position (slightly outside the segment)
      const tooltipRadius = outerRadius + 20;
      const tooltipX = centerX + Math.cos(midRad) * tooltipRadius;
      const tooltipY = centerY + Math.sin(midRad) * tooltipRadius;
      
      // Apply theme variations to colors
      const baseColors = weatherColorMap[condition];
      const themedColors = {
        primary: baseColors.primary,
        secondary: baseColors.secondary,
        glow: baseColors.glow
      };
      
      return {
        hour,
        condition,
        temperature,
        pathData,
        midAngle,
        iconX,
        iconY,
        tooltipX,
        tooltipY,
        colors: themedColors,
        opacity: tempOpacity,
        icon: weatherIcons[condition]
      };
    });
  }, [weatherData, centerX, centerY, innerRadius, outerRadius, currentTime, theme]);

  const handleMouseEnter = (segmentIndex: number, event: React.MouseEvent) => {
    setHoveredSegment(segmentIndex);
    const segment = segments[segmentIndex];
    setTooltipPos({ x: segment.tooltipX, y: segment.tooltipY });
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
    if (!clickedSegment) {
      setTooltipPos(null);
    }
  };

  const handleClick = (segmentIndex: number) => {
    if (clickedSegment === segmentIndex) {
      // Close if clicking the same segment
      setClickedSegment(null);
      setTooltipPos(null);
    } else {
      // Open new segment
      setClickedSegment(segmentIndex);
      const segment = segments[segmentIndex];
      setTooltipPos({ x: segment.tooltipX, y: segment.tooltipY });
    }
  };

  const handleTooltipClose = () => {
    setClickedSegment(null);
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
        
        {/* Sky gradient for day/night cycle */}
        {showSkyGradient && (
          <linearGradient
            id="sky-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="hsl(230 60% 20%)" />
            <stop offset="25%" stopColor="hsl(25 100% 60%)" />
            <stop offset="50%" stopColor="hsl(200 100% 70%)" />
            <stop offset="75%" stopColor="hsl(15 90% 50%)" />
            <stop offset="100%" stopColor="hsl(230 60% 20%)" />
          </linearGradient>
        )}
        
        <filter id="weather-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Sky gradient ring overlay */}
      {showSkyGradient && (
        <circle
          cx={centerX}
          cy={centerY}
          r={(innerRadius + outerRadius) / 2}
          fill="none"
          stroke="url(#sky-gradient)"
          strokeWidth={outerRadius - innerRadius}
          opacity="0.2"
          className="pointer-events-none"
        />
      )}
      
      {/* Weather segments */}
      {segments.map((segment, index) => (
        <g key={`weather-segment-${index}`} className="weather-segment">
          <path
            d={segment.pathData}
            fill={`url(#weather-gradient-${segment.condition})`}
            stroke={segment.colors.glow}
            strokeWidth="0.5"
            opacity={hoveredSegment === index ? 1 : segment.opacity}
            filter="url(#weather-glow)"
            onMouseEnter={(e) => handleMouseEnter(index, e)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            className="transition-all duration-300 ease-out cursor-pointer"
            style={{
              transform: hoveredSegment === index ? 'scale(1.05)' : 'scale(1)',
              transformOrigin: `${centerX}px ${centerY}px`,
              animationDelay: `${index * 50}ms`
            }}
          />
          
          {/* Weather icons */}
          {showIcons && (
            <text
              x={segment.iconX}
              y={segment.iconY}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-sm pointer-events-none select-none"
              style={{
                fontSize: Math.max(8, (outerRadius - innerRadius) * 0.3)
              }}
              onClick={() => handleClick(index)}
            >
              {segment.icon}
            </text>
          )}
          
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
      
      {/* Enhanced Weather Tooltip Overlay */}
      {clickedSegment !== null && tooltipPos && (
        <WeatherTooltipOverlay
          segment={segments[clickedSegment]}
          x={tooltipPos.x}
          y={tooltipPos.y}
          isVisible={true}
          onClose={handleTooltipClose}
          theme={theme}
        />
      )}
      
      {/* Simple hover tooltip */}
      {hoveredSegment !== null && clickedSegment === null && tooltipPos && (
        <g className="weather-hover-tooltip">
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
      
      {/* Smooth current time indicator */}
      <g className="now-pointer">
        <circle
          cx={nowPointerPosition.x}
          cy={nowPointerPosition.y}
          r="3"
          fill="hsl(45 100% 70%)"
          stroke="hsl(45 100% 90%)"
          strokeWidth="1"
          className="animate-pulse"
          style={{
            filter: 'drop-shadow(0 0 4px hsl(45 100% 70%))'
          }}
        />
        <line
          x1={centerX}
          y1={centerY}
          x2={nowPointerPosition.x}
          y2={nowPointerPosition.y}
          stroke="hsl(45 100% 70%)"
          strokeWidth="1"
          opacity="0.6"
        />
      </g>
    </g>
  );
};
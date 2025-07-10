import React, { useMemo } from 'react';
import { WeatherData } from '../data/weatherData';
import { goldenRatio } from '../utils/golden-ratio';

interface WeatherSunburstProps {
  weatherData: WeatherData;
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  className?: string;
}

export const WeatherSunburst: React.FC<WeatherSunburstProps> = ({
  weatherData,
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  className = ''
}) => {
  const rays = useMemo(() => {
    const rayCount = 24; // One ray per hour
    const rays = [];
    
    for (let i = 0; i < rayCount; i++) {
      const hour = i;
      const angle = (hour / 24) * 360 - 90; // Start from top (12:00)
      const radians = goldenRatio.toRadians(angle);
      
      // Find temperature for this hour
      const tempData = weatherData.temperature.find(t => {
        const tempHour = parseInt(t.time.split(':')[0]);
        return tempHour === hour;
      });
      
      // Find sun intensity for this hour
      const sunData = weatherData.sunIntensity.find(s => {
        const sunHour = parseInt(s.time.split(':')[0]);
        return sunHour === hour;
      });
      
      // Calculate ray properties based on weather data
      const temperature = tempData?.value || 20;
      const sunIntensity = sunData?.value || 0;
      
      // Map temperature to golden ratio proportions (0°C = 0.3, 35°C = 1.0)
      const tempIntensity = Math.max(0.1, Math.min(1.0, (temperature - 0) / 35));
      
      // Map sun intensity to opacity (0 lux = 0, 1000 lux = 1)
      const sunOpacity = Math.max(0.1, Math.min(1.0, sunIntensity / 1000));
      
      // Create ray with varying length and opacity
      const rayLength = innerRadius + (outerRadius - innerRadius) * tempIntensity;
      const rayWidth = goldenRatio.smaller(2) + tempIntensity * 2;
      
      // Calculate ray endpoints
      const x1 = centerX + Math.cos(radians) * innerRadius;
      const y1 = centerY + Math.sin(radians) * innerRadius;
      const x2 = centerX + Math.cos(radians) * rayLength;
      const y2 = centerY + Math.sin(radians) * rayLength;
      
      rays.push({
        id: `ray-${hour}`,
        x1,
        y1,
        x2,
        y2,
        width: rayWidth,
        opacity: sunOpacity,
        temperature,
        sunIntensity,
        hour
      });
    }
    
    return rays;
  }, [weatherData, centerX, centerY, innerRadius, outerRadius]);

  // Create gradient definitions for cosmic effect
  const gradients = useMemo(() => {
    return (
      <defs>
        <radialGradient id="sunburst-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(45 100% 70%)" stopOpacity="1" />
          <stop offset="50%" stopColor="hsl(35 90% 60%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(25 80% 40%)" stopOpacity="0.3" />
        </radialGradient>
        
        <radialGradient id="ray-gradient" cx="0%" cy="50%" r="100%">
          <stop offset="0%" stopColor="hsl(45 100% 80%)" stopOpacity="0.9" />
          <stop offset="70%" stopColor="hsl(35 90% 65%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(25 70% 45%)" stopOpacity="0.1" />
        </radialGradient>
        
        <filter id="cosmic-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    );
  }, []);

  return (
    <g className={`weather-sunburst ${className}`}>
      {gradients}
      
      {/* Main sunburst rays */}
      {rays.map((ray) => (
        <g key={ray.id} className="weather-ray">
          {/* Main ray line */}
          <line
            x1={ray.x1}
            y1={ray.y1}
            x2={ray.x2}
            y2={ray.y2}
            stroke="url(#ray-gradient)"
            strokeWidth={ray.width}
            strokeLinecap="round"
            opacity={ray.opacity}
            filter="url(#cosmic-glow)"
            className="transition-all duration-300 ease-out"
          />
          
          {/* Secondary glow ray for intensity */}
          <line
            x1={ray.x1}
            y1={ray.y1}
            x2={ray.x2}
            y2={ray.y2}
            stroke="hsl(45 100% 85%)"
            strokeWidth={ray.width * 0.3}
            strokeLinecap="round"
            opacity={ray.opacity * 0.7}
            className="transition-all duration-300 ease-out"
          />
        </g>
      ))}
      
      {/* Central sun core */}
      <circle
        cx={centerX}
        cy={centerY}
        r={innerRadius * 0.8}
        fill="url(#sunburst-gradient)"
        filter="url(#cosmic-glow)"
        className="transition-all duration-500 ease-out"
        style={{
          transform: `scale(${goldenRatio.breathingScale(Date.now())})`,
          transformOrigin: `${centerX}px ${centerY}px`
        }}
      />
      
      {/* Outer glow ring */}
      <circle
        cx={centerX}
        cy={centerY}
        r={outerRadius}
        fill="none"
        stroke="hsl(45 100% 70%)"
        strokeWidth="1"
        opacity="0.3"
        filter="url(#cosmic-glow)"
      />
    </g>
  );
};

export default WeatherSunburst;
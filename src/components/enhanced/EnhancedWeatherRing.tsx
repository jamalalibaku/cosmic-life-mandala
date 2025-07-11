/**
 * Enhanced Weather Ring - CSV Data Visualization
 * Renders temperature gradients, precipitation opacity, and wind motion
 */

import React from 'react';
import { motion } from 'framer-motion';
import { enhancedWeatherData, getWindMotionPattern, getCloudPattern } from '@/data/enhanced-weather-data';

interface EnhancedWeatherRingProps {
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  theme?: 'cosmic' | 'natural' | 'minimal';
  className?: string;
}

export const EnhancedWeatherRing: React.FC<EnhancedWeatherRingProps> = ({
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  theme = 'cosmic',
  className = ''
}) => {
  const segmentCount = enhancedWeatherData.length;
  const segmentAngle = (2 * Math.PI) / segmentCount;

  return (
    <g className={`enhanced-weather-ring ${className}`}>
      {/* Background ring */}
      <circle
        cx={centerX}
        cy={centerY}
        r={(innerRadius + outerRadius) / 2}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={outerRadius - innerRadius}
        opacity={0.3}
      />

      {/* Weather segments with CSV data */}
      {enhancedWeatherData.map((weather, index) => {
        const startAngle = index * segmentAngle - Math.PI / 2;
        const endAngle = (index + 1) * segmentAngle - Math.PI / 2;
        
        const innerStartX = centerX + innerRadius * Math.cos(startAngle);
        const innerStartY = centerY + innerRadius * Math.sin(startAngle);
        const innerEndX = centerX + innerRadius * Math.cos(endAngle);
        const innerEndY = centerY + innerRadius * Math.sin(endAngle);
        
        const outerStartX = centerX + outerRadius * Math.cos(startAngle);
        const outerStartY = centerY + outerRadius * Math.sin(startAngle);
        const outerEndX = centerX + outerRadius * Math.cos(endAngle);
        const outerEndY = centerY + outerRadius * Math.sin(endAngle);

        const windMotion = getWindMotionPattern(weather.windSpeedKmh);
        const cloudPattern = getCloudPattern(weather.cloudinessPercent);

        const pathData = [
          `M ${innerStartX} ${innerStartY}`,
          `A ${innerRadius} ${innerRadius} 0 0 1 ${innerEndX} ${innerEndY}`,
          `L ${outerEndX} ${outerEndY}`,
          `A ${outerRadius} ${outerRadius} 0 0 0 ${outerStartX} ${outerStartY}`,
          'Z'
        ].join(' ');

        return (
          <g key={weather.date} className="weather-segment-group">
            {/* Base temperature gradient segment */}
            <motion.path
              d={pathData}
              fill={weather.temperatureGradient}
              opacity={0.7}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            />

            {/* Precipitation overlay */}
            {weather.precipitationPercent > 0 && (
              <motion.path
                d={pathData}
                fill="url(#precipitationPattern)"
                opacity={weather.precipitationOpacity * 0.6}
                initial={{ opacity: 0 }}
                animate={{ opacity: weather.precipitationOpacity * 0.6 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
              />
            )}

            {/* Wind motion effects */}
            {weather.windSpeedKmh > 10 && (
              <motion.path
                d={pathData}
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
                strokeDasharray="2,4"
                opacity={windMotion.opacity}
                filter={`blur(${windMotion.blur}px)`}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: windMotion.flow }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )}

            {/* Cloud pattern overlay */}
            <motion.path
              d={pathData}
              fill={`rgba(255,255,255,${cloudPattern.opacity * 0.3})`}
              opacity={cloudPattern.density}
              initial={{ opacity: 0 }}
              animate={{ opacity: cloudPattern.density }}
              transition={{ delay: index * 0.1 + 0.4, duration: 0.8 }}
            />

            {/* Segment border */}
            <path
              d={pathData}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
              opacity={0.6}
            />
          </g>
        );
      })}

      {/* Precipitation pattern definition */}
      <defs>
        <pattern
          id="precipitationPattern"
          x="0"
          y="0"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" fill="rgba(135,206,235,0.6)" />
          <circle cx="6" cy="6" r="1" fill="rgba(135,206,235,0.4)" />
          <circle cx="4" cy="1" r="0.5" fill="rgba(135,206,235,0.8)" />
          <circle cx="1" cy="6" r="0.5" fill="rgba(135,206,235,0.5)" />
        </pattern>
      </defs>

      {/* Center temperature display */}
      <g className="temperature-display">
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius * 0.7}
          fill="rgba(0,0,0,0.3)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        
        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          className="fill-white text-sm font-semibold"
        >
          {Math.round(enhancedWeatherData[0]?.temperatureHigh || 23)}°
        </text>
        
        <text
          x={centerX}
          y={centerY + 12}
          textAnchor="middle"
          className="fill-white/70 text-xs"
        >
          {Math.round(enhancedWeatherData[0]?.temperatureLow || 13)}°
        </text>
      </g>

      {/* Weather condition indicators */}
      {enhancedWeatherData.map((weather, index) => {
        const angle = index * segmentAngle - Math.PI / 2;
        const indicatorRadius = outerRadius + 15;
        const x = centerX + indicatorRadius * Math.cos(angle);
        const y = centerY + indicatorRadius * Math.sin(angle);

        const getWeatherIcon = (condition: string) => {
          switch (condition) {
            case 'sunny': return '☀️';
            case 'cloudy': return '☁️';
            case 'rainy': return '🌧️';
            case 'windy': return '💨';
            default: return '🌤️';
          }
        };

        return (
          <motion.text
            key={`indicator-${weather.date}`}
            x={x}
            y={y}
            textAnchor="middle"
            className="text-xs"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.6, duration: 0.5 }}
          >
            {getWeatherIcon(weather.weatherCondition)}
          </motion.text>
        );
      })}
    </g>
  );
};
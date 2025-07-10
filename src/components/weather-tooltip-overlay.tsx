/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState } from 'react';
import { WeatherSegment } from './weather-sunburst-ring';

interface WeatherTooltipOverlayProps {
  segment: WeatherSegment;
  x: number;
  y: number;
  isVisible: boolean;
  onClose: () => void;
  theme?: string;
}

export const WeatherTooltipOverlay: React.FC<WeatherTooltipOverlayProps> = ({
  segment,
  x,
  y,
  isVisible,
  onClose,
  theme = 'default'
}) => {
  if (!isVisible) return null;

  const weatherDetails = {
    sunny: { icon: '☀️', desc: 'Clear Sky', humidity: '45%', wind: '12 km/h' },
    cloudy: { icon: '☁️', desc: 'Overcast', humidity: '65%', wind: '8 km/h' },
    rainy: { icon: '🌧️', desc: 'Light Rain', humidity: '85%', wind: '15 km/h' },
    storm: { icon: '⛈️', desc: 'Thunderstorm', humidity: '90%', wind: '25 km/h' },
    snowy: { icon: '❄️', desc: 'Snow', humidity: '70%', wind: '10 km/h' },
    'clear-night': { icon: '🌙', desc: 'Clear Night', humidity: '50%', wind: '5 km/h' }
  };

  const details = weatherDetails[segment.condition];
  const time = `${segment.hour.toString().padStart(2, '0')}:00`;

  // Theme colors
  const themeColors = {
    default: { bg: 'rgba(0, 0, 0, 0.8)', border: 'hsl(45 70% 60%)', text: 'hsl(45 90% 85%)' },
    floral: { bg: 'rgba(45, 20, 45, 0.85)', border: 'hsl(300 60% 70%)', text: 'hsl(300 80% 85%)' },
    noir: { bg: 'rgba(20, 20, 30, 0.9)', border: 'hsl(240 30% 50%)', text: 'hsl(240 50% 75%)' },
    vinyl: { bg: 'rgba(30, 25, 15, 0.85)', border: 'hsl(45 60% 65%)', text: 'hsl(45 80% 80%)' },
    techHUD: { bg: 'rgba(10, 25, 25, 0.85)', border: 'hsl(180 70% 60%)', text: 'hsl(180 80% 75%)' }
  };

  const colors = themeColors[theme] || themeColors.default;

  return (
    <g className="weather-tooltip-overlay">
      {/* Background overlay for click-to-close */}
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="transparent"
        onClick={onClose}
        className="cursor-pointer"
      />
      
      {/* Tooltip container */}
      <g transform={`translate(${x - 80}, ${y - 60})`}>
        {/* Tooltip background */}
        <rect
          x="0"
          y="0"
          width="160"
          height="100"
          rx="12"
          fill={colors.bg}
          stroke={colors.border}
          strokeWidth="1.5"
          className="drop-shadow-lg"
        />
        
        {/* Pointer arrow */}
        <path
          d="M 75 100 L 85 110 L 95 100"
          fill={colors.bg}
          stroke={colors.border}
          strokeWidth="1.5"
        />
        
        {/* Header with time and icon */}
        <g className="tooltip-header">
          <text
            x="15"
            y="20"
            className="text-sm font-bold"
            fill={colors.text}
          >
            {time}
          </text>
          <text
            x="135"
            y="22"
            textAnchor="middle"
            className="text-lg"
          >
            {details.icon}
          </text>
        </g>
        
        {/* Weather condition */}
        <text
          x="15"
          y="38"
          className="text-xs font-medium"
          fill={colors.text}
          opacity="0.9"
        >
          {details.desc}
        </text>
        
        {/* Temperature */}
        {segment.temperature && (
          <text
            x="15"
            y="55"
            className="text-lg font-bold"
            fill={colors.text}
          >
            {segment.temperature}°C
          </text>
        )}
        
        {/* Additional details */}
        <g className="weather-details">
          <text
            x="15"
            y="72"
            className="text-xs"
            fill={colors.text}
            opacity="0.7"
          >
            💧 {details.humidity}
          </text>
          <text
            x="15"
            y="87"
            className="text-xs"
            fill={colors.text}
            opacity="0.7"
          >
            🌪️ {details.wind}
          </text>
        </g>
        
        {/* Close button */}
        <circle
          cx="145"
          cy="15"
          r="8"
          fill={colors.border}
          opacity="0.3"
          className="cursor-pointer"
          onClick={onClose}
        />
        <text
          x="145"
          y="19"
          textAnchor="middle"
          className="text-xs font-bold cursor-pointer"
          fill={colors.text}
          onClick={onClose}
        >
          ×
        </text>
      </g>
    </g>
  );
};
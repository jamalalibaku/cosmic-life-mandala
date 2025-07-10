/**
 * (c) 2025 Cosmic Life Mandala – Fractal Timeline Engine
 * Built by Lovable & ChatGPT, vision by Founder
 * Licensed under MIT
 */

import React, { useMemo, useState, useEffect } from 'react';
import { goldenRatio, PHI } from '../utils/golden-ratio';

interface MonthOrbit {
  month: number;
  name: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  dataSummary: {
    avgActivity: number;
    avgMood: number;
    avgSleep: number;
    dominantWeather: string;
  };
  isCurrentMonth: boolean;
}

interface RadialYearViewProps {
  yearData: MonthOrbit[];
  centerX: number;
  centerY: number;
  radius: number;
  theme?: 'cosmic' | 'natural' | 'minimal';
  onMonthClick?: (month: MonthOrbit) => void;
  className?: string;
}

const seasonalArcs = {
  spring: { start: 60, end: 150, color: 'hsl(100 70% 60%)', symbol: '🌸' },
  summer: { start: 150, end: 240, color: 'hsl(45 90% 65%)', symbol: '☀️' },
  autumn: { start: 240, end: 330, color: 'hsl(25 80% 55%)', symbol: '🍂' },
  winter: { start: 330, end: 60, color: 'hsl(200 60% 70%)', symbol: '❄️' }
};

const yearColors = {
  cosmic: {
    orbit: 'hsl(45 50% 40%)',
    month: 'hsl(45 70% 50%)',
    active: 'hsl(45 90% 60%)',
    glow: 'hsl(45 100% 70%)'
  },
  natural: {
    orbit: 'hsl(120 30% 30%)',
    month: 'hsl(120 50% 40%)',
    active: 'hsl(120 70% 50%)',
    glow: 'hsl(120 80% 60%)'
  },
  minimal: {
    orbit: 'hsl(0 0% 40%)',
    month: 'hsl(0 0% 50%)',
    active: 'hsl(0 0% 60%)',
    glow: 'hsl(0 0% 70%)'
  }
};

export const RadialYearView: React.FC<RadialYearViewProps> = ({
  yearData,
  centerX,
  centerY,
  radius,
  theme = 'cosmic',
  onMonthClick,
  className = ''
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [time, setTime] = useState(0);

  // Celestial motion animation
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      setTime((Date.now() - startTime) / 1000);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const colors = yearColors[theme];

  const monthOrbits = useMemo(() => {
    const orbitRadius = radius * 0.8;
    const yearRotation = time * 0.05; // Very slow yearly rotation
    
    return yearData.map((month, index) => {
      const monthAngle = (index / 12) * 360 - 90 + yearRotation; // Start from top (January)
      const seasonalDrift = Math.sin(time * 0.2 + index) * 3; // Seasonal drift
      const adjustedAngle = monthAngle + seasonalDrift;
      const rad = goldenRatio.toRadians(adjustedAngle);
      
      const x = centerX + Math.cos(rad) * orbitRadius;
      const y = centerY + Math.sin(rad) * orbitRadius;
      
      // Month size based on data intensity and golden ratio
      const dataIntensity = (month.dataSummary.avgActivity + month.dataSummary.avgMood + month.dataSummary.avgSleep) / 3;
      const baseSize = radius * 0.04;
      const size = baseSize * (0.7 + dataIntensity * 0.6) * goldenRatio.smaller(1);
      
      return {
        ...month,
        x,
        y,
        size,
        angle: adjustedAngle,
        seasonArc: seasonalArcs[month.season]
      };
    });
  }, [yearData, centerX, centerY, radius, time]);

  // Seasonal arc paths
  const seasonalArcPaths = useMemo(() => {
    const arcRadius = radius * 0.9;
    
    return Object.entries(seasonalArcs).map(([season, arc]) => {
      const startRad = goldenRatio.toRadians(arc.start - 90);
      const endRad = goldenRatio.toRadians(arc.end - 90);
      
      const startX = centerX + Math.cos(startRad) * arcRadius;
      const startY = centerY + Math.sin(startRad) * arcRadius;
      const endX = centerX + Math.cos(endRad) * arcRadius;
      const endY = centerY + Math.sin(endRad) * arcRadius;
      
      const largeArc = Math.abs(arc.end - arc.start) > 180 ? 1 : 0;
      
      const pathData = [
        `M ${startX} ${startY}`,
        `A ${arcRadius} ${arcRadius} 0 ${largeArc} 1 ${endX} ${endY}`
      ].join(' ');
      
      // Label position
      const labelAngle = goldenRatio.toRadians((arc.start + arc.end) / 2 - 90);
      const labelX = centerX + Math.cos(labelAngle) * (arcRadius + 20);
      const labelY = centerY + Math.sin(labelAngle) * (arcRadius + 20);
      
      return {
        season,
        pathData,
        color: arc.color,
        symbol: arc.symbol,
        labelX,
        labelY
      };
    });
  }, [centerX, centerY, radius]);

  return (
    <g className={`radial-year-view ${className}`}>
      {/* Gradient definitions */}
      <defs>
        <radialGradient
          id={`year-month-gradient-${theme}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={colors.glow} stopOpacity="1" />
          <stop offset="60%" stopColor={colors.active} stopOpacity="0.8" />
          <stop offset="100%" stopColor={colors.month} stopOpacity="0.6" />
        </radialGradient>
        
        <filter id="year-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Central year indicator */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.08}
        fill="rgba(0, 0, 0, 0.5)"
        stroke={colors.glow}
        strokeWidth="2"
        opacity="0.8"
      />
      <text
        x={centerX}
        y={centerY + 3}
        textAnchor="middle"
        className="text-sm font-light fill-yellow-200"
      >
        {new Date().getFullYear()}
      </text>
      
      {/* Seasonal arcs */}
      {seasonalArcPaths.map((arc) => (
        <g key={arc.season}>
          <path
            d={arc.pathData}
            fill="none"
            stroke={arc.color}
            strokeWidth="3"
            opacity="0.3"
            filter="url(#year-glow)"
          />
          <text
            x={arc.labelX}
            y={arc.labelY}
            textAnchor="middle"
            className="text-lg pointer-events-none"
          >
            {arc.symbol}
          </text>
        </g>
      ))}
      
      {/* Main orbital path */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.8}
        fill="none"
        stroke={colors.orbit}
        strokeWidth="1"
        opacity="0.2"
        strokeDasharray="4,8"
      />
      
      {/* Month orbits */}
      {monthOrbits.map((month, index) => (
        <g key={`month-${month.month}`}>
          {/* Data summary rays */}
          <g className="data-rays pointer-events-none">
            {/* Activity ray */}
            <line
              x1={month.x}
              y1={month.y}
              x2={month.x + Math.cos(goldenRatio.toRadians(month.angle)) * (month.dataSummary.avgActivity * 20)}
              y2={month.y + Math.sin(goldenRatio.toRadians(month.angle)) * (month.dataSummary.avgActivity * 20)}
              stroke="hsl(120 70% 60%)"
              strokeWidth="2"
              opacity="0.6"
            />
            
            {/* Mood ray */}
            <line
              x1={month.x}
              y1={month.y}
              x2={month.x + Math.cos(goldenRatio.toRadians(month.angle + 120)) * (month.dataSummary.avgMood * 20)}
              y2={month.y + Math.sin(goldenRatio.toRadians(month.angle + 120)) * (month.dataSummary.avgMood * 20)}
              stroke="hsl(280 70% 60%)"
              strokeWidth="2"
              opacity="0.6"
            />
            
            {/* Sleep ray */}
            <line
              x1={month.x}
              y1={month.y}
              x2={month.x + Math.cos(goldenRatio.toRadians(month.angle + 240)) * (month.dataSummary.avgSleep * 20)}
              y2={month.y + Math.sin(goldenRatio.toRadians(month.angle + 240)) * (month.dataSummary.avgSleep * 20)}
              stroke="hsl(220 70% 60%)"
              strokeWidth="2"
              opacity="0.6"
            />
          </g>
          
          {/* Month orbit */}
          <circle
            cx={month.x}
            cy={month.y}
            r={month.size}
            fill={`url(#year-month-gradient-${theme})`}
            stroke={month.isCurrentMonth ? colors.glow : month.seasonArc.color}
            strokeWidth={month.isCurrentMonth ? "3" : "1"}
            opacity={hoveredMonth === index ? 1 : 0.8}
            filter="url(#year-glow)"
            onMouseEnter={() => setHoveredMonth(index)}
            onMouseLeave={() => setHoveredMonth(null)}
            onClick={() => onMonthClick?.(month)}
            className="transition-all duration-300 ease-out cursor-pointer"
            style={{
              transform: hoveredMonth === index ? 'scale(1.3)' : 'scale(1)',
              transformOrigin: `${month.x}px ${month.y}px`
            }}
          />
          
          {/* Month label */}
          <text
            x={month.x}
            y={month.y + 2}
            textAnchor="middle"
            className="text-xs font-medium pointer-events-none"
            fill={month.isCurrentMonth ? colors.glow : colors.month}
          >
            {month.name.slice(0, 3).toUpperCase()}
          </text>
          
          {/* Tooltip on hover */}
          {hoveredMonth === index && (
            <g className="month-tooltip">
              <rect
                x={month.x - 45}
                y={month.y - 60}
                width="90"
                height="40"
                rx="6"
                fill="rgba(0, 0, 0, 0.9)"
                stroke={colors.glow}
                strokeWidth="1"
              />
              <text
                x={month.x}
                y={month.y - 45}
                textAnchor="middle"
                className="text-sm font-medium fill-white"
              >
                {month.name}
              </text>
              <text
                x={month.x}
                y={month.y - 30}
                textAnchor="middle"
                className="text-xs fill-gray-300"
              >
                {month.dataSummary.dominantWeather}
              </text>
              <text
                x={month.x}
                y={month.y - 18}
                textAnchor="middle"
                className="text-xs fill-gray-400"
              >
                Activity: {Math.round(month.dataSummary.avgActivity * 100)}%
              </text>
            </g>
          )}
        </g>
      ))}
    </g>
  );
};
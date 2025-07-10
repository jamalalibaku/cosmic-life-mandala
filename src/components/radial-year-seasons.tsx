/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useMemo, useState, useEffect } from 'react';
import { goldenRatio, PHI } from '../utils/golden-ratio';

export interface MonthSummary {
  month: number;
  name: string;
  dominantMood: 'calm' | 'energetic' | 'creative' | 'restful' | 'chaotic';
  averageSleep: number; // 0-1
  peakMobilityDay: number;
  weatherSummary: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  isCurrentMonth: boolean;
  totalActiveDays: number;
}

interface RadialYearSeasonsProps {
  yearData: MonthSummary[];
  centerX: number;
  centerY: number;
  radius: number;
  theme?: 'cosmic' | 'natural' | 'seasonal';
  onMonthClick?: (month: MonthSummary) => void;
  playbackProgress?: number; // 0-1 for yearly animation
  className?: string;
}

const seasonalArcs = {
  spring: { 
    start: 60, 
    end: 150, 
    color: 'hsl(100 60% 55%)', 
    accentColor: 'hsl(120 70% 65%)',
    symbol: '🌸',
    name: 'Spring'
  },
  summer: { 
    start: 150, 
    end: 240, 
    color: 'hsl(45 80% 60%)', 
    accentColor: 'hsl(30 90% 70%)',
    symbol: '☀️',
    name: 'Summer'
  },
  autumn: { 
    start: 240, 
    end: 330, 
    color: 'hsl(25 70% 50%)', 
    accentColor: 'hsl(35 80% 60%)',
    symbol: '🍂',
    name: 'Autumn'
  },
  winter: { 
    start: 330, 
    end: 60, 
    color: 'hsl(200 50% 60%)', 
    accentColor: 'hsl(220 60% 70%)',
    symbol: '❄️',
    name: 'Winter'
  }
};

const moodGlyphs = {
  calm: '🌙',
  energetic: '⚡',
  creative: '💫',
  restful: '🌿',
  chaotic: '🌀'
};

export const RadialYearSeasons: React.FC<RadialYearSeasonsProps> = ({
  yearData,
  centerX,
  centerY,
  radius,
  theme = 'seasonal',
  onMonthClick,
  playbackProgress = 0,
  className = ''
}) => {
  const [time, setTime] = useState(0);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Celestial yearly rotation
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      setTime((Date.now() - startTime) / 1000);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Calculate month planet positions
  const monthPlanets = useMemo(() => {
    const orbitRadius = radius * 0.75;
    const yearRotation = time * 0.02; // Very slow cosmic rotation
    
    return yearData.map((month, index) => {
      const monthAngle = (index / 12) * 360 - 90 + yearRotation;
      const seasonalFloat = Math.sin(time * 0.15 + index) * 2;
      const adjustedAngle = monthAngle + seasonalFloat;
      const rad = goldenRatio.toRadians(adjustedAngle);
      
      const x = centerX + Math.cos(rad) * orbitRadius;
      const y = centerY + Math.sin(rad) * orbitRadius;
      
      // Planet size based on activity and season
      const baseSize = radius * 0.04;
      const activityMultiplier = 0.7 + (month.totalActiveDays / 31) * 0.6;
      const seasonalPulse = 1 + Math.sin(time * 0.3 + index) * 0.1;
      const size = baseSize * activityMultiplier * seasonalPulse;
      
      // Seasonal colors
      const seasonArc = seasonalArcs[month.season];
      
      return {
        ...month,
        x,
        y,
        size,
        angle: adjustedAngle,
        seasonColor: seasonArc.color,
        accentColor: seasonArc.accentColor,
        moodGlyph: moodGlyphs[month.dominantMood]
      };
    });
  }, [yearData, centerX, centerY, radius, time]);

  // Seasonal arc paths
  const seasonalArcPaths = useMemo(() => {
    const arcRadius = radius * 0.85;
    
    return Object.entries(seasonalArcs).map(([season, arc]) => {
      const startRad = goldenRatio.toRadians(arc.start - 90);
      const endRad = goldenRatio.toRadians(arc.end - 90);
      
      const startX = centerX + Math.cos(startRad) * arcRadius;
      const startY = centerY + Math.sin(startRad) * arcRadius;
      const endX = centerX + Math.cos(endRad) * arcRadius;
      const endY = centerY + Math.sin(endRad) * arcRadius;
      
      // Handle winter wrap-around
      const isWinterArc = season === 'winter';
      const largeArc = !isWinterArc && Math.abs(arc.end - arc.start) > 180 ? 1 : 0;
      
      let pathData;
      if (isWinterArc) {
        // Winter spans year boundary, create two arcs
        const winterMidX = centerX + Math.cos(goldenRatio.toRadians(0)) * arcRadius;
        const winterMidY = centerY + Math.sin(goldenRatio.toRadians(0)) * arcRadius;
        pathData = `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 0 1 ${winterMidX} ${winterMidY} 
                   M ${winterMidX} ${winterMidY} A ${arcRadius} ${arcRadius} 0 0 1 ${endX} ${endY}`;
      } else {
        pathData = `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArc} 1 ${endX} ${endY}`;
      }
      
      // Label position
      const labelAngle = goldenRatio.toRadians((arc.start + arc.end) / 2 - 90);
      const labelX = centerX + Math.cos(labelAngle) * (arcRadius + 30);
      const labelY = centerY + Math.sin(labelAngle) * (arcRadius + 30);
      
      return {
        season,
        pathData,
        color: arc.color,
        accentColor: arc.accentColor,
        symbol: arc.symbol,
        name: arc.name,
        labelX,
        labelY
      };
    });
  }, [centerX, centerY, radius]);

  return (
    <g className={`radial-year-seasons ${className}`}>
      <defs>
        {/* Seasonal glow filters */}
        {Object.entries(seasonalArcs).map(([season, arc]) => (
          <filter key={season} id={`season-glow-${season}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        ))}
        
        {/* Month planet gradient */}
        <radialGradient id="month-planet-gradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.1)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.2)" />
        </radialGradient>
      </defs>

      {/* Central year core */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.06}
        fill="rgba(0, 0, 0, 0.6)"
        stroke="hsl(45 80% 60%)"
        strokeWidth="2"
        opacity="0.9"
      />
      <text
        x={centerX}
        y={centerY + 3}
        textAnchor="middle"
        className="text-lg font-light fill-yellow-200"
      >
        {new Date().getFullYear()}
      </text>

      {/* Seasonal arcs */}
      {seasonalArcPaths.map((arc) => (
        <g key={arc.season}>
          {/* Main seasonal arc */}
          <path
            d={arc.pathData}
            fill="none"
            stroke={arc.color}
            strokeWidth="4"
            opacity="0.4"
            filter={`url(#season-glow-${arc.season})`}
            style={{
              animation: `seasonalPulse 4s ease-in-out infinite ${arc.season === 'spring' ? '0s' : 
                          arc.season === 'summer' ? '1s' : 
                          arc.season === 'autumn' ? '2s' : '3s'}`
            }}
          />
          
          {/* Seasonal accent arc */}
          <path
            d={arc.pathData}
            fill="none"
            stroke={arc.accentColor}
            strokeWidth="2"
            opacity="0.2"
            strokeDasharray="4 8"
          />
          
          {/* Season label */}
          <g transform={`translate(${arc.labelX}, ${arc.labelY})`}>
            <text
              x="0"
              y="-8"
              textAnchor="middle"
              className="text-lg pointer-events-none"
            >
              {arc.symbol}
            </text>
            <text
              x="0"
              y="8"
              textAnchor="middle"
              className="text-sm font-light fill-white opacity-70"
            >
              {arc.name}
            </text>
          </g>
        </g>
      ))}

      {/* Orbital ring guide */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.75}
        fill="none"
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth="1"
        strokeDasharray="2 8"
      />

      {/* Month planets */}
      {monthPlanets.map((planet) => (
        <g key={`month-${planet.month}`}>
          {/* Planet orbit trail */}
          <circle
            cx={planet.x}
            cy={planet.y}
            r={planet.size * 2}
            fill="none"
            stroke={planet.seasonColor}
            strokeWidth="1"
            opacity="0.1"
          />
          
          {/* Main planet body */}
          <circle
            cx={planet.x}
            cy={planet.y}
            r={planet.size}
            fill={planet.seasonColor}
            stroke={planet.isCurrentMonth ? 'hsl(45 100% 70%)' : planet.accentColor}
            strokeWidth={planet.isCurrentMonth ? "3" : "1.5"}
            opacity={hoveredMonth === planet.month ? 1 : 0.8}
            filter={`url(#season-glow-${planet.season})`}
            onMouseEnter={() => setHoveredMonth(planet.month)}
            onMouseLeave={() => setHoveredMonth(null)}
            onClick={() => onMonthClick?.(planet)}
            className="cursor-pointer transition-all duration-300"
            style={{
              transform: hoveredMonth === planet.month ? 'scale(1.4)' : 'scale(1)',
              transformOrigin: `${planet.x}px ${planet.y}px`
            }}
          />
          
          {/* Planet surface gradient */}
          <circle
            cx={planet.x}
            cy={planet.y}
            r={planet.size * 0.8}
            fill="url(#month-planet-gradient)"
            opacity="0.6"
            className="pointer-events-none"
          />
          
          {/* Month name */}
          <text
            x={planet.x}
            y={planet.y + 2}
            textAnchor="middle"
            className="text-xs font-medium pointer-events-none"
            fill={planet.isCurrentMonth ? 'hsl(45 100% 80%)' : 'white'}
            style={{ fontSize: Math.max(8, planet.size * 0.3) }}
          >
            {planet.name.slice(0, 3).toUpperCase()}
          </text>
          
          {/* Mood glyph */}
          <text
            x={planet.x}
            y={planet.y - planet.size - 5}
            textAnchor="middle"
            className="text-sm pointer-events-none"
            opacity={hoveredMonth === planet.month ? 1 : 0.7}
          >
            {planet.moodGlyph}
          </text>

          {/* Hover details */}
          {hoveredMonth === planet.month && (
            <g className="month-details">
              <rect
                x={planet.x - 50}
                y={planet.y + planet.size + 15}
                width="100"
                height="45"
                rx="6"
                fill="rgba(0, 0, 0, 0.9)"
                stroke={planet.accentColor}
                strokeWidth="1"
              />
              <text
                x={planet.x}
                y={planet.y + planet.size + 30}
                textAnchor="middle"
                className="text-sm font-medium fill-white"
              >
                {planet.name}
              </text>
              <text
                x={planet.x}
                y={planet.y + planet.size + 42}
                textAnchor="middle"
                className="text-xs fill-gray-300"
              >
                {planet.weatherSummary}
              </text>
              <text
                x={planet.x}
                y={planet.y + planet.size + 54}
                textAnchor="middle"
                className="text-xs fill-gray-400"
              >
                {planet.totalActiveDays} active days
              </text>
            </g>
          )}
        </g>
      ))}

      <style>
        {`
        @keyframes seasonalPulse {
          0%, 100% { opacity: 0.3; stroke-width: 4; }
          50% { opacity: 0.7; stroke-width: 6; }
        }
        `}
      </style>
    </g>
  );
};
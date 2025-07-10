/**
 * (c) 2025 Cosmic Life Mandala – Fractal Timeline Engine
 * Built by Lovable & ChatGPT, vision by Founder
 * Licensed under MIT
 */

import React, { useMemo, useState, useEffect } from 'react';
import { goldenRatio, PHI } from '../utils/golden-ratio';

interface DaySignature {
  date: Date;
  weather: string;
  sleepQuality: number; // 0-1
  activityLevel: number; // 0-1
  moodScore: number; // 0-1
  summary: string;
}

interface RadialWeekViewProps {
  weekData: DaySignature[];
  centerX: number;
  centerY: number;
  radius: number;
  theme?: 'cosmic' | 'natural' | 'minimal';
  onDayClick?: (day: DaySignature) => void;
  className?: string;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const petalColors = {
  cosmic: {
    base: 'hsl(45 70% 60%)',
    active: 'hsl(45 90% 70%)',
    glow: 'hsl(45 100% 80%)',
    text: 'hsl(45 30% 90%)'
  },
  natural: {
    base: 'hsl(120 50% 50%)',
    active: 'hsl(120 70% 60%)',
    glow: 'hsl(120 80% 70%)',
    text: 'hsl(120 20% 80%)'
  },
  minimal: {
    base: 'hsl(0 0% 60%)',
    active: 'hsl(0 0% 70%)',
    glow: 'hsl(0 0% 80%)',
    text: 'hsl(0 0% 90%)'
  }
};

export const RadialWeekView: React.FC<RadialWeekViewProps> = ({
  weekData,
  centerX,
  centerY,
  radius,
  theme = 'cosmic',
  onDayClick,
  className = ''
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [time, setTime] = useState(0);

  // Gentle breathing animation
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      setTime((Date.now() - startTime) / 1000);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const colors = petalColors[theme];

  const dayPetals = useMemo(() => {
    return weekData.map((day, index) => {
      const angle = (index / 7) * 360 - 90; // Start from top
      const breathingOffset = Math.sin(time * 0.5 + index * 0.3) * 2;
      const adjustedAngle = angle + breathingOffset;
      const rad = goldenRatio.toRadians(adjustedAngle);
      
      // Petal shape using golden ratio
      const petalLength = radius * goldenRatio.larger(1) / PHI;
      const petalWidth = radius * 0.4;
      
      const tipX = centerX + Math.cos(rad) * petalLength;
      const tipY = centerY + Math.sin(rad) * petalLength;
      
      // Create petal path using Bézier curves
      const baseRadius = radius * 0.3;
      const leftBaseRad = rad - goldenRatio.toRadians(25);
      const rightBaseRad = rad + goldenRatio.toRadians(25);
      
      const leftBaseX = centerX + Math.cos(leftBaseRad) * baseRadius;
      const leftBaseY = centerY + Math.sin(leftBaseRad) * baseRadius;
      const rightBaseX = centerX + Math.cos(rightBaseRad) * baseRadius;
      const rightBaseY = centerY + Math.sin(rightBaseRad) * baseRadius;
      
      // Control points for smooth curves
      const leftCtrlX = centerX + Math.cos(rad - goldenRatio.toRadians(15)) * (petalLength * 0.7);
      const leftCtrlY = centerY + Math.sin(rad - goldenRatio.toRadians(15)) * (petalLength * 0.7);
      const rightCtrlX = centerX + Math.cos(rad + goldenRatio.toRadians(15)) * (petalLength * 0.7);
      const rightCtrlY = centerY + Math.sin(rad + goldenRatio.toRadians(15)) * (petalLength * 0.7);
      
      const pathData = [
        `M ${leftBaseX} ${leftBaseY}`,
        `Q ${leftCtrlX} ${leftCtrlY} ${tipX} ${tipY}`,
        `Q ${rightCtrlX} ${rightCtrlY} ${rightBaseX} ${rightBaseY}`,
        `A ${baseRadius} ${baseRadius} 0 0 0 ${leftBaseX} ${leftBaseY}`,
        'Z'
      ].join(' ');
      
      // Data visualization within petal
      const dataRadius = baseRadius * 0.8;
      const dataX = centerX + Math.cos(rad) * (dataRadius + 10);
      const dataY = centerY + Math.sin(rad) * (dataRadius + 10);
      
      return {
        index,
        day,
        pathData,
        angle: adjustedAngle,
        tipX,
        tipY,
        dataX,
        dataY,
        isToday: day.date.toDateString() === new Date().toDateString(),
        intensity: (day.sleepQuality + day.activityLevel + day.moodScore) / 3
      };
    });
  }, [weekData, centerX, centerY, radius, time, theme]);

  return (
    <g className={`radial-week-view ${className}`}>
      {/* Gradient definitions */}
      <defs>
        <radialGradient
          id={`week-petal-gradient-${theme}`}
          cx="30%"
          cy="30%"
          r="70%"
        >
          <stop offset="0%" stopColor={colors.glow} stopOpacity="0.9" />
          <stop offset="50%" stopColor={colors.active} stopOpacity="0.7" />
          <stop offset="100%" stopColor={colors.base} stopOpacity="0.5" />
        </radialGradient>
        
        <filter id="week-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Central week indicator */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.15}
        fill="rgba(0, 0, 0, 0.3)"
        stroke={colors.glow}
        strokeWidth="1"
        opacity="0.7"
      />
      <text
        x={centerX}
        y={centerY - 5}
        textAnchor="middle"
        className="text-xs font-light"
        fill={colors.text}
      >
        THIS
      </text>
      <text
        x={centerX}
        y={centerY + 8}
        textAnchor="middle"
        className="text-xs font-light"
        fill={colors.text}
      >
        WEEK
      </text>
      
      {/* Day petals */}
      {dayPetals.map((petal) => (
        <g key={`day-petal-${petal.index}`}>
          <path
            d={petal.pathData}
            fill={`url(#week-petal-gradient-${theme})`}
            stroke={petal.isToday ? colors.glow : colors.base}
            strokeWidth={petal.isToday ? "2" : "1"}
            opacity={hoveredDay === petal.index ? 1 : petal.intensity * 0.8 + 0.2}
            filter="url(#week-glow)"
            onMouseEnter={() => setHoveredDay(petal.index)}
            onMouseLeave={() => setHoveredDay(null)}
            onClick={() => onDayClick?.(petal.day)}
            className="transition-all duration-300 ease-out cursor-pointer"
            style={{
              transform: hoveredDay === petal.index ? 'scale(1.05)' : 'scale(1)',
              transformOrigin: `${centerX}px ${centerY}px`
            }}
          />
          
          {/* Day label */}
          <text
            x={petal.dataX}
            y={petal.dataY}
            textAnchor="middle"
            className="text-xs font-medium pointer-events-none"
            fill={colors.text}
          >
            {dayNames[petal.index]}
          </text>
          
          {/* Data signature dots */}
          <g className="data-signature pointer-events-none">
            {/* Sleep quality */}
            <circle
              cx={petal.dataX - 8}
              cy={petal.dataY + 15}
              r={2 + petal.day.sleepQuality * 3}
              fill="hsl(220 70% 70%)"
              opacity={petal.day.sleepQuality}
            />
            
            {/* Activity level */}
            <circle
              cx={petal.dataX}
              cy={petal.dataY + 15}
              r={2 + petal.day.activityLevel * 3}
              fill="hsl(120 70% 70%)"
              opacity={petal.day.activityLevel}
            />
            
            {/* Mood score */}
            <circle
              cx={petal.dataX + 8}
              cy={petal.dataY + 15}
              r={2 + petal.day.moodScore * 3}
              fill="hsl(280 70% 70%)"
              opacity={petal.day.moodScore}
            />
          </g>
          
          {/* Tooltip on hover */}
          {hoveredDay === petal.index && (
            <g className="day-tooltip">
              <rect
                x={petal.tipX - 40}
                y={petal.tipY - 35}
                width="80"
                height="30"
                rx="6"
                fill="rgba(0, 0, 0, 0.9)"
                stroke={colors.glow}
                strokeWidth="1"
              />
              <text
                x={petal.tipX}
                y={petal.tipY - 20}
                textAnchor="middle"
                className="text-xs font-medium fill-white"
              >
                {petal.day.date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </text>
              <text
                x={petal.tipX}
                y={petal.tipY - 8}
                textAnchor="middle"
                className="text-xs fill-gray-300"
              >
                {petal.day.weather}
              </text>
            </g>
          )}
        </g>
      ))}
    </g>
  );
};
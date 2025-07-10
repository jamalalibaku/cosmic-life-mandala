/**
 * (c) 2025 Cosmic Life Mandala – Fractal Timeline Engine
 * Built by Lovable & ChatGPT, vision by Founder
 * Licensed under MIT
 */

import React, { useMemo, useState, useEffect } from 'react';
import { goldenRatio, PHI } from '../utils/golden-ratio';

interface DayNode {
  date: Date;
  dayOfMonth: number;
  weekOfMonth: number;
  activitySummary: number; // 0-1
  weatherBand: string;
  sleepMoodPulse: number; // 0-1
  isToday: boolean;
}

interface RadialMonthViewProps {
  monthData: DayNode[];
  centerX: number;
  centerY: number;
  radius: number;
  theme?: 'cosmic' | 'natural' | 'minimal';
  onDayClick?: (day: DayNode) => void;
  className?: string;
}

const monthColors = {
  cosmic: {
    orbit: 'hsl(45 60% 50%)',
    node: 'hsl(45 80% 60%)',
    active: 'hsl(45 100% 70%)',
    glow: 'hsl(45 100% 80%)'
  },
  natural: {
    orbit: 'hsl(120 40% 40%)',
    node: 'hsl(120 60% 50%)',
    active: 'hsl(120 80% 60%)',
    glow: 'hsl(120 90% 70%)'
  },
  minimal: {
    orbit: 'hsl(0 0% 50%)',
    node: 'hsl(0 0% 60%)',
    active: 'hsl(0 0% 70%)',
    glow: 'hsl(0 0% 80%)'
  }
};

export const RadialMonthView: React.FC<RadialMonthViewProps> = ({
  monthData,
  centerX,
  centerY,
  radius,
  theme = 'cosmic',
  onDayClick,
  className = ''
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [time, setTime] = useState(0);

  // Orbital motion animation
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      setTime((Date.now() - startTime) / 1000);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const colors = monthColors[theme];

  const weeklyOrbitRings = useMemo(() => {
    const weeks = [[], [], [], [], [], []] as DayNode[][];
    
    // Group days by week
    monthData.forEach(day => {
      weeks[day.weekOfMonth]?.push(day);
    });

    return weeks.filter(week => week.length > 0).map((week, weekIndex) => {
      const orbitRadius = radius * (0.3 + (weekIndex * 0.15)) * goldenRatio.larger(1);
      const rotationSpeed = 0.1 + (weekIndex * 0.05); // Outer orbits move slower
      const baseRotation = time * rotationSpeed;
      
      const nodes = week.map((day, dayIndex) => {
        const dayAngle = (dayIndex / week.length) * 360 + baseRotation;
        const orbitVariation = Math.sin(time * 0.3 + dayIndex) * 5; // Gentle orbital wobble
        const adjustedAngle = dayAngle + orbitVariation;
        const rad = goldenRatio.toRadians(adjustedAngle);
        
        const x = centerX + Math.cos(rad) * orbitRadius;
        const y = centerY + Math.sin(rad) * orbitRadius;
        
        // Node size based on activity and golden ratio
        const baseSize = (radius * 0.02) + (day.activitySummary * radius * 0.03);
        const pulseSize = baseSize * (1 + Math.sin(time * 2 + dayIndex) * day.sleepMoodPulse * 0.3);
        
        return {
          ...day,
          x,
          y,
          size: pulseSize,
          angle: adjustedAngle,
          orbitRadius,
          weekIndex
        };
      });
      
      return {
        weekIndex,
        orbitRadius,
        nodes,
        circumference: 2 * Math.PI * orbitRadius
      };
    });
  }, [monthData, centerX, centerY, radius, time]);

  return (
    <g className={`radial-month-view ${className}`}>
      {/* Gradient definitions */}
      <defs>
        <radialGradient
          id={`month-node-gradient-${theme}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={colors.glow} stopOpacity="1" />
          <stop offset="70%" stopColor={colors.active} stopOpacity="0.8" />
          <stop offset="100%" stopColor={colors.node} stopOpacity="0.6" />
        </radialGradient>
        
        <filter id="month-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Central month indicator */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.1}
        fill="rgba(0, 0, 0, 0.4)"
        stroke={colors.glow}
        strokeWidth="1"
        opacity="0.8"
      />
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        className="text-xs font-light fill-yellow-200"
      >
        {new Date().toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
      </text>
      
      {/* Weekly orbit rings */}
      {weeklyOrbitRings.map((week) => (
        <g key={`week-${week.weekIndex}`}>
          {/* Orbital path */}
          <circle
            cx={centerX}
            cy={centerY}
            r={week.orbitRadius}
            fill="none"
            stroke={colors.orbit}
            strokeWidth="0.5"
            opacity="0.2"
            strokeDasharray="2,4"
          />
          
          {/* Week label */}
          <text
            x={centerX + week.orbitRadius + 10}
            y={centerY + 3}
            className="text-xs font-light fill-gray-400"
          >
            W{week.weekIndex + 1}
          </text>
          
          {/* Day nodes */}
          {week.nodes.map((node, nodeIndex) => (
            <g key={`day-${node.dayOfMonth}`}>
              {/* Activity thickness ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size + (node.activitySummary * 2)}
                fill="none"
                stroke={colors.node}
                strokeWidth={node.activitySummary * 3 + 0.5}
                opacity="0.3"
              />
              
              {/* Main day node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill={`url(#month-node-gradient-${theme})`}
                stroke={node.isToday ? colors.glow : colors.node}
                strokeWidth={node.isToday ? "2" : "0.5"}
                opacity={hoveredDay === nodeIndex ? 1 : 0.8}
                filter="url(#month-glow)"
                onMouseEnter={() => setHoveredDay(nodeIndex)}
                onMouseLeave={() => setHoveredDay(null)}
                onClick={() => onDayClick?.(node)}
                className="transition-all duration-200 ease-out cursor-pointer"
                style={{
                  transform: hoveredDay === nodeIndex ? 'scale(1.2)' : 'scale(1)',
                  transformOrigin: `${node.x}px ${node.y}px`
                }}
              />
              
              {/* Day number */}
              <text
                x={node.x}
                y={node.y + 2}
                textAnchor="middle"
                className="text-xs font-medium pointer-events-none"
                fill={node.isToday ? colors.glow : colors.node}
                style={{ fontSize: Math.max(8, node.size) }}
              >
                {node.dayOfMonth}
              </text>
              
              {/* Sleep/mood pulse indicator */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size * 1.5}
                fill="none"
                stroke={colors.active}
                strokeWidth="1"
                opacity={node.sleepMoodPulse * 0.4}
                className="animate-pulse"
                style={{
                  animationDuration: `${2 + node.sleepMoodPulse * 2}s`
                }}
              />
              
              {/* Tooltip on hover */}
              {hoveredDay === nodeIndex && (
                <g className="day-tooltip">
                  <rect
                    x={node.x - 35}
                    y={node.y - 40}
                    width="70"
                    height="25"
                    rx="4"
                    fill="rgba(0, 0, 0, 0.9)"
                    stroke={colors.glow}
                    strokeWidth="1"
                  />
                  <text
                    x={node.x}
                    y={node.y - 30}
                    textAnchor="middle"
                    className="text-xs font-medium fill-white"
                  >
                    {node.date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </text>
                  <text
                    x={node.x}
                    y={node.y - 18}
                    textAnchor="middle"
                    className="text-xs fill-gray-300"
                  >
                    {node.weatherBand}
                  </text>
                </g>
              )}
            </g>
          ))}
        </g>
      ))}
    </g>
  );
};
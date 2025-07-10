/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useMemo, useState, useEffect } from 'react';
import { goldenRatio, PHI } from '../utils/golden-ratio';

interface DayNode {
  date: Date;
  dayOfMonth: number;
  weekOfMonth: number;
  moodColor: string;
  weatherIcon: string;
  activityLevel: number; // 0-1
  isToday: boolean;
  emotionalPattern: string;
}

interface RadialMonthConstellationProps {
  monthData: DayNode[];
  centerX: number;
  centerY: number;
  radius: number;
  theme?: 'cosmic' | 'natural' | 'floral';
  onDayClick?: (day: DayNode) => void;
  playbackProgress?: number; // 0-1 for animation
  className?: string;
}

const themeColors = {
  cosmic: {
    base: 'hsl(240 50% 40%)',
    active: 'hsl(240 70% 60%)',
    constellation: 'hsl(240 60% 50%)',
    glow: 'hsl(240 80% 70%)'
  },
  natural: {
    base: 'hsl(120 40% 40%)',
    active: 'hsl(120 60% 50%)',
    constellation: 'hsl(120 50% 45%)',
    glow: 'hsl(120 70% 60%)'
  },
  floral: {
    base: 'hsl(320 40% 50%)',
    active: 'hsl(320 60% 60%)',
    constellation: 'hsl(320 50% 55%)',
    glow: 'hsl(320 80% 70%)'
  }
};

export const RadialMonthConstellation: React.FC<RadialMonthConstellationProps> = ({
  monthData,
  centerX,
  centerY,
  radius,
  theme = 'cosmic',
  onDayClick,
  playbackProgress = 0,
  className = ''
}) => {
  const [time, setTime] = useState(0);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Gentle orbital animation
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      setTime((Date.now() - startTime) / 1000);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const colors = themeColors[theme];

  // Group days into week arms
  const weeklyArms = useMemo(() => {
    const weeks = [[], [], [], [], [], []] as DayNode[][];
    
    monthData.forEach(day => {
      weeks[day.weekOfMonth]?.push(day);
    });

    return weeks.filter(week => week.length > 0).map((week, armIndex) => {
      const armAngle = (armIndex / 4) * 360; // 4 arms for 4 weeks
      const armRadius = radius * (0.3 + armIndex * 0.15);
      
      const nodes = week.map((day, dayIndex) => {
        const nodeAngle = armAngle + (dayIndex - week.length/2) * 15; // Spread within arm
        const orbitalDrift = Math.sin(time * 0.2 + armIndex + dayIndex) * 3;
        const adjustedAngle = nodeAngle + orbitalDrift;
        const rad = goldenRatio.toRadians(adjustedAngle);
        
        const x = centerX + Math.cos(rad) * armRadius;
        const y = centerY + Math.sin(rad) * armRadius;
        
        // Node size based on activity and golden ratio
        const baseSize = radius * 0.015;
        const activitySize = baseSize * (1 + day.activityLevel * 0.8);
        const breathingSize = activitySize * (1 + Math.sin(time + dayIndex) * 0.1);
        
        return {
          ...day,
          x,
          y,
          size: breathingSize,
          armIndex,
          nodeIndex: dayIndex
        };
      });

      return {
        armIndex,
        armAngle,
        armRadius,
        nodes
      };
    });
  }, [monthData, centerX, centerY, radius, time]);

  // Calculate constellation lines between related days
  const constellationLines = useMemo(() => {
    const lines = [];
    
    // Connect days with similar emotional patterns
    for (let i = 0; i < weeklyArms.length; i++) {
      const currentArm = weeklyArms[i];
      
      for (let j = 0; j < currentArm.nodes.length - 1; j++) {
        const nodeA = currentArm.nodes[j];
        const nodeB = currentArm.nodes[j + 1];
        
        if (nodeA.emotionalPattern === nodeB.emotionalPattern) {
          lines.push({
            id: `arm-${i}-${j}`,
            x1: nodeA.x,
            y1: nodeA.y,
            x2: nodeB.x,
            y2: nodeB.y,
            strength: 0.6,
            pattern: nodeA.emotionalPattern
          });
        }
      }
    }
    
    // Connect across arms for recurring patterns (e.g., weekly rhythms)
    weeklyArms.forEach((armA, armIndexA) => {
      weeklyArms.forEach((armB, armIndexB) => {
        if (armIndexA < armIndexB) {
          armA.nodes.forEach((nodeA, dayIndexA) => {
            armB.nodes.forEach((nodeB, dayIndexB) => {
              if (dayIndexA === dayIndexB && nodeA.activityLevel > 0.7 && nodeB.activityLevel > 0.7) {
                lines.push({
                  id: `cross-${armIndexA}-${armIndexB}-${dayIndexA}`,
                  x1: nodeA.x,
                  y1: nodeA.y,
                  x2: nodeB.x,
                  y2: nodeB.y,
                  strength: 0.3,
                  pattern: 'recurring'
                });
              }
            });
          });
        }
      });
    });

    return lines;
  }, [weeklyArms]);

  return (
    <g className={`radial-month-constellation ${className}`}>
      <defs>
        {/* Constellation glow filter */}
        <filter id="constellation-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Day node gradient */}
        <radialGradient id="day-node-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.glow} stopOpacity="1" />
          <stop offset="70%" stopColor={colors.active} stopOpacity="0.8" />
          <stop offset="100%" stopColor={colors.base} stopOpacity="0.6" />
        </radialGradient>
      </defs>

      {/* Central month indicator */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.08}
        fill="rgba(0, 0, 0, 0.4)"
        stroke={colors.glow}
        strokeWidth="1.5"
        opacity="0.8"
      />
      <text
        x={centerX}
        y={centerY + 3}
        textAnchor="middle"
        className="text-sm font-light fill-yellow-200"
      >
        {new Date().toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
      </text>

      {/* Constellation lines */}
      {constellationLines.map((line) => (
        <line
          key={line.id}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={colors.constellation}
          strokeWidth={line.strength * 2}
          opacity={0.2 + line.strength * 0.3}
          strokeDasharray="2 4"
          filter="url(#constellation-glow)"
          style={{
            animation: `constellationPulse ${3 + Math.random() * 2}s ease-in-out infinite`
          }}
        />
      ))}

      {/* Weekly arms and day nodes */}
      {weeklyArms.map((arm) => (
        <g key={`arm-${arm.armIndex}`}>
          {/* Week arm guide */}
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + Math.cos(goldenRatio.toRadians(arm.armAngle)) * arm.armRadius}
            y2={centerY + Math.sin(goldenRatio.toRadians(arm.armAngle)) * arm.armRadius}
            stroke={colors.base}
            strokeWidth="0.5"
            opacity="0.1"
            strokeDasharray="1 3"
          />
          
          {/* Week label */}
          <text
            x={centerX + Math.cos(goldenRatio.toRadians(arm.armAngle)) * (arm.armRadius + 20)}
            y={centerY + Math.sin(goldenRatio.toRadians(arm.armAngle)) * (arm.armRadius + 20)}
            textAnchor="middle"
            className="text-xs font-light fill-gray-400"
          >
            W{arm.armIndex + 1}
          </text>

          {/* Day nodes */}
          {arm.nodes.map((node) => (
            <g key={`day-${node.dayOfMonth}`}>
              {/* Node glow */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size * 1.5}
                fill={node.moodColor}
                opacity={0.2}
                filter="url(#constellation-glow)"
              />
              
              {/* Main day node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill="url(#day-node-gradient)"
                stroke={node.isToday ? colors.glow : node.moodColor}
                strokeWidth={node.isToday ? "2" : "1"}
                opacity={hoveredDay === node.dayOfMonth ? 1 : 0.8}
                onMouseEnter={() => setHoveredDay(node.dayOfMonth)}
                onMouseLeave={() => setHoveredDay(null)}
                onClick={() => onDayClick?.(node)}
                className="cursor-pointer transition-all duration-200"
                style={{
                  transform: hoveredDay === node.dayOfMonth ? 'scale(1.3)' : 'scale(1)',
                  transformOrigin: `${node.x}px ${node.y}px`
                }}
              />
              
              {/* Day number */}
              <text
                x={node.x}
                y={node.y + 2}
                textAnchor="middle"
                className="text-xs font-medium pointer-events-none"
                fill={node.isToday ? colors.glow : 'white'}
                style={{ fontSize: Math.max(8, node.size * 0.8) }}
              >
                {node.dayOfMonth}
              </text>
              
              {/* Weather icon */}
              <text
                x={node.x}
                y={node.y - node.size - 8}
                textAnchor="middle"
                className="text-xs pointer-events-none"
                opacity={hoveredDay === node.dayOfMonth ? 1 : 0.6}
              >
                {node.weatherIcon}
              </text>

              {/* Hover tooltip */}
              {hoveredDay === node.dayOfMonth && (
                <g className="day-tooltip">
                  <rect
                    x={node.x - 30}
                    y={node.y + node.size + 10}
                    width="60"
                    height="30"
                    rx="4"
                    fill="rgba(0, 0, 0, 0.9)"
                    stroke={colors.glow}
                    strokeWidth="1"
                  />
                  <text
                    x={node.x}
                    y={node.y + node.size + 25}
                    textAnchor="middle"
                    className="text-xs font-medium fill-white"
                  >
                    {node.date.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      day: 'numeric'
                    })}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + node.size + 37}
                    textAnchor="middle"
                    className="text-xs fill-gray-300"
                  >
                    {node.emotionalPattern}
                  </text>
                </g>
              )}
            </g>
          ))}
        </g>
      ))}

      <style>
        {`
        @keyframes constellationPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        `}
      </style>
    </g>
  );
};
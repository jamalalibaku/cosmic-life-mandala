/**
 * Enhanced Plans Layer Ring with Reactive Motion
 * Daily plans and activities as reactive arcs that respond to mouse proximity
 */

import React from 'react';
import { motion } from 'framer-motion';
// Reactive motion disabled

interface PlanData {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  category: 'work' | 'personal' | 'health' | 'social';
  priority: 'low' | 'medium' | 'high';
  completed?: boolean;
}

interface ReactivePlansLayerRingProps {
  plansData: PlanData[];
  centerX: number;
  centerY: number;
  radius: number;
  theme: string;
}

export const ReactivePlansLayerRing: React.FC<ReactivePlansLayerRingProps> = ({
  plansData,
  centerX,
  centerY,
  radius,
  theme
}) => {
  const timeToAngle = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / (24 * 60)) * 2 * Math.PI - Math.PI / 2;
  };

  const categoryColors = {
    work: 'hsl(210 70% 60%)',
    personal: 'hsl(160 70% 60%)',
    health: 'hsl(120 70% 60%)',
    social: 'hsl(280 70% 60%)'
  };

  const priorityIntensity = {
    low: 0.4,
    medium: 0.7,
    high: 1.0
  };

  return (
    <g className="reactive-plans-layer">
      {/* Background ring */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="hsl(var(--border) / 0.3)"
        strokeWidth="1"
        strokeDasharray="3,7"
      />

      {/* Reactive plan arcs */}
      {plansData.map((plan, index) => {
        const startAngle = timeToAngle(plan.startTime);
        const endAngle = timeToAngle(plan.endTime);
        const midAngle = (startAngle + endAngle) / 2;
        
        const startX = centerX + Math.cos(startAngle) * radius;
        const startY = centerY + Math.sin(startAngle) * radius;
        const endX = centerX + Math.cos(endAngle) * radius;
        const endY = centerY + Math.sin(endAngle) * radius;
        const midX = centerX + Math.cos(midAngle) * radius;
        const midY = centerY + Math.sin(midAngle) * radius;

        const arcLength = Math.abs(endAngle - startAngle);
        const isLargeArc = arcLength > Math.PI ? 1 : 0;
        const sweepFlag = endAngle > startAngle ? 1 : 0;

        const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${isLargeArc} ${sweepFlag} ${endX} ${endY}`;
        
        const color = categoryColors[plan.category];
        const intensity = priorityIntensity[plan.priority];
        const strokeWidth = 2 + intensity * 4;

        return (
          <motion.g key={plan.id} className="plan-arc-group">
            {/* Main arc */}
            <motion.path
              d={pathData}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              opacity={plan.completed ? 0.4 : 0.7 + intensity * 0.2}
              strokeLinecap="round"
            />

            {/* Priority indicator */}
            <motion.circle
              cx={midX}
              cy={midY}
              r={2 + intensity * 2}
              fill={color}
              opacity={0.8}
            />
          </motion.g>
        );
      })}

      {/* Time markers */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius + 20);
        const y = centerY + Math.sin(angle) * (radius + 20);
        const isQuarterHour = i % 6 === 0;

        return (
          <motion.g key={`time-${i}`}>
            <line
              x1={centerX + Math.cos(angle) * (radius - 5)}
              y1={centerY + Math.sin(angle) * (radius - 5)}
              x2={centerX + Math.cos(angle) * (radius + (isQuarterHour ? 15 : 8))}
              y2={centerY + Math.sin(angle) * (radius + (isQuarterHour ? 15 : 8))}
              stroke="hsl(var(--muted-foreground) / 0.4)"
              strokeWidth={isQuarterHour ? 2 : 1}
            />
            {isQuarterHour && (
              <text
                x={x}
                y={y + 20}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
                opacity={0.6}
              >
                {i}:00
              </text>
            )}
          </motion.g>
        );
      })}
    </g>
  );
};
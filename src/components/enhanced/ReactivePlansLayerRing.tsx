/**
 * Enhanced Plans Layer Ring with Reactive Motion
 * Daily plans and activities as reactive arcs that respond to mouse proximity
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ReactiveElement, ReactiveSVGElement } from '@/components/ui/ReactiveMotion';

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
      {/* Background ring with subtle reactive motion */}
      <ReactiveElement
        center={{ x: centerX, y: centerY }}
        intensity={0.3}
        maxDistance={200}
        type="arc"
      >
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="hsl(var(--border) / 0.3)"
          strokeWidth="1"
          strokeDasharray="3,7"
          animate={{
            strokeDashoffset: [0, -10]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </ReactiveElement>

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
          <ReactiveSVGElement
            key={plan.id}
            center={{ x: midX, y: midY }}
            intensity={intensity}
            maxDistance={80}
            type="path"
          >
            <motion.g className="plan-arc-group">
              {/* Main arc with reactive motion */}
              <motion.path
                d={pathData}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                opacity={plan.completed ? 0.4 : 0.7 + intensity * 0.2}
                strokeLinecap="round"
                animate={{
                  strokeDasharray: plan.completed ? 
                    [`${arcLength * radius * 0.1}`, `${arcLength * radius * 0.05}`] : 
                    "none",
                  strokeDashoffset: plan.completed ?
                    [0, -arcLength * radius * 0.15] : 0
                }}
                transition={{
                  duration: plan.completed ? 2 : 0,
                  repeat: plan.completed ? Infinity : 0,
                  ease: "linear"
                }}
              />

              {/* Priority indicator */}
              <motion.circle
                cx={midX}
                cy={midY}
                r={2 + intensity * 2}
                fill={color}
                opacity={0.8}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 0.4, 0.8]
                }}
                transition={{
                  duration: 2 + intensity,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              />

              {/* Completion glow effect */}
              {plan.completed && (
                <motion.circle
                  cx={midX}
                  cy={midY}
                  r={8}
                  fill="none"
                  stroke={color}
                  strokeWidth={1}
                  opacity={0.6}
                  animate={{
                    r: [8, 15, 8],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}

              {/* Category label (appears on hover) */}
              <motion.g
                className="plan-label"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.rect
                  x={midX - 25}
                  y={midY - 10}
                  width={50}
                  height={20}
                  rx={10}
                  fill="hsl(var(--background) / 0.9)"
                  stroke={color}
                  strokeWidth={1}
                />
                <text
                  x={midX}
                  y={midY + 2}
                  textAnchor="middle"
                  className="text-xs font-medium"
                  fill="hsl(var(--foreground))"
                >
                  {plan.category}
                </text>
              </motion.g>
            </motion.g>
          </ReactiveSVGElement>
        );
      })}

      {/* Time markers with reactive motion */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius + 20);
        const y = centerY + Math.sin(angle) * (radius + 20);
        const isQuarterHour = i % 6 === 0;

        return (
          <ReactiveSVGElement
            key={`time-${i}`}
            center={{ x, y }}
            intensity={0.2}
            maxDistance={30}
            type="circle"
          >
            <motion.g>
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
          </ReactiveSVGElement>
        );
      })}
    </g>
  );
};
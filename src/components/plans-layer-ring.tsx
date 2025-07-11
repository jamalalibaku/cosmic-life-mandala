/**
 * (c) 2025 Cosmic Life Mandala – Plans Layer Ring
 * Renders planned activities and schedule data as curved ribbons on the timeline
 */

import React from 'react';
import { motion } from 'framer-motion';
import { PlansDataPoint } from '@/data/mock-plans-data';

interface PlansLayerRingProps {
  plansData: PlansDataPoint[];
  centerX: number;
  centerY: number;
  radius: number;
  theme: string;
  onPlanClick?: (plan: PlansDataPoint) => void;
}

export const PlansLayerRing: React.FC<PlansLayerRingProps> = ({
  plansData,
  centerX,
  centerY,
  radius,
  theme,
  onPlanClick
}) => {
  // Convert timestamp to angle (24 hours = 360 degrees)
  const timeToAngle = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours() + (date.getMinutes() / 60);
    return (hours / 24) * 360 - 90; // -90 to start from top
  };

  // Generate SVG path for curved ribbon
  const generateRibbonPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const startRad1 = (startAngle * Math.PI) / 180;
    const endRad1 = (endAngle * Math.PI) / 180;
    const startRad2 = (startAngle * Math.PI) / 180;
    const endRad2 = (endAngle * Math.PI) / 180;

    const x1 = centerX + innerRadius * Math.cos(startRad1);
    const y1 = centerY + innerRadius * Math.sin(startRad1);
    const x2 = centerX + innerRadius * Math.cos(endRad1);
    const y2 = centerY + innerRadius * Math.sin(endRad1);
    const x3 = centerX + outerRadius * Math.cos(endRad2);
    const y3 = centerY + outerRadius * Math.sin(endRad2);
    const x4 = centerX + outerRadius * Math.cos(startRad2);
    const y4 = centerY + outerRadius * Math.sin(startRad2);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
  };

  // Get colors based on plan type and status
  const getPlanStyles = (plan: PlansDataPoint) => {
    const baseColors = {
      task: { hue: 200, sat: 70 },
      goal: { hue: 280, sat: 60 },
      project: { hue: 120, sat: 75 },
      meeting: { hue: 45, sat: 65 },
      deadline: { hue: 0, sat: 80 }
    };

    const statusOpacity = {
      planned: 0.4,
      active: 0.8,
      completed: 0.6,
      paused: 0.3
    };

    const priorityIntensity = {
      low: 0.6,
      medium: 0.8,
      high: 1.0,
      urgent: 1.2
    };

    const color = baseColors[plan.type];
    const opacity = statusOpacity[plan.status];
    const intensity = priorityIntensity[plan.priority];

    return {
      fill: `hsl(${color.hue} ${color.sat * intensity}% ${60 + (intensity * 10)}%)`,
      stroke: `hsl(${color.hue} ${color.sat * intensity}% ${40 + (intensity * 10)}%)`,
      opacity: opacity,
      strokeDasharray: plan.status === 'planned' ? '4,2' : 'none'
    };
  };

  return (
    <g className="plans-layer-ring">
      {plansData.map((plan, index) => {
        const startAngle = timeToAngle(plan.timestamp);
        const duration = plan.duration || 1; // Default 1 hour
        const endAngle = startAngle + (duration / 24) * 360;
        
        const innerRadius = radius - 8;
        const outerRadius = radius + 8;
        const styles = getPlanStyles(plan);

        return (
          <motion.g
            key={`${plan.timestamp}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Plan ribbon */}
            <motion.path
              d={generateRibbonPath(startAngle, endAngle, innerRadius, outerRadius)}
              fill={styles.fill}
              stroke={styles.stroke}
              strokeWidth="1"
              strokeDasharray={styles.strokeDasharray}
              opacity={styles.opacity}
              className="cursor-pointer transition-all duration-200"
              whileHover={{
                scale: 1.05,
                opacity: styles.opacity + 0.2
              }}
              onClick={() => onPlanClick?.(plan)}
            />

            {/* Priority indicator for urgent items */}
            {plan.priority === 'urgent' && (
              <motion.circle
                cx={centerX + (radius + 15) * Math.cos((startAngle * Math.PI) / 180)}
                cy={centerY + (radius + 15) * Math.sin((startAngle * Math.PI) / 180)}
                r="3"
                fill="hsl(0 80% 60%)"
                className="animate-pulse"
              />
            )}

            {/* Completion indicator */}
            {plan.status === 'completed' && (
              <motion.circle
                cx={centerX + (radius - 15) * Math.cos(((startAngle + endAngle) / 2 * Math.PI) / 180)}
                cy={centerY + (radius - 15) * Math.sin(((startAngle + endAngle) / 2 * Math.PI) / 180)}
                r="2"
                fill="hsl(120 60% 50%)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              />
            )}
          </motion.g>
        );
      })}

      {/* Layer ring guide */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="0.5"
        opacity="0.1"
        strokeDasharray="2,4"
      />
    </g>
  );
};
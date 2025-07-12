/**
 * Enhanced Plans Layer - Day 4 Completion
 * Refined visual representation with better calendar events
 */

import React from 'react';
import { motion } from 'framer-motion';
import { OptimizedMotion } from '@/components/ui/OptimizedMotion';
import { PlansDataPoint } from '@/data/mock-plans-data';
import { Calendar, Clock, Target, Users, AlertTriangle } from 'lucide-react';

interface EnhancedPlansLayerProps {
  plansData: PlansDataPoint[];
  centerX: number;
  centerY: number;
  radius: number;
  theme: string;
  onPlanClick?: (plan: PlansDataPoint) => void;
  showDetails?: boolean;
}

export const EnhancedPlansLayer: React.FC<EnhancedPlansLayerProps> = ({
  plansData,
  centerX,
  centerY,
  radius,
  theme,
  onPlanClick,
  showDetails = false
}) => {
  // Convert timestamp to angle (24 hours = 360 degrees)
  const timeToAngle = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours() + (date.getMinutes() / 60);
    return (hours / 24) * 360 - 90; // -90 to start from top
  };

  const getPlanIcon = (type: PlansDataPoint['type']) => {
    switch (type) {
      case 'meeting': return Users;
      case 'deadline': return AlertTriangle;
      case 'goal': return Target;
      case 'task': return Clock;
      default: return Calendar;
    }
  };

  const getPlanColor = (plan: PlansDataPoint) => {
    const colors = {
      task: 'hsl(200 70% 60%)',
      goal: 'hsl(280 60% 65%)',
      project: 'hsl(120 75% 55%)',
      meeting: 'hsl(45 85% 60%)',
      deadline: 'hsl(0 80% 65%)'
    };
    
    const statusModifier = {
      planned: 0.6,
      active: 1.0,
      completed: 0.7,
      paused: 0.4
    };
    
    const base = colors[plan.type];
    const modifier = statusModifier[plan.status];
    
    return base.replace(/60%\)$/, `${60 * modifier}%)`);
  };

  const generateArcPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const startRad1 = (startAngle * Math.PI) / 180;
    const endRad1 = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + innerRadius * Math.cos(startRad1);
    const y1 = centerY + innerRadius * Math.sin(startRad1);
    const x2 = centerX + innerRadius * Math.cos(endRad1);
    const y2 = centerY + innerRadius * Math.sin(endRad1);
    const x3 = centerX + outerRadius * Math.cos(endRad1);
    const y3 = centerY + outerRadius * Math.sin(endRad1);
    const x4 = centerX + outerRadius * Math.cos(startRad1);
    const y4 = centerY + outerRadius * Math.sin(startRad1);

    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <g className="enhanced-plans-layer">
      {/* Base ring */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="0.5"
        opacity="0.2"
        strokeDasharray="1,3"
      />

      {plansData.map((plan, index) => {
        const angle = timeToAngle(plan.timestamp);
        const duration = plan.duration || 1;
        const endAngle = angle + (duration / 24) * 360;
        
        const innerRadius = radius - 10;
        const outerRadius = radius + 10;
        const Icon = getPlanIcon(plan.type);
        
        const planColor = getPlanColor(plan);
        
        // Icon position
        const iconAngle = (angle + endAngle) / 2;
        const iconRad = (iconAngle * Math.PI) / 180;
        const iconX = centerX + radius * Math.cos(iconRad);
        const iconY = centerY + radius * Math.sin(iconRad);

        return (
          <motion.g
            key={`plan-${plan.timestamp}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            {/* Plan arc */}
            <motion.path
              d={generateArcPath(angle, endAngle, innerRadius, outerRadius)}
              fill={planColor}
              stroke={planColor.replace(/60%/, '40%')}
              strokeWidth="1"
              opacity={plan.status === 'completed' ? 0.6 : 0.8}
              className="cursor-pointer"
              whileHover={{ 
                scale: 1.05,
                opacity: 0.9
              }}
              onClick={() => onPlanClick?.(plan)}
            />

            {/* Priority indicator */}
            {plan.priority === 'urgent' && (
              <motion.circle
                cx={centerX + (radius + 15) * Math.cos((angle * Math.PI) / 180)}
                cy={centerY + (radius + 15) * Math.sin((angle * Math.PI) / 180)}
                r="3"
                fill="hsl(0 100% 60%)"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}

            {/* Status indicator */}
            {plan.status === 'completed' && (
              <motion.path
                d={`M ${iconX - 4} ${iconY} L ${iconX - 1} ${iconY + 3} L ${iconX + 4} ${iconY - 3}`}
                stroke="hsl(120 60% 50%)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              />
            )}

            {/* Plan icon */}
            <g style={{ transform: `translate(${iconX}px, ${iconY}px)` }}>
              <circle
                cx="0"
                cy="0"
                r="8"
                fill="rgba(0,0,0,0.7)"
                stroke={planColor}
                strokeWidth="1.5"
              />
              <Icon
                x="-6"
                y="-6"
                size={12}
                color={planColor}
                className="opacity-90"
              />
            </g>

            {/* Detail popup */}
            {showDetails && (
              <motion.g
                style={{ transform: `translate(${iconX + 15}px, ${iconY - 10}px)` }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <rect
                  x="0"
                  y="0"
                  width="120"
                  height="40"
                  rx="6"
                  fill="rgba(0,0,0,0.9)"
                  stroke={planColor}
                  strokeWidth="1"
                />
                <text
                  x="60"
                  y="15"
                  textAnchor="middle"
                  className="fill-white text-xs font-medium"
                >
                  {plan.title.slice(0, 15)}
                </text>
                <text
                  x="60"
                  y="30"
                  textAnchor="middle"
                  className="fill-white/70 text-xs"
                >
                  {plan.status} • {plan.priority}
                </text>
              </motion.g>
            )}
          </motion.g>
        );
      })}
    </g>
  );
};
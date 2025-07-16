/**
 * Data Blob Ring - Static version without reactive motion
 * Sleep/rest patterns as static blobs 
 */

import React from 'react';
import { motion } from '@/components/ui/NoAnimationMotion';

interface DataPoint {
  hour: number;
  type: 'sleep' | 'rest' | 'activity' | 'mood' | 'mobility';
  intensity: number;
  duration: number;
}

interface DataBlobRingProps {
  data: any[];
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  type: string;
  label?: string;
  onMoodChange?: (mood: any) => void;
  [key: string]: any; // Allow additional props
}

export const DataBlobRing: React.FC<DataBlobRingProps> = ({
  data,
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  type,
  ...otherProps
}) => {
  const radius = (innerRadius + outerRadius) / 2;

  return (
    <g className="data-blob-ring">
      {/* Background ring */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="hsl(var(--muted) / 0.2)"
        strokeWidth="1"
        strokeDasharray="5,5"
      />

      {/* Data blobs */}
      {data.map((point, index) => {
        const angle = ((point.hour || index) / 24) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const size = 3 + (point.intensity || 0.5) * 8;

        const colors = {
          sleep: 'hsl(240 70% 60%)',
          rest: 'hsl(200 60% 55%)',
          activity: 'hsl(120 60% 50%)',
          mood: 'hsl(280 70% 60%)',
          mobility: 'hsl(60 70% 60%)'
        };

        const pointType = point.type || type;

        return (
          <g key={`${type}-${point.hour || index}`}>
            <circle
              cx={x}
              cy={y}
              r={size}
              fill={colors[pointType as keyof typeof colors] || colors.activity}
              opacity={0.6 + (point.intensity || 0.5) * 0.3}
            />
          </g>
        );
      })}

      {/* Hour markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius + 15);
        const y = centerY + Math.sin(angle) * (radius + 15);

        return (
          <g key={`marker-${i}`}>
            <circle
              cx={x}
              cy={y}
              r={1.5}
              fill="hsl(var(--muted-foreground) / 0.4)"
            />
            <text
              x={x}
              y={y + 15}
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
              opacity={0.6}
            >
              {i * 2}h
            </text>
          </g>
        );
      })}
    </g>
  );
};
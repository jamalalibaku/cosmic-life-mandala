/**
 * Enhanced Data Blob Ring with Reactive Motion
 * Sleep/rest patterns as reactive, breathing blobs that respond to mouse proximity
 */

import React from 'react';
import { motion } from 'framer-motion';
// Reactive motion disabled

interface DataPoint {
  hour: number;
  type: 'sleep' | 'rest' | 'activity' | 'mood';
  intensity: number;
  duration: number;
}

interface DataBlobRingProps {
  data: DataPoint[];
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  type: string;
}

export const ReactiveDataBlobRing: React.FC<DataBlobRingProps> = ({
  data,
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  type
}) => {
  const radius = (innerRadius + outerRadius) / 2;

  return (
    <g className="data-blob-ring">
      {/* Background ring */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="hsl(var(--muted) / 0.2)"
        strokeWidth="1"
        strokeDasharray="5,5"
      />

      {/* Reactive data blobs */}
      {data.map((point, index) => {
        const angle = (point.hour / 24) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const size = 3 + point.intensity * 8;

        const colors = {
          sleep: 'hsl(240 70% 60%)',
          rest: 'hsl(200 60% 55%)',
          activity: 'hsl(120 60% 50%)',
          mood: 'hsl(280 70% 60%)'
        };

        return (
          <motion.g key={`${type}-${point.hour}`}>
            {/* Main blob */}
            <motion.circle
              cx={x}
              cy={y}
              r={size}
              fill={colors[point.type]}
              opacity={0.6 + point.intensity * 0.3}
            />
          </motion.g>
        );
      })}

      {/* Hour markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius + 15);
        const y = centerY + Math.sin(angle) * (radius + 15);

        return (
          <motion.g key={`marker-${i}`}>
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
          </motion.g>
        );
      })}
    </g>
  );
};

// Export as DataBlobRing for compatibility
export { ReactiveDataBlobRing as DataBlobRing };
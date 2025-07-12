/**
 * Enhanced Data Blob Ring with Reactive Motion
 * Sleep/rest patterns as reactive, breathing blobs that respond to mouse proximity
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ReactiveElement, ReactiveSVGElement } from '@/components/ui/ReactiveMotion';

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
      {/* Reactive background ring */}
      <ReactiveElement
        center={{ x: centerX, y: centerY }}
        intensity={0.5}
        maxDistance={150}
        type="blob"
      >
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted) / 0.2)"
          strokeWidth="1"
          strokeDasharray="5,5"
          animate={{
            strokeDashoffset: [0, -10]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </ReactiveElement>

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
          <ReactiveSVGElement
            key={`${type}-${point.hour}`}
            center={{ x, y }}
            intensity={point.intensity}
            maxDistance={60}
            type="circle"
          >
            <motion.g>
              {/* Main blob with breathing effect */}
              <motion.circle
                cx={x}
                cy={y}
                r={size}
                fill={colors[point.type]}
                opacity={0.6 + point.intensity * 0.3}
                animate={{
                  r: [size, size * 1.2, size],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{
                  duration: 3 + point.intensity * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              />
              
              {/* Inner glow */}
              <motion.circle
                cx={x}
                cy={y}
                r={size * 0.5}
                fill={colors[point.type]}
                opacity={0.9}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.9, 0.3, 0.9]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.1
                }}
              />

              {/* Duration indicator */}
              {point.duration > 0.5 && (
                <motion.rect
                  x={x - size}
                  y={y - 1}
                  width={size * 2 * point.duration}
                  height={2}
                  fill={colors[point.type]}
                  opacity={0.4}
                  rx={1}
                  animate={{
                    width: [0, size * 2 * point.duration, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3
                  }}
                />
              )}
            </motion.g>
          </ReactiveSVGElement>
        );
      })}

      {/* Hour markers with reactive motion */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius + 15);
        const y = centerY + Math.sin(angle) * (radius + 15);

        return (
          <ReactiveSVGElement
            key={`marker-${i}`}
            center={{ x, y }}
            intensity={0.3}
            maxDistance={40}
            type="circle"
          >
            <motion.g>
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
          </ReactiveSVGElement>
        );
      })}
    </g>
  );
};

// Export as DataBlobRing for compatibility
export { ReactiveDataBlobRing as DataBlobRing };
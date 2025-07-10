import React, { useMemo, useState, useEffect } from 'react';
import { goldenRatio } from '../utils/golden-ratio';

export type DataBlobType = 'mobility' | 'mood' | 'sleep';

export type DataBlob = {
  hour: number;
  type: DataBlobType;
  intensity: number; // 0-1
  duration: number; // 0-1 (percentage of hour)
  value?: number;
};

interface DataBlobRingProps {
  data: DataBlob[];
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  type: DataBlobType;
  theme?: 'cosmic' | 'natural' | 'minimal';
  label?: string;
  className?: string;
}

const blobColorMap: Record<DataBlobType, { 
  primary: string; 
  secondary: string; 
  glow: string;
  label: string;
}> = {
  mobility: {
    primary: 'hsl(120 80% 60%)',
    secondary: 'hsl(110 70% 50%)',
    glow: 'hsl(120 90% 70%)',
    label: 'movement'
  },
  mood: {
    primary: 'hsl(280 70% 65%)',
    secondary: 'hsl(270 60% 55%)',
    glow: 'hsl(280 80% 75%)',
    label: 'mood'
  },
  sleep: {
    primary: 'hsl(220 60% 70%)',
    secondary: 'hsl(210 50% 60%)',
    glow: 'hsl(220 70% 80%)',
    label: 'rest'
  }
};

export const DataBlobRing: React.FC<DataBlobRingProps> = ({
  data,
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  type,
  theme = 'cosmic',
  label,
  className = ''
}) => {
  const [time, setTime] = useState(0);
  const [hoveredBlob, setHoveredBlob] = useState<number | null>(null);

  // Gentle drift animation
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      setTime((Date.now() - startTime) / 1000);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const colors = blobColorMap[type];
  const ringRadius = (innerRadius + outerRadius) / 2;
  const ringWidth = outerRadius - innerRadius;

  const blobs = useMemo(() => {
    const currentHour = new Date().getHours();
    const segmentAngle = 360 / 24;
    const rotationOffset = -currentHour * segmentAngle - 90;
    
    return data.map((blob, index) => {
      const angle = rotationOffset + (blob.hour * segmentAngle);
      const driftOffset = Math.sin(time * 0.3 + index * 0.5) * 2; // Gentle drift
      const adjustedAngle = angle + driftOffset;
      const rad = goldenRatio.toRadians(adjustedAngle);
      
      // Position on the ring with slight radial variation
      const radialVariation = Math.sin(time * 0.5 + index) * (ringWidth * 0.1);
      const blobRadius = ringRadius + radialVariation;
      
      const x = centerX + Math.cos(rad) * blobRadius;
      const y = centerY + Math.sin(rad) * blobRadius;
      
      // Size based on intensity and duration
      const baseSize = ringWidth * 0.3;
      const intensityScale = 0.5 + (blob.intensity * 0.8);
      const durationScale = 0.6 + (blob.duration * 0.7);
      const size = baseSize * intensityScale * durationScale;
      
      // Pulsing based on intensity
      const pulseScale = 1 + Math.sin(time * 2 + index) * (blob.intensity * 0.2);
      
      return {
        ...blob,
        x,
        y,
        size: size * pulseScale,
        opacity: 0.6 + (blob.intensity * 0.4),
        angle: adjustedAngle
      };
    });
  }, [data, centerX, centerY, innerRadius, outerRadius, time, type]);

  const labelPosition = useMemo(() => {
    const labelAngle = goldenRatio.toRadians(-45); // Position at upper right
    const labelRadius = outerRadius + 30;
    return {
      x: centerX + Math.cos(labelAngle) * labelRadius,
      y: centerY + Math.sin(labelAngle) * labelRadius + Math.sin(time * 0.3) * 2
    };
  }, [centerX, centerY, outerRadius, time]);

  return (
    <g className={`data-blob-ring ${className}`}>
      {/* Gradient definitions */}
      <defs>
        <radialGradient
          id={`blob-gradient-${type}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={colors.glow} stopOpacity="0.9" />
          <stop offset="50%" stopColor={colors.primary} stopOpacity="0.7" />
          <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.3" />
        </radialGradient>
        
        <filter id={`blob-glow-${type}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Ring guide (subtle) */}
      <circle
        cx={centerX}
        cy={centerY}
        r={ringRadius}
        fill="none"
        stroke={colors.primary}
        strokeWidth="0.5"
        opacity="0.1"
        strokeDasharray="2,4"
        className="pointer-events-none"
      />
      
      {/* Data blobs */}
      {blobs.map((blob, index) => (
        <g key={`blob-${type}-${index}`}>
          <circle
            cx={blob.x}
            cy={blob.y}
            r={blob.size}
            fill={`url(#blob-gradient-${type})`}
            opacity={hoveredBlob === index ? 1 : blob.opacity}
            filter={`url(#blob-glow-${type})`}
            onMouseEnter={() => setHoveredBlob(index)}
            onMouseLeave={() => setHoveredBlob(null)}
            className="transition-all duration-300 ease-out cursor-pointer"
            style={{
              transform: hoveredBlob === index ? 'scale(1.2)' : 'scale(1)',
              transformOrigin: `${blob.x}px ${blob.y}px`
            }}
          />
          
          {/* Tooltip on hover */}
          {hoveredBlob === index && (
            <g className="blob-tooltip">
              <rect
                x={blob.x - 25}
                y={blob.y - 35}
                width="50"
                height="25"
                rx="4"
                fill="rgba(0, 0, 0, 0.8)"
                stroke={colors.glow}
                strokeWidth="0.5"
              />
              <text
                x={blob.x}
                y={blob.y - 20}
                textAnchor="middle"
                className="fill-white text-xs font-medium"
              >
                {blob.hour.toString().padStart(2, '0')}:00
              </text>
              <text
                x={blob.x}
                y={blob.y - 8}
                textAnchor="middle"
                className="fill-gray-300 text-xs"
              >
                {Math.round(blob.intensity * 100)}%
              </text>
            </g>
          )}
        </g>
      ))}
      
      {/* Floating label */}
      {label && (
        <text
          x={labelPosition.x}
          y={labelPosition.y}
          textAnchor="middle"
          className="fill-gray-300 text-sm font-light opacity-70"
        >
          {label || colors.label}
        </text>
      )}
    </g>
  );
};
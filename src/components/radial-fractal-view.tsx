/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useMemo } from 'react';
import { TimeScale } from './fractal-time-zoom-manager';
import { useFractalMorph } from '../hooks/use-fractal-morph';
import { DynamicNowIndicator } from './time/DynamicNowIndicator';

interface RadialFractalViewProps {
  scale: TimeScale;
  centerX: number;
  centerY: number;
  radius: number;
  theme: string;
  targetDate?: Date;
  transitionProgress: number;
  isTransitioning: boolean;
  className?: string;
}

export const RadialFractalView: React.FC<RadialFractalViewProps> = ({
  scale,
  centerX,
  centerY,
  radius,
  theme,
  targetDate = new Date(),
  transitionProgress,
  isTransitioning,
  className = ''
}) => {
  const { geometry, visualMetaphor, timeAnchor, transitionStyle } = useFractalMorph({
    scale,
    targetDate,
    transitionProgress,
    isTransitioning
  });

  // Theme-based colors
  const themeColors = useMemo(() => {
    const colors = {
      default: { 
        primary: 'hsl(45 80% 60%)', 
        secondary: 'hsl(45 60% 40%)',
        accent: 'hsl(45 90% 70%)',
        glow: 'hsl(45 100% 80%)'
      },
      tattoo: { 
        primary: 'hsl(0 80% 50%)', 
        secondary: 'hsl(0 60% 30%)',
        accent: 'hsl(0 90% 60%)',
        glow: 'hsl(0 100% 70%)'
      },
      floral: { 
        primary: 'hsl(300 60% 65%)', 
        secondary: 'hsl(300 40% 45%)',
        accent: 'hsl(320 70% 75%)',
        glow: 'hsl(320 80% 85%)'
      },
      techHUD: { 
        primary: 'hsl(180 80% 50%)', 
        secondary: 'hsl(180 60% 30%)',
        accent: 'hsl(180 90% 60%)',
        glow: 'hsl(180 100% 70%)'
      },
      vinyl: { 
        primary: 'hsl(45 70% 55%)', 
        secondary: 'hsl(45 50% 35%)',
        accent: 'hsl(45 80% 65%)',
        glow: 'hsl(45 90% 75%)'
      },
      noir: { 
        primary: 'hsl(240 30% 40%)', 
        secondary: 'hsl(240 20% 25%)',
        accent: 'hsl(240 50% 50%)',
        glow: 'hsl(240 60% 60%)'
      },
      pastelParadise: { 
        primary: 'hsl(280 50% 70%)', 
        secondary: 'hsl(280 30% 50%)',
        accent: 'hsl(300 60% 80%)',
        glow: 'hsl(300 70% 90%)'
      }
    };
    return colors[theme] || colors.default;
  }, [theme]);

  // Render different patterns based on scale
  const renderFractalPattern = () => {
    switch (visualMetaphor.pattern) {
      case 'circular-clock':
        return geometry.segments.map((segment, i) => (
          <g key={`segment-${i}`} style={transitionStyle}>
            {/* Hour segment */}
            <circle
              cx={segment.x}
              cy={segment.y}
              r={8 * segment.scale}
              fill={themeColors.primary}
              opacity={segment.opacity}
              stroke={themeColors.accent}
              strokeWidth="1"
            />
            {/* Hour marker */}
            <line
              x1={centerX + Math.cos(segment.rotation) * (radius - 20)}
              y1={centerY + Math.sin(segment.rotation) * (radius - 20)}
              x2={centerX + Math.cos(segment.rotation) * radius}
              y2={centerY + Math.sin(segment.rotation) * radius}
              stroke={themeColors.secondary}
              strokeWidth="2"
              opacity={segment.opacity}
            />
          </g>
        ));

      case 'flower-petals':
        return geometry.segments.map((segment, i) => (
          <g key={`petal-${i}`} style={transitionStyle}>
            {/* Petal shape */}
            <ellipse
              cx={segment.x}
              cy={segment.y}
              rx={30 * segment.scale}
              ry={15 * segment.scale}
              fill={themeColors.primary}
              opacity={segment.opacity * 0.7}
              stroke={themeColors.accent}
              strokeWidth="2"
              transform={`rotate(${(segment.rotation * 180) / Math.PI} ${segment.x} ${segment.y})`}
            />
            {/* Day label */}
            <text
              x={segment.x}
              y={segment.y + 4}
              textAnchor="middle"
              className="text-xs font-medium"
              fill={themeColors.glow}
              opacity={segment.opacity}
            >
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
            </text>
          </g>
        ));

      case 'spiral-flowers':
        return geometry.segments.map((segment, i) => (
          <g key={`flower-${i}`} style={transitionStyle}>
            {/* Week flower */}
            <circle
              cx={segment.x}
              cy={segment.y}
              r={25 * segment.scale}
              fill="none"
              stroke={themeColors.primary}
              strokeWidth="3"
              opacity={segment.opacity}
            />
            {/* Inner petals */}
            {Array.from({ length: 7 }, (_, j) => {
              const petalAngle = (j / 7) * 2 * Math.PI;
              const petalX = segment.x + Math.cos(petalAngle) * 15 * segment.scale;
              const petalY = segment.y + Math.sin(petalAngle) * 15 * segment.scale;
              return (
                <circle
                  key={j}
                  cx={petalX}
                  cy={petalY}
                  r={4 * segment.scale}
                  fill={themeColors.accent}
                  opacity={segment.opacity * 0.8}
                />
              );
            })}
          </g>
        ));

      case 'orbital-constellation':
        return geometry.segments.map((segment, i) => (
          <g key={`orbit-${i}`} style={transitionStyle}>
            {/* Month orbit */}
            <circle
              cx={segment.x}
              cy={segment.y}
              r={20 * segment.scale}
              fill={themeColors.primary}
              opacity={segment.opacity * 0.6}
              stroke={themeColors.glow}
              strokeWidth="2"
            />
            {/* Orbital trail */}
            <circle
              cx={centerX}
              cy={centerY}
              r={Math.sqrt((segment.x - centerX) ** 2 + (segment.y - centerY) ** 2)}
              fill="none"
              stroke={themeColors.secondary}
              strokeWidth="1"
              opacity={segment.opacity * 0.3}
              strokeDasharray="2,4"
            />
            {/* Month label */}
            <text
              x={segment.x}
              y={segment.y + 4}
              textAnchor="middle"
              className="text-xs font-medium"
              fill={themeColors.glow}
              opacity={segment.opacity}
            >
              {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
            </text>
          </g>
        ));

      default:
        return null;
    }
  };

  return (
    <g 
      className={`fractal-view ${className}`}
      style={{
        ...transitionStyle,
        transform: `scale(${geometry.containerScale}) rotate(${geometry.globalRotation}rad)`,
        transformOrigin: `${centerX}px ${centerY}px`
      }}
    >
      {/* Background pattern */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius + 20}
        fill="none"
        stroke={themeColors.secondary}
        strokeWidth="1"
        opacity="0.2"
        strokeDasharray="4,8"
      />

      {/* Fractal pattern */}
      {renderFractalPattern()}

      {/* Center anchor */}
      <circle
        cx={centerX}
        cy={centerY}
        r="6"
        fill={themeColors.glow}
        opacity="0.8"
        stroke={themeColors.primary}
        strokeWidth="2"
      />

      {/* NOW indicator removed - handled by main timeline */}

      {/* Scale label */}
      <text
        x={centerX}
        y={centerY + radius + 40}
        textAnchor="middle"
        className="text-sm font-light"
        fill={themeColors.primary}
        opacity="0.7"
      >
        {visualMetaphor.name} • {scale.toUpperCase()}
      </text>
    </g>
  );
};
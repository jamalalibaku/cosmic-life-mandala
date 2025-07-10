/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React from 'react';
import { useBreathingPulse } from '@/hooks/use-breathing-pulse';

interface DataLayerLabel {
  id: string;
  text: string;
  layer: 'weather' | 'mood' | 'mobility' | 'sleep' | 'plans';
  radius: number;
  isActive: boolean;
  theme: string;
}

interface DataLayerLabelsProps {
  centerX: number;
  centerY: number;
  labels: DataLayerLabel[];
  theme: string;
  showDebug?: boolean;
  className?: string;
}

export const DataLayerLabels: React.FC<DataLayerLabelsProps> = ({
  centerX,
  centerY,
  labels,
  theme,
  showDebug = false,
  className = ''
}) => {
  // Breathing pulse for gentle animation
  const { applyBreathingOpacity } = useBreathingPulse({
    enabled: true,
    cycleMs: 4000,
    intensity: 0.1,
    phaseOffset: 0,
    easingType: 'smooth'
  });

  // Theme-specific styling
  const getThemeStyles = (layerTheme: string) => {
    const styles = {
      default: {
        text: 'hsl(45 80% 85%)',
        accent: 'hsl(45 70% 70%)',
        font: 'font-light tracking-wide'
      },
      floral: {
        text: 'hsl(300 70% 85%)',
        accent: 'hsl(320 80% 75%)',
        font: 'font-light italic tracking-wide'
      },
      vinyl: {
        text: 'hsl(45 80% 80%)',
        accent: 'hsl(45 70% 65%)',
        font: 'font-medium tracking-wider'
      },
      noir: {
        text: 'hsl(240 50% 75%)',
        accent: 'hsl(240 40% 60%)',
        font: 'font-light tracking-wide'
      },
      techHUD: {
        text: 'hsl(180 80% 75%)',
        accent: 'hsl(180 70% 60%)',
        font: 'font-mono font-light tracking-widest'
      },
      pastelParadise: {
        text: 'hsl(280 60% 85%)',
        accent: 'hsl(300 70% 80%)',
        font: 'font-light tracking-wide'
      }
    };
    return styles[layerTheme] || styles.default;
  };

  const themeStyles = getThemeStyles(theme);

  // Position labels vertically along the right side (East direction)
  const labelPositions = labels.map((label, index) => {
    const baseAngle = 0; // East direction (right side)
    const verticalSpread = 60; // Degrees of vertical spread
    const angleOffset = (index - (labels.length - 1) / 2) * (verticalSpread / Math.max(1, labels.length - 1));
    const angle = baseAngle + angleOffset;
    const radians = (angle * Math.PI) / 180;
    
    // Position slightly outside the main ring area
    const labelRadius = label.radius + 50;
    const x = centerX + Math.cos(radians) * labelRadius;
    const y = centerY + Math.sin(radians) * labelRadius;
    
    return { ...label, x, y, angle };
  });

  return (
    <g className={`data-layer-labels ${className}`}>
      <defs>
        <filter id="label-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {labelPositions.map((label, index) => {
        const opacity = label.isActive ? applyBreathingOpacity(0.9) : 0.5;
        
        return (
          <g key={label.id} className="data-layer-label">
            {/* Debug mode: Show label boundaries */}
            {showDebug && (
              <g className="debug-label-info">
                <circle
                  cx={label.x}
                  cy={label.y}
                  r="25"
                  fill="none"
                  stroke="red"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.3"
                />
                <text
                  x={label.x}
                  y={label.y - 35}
                  textAnchor="middle"
                  className="text-xs font-mono"
                  fill="red"
                  opacity="0.7"
                >
                  {label.layer} • r{label.radius}
                </text>
              </g>
            )}
            
            {/* Connection line to ring */}
            <line
              x1={centerX + Math.cos((label.angle * Math.PI) / 180) * label.radius}
              y1={centerY + Math.sin((label.angle * Math.PI) / 180) * label.radius}
              x2={label.x - 20}
              y2={label.y}
              stroke={themeStyles.accent}
              strokeWidth="1"
              opacity={opacity * 0.4}
              strokeDasharray="2,4"
            />
            
            {/* Label background */}
            <rect
              x={label.x - 18}
              y={label.y - 12}
              width="36"
              height="20"
              rx="10"
              fill="rgba(0, 0, 0, 0.3)"
              stroke={themeStyles.accent}
              strokeWidth="1"
              opacity={opacity * 0.8}
            />
            
            {/* Label text */}
            <text
              x={label.x}
              y={label.y + 2}
              textAnchor="middle"
              className={`text-xs ${themeStyles.font}`}
              fill={themeStyles.text}
              opacity={opacity}
              filter="url(#label-glow)"
            >
              {label.text}
            </text>
            
            {/* Active indicator dot */}
            {label.isActive && (
              <circle
                cx={label.x + 22}
                cy={label.y - 8}
                r="2"
                fill={themeStyles.accent}
                opacity={applyBreathingOpacity(0.8)}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};
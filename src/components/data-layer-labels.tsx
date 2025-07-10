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

  // Position labels horizontally stacked on the right side (like the reference image)
  const labelPositions = labels.map((label, index) => {
    // Fixed horizontal position on the right side
    const x = centerX + 250; // Fixed distance from center
    const y = centerY - 40 + (index * 35); // Vertical stack with proper spacing
    
    return { ...label, x, y, angle: 0 };
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
            
            {/* Clean pill-shaped label background (like reference) */}
            <rect
              x={label.x - 35}
              y={label.y - 10}
              width="70"
              height="20"
              rx="10"
              fill="rgba(0, 0, 0, 0.4)"
              stroke={themeStyles.accent}
              strokeWidth="1"
              opacity={opacity * 0.9}
            />
            
            {/* Clean label text (centered, readable) */}
            <text
              x={label.x}
              y={label.y + 3}
              textAnchor="middle"
              className={`text-sm ${themeStyles.font}`}
              fill={themeStyles.text}
              opacity={opacity}
            >
              {label.text}
            </text>
            
            {/* Simple active indicator (clean dot) */}
            {label.isActive && (
              <circle
                cx={label.x + 40}
                cy={label.y}
                r="3"
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
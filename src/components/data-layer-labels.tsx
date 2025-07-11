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
  layer: 'weather' | 'mood' | 'mobility' | 'sleep' | 'plans' | 'wallet';
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
  onLabelClick?: (layerType: string, position: { x: number; y: number }, layerData: any) => void;
  layerDataMap?: Record<string, any[]>;
}

export const DataLayerLabels: React.FC<DataLayerLabelsProps> = ({
  centerX,
  centerY,
  labels,
  theme,
  showDebug = false,
  className = '',
  onLabelClick,
  layerDataMap = {}
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

  // Position labels horizontally stacked on the right side with enhanced spacing
  const labelPositions = labels.map((label, index) => {
    // Enhanced horizontal position to reduce collision with floating elements
    const x = centerX + 280; // Slightly further east
    const y = centerY - 50 + (index * 42); // Increased vertical spacing (1.2x)
    
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
            
            {/* Clickable group for interaction */}
            <g
              className="cursor-pointer transition-all duration-200 hover:scale-105"
              onClick={(e) => {
                if (onLabelClick) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const position = {
                    x: rect.left + window.scrollX,
                    y: rect.top + window.scrollY
                  };
                  const layerData = layerDataMap[label.layer] || [];
                  onLabelClick(label.layer, position, layerData);
                }
              }}
            >
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
                className="transition-all duration-200 hover:fill-white/10 hover:stroke-white/40"
              />
              
              {/* Enhanced label text with improved font weight */}
              <text
                x={label.x}
                y={label.y + 3}
                textAnchor="middle"
                className={`text-sm font-normal ${themeStyles.font} transition-colors duration-200`}
                fill={themeStyles.text}
                opacity={opacity}
                style={{ fontWeight: 400, pointerEvents: 'none' }}
              >
                {label.text}
              </text>
            </g>
            
            {/* Simple active indicator (clean dot) */}
            {label.isActive && (
              <circle
                cx={label.x + 40}
                cy={label.y}
                r="3"
                fill={themeStyles.accent}
                opacity={applyBreathingOpacity(0.8)}
                style={{ pointerEvents: 'none' }}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};
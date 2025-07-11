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
            
            {/* Enhanced clickable group for single-click interaction */}
            <g
              className="cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
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
              {/* Enhanced label background with glow effect */}
              <rect
                x={label.x - 38}
                y={label.y - 12}
                width="76"
                height="24"
                rx="12"
                fill="rgba(0, 0, 0, 0.7)"
                stroke={label.isActive ? themeStyles.accent : 'rgba(255,255,255,0.2)'}
                strokeWidth={label.isActive ? "2" : "1"}
                opacity={opacity}
                className={`transition-all duration-300 ${
                  label.isActive 
                    ? 'shadow-lg' 
                    : 'hover:fill-white/20 hover:stroke-white/40'
                }`}
                style={{
                  filter: label.isActive ? `drop-shadow(0 0 8px ${themeStyles.accent})` : 'none'
                }}
              />
              
              {/* Enhanced label text with better typography */}
              <text
                x={label.x}
                y={label.y + 4}
                textAnchor="middle"
                className={`text-sm font-medium ${themeStyles.font} transition-all duration-300`}
                fill={label.isActive ? 'white' : themeStyles.text}
                opacity={label.isActive ? 1 : opacity}
                style={{ 
                  fontWeight: label.isActive ? 600 : 400, 
                  pointerEvents: 'none',
                  textShadow: label.isActive ? '0 0 6px rgba(255,255,255,0.3)' : 'none'
                }}
              >
                {label.text}
              </text>

              {/* Interactive hover ring */}
              <circle
                cx={label.x}
                cy={label.y}
                r="42"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                strokeDasharray="3,6"
                opacity="0"
                className="transition-opacity duration-300 hover:opacity-30"
                style={{ pointerEvents: 'none' }}
              />
            </g>
            
            {/* Enhanced active indicator with breathing animation */}
            {label.isActive && (
              <g>
                <circle
                  cx={label.x + 45}
                  cy={label.y}
                  r="4"
                  fill={themeStyles.accent}
                  opacity={applyBreathingOpacity(0.9)}
                  style={{ pointerEvents: 'none' }}
                  className="animate-pulse"
                />
                <circle
                  cx={label.x + 45}
                  cy={label.y}
                  r="6"
                  fill="none"
                  stroke={themeStyles.accent}
                  strokeWidth="1"
                  opacity={applyBreathingOpacity(0.4)}
                  style={{ pointerEvents: 'none' }}
                />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
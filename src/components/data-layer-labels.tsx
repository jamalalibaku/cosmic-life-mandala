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

  // Position labels vertically on the right side with golden ratio spacing
  const goldenRatio = 1.618;
  const baseSpacing = 40;
  const totalLabels = labels.length;
  const totalHeight = (totalLabels - 1) * baseSpacing * goldenRatio;
  
  const labelPositions = labels.map((label, index) => {
    // Position on right side, vertically centered with golden ratio spacing
    const x = centerX + 320; // Right side positioning
    const startY = centerY - (totalHeight / 2);
    const y = startY + (index * baseSpacing * goldenRatio);
    
    return { ...label, x, y, angle: 0 };
  });

  return (
    <g className={`data-layer-labels ${className}`}>
      <defs>
        {/* Enhanced glow filter */}
        <filter id="label-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Hover glow filter */}
        <filter id="hover-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
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
            
            {/* Enhanced clickable group with smooth hover interactions */}
            <g
              className="cursor-pointer transition-all duration-300 group"
              style={{ transformOrigin: `${label.x}px ${label.y}px` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
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
              {/* Enhanced label background with improved glow effect */}
              <rect
                x={label.x - 45}
                y={label.y - 14}
                width="90"
                height="28"
                rx="14"
                fill="rgba(0, 0, 0, 0.8)"
                stroke={label.isActive ? themeStyles.accent : 'rgba(255,255,255,0.3)'}
                strokeWidth={label.isActive ? "2" : "1"}
                opacity={opacity}
                className={`transition-all duration-300 group-hover:stroke-white/60 ${
                  label.isActive 
                    ? 'drop-shadow-lg' 
                    : 'group-hover:fill-white/10'
                }`}
                style={{
                  filter: label.isActive 
                    ? `url(#label-glow) drop-shadow(0 0 12px ${themeStyles.accent}40)` 
                    : 'none'
                }}
              />
              
              {/* Enhanced label text with better typography and hover effects */}
              <text
                x={label.x}
                y={label.y + 5}
                textAnchor="middle"
                className={`text-sm font-medium ${themeStyles.font} transition-all duration-300 group-hover:fill-white`}
                fill={label.isActive ? 'white' : themeStyles.text}
                opacity={label.isActive ? 1 : opacity}
                style={{ 
                  fontWeight: label.isActive ? 600 : 400, 
                  pointerEvents: 'none',
                  textShadow: label.isActive 
                    ? `0 0 8px ${themeStyles.accent}60` 
                    : 'none',
                  filter: label.isActive ? 'url(#label-glow)' : 'none'
                }}
              >
                {label.text}
              </text>

              {/* Enhanced interactive hover ring with smooth animation */}
              <circle
                cx={label.x}
                cy={label.y}
                r="48"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
                strokeDasharray="4,8"
                opacity="0"
                className="transition-all duration-300 group-hover:opacity-40 group-hover:stroke-white/50"
                style={{ 
                  pointerEvents: 'none',
                  filter: 'url(#hover-glow)'
                }}
              />
            </g>
            
            {/* Enhanced active indicator with proper glow effect */}
            {label.isActive && (
              <g>
                {/* Main indicator dot */}
                <circle
                  cx={label.x + 52}
                  cy={label.y}
                  r="5"
                  fill={themeStyles.accent}
                  opacity={applyBreathingOpacity(1)}
                  style={{ 
                    pointerEvents: 'none',
                    filter: `url(#label-glow) drop-shadow(0 0 8px ${themeStyles.accent})`
                  }}
                  className="animate-pulse"
                />
                {/* Outer ring */}
                <circle
                  cx={label.x + 52}
                  cy={label.y}
                  r="8"
                  fill="none"
                  stroke={themeStyles.accent}
                  strokeWidth="1.5"
                  opacity={applyBreathingOpacity(0.6)}
                  style={{ 
                    pointerEvents: 'none',
                    filter: `drop-shadow(0 0 4px ${themeStyles.accent}40)`
                  }}
                />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
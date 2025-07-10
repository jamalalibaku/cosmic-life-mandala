/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Insight } from '@/utils/insight-engine';
import { useBreathingPulse } from '@/hooks/use-breathing-pulse';

interface InsightOrbitRingProps {
  insights: Insight[];
  centerX: number;
  centerY: number;
  baseRadius: number;
  isVisible: boolean;
  currentTimeScale: string;
  theme: string;
  onInsightClick?: (insight: Insight) => void;
  showDebug?: boolean;
  className?: string;
}

export const InsightOrbitRing: React.FC<InsightOrbitRingProps> = ({
  insights,
  centerX,
  centerY,
  baseRadius,
  isVisible,
  currentTimeScale,
  theme,
  onInsightClick,
  showDebug = false,
  className = ''
}) => {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [hoveredInsight, setHoveredInsight] = useState<string | null>(null);

  // Breathing pulse for floating effect
  const { applyBreathingRadius, applyBreathingOpacity } = useBreathingPulse({
    enabled: true,
    cycleMs: 6000,
    intensity: 0.1,
    phaseOffset: 0,
    easingType: 'smooth'
  });

  // Filter insights for current time scale with validation
  const filteredInsights = useMemo(() => {
    return insights.filter(insight => {
      // Validate required properties
      if (!insight.text || !insight.position || !insight.id) {
        console.warn('Invalid insight filtered out:', insight);
        return false;
      }
      
      // Validate position values
      if (isNaN(insight.position.angle) || isNaN(insight.position.radius)) {
        console.warn('Invalid position values filtered out:', insight);
        return false;
      }
      
      // Filter by time scale
      return insight.timeScale === currentTimeScale;
    });
  }, [insights, currentTimeScale]);

  // Sync with playback for enhanced narration
  const isPlaybackActive = hoveredInsight !== null;

  // Rotate through insights every 45 seconds
  useEffect(() => {
    if (filteredInsights.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentInsightIndex(prev => (prev + 1) % filteredInsights.length);
    }, 45000);

    return () => clearInterval(timer);
  }, [filteredInsights.length]);

  // Theme-specific colors
  const themeColors = useMemo(() => {
    const colors = {
      default: { 
        primary: 'hsl(45 80% 70%)', 
        glow: 'hsl(45 100% 80%)',
        text: 'hsl(45 90% 85%)'
      },
      tattoo: { 
        primary: 'hsl(0 70% 60%)', 
        glow: 'hsl(0 90% 70%)',
        text: 'hsl(0 80% 75%)'
      },
      floral: { 
        primary: 'hsl(300 60% 70%)', 
        glow: 'hsl(320 80% 80%)',
        text: 'hsl(300 70% 85%)'
      },
      techHUD: { 
        primary: 'hsl(180 70% 60%)', 
        glow: 'hsl(180 90% 70%)',
        text: 'hsl(180 80% 75%)'
      },
      vinyl: { 
        primary: 'hsl(45 60% 65%)', 
        glow: 'hsl(45 80% 75%)',
        text: 'hsl(45 70% 80%)'
      },
      noir: { 
        primary: 'hsl(240 30% 50%)', 
        glow: 'hsl(240 50% 60%)',
        text: 'hsl(240 40% 70%)'
      },
      pastelParadise: { 
        primary: 'hsl(280 50% 75%)', 
        glow: 'hsl(300 70% 85%)',
        text: 'hsl(280 60% 85%)'
      }
    };
    return colors[theme] || colors.default;
  }, [theme]);

  // Emotion-based styling
  const getEmotionStyle = (emotion: Insight['emotion']) => {
    switch (emotion) {
      case 'uplifting':
        return { opacity: 0.9, scale: 1.1, glow: 1.5 };
      case 'playful':
        return { opacity: 0.8, scale: 1.05, glow: 1.2 };
      case 'contemplative':
        return { opacity: 0.7, scale: 0.95, glow: 0.8 };
      case 'somber':
        return { opacity: 0.6, scale: 0.9, glow: 0.6 };
      default:
        return { opacity: 0.75, scale: 1, glow: 1 };
    }
  };

  if (!isVisible || filteredInsights.length === 0) {
    return null;
  }

  return (
    <g className={`insight-orbit-ring ${className}`}>
      <defs>
        <radialGradient
          id={`insight-glow-${theme}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={themeColors.glow} stopOpacity="0.8" />
          <stop offset="70%" stopColor={themeColors.primary} stopOpacity="0.4" />
          <stop offset="100%" stopColor={themeColors.primary} stopOpacity="0.1" />
        </radialGradient>
        
        <filter id="insight-soft-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {filteredInsights.map((insight, index) => {
        const isActive = index === currentInsightIndex;
        const isHovered = hoveredInsight === insight.id;
        const emotionStyle = getEmotionStyle(insight.emotion);
        
        // Calculate position
        const angle = insight.position?.angle || (index * 60);
        const radius = applyBreathingRadius(
          insight.position?.radius || baseRadius + index * 25
        );
        
        const radians = (angle * Math.PI) / 180;
        const x = centerX + Math.cos(radians) * radius;
        const y = centerY + Math.sin(radians) * radius;
        
        // Visibility logic
        const baseOpacity = isActive ? 0.9 : 0.3;
        const finalOpacity = applyBreathingOpacity(
          baseOpacity * emotionStyle.opacity * (isHovered ? 1.2 : 1)
        );
        
        // Only show some inactive insights to avoid clutter (and prevent orphaned circles)
        if (!isActive && !isHovered && filteredInsights.length > 3 && Math.random() > 0.4) {
          return null;
        }

        return (
          <g
            key={insight.id}
            className="insight-glyph cursor-pointer"
            onMouseEnter={() => setHoveredInsight(insight.id)}
            onMouseLeave={() => setHoveredInsight(null)}
            onClick={() => {
              console.log('AI Insight clicked:', insight);
              onInsightClick?.(insight);
            }}
            opacity={finalOpacity}
          >
            {/* Debug mode: Show insight boundaries and info */}
            {showDebug && (
              <g className="debug-info">
                <circle
                  cx={x}
                  cy={y}
                  r={20}
                  fill="none"
                  stroke="red"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.5"
                />
                <text
                  x={x}
                  y={y - 30}
                  textAnchor="middle"
                  className="text-xs font-mono"
                  fill="red"
                >
                  {insight.id} • {insight.type}
                </text>
              </g>
            )}
            
            {/* Glow ring */}
            <circle
              cx={x}
              cy={y}
              r={15 * emotionStyle.scale}
              fill={`url(#insight-glow-${theme})`}
              opacity={emotionStyle.glow * 0.6}
              filter="url(#insight-soft-glow)"
            />
            
            {/* Main insight indicator */}
            <circle
              cx={x}
              cy={y}
              r={6 * emotionStyle.scale}
              fill={themeColors.primary}
              stroke={themeColors.glow}
              strokeWidth="1"
              opacity={0.8}
            />
            
            {/* Insight text (on hover or if active) */}
            {(isActive || isHovered) && (
              <g className="insight-text">
                {/* Text background */}
                <rect
                  x={x - 80}
                  y={y - 35}
                  width="160"
                  height="30"
                  rx="15"
                  fill="rgba(0, 0, 0, 0.7)"
                  stroke={themeColors.primary}
                  strokeWidth="1"
                  opacity="0.9"
                />
                
                {/* Enhanced insight text with tone styling */}
                <text
                  x={x}
                  y={y - 15}
                  textAnchor="middle"
                  className={`text-xs ${
                    insight.tone === 'poetic' ? 'font-light italic' :
                    insight.tone === 'playful' ? 'font-medium' :
                    'font-light'
                  }`}
                  fill={themeColors.text}
                  opacity="0.9"
                >
                  {insight.summary || (insight.text.length > 35 
                    ? `${insight.text.substring(0, 35)}...` 
                    : insight.text)}
                </text>
                
                {/* Correlation strength indicator */}
                {insight.correlationStrength && (
                  <circle
                    cx={x + 70}
                    cy={y - 15}
                    r={3}
                    fill={themeColors.glow}
                    opacity={insight.correlationStrength}
                  />
                )}
                
                {/* Time context and emotion indicator */}
                <text
                  x={x}
                  y={y + 25}
                  textAnchor="middle"
                  className="text-xs font-medium"
                  fill={themeColors.glow}
                  opacity="0.6"
                >
                  {insight.timeContext} • {insight.emotion}
                </text>
              </g>
            )}
            
            {/* Type indicator glyph */}
            <text
              x={x}
              y={y + 3}
              textAnchor="middle"
              className="text-xs font-bold"
              fill="white"
              opacity="0.8"
            >
              {insight.type === 'mood' ? '◐' : 
               insight.type === 'pattern' ? '◊' : 
               insight.type === 'correlation' ? '⧓' : '◯'}
            </text>
          </g>
        );
      })}
      
      {/* Orbit path indicator */}
      <circle
        cx={centerX}
        cy={centerY}
        r={baseRadius}
        fill="none"
        stroke={themeColors.primary}
        strokeWidth="1"
        opacity="0.1"
        strokeDasharray="2,8"
      />
    </g>
  );
};
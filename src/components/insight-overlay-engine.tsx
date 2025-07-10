/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Eye, Brain } from 'lucide-react';
import { goldenRatio, PHI } from '../utils/golden-ratio';

export interface Insight {
  id: string;
  text: string;
  sourceLayer: 'weather' | 'sleep' | 'mood' | 'plans' | 'mobility' | 'social';
  viewContext: 'day' | 'week' | 'month' | 'year';
  confidence: number; // 0-1
  position: { angle: number; radius: number };
  triggerCondition: 'hover' | 'click' | 'viewSwitch' | 'always';
}

interface InsightOverlayEngineProps {
  insights: Insight[];
  currentView: 'day' | 'week' | 'month' | 'year';
  centerX: number;
  centerY: number;
  maxRadius: number;
  activeLayer?: string;
  hoveredElement?: string;
  isVisible: boolean;
  onInsightClick?: (insight: Insight) => void;
  className?: string;
}

const insightColors = {
  weather: 'hsl(45 80% 60%)',
  sleep: 'hsl(240 70% 60%)',
  mood: 'hsl(280 80% 60%)',
  plans: 'hsl(120 70% 60%)',
  mobility: 'hsl(160 80% 60%)',
  social: 'hsl(320 70% 60%)'
};

const confidenceThreshold = 0.6; // Only show insights with 60%+ confidence

export const InsightOverlayEngine: React.FC<InsightOverlayEngineProps> = ({
  insights,
  currentView,
  centerX,
  centerY,
  maxRadius,
  activeLayer,
  hoveredElement,
  isVisible,
  onInsightClick,
  className = ''
}) => {
  const [time, setTime] = useState(0);
  const [visibleInsights, setVisibleInsights] = useState<string[]>([]);

  // Gentle floating animation
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      setTime((Date.now() - startTime) / 1000);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Filter insights based on current context
  const contextualInsights = useMemo(() => {
    return insights.filter(insight => {
      // Basic filters
      if (insight.confidence < confidenceThreshold) return false;
      if (insight.viewContext !== currentView && insight.viewContext !== 'day') return false;
      
      // Trigger condition filters
      switch (insight.triggerCondition) {
        case 'hover':
          return hoveredElement === insight.sourceLayer;
        case 'click':
          return activeLayer === insight.sourceLayer;
        case 'viewSwitch':
          return isVisible;
        case 'always':
          return isVisible;
        default:
          return false;
      }
    });
  }, [insights, currentView, activeLayer, hoveredElement, isVisible]);

  // Stagger insight appearances
  useEffect(() => {
    if (!isVisible) {
      setVisibleInsights([]);
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];
    
    contextualInsights.forEach((insight, index) => {
      const delay = index * 800; // Slower, more contemplative stagger
      const timeout = setTimeout(() => {
        setVisibleInsights(prev => [...prev, insight.id]);
      }, delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [contextualInsights, isVisible]);

  if (!isVisible || contextualInsights.length === 0) return null;

  return (
    <g className={`insight-overlay-engine ${className}`}>
      <defs>
        {/* Insight glow filter */}
        <filter id="insight-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Gradient for insight bubbles */}
        <radialGradient id="insight-bubble-gradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
          <stop offset="50%" stopColor="rgba(0, 0, 0, 0.8)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.95)" />
        </radialGradient>
      </defs>

      {contextualInsights.map((insight, index) => {
        const isVisible = visibleInsights.includes(insight.id);
        if (!isVisible) return null;

        // Calculate floating position with gentle movement
        const floatX = Math.sin(time * 0.3 + index) * 5;
        const floatY = Math.cos(time * 0.4 + index) * 3;
        
        // Position based on golden ratio
        const adjustedRadius = insight.position.radius * goldenRatio.smaller(1);
        const angle = goldenRatio.toRadians(insight.position.angle + time * 2);
        const x = centerX + Math.cos(angle) * adjustedRadius + floatX;
        const y = centerY + Math.sin(angle) * adjustedRadius + floatY;
        
        const sourceColor = insightColors[insight.sourceLayer];
        
        // Calculate text width for bubble sizing
        const textLength = insight.text.length;
        const bubbleWidth = Math.min(textLength * 8 + 40, 200);
        const bubbleHeight = textLength > 30 ? 60 : 40;

        return (
          <g key={insight.id} className="floating-insight">
            {/* Connection line to source layer */}
            <line
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke={sourceColor}
              strokeWidth="1"
              strokeDasharray="3 6"
              opacity="0.3"
              filter="url(#insight-glow)"
            />

            {/* Insight bubble */}
            <g
              onClick={() => onInsightClick?.(insight)}
              className="cursor-pointer transition-transform duration-300 hover:scale-105"
              style={{
                animation: `fadeInFloat 1s ease-out ${index * 0.3}s both`,
                transformOrigin: `${x}px ${y}px`
              }}
            >
              {/* Bubble background */}
              <ellipse
                cx={x}
                cy={y}
                rx={bubbleWidth / 2}
                ry={bubbleHeight / 2}
                fill="url(#insight-bubble-gradient)"
                stroke={sourceColor}
                strokeWidth="1.5"
                filter="url(#insight-glow)"
                opacity="0.95"
              />

              {/* Confidence indicator ring */}
              <ellipse
                cx={x}
                cy={y}
                rx={(bubbleWidth / 2) + 4}
                ry={(bubbleHeight / 2) + 4}
                fill="none"
                stroke={sourceColor}
                strokeWidth={insight.confidence * 3}
                opacity={insight.confidence * 0.6}
              />

              {/* Source layer icon */}
              <g transform={`translate(${x - bubbleWidth/2 + 15}, ${y - bubbleHeight/2 + 12})`}>
                {insight.sourceLayer === 'mood' && <Brain size={12} className="fill-current" style={{ color: sourceColor }} />}
                {insight.sourceLayer === 'sleep' && <Eye size={12} className="fill-current" style={{ color: sourceColor }} />}
                {(insight.sourceLayer === 'weather' || insight.sourceLayer === 'plans') && <Sparkles size={12} className="fill-current" style={{ color: sourceColor }} />}
              </g>

              {/* Insight text */}
              <foreignObject
                x={x - bubbleWidth/2 + 8}
                y={y - bubbleHeight/2 + 5}
                width={bubbleWidth - 16}
                height={bubbleHeight - 10}
              >
                <div className="text-xs text-yellow-100 font-light leading-tight p-2">
                  {insight.text}
                </div>
              </foreignObject>

              {/* View context indicator */}
              <text
                x={x + bubbleWidth/2 - 15}
                y={y - bubbleHeight/2 + 10}
                className="text-xs font-light opacity-60"
                fill={sourceColor}
              >
                {insight.viewContext.slice(0, 1).toUpperCase()}
              </text>
            </g>
          </g>
        );
      })}

      <style>
        {`
        @keyframes fadeInFloat {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(20px);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        `}
      </style>
    </g>
  );
};
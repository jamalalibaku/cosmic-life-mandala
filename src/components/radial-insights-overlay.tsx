/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface Insight {
  id: string;
  text: string;
  category: 'sleep' | 'mood' | 'movement' | 'weather' | 'social';
  position: { angle: number; radius: number };
}

interface RadialInsightsOverlayProps {
  insights: Insight[];
  centerX: number;
  centerY: number;
  maxRadius: number;
  visible: boolean;
  onClose?: () => void;
}

const mockInsights: Insight[] = [
  {
    id: '1',
    text: 'You sleep more deeply on colder nights',
    category: 'sleep',
    position: { angle: 45, radius: 200 }
  },
  {
    id: '2', 
    text: 'Tuesdays are your most active days',
    category: 'movement',
    position: { angle: 135, radius: 180 }
  },
  {
    id: '3',
    text: 'Rainy days lift your creative mood',
    category: 'mood',
    position: { angle: 225, radius: 220 }
  },
  {
    id: '4',
    text: 'Morning walks boost afternoon energy',
    category: 'movement',
    position: { angle: 315, radius: 190 }
  }
];

const categoryColors = {
  sleep: 'hsl(240 100% 70%)',
  mood: 'hsl(280 100% 70%)',
  movement: 'hsl(120 100% 70%)',
  weather: 'hsl(45 100% 70%)',
  social: 'hsl(320 100% 70%)'
};

export const RadialInsightsOverlay: React.FC<RadialInsightsOverlayProps> = ({
  insights = mockInsights,
  centerX,
  centerY,
  maxRadius,
  visible,
  onClose
}) => {
  const [animatedInsights, setAnimatedInsights] = useState<number[]>([]);

  useEffect(() => {
    if (visible) {
      setAnimatedInsights([]);
      // Stagger animation of insights
      const timeouts: NodeJS.Timeout[] = [];
      insights.forEach((_, index) => {
        const timeout = setTimeout(() => {
          setAnimatedInsights(prev => [...prev, index]);
        }, index * 300);
        timeouts.push(timeout);
      });
      
      return () => {
        timeouts.forEach(clearTimeout);
      };
    } else {
      setAnimatedInsights([]);
    }
  }, [visible, insights.length]); // Only depend on length, not full array

  if (!visible) return null;

  return (
    <g className="radial-insights-overlay">
      {/* Background overlay */}
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius}
        fill="rgba(0, 0, 0, 0.6)"
        onClick={onClose}
        className="cursor-pointer"
      />

      {/* Close hint */}
      <text
        x={centerX}
        y={centerY - maxRadius + 30}
        textAnchor="middle"
        className="fill-yellow-200/60 text-xs"
      >
        click anywhere to close
      </text>

      {/* Insights */}
      {insights.map((insight, index) => {
        const isAnimated = animatedInsights.includes(index);
        const angle = (insight.position.angle * Math.PI) / 180;
        const x = centerX + insight.position.radius * Math.cos(angle);
        const y = centerY + insight.position.radius * Math.sin(angle);
        const categoryColor = categoryColors[insight.category];

        if (!isAnimated) return null;

        return (
          <g key={insight.id} className="insight-item">
            {/* Connection line to center */}
            <line
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke={categoryColor}
              strokeWidth="1"
              strokeDasharray="2 4"
              opacity="0.4"
            />

            {/* Insight bubble */}
            <g
              style={{
                transform: `translate(${x}px, ${y}px)`,
                animation: `fadeInScale 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Background */}
              <rect
                x="-60"
                y="-25"
                width="120"
                height="50"
                rx="8"
                fill="rgba(0, 0, 0, 0.9)"
                stroke={categoryColor}
                strokeWidth="1.5"
              />

              {/* Sparkle icon */}
              <Sparkles
                x="-55"
                y="-20"
                size={12}
                className="fill-yellow-200"
              />

              {/* Insight text */}
              <text
                x="0"
                y="-10"
                textAnchor="middle"
                className="fill-yellow-200 text-xs font-medium"
              >
                {insight.text.slice(0, 25)}
              </text>
              {insight.text.length > 25 && (
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  className="fill-yellow-200 text-xs font-medium"
                >
                  {insight.text.slice(25)}
                </text>
              )}

              {/* Category tag */}
              <text
                x="0"
                y="18"
                textAnchor="middle"
                className="fill-yellow-100/60 text-xs"
              >
                {insight.category}
              </text>
            </g>
          </g>
        );
      })}

      {/* Center title */}
      <g style={{ transform: `translate(${centerX}px, ${centerY}px)` }}>
        <circle
          cx="0"
          cy="0"
          r="40"
          fill="rgba(0, 0, 0, 0.8)"
          stroke="hsl(45 100% 70%)"
          strokeWidth="2"
        />
        <text
          x="0"
          y="-5"
          textAnchor="middle"
          className="fill-yellow-200 text-sm font-medium"
        >
          Insights
        </text>
        <text
          x="0"
          y="10"
          textAnchor="middle"
          className="fill-yellow-100 text-xs"
        >
          from your patterns
        </text>
      </g>

      <style>
        {`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        `}
      </style>
    </g>
  );
};
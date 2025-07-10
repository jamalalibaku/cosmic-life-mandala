/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect, useMemo } from 'react';
import { goldenRatio } from '../utils/golden-ratio';
import { calculateLayerInteraction, generateEmotionalFlow } from '../utils/mood-engine';

interface TideConnection {
  sourceLayer: string;
  targetLayer: string;
  sourceAngle: number;
  targetAngle: number;
  sourceRadius: number;
  targetRadius: number;
  strength: number;
}

interface EmotionalTideRingsProps {
  centerX: number;
  centerY: number;
  connections: TideConnection[];
  isActive: boolean;
  playbackTime?: number; // 0-1 for animation
  className?: string;
}

export const EmotionalTideRings: React.FC<EmotionalTideRingsProps> = ({
  centerX,
  centerY,
  connections,
  isActive,
  playbackTime = 0,
  className = ''
}) => {
  const [time, setTime] = useState(0);

  // Gentle flow animation
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      setTime((Date.now() - startTime) / 1000);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const tideFlows = useMemo(() => {
    return connections.map((connection, index) => {
      const {
        sourceLayer,
        targetLayer,
        sourceAngle,
        targetAngle,
        sourceRadius,
        targetRadius,
        strength
      } = connection;

      // Calculate positions
      const sourceRad = goldenRatio.toRadians(sourceAngle);
      const targetRad = goldenRatio.toRadians(targetAngle);
      
      const sourceX = centerX + Math.cos(sourceRad) * sourceRadius;
      const sourceY = centerY + Math.sin(sourceRad) * sourceRadius;
      const targetX = centerX + Math.cos(targetRad) * targetRadius;
      const targetY = centerY + Math.sin(targetRad) * targetRadius;

      // Create flowing curve with animation
      const animationOffset = time * 0.3 + index * 0.5;
      const flowProgress = (Math.sin(animationOffset) + 1) / 2; // 0-1 oscillation
      
      // Control points for smooth bezier curve
      const midX = (sourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2;
      
      // Perpendicular offset for curve
      const dx = targetX - sourceX;
      const dy = targetY - sourceY;
      const perpX = -dy * 0.3 * strength;
      const perpY = dx * 0.3 * strength;
      
      const control1X = sourceX + dx * 0.3 + perpX * Math.sin(time * 0.4);
      const control1Y = sourceY + dy * 0.3 + perpY * Math.sin(time * 0.4);
      const control2X = targetX - dx * 0.3 + perpX * Math.cos(time * 0.3);
      const control2Y = targetY - dy * 0.3 + perpY * Math.cos(time * 0.3);

      // Animated path for flowing particles
      const flowPathData = `M ${sourceX} ${sourceY} 
                           C ${control1X} ${control1Y} 
                             ${control2X} ${control2Y} 
                             ${targetX} ${targetY}`;

      // Color based on layer types
      const layerColors = {
        sleep: 'hsl(240 70% 60%)',
        mood: 'hsl(280 80% 60%)', 
        mobility: 'hsl(120 70% 60%)',
        weather: 'hsl(45 80% 60%)',
        plans: 'hsl(160 70% 60%)'
      };

      const sourceColor = layerColors[sourceLayer] || 'hsl(200 50% 50%)';
      const targetColor = layerColors[targetLayer] || 'hsl(300 50% 50%)';

      return {
        id: `tide-${index}`,
        sourceX,
        sourceY,
        targetX,
        targetY,
        control1X,
        control1Y,
        control2X,
        control2Y,
        flowPathData,
        sourceColor,
        targetColor,
        strength,
        flowProgress,
        sourceLayer,
        targetLayer
      };
    });
  }, [connections, centerX, centerY, time]);

  if (!isActive || connections.length === 0) return null;

  return (
    <g className={`emotional-tide-rings ${className}`}>
      <defs>
        {/* Gradient definitions for each tide flow */}
        {tideFlows.map((flow) => (
          <linearGradient
            key={`gradient-${flow.id}`}
            id={`tide-gradient-${flow.id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={flow.sourceColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(260 60% 65%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor={flow.targetColor} stopOpacity="0.8" />
          </linearGradient>
        ))}

        {/* Flow animation filter */}
        <filter id="tide-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {tideFlows.map((flow) => (
        <g key={flow.id} className="tide-flow">
          {/* Main connection curve */}
          <path
            d={flow.flowPathData}
            fill="none"
            stroke={`url(#tide-gradient-${flow.id})`}
            strokeWidth={flow.strength * 3 + 0.5}
            opacity={0.4 + flow.strength * 0.4}
            strokeDasharray="4 8"
            filter="url(#tide-glow)"
            style={{
              strokeDashoffset: -time * 20,
              animation: 'tidePulse 3s ease-in-out infinite'
            }}
          />

          {/* Flowing particle */}
          <circle
            cx={flow.sourceX + (flow.targetX - flow.sourceX) * flow.flowProgress}
            cy={flow.sourceY + (flow.targetY - flow.sourceY) * flow.flowProgress + 
                Math.sin(flow.flowProgress * Math.PI * 2) * 5}
            r={2 + flow.strength * 3}
            fill={flow.sourceColor}
            opacity={0.8}
            filter="url(#tide-glow)"
          />

          {/* Source connection point */}
          <circle
            cx={flow.sourceX}
            cy={flow.sourceY}
            r={1 + flow.strength * 2}
            fill={flow.sourceColor}
            opacity={0.6}
          />

          {/* Target connection point */}
          <circle
            cx={flow.targetX}
            cy={flow.targetY}
            r={1 + flow.strength * 2}
            fill={flow.targetColor}
            opacity={0.6}
          />

          {/* Layer label (on hover) */}
          <g className="tide-label" opacity="0.7">
            <text
              x={(flow.sourceX + flow.targetX) / 2}
              y={(flow.sourceY + flow.targetY) / 2 - 10}
              textAnchor="middle"
              className="text-xs font-light fill-white"
              style={{ textShadow: '0 0 3px rgba(0,0,0,0.8)' }}
            >
              {flow.sourceLayer} → {flow.targetLayer}
            </text>
            <text
              x={(flow.sourceX + flow.targetX) / 2}
              y={(flow.sourceY + flow.targetY) / 2 + 5}
              textAnchor="middle"
              className="text-xs font-light fill-gray-300"
            >
              {Math.round(flow.strength * 100)}% influence
            </text>
          </g>
        </g>
      ))}

      <style>
        {`
        @keyframes tidePulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .tide-label {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .tide-flow:hover .tide-label {
          opacity: 1;
        }
        `}
      </style>
    </g>
  );
};
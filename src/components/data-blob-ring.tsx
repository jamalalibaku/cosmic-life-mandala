/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useMemo, useState, useEffect } from 'react';
import { goldenRatio } from '../utils/golden-ratio';
import { calculateMoodInfluence, MoodInfluence } from '../utils/mood-engine';
import { OrganicDataBlob } from './organic-data-blob';

export type DataBlobType = 'mobility' | 'mood' | 'sleep';

export type DataBlob = {
  hour: number;
  type: DataBlobType;
  intensity: number; // 0-1
  duration: number; // 0-1 (percentage of hour)
  value?: number;
  sourceLayer?: string; // Phase 21: Data anchoring
  dataPoint?: string;   // Phase 21: Specific time reference
};

interface DataBlobRingProps {
  data: DataBlob[];
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  type: DataBlobType;
  theme?: 'cosmic' | 'natural' | 'minimal';
  label?: string;
  className?: string;
  // Mood-specific props for emotional reactivity
  sleepQuality?: number;
  planDensity?: number;
  weatherCondition?: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  mobilityLevel?: number;
  onMoodChange?: (mood: MoodInfluence) => void;
}

const blobColorMap: Record<DataBlobType, { 
  primary: string; 
  secondary: string; 
  glow: string;
  label: string;
}> = {
  mobility: {
    primary: 'hsl(120 80% 60%)',
    secondary: 'hsl(110 70% 50%)',
    glow: 'hsl(120 90% 70%)',
    label: 'movement'
  },
  mood: {
    primary: 'hsl(280 70% 65%)',
    secondary: 'hsl(270 60% 55%)',
    glow: 'hsl(280 80% 75%)',
    label: 'mood'
  },
  sleep: {
    primary: 'hsl(220 60% 70%)',
    secondary: 'hsl(210 50% 60%)',
    glow: 'hsl(220 70% 80%)',
    label: 'rest'
  }
};

export const DataBlobRing: React.FC<DataBlobRingProps> = ({
  data,
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  type,
  theme = 'cosmic',
  label,
  className = '',
  sleepQuality = 0.7,
  planDensity = 0.5,
  weatherCondition = 'sunny',
  mobilityLevel = 0.6,
  onMoodChange
}) => {
  const [time, setTime] = useState(0);
  const [hoveredBlob, setHoveredBlob] = useState<number | null>(null);
  const [moodInfluence, setMoodInfluence] = useState<MoodInfluence | null>(null);

  // Gentle drift animation
  useEffect(() => {
    const startTime = Math.floor(Date.now() / 1000);
    const animate = () => {
      setTime(Math.floor(Date.now() / 1000) - startTime);
      setTimeout(animate, 1000);
    };
    const timeoutId = setTimeout(animate, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Calculate mood influence for mood type rings
  useEffect(() => {
    if (type === 'mood') {
      const mood = calculateMoodInfluence({
        sleepQuality,
        planDensity,
        weatherCondition,
        mobilityLevel
      });
      setMoodInfluence(mood);
      onMoodChange?.(mood);
    }
  }, [type, sleepQuality, planDensity, weatherCondition, mobilityLevel, onMoodChange]);

  const colors = moodInfluence && type === 'mood' ? {
    primary: moodInfluence.primaryColor,
    secondary: moodInfluence.secondaryColor,
    glow: moodInfluence.primaryColor,
    label: moodInfluence.description
  } : blobColorMap[type];
  const ringRadius = (innerRadius + outerRadius) / 2;
  const ringWidth = outerRadius - innerRadius;

  const blobs = useMemo(() => {
    const currentHour = new Date().getHours();
    const segmentAngle = 360 / 24;
    const rotationOffset = -currentHour * segmentAngle - 90;
    
    return data.map((blob, index) => {
      const angle = rotationOffset + (blob.hour * segmentAngle);
      const driftOffset = Math.sin(time * 0.3 + index * 0.5) * 2; // Gentle drift
      const adjustedAngle = angle + driftOffset;
      const rad = goldenRatio.toRadians(adjustedAngle);
      
      // Position on the ring with slight radial variation
      const radialVariation = Math.sin(time * 0.5 + index) * (ringWidth * 0.1);
      const blobRadius = ringRadius + radialVariation;
      
      const x = centerX + Math.cos(rad) * blobRadius;
      const y = centerY + Math.sin(rad) * blobRadius;
      
      // Size based on intensity and duration
      const baseSize = ringWidth * 0.3;
      const intensityScale = 0.5 + (blob.intensity * 0.8);
      const durationScale = 0.6 + (blob.duration * 0.7);
      const size = baseSize * intensityScale * durationScale;
      
      // Apply mood influence for enhanced visual characteristics
      let finalSize = baseSize * intensityScale * durationScale;
      let deformationScale = 1;
      
      if (type === 'mood' && moodInfluence) {
        finalSize *= (0.8 + moodInfluence.intensity * 0.4);
        
        // Deformation effects based on mood type
        switch (moodInfluence.deformation) {
          case 'sharp':
            deformationScale = 1 + Math.abs(Math.sin(time * 3 + index)) * 0.3;
            break;
          case 'fluid':
            deformationScale = 1 + Math.sin(time * 0.8 + index) * 0.2;
            break;
          case 'crystalline':
            deformationScale = 1 + Math.sin(time * 2 + index) * 0.15;
            break;
          default: // soft
            deformationScale = 1 + Math.sin(time * 0.5 + index) * 0.1;
        }
      }
      
      // Pulsing based on intensity and mood
      const pulseScale = 1 + Math.sin(time * 2 + index) * (blob.intensity * 0.2);
      
      return {
        ...blob,
        x,
        y,
        size: finalSize * deformationScale * pulseScale,
        opacity: 0.6 + (blob.intensity * 0.4),
        angle: adjustedAngle,
        moodGlyph: type === 'mood' && moodInfluence?.glyphSymbol
      };
    });
  }, [data, centerX, centerY, innerRadius, outerRadius, time, type]);

  const labelPosition = useMemo(() => {
    const labelAngle = goldenRatio.toRadians(-45); // Position at upper right
    const labelRadius = outerRadius + 30;
    return {
      x: centerX + Math.cos(labelAngle) * labelRadius,
      y: centerY + Math.sin(labelAngle) * labelRadius + Math.sin(time * 0.3) * 2
    };
  }, [centerX, centerY, outerRadius, time]);

  return (
    <g className={`data-blob-ring ${className}`}>
      {/* Gradient definitions */}
      <defs>
        <radialGradient
          id={`blob-gradient-${type}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={colors.glow} stopOpacity="0.9" />
          <stop offset="50%" stopColor={colors.primary} stopOpacity="0.7" />
          <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.3" />
        </radialGradient>
        
        <filter id={`blob-glow-${type}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Ring guide (subtle) */}
      <circle
        cx={centerX}
        cy={centerY}
        r={ringRadius}
        fill="none"
        stroke={colors.primary}
        strokeWidth="0.5"
        opacity="0.1"
        strokeDasharray="2,4"
        className="pointer-events-none"
      />
      
      {/* Organic data blobs - Phase 21 */}
      {blobs
        .filter(blob => blob.intensity > 0.05) // Only show meaningful data points
        .map((blob, index) => (
        <g key={`blob-${type}-${index}`}>
          <OrganicDataBlob
            x={blob.x}
            y={blob.y}
            size={blob.size}
            intensity={blob.intensity}
            duration={blob.duration}
            type={type}
            time={time}
            index={index}
            opacity={blob.opacity}
            colors={colors}
            onHover={(hovered) => setHoveredBlob(hovered ? index : null)}
            isHovered={hoveredBlob === index}
          />
          
          {/* Data-anchored mood glyph overlay */}
          {type === 'mood' && moodInfluence && blob.intensity > 0.6 && (
            <text
              x={blob.x}
              y={blob.y + 3}
              textAnchor="middle"
              className="text-sm pointer-events-none"
              opacity={blob.intensity * 0.9}
              style={{
                filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.9))',
                animation: `glyphFloat 3s ease-in-out infinite ${index * 0.4}s`
              }}
            >
              {moodInfluence.glyphSymbol}
            </text>
          )}
          
          {/* Enhanced tooltip with data source */}
          {hoveredBlob === index && (
            <g className="blob-tooltip">
              <rect
                x={blob.x - 35}
                y={blob.y - 45}
                width="70"
                height="35"
                rx="6"
                fill="rgba(0, 0, 0, 0.9)"
                stroke={colors.glow}
                strokeWidth="1"
                filter="drop-shadow(0 2px 8px rgba(0,0,0,0.3))"
              />
              <text
                x={blob.x}
                y={blob.y - 25}
                textAnchor="middle"
                className="fill-white text-xs font-semibold"
              >
                {blob.hour.toString().padStart(2, '0')}:00 {type}
              </text>
              <text
                x={blob.x}
                y={blob.y - 12}
                textAnchor="middle"
                className="fill-gray-300 text-xs"
              >
                {Math.round(blob.intensity * 100)}% · {Math.round(blob.duration * 60)}m
              </text>
            </g>
          )}
        </g>
      ))}
      
      {/* Floating label */}
      {label && (
        <text
          x={labelPosition.x}
          y={labelPosition.y}
          textAnchor="middle"
          className="fill-gray-300 text-sm font-light opacity-70"
        >
          {label || colors.label}
        </text>
      )}
      
      <style>
        {`
        @keyframes glyphFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        `}
      </style>
    </g>
  );
};
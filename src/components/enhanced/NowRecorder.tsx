/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * 
 * NOW RECORDER - 24 Divided Recorder Lines
 * The stylus that plays the music of your day through resonant ripples
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResonanceEngine } from './ResonanceEngine';
import { TimeScale } from '../fractal-time-zoom-manager';

interface NowRecorderProps {
  centerX: number;
  centerY: number;
  radius: number;
  timeScale: TimeScale;
  theme: string;
  dataLayers: Array<{
    name: string;
    data: any[];
    radius: number;
    layerType: string;
  }>;
  className?: string;
}

export const NowRecorder: React.FC<NowRecorderProps> = ({
  centerX,
  centerY,
  radius,
  timeScale,
  theme,
  dataLayers,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for live recording
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate the "NOW" angle based on time scale
  const nowAngle = useMemo(() => {
    const now = currentTime;
    
    switch (timeScale) {
      case 'day': {
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        return (totalMinutes / (24 * 60)) * 360 - 90; // -90 to start at top
      }
      
      case 'week': {
        const dayOfWeek = now.getDay();
        const hours = now.getHours();
        const totalHours = dayOfWeek * 24 + hours;
        return (totalHours / (7 * 24)) * 360 - 90;
      }
      
      case 'month': {
        const dayOfMonth = now.getDate() - 1;
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        return (dayOfMonth / daysInMonth) * 360 - 90;
      }
      
      case 'year': {
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        const daysInYear = 365 + (now.getFullYear() % 4 === 0 ? 1 : 0);
        return (dayOfYear / daysInYear) * 360 - 90;
      }
      
      default:
        return -90;
    }
  }, [currentTime, timeScale]);

  // Generate 24 recorder line segments - the vinyl grooves
  const recorderLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    const lineCount = 24;
    const angleStep = 360 / lineCount;
    
    for (let i = 0; i < lineCount; i++) {
      const lineAngle = nowAngle + (i * angleStep);
      const radians = (lineAngle * Math.PI) / 180;
      
      // Calculate line positions
      const innerRadius = radius * 0.85;
      const outerRadius = radius * 1.15;
      
      const startX = centerX + Math.cos(radians) * innerRadius;
      const startY = centerY + Math.sin(radians) * innerRadius;
      const endX = centerX + Math.cos(radians) * outerRadius;
      const endY = centerY + Math.sin(radians) * outerRadius;
      
      // Create curved ripple path for each line when it intersects data
      const hasIntersection = dataLayers.some(layer => 
        layer.data && layer.data.some(dataItem => {
          if (!dataItem.date) return false;
          const hours = dataItem.date.getHours();
          const minutes = dataItem.date.getMinutes();
          const dataAngle = ((hours * 60 + minutes) / 1440) * 360;
          const angleDiff = Math.abs(lineAngle - dataAngle);
          return Math.min(angleDiff, 360 - angleDiff) <= 8;
        })
      );
      
      // Generate ripple path when intersecting
      const ripplePath = hasIntersection 
        ? `M ${startX} ${startY} Q ${startX + Math.cos(radians + 0.1) * 20} ${startY + Math.sin(radians + 0.1) * 20} ${endX} ${endY}`
        : `M ${startX} ${startY} L ${endX} ${endY}`;
      
      lines.push(
        <motion.path
          key={`recorder-line-${i}`}
          d={ripplePath}
          stroke="white"
          strokeWidth={hasIntersection ? "2" : "1"}
          fill="none"
          opacity={hasIntersection ? 0.8 : 0.4}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: hasIntersection ? 0.8 : 0.4,
            strokeWidth: hasIntersection ? "2" : "1"
          }}
          transition={{ 
            duration: 0.5, 
            delay: i * 0.02,
            ease: "easeOut"
          }}
          style={{
            filter: hasIntersection 
              ? `blur(0.5px) drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))`
              : `blur(0.2px) drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))`,
          }}
        />
      );
    }
    
    return lines;
  }, [nowAngle, centerX, centerY, radius, dataLayers]);

  // Theme-specific colors
  const themeColors = useMemo(() => {
    const colors = {
      default: { primary: 'hsl(45 80% 60%)', glow: 'hsl(45 100% 70%)' },
      cosmic: { primary: 'hsl(240 60% 70%)', glow: 'hsl(260 80% 80%)' },
      tattoo: { primary: 'hsl(0 80% 50%)', glow: 'hsl(0 100% 60%)' },
      floral: { primary: 'hsl(300 60% 65%)', glow: 'hsl(320 80% 75%)' },
      techHUD: { primary: 'hsl(180 80% 50%)', glow: 'hsl(180 100% 60%)' },
      vinyl: { primary: 'hsl(45 70% 55%)', glow: 'hsl(45 90% 65%)' },
      noir: { primary: 'hsl(240 30% 40%)', glow: 'hsl(240 60% 50%)' },
      pastelParadise: { primary: 'hsl(280 50% 70%)', glow: 'hsl(300 70% 80%)' }
    };
    return colors[theme] || colors.default;
  }, [theme]);

  return (
    <g className={`now-recorder ${className}`}>
      <defs>
        <radialGradient
          id={`recorder-gradient-${theme}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={themeColors.glow} stopOpacity="1" />
          <stop offset="50%" stopColor={themeColors.primary} stopOpacity="0.8" />
          <stop offset="100%" stopColor={themeColors.primary} stopOpacity="0.3" />
        </radialGradient>
        
        <filter id="recorder-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 24 Recorder Lines - The Stylus */}
      <g className="recorder-stylus">
        {recorderLines}
      </g>

      {/* Resonance Engine - Creates ripples on intersections */}
      <ResonanceEngine
        nowAngle={nowAngle}
        dataLayers={dataLayers}
        centerX={centerX}
        centerY={centerY}
        recorderRadius={radius}
      />

      {/* Central NOW marker */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r="6"
        fill={`url(#recorder-gradient-${theme})`}
        stroke={themeColors.glow}
        strokeWidth="2"
        filter="url(#recorder-glow)"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* NOW label */}
      <text
        x={centerX}
        y={centerY - 25}
        textAnchor="middle"
        className="text-xs font-bold fill-white"
        filter="url(#recorder-glow)"
        opacity="0.9"
      >
        NOW
      </text>

      {/* Enhanced Time display */}
      <g className="cosmic-time-display">
        {timeScale === 'day' && (
          <>
            <text
              x={centerX}
              y={centerY + 45}
              textAnchor="middle"
              className="text-lg font-medium tracking-wide"
              fill="hsl(45 90% 85%)"
              filter="url(#recorder-glow)"
              style={{
                fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
                textShadow: '0 0 8px rgba(255, 220, 180, 0.4), 0 0 20px rgba(255, 220, 180, 0.15)'
              }}
            >
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </text>
            
            <text
              x={centerX + 25}
              y={centerY + 40}
              textAnchor="start"
              className="text-xs font-light"
              fill="hsl(45 70% 70%)"
              opacity="0.7"
              style={{
                fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif"
              }}
            >
              {currentTime.toLocaleTimeString([], { hour12: true }).split(' ')[1]}
            </text>
          </>
        )}
      </g>
    </g>
  );
};
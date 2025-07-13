/**
 * Dynamic NOW Indicator - Multi-Quadrant Positioning with Pole Crossing Animations
 * Features: Quadrant-aware label positioning, pole crossing spin animations, smooth transitions
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TimeScale } from '../fractal-time-zoom-manager';
import { useBreathingPulse } from '../../hooks/use-breathing-pulse';

interface DynamicNowIndicatorProps {
  centerX: number;
  centerY: number;
  radius: number;
  timeScale: TimeScale;
  theme: string;
  className?: string;
}

type Quadrant = 'northwest' | 'northeast' | 'southeast' | 'southwest';

interface QuadrantConfig {
  range: [number, number];
  labelOffset: { x: number; y: number };
  textAlign: string;
  textAnchor: string;
}

const QUADRANT_CONFIGS: Record<Quadrant, QuadrantConfig> = {
  northwest: {
    range: [270, 360],
    labelOffset: { x: -40, y: -15 },
    textAlign: 'right',
    textAnchor: 'end'
  },
  northeast: {
    range: [0, 90],
    labelOffset: { x: 40, y: -15 },
    textAlign: 'left',
    textAnchor: 'start'
  },
  southeast: {
    range: [90, 180],
    labelOffset: { x: 40, y: 25 },
    textAlign: 'left',
    textAnchor: 'start'
  },
  southwest: {
    range: [180, 270],
    labelOffset: { x: -40, y: 25 },
    textAlign: 'right',
    textAnchor: 'end'
  }
};

const POLE_ANGLES = [0, 90, 180, 270, 360];
const POLE_THRESHOLD = 2; // degrees

export const DynamicNowIndicator: React.FC<DynamicNowIndicatorProps> = ({
  centerX,
  centerY,
  radius,
  timeScale,
  theme,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastPoleAngle, setLastPoleAngle] = useState<number | null>(null);
  const [isPoleCrossing, setIsPoleCrossing] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Enhanced pulse effect
  const { applyBreathingRadius, applyBreathingOpacity } = useBreathingPulse({
    enabled: true,
    cycleMs: 4000,
    intensity: 0.2,
    phaseOffset: 0,
    easingType: 'smooth'
  });

  // Calculate the "NOW" angle based on time scale
  const nowAngle = useMemo(() => {
    const now = currentTime;
    
    switch (timeScale) {
      case 'day': {
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        return (totalMinutes / (24 * 60)) * 360 - 90;
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

  // Normalize angle to 0-360 range
  const normalizedAngle = useMemo(() => {
    let angle = nowAngle + 90; // Convert to 0-360 with 0 at top
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
  }, [nowAngle]);

  // Detect pole crossings
  useEffect(() => {
    const nearestPole = POLE_ANGLES.find(pole => 
      Math.abs(normalizedAngle - pole) < POLE_THRESHOLD ||
      Math.abs(normalizedAngle - (pole + 360)) < POLE_THRESHOLD
    );

    if (nearestPole !== undefined && lastPoleAngle !== nearestPole) {
      setIsPoleCrossing(true);
      setLastPoleAngle(nearestPole);
      
      // Reset pole crossing animation after 1 second
      setTimeout(() => {
        setIsPoleCrossing(false);
      }, 1000);
    }
  }, [normalizedAngle, lastPoleAngle]);

  // Determine active quadrant
  const activeQuadrant = useMemo((): Quadrant => {
    if (normalizedAngle >= 270 || normalizedAngle < 90) {
      return normalizedAngle >= 315 || normalizedAngle < 45 ? 'northwest' : 
             normalizedAngle >= 270 ? 'northwest' : 'northeast';
    } else if (normalizedAngle >= 90 && normalizedAngle < 180) {
      return normalizedAngle < 135 ? 'northeast' : 'southeast';
    } else if (normalizedAngle >= 180 && normalizedAngle < 270) {
      return normalizedAngle < 225 ? 'southeast' : 'southwest';
    }
    return 'northwest';
  }, [normalizedAngle]);

  // Calculate position on circle
  const nowPosition = useMemo(() => {
    const radians = (nowAngle * Math.PI) / 180;
    return {
      x: centerX + Math.cos(radians) * radius,
      y: centerY + Math.sin(radians) * radius
    };
  }, [centerX, centerY, radius, nowAngle]);

  // Calculate label position based on active quadrant
  const labelPosition = useMemo(() => {
    const config = QUADRANT_CONFIGS[activeQuadrant];
    const labelRadius = radius + 45; // Position outside the pulsating radius
    const radians = (nowAngle * Math.PI) / 180;
    
    return {
      x: centerX + Math.cos(radians) * labelRadius + config.labelOffset.x,
      y: centerY + Math.sin(radians) * labelRadius + config.labelOffset.y,
      config
    };
  }, [centerX, centerY, radius, nowAngle, activeQuadrant]);

  // Theme-specific colors
  const themeColors = useMemo(() => {
    const colors = {
      default: { primary: 'hsl(45 80% 60%)', glow: 'hsl(45 100% 70%)' },
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
    <g className={`dynamic-now-indicator ${className}`}>
      <defs>
        <radialGradient
          id={`now-gradient-${theme}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={themeColors.glow} stopOpacity="1" />
          <stop offset="50%" stopColor={themeColors.primary} stopOpacity="0.8" />
          <stop offset="100%" stopColor={themeColors.primary} stopOpacity="0.3" />
        </radialGradient>
        
        <filter id="now-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="now-intense-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="shimmer-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Radial guide line */}
      <line
        x1={centerX}
        y1={centerY}
        x2={nowPosition.x}
        y2={nowPosition.y}
        stroke={themeColors.primary}
        strokeWidth="2"
        opacity={applyBreathingOpacity(0.4)}
        strokeDasharray="2,4"
        filter="url(#now-glow)"
      />

      {/* Outer glow ring */}
      <circle
        cx={nowPosition.x}
        cy={nowPosition.y}
        r={applyBreathingRadius(20)}
        fill="none"
        stroke={themeColors.glow}
        strokeWidth="1"
        opacity={applyBreathingOpacity(0.3)}
        filter="url(#now-intense-glow)"
      />

      {/* Main NOW indicator */}
      <circle
        cx={nowPosition.x}
        cy={nowPosition.y}
        r={applyBreathingRadius(8)}
        fill={`url(#now-gradient-${theme})`}
        stroke={themeColors.glow}
        strokeWidth="2"
        filter="url(#now-glow)"
        className="pointer-events-none"
      />

      {/* Inner core */}
      <circle
        cx={nowPosition.x}
        cy={nowPosition.y}
        r={applyBreathingRadius(4)}
        fill="white"
        opacity={applyBreathingOpacity(0.9)}
        className="pointer-events-none"
      />

      {/* Dynamic quadrant-aware NOW label */}
      <motion.text
        x={labelPosition.x}
        y={labelPosition.y}
        textAnchor={labelPosition.config.textAnchor}
        className="text-sm font-bold"
        fill="hsl(45 90% 85%)"
        filter="url(#shimmer-glow)"
        style={{
          fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
          textShadow: '0 0 8px rgba(255, 220, 180, 0.4), 0 0 20px rgba(255, 220, 180, 0.15)'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: applyBreathingOpacity(0.9),
          scale: 1,
          rotate: isPoleCrossing ? [0, 15, -10, 0] : 0,
          x: labelPosition.x,
          y: labelPosition.y
        }}
        transition={{
          opacity: { duration: 0.8, ease: "easeInOut" },
          scale: { duration: 0.8, ease: "easeInOut" },
          rotate: isPoleCrossing ? { duration: 1, ease: "easeInOut" } : { duration: 0 },
          x: { duration: 0.8, ease: "easeInOut" },
          y: { duration: 0.8, ease: "easeInOut" }
        }}
      >
        NOW
      </motion.text>

      {/* Pole crossing glow effect */}
      {isPoleCrossing && (
        <motion.circle
          cx={nowPosition.x}
          cy={nowPosition.y}
          r={30}
          fill="none"
          stroke={themeColors.glow}
          strokeWidth="2"
          opacity="0"
          filter="url(#now-intense-glow)"
          initial={{ r: 8, opacity: 0 }}
          animate={{ 
            r: [8, 40, 60], 
            opacity: [0, 0.6, 0],
            strokeWidth: [3, 1, 0]
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      )}

      {/* Enhanced Time display */}
      <g className="cosmic-time-display">
        {timeScale === 'day' && (
          <>
            <text
              x={nowPosition.x}
              y={nowPosition.y + 45}
              textAnchor="middle"
              className="text-lg font-medium tracking-wide"
              fill="hsl(45 90% 85%)"
              filter="url(#shimmer-glow)"
              opacity={applyBreathingOpacity(0.95)}
              style={{
                fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
                textShadow: '0 0 8px rgba(255, 220, 180, 0.4), 0 0 20px rgba(255, 220, 180, 0.15)'
              }}
            >
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </text>
            
            <text
              x={nowPosition.x + 25}
              y={nowPosition.y + 40}
              textAnchor="start"
              className="text-xs font-light"
              fill="hsl(45 70% 70%)"
              opacity={applyBreathingOpacity(0.7)}
              style={{
                fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif"
              }}
            >
              {currentTime.toLocaleTimeString([], { hour12: true }).split(' ')[1]}
            </text>
          </>
        )}
        
        {timeScale === 'week' && (
          <text
            x={nowPosition.x}
            y={nowPosition.y + 40}
            textAnchor="middle"
            className="text-sm font-medium"
            fill="hsl(45 80% 75%)"
            filter="url(#shimmer-glow)"
            opacity={applyBreathingOpacity(0.85)}
            style={{
              fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif"
            }}
          >
            {currentTime.toLocaleDateString([], { weekday: 'long' })}
          </text>
        )}
        
        {timeScale === 'month' && (
          <text
            x={nowPosition.x}
            y={nowPosition.y + 40}
            textAnchor="middle"
            className="text-base font-medium"
            fill="hsl(45 80% 75%)"
            filter="url(#shimmer-glow)"
            opacity={applyBreathingOpacity(0.85)}
            style={{
              fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif"
            }}
          >
            {currentTime.getDate()}
          </text>
        )}
        
        {timeScale === 'year' && (
          <text
            x={nowPosition.x}
            y={nowPosition.y + 40}
            textAnchor="middle"
            className="text-sm font-medium"
            fill="hsl(45 80% 75%)"
            filter="url(#shimmer-glow)"
            opacity={applyBreathingOpacity(0.85)}
            style={{
              fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif"
            }}
          >
            {currentTime.toLocaleDateString([], { month: 'long' })}
          </text>
        )}
      </g>
    </g>
  );
};
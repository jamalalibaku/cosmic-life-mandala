/**
 * Musical NOW Indicator - "The Cosmic Stylus of Present Moment"
 * 
 * Adria's Vision:
 * The NOW line doesn't just point to time - it PLAYS the rings of life
 * like a stylus on a cosmic vinyl record. When it touches data glyphs,
 * it creates ripples of awareness and intention.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TimeScale } from '../fractal-time-zoom-manager';
import { useBreathingPulse } from '../../hooks/use-breathing-pulse';
import { 
  NowLineCollisionSystem, 
  CollisionGlyph, 
  RippleEvent,
  convertDataBlobsToGlyphs 
} from './NowLineCollisionSystem';
import { RippleContainer } from './RippleEffect';
import { DataBlob } from '../data-blob-ring';

interface MusicalNowIndicatorProps {
  centerX: number;
  centerY: number;
  radius: number;
  timeScale: TimeScale;
  theme: string;
  className?: string;
  // Data for collision detection
  moodData?: DataBlob[];
  sleepData?: DataBlob[];
  mobilityData?: DataBlob[];
  weatherData?: any[];
  plansData?: any[];
  // Ring radii for glyph positioning
  moodRingRadius?: number;
  sleepRingRadius?: number;
  mobilityRingRadius?: number;
  weatherRingRadius?: number;
  plansRingRadius?: number;
  // Callbacks for musical interactions
  onGlyphPlayed?: (glyph: CollisionGlyph) => void;
  onMoodDetected?: (mood: string) => void;
  enableCollisions?: boolean;
}

export const MusicalNowIndicator: React.FC<MusicalNowIndicatorProps> = ({
  centerX,
  centerY,
  radius,
  timeScale,
  theme,
  className = '',
  moodData = [],
  sleepData = [],
  mobilityData = [],
  weatherData = [],
  plansData = [],
  moodRingRadius = 200,
  sleepRingRadius = 170,
  mobilityRingRadius = 140,
  weatherRingRadius = 320,
  plansRingRadius = 240,
  onGlyphPlayed,
  onMoodDetected,
  enableCollisions = true
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeRipples, setActiveRipples] = useState<RippleEvent[]>([]);
  const [lastPlayedMood, setLastPlayedMood] = useState<string>('');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Enhanced pulse effect - like a time compass
  const { applyBreathingRadius, applyBreathingOpacity } = useBreathingPulse({
    enabled: true,
    cycleMs: 4000,
    intensity: 0.3,
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

  // Calculate the NOW line endpoint
  const nowPosition = useMemo(() => {
    const radians = (nowAngle * Math.PI) / 180;
    return {
      x: centerX + Math.cos(radians) * radius,
      y: centerY + Math.sin(radians) * radius
    };
  }, [centerX, centerY, radius, nowAngle]);

  // Convert all data to collision glyphs
  const allGlyphs = useMemo(() => {
    const glyphs: CollisionGlyph[] = [];

    // Convert mood data
    if (moodData.length > 0) {
      glyphs.push(...convertDataBlobsToGlyphs(
        moodData, centerX, centerY, moodRingRadius, 'mood'
      ));
    }

    // Convert sleep data
    if (sleepData.length > 0) {
      glyphs.push(...convertDataBlobsToGlyphs(
        sleepData, centerX, centerY, sleepRingRadius, 'sleep'
      ));
    }

    // Convert mobility data
    if (mobilityData.length > 0) {
      glyphs.push(...convertDataBlobsToGlyphs(
        mobilityData, centerX, centerY, mobilityRingRadius, 'mobility'
      ));
    }

    // TODO: Add weather and plans data conversion when needed

    return glyphs;
  }, [
    moodData, sleepData, mobilityData,
    centerX, centerY,
    moodRingRadius, sleepRingRadius, mobilityRingRadius
  ]);

  // Handle glyph collision
  const handleGlyphCollision = useCallback((glyph: CollisionGlyph) => {
    // Trigger sound or feedback based on glyph type
    console.log(`🎵 NOW line touched ${glyph.type} glyph with intensity ${glyph.intensity}`);
    
    // Call external handler
    onGlyphPlayed?.(glyph);

    // Special handling for mood glyphs
    if (glyph.type === 'mood' && glyph.data?.mood) {
      const moodName = glyph.data.mood || 'peaceful';
      setLastPlayedMood(moodName);
      onMoodDetected?.(moodName);
    }
  }, [onGlyphPlayed, onMoodDetected]);

  // Handle ripple creation
  const handleRippleCreate = useCallback((ripple: RippleEvent) => {
    setActiveRipples(prev => [...prev, ripple]);
  }, []);

  // Handle ripple completion
  const handleRippleComplete = useCallback((rippleId: string) => {
    setActiveRipples(prev => prev.filter(r => r.id !== rippleId));
  }, []);

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
    <g className={`musical-now-indicator ${className}`}>
      <defs>
        {/* Enhanced NOW gradient with musical energy */}
        <radialGradient
          id={`musical-now-gradient-${theme}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={themeColors.glow} stopOpacity="1" />
          <stop offset="30%" stopColor={themeColors.primary} stopOpacity="0.9" />
          <stop offset="70%" stopColor={themeColors.primary} stopOpacity="0.6" />
          <stop offset="100%" stopColor={themeColors.primary} stopOpacity="0.2" />
        </radialGradient>
        
        {/* Stylus glow filter */}
        <filter id="stylus-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feGaussianBlur stdDeviation="8" result="wideGlow"/>
          <feMerge>
            <feMergeNode in="wideGlow"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Musical energy field */}
        <filter id="musical-energy" x="-100%" y="-100%" width="300%" height="300%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.02 0.01" 
            numOctaves="3" 
            result="energy-turbulence"
          >
            <animate
              attributeName="baseFrequency"
              values="0.015 0.008;0.025 0.012;0.015 0.008"
              dur="6s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="energy-turbulence" 
            scale="2"
          />
        </filter>
      </defs>

      {/* Collision Detection System (invisible) */}
      {enableCollisions && (
        <NowLineCollisionSystem
          centerX={centerX}
          centerY={centerY}
          nowAngle={nowAngle}
          nowRadius={radius}
          glyphs={allGlyphs}
          onCollision={handleGlyphCollision}
          onRippleCreate={handleRippleCreate}
          detectionRadius={20}
          enabled={true}
        />
      )}

      {/* Musical energy field around NOW line */}
      <motion.line
        x1={centerX}
        y1={centerY}
        x2={nowPosition.x}
        y2={nowPosition.y}
        stroke={themeColors.primary}
        strokeWidth="1"
        opacity={applyBreathingOpacity(0.2)}
        strokeDasharray="1,2"
        filter="url(#musical-energy)"
        animate={{
          strokeDashoffset: [0, -6],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" },
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Main stylus line */}
      <motion.line
        x1={centerX}
        y1={centerY}
        x2={nowPosition.x}
        y2={nowPosition.y}
        stroke={themeColors.primary}
        strokeWidth="2"
        opacity={applyBreathingOpacity(0.7)}
        filter="url(#stylus-glow)"
        animate={{
          strokeWidth: [1.5, 2.5, 1.5],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Stylus tip - enhanced with musical resonance */}
      <motion.circle
        cx={nowPosition.x}
        cy={nowPosition.y}
        r={applyBreathingRadius(10)}
        fill={`url(#musical-now-gradient-${theme})`}
        stroke={themeColors.glow}
        strokeWidth="2"
        filter="url(#stylus-glow)"
        animate={{
          scale: activeRipples.length > 0 ? [1, 1.3, 1] : [1, 1.1, 1],
          strokeWidth: activeRipples.length > 0 ? [2, 4, 2] : [2, 3, 2]
        }}
        transition={{
          duration: activeRipples.length > 0 ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Inner stylus core */}
      <motion.circle
        cx={nowPosition.x}
        cy={nowPosition.y}
        r={applyBreathingRadius(4)}
        fill="white"
        opacity={applyBreathingOpacity(0.9)}
        animate={{
          r: activeRipples.length > 0 ? [3, 6, 3] : [3, 5, 3]
        }}
        transition={{
          duration: activeRipples.length > 0 ? 0.3 : 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* NOW label with musical enhancement */}
      <motion.text
        x={nowPosition.x}
        y={nowPosition.y - 25}
        textAnchor="middle"
        className="text-xs font-bold fill-white"
        filter="url(#stylus-glow)"
        opacity={applyBreathingOpacity(0.8)}
        animate={{
          scale: activeRipples.length > 0 ? [1, 1.2, 1] : [1, 1.05, 1],
          y: activeRipples.length > 0 ? [nowPosition.y - 25, nowPosition.y - 30, nowPosition.y - 25] : [nowPosition.y - 25, nowPosition.y - 27, nowPosition.y - 25]
        }}
        transition={{
          duration: activeRipples.length > 0 ? 0.4 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {activeRipples.length > 0 ? '♪ NOW ♪' : 'NOW'}
      </motion.text>

      {/* Last played mood indicator */}
      {lastPlayedMood && (
        <motion.text
          x={nowPosition.x + 15}
          y={nowPosition.y - 10}
          textAnchor="start"
          className="text-xs font-medium"
          fill={themeColors.glow}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 3 }}
          onAnimationComplete={() => setLastPlayedMood('')}
        >
          {lastPlayedMood}
        </motion.text>
      )}

      {/* Musical resonance rays when active */}
      {activeRipples.length > 0 && Array.from({ length: 8 }, (_, i) => {
        const rayAngle = nowAngle + (i - 4) * 15;
        const rayLength = 25 + (i % 2) * 10;
        const rayRad = (rayAngle * Math.PI) / 180;
        const rayEndX = nowPosition.x + Math.cos(rayRad) * rayLength;
        const rayEndY = nowPosition.y + Math.sin(rayRad) * rayLength;
        
        return (
          <motion.line
            key={`musical-ray-${i}`}
            x1={nowPosition.x}
            y1={nowPosition.y}
            x2={rayEndX}
            y2={rayEndY}
            stroke={themeColors.glow}
            strokeWidth="1"
            opacity="0"
            strokeLinecap="round"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0], 
              scale: [0, 1, 0],
              strokeWidth: [0.5, 2, 0.5]
            }}
            transition={{
              duration: 1,
              delay: i * 0.1,
              ease: "easeOut"
            }}
          />
        );
      })}

      {/* Ripple Effects Container */}
      <RippleContainer
        ripples={activeRipples}
        onRippleComplete={handleRippleComplete}
      />

      {/* Enhanced time display */}
      {timeScale === 'day' && (
        <motion.text
          x={nowPosition.x}
          y={nowPosition.y + 45}
          textAnchor="middle"
          className="text-lg font-medium tracking-wide"
          fill="hsl(45 90% 85%)"
          filter="url(#stylus-glow)"
          opacity={applyBreathingOpacity(0.95)}
          style={{
            fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
            textShadow: '0 0 8px rgba(255, 220, 180, 0.4)'
          }}
          animate={{
            scale: activeRipples.length > 0 ? [1, 1.05, 1] : 1
          }}
          transition={{
            duration: 0.5,
            repeat: activeRipples.length > 0 ? Infinity : 0
          }}
        >
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </motion.text>
      )}
    </g>
  );
};
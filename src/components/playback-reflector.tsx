/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { goldenRatio, PHI } from '../utils/golden-ratio';

interface PlaybackState {
  isPlaying: boolean;
  currentTime: number; // 0-1 representing progress through the timespan
  speed: number; // Playback speed multiplier
  direction: 'forward' | 'reverse';
}

interface PlaybackReflectorProps {
  timespan: 'day' | 'week' | 'month' | 'year';
  centerX: number;
  centerY: number;
  radius: number;
  onTimeUpdate?: (time: number) => void;
  onSegmentActivate?: (segment: any) => void;
  className?: string;
}

const timespanDurations = {
  day: 24,    // 24 hours
  week: 7,    // 7 days  
  month: 30,  // 30 days
  year: 12    // 12 months
};

const timespanLabels = {
  day: 'Reflect My Day',
  week: 'Replay My Week', 
  month: 'Review My Month',
  year: 'Revisit My Year'
};

export const PlaybackReflector: React.FC<PlaybackReflectorProps> = ({
  timespan,
  centerX,
  centerY,
  radius,
  onTimeUpdate,
  onSegmentActivate,
  className = ''
}) => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    speed: 1,
    direction: 'forward'
  });

  const [backgroundHue, setBackgroundHue] = useState(240); // Start with night blue

  // Animation loop for playback
  useEffect(() => {
    if (!playbackState.isPlaying) return;

    const duration = timespanDurations[timespan] * 1000; // Convert to milliseconds
    const increment = (playbackState.speed * 16) / duration; // 60fps frame time
    
    const animate = () => {
      setPlaybackState(prev => {
        let newTime = prev.currentTime;
        
        if (prev.direction === 'forward') {
          newTime += increment;
          if (newTime >= 1) {
            newTime = 1;
            return { ...prev, isPlaying: false, currentTime: newTime };
          }
        } else {
          newTime -= increment;
          if (newTime <= 0) {
            newTime = 0;
            return { ...prev, isPlaying: false, currentTime: newTime };
          }
        }
        
        return { ...prev, currentTime: newTime };
      });
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [playbackState.isPlaying, playbackState.speed, playbackState.direction, timespan]);

  // Update external listeners
  useEffect(() => {
    onTimeUpdate?.(playbackState.currentTime);
  }, [playbackState.currentTime, onTimeUpdate]);

  // Calculate time-of-day color progression
  useEffect(() => {
    if (timespan === 'day') {
      // Day progression: night blue → dawn purple → day gold → sunset orange → night blue
      const progress = playbackState.currentTime;
      let hue;
      
      if (progress < 0.25) { // Night to dawn
        hue = 240 + (progress * 4) * 60; // Blue to purple
      } else if (progress < 0.5) { // Dawn to day
        hue = 300 + ((progress - 0.25) * 4) * 60; // Purple to gold
      } else if (progress < 0.75) { // Day to sunset
        hue = 45 + ((progress - 0.5) * 4) * 15; // Gold to orange
      } else { // Sunset to night
        hue = 30 - ((progress - 0.75) * 4) * 90; // Orange to blue
      }
      
      setBackgroundHue(hue);
    } else {
      // Other timespans use a gentle rotation through cosmic colors
      setBackgroundHue(240 + playbackState.currentTime * 120);
    }
  }, [playbackState.currentTime, timespan]);

  const togglePlayback = useCallback(() => {
    setPlaybackState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const resetPlayback = useCallback(() => {
    setPlaybackState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      currentTime: 0 
    }));
  }, []);

  const changeSpeed = useCallback(() => {
    setPlaybackState(prev => ({ 
      ...prev, 
      speed: prev.speed >= 3 ? 0.5 : prev.speed * 2 
    }));
  }, []);

  // Calculate rotation angle and active segments
  const rotationAngle = playbackState.currentTime * 360;
  const glowIntensity = playbackState.isPlaying ? 0.8 : 0.3;
  
  // Progress arc calculation
  const progressArcRadius = radius * 0.9;
  const progressAngle = playbackState.currentTime * 360;
  const progressRad = goldenRatio.toRadians(progressAngle - 90);
  const progressEndX = centerX + Math.cos(progressRad) * progressArcRadius;
  const progressEndY = centerY + Math.sin(progressRad) * progressArcRadius;

  return (
    <g className={`playback-reflector ${className}`}>
      <defs>
        {/* Time-based background gradient */}
        <radialGradient 
          id="playback-background" 
          cx="50%" 
          cy="50%" 
          r="100%"
        >
          <stop 
            offset="0%" 
            stopColor={`hsl(${backgroundHue} 30% 5%)`} 
            stopOpacity="0.3"
          />
          <stop 
            offset="70%" 
            stopColor={`hsl(${backgroundHue} 50% 10%)`} 
            stopOpacity="0.6"
          />
          <stop 
            offset="100%" 
            stopColor={`hsl(${backgroundHue} 70% 15%)`} 
            stopOpacity="0.8"
          />
        </radialGradient>

        {/* Playback glow effect */}
        <filter id="playback-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background time atmosphere */}
      {playbackState.isPlaying && (
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 1.2}
          fill="url(#playback-background)"
          opacity={glowIntensity * 0.4}
        />
      )}

      {/* Progress arc */}
      <path
        d={`M ${centerX} ${centerY - progressArcRadius} 
            A ${progressArcRadius} ${progressArcRadius} 0 
            ${progressAngle > 180 ? 1 : 0} 1 
            ${progressEndX} ${progressEndY}`}
        fill="none"
        stroke={`hsl(${backgroundHue} 80% 60%)`}
        strokeWidth="3"
        opacity={glowIntensity}
        filter="url(#playback-glow)"
      />

      {/* Time indicator needle */}
      <line
        x1={centerX}
        y1={centerY}
        x2={centerX + Math.cos(goldenRatio.toRadians(rotationAngle - 90)) * (radius * 0.8)}
        y2={centerY + Math.sin(goldenRatio.toRadians(rotationAngle - 90)) * (radius * 0.8)}
        stroke={`hsl(${backgroundHue} 90% 70%)`}
        strokeWidth="2"
        opacity={glowIntensity}
        filter="url(#playback-glow)"
      />

      {/* Control panel */}
      <g className="playback-controls">
        {/* Background panel */}
        <rect
          x={centerX - 100}
          y={centerY + radius + 20}
          width="200"
          height="50"
          rx="25"
          fill="rgba(0, 0, 0, 0.8)"
          stroke={`hsl(${backgroundHue} 60% 50%)`}
          strokeWidth="1"
          opacity="0.9"
        />

        {/* Play/Pause button */}
        <g
          onClick={togglePlayback}
          className="cursor-pointer hover:scale-110 transition-transform duration-200"
          transform={`translate(${centerX - 60}, ${centerY + radius + 30})`}
        >
          <circle
            cx="0"
            cy="0"
            r="12"
            fill={`hsl(${backgroundHue} 70% 60%)`}
            opacity="0.8"
          />
          {playbackState.isPlaying ? (
            <Pause size={16} x="-8" y="-8" className="fill-white" />
          ) : (
            <Play size={16} x="-6" y="-8" className="fill-white" />
          )}
        </g>

        {/* Reset button */}
        <g
          onClick={resetPlayback}
          className="cursor-pointer hover:scale-110 transition-transform duration-200"
          transform={`translate(${centerX - 20}, ${centerY + radius + 30})`}
        >
          <circle
            cx="0"
            cy="0"
            r="10"
            fill={`hsl(${backgroundHue} 50% 50%)`}
            opacity="0.7"
          />
          <RotateCcw size={12} x="-6" y="-6" className="fill-white" />
        </g>

        {/* Speed control */}
        <g
          onClick={changeSpeed}
          className="cursor-pointer hover:scale-110 transition-transform duration-200"
          transform={`translate(${centerX + 20}, ${centerY + radius + 30})`}
        >
          <circle
            cx="0"
            cy="0"
            r="10"
            fill={`hsl(${backgroundHue} 50% 50%)`}
            opacity="0.7"
          />
          <FastForward size={12} x="-6" y="-6" className="fill-white" />
          <text
            x="0"
            y="20"
            textAnchor="middle"
            className="text-xs fill-white opacity-60"
          >
            {playbackState.speed}x
          </text>
        </g>

        {/* Title */}
        <text
          x={centerX + 60}
          y={centerY + radius + 35}
          textAnchor="middle"
          className="text-sm font-light fill-white opacity-80"
        >
          {timespanLabels[timespan]}
        </text>
      </g>

      {/* Time display */}
      <text
        x={centerX}
        y={centerY + radius + 80}
        textAnchor="middle"
        className="text-xs font-light opacity-60"
        fill={`hsl(${backgroundHue} 70% 70%)`}
      >
        {Math.round(playbackState.currentTime * 100)}% complete
      </text>
    </g>
  );
};

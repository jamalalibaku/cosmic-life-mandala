/**
 * Night Passage Orchestrator - Manages all four Night Passage visual elements
 * Coordinates the midnight arc, emotional climax, gradient pulse, and urban grounding
 */

import React, { useState, useEffect, useMemo } from 'react';
import { MidnightArcBurst } from './MidnightArcBurst';
import { EmotionalClimax } from './EmotionalClimax';
import { GradientPulse } from './GradientPulse';
import { UrbanGrounding } from './UrbanGrounding';

interface NightPassageOrchestratorProps {
  centerX: number;
  centerY: number;
  radius: number;
  theme: string;
  isEnabled?: boolean;
  emotionalData?: {
    emotion: 'joy' | 'excitement' | 'stress' | 'calm' | 'sadness' | 'anger' | 'love' | 'surprise';
    intensity: number;
  };
  insightData?: {
    type: 'seasonal' | 'insight' | 'aurora' | 'cosmic';
    intensity: number;
  };
  locationData?: {
    silhouetteType: 'city' | 'mountains' | 'forest' | 'desert' | 'coastal';
  };
  className?: string;
}

export const NightPassageOrchestrator: React.FC<NightPassageOrchestratorProps> = ({
  centerX,
  centerY,
  radius,
  theme,
  isEnabled = true,
  emotionalData,
  insightData,
  locationData,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeEffects, setActiveEffects] = useState({
    midnightArc: false,
    emotionalClimax: false,
    gradientPulse: false,
    urbanGrounding: true // Always visible as base layer
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine time of day for urban grounding
  const timeOfDay = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 9) return 'dawn';
    if (hour >= 9 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'dusk';
    return 'night';
  }, [currentTime]);

  // Check for midnight burst trigger
  useEffect(() => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const second = currentTime.getSeconds();
    
    // Trigger midnight arc at 00:00:00
    if (hour === 0 && minute === 0 && second <= 30) {
      setActiveEffects(prev => ({ ...prev, midnightArc: true }));
      
      // Reset after 8 seconds
      setTimeout(() => {
        setActiveEffects(prev => ({ ...prev, midnightArc: false }));
      }, 8000);
    }
  }, [currentTime]);

  // Monitor emotional intensity for climax trigger
  useEffect(() => {
    if (emotionalData && emotionalData.intensity > 0.7) {
      setActiveEffects(prev => ({ ...prev, emotionalClimax: true }));
      
      // Reset after 5 seconds
      setTimeout(() => {
        setActiveEffects(prev => ({ ...prev, emotionalClimax: false }));
      }, 5000);
    }
  }, [emotionalData]);

  // Monitor insight intensity for gradient pulse
  useEffect(() => {
    if (insightData && insightData.intensity > 0.5) {
      setActiveEffects(prev => ({ ...prev, gradientPulse: true }));
      
      // Reset after 6 seconds
      setTimeout(() => {
        setActiveEffects(prev => ({ ...prev, gradientPulse: false }));
      }, 6000);
    }
  }, [insightData]);

  // Auto-trigger gradient pulse for seasonal changes (every 20 minutes)
  useEffect(() => {
    const seasonalTimer = setInterval(() => {
      setActiveEffects(prev => ({ ...prev, gradientPulse: true }));
      
      setTimeout(() => {
        setActiveEffects(prev => ({ ...prev, gradientPulse: false }));
      }, 4000);
    }, 20 * 60 * 1000); // 20 minutes

    return () => clearInterval(seasonalTimer);
  }, []);

  if (!isEnabled) return null;

  return (
    <g className={`night-passage-orchestrator ${className}`}>
      {/* Urban Grounding - Base layer, always visible */}
      <UrbanGrounding
        centerX={centerX}
        centerY={centerY}
        baseRadius={radius + 40}
        silhouetteType={locationData?.silhouetteType || 'city'}
        theme={theme}
        timeOfDay={timeOfDay}
      />

      {/* Gradient Pulse - Seasonal waves and insight bursts */}
      <GradientPulse
        centerX={centerX}
        centerY={centerY}
        maxRadius={radius + 80}
        type={insightData?.type || 'seasonal'}
        intensity={insightData?.intensity || 0.6}
        theme={theme}
        isActive={activeEffects.gradientPulse}
        direction="outward"
      />

      {/* Emotional Climax - Vertical bursts */}
      <EmotionalClimax
        centerX={centerX}
        centerY={centerY}
        intensity={emotionalData?.intensity || 0.8}
        emotion={emotionalData?.emotion || 'joy'}
        theme={theme}
        isActive={activeEffects.emotionalClimax}
      />

      {/* Midnight Arc Burst - Daily trail burst */}
      <MidnightArcBurst
        centerX={centerX}
        centerY={centerY}
        radius={radius}
        theme={theme}
        isActive={activeEffects.midnightArc}
      />

      {/* Debug indicator (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <g className="debug-indicators">
          <text
            x={centerX - radius - 60}
            y={centerY - radius - 20}
            className="text-xs fill-white/50"
            textAnchor="start"
          >
            Night Passage Effects:
          </text>
          <text
            x={centerX - radius - 60}
            y={centerY - radius}
            className="text-xs fill-white/40"
            textAnchor="start"
          >
            Arc: {activeEffects.midnightArc ? '●' : '○'} 
            Climax: {activeEffects.emotionalClimax ? '●' : '○'}
            Pulse: {activeEffects.gradientPulse ? '●' : '○'}
            Urban: {activeEffects.urbanGrounding ? '●' : '○'}
          </text>
          <text
            x={centerX - radius - 60}
            y={centerY - radius + 20}
            className="text-xs fill-white/30"
            textAnchor="start"
          >
            Time: {currentTime.toLocaleTimeString()} ({timeOfDay})
          </text>
        </g>
      )}
    </g>
  );
};
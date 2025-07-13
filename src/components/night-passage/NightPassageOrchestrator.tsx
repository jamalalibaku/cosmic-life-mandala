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
  performanceMode?: 'high' | 'medium' | 'low';
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
  performanceMode = 'medium',
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

  // Update time based on performance mode
  useEffect(() => {
    const interval = performanceMode === 'high' ? 1000 : performanceMode === 'medium' ? 5000 : 30000;
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, interval);
    return () => clearInterval(timer);
  }, [performanceMode]);

  // Determine time of day for urban grounding
  const timeOfDay = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 9) return 'dawn';
    if (hour >= 9 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'dusk';
    return 'night';
  }, [currentTime]);

  // Performance-aware effect limitations
  const shouldShowEffect = useMemo(() => ({
    midnightArc: performanceMode !== 'low',
    emotionalClimax: performanceMode === 'high',
    gradientPulse: performanceMode !== 'low',
    urbanGrounding: true // Always show base layer
  }), [performanceMode]);

  // Check for midnight burst trigger (only in high performance mode)
  useEffect(() => {
    if (performanceMode !== 'high') return;
    
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
  }, [currentTime, performanceMode]);

  // Monitor emotional intensity for climax trigger (only in high performance mode)
  useEffect(() => {
    if (performanceMode !== 'high') return;
    
    if (emotionalData && emotionalData.intensity > 0.8) { // Higher threshold for performance
      setActiveEffects(prev => ({ ...prev, emotionalClimax: true }));
      
      // Reset after 3 seconds (shorter duration)
      setTimeout(() => {
        setActiveEffects(prev => ({ ...prev, emotionalClimax: false }));
      }, 3000);
    }
  }, [emotionalData, performanceMode]);

  // Monitor insight intensity for gradient pulse (performance-aware)
  useEffect(() => {
    if (performanceMode === 'low') return;
    
    if (insightData && insightData.intensity > 0.7) { // Higher threshold
      setActiveEffects(prev => ({ ...prev, gradientPulse: true }));
      
      // Reset after 4 seconds (shorter duration)
      setTimeout(() => {
        setActiveEffects(prev => ({ ...prev, gradientPulse: false }));
      }, 4000);
    }
  }, [insightData, performanceMode]);

  // Auto-trigger gradient pulse for seasonal changes (performance-aware)
  useEffect(() => {
    if (performanceMode === 'low') return;
    
    const interval = performanceMode === 'high' ? 20 * 60 * 1000 : 60 * 60 * 1000; // 20min or 1hr
    const seasonalTimer = setInterval(() => {
      setActiveEffects(prev => ({ ...prev, gradientPulse: true }));
      
      setTimeout(() => {
        setActiveEffects(prev => ({ ...prev, gradientPulse: false }));
      }, 3000);
    }, interval);

    return () => clearInterval(seasonalTimer);
  }, [performanceMode]);

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
      {shouldShowEffect.gradientPulse && (
        <GradientPulse
          centerX={centerX}
          centerY={centerY}
          maxRadius={radius + 80}
          type={insightData?.type || 'seasonal'}
          intensity={Math.min(insightData?.intensity || 0.4, 0.6)} // Capped intensity
          theme={theme}
          isActive={activeEffects.gradientPulse}
          direction="outward"
        />
      )}

      {/* Emotional Climax - Vertical bursts */}
      {shouldShowEffect.emotionalClimax && (
        <EmotionalClimax
          centerX={centerX}
          centerY={centerY}
          intensity={Math.min(emotionalData?.intensity || 0.5, 0.7)} // Capped intensity
          emotion={emotionalData?.emotion || 'calm'}
          theme={theme}
          isActive={activeEffects.emotionalClimax}
        />
      )}

      {/* Midnight Arc Burst - Daily trail burst */}
      {shouldShowEffect.midnightArc && (
        <MidnightArcBurst
          centerX={centerX}
          centerY={centerY}
          radius={radius}
          theme={theme}
          isActive={activeEffects.midnightArc}
        />
      )}

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
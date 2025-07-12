/**
 * Enhanced Awareness Rhythm - Orchestrates all consciousness-responsive features
 * 
 * Purpose: Central coordination of emotional intelligence, memory patterns, and micro-interactions
 * Features: Unified rhythm system, depth awareness, magical transitions
 * Design: Creates coherent visual poetry across all mandala systems
 */

import { useState, useEffect, useCallback } from 'react';
import { useEmotionalIntelligence } from './useEmotionalIntelligence';
import { useMemoryPatterns } from './useMemoryPatterns';
import { useMicroInteractions } from './useMicroInteractions';
import { useSoundDesign } from './useSoundDesign';
import { useSeasonalAwareness } from './useSeasonalAwareness';

interface AwarenessRhythmState {
  globalDepth: number;
  magicalIntensity: number;
  breathingCycle: number;
  consciousnessFlow: number;
  awarenessPulse: number;
}

interface EnhancedAwarenessConfig {
  enableDepthLayers: boolean;
  enableMagicalEffects: boolean;
  enableRhythmicBreathing: boolean;
  enableConsciousnessFlow: boolean;
  maxConcurrentEffects: number;
}

export const useEnhancedAwarenessRhythm = (
  moodData: any[],
  lifeData: any[],
  config: Partial<EnhancedAwarenessConfig> = {}
) => {
  const {
    enableDepthLayers = true,
    enableMagicalEffects = true,
    enableRhythmicBreathing = true,
    enableConsciousnessFlow = true,
    maxConcurrentEffects = 5
  } = config;

  // Core awareness state
  const [rhythmState, setRhythmState] = useState<AwarenessRhythmState>({
    globalDepth: 0.5,
    magicalIntensity: 0.3,
    breathingCycle: 0,
    consciousnessFlow: 0,
    awarenessPulse: 0
  });

  // Integrate consciousness systems
  const { emotionalState, getBreathingParams, getMoodColors } = useEmotionalIntelligence(moodData);
  const { detectedPatterns, getMemoryEchoes } = useMemoryPatterns(lifeData);
  const { hoverState, getConnectionLines } = useMicroInteractions();
  const { playInsightSound, playConnectionSound } = useSoundDesign();
  const { currentPalette } = useSeasonalAwareness();

  // Master rhythm animation loop
  useEffect(() => {
    if (!enableRhythmicBreathing) return;

    let animationId: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) * 0.001;
      
      setRhythmState(prev => ({
        ...prev,
        breathingCycle: Math.sin(elapsed * 0.3) * 0.5 + 0.5,
        consciousnessFlow: Math.sin(elapsed * 0.1 + Math.PI/3) * 0.3 + 0.7,
        awarenessPulse: Math.sin(elapsed * 0.5 + Math.PI/6) * 0.2 + 0.8,
        globalDepth: 0.4 + emotionalState.currentMood.valence * 0.4,
        magicalIntensity: 0.2 + (detectedPatterns.length / 10) * 0.6
      }));

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [enableRhythmicBreathing, emotionalState.currentMood.valence, detectedPatterns.length]);

  // Generate depth and gloss effects for data points
  const getDepthEffects = useCallback((layerType: string, dataPoint: any) => {
    if (!enableDepthLayers) return {};

    const baseDepth = rhythmState.globalDepth;
    const emotionalBoost = emotionalState.currentMood.energy * 0.3;
    const magicalGlow = rhythmState.magicalIntensity;

    return {
      shadowDepth: (baseDepth + emotionalBoost) * 3,
      glossIntensity: magicalGlow * 0.8,
      reflectionOpacity: 0.4 + magicalGlow * 0.4,
      glowRadius: 4 + emotionalBoost * 6,
      floatHeight: Math.sin(rhythmState.awarenessPulse * Math.PI) * 2,
      
      // Layer-specific enhancements
      layerEffects: {
        weather: {
          shimmer: Math.sin(rhythmState.consciousnessFlow * Math.PI) * 0.3,
          transparency: 0.6 + rhythmState.breathingCycle * 0.2
        },
        mood: {
          intensity: emotionalState.currentMood.energy,
          colorShift: emotionalState.currentMood.valence * 20
        },
        mobility: {
          trailLength: baseDepth * 8,
          energyFlow: rhythmState.consciousnessFlow
        }
      }
    };
  }, [enableDepthLayers, rhythmState, emotionalState]);

  // Generate magical text effects for labels
  const getMagicalTextEffects = useCallback((text: string, layerType: string) => {
    if (!enableMagicalEffects) return { text, style: {} };

    const magicalLevel = rhythmState.magicalIntensity;
    const starryGlow = magicalLevel > 0.5;

    return {
      text: starryGlow ? `✦ ${text} ✦` : text,
      style: {
        filter: `drop-shadow(0 0 ${4 + magicalLevel * 4}px ${currentPalette.primary}60)`,
        textShadow: `0 0 ${6 + magicalLevel * 6}px ${currentPalette.primary}40`,
        opacity: 0.7 + magicalLevel * 0.3,
        letterSpacing: starryGlow ? '0.15em' : '0.05em',
        fontWeight: starryGlow ? '400' : '300'
      }
    };
  }, [enableMagicalEffects, rhythmState.magicalIntensity, currentPalette]);

  // Generate awareness-responsive breathing parameters
  const getAwarenessBreathing = useCallback(() => {
    const baseBreathing = getBreathingParams();
    const awarenessModifier = rhythmState.breathingCycle;
    
    return {
      ...baseBreathing,
      duration: baseBreathing.duration * (0.8 + awarenessModifier * 0.4),
      intensity: baseBreathing.intensity * (0.7 + rhythmState.awarenessPulse * 0.3),
      smoothness: rhythmState.consciousnessFlow,
      magicalPulse: rhythmState.magicalIntensity > 0.6
    };
  }, [getBreathingParams, rhythmState]);

  // Handle conscious interaction moments
  const triggerAwarenessEvent = useCallback((eventType: 'insight' | 'connection' | 'pattern', intensity: number = 0.5) => {
    // Boost magical intensity temporarily
    setRhythmState(prev => ({
      ...prev,
      magicalIntensity: Math.min(1, prev.magicalIntensity + intensity * 0.3)
    }));

    // Play corresponding sound
    switch (eventType) {
      case 'insight':
        playInsightSound(intensity);
        break;
      case 'connection':
        playConnectionSound(undefined, intensity);
        break;
      case 'pattern':
        // Pattern recognition sound
        playConnectionSound(undefined, intensity * 0.7);
        break;
    }

    // Decay magical intensity
    setTimeout(() => {
      setRhythmState(prev => ({
        ...prev,
        magicalIntensity: Math.max(0.2, prev.magicalIntensity - intensity * 0.2)
      }));
    }, 2000);
  }, [playInsightSound, playConnectionSound]);

  // Generate connection visualization data
  const getAwarenessConnections = useCallback(() => {
    const connections = getConnectionLines();
    const magicalLevel = rhythmState.magicalIntensity;
    
    return connections.map(connection => ({
      ...connection,
      opacity: connection.strength * (0.4 + magicalLevel * 0.4),
      glow: magicalLevel > 0.5,
      sparkles: magicalLevel > 0.7,
      flowSpeed: rhythmState.consciousnessFlow
    }));
  }, [getConnectionLines, rhythmState]);

  return {
    // State
    rhythmState,
    emotionalState,
    detectedPatterns,
    hoverState,
    
    // Enhanced effects
    getDepthEffects,
    getMagicalTextEffects,
    getAwarenessBreathing,
    getAwarenessConnections,
    
    // Event triggers
    triggerAwarenessEvent,
    
    // Integrated colors and palette
    moodColors: getMoodColors(),
    seasonalPalette: currentPalette,
    
    // Performance metrics
    performanceMetrics: {
      activeEffects: Object.values(rhythmState).filter(v => v > 0.5).length,
      systemLoad: rhythmState.magicalIntensity + rhythmState.consciousnessFlow,
      efficiencyRating: maxConcurrentEffects / 5
    }
  };
};
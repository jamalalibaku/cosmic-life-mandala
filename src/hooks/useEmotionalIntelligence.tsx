/**
 * Emotional Intelligence Hook - Mood-responsive visual dynamics
 */

import { useState, useEffect, useMemo } from 'react';

interface MoodData {
  emotion: string;
  valence: number; // -1 to 1 (negative to positive)
  energy: number;  // 0 to 1 (calm to energetic)
  stress?: number; // 0 to 1 (calm to stressed)
  timestamp: number;
}

interface EmotionalState {
  currentMood: MoodData;
  recentPattern: MoodData[];
  volatility: number; // How much mood changes over time
  baseline: { valence: number; energy: number };
  breathingIntensity: number;
  colorTemperature: number; // Cool to warm based on mood
}

export const useEmotionalIntelligence = (recentMoodData: MoodData[] = []) => {
  // Ensure recentMoodData is always an array
  const safeMoodData = Array.isArray(recentMoodData) ? recentMoodData : [];
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    currentMood: {
      emotion: 'calm',
      valence: 0.5,
      energy: 0.5,
      timestamp: Date.now()
    },
    recentPattern: [],
    volatility: 0,
    baseline: { valence: 0.5, energy: 0.5 },
    breathingIntensity: 1,
    colorTemperature: 0.5
  });

  // Calculate emotional metrics
  const emotionalMetrics = useMemo(() => {
    if (safeMoodData.length === 0) return emotionalState;

    const current = safeMoodData[safeMoodData.length - 1] || emotionalState.currentMood;
    const recent = safeMoodData.slice(-10); // Last 10 mood entries

    // Calculate volatility (how much mood fluctuates)
    let volatility = 0;
    if (recent.length > 1) {
      for (let i = 1; i < recent.length; i++) {
        const valenceDiff = Math.abs(recent[i].valence - recent[i-1].valence);
        const energyDiff = Math.abs(recent[i].energy - recent[i-1].energy);
        volatility += (valenceDiff + energyDiff) / 2;
      }
      volatility = volatility / (recent.length - 1);
    }

    // Calculate baseline (average mood over recent period)
    const baseline = recent.reduce(
      (acc, mood) => ({
        valence: acc.valence + mood.valence,
        energy: acc.energy + mood.energy
      }),
      { valence: 0, energy: 0 }
    );
    baseline.valence /= recent.length || 1;
    baseline.energy /= recent.length || 1;

    // Calculate breathing intensity based on stress and volatility
    const stress = current.stress || 0;
    const breathingIntensity = Math.min(2, 1 + stress + volatility);

    // Calculate color temperature (cool = sad/calm, warm = happy/energetic)
    const colorTemperature = (current.valence + current.energy) / 2;

    return {
      currentMood: current,
      recentPattern: recent,
      volatility,
      baseline,
      breathingIntensity,
      colorTemperature
    };
  }, [safeMoodData]);

  useEffect(() => {
    setEmotionalState(emotionalMetrics);
  }, [emotionalMetrics]);

  // Get breathing animation parameters
  const getBreathingParams = () => ({
    duration: Math.max(2, 4 - emotionalState.volatility * 2), // Faster when volatile
    intensity: emotionalState.breathingIntensity,
    erratic: emotionalState.volatility > 0.3 // Irregular breathing when stressed
  });

  // Get mood-influenced colors
  const getMoodColors = () => {
    const temp = emotionalState.colorTemperature;
    const stress = emotionalState.currentMood.stress || 0;
    
    return {
      primary: `hsl(${45 + temp * 180} ${60 + stress * 20}% ${50 + temp * 30}%)`,
      secondary: `hsl(${215 + temp * 90} ${40 + stress * 30}% ${40 + temp * 40}%)`,
      accent: `hsl(${300 - temp * 120} ${50 + stress * 25}% ${45 + temp * 35}%)`,
      background: `hsl(${220 + temp * 40} ${10 + stress * 15}% ${5 + temp * 10}%)`
    };
  };

  // Get visual intensity modifiers
  const getIntensityModifiers = () => ({
    pulseStrength: Math.max(0.5, emotionalState.volatility + emotionalState.currentMood.energy),
    glowIntensity: emotionalState.currentMood.valence * 0.8 + 0.2,
    movementSpeed: emotionalState.currentMood.energy * 0.7 + 0.3,
    complexity: Math.min(1, emotionalState.volatility + emotionalState.currentMood.energy)
  });

  return {
    emotionalState,
    getBreathingParams,
    getMoodColors,
    getIntensityModifiers,
    isStressed: emotionalState.currentMood.stress > 0.6,
    isVolatile: emotionalState.volatility > 0.4,
    isPositive: emotionalState.currentMood.valence > 0.6
  };
};
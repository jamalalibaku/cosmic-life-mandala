/**
 * Supernova Trigger Engine
 * Analyzes mood data for emotional peaks and triggers burst animations
 */

import { DataBlob } from '@/components/data-blob-ring';

export interface EmotionalState {
  valence: number; // -1 to 1 (negative to positive)
  energy: number;  // 0 to 1 (low to high energy)
  intensity: number; // 0 to 1 (overall emotional intensity)
}

export interface SupernovaTrigger {
  id?: number;
  shouldTrigger: boolean;
  intensity: number;
  emotionType: 'joy' | 'excitement' | 'stress' | 'breakthrough' | 'peak';
  color: string;
  position?: { x: number; y: number };
}

// Emotional thresholds for triggering supernovas
const THRESHOLDS = {
  joy: { valence: 0.8, energy: 0.7 },
  excitement: { valence: 0.6, energy: 0.9 },
  stress: { valence: -0.4, energy: 0.8 },
  breakthrough: { valence: 0.9, energy: 0.6 },
  peak: { valence: 0.7, energy: 0.8 }
};

// Convert mood data to emotional state
export const moodToEmotionalState = (moodData: DataBlob): EmotionalState => {
  // Map intensity (0-1) to emotional dimensions
  const intensity = moodData.intensity;
  
  // Create realistic valence/energy mapping
  // High intensity can be either very positive or very negative
  let valence: number;
  let energy: number;
  
  if (intensity > 0.8) {
    // High intensity - could be joy or stress
    const isPositive = Math.random() > 0.3; // 70% positive bias for high intensity
    valence = isPositive ? 0.6 + (intensity - 0.8) * 2 : -0.2 - (intensity - 0.8) * 1.5;
    energy = 0.7 + (intensity - 0.8) * 1.5;
  } else if (intensity > 0.6) {
    // Moderate-high intensity - generally positive
    valence = 0.3 + (intensity - 0.6) * 1.5;
    energy = 0.5 + (intensity - 0.6) * 1;
  } else if (intensity > 0.3) {
    // Moderate intensity - neutral to slightly positive
    valence = -0.1 + (intensity - 0.3) * 1.3;
    energy = 0.2 + (intensity - 0.3) * 1;
  } else {
    // Low intensity - generally low energy, neutral to negative
    valence = -0.3 + intensity * 1;
    energy = intensity * 0.7;
  }
  
  // Clamp values
  valence = Math.max(-1, Math.min(1, valence));
  energy = Math.max(0, Math.min(1, energy));
  
  return { valence, energy, intensity };
};

// Check if emotional state should trigger a supernova
export const checkSupernovaTrigger = (
  emotionalState: EmotionalState,
  dataPoint?: { x: number; y: number }
): SupernovaTrigger => {
  const { valence, energy, intensity } = emotionalState;
  
  // Check each emotion type
  for (const [emotionType, threshold] of Object.entries(THRESHOLDS)) {
    const meetsValence = emotionType === 'stress' 
      ? valence <= threshold.valence 
      : valence >= threshold.valence;
    
    const meetsEnergy = energy >= threshold.energy;
    
    if (meetsValence && meetsEnergy) {
      const burstIntensity = Math.min(1, (intensity + energy) / 2);
      
      return {
        shouldTrigger: true,
        intensity: burstIntensity,
        emotionType: emotionType as any,
        color: getEmotionColor(emotionType as any, valence, energy),
        position: dataPoint
      };
    }
  }
  
  return {
    shouldTrigger: false,
    intensity: 0,
    emotionType: 'joy',
    color: 'hsl(45, 90%, 65%)'
  };
};

// Get color based on emotion type and values
const getEmotionColor = (emotionType: string, valence: number, energy: number): string => {
  const baseColors = {
    joy: 'hsl(45, 90%, 65%)',           // Sunflower yellow
    excitement: 'hsl(15, 100%, 60%)',   // Vibrant orange
    stress: 'hsl(0, 85%, 55%)',         // Intense red
    breakthrough: 'hsl(120, 70%, 50%)', // Bright green
    peak: 'hsl(280, 80%, 60%)'          // Purple
  };
  
  // Modify saturation and lightness based on intensity
  const saturation = 70 + (energy * 25);
  const lightness = emotionType === 'stress' ? 40 + (valence + 1) * 15 : 50 + (valence * 20);
  
  return baseColors[emotionType as keyof typeof baseColors] || baseColors.joy;
};

// Batch analyze mood data for multiple potential triggers
export const analyzeMoodForSupernovas = (
  moodData: DataBlob[],
  layerRadius: number
): SupernovaTrigger[] => {
  const triggers: SupernovaTrigger[] = [];
  
  moodData.forEach((data, index) => {
    const emotionalState = moodToEmotionalState(data);
    
    // Calculate position on the mood layer circle
    const angle = (index / moodData.length) * 2 * Math.PI;
    const x = Math.cos(angle) * layerRadius;
    const y = Math.sin(angle) * layerRadius;
    
    const trigger = checkSupernovaTrigger(emotionalState, { x, y });
    
    if (trigger.shouldTrigger) {
      triggers.push({
        ...trigger,
        position: { x, y }
      });
    }
  });
  
  return triggers;
};
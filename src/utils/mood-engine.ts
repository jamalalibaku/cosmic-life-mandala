/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { goldenRatio, PHI } from './golden-ratio';

export interface MoodInfluence {
  moodType: 'calm' | 'tense' | 'joyful' | 'drained' | 'creative' | 'restless';
  intensity: number; // 0-1
  deformation: 'soft' | 'sharp' | 'fluid' | 'crystalline';
  primaryColor: string;
  secondaryColor: string;
  glyphSymbol: string;
  description: string;
}

export interface ContextualInputs {
  sleepQuality: number; // 0-1
  planDensity: number; // 0-1 (how busy the day is)
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  mobilityLevel: number; // 0-1
  timeOfDay?: number; // 0-24 hours
  socialConnections?: number; // 0-1
}

const moodTypes = {
  calm: {
    baseColor: 'hsl(240 40% 70%)',
    accentColor: 'hsl(260 50% 80%)',
    glyph: '🌙',
    description: 'peaceful and centered'
  },
  joyful: {
    baseColor: 'hsl(45 80% 65%)',
    accentColor: 'hsl(60 90% 75%)',
    glyph: '☀️',
    description: 'radiant and uplifted'
  },
  creative: {
    baseColor: 'hsl(280 70% 60%)',
    accentColor: 'hsl(300 80% 70%)',
    glyph: '💫',
    description: 'inspired and flowing'
  },
  tense: {
    baseColor: 'hsl(15 70% 55%)',
    accentColor: 'hsl(30 80% 65%)',
    glyph: '⚡',
    description: 'heightened and focused'
  },
  drained: {
    baseColor: 'hsl(200 30% 50%)',
    accentColor: 'hsl(220 40% 60%)',
    glyph: '🌀',
    description: 'low energy, seeking rest'
  },
  restless: {
    baseColor: 'hsl(120 50% 55%)',
    accentColor: 'hsl(140 60% 65%)',
    glyph: '🌪️',
    description: 'energetic but unfocused'
  }
};

/**
 * Calculate mood influence based on contextual life data
 * Uses weighted algorithms and golden ratio harmonics
 */
export const calculateMoodInfluence = (inputs: ContextualInputs): MoodInfluence => {
  const {
    sleepQuality,
    planDensity,
    weatherCondition,
    mobilityLevel,
    timeOfDay = 12,
    socialConnections = 0.5
  } = inputs;

  // Base mood calculation using weighted factors
  const sleepWeight = 0.4;
  const mobilityWeight = 0.3;
  const planWeight = 0.2;
  const weatherWeight = 0.1;

  // Weather influence mapping
  const weatherMoodMap = {
    sunny: { boost: 0.3, type: 'joyful' },
    cloudy: { boost: 0.1, type: 'calm' },
    rainy: { boost: -0.1, type: 'creative' },
    stormy: { boost: -0.2, type: 'restless' }
  };

  const weatherEffect = weatherMoodMap[weatherCondition];
  
  // Calculate base mood intensity
  let moodIntensity = (
    sleepQuality * sleepWeight +
    mobilityLevel * mobilityWeight +
    (1 - planDensity) * planWeight + // Less plans = more calm
    socialConnections * 0.1
  ) + weatherEffect.boost;

  // Normalize to 0-1 range
  moodIntensity = Math.max(0, Math.min(1, moodIntensity));

  // Time of day influence (circadian rhythms)
  const timeInfluence = Math.sin((timeOfDay / 24) * 2 * Math.PI) * 0.1;
  moodIntensity += timeInfluence;

  // Determine primary mood type based on input combinations
  let moodType: MoodInfluence['moodType'];
  let deformation: MoodInfluence['deformation'];

  if (sleepQuality > 0.7 && planDensity < 0.5) {
    moodType = 'calm';
    deformation = 'soft';
  } else if (mobilityLevel > 0.7 && sleepQuality > 0.6) {
    moodType = 'joyful';
    deformation = 'fluid';
  } else if (weatherCondition === 'rainy' && sleepQuality > 0.5) {
    moodType = 'creative';
    deformation = 'crystalline';
  } else if (planDensity > 0.8 || sleepQuality < 0.4) {
    moodType = 'tense';
    deformation = 'sharp';
  } else if (mobilityLevel < 0.3 && sleepQuality < 0.6) {
    moodType = 'drained';
    deformation = 'soft';
  } else {
    moodType = 'restless';
    deformation = 'fluid';
  }

  // Apply golden ratio harmonics to intensity
  const harmonicIntensity = moodIntensity * goldenRatio.breathingScale(Date.now());

  const moodConfig = moodTypes[moodType];

  return {
    moodType,
    intensity: Math.max(0.1, Math.min(1, harmonicIntensity)),
    deformation,
    primaryColor: moodConfig.baseColor,
    secondaryColor: moodConfig.accentColor,
    glyphSymbol: moodConfig.glyph,
    description: moodConfig.description
  };
};

/**
 * Calculate interaction strength between two data layers
 */
export const calculateLayerInteraction = (
  sourceLayer: string,
  targetLayer: string,
  sourceValue: number,
  targetValue: number
): number => {
  const interactionMatrix = {
    'sleep-mood': 0.8,
    'mood-mobility': 0.6,
    'weather-mood': 0.4,
    'mobility-mood': 0.7,
    'plans-mood': 0.5,
    'sleep-mobility': 0.3
  };

  const key = `${sourceLayer}-${targetLayer}`;
  const reverseKey = `${targetLayer}-${sourceLayer}`;
  
  const baseStrength = interactionMatrix[key] || interactionMatrix[reverseKey] || 0.2;
  
  // Interaction strength based on value differences and golden ratio
  const valueDifference = Math.abs(sourceValue - targetValue);
  const harmonicStrength = baseStrength * (1 - valueDifference / PHI);
  
  return Math.max(0.1, Math.min(1, harmonicStrength));
};

/**
 * Generate emotional flow patterns for tide lines
 */
export const generateEmotionalFlow = (
  fromAngle: number,
  toAngle: number,
  strength: number,
  time: number
): string => {
  // Create curved path using golden ratio curvature
  const angleDiff = toAngle - fromAngle;
  const midAngle = fromAngle + angleDiff / 2;
  
  // Control point distance based on interaction strength
  const controlDistance = strength * 50 * goldenRatio.larger(1);
  
  // Add gentle wave motion
  const waveOffset = Math.sin(time * 0.5) * 10 * strength;
  
  return `M ${fromAngle} Q ${midAngle + waveOffset} ${controlDistance} ${toAngle}`;
};

/**
 * Get mood glyph animation timing based on golden ratio
 */
export const getMoodGlyphTiming = (moodType: string, index: number): number => {
  const baseDelay = index * (1000 / PHI); // Golden ratio stagger
  const moodMultiplier = {
    calm: 1,
    joyful: 0.8,
    creative: 1.2,
    tense: 0.6,
    drained: 1.4,
    restless: 0.7
  };
  
  return baseDelay * (moodMultiplier[moodType] || 1);
};
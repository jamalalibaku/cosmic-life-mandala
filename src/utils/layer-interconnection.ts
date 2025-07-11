/**
 * [Phase: Digest / ZIP9-beta / Lap 3] Layer Interconnection Effects
 * Cross-layer visual relationships and data correlations
 * 
 * Purpose: Define how layers influence each other visually and behaviorally
 * Features: Mood-sleep, weather-mobility, sleep-breathing correlations
 */

export interface LayerEffect {
  sourceLayer: string;
  targetLayer: string;
  effect: string;
  intensity: number;
}

export interface LayerInterconnectionState {
  moodToSleepDimming: number; // 0-1, how much mood affects sleep visibility
  weatherToMobilityCloudiness: number; // 0-1, weather impact on mobility clarity
  sleepToBreathingAmplitude: number; // 0-2, sleep quality affects breathing scale
  systemGlowIntensity: number; // 0-1, overall radiance based on combined positivity
}

/**
 * Calculate mood-to-sleep visual dimming effect
 * Poor mood (valence < 0.3) dims sleep layer
 */
export const calculateMoodToSleepEffect = (moodValence: number): number => {
  if (moodValence < 0.3) {
    // Poor mood: dim sleep layer (0.3 -> 0.4 dimming, 0.0 -> 0.8 dimming)
    return 0.8 - (moodValence / 0.3) * 0.4;
  }
  return 0; // No dimming for neutral/positive mood
};

/**
 * Calculate weather-to-mobility cloudiness effect
 * Rainy/cloudy weather makes mobility ring less clear
 */
export const calculateWeatherToMobilityEffect = (weatherCondition: string, weatherIntensity: number): number => {
  const effectMap = {
    'rainy': 0.6,
    'cloudy': 0.3,
    'stormy': 0.8,
    'foggy': 0.5
  };
  
  const baseEffect = effectMap[weatherCondition as keyof typeof effectMap] || 0;
  return baseEffect * weatherIntensity;
};

/**
 * Calculate sleep-to-breathing amplitude effect
 * Good sleep quality increases breathing/pulse amplitude
 */
export const calculateSleepToBreathingEffect = (sleepQuality: number): number => {
  // Quality 0.0-1.0 maps to breathing amplitude 0.8-1.4
  return 0.8 + sleepQuality * 0.6;
};

/**
 * Calculate system-wide glow based on combined positivity
 * High mood + good sleep + sunny weather = system glow
 */
export const calculateSystemGlow = (
  moodValence: number, 
  sleepQuality: number, 
  weatherCondition: string
): number => {
  const weatherPositivity = {
    'sunny': 1.0,
    'clear': 0.9,
    'partly_cloudy': 0.6,
    'cloudy': 0.3,
    'rainy': 0.1,
    'stormy': 0.0
  };
  
  const weatherScore = weatherPositivity[weatherCondition as keyof typeof weatherPositivity] || 0.5;
  
  // Combine all factors (weighted average)
  const combinedPositivity = (moodValence * 0.4) + (sleepQuality * 0.4) + (weatherScore * 0.2);
  
  // Only glow when combined positivity is above 0.7
  return combinedPositivity > 0.7 ? (combinedPositivity - 0.7) / 0.3 : 0;
};

/**
 * Apply mood effect to sleep layer styling
 */
export const applyMoodToSleepEffect = (moodValence: number) => {
  const dimmingFactor = calculateMoodToSleepEffect(moodValence);
  
  return {
    opacity: 1 - dimmingFactor * 0.5, // Reduce opacity
    saturation: 1 - dimmingFactor * 0.3, // Reduce color saturation
    scale: 1 - dimmingFactor * 0.1 // Slightly shrink elements
  };
};

/**
 * Apply weather effect to mobility layer styling
 */
export const applyWeatherToMobilityEffect = (weatherCondition: string, weatherIntensity: number) => {
  const cloudinessFactor = calculateWeatherToMobilityEffect(weatherCondition, weatherIntensity);
  
  return {
    blur: cloudinessFactor * 2, // Add blur filter
    opacity: 1 - cloudinessFactor * 0.4, // Reduce visibility
    strokeDashArray: cloudinessFactor > 0.5 ? "2,3" : "none" // Make dashed in bad weather
  };
};

/**
 * Apply sleep effect to breathing/core styling
 */
export const applySleepToBreathingEffect = (sleepQuality: number) => {
  const amplitudeFactor = calculateSleepToBreathingEffect(sleepQuality);
  
  return {
    scale: amplitudeFactor,
    duration: sleepQuality > 0.7 ? 5 : 7, // Faster breathing when well-rested
    glowIntensity: sleepQuality * 0.5 // More glow with better sleep
  };
};

/**
 * Get aggregated layer data for a specific layer type
 */
export const getLayerAggregateData = (timeSlices: any[], layerType: string) => {
  const layerData = timeSlices
    .filter(slice => slice.data[layerType])
    .map(slice => slice.data[layerType]);
    
  if (layerData.length === 0) return null;
  
  // Calculate averages for key metrics
  switch (layerType) {
    case 'mood':
      return {
        averageValence: layerData.reduce((sum, item) => sum + item.valence, 0) / layerData.length,
        averageEnergy: layerData.reduce((sum, item) => sum + item.energy, 0) / layerData.length,
        dominantEmotion: layerData[0].emotion // Use most recent for simplicity
      };
      
    case 'sleep':
      return {
        averageQuality: layerData.reduce((sum, item) => sum + item.quality, 0) / layerData.length,
        averageDuration: layerData.reduce((sum, item) => sum + item.duration, 0) / layerData.length,
        averageDeepSleepRatio: layerData.reduce((sum, item) => sum + item.deepSleepRatio, 0) / layerData.length
      };
      
    case 'weather':
      return {
        dominantCondition: layerData[0].condition, // Use most recent
        averageTemperature: layerData.reduce((sum, item) => sum + item.temperature, 0) / layerData.length,
        averageIntensity: layerData.reduce((sum, item) => sum + item.intensity, 0) / layerData.length
      };
      
    default:
      return layerData[0];
  }
};
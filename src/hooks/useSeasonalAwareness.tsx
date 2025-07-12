/**
 * Seasonal Awareness Hook - Dynamic palette influenced by weather and seasons
 */

import { useState, useEffect, useMemo } from 'react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  season: 'spring' | 'summer' | 'fall' | 'winter';
}

interface SeasonalPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  atmosphere: string;
  temperature: 'warm' | 'cool' | 'neutral';
  mood: 'energetic' | 'calm' | 'cozy' | 'fresh';
}

export const useSeasonalAwareness = (currentWeather?: WeatherData) => {
  const [currentPalette, setCurrentPalette] = useState<SeasonalPalette>(getDefaultPalette());

  // Generate dynamic palette based on weather and season
  const seasonalPalette = useMemo(() => {
    if (!currentWeather) return getDefaultPalette();

    const basePalette = getSeasonBasePalette(currentWeather.season);
    const weatherModified = applyWeatherModifications(basePalette, currentWeather);
    const timeAdjusted = applyTimeOfDayAdjustments(weatherModified);

    return timeAdjusted;
  }, [currentWeather]);

  useEffect(() => {
    setCurrentPalette(seasonalPalette);
  }, [seasonalPalette]);

  // Get CSS custom properties for the current palette
  const getCSSVariables = () => ({
    '--color-primary': currentPalette.primary,
    '--color-secondary': currentPalette.secondary,
    '--color-accent': currentPalette.accent,
    '--color-background': currentPalette.background,
    '--color-atmosphere': currentPalette.atmosphere,
    '--temperature-bias': currentPalette.temperature === 'warm' ? '15deg' : 
                          currentPalette.temperature === 'cool' ? '-15deg' : '0deg'
  });

  // Get animation parameters influenced by season
  const getSeasonalAnimations = () => {
    const season = currentWeather?.season || 'spring';
    
    return {
      spring: {
        flowSpeed: 1.2,
        gentleness: 0.8,
        growth: true,
        bloomEffect: true
      },
      summer: {
        flowSpeed: 1.5,
        gentleness: 0.6,
        intensity: 1.3,
        heatShimmer: true
      },
      fall: {
        flowSpeed: 0.8,
        gentleness: 0.9,
        driftEffect: true,
        goldenHour: true
      },
      winter: {
        flowSpeed: 0.6,
        gentleness: 1.0,
        crystalline: true,
        stillness: true
      }
    }[season];
  };

  // Get weather-specific visual effects
  const getWeatherEffects = () => {
    if (!currentWeather) return {};

    const effects: Record<string, any> = {};

    switch (currentWeather.condition.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        effects.ripples = true;
        effects.waterDrops = true;
        effects.softening = 0.3;
        break;
      
      case 'snow':
        effects.crystallization = true;
        effects.gentlefall = true;
        effects.purity = 0.8;
        break;
      
      case 'fog':
      case 'mist':
        effects.ethereal = true;
        effects.softFocus = 0.4;
        effects.mysterious = true;
        break;
      
      case 'sunny':
      case 'clear':
        effects.brilliance = true;
        effects.sharpness = 1.2;
        effects.vitality = 1.0;
        break;
      
      case 'cloudy':
      case 'overcast':
        effects.softness = 0.6;
        effects.contemplative = true;
        effects.muted = 0.3;
        break;
      
      case 'storm':
      case 'thunderstorm':
        effects.dramatic = true;
        effects.electrical = true;
        effects.intensity = 1.5;
        break;
    }

    return effects;
  };

  return {
    currentPalette,
    getCSSVariables,
    getSeasonalAnimations,
    getWeatherEffects,
    isWarmSeason: ['spring', 'summer'].includes(currentWeather?.season || 'spring'),
    isColdSeason: ['fall', 'winter'].includes(currentWeather?.season || 'spring'),
    temperatureBias: currentPalette.temperature
  };
};

// Helper functions
function getDefaultPalette(): SeasonalPalette {
  return {
    primary: 'hsl(45 70% 65%)',
    secondary: 'hsl(215 25% 45%)',
    accent: 'hsl(290 50% 60%)',
    background: 'hsl(220 15% 8%)',
    atmosphere: 'hsl(220 20% 15%)',
    temperature: 'neutral',
    mood: 'calm'
  };
}

function getSeasonBasePalette(season: 'spring' | 'summer' | 'fall' | 'winter'): SeasonalPalette {
  const palettes = {
    spring: {
      primary: 'hsl(120 60% 70%)',     // Fresh green
      secondary: 'hsl(200 50% 60%)',   // Sky blue
      accent: 'hsl(300 70% 75%)',      // Blossom pink
      background: 'hsl(180 20% 12%)',  // Soft teal-gray
      atmosphere: 'hsl(140 30% 20%)',  // Living green
      temperature: 'cool' as const,
      mood: 'fresh' as const
    },
    
    summer: {
      primary: 'hsl(45 85% 75%)',      // Golden sun
      secondary: 'hsl(35 80% 65%)',    // Warm amber
      accent: 'hsl(15 90% 70%)',       // Sunset orange
      background: 'hsl(25 25% 10%)',   // Warm brown
      atmosphere: 'hsl(45 40% 25%)',   // Golden haze
      temperature: 'warm' as const,
      mood: 'energetic' as const
    },
    
    fall: {
      primary: 'hsl(25 75% 65%)',      // Autumn orange
      secondary: 'hsl(45 60% 55%)',    // Golden yellow
      accent: 'hsl(5 70% 60%)',        // Deep red
      background: 'hsl(15 30% 8%)',    // Rich brown
      atmosphere: 'hsl(35 35% 18%)',   // Rustic amber
      temperature: 'warm' as const,
      mood: 'cozy' as const
    },
    
    winter: {
      primary: 'hsl(210 40% 70%)',     // Ice blue
      secondary: 'hsl(240 30% 60%)',   // Cool purple
      accent: 'hsl(180 50% 75%)',      // Frost cyan
      background: 'hsl(220 20% 6%)',   // Deep winter
      atmosphere: 'hsl(200 25% 15%)',  // Cold mist
      temperature: 'cool' as const,
      mood: 'calm' as const
    }
  };

  return palettes[season];
}

function applyWeatherModifications(basePalette: SeasonalPalette, weather: WeatherData): SeasonalPalette {
  const modified = { ...basePalette };

  // Temperature influence
  const tempFactor = (weather.temperature - 15) / 30; // Normalize around 15°C
  
  if (tempFactor > 0) {
    // Warmer = more vibrant, warmer hues
    modified.primary = adjustHue(modified.primary, tempFactor * 15);
    modified.accent = adjustSaturation(modified.accent, tempFactor * 20);
  } else {
    // Cooler = more muted, cooler hues
    modified.primary = adjustHue(modified.primary, tempFactor * 20);
    modified.secondary = adjustLightness(modified.secondary, tempFactor * 10);
  }

  // Humidity influence
  const humidityFactor = weather.humidity / 100;
  if (humidityFactor > 0.7) {
    // High humidity = softer, more diffused colors
    modified.background = adjustSaturation(modified.background, -humidityFactor * 15);
    modified.atmosphere = adjustLightness(modified.atmosphere, humidityFactor * 8);
  }

  // Weather condition influence
  switch (weather.condition.toLowerCase()) {
    case 'rain':
      modified.primary = adjustSaturation(modified.primary, -20);
      modified.atmosphere = adjustLightness(modified.atmosphere, -15);
      break;
    
    case 'sunny':
      modified.primary = adjustSaturation(modified.primary, 25);
      modified.accent = adjustLightness(modified.accent, 10);
      break;
    
    case 'snow':
      modified.primary = adjustSaturation(modified.primary, -30);
      modified.background = adjustLightness(modified.background, 20);
      break;
    
    case 'fog':
      modified.primary = adjustSaturation(modified.primary, -40);
      modified.secondary = adjustSaturation(modified.secondary, -30);
      break;
  }

  return modified;
}

function applyTimeOfDayAdjustments(palette: SeasonalPalette): SeasonalPalette {
  const hour = new Date().getHours();
  const adjusted = { ...palette };

  if (hour >= 6 && hour < 9) {
    // Dawn
    adjusted.accent = adjustHue(adjusted.accent, -20); // More pink/orange
    adjusted.atmosphere = adjustLightness(adjusted.atmosphere, 15);
  } else if (hour >= 18 && hour < 21) {
    // Dusk
    adjusted.primary = adjustHue(adjusted.primary, 15); // More golden
    adjusted.accent = adjustSaturation(adjusted.accent, 20);
  } else if (hour >= 21 || hour < 6) {
    // Night
    adjusted.primary = adjustLightness(adjusted.primary, -25);
    adjusted.background = adjustLightness(adjusted.background, -20);
    adjusted.atmosphere = adjustSaturation(adjusted.atmosphere, -40);
  }

  return adjusted;
}

// Color manipulation helpers
function adjustHue(hslString: string, adjustment: number): string {
  const match = hslString.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (!match) return hslString;
  
  const [, h, s, l] = match;
  const newHue = (parseInt(h) + adjustment + 360) % 360;
  return `hsl(${newHue} ${s}% ${l}%)`;
}

function adjustSaturation(hslString: string, adjustment: number): string {
  const match = hslString.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (!match) return hslString;
  
  const [, h, s, l] = match;
  const newSat = Math.max(0, Math.min(100, parseInt(s) + adjustment));
  return `hsl(${h} ${newSat}% ${l}%)`;
}

function adjustLightness(hslString: string, adjustment: number): string {
  const match = hslString.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (!match) return hslString;
  
  const [, h, s, l] = match;
  const newLight = Math.max(0, Math.min(100, parseInt(l) + adjustment));
  return `hsl(${h} ${s}% ${newLight}%)`;
}
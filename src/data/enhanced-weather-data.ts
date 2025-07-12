/**
 * Enhanced Weather Data from CSV with visualization processing
 */

export interface EnhancedWeatherData {
  date: string;
  temperatureHigh: number;
  temperatureLow: number;
  precipitationPercent: number;
  windSpeedKmh: number;
  cloudinessPercent: number;
  // Computed visualization properties
  temperatureGradient: string;
  precipitationOpacity: number;
  windIntensity: number;
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'windy';
}

// Helper functions for visualization
export const getTemperatureGradient = (tempHigh: number, tempLow: number): string => {
  // Cool blue to warm orange based on temperature range
  const coolHue = Math.max(180, 240 - tempLow * 4); // Bluer for colder temps
  const warmHue = Math.max(0, 60 - tempHigh * 1.5); // More orange for warmer temps
  
  return `linear-gradient(135deg, hsl(${coolHue} 60% ${60 + tempLow}%) 0%, hsl(${warmHue} 70% ${65 + tempHigh}%) 100%)`;
};

// Real weather data from J
export const enhancedWeatherData: EnhancedWeatherData[] = [
  {
    date: '2025-07-12',
    temperatureHigh: 18,
    temperatureLow: 15,
    precipitationPercent: 94,
    windSpeedKmh: 30,
    cloudinessPercent: 90,
    temperatureGradient: getTemperatureGradient(18, 15),
    precipitationOpacity: 0.94,
    windIntensity: 1.0,
    weatherCondition: 'rainy'
  },
  {
    date: '2025-07-13',
    temperatureHigh: 22,
    temperatureLow: 14,
    precipitationPercent: 30,
    windSpeedKmh: 16,
    cloudinessPercent: 60,
    temperatureGradient: getTemperatureGradient(22, 14),
    precipitationOpacity: 0.3,
    windIntensity: 0.53,
    weatherCondition: 'cloudy'
  },
  {
    date: '2025-07-14',
    temperatureHigh: 26,
    temperatureLow: 16,
    precipitationPercent: 20,
    windSpeedKmh: 15,
    cloudinessPercent: 70,
    temperatureGradient: getTemperatureGradient(26, 16),
    precipitationOpacity: 0.2,
    windIntensity: 0.5,
    weatherCondition: 'cloudy'
  },
  {
    date: '2025-07-15',
    temperatureHigh: 24,
    temperatureLow: 14,
    precipitationPercent: 79,
    windSpeedKmh: 17,
    cloudinessPercent: 85,
    temperatureGradient: getTemperatureGradient(24, 14),
    precipitationOpacity: 0.79,
    windIntensity: 0.57,
    weatherCondition: 'rainy'
  },
  {
    date: '2025-07-16',
    temperatureHigh: 23,
    temperatureLow: 15,
    precipitationPercent: 75,
    windSpeedKmh: 17,
    cloudinessPercent: 90,
    temperatureGradient: getTemperatureGradient(23, 15),
    precipitationOpacity: 0.75,
    windIntensity: 0.57,
    weatherCondition: 'rainy'
  },
  {
    date: '2025-07-17',
    temperatureHigh: 23,
    temperatureLow: 14,
    precipitationPercent: 73,
    windSpeedKmh: 20,
    cloudinessPercent: 85,
    temperatureGradient: getTemperatureGradient(23, 14),
    precipitationOpacity: 0.73,
    windIntensity: 0.67,
    weatherCondition: 'rainy'
  },
  {
    date: '2025-07-18',
    temperatureHigh: 25,
    temperatureLow: 16,
    precipitationPercent: 40,
    windSpeedKmh: 19,
    cloudinessPercent: 80,
    temperatureGradient: getTemperatureGradient(25, 16),
    precipitationOpacity: 0.4,
    windIntensity: 0.63,
    weatherCondition: 'cloudy'
  }
];

// Additional helper functions

export const getWindMotionPattern = (windSpeed: number): {
  blur: number;
  flow: number;
  opacity: number;
} => {
  const intensity = Math.min(windSpeed / 30, 1); // Normalize to 0-1
  
  return {
    blur: intensity * 3, // 0-3px blur for motion
    flow: intensity * 10, // 0-10px flow offset
    opacity: 0.3 + (intensity * 0.5) // 0.3-0.8 opacity
  };
};

export const getCloudPattern = (cloudiness: number): {
  density: number;
  opacity: number;
  pattern: 'scattered' | 'partial' | 'overcast' | 'clear';
} => {
  if (cloudiness < 25) return { density: 0.2, opacity: 0.3, pattern: 'clear' };
  if (cloudiness < 50) return { density: 0.4, opacity: 0.5, pattern: 'scattered' };
  if (cloudiness < 75) return { density: 0.6, opacity: 0.7, pattern: 'partial' };
  return { density: 0.9, opacity: 0.9, pattern: 'overcast' };
};
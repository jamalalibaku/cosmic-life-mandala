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

// CSV data processed for visualization
export const enhancedWeatherData: EnhancedWeatherData[] = [
  {
    date: '2025-06-01',
    temperatureHigh: 23.0,
    temperatureLow: 13.5,
    precipitationPercent: 20,
    windSpeedKmh: 18.0,
    cloudinessPercent: 43,
    temperatureGradient: 'linear-gradient(135deg, hsl(210 60% 65%) 0%, hsl(30 70% 70%) 100%)',
    precipitationOpacity: 0.2,
    windIntensity: 0.6,
    weatherCondition: 'cloudy'
  },
  {
    date: '2025-06-02',
    temperatureHigh: 20.3,
    temperatureLow: 11.8,
    precipitationPercent: 0,
    windSpeedKmh: 19.7,
    cloudinessPercent: 53,
    temperatureGradient: 'linear-gradient(135deg, hsl(220 65% 60%) 0%, hsl(35 65% 65%) 100%)',
    precipitationOpacity: 0.0,
    windIntensity: 0.65,
    weatherCondition: 'cloudy'
  },
  {
    date: '2025-06-03',
    temperatureHigh: 21.8,
    temperatureLow: 13.1,
    precipitationPercent: 0,
    windSpeedKmh: 9.3,
    cloudinessPercent: 88,
    temperatureGradient: 'linear-gradient(135deg, hsl(215 60% 62%) 0%, hsl(32 68% 68%) 100%)',
    precipitationOpacity: 0.0,
    windIntensity: 0.3,
    weatherCondition: 'cloudy'
  },
  {
    date: '2025-06-04',
    temperatureHigh: 22.2,
    temperatureLow: 15.1,
    precipitationPercent: 0,
    windSpeedKmh: 7.2,
    cloudinessPercent: 22,
    temperatureGradient: 'linear-gradient(135deg, hsl(210 55% 65%) 0%, hsl(28 75% 72%) 100%)',
    precipitationOpacity: 0.0,
    windIntensity: 0.25,
    weatherCondition: 'sunny'
  },
  {
    date: '2025-06-05',
    temperatureHigh: 23.5,
    temperatureLow: 16.7,
    precipitationPercent: 30,
    windSpeedKmh: 19.6,
    cloudinessPercent: 85,
    temperatureGradient: 'linear-gradient(135deg, hsl(205 60% 67%) 0%, hsl(25 72% 75%) 100%)',
    precipitationOpacity: 0.3,
    windIntensity: 0.65,
    weatherCondition: 'rainy'
  },
  {
    date: '2025-06-06',
    temperatureHigh: 25.8,
    temperatureLow: 16.8,
    precipitationPercent: 100,
    windSpeedKmh: 8.8,
    cloudinessPercent: 77,
    temperatureGradient: 'linear-gradient(135deg, hsl(200 65% 70%) 0%, hsl(20 78% 78%) 100%)',
    precipitationOpacity: 1.0,
    windIntensity: 0.3,
    weatherCondition: 'rainy'
  },
  {
    date: '2025-06-07',
    temperatureHigh: 26.6,
    temperatureLow: 18.9,
    precipitationPercent: 100,
    windSpeedKmh: 17.3,
    cloudinessPercent: 56,
    temperatureGradient: 'linear-gradient(135deg, hsl(195 60% 72%) 0%, hsl(15 80% 80%) 100%)',
    precipitationOpacity: 1.0,
    windIntensity: 0.55,
    weatherCondition: 'rainy'
  },
  {
    date: '2025-06-08',
    temperatureHigh: 25.3,
    temperatureLow: 18.1,
    precipitationPercent: 0,
    windSpeedKmh: 16.7,
    cloudinessPercent: 73,
    temperatureGradient: 'linear-gradient(135deg, hsl(200 65% 70%) 0%, hsl(22 75% 77%) 100%)',
    precipitationOpacity: 0.0,
    windIntensity: 0.55,
    weatherCondition: 'cloudy'
  },
  {
    date: '2025-06-09',
    temperatureHigh: 21.8,
    temperatureLow: 14.6,
    precipitationPercent: 20,
    windSpeedKmh: 15.2,
    cloudinessPercent: 66,
    temperatureGradient: 'linear-gradient(135deg, hsl(215 60% 62%) 0%, hsl(32 68% 68%) 100%)',
    precipitationOpacity: 0.2,
    windIntensity: 0.5,
    weatherCondition: 'cloudy'
  },
  {
    date: '2025-06-10',
    temperatureHigh: 23.8,
    temperatureLow: 15.6,
    precipitationPercent: 80,
    windSpeedKmh: 14.7,
    cloudinessPercent: 29,
    temperatureGradient: 'linear-gradient(135deg, hsl(208 58% 66%) 0%, hsl(26 73% 73%) 100%)',
    precipitationOpacity: 0.8,
    windIntensity: 0.48,
    weatherCondition: 'rainy'
  }
];

// Helper functions for visualization
export const getTemperatureGradient = (tempHigh: number, tempLow: number): string => {
  // Cool blue to warm orange based on temperature range
  const coolHue = Math.max(180, 240 - tempLow * 4); // Bluer for colder temps
  const warmHue = Math.max(0, 60 - tempHigh * 1.5); // More orange for warmer temps
  
  return `linear-gradient(135deg, hsl(${coolHue} 60% ${60 + tempLow}%) 0%, hsl(${warmHue} 70% ${65 + tempHigh}%) 100%)`;
};

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
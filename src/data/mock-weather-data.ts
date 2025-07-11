import { WeatherSegment } from '../components/weather-sunburst-ring';

// Mock Berlin July weather data
export const mockWeatherData = [
  {
    timestamp: "2025-07-01T12:00:00+02:00",
    condition: "sunny",
    temperature: 24.1,
    intensity: 0.2,
    humidity: 46,
    windSpeed: 13.7,
    layerType: "weather"
  },
  {
    timestamp: "2025-07-02T12:00:00+02:00",
    condition: "partly_cloudy",
    temperature: 21.3,
    intensity: 0.4,
    humidity: 52,
    windSpeed: 15.4,
    layerType: "weather"
  },
  {
    timestamp: "2025-07-03T12:00:00+02:00",
    condition: "rainy",
    temperature: 18.6,
    intensity: 0.8,
    humidity: 72,
    windSpeed: 16.2,
    layerType: "weather"
  },
  {
    timestamp: "2025-07-04T12:00:00+02:00",
    condition: "cloudy",
    temperature: 19.8,
    intensity: 0.6,
    humidity: 68,
    windSpeed: 12.3,
    layerType: "weather"
  },
  {
    timestamp: "2025-07-05T12:00:00+02:00",
    condition: "sunny",
    temperature: 26.4,
    intensity: 0.3,
    humidity: 42,
    windSpeed: 8.9,
    layerType: "weather"
  },
  {
    timestamp: "2025-07-06T12:00:00+02:00",
    condition: "partly_cloudy",
    temperature: 23.7,
    intensity: 0.5,
    humidity: 58,
    windSpeed: 14.1,
    layerType: "weather"
  },
  {
    timestamp: "2025-07-07T12:00:00+02:00",
    condition: "rainy",
    temperature: 17.2,
    intensity: 0.9,
    humidity: 78,
    windSpeed: 18.6,
    layerType: "weather"
  },
  {
    timestamp: "2025-07-08T12:00:00+02:00",
    condition: "stormy",
    temperature: 16.5,
    intensity: 1.0,
    humidity: 85,
    windSpeed: 24.3,
    layerType: "weather"
  },
  {
    timestamp: "2025-07-09T12:00:00+02:00",
    condition: "partly_cloudy",
    temperature: 20.9,
    intensity: 0.4,
    humidity: 61,
    windSpeed: 11.7,
    layerType: "weather"
  },
  {
    timestamp: "2025-07-10T12:00:00+02:00",
    condition: "sunny",
    temperature: 25.8,
    intensity: 0.2,
    humidity: 48,
    windSpeed: 9.4,
    layerType: "weather"
  },
  {
    timestamp: "2025-07-11T12:00:00+02:00",
    condition: "sunny",
    temperature: 27.1,
    intensity: 0.1,
    humidity: 44,
    windSpeed: 7.8,
    layerType: "weather"
  }
];

// Mock weather data generators for testing
export const generateMockWeatherData = (scenario: 'sunny-day' | 'mixed-weather' | 'winter-night'): WeatherSegment[] => {
  switch (scenario) {
    case 'sunny-day':
      return Array.from({ length: 24 }, (_, hour) => ({
        hour,
        condition: hour >= 6 && hour <= 18 ? 'sunny' : 'clear-night',
        temperature: hour >= 6 && hour <= 18 
          ? Math.round(15 + (hour - 6) * 1.5 + Math.random() * 5)
          : Math.round(8 + Math.random() * 4)
      }));
    
    case 'mixed-weather':
      return Array.from({ length: 24 }, (_, hour) => {
        let condition: WeatherSegment['condition'];
        let temperature: number;
        
        if (hour >= 0 && hour < 6) {
          condition = 'clear-night';
          temperature = Math.round(8 + Math.random() * 3);
        } else if (hour >= 6 && hour < 9) {
          condition = 'cloudy';
          temperature = Math.round(12 + Math.random() * 3);
        } else if (hour >= 9 && hour < 12) {
          condition = 'sunny';
          temperature = Math.round(18 + Math.random() * 4);
        } else if (hour >= 12 && hour < 15) {
          condition = 'rainy';
          temperature = Math.round(16 + Math.random() * 3);
        } else if (hour >= 15 && hour < 18) {
          condition = 'storm';
          temperature = Math.round(14 + Math.random() * 3);
        } else if (hour >= 18 && hour < 21) {
          condition = 'cloudy';
          temperature = Math.round(13 + Math.random() * 3);
        } else {
          condition = 'clear-night';
          temperature = Math.round(10 + Math.random() * 3);
        }
        
        return { hour, condition, temperature };
      });
    
    case 'winter-night':
      return Array.from({ length: 24 }, (_, hour) => ({
        hour,
        condition: hour >= 8 && hour <= 16 ? 'snowy' : 'clear-night',
        temperature: Math.round(-5 + Math.random() * 8)
      }));
    
    default:
      return [];
  }
};

// Current day mock data
export const mockWeatherToday: WeatherSegment[] = generateMockWeatherData('mixed-weather');
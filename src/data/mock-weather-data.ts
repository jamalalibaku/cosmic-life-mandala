import { WeatherSegment } from '../components/weather-sunburst-ring';

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
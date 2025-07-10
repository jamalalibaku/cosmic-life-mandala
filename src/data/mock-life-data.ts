import { DataBlob } from '../components/data-blob-ring';

// Mock life data generators
export const generateMockLifeData = (type: 'mobility' | 'mood' | 'sleep'): DataBlob[] => {
  switch (type) {
    case 'mobility':
      return Array.from({ length: 24 }, (_, hour) => {
        let intensity: number;
        let duration: number;
        
        if (hour >= 6 && hour <= 22) {
          // Active hours
          intensity = Math.random() * 0.8 + 0.2;
          duration = Math.random() * 0.6 + 0.4;
        } else {
          // Rest hours
          intensity = Math.random() * 0.3;
          duration = Math.random() * 0.4;
        }
        
        return {
          hour,
          type: 'mobility',
          intensity,
          duration,
          value: Math.round(intensity * 100)
        };
      });
    
    case 'mood':
      return Array.from({ length: 24 }, (_, hour) => {
        // Mood varies throughout the day with natural patterns
        let baseIntensity: number;
        
        if (hour >= 8 && hour <= 12) {
          // Morning energy
          baseIntensity = 0.7 + Math.random() * 0.3;
        } else if (hour >= 13 && hour <= 17) {
          // Afternoon dip and recovery
          baseIntensity = 0.5 + Math.random() * 0.4;
        } else if (hour >= 18 && hour <= 21) {
          // Evening social time
          baseIntensity = 0.6 + Math.random() * 0.4;
        } else {
          // Night and early morning
          baseIntensity = 0.3 + Math.random() * 0.4;
        }
        
        return {
          hour,
          type: 'mood',
          intensity: Math.min(1, baseIntensity),
          duration: 0.8 + Math.random() * 0.2,
          value: Math.round(baseIntensity * 10)
        };
      });
    
    case 'sleep':
      return Array.from({ length: 24 }, (_, hour) => {
        let intensity: number;
        let duration: number;
        
        if (hour >= 23 || hour <= 6) {
          // Sleep hours (11pm - 6am)
          intensity = 0.8 + Math.random() * 0.2;
          duration = 0.9 + Math.random() * 0.1;
        } else if (hour >= 13 && hour <= 15) {
          // Afternoon nap possibility
          intensity = Math.random() * 0.6;
          duration = Math.random() * 0.5;
        } else {
          // Awake hours
          intensity = Math.random() * 0.2;
          duration = Math.random() * 0.3;
        }
        
        return {
          hour,
          type: 'sleep',
          intensity,
          duration,
          value: Math.round(intensity * 8) // hours of sleep quality
        };
      });
    
    default:
      return [];
  }
};

// Pre-generated data for the demo
export const mockMobilityData: DataBlob[] = generateMockLifeData('mobility');
export const mockMoodData: DataBlob[] = generateMockLifeData('mood');
export const mockSleepData: DataBlob[] = generateMockLifeData('sleep');
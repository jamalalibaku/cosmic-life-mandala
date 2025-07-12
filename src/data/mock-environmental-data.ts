/**
 * Mock Environmental Data - Connection to Nature
 * Represents moments of environmental connection and sensory experience
 */

export interface EnvironmentalData {
  timestamp: string;
  sunlightMinutes: number; // Minutes spent in direct sunlight
  natureMoments: number; // Count of mindful nature interactions
  windStrength: number; // 0-1 scale of felt wind intensity
  temperature: number; // Ambient temperature in Celsius
  connection: number; // 0-1 scale of felt connection to nature
  location?: string; // Optional location description
  mood?: 'peaceful' | 'energized' | 'grounded' | 'inspired' | 'reflective';
}

export const mockEnvironmentalData: EnvironmentalData[] = [
  {
    timestamp: '2025-07-12T06:30:00Z',
    sunlightMinutes: 15,
    natureMoments: 2,
    windStrength: 0.3,
    temperature: 18,
    connection: 0.4,
    location: 'Morning garden',
    mood: 'peaceful'
  },
  {
    timestamp: '2025-07-12T08:15:00Z',
    sunlightMinutes: 45,
    natureMoments: 5,
    windStrength: 0.6,
    temperature: 22,
    connection: 0.7,
    location: 'Park walk',
    mood: 'energized'
  },
  {
    timestamp: '2025-07-12T10:30:00Z',
    sunlightMinutes: 90,
    natureMoments: 8,
    windStrength: 0.4,
    temperature: 25,
    connection: 0.9,
    location: 'Beach meditation',
    mood: 'grounded'
  },
  {
    timestamp: '2025-07-12T14:00:00Z',
    sunlightMinutes: 120,
    natureMoments: 12,
    windStrength: 0.8,
    temperature: 28,
    connection: 0.95,
    location: 'Forest trail',
    mood: 'inspired'
  },
  {
    timestamp: '2025-07-12T16:45:00Z',
    sunlightMinutes: 75,
    natureMoments: 6,
    windStrength: 0.5,
    temperature: 24,
    connection: 0.8,
    location: 'Hilltop view',
    mood: 'reflective'
  },
  {
    timestamp: '2025-07-12T18:30:00Z',
    sunlightMinutes: 30,
    natureMoments: 3,
    windStrength: 0.2,
    temperature: 21,
    connection: 0.6,
    location: 'Evening garden',
    mood: 'peaceful'
  },
  {
    timestamp: '2025-07-12T20:00:00Z',
    sunlightMinutes: 10,
    natureMoments: 2,
    windStrength: 0.1,
    temperature: 19,
    connection: 0.5,
    location: 'Stargazing',
    mood: 'reflective'
  }
];

// Helper functions for environmental data visualization
export const getEnvironmentalColor = (connection: number): string => {
  // Color shifts from soft blue-green to vibrant emerald based on connection
  const hue = 160 + connection * 20; // 160-180 range (blue-green to green)
  const saturation = 40 + connection * 40; // More saturated with higher connection
  const lightness = 60 + connection * 20; // Brighter with higher connection
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const getEnvironmentalIntensity = (data: EnvironmentalData): number => {
  // Combine multiple factors for overall environmental intensity
  const sunlightFactor = Math.min(data.sunlightMinutes / 120, 1); // Normalize to 2 hours max
  const natureFactor = Math.min(data.natureMoments / 15, 1); // Normalize to 15 moments max
  const windFactor = data.windStrength;
  const connectionFactor = data.connection;
  
  return (sunlightFactor + natureFactor + windFactor + connectionFactor) / 4;
};

export const getEnvironmentalMood = (data: EnvironmentalData): {
  energy: number;
  peace: number;
  inspiration: number;
} => {
  const baseEnergy = data.windStrength * 0.5 + (data.sunlightMinutes / 120) * 0.5;
  const basePeace = data.connection * 0.7 + (1 - data.windStrength) * 0.3;
  const baseInspiration = data.natureMoments / 15 * 0.6 + data.connection * 0.4;
  
  return {
    energy: Math.min(baseEnergy, 1),
    peace: Math.min(basePeace, 1),
    inspiration: Math.min(baseInspiration, 1)
  };
};
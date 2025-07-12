export interface EssenceData {
  day: string;
  essence: number; // 0-100 score
  mood: string;
  energy: string;
  timestamp: Date;
}

export const mockEssenceData: EssenceData[] = [
  { 
    day: "Monday", 
    essence: 43, 
    mood: "Irritable", 
    energy: "Low",
    timestamp: new Date(2024, 0, 8) // Monday
  },
  { 
    day: "Tuesday", 
    essence: 87, 
    mood: "Inspired", 
    energy: "High",
    timestamp: new Date(2024, 0, 9) // Tuesday
  },
  { 
    day: "Wednesday", 
    essence: 74, 
    mood: "Focused", 
    energy: "Moderate",
    timestamp: new Date(2024, 0, 10) // Wednesday
  },
  { 
    day: "Thursday", 
    essence: 50, 
    mood: "Flat", 
    energy: "Low",
    timestamp: new Date(2024, 0, 11) // Thursday
  },
  { 
    day: "Friday", 
    essence: 91, 
    mood: "Euphoric", 
    energy: "High",
    timestamp: new Date(2024, 0, 12) // Friday
  },
  { 
    day: "Saturday", 
    essence: 65, 
    mood: "Social", 
    energy: "Medium",
    timestamp: new Date(2024, 0, 13) // Saturday
  },
  { 
    day: "Sunday", 
    essence: 85, 
    mood: "Grateful", 
    energy: "Peaceful",
    timestamp: new Date(2024, 0, 14) // Sunday
  }
];

// Helper function to get essence data for a specific date
export const getEssenceForDate = (date: Date): EssenceData | null => {
  return mockEssenceData.find(essence => 
    essence.timestamp.toDateString() === date.toDateString()
  ) || null;
};

// Helper function to get mood pattern type
export const getMoodPattern = (mood: string): string => {
  const patterns: Record<string, string> = {
    "Irritable": "spiky",
    "Inspired": "radiant", 
    "Focused": "smooth",
    "Flat": "muted",
    "Euphoric": "explosive",
    "Social": "wavy",
    "Grateful": "gentle"
  };
  return patterns[mood] || "smooth";
};

// Helper function to get energy motion speed
export const getEnergySpeed = (energy: string): number => {
  const speeds: Record<string, number> = {
    "Low": 0.3,
    "Medium": 0.6,
    "Moderate": 0.6,
    "High": 1.2,
    "Peaceful": 0.5
  };
  return speeds[energy] || 0.6;
};
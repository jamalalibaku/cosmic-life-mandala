export interface EssenceData {
  day: string;
  essence: number; // 0-100 score
  mood: string;
  energy: string;
  timestamp: Date;
}

// Generate data for current week to ensure visibility
const generateCurrentWeekData = (): EssenceData[] => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
  
  const essenceValues = [85, 43, 87, 74, 50, 91, 65]; // Sunday through Saturday
  const moods = ["Grateful", "Irritable", "Inspired", "Focused", "Flat", "Euphoric", "Social"];
  const energies = ["Peaceful", "Low", "High", "Moderate", "Low", "High", "Medium"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  return days.map((day, index) => ({
    day,
    essence: essenceValues[index],
    mood: moods[index],
    energy: energies[index],
    timestamp: new Date(startOfWeek.getTime() + (index * 24 * 60 * 60 * 1000))
  }));
};

export const mockEssenceData: EssenceData[] = generateCurrentWeekData();

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
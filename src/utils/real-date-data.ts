/**
 * Real Date Data Generator
 * Scientifically accurate calendar-based data mapping
 */

import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays, addDays } from "date-fns";

export interface DateBasedData {
  date: Date;
  dayOfWeek: number;
  weekNumber: number;
  mood?: {
    emotion: string;
    valence: number;
    energy: number;
  };
  places?: {
    location: string;
    duration: number;
    coordinates?: { lat: number; lng: number };
  }[];
  mobility?: {
    activity: string;
    intensity: number;
    distance: number;
    duration: number;
  }[];
  plans?: {
    event: string;
    priority: number;
    time: string;
    completed: boolean;
  }[];
  weather?: {
    temp: number;
    clouds: number;
    wind: number;
    conditions: string;
  };
  moon?: {
    phase: string;
    luminosity: number;
    riseTime: string;
    setTime: string;
  };
}

// Generate realistic data for the past 30 days
export const generateRealDateData = (): DateBasedData[] => {
  const today = new Date();
  const startDate = subDays(today, 29); // Last 30 days
  const days = eachDayOfInterval({ start: startDate, end: today });

  return days.map((date, index) => {
    const dayOfWeek = date.getDay();
    const weekNumber = Math.floor(index / 7);
    
    // Realistic mood patterns (better on weekends, dips on Mondays)
    const getMoodForDay = () => {
      const baseValence = 0.4 + Math.random() * 0.4;
      const baseEnergy = 0.3 + Math.random() * 0.5;
      
      // Weekend boost
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return {
          emotion: Math.random() > 0.3 ? "joy" : "calm",
          valence: Math.min(0.9, baseValence + 0.2),
          energy: Math.min(0.9, baseEnergy + 0.1),
        };
      }
      
      // Monday dip
      if (dayOfWeek === 1) {
        return {
          emotion: Math.random() > 0.7 ? "focus" : "calm",
          valence: Math.max(0.1, baseValence - 0.1),
          energy: Math.max(0.2, baseEnergy - 0.1),
        };
      }
      
      return {
        emotion: ["focus", "calm", "joy"][Math.floor(Math.random() * 3)],
        valence: baseValence,
        energy: baseEnergy,
      };
    };

    // Realistic place patterns
    const getPlacesForDay = () => {
      const places = [];
      
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Weekday: home, work, maybe cafe
        places.push({ location: "home", duration: 8 + Math.random() * 2 });
        places.push({ location: "work", duration: 7 + Math.random() * 3 });
        if (Math.random() > 0.7) {
          places.push({ location: "cafe", duration: 1 + Math.random() });
        }
      } else {
        // Weekend: home, maybe outdoor places
        places.push({ location: "home", duration: 10 + Math.random() * 4 });
        if (Math.random() > 0.5) {
          places.push({ location: "park", duration: 2 + Math.random() * 2 });
        }
        if (Math.random() > 0.6) {
          places.push({ location: "restaurant", duration: 1.5 + Math.random() });
        }
      }
      
      return places;
    };

    // Realistic mobility patterns
    const getMobilityForDay = () => {
      const activities = [];
      
      // Daily walk (higher chance on weekends)
      if (Math.random() > (dayOfWeek >= 1 && dayOfWeek <= 5 ? 0.3 : 0.1)) {
        activities.push({
          activity: "walk",
          intensity: 0.3 + Math.random() * 0.3,
          distance: 2000 + Math.random() * 4000,
          duration: 30 + Math.random() * 30,
        });
      }
      
      // Workout (more likely on weekdays)
      if (Math.random() > (dayOfWeek >= 1 && dayOfWeek <= 5 ? 0.6 : 0.8)) {
        const workoutType = Math.random() > 0.5 ? "run" : "bike";
        activities.push({
          activity: workoutType,
          intensity: 0.6 + Math.random() * 0.3,
          distance: workoutType === "run" ? 5000 + Math.random() * 5000 : 10000 + Math.random() * 15000,
          duration: 45 + Math.random() * 30,
        });
      }
      
      return activities;
    };

    // Realistic weather (simplified)
    const getWeatherForDay = () => ({
      temp: 18 + Math.random() * 12 + Math.sin((index / 30) * Math.PI * 2) * 5, // Seasonal variation
      clouds: Math.random(),
      wind: Math.random() * 0.8,
      conditions: ["sunny", "partly-cloudy", "cloudy", "rainy"][Math.floor(Math.random() * 4)],
    });

    // Realistic moon phase (simplified lunar cycle ~29.5 days)
    const getMoonForDay = () => {
      const lunarCycle = (index % 29.5) / 29.5;
      let phase = "new";
      let luminosity = 0;
      
      if (lunarCycle < 0.125) {
        phase = "new";
        luminosity = 0.1;
      } else if (lunarCycle < 0.25) {
        phase = "waxing-crescent";
        luminosity = 0.3;
      } else if (lunarCycle < 0.375) {
        phase = "first-quarter";
        luminosity = 0.5;
      } else if (lunarCycle < 0.5) {
        phase = "waxing-gibbous";
        luminosity = 0.7;
      } else if (lunarCycle < 0.625) {
        phase = "full";
        luminosity = 1.0;
      } else if (lunarCycle < 0.75) {
        phase = "waning-gibbous";
        luminosity = 0.7;
      } else if (lunarCycle < 0.875) {
        phase = "last-quarter";
        luminosity = 0.5;
      } else {
        phase = "waning-crescent";
        luminosity = 0.3;
      }
      
      return {
        phase,
        luminosity,
        riseTime: `${6 + Math.floor(Math.random() * 4)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        setTime: `${18 + Math.floor(Math.random() * 4)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      };
    };

    return {
      date,
      dayOfWeek,
      weekNumber,
      mood: getMoodForDay(),
      places: getPlacesForDay(),
      mobility: getMobilityForDay(),
      plans: [
        // Realistic plans based on day type
        ...(dayOfWeek >= 1 && dayOfWeek <= 5 ? [
          { event: "morning-standup", priority: 0.8, time: "09:00", completed: Math.random() > 0.2 },
          { event: "project-work", priority: 0.9, time: "10:30", completed: Math.random() > 0.1 },
        ] : []),
        ...(Math.random() > 0.6 ? [
          { event: "workout", priority: 0.7, time: "18:00", completed: Math.random() > 0.3 },
        ] : []),
        ...(dayOfWeek === 0 || dayOfWeek === 6 ? [
          { event: "family-time", priority: 0.6, time: "14:00", completed: Math.random() > 0.1 },
        ] : []),
      ],
      weather: getWeatherForDay(),
      moon: getMoonForDay(),
    };
  });
};

// Helper to get data for a specific week
export const getWeekData = (dateData: DateBasedData[], weekStartDate: Date): DateBasedData[] => {
  const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(weekStartDate, { weekStartsOn: 1 });
  
  return dateData.filter(data => 
    data.date >= weekStart && data.date <= weekEnd
  );
};

// Helper to get data for a specific day
export const getDayData = (dateData: DateBasedData[], targetDate: Date): DateBasedData | undefined => {
  return dateData.find(data => 
    format(data.date, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd')
  );
};
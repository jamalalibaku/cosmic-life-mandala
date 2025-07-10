/**
 * (c) 2025 Cosmic Life Mandala – Fractal Timeline Engine
 * Built by Lovable & ChatGPT, vision by Founder
 * Licensed under MIT
 */

// Week view data
export const generateMockWeekData = () => {
  const weekData = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i)); // Start from 6 days ago
    
    weekData.push({
      date,
      weather: ['sunny', 'cloudy', 'rainy', 'clear-night'][Math.floor(Math.random() * 4)],
      sleepQuality: Math.random() * 0.8 + 0.2,
      activityLevel: Math.random() * 0.9 + 0.1,
      moodScore: Math.random() * 0.8 + 0.2,
      summary: `Day ${i + 1} summary`
    });
  }
  
  return weekData;
};

// Month view data
export const generateMockMonthData = () => {
  const monthData = [];
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    const weekOfMonth = Math.floor((day - 1) / 7);
    
    monthData.push({
      date,
      dayOfMonth: day,
      weekOfMonth,
      activitySummary: Math.random(),
      weatherBand: ['sunny', 'cloudy', 'rainy', 'storm'][Math.floor(Math.random() * 4)],
      sleepMoodPulse: Math.random(),
      isToday: day === today.getDate()
    });
  }
  
  return monthData;
};

// Year view data
export const generateMockYearData = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const seasons = [
    'winter', 'winter', 'spring', 'spring', 'spring', 'summer',
    'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'
  ] as const;
  
  const today = new Date();
  const currentMonth = today.getMonth();
  
  return months.map((name, index) => ({
    month: index,
    name,
    season: seasons[index],
    dataSummary: {
      avgActivity: Math.random() * 0.8 + 0.2,
      avgMood: Math.random() * 0.8 + 0.2,
      avgSleep: Math.random() * 0.8 + 0.2,
      dominantWeather: ['sunny', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)]
    },
    isCurrentMonth: index === currentMonth
  }));
};

// Pre-generated data
export const mockWeekData = generateMockWeekData();
export const mockMonthData = generateMockMonthData();
export const mockYearData = generateMockYearData();
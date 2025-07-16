/**
 * Preprocessed Data Context - Pre-compute all expensive calculations once
 */

import React, { createContext, useContext, useMemo } from 'react';
import { mockWeatherData, mockWeatherToday } from '@/data/mock-weather-data';
import { mockMobilityData, mockMoodData, mockSleepData } from '@/data/mock-life-data';
import { mockPlansData } from '@/data/mock-plans-data';
import { mockWeekData, mockMonthData, mockYearData } from '@/data/mock-temporal-data';
import { mockFriends } from '@/data/mock-friend-data';
import { mockInsightData } from '@/data/mock-insight-data';
import { generateInsights } from '@/utils/insight-engine';
import { getUserInsightProfile } from '@/utils/insight-memory';
import { detectLifePhase } from '@/utils/life-phase-detection';

interface PreprocessedData {
  // Computed metrics
  sleepQuality: number;
  mobilityLevel: number;
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  
  // Weather data
  weatherForDay: any;
  weatherChunks: {
    temperature: Array<{ time: string; value: number }>;
    cloudiness: Array<{ time: string; value: number }>;
    sunIntensity: Array<{ time: string; value: number }>;
    windSpeed: Array<{ time: string; value: number }>;
  };
  
  // Insights by theme
  insightsByTheme: Record<string, any>;
  
  // User profile data
  userProfile: any;
  currentLifePhase: any;
  mockInteractions: Array<{ layerType: string; timestamp: string; dataValue: number }>;
  
  // Raw data (memoized)
  mockData: {
    weather: typeof mockWeatherData;
    weatherToday: typeof mockWeatherToday;
    mobility: typeof mockMobilityData;
    mood: typeof mockMoodData;
    sleep: typeof mockSleepData;
    plans: typeof mockPlansData;
    friends: typeof mockFriends;
    insights: typeof mockInsightData;
    week: typeof mockWeekData;
    month: typeof mockMonthData;
    year: typeof mockYearData;
  };
}

const PreprocessedDataContext = createContext<PreprocessedData | undefined>(undefined);

export const usePreprocessedData = () => {
  const context = useContext(PreprocessedDataContext);
  if (!context) {
    throw new Error('usePreprocessedData must be used within PreprocessedDataProvider');
  }
  return context;
};

export const PreprocessedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const preprocessedData = useMemo((): PreprocessedData => {
    // Pre-compute expensive calculations
    const sleepQuality = mockSleepData.reduce((sum, d) => sum + d.intensity, 0) / mockSleepData.length;
    const mobilityLevel = mockMobilityData.reduce((sum, d) => sum + d.intensity, 0) / mockMobilityData.length;
    const weatherCondition = (mockWeatherToday[0]?.condition === 'storm' ? 'stormy' : 
                             mockWeatherToday[0]?.condition || 'sunny') as 'sunny' | 'cloudy' | 'rainy' | 'stormy';
    
    // Pre-process weather data chunks
    const weatherChunks = {
      temperature: mockWeatherData.slice(0, 8).map((w, i) => ({
        time: `${i * 3}:00`,
        value: w.temperature
      })),
      cloudiness: mockWeatherData.slice(0, 4).map((w, i) => ({
        time: `${i * 6}:00`,
        value: w.condition === 'cloudy' ? 80 : w.condition === 'partly_cloudy' ? 50 : 20
      })),
      sunIntensity: mockWeatherData.slice(0, 6).map((w, i) => ({
        time: `${i * 4}:00`,
        value: w.condition === 'sunny' ? 800 : w.condition === 'partly_cloudy' ? 400 : 100
      })),
      windSpeed: mockWeatherData.slice(0, 4).map((w, i) => ({
        time: `${i * 6}:00`,
        value: w.windSpeed
      }))
    };
    
    // Pre-compute weather data for the day
    const weatherForDay = {
      date: "2025-07-11",
      sunrise: "05:12",
      sunset: "21:08",
      temperature: weatherChunks.temperature,
      cloudiness: weatherChunks.cloudiness,
      sunIntensity: weatherChunks.sunIntensity,
      windSpeed: weatherChunks.windSpeed
    };
    
    // Pre-compute user profile and life phase
    const userProfile = getUserInsightProfile();
    const mockInteractions = [
      { layerType: 'mood', timestamp: new Date().toISOString(), dataValue: 0.7 },
      { layerType: 'sleep', timestamp: new Date().toISOString(), dataValue: 0.8 },
      { layerType: 'mobility', timestamp: new Date().toISOString(), dataValue: 0.6 }
    ];
    const currentLifePhase = detectLifePhase(userProfile, mockInteractions);
    
    // Pre-generate insights for common themes
    const themes = ['neo_cosmic', 'van_gogh', 'mandala_expressive'];
    const insightsByTheme = themes.reduce((acc, theme) => {
      acc[theme] = generateInsights({
        mood: mockMoodData,
        sleep: mockSleepData,
        mobility: mockMobilityData,
        weather: mockWeatherToday.map(w => ({
          hour: w.hour,
          temperature: w.temperature,
          condition: w.condition,
          intensity: w.temperature / 30
        })),
        timeScale: 'day',
        theme
      });
      return acc;
    }, {} as Record<string, any>);
    
    return {
      sleepQuality,
      mobilityLevel,
      weatherCondition,
      weatherForDay,
      weatherChunks,
      insightsByTheme,
      userProfile,
      currentLifePhase,
      mockInteractions,
      mockData: {
        weather: mockWeatherData,
        weatherToday: mockWeatherToday,
        mobility: mockMobilityData,
        mood: mockMoodData,
        sleep: mockSleepData,
        plans: mockPlansData,
        friends: mockFriends,
        insights: mockInsightData,
        week: mockWeekData,
        month: mockMonthData,
        year: mockYearData
      }
    };
  }, []); // Empty dependency array - compute once
  
  return (
    <PreprocessedDataContext.Provider value={preprocessedData}>
      {children}
    </PreprocessedDataContext.Provider>
  );
};
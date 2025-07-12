/**
 * Memory Patterns Hook - Detect and visualize life pattern correlations
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { DateBasedData } from '@/utils/real-date-data';

interface MemoryPattern {
  id: string;
  type: 'seasonal' | 'cyclical' | 'milestone' | 'correlation';
  description: string;
  strength: number; // 0-1 correlation strength
  occurrences: Date[];
  lastSeen: Date;
  predicted?: Date; // When this pattern might occur again
  visualPosition: { angle: number; radius: number };
}

interface PatternCorrelation {
  pattern1: MemoryPattern;
  pattern2: MemoryPattern;
  correlation: number;
  description: string;
}

export const useMemoryPatterns = (historicalData: DateBasedData[]) => {
  const [detectedPatterns, setDetectedPatterns] = useState<MemoryPattern[]>([]);
  const [correlations, setCorrelations] = useState<PatternCorrelation[]>([]);

  // Detect patterns in historical data
  const patterns = useMemo(() => {
    if (historicalData.length < 7) return [];

    const patterns: MemoryPattern[] = [];

    // Detect seasonal mood patterns
    const seasonalMoods = detectSeasonalPatterns(historicalData);
    patterns.push(...seasonalMoods);

    // Detect weekly cycles
    const weeklyCycles = detectWeeklyCycles(historicalData);
    patterns.push(...weeklyCycles);

    // Detect milestone patterns
    const milestones = detectMilestonePatterns(historicalData);
    patterns.push(...milestones);

    return patterns;
  }, [historicalData]);

  // Find correlations between patterns
  const findCorrelations = useCallback((patterns: MemoryPattern[]) => {
    const correlations: PatternCorrelation[] = [];
    
    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        const correlation = calculatePatternCorrelation(patterns[i], patterns[j]);
        if (correlation > 0.6) {
          correlations.push({
            pattern1: patterns[i],
            pattern2: patterns[j],
            correlation,
            description: generateCorrelationDescription(patterns[i], patterns[j])
          });
        }
      }
    }
    
    return correlations;
  }, []);

  useEffect(() => {
    setDetectedPatterns(patterns);
    setCorrelations(findCorrelations(patterns));
  }, [patterns, findCorrelations]);

  // Get memory echoes for current context
  const getMemoryEchoes = (currentDate: Date) => {
    return detectedPatterns
      .filter(pattern => {
        // Show patterns that are likely to be relevant now
        const dayOfYear = getDayOfYear(currentDate);
        return pattern.occurrences.some(date => 
          Math.abs(getDayOfYear(date) - dayOfYear) < 14 // Within 2 weeks
        );
      })
      .map(pattern => ({
        ...pattern,
        relevance: calculateRelevance(pattern, currentDate),
        echo: generateEchoMessage(pattern, currentDate)
      }));
  };

  return {
    detectedPatterns,
    correlations,
    getMemoryEchoes,
    hasStrongPatterns: patterns.some(p => p.strength > 0.7)
  };
};

// Helper functions
function detectSeasonalPatterns(data: DateBasedData[]): MemoryPattern[] {
  const patterns: MemoryPattern[] = [];
  const seasons = groupBySeasons(data);

  Object.entries(seasons).forEach(([season, seasonData]) => {
    const moodTrend = analyzeMoodTrend(seasonData);
    if (moodTrend.strength > 0.5) {
      patterns.push({
        id: `seasonal-${season}`,
        type: 'seasonal',
        description: `During ${season}, you tend to feel ${moodTrend.description}`,
        strength: moodTrend.strength,
        occurrences: seasonData.map(d => d.date),
        lastSeen: seasonData[seasonData.length - 1]?.date || new Date(),
        visualPosition: { 
          angle: getSeasonAngle(season), 
          radius: 200 + moodTrend.strength * 50 
        }
      });
    }
  });

  return patterns;
}

function detectWeeklyCycles(data: DateBasedData[]): MemoryPattern[] {
  const patterns: MemoryPattern[] = [];
  const weeklyData = groupByDayOfWeek(data);

  Object.entries(weeklyData).forEach(([dayName, dayData]) => {
    const pattern = analyzeDayPattern(dayData);
    if (pattern.strength > 0.6) {
      patterns.push({
        id: `weekly-${dayName}`,
        type: 'cyclical',
        description: `${dayName}s are usually ${pattern.description}`,
        strength: pattern.strength,
        occurrences: dayData.map(d => d.date),
        lastSeen: dayData[dayData.length - 1]?.date || new Date(),
        visualPosition: { 
          angle: getDayAngle(dayName), 
          radius: 150 + pattern.strength * 30 
        }
      });
    }
  });

  return patterns;
}

function detectMilestonePatterns(data: DateBasedData[]): MemoryPattern[] {
  // Detect significant events that might repeat
  const milestones = data.filter(d => 
    d.mood?.energy > 0.8 || 
    d.plans?.some(p => p.event.includes('milestone') || p.priority > 0.8) ||
    d.mobility?.some(m => m.distance > 100 || m.activity.includes('travel'))
  );

  return milestones.map((milestone, index) => ({
    id: `milestone-${index}`,
    type: 'milestone',
    description: generateMilestoneDescription(milestone),
    strength: 0.8,
    occurrences: [milestone.date],
    lastSeen: milestone.date,
    visualPosition: { 
      angle: (index * 137.5) % 360, // Golden angle distribution
      radius: 180 
    }
  }));
}

function calculatePatternCorrelation(p1: MemoryPattern, p2: MemoryPattern): number {
  // Calculate temporal correlation between patterns
  const dates1 = p1.occurrences.map(d => d.getTime());
  const dates2 = p2.occurrences.map(d => d.getTime());
  
  let correlationSum = 0;
  let comparisons = 0;
  
  dates1.forEach(date1 => {
    dates2.forEach(date2 => {
      const timeDiff = Math.abs(date1 - date2);
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      if (daysDiff < 7) { // Within a week
        correlationSum += 1 - (daysDiff / 7);
        comparisons++;
      }
    });
  });
  
  return comparisons > 0 ? correlationSum / comparisons : 0;
}

function generateCorrelationDescription(p1: MemoryPattern, p2: MemoryPattern): string {
  return `${p1.description} often coincides with ${p2.description}`;
}

function calculateRelevance(pattern: MemoryPattern, currentDate: Date): number {
  const dayOfYear = getDayOfYear(currentDate);
  const patternDays = pattern.occurrences.map(getDayOfYear);
  
  const closestMatch = Math.min(...patternDays.map(day => 
    Math.min(Math.abs(day - dayOfYear), 365 - Math.abs(day - dayOfYear))
  ));
  
  return Math.max(0, 1 - closestMatch / 30); // Relevance decreases over 30 days
}

function generateEchoMessage(pattern: MemoryPattern, currentDate: Date): string {
  return `Memory echo: ${pattern.description}`;
}

// Utility functions
function groupBySeasons(data: DateBasedData[]) {
  return data.reduce((acc, item) => {
    const season = getSeason(item.date);
    if (!acc[season]) acc[season] = [];
    acc[season].push(item);
    return acc;
  }, {} as Record<string, DateBasedData[]>);
}

function groupByDayOfWeek(data: DateBasedData[]) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return data.reduce((acc, item) => {
    const dayName = dayNames[item.date.getDay()];
    if (!acc[dayName]) acc[dayName] = [];
    acc[dayName].push(item);
    return acc;
  }, {} as Record<string, DateBasedData[]>);
}

function getSeason(date: Date): string {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Fall';
  return 'Winter';
}

function getSeasonAngle(season: string): number {
  const angles = { Spring: 90, Summer: 180, Fall: 270, Winter: 0 };
  return angles[season] || 0;
}

function getDayAngle(dayName: string): number {
  const angles = {
    Monday: 0, Tuesday: 51, Wednesday: 102, Thursday: 153,
    Friday: 204, Saturday: 255, Sunday: 306
  };
  return angles[dayName] || 0;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function analyzeMoodTrend(data: DateBasedData[]) {
  const moods = data.filter(d => d.mood).map(d => d.mood!);
  if (moods.length === 0) return { strength: 0, description: 'neutral' };
  
  const avgValence = moods.reduce((sum, m) => sum + m.valence, 0) / moods.length;
  const avgEnergy = moods.reduce((sum, m) => sum + m.energy, 0) / moods.length;
  
  const strength = Math.abs(avgValence - 0.5) + Math.abs(avgEnergy - 0.5);
  const description = avgValence > 0.6 ? 'positive' : avgValence < 0.4 ? 'melancholic' : 'balanced';
  
  return { strength, description };
}

function analyzeDayPattern(data: DateBasedData[]) {
  const moodTrend = analyzeMoodTrend(data);
  return {
    strength: moodTrend.strength,
    description: moodTrend.description
  };
}

function generateMilestoneDescription(milestone: DateBasedData): string {
  if (milestone.mood?.energy > 0.8) return 'a high-energy breakthrough moment';
  if (milestone.plans?.some(p => p.event.includes('milestone') || p.priority > 0.8)) return 'an important planned achievement';
  if (milestone.mobility?.some(m => m.distance > 100 || m.activity.includes('travel'))) return 'a significant journey or travel experience';
  return 'a memorable life moment';
}
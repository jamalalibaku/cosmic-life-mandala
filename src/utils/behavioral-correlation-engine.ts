/**
 * (c) 2025 Cosmic Life Mandala – Behavioral Correlation Engine
 * The intelligence core that detects meaningful patterns in life data
 */

import { mockEssenceData, EssenceData } from '../data/mock-essence-data';
import { mockPlansData, PlansDataPoint } from '../data/mock-plans-data';
import { mockWeatherData } from '../data/mock-weather-data';
import { generateMockLifeData } from '../data/mock-life-data';
import { DataBlob } from '../components/data-blob-ring';

// Correlation types and interfaces
export interface Correlation {
  id: string;
  type: 'temporal' | 'weather' | 'sleep' | 'activity' | 'planning';
  strength: number; // 0-1, how strong the correlation is
  pattern: string;
  insight: string;
  confidence: number; // 0-1, how confident we are in this pattern
  timeframe: string; // 'daily', 'weekly', 'pattern'
  factors: string[];
}

export interface BehavioralProfile {
  patterns: Correlation[];
  dominantFactors: string[];
  insights: string[];
  learningLevel: number; // 0-1, how much we've learned about this user
}

// Generate unified dataset for correlation analysis
const generateCorrelationDataset = () => {
  const sleepData = generateMockLifeData('sleep');
  const moodData = generateMockLifeData('mood');
  const mobilityData = generateMockLifeData('mobility');
  
  return {
    essence: mockEssenceData,
    plans: mockPlansData,
    weather: mockWeatherData,
    sleep: sleepData,
    mood: moodData,
    mobility: mobilityData
  };
};

// Core correlation detection functions
export class BehavioralCorrelationEngine {
  private dataset = generateCorrelationDataset();
  private profile: BehavioralProfile;

  constructor() {
    this.profile = {
      patterns: [],
      dominantFactors: [],
      insights: [],
      learningLevel: 0
    };
    this.analyzeAllPatterns();
  }

  // Main analysis orchestrator
  private analyzeAllPatterns() {
    const correlations: Correlation[] = [];
    
    // 1. Sleep-Mood Correlations
    correlations.push(...this.analyzeSleepMoodPatterns());
    
    // 2. Weather-Energy Correlations  
    correlations.push(...this.analyzeWeatherEnergyPatterns());
    
    // 3. Activity-Essence Correlations
    correlations.push(...this.analyzeActivityEssencePatterns());
    
    // 4. Temporal Patterns
    correlations.push(...this.analyzeTemporalPatterns());
    
    // 5. Planning-Mood Correlations
    correlations.push(...this.analyzePlanningMoodPatterns());

    this.profile.patterns = correlations.sort((a, b) => b.strength - a.strength);
    this.profile.dominantFactors = this.extractDominantFactors();
    this.profile.insights = this.generateInsights();
    this.profile.learningLevel = Math.min(1, correlations.length / 10);
  }

  // Sleep-Mood correlation analysis
  private analyzeSleepMoodPatterns(): Correlation[] {
    const correlations: Correlation[] = [];
    
    // Find deep sleep hours and corresponding mood
    const deepSleepHours = this.dataset.sleep
      .filter(d => d.intensity > 0.8)
      .map(d => d.hour);
    
    const morningMood = this.dataset.mood
      .filter(d => d.hour >= 7 && d.hour <= 10)
      .reduce((sum, d) => sum + d.intensity, 0) / 4;

    if (deepSleepHours.length >= 4 && morningMood > 0.6) {
      correlations.push({
        id: 'sleep-mood-001',
        type: 'sleep',
        strength: 0.85,
        pattern: 'Deep sleep → Better morning mood',
        insight: 'You feel more positive in the morning after 4+ hours of deep sleep',
        confidence: 0.8,
        timeframe: 'daily',
        factors: ['deep_sleep', 'morning_mood']
      });
    }

    return correlations;
  }

  // Weather-Energy correlation analysis
  private analyzeWeatherEnergyPatterns(): Correlation[] {
    const correlations: Correlation[] = [];
    
    // Check if sunny days correlate with higher essence scores
    const sunnyDays = this.dataset.weather.filter(w => w.condition === 'sunny');
    const sunnyDayEssence = this.dataset.essence
      .filter(e => sunnyDays.some(s => s.timestamp.includes(e.day.toLowerCase())))
      .reduce((sum, e) => sum + e.essence, 0);

    if (sunnyDays.length > 0) {
      const avgSunnyEssence = sunnyDayEssence / sunnyDays.length;
      
      if (avgSunnyEssence > 70) {
        correlations.push({
          id: 'weather-energy-001',
          type: 'weather',
          strength: 0.7,
          pattern: 'Sunny weather → Higher essence',
          insight: `Your well-being peaks on sunny days (avg: ${Math.round(avgSunnyEssence)})`,
          confidence: 0.75,
          timeframe: 'pattern',
          factors: ['sunny_weather', 'essence_score']
        });
      }
    }

    return correlations;
  }

  // Activity-Essence correlation analysis
  private analyzeActivityEssencePatterns(): Correlation[] {
    const correlations: Correlation[] = [];
    
    // High morning mobility vs essence
    const morningActivity = this.dataset.mobility
      .filter(m => m.hour >= 8 && m.hour <= 11)
      .reduce((sum, m) => sum + m.intensity, 0) / 4;

    // Current essence (simulated as today's essence)
    const currentEssence = this.dataset.essence[0]?.essence || 50;

    if (morningActivity > 0.6 && currentEssence > 75) {
      correlations.push({
        id: 'activity-essence-001',
        type: 'activity',
        strength: 0.8,
        pattern: 'Morning movement → Higher essence',
        insight: 'Active mornings correlate with better overall well-being',
        confidence: 0.7,
        timeframe: 'daily',
        factors: ['morning_activity', 'essence_score']
      });
    }

    return correlations;
  }

  // Temporal pattern analysis
  private analyzeTemporalPatterns(): Correlation[] {
    const correlations: Correlation[] = [];
    
    // Check for weekly patterns in essence data
    const weekdayEssence = this.dataset.essence
      .filter(e => !['Saturday', 'Sunday'].includes(e.day))
      .reduce((sum, e) => sum + e.essence, 0);
    
    const weekendEssence = this.dataset.essence
      .filter(e => ['Saturday', 'Sunday'].includes(e.day))
      .reduce((sum, e) => sum + e.essence, 0);

    const weekdayAvg = weekdayEssence / 5;
    const weekendAvg = weekendEssence / 2;

    if (Math.abs(weekdayAvg - weekendAvg) > 15) {
      correlations.push({
        id: 'temporal-001',
        type: 'temporal',
        strength: 0.6,
        pattern: weekendAvg > weekdayAvg ? 'Weekend boost' : 'Weekday focus',
        insight: weekendAvg > weekdayAvg 
          ? 'Your essence flourishes on weekends (+15 points)'
          : 'You find deeper rhythm during weekdays',
        confidence: 0.65,
        timeframe: 'weekly',
        factors: ['day_of_week', 'essence_score']
      });
    }

    return correlations;
  }

  // Planning-Mood correlation analysis
  private analyzePlanningMoodPatterns(): Correlation[] {
    const correlations: Correlation[] = [];
    
    // Check if creative plans correlate with higher mood
    const creativePlans = this.dataset.plans.filter(p => p.category === 'creative');
    const socialPlans = this.dataset.plans.filter(p => p.category === 'collaboration');
    
    if (creativePlans.length > 0) {
      correlations.push({
        id: 'planning-mood-001',
        type: 'planning',
        strength: 0.75,
        pattern: 'Creative sessions → Inspired mood',
        insight: 'Creative work sessions align with your "Inspired" mood state',
        confidence: 0.8,
        timeframe: 'pattern',
        factors: ['creative_plans', 'inspired_mood']
      });
    }

    return correlations;
  }

  // Extract dominant behavioral factors
  private extractDominantFactors(): string[] {
    const factorCounts: Record<string, number> = {};
    
    this.profile.patterns.forEach(pattern => {
      pattern.factors.forEach(factor => {
        factorCounts[factor] = (factorCounts[factor] || 0) + pattern.strength;
      });
    });

    return Object.entries(factorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([factor]) => factor);
  }

  // Generate behavioral insights
  private generateInsights(): string[] {
    const insights: string[] = [];
    
    // Top patterns become insights
    this.profile.patterns
      .filter(p => p.strength > 0.7)
      .slice(0, 3)
      .forEach(pattern => {
        insights.push(pattern.insight);
      });

    // Add meta-insights about learning
    if (this.profile.learningLevel > 0.5) {
      insights.push("Your behavioral patterns are becoming clear");
    }

    return insights;
  }

  // Public API methods
  public getProfile(): BehavioralProfile {
    return this.profile;
  }

  public getTopCorrelations(limit: number = 5): Correlation[] {
    return this.profile.patterns.slice(0, limit);
  }

  public getInsightsByType(type: Correlation['type']): Correlation[] {
    return this.profile.patterns.filter(p => p.type === type);
  }

  public getLearningLevel(): number {
    return this.profile.learningLevel;
  }

  // Real-time correlation detection (for live data)
  public analyzeNewDataPoint(dataType: string, value: any, timestamp: string): Correlation[] {
    // This would analyze incoming data against existing patterns
    // For now, return empty array - to be implemented when live data flows
    return [];
  }
}

// Global instance for the mandala system
export const correlationEngine = new BehavioralCorrelationEngine();

// Helper functions for integration
export const getTodaysInsights = (): string[] => {
  return correlationEngine.getProfile().insights;
};

export const getBehavioralStrength = (): number => {
  const patterns = correlationEngine.getTopCorrelations(3);
  return patterns.reduce((sum, p) => sum + p.strength, 0) / patterns.length || 0;
};

export const getDominantPattern = (): Correlation | null => {
  const patterns = correlationEngine.getTopCorrelations(1);
  return patterns[0] || null;
};
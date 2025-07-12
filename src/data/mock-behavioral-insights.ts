/**
 * (c) 2025 Cosmic Life Mandala – Mock Behavioral Insights
 * Sample correlation data for testing the intelligence engine
 */

import { CorrelationInsight } from '../components/insights/BehavioralInsightCard';

export const mockBehavioralInsights: CorrelationInsight[] = [
  {
    type: "sleep_mood",
    icon: "moon",
    text: "You tend to feel irritable after less than 6 hours of sleep",
    confidence: 0.82,
    source: ["sleep", "mood"],
    timeScope: "last 7 days"
  },
  {
    type: "weather_energy",
    icon: "sun",
    text: "Sunny days improve your energy levels and overall well-being",
    confidence: 0.76,
    source: ["weather", "mood"],
    timeScope: "last 7 days"
  },
  {
    type: "mobility_focus",
    icon: "home",
    text: "Staying close to home correlates with feeling more centered and calm",
    confidence: 0.71,
    source: ["location", "mood"],
    timeScope: "last 7 days"
  },
  {
    type: "planning_emotion",
    icon: "calendar",
    text: "Creative work sessions align with your 'Inspired' mood state",
    confidence: 0.85,
    source: ["plans", "mood"],
    timeScope: "last 7 days"
  },
  {
    type: "temporal_pattern",
    icon: "brain",
    text: "Your essence flourishes on weekends with a +15 point average increase",
    confidence: 0.68,
    source: ["day_of_week", "essence"],
    timeScope: "last 7 days"
  },
  {
    type: "sleep_mood",
    icon: "moon",
    text: "Morning mood improves significantly after 4+ hours of deep sleep",
    confidence: 0.79,
    source: ["deep_sleep", "morning_mood"],
    timeScope: "last 7 days"
  },
  {
    type: "weather_energy",
    icon: "activity",
    text: "Active mornings (8-11am) correlate with better overall well-being",
    confidence: 0.73,
    source: ["morning_activity", "essence"],
    timeScope: "last 7 days"
  },
  {
    type: "mobility_focus",
    icon: "heart",
    text: "Social plans in the evening boost your emotional resonance",
    confidence: 0.66,
    source: ["social_plans", "mood"],
    timeScope: "last 7 days"
  }
];

// Helper function to get today's most relevant insights
export const getTodaysRelevantInsights = (limit: number = 5): CorrelationInsight[] => {
  return mockBehavioralInsights
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit);
};

// Helper function to get insights by type
export const getInsightsByType = (type: CorrelationInsight['type']): CorrelationInsight[] => {
  return mockBehavioralInsights.filter(insight => insight.type === type);
};

// Helper function to get high-confidence insights
export const getHighConfidenceInsights = (threshold: number = 0.75): CorrelationInsight[] => {
  return mockBehavioralInsights.filter(insight => insight.confidence >= threshold);
};
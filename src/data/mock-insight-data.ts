/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { Insight } from '@/utils/insight-engine';

export const mockInsightData: Insight[] = [
  // Day view insights
  {
    id: 'day-sleep-1',
    text: "You sleep more deeply on colder nights",
    sourceLayer: 'sleep',
    viewContext: 'day',
    confidence: 0.85,
    position: { angle: 45, radius: 200 },
    triggerCondition: 'hover'
  },
  {
    id: 'day-mood-1',
    text: "Rainy days lift your creative mood",
    sourceLayer: 'mood',
    viewContext: 'day',
    confidence: 0.78,
    position: { angle: 135, radius: 220 },
    triggerCondition: 'hover'
  },
  {
    id: 'day-mobility-1',
    text: "Morning walks boost afternoon energy",
    sourceLayer: 'mobility',
    viewContext: 'day',
    confidence: 0.91,
    position: { angle: 225, radius: 190 },
    triggerCondition: 'click'
  },
  {
    id: 'day-weather-1',
    text: "Sunny mornings inspire longer outdoor time",
    sourceLayer: 'weather',
    viewContext: 'day',
    confidence: 0.82,
    position: { angle: 315, radius: 210 },
    triggerCondition: 'hover'
  },

  // Week view insights
  {
    id: 'week-pattern-1',
    text: "Tuesdays are your most active days",
    sourceLayer: 'mobility',
    viewContext: 'week',
    confidence: 0.89,
    position: { angle: 90, radius: 180 },
    triggerCondition: 'viewSwitch'
  },
  {
    id: 'week-social-1',
    text: "Fridays are your most social orbit",
    sourceLayer: 'social',
    viewContext: 'week',
    confidence: 0.76,
    position: { angle: 270, radius: 200 },
    triggerCondition: 'viewSwitch'
  },
  {
    id: 'week-sleep-1',
    text: "Weekend sleep patterns shift later",
    sourceLayer: 'sleep',
    viewContext: 'week',
    confidence: 0.83,
    position: { angle: 180, radius: 190 },
    triggerCondition: 'always'
  },

  // Month view insights
  {
    id: 'month-mood-1',
    text: "Mid-month energy peaks consistently",
    sourceLayer: 'mood',
    viewContext: 'month',
    confidence: 0.71,
    position: { angle: 0, radius: 220 },
    triggerCondition: 'viewSwitch'
  },
  {
    id: 'month-weather-1',
    text: "Weather changes affect your weekly rhythm",
    sourceLayer: 'weather',
    viewContext: 'month',
    confidence: 0.68,
    position: { angle: 120, radius: 200 },
    triggerCondition: 'click'
  },
  {
    id: 'month-activity-1',
    text: "Monthly cycles show 3-week productive waves",
    sourceLayer: 'mobility',
    viewContext: 'month',
    confidence: 0.74,
    position: { angle: 240, radius: 210 },
    triggerCondition: 'always'
  },

  // Year view insights
  {
    id: 'year-seasonal-1',
    text: "Spring awakens your creative cycles",
    sourceLayer: 'mood',
    viewContext: 'year',
    confidence: 0.87,
    position: { angle: 60, radius: 250 },
    triggerCondition: 'viewSwitch'
  },
  {
    id: 'year-sleep-1',
    text: "Winter deepens your rest patterns",
    sourceLayer: 'sleep',
    viewContext: 'year',
    confidence: 0.92,
    position: { angle: 300, radius: 240 },
    triggerCondition: 'viewSwitch'
  },
  {
    id: 'year-social-1',
    text: "Summer expands your social orbit",
    sourceLayer: 'social',
    viewContext: 'year',
    confidence: 0.79,
    position: { angle: 150, radius: 230 },
    triggerCondition: 'always'
  },
  {
    id: 'year-activity-1',
    text: "Autumn brings focused momentum",
    sourceLayer: 'mobility',
    viewContext: 'year',
    confidence: 0.81,
    position: { angle: 210, radius: 220 },
    triggerCondition: 'click'
  },

  // Cross-scale insights (always visible)
  {
    id: 'meta-pattern-1',
    text: "Your energy follows lunar rhythms",
    sourceLayer: 'mood',
    viewContext: 'day',
    confidence: 0.65,
    position: { angle: 0, radius: 160 },
    triggerCondition: 'always'
  },
  {
    id: 'meta-weather-1',
    text: "Barometric pressure influences your sleep depth",
    sourceLayer: 'weather',
    viewContext: 'day',
    confidence: 0.73,
    position: { angle: 180, radius: 170 },
    triggerCondition: 'click'
  }
];

// Insight generation utilities
export const generateInsightForLayer = (
  layer: string,
  viewContext: 'day' | 'week' | 'month' | 'year',
  confidence: number = 0.7
): Insight => {
  const insights = {
    sleep: [
      "Deep sleep correlates with cooler temperatures",
      "REM cycles sync with your evening routine",
      "Weekend sleep shifts reflect natural rhythms"
    ],
    mood: [
      "Creative peaks follow morning light exposure",
      "Social connections amplify positive moods",
      "Seasonal changes mirror emotional patterns"
    ],
    mobility: [
      "Movement clusters in productive time windows",
      "Walking patterns reveal favorite thinking routes",
      "Activity levels reflect energy management"
    ],
    weather: [
      "Atmospheric pressure influences your decisions",
      "Cloudy days invite introspective activities",
      "Sunshine duration affects evening energy"
    ],
    social: [
      "Connection frequency follows weekly rhythms",
      "Meaningful conversations cluster around meals",
      "Social energy mirrors seasonal cycles"
    ]
  };

  const layerInsights = insights[layer as keyof typeof insights] || ["Pattern detected in your data"];
  const randomInsight = layerInsights[Math.floor(Math.random() * layerInsights.length)];
  const randomAngle = Math.random() * 360;
  const randomRadius = 180 + Math.random() * 60;

  return {
    id: `generated-${Date.now()}-${Math.random()}`,
    text: randomInsight,
    sourceLayer: layer as any,
    viewContext,
    confidence,
    position: { angle: randomAngle, radius: randomRadius },
    triggerCondition: 'hover'
  };
};
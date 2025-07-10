/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { DataBlob } from '@/components/data-blob-ring';

export type MoodData = DataBlob;
export type SleepData = DataBlob;
export type MobilityData = DataBlob;
export type WeatherData = {
  hour: number;
  temperature: number;
  condition: string;
  intensity: number;
};

export interface Insight {
  id: string;
  type: 'mood' | 'pattern' | 'weather' | 'habit' | 'correlation' | 'sleep';
  text: string;
  summary: string;
  timeScale: 'day' | 'week' | 'month' | 'year';
  emotion: 'neutral' | 'uplifting' | 'somber' | 'playful' | 'contemplative';
  tone: 'poetic' | 'neutral' | 'playful' | 'reflective';
  originLayer: 'mood' | 'weather' | 'mobility' | 'sleep';
  timeContext: 'morning' | 'evening' | 'weekday' | 'weekend' | 'all-day';
  sourceLayer?: string;
  position?: { angle: number; radius: number };
  theme?: string;
  correlationStrength?: number;
}

interface DataInput {
  mood: MoodData[];
  sleep: SleepData[];
  mobility: MobilityData[];
  weather: WeatherData[];
  timeScale: 'day' | 'week' | 'month' | 'year';
  theme?: string;
}

// Theme-based insight voices
const insightVoices = {
  default: {
    patterns: [
      "Energy flows in gentle waves today",
      "Rest and motion find their balance",
      "Moments of clarity emerge in stillness"
    ],
    correlations: [
      "Sleep quality reflects in afternoon energy",
      "Weather shifts mirror mood transitions",
      "Movement patterns echo inner rhythms"
    ]
  },
  
  noir: {
    patterns: [
      "Shadows lengthen with evening fatigue",
      "City rain matches contemplative mood",
      "Night thoughts surface in data streams"
    ],
    correlations: [
      "Sleep eludes when mind races in darkness",
      "Storms outside mirror inner turbulence",
      "Restless steps echo restless thoughts"
    ]
  },
  
  floral: {
    patterns: [
      "Blossoms of energy in morning light",
      "Petals of rest unfold with sunset",
      "Growth patterns dance with seasons"
    ],
    correlations: [
      "Deep roots of sleep nourish daily blooms",
      "Weather nurtures mood like garden soil",
      "Movement ripples through life's garden"
    ]
  },
  
  techHUD: {
    patterns: [
      "Systems optimal during peak hours",
      "Neural patterns stabilize in REM cycles",
      "Mobility algorithms adapt to environment"
    ],
    correlations: [
      "Sleep quality correlates with processing efficiency",
      "Weather data influences behavioral algorithms",
      "Movement metrics sync with circadian protocols"
    ]
  },
  
  vinyl: {
    patterns: [
      "Rhythms spin at 33⅓ life cycles per day",
      "Analog warmth in digital sleep patterns",
      "Groove deepens with evening rotations"
    ],
    correlations: [
      "Sleep tracks harmonize with dream frequencies",
      "Weather static influences mood recordings",
      "Steps keep time with life's rhythm section"
    ]
  },
  
  pastelParadise: {
    patterns: [
      "Soft hues of energy paint the day",
      "Dreamlike rest in cotton candy clouds",
      "Gentle movements like watercolor flows"
    ],
    correlations: [
      "Sweet dreams color waking energy",
      "Pastel skies match tender moods",
      "Light steps dance through rainbow days"
    ]
  }
};

// Analysis functions
function analyzeMoodPatterns(mood: MoodData[], timeScale: string): string[] {
  const insights: string[] = [];
  
  if (mood.length === 0) return insights;
  
  // Peak energy times
  const peakHour = mood.reduce((max, curr, index) => 
    curr.intensity > mood[max].intensity ? index : max, 0
  );
  
  if (peakHour < 6) {
    insights.push("Energy peaks in early morning stillness");
  } else if (peakHour < 12) {
    insights.push("Morning light brings clarity and focus");
  } else if (peakHour < 18) {
    insights.push("Afternoon rhythms carry creative momentum");
  } else {
    insights.push("Evening energy flows like gentle tide");
  }
  
  // Consistency patterns
  const variance = calculateVariance(mood.map(m => m.intensity));
  if (variance < 0.2) {
    insights.push("Steady rhythms flow through daily cycles");
  } else {
    insights.push("Dynamic energy dances with changing moments");
  }
  
  return insights;
}

function analyzeSleepPatterns(sleep: SleepData[], timeScale: string): string[] {
  const insights: string[] = [];
  
  if (sleep.length === 0) return insights;
  
  const avgQuality = sleep.reduce((sum, s) => sum + s.intensity, 0) / sleep.length;
  
  if (avgQuality > 0.8) {
    insights.push("Deep rest restores and renews");
  } else if (avgQuality > 0.6) {
    insights.push("Sleep flows in gentle waves");
  } else {
    insights.push("Rest seeks deeper stillness");
  }
  
  return insights;
}

function analyzeCorrelations(data: DataInput): string[] {
  const insights: string[] = [];
  
  // Sleep ↔ Mood correlation
  if (data.sleep.length > 0 && data.mood.length > 0) {
    const sleepAvg = data.sleep.reduce((sum, s) => sum + s.intensity, 0) / data.sleep.length;
    const moodAvg = data.mood.reduce((sum, m) => sum + m.intensity, 0) / data.mood.length;
    
    if (Math.abs(sleepAvg - moodAvg) < 0.2) {
      insights.push("Rest and energy dance in harmony");
    } else if (sleepAvg > moodAvg + 0.3) {
      insights.push("Deep sleep awaits its energy bloom");
    } else if (moodAvg > sleepAvg + 0.3) {
      insights.push("High energy seeks deeper restoration");
    }
  }
  
  // Mobility ↔ Mood correlation
  if (data.mobility.length > 0 && data.mood.length > 0) {
    const mobilityAvg = data.mobility.reduce((sum, m) => sum + m.intensity, 0) / data.mobility.length;
    const moodAvg = data.mood.reduce((sum, m) => sum + m.intensity, 0) / data.mood.length;
    
    if (mobilityAvg > 0.7 && moodAvg > 0.7) {
      insights.push("Movement awakens joy and vitality");
    } else if (mobilityAvg < 0.3 && moodAvg > 0.6) {
      insights.push("Stillness nurtures inner brightness");
    } else if (mobilityAvg > 0.6 && moodAvg < 0.4) {
      insights.push("Motion seeks emotional resonance");
    }
  }
  
  // Weather ↔ Activity correlation
  if (data.weather.length > 0 && data.mobility.length > 0) {
    const rainyHours = data.weather.filter(w => w.condition.includes('rain')).length;
    const sunnyHours = data.weather.filter(w => w.condition.includes('sunny')).length;
    const highActivity = data.mobility.filter(m => m.intensity > 0.6).length;
    
    if (rainyHours > 6 && highActivity < 3) {
      insights.push("Rain invites gentle indoor rhythms");
    } else if (sunnyHours > 8 && highActivity > 6) {
      insights.push("Sunshine amplifies movement desires");
    } else if (rainyHours > 3 && highActivity > 5) {
      insights.push("Weather flows, but spirit moves");
    }
  }
  
  return insights;
}

function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
}

function selectInsightsByTheme(insights: string[], theme: string = 'default'): string[] {
  const voice = insightVoices[theme] || insightVoices.default;
  
  // Mix generated insights with theme-specific ones
  const themeInsights = [
    ...voice.patterns.slice(0, 2),
    ...voice.correlations.slice(0, 1)
  ];
  
  return [...insights.slice(0, 3), ...themeInsights.slice(0, 2)];
}

export function generateInsights(data: DataInput): Insight[] {
  const insights: Insight[] = [];
  let id = 0;
  
  // Analyze patterns
  const moodInsights = analyzeMoodPatterns(data.mood, data.timeScale);
  const sleepInsights = analyzeSleepPatterns(data.sleep, data.timeScale);
  const correlationInsights = analyzeCorrelations(data);
  
  // Combine and theme-ize insights
  const allInsightTexts = selectInsightsByTheme([
    ...moodInsights,
    ...sleepInsights,
    ...correlationInsights
  ], data.theme);
  
  // Convert to full insight objects with enhanced metadata
  allInsightTexts.forEach((text, index) => {
    const angle = (index * 72) % 360; // Spread around circle
    const radius = 200 + (index * 30); // Varying distances
    const timeContext = getTimeContext(index);
    const originLayer = index < moodInsights.length ? 'mood' : 
                       index < moodInsights.length + sleepInsights.length ? 'sleep' : 
                       'mobility';
    
    insights.push({
      id: `insight-${id++}`,
      type: index < moodInsights.length ? 'mood' : 
            index < moodInsights.length + sleepInsights.length ? 'pattern' : 'correlation',
      text,
      summary: text.length > 50 ? `${text.substring(0, 50)}...` : text,
      timeScale: data.timeScale,
      emotion: selectEmotion(text, data.theme),
      tone: selectTone(text, data.theme),
      originLayer,
      timeContext,
      sourceLayer: originLayer,
      position: { angle, radius },
      theme: data.theme,
      correlationStrength: index >= moodInsights.length + sleepInsights.length ? 
                          Math.random() * 0.5 + 0.5 : undefined
    });
  });
  
  return insights;
}

function getTimeContext(index: number): Insight['timeContext'] {
  const contexts: Insight['timeContext'][] = ['morning', 'evening', 'weekday', 'weekend', 'all-day'];
  return contexts[index % contexts.length];
}

function selectTone(text: string, theme?: string): Insight['tone'] {
  const lowerText = text.toLowerCase();
  
  if (theme === 'floral' || theme === 'pastelParadise') return 'poetic';
  if (theme === 'vinyl' || theme === 'techHUD') return 'playful';
  if (theme === 'noir') return 'reflective';
  
  if (lowerText.includes('dance') || lowerText.includes('flow')) return 'poetic';
  if (lowerText.includes('sync') || lowerText.includes('pattern')) return 'neutral';
  
  return 'reflective';
}

function selectEmotion(text: string, theme?: string): Insight['emotion'] {
  // Simple keyword-based emotion detection
  const uplifting = ['bloom', 'clarity', 'energy', 'bright', 'harmony', 'dance', 'flow'];
  const contemplative = ['stillness', 'deep', 'gentle', 'quiet', 'rest', 'reflect'];
  const playful = ['dance', 'rhythm', 'bounce', 'sparkle', 'groove'];
  const somber = ['shadow', 'dark', 'heavy', 'struggle', 'turbulent'];
  
  const lowerText = text.toLowerCase();
  
  if (uplifting.some(word => lowerText.includes(word))) return 'uplifting';
  if (playful.some(word => lowerText.includes(word))) return 'playful';
  if (somber.some(word => lowerText.includes(word))) return 'somber';
  if (contemplative.some(word => lowerText.includes(word))) return 'contemplative';
  
  return 'neutral';
}
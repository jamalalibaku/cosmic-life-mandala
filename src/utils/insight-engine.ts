/**
 * [Phase: ZIP9-Beta | Lap 4: Interactive Insight & Response Logic]
 * Insight Engine - AI-driven reflection and correlation analysis
 * 
 * Purpose: Generate insights from slice interactions and data patterns
 * Features: Stub for future AI integration, correlation detection, reflection prompts
 * Dependencies: layer-interconnection utils, temporal data structures
 */

import { updateUserProfile, generateProgressiveInsight, getUserInsightProfile } from './insight-memory';

// Legacy compatibility interface for existing components
export interface Insight {
  id: string;
  text: string;
  sourceLayer: string;
  viewContext: string;
  confidence: number;
  position: { angle: number; radius: number };
  triggerCondition: string;
  timeScale?: string;
  emotion?: string;
  type?: string;
  summary?: string;
  tone?: string;
  correlationStrength?: number;
  timeContext?: string;
}

export interface SliceInsightData {
  slice: any;
  layerType: string;
  timestamp: string;
  dataValue: any;
  angle: number;
}

export interface InsightResponse {
  type: 'correlation' | 'pattern' | 'anomaly' | 'reflection';
  message: string;
  confidence: number;
  relatedLayers: string[];
  actionSuggestion?: string;
}

/**
 * Trigger insight generation for a clicked slice
 * Uses progressive learning system that builds depth over time
 */
export const triggerInsightPrompt = (sliceData: SliceInsightData, timeSlices?: any[]): InsightResponse => {
  console.log('🧠 Insight Engine triggered:', sliceData);
  
  const { layerType, dataValue, timestamp } = sliceData;
  
  // Get real correlations if we have time slice data
  let correlations: Record<string, number> = {};
  if (timeSlices && timeSlices.length > 1) {
    correlations = analyzeLayerCorrelations(timeSlices, layerType);
  }
  
  // Update user profile and get progressive insights
  const updatedProfile = updateUserProfile({
    layerType,
    timestamp,
    correlations,
    userEngagement: 'medium' // Could be enhanced with actual engagement tracking
  });
  
  // Generate progressive insight based on user's sophistication level
  const progressiveInsight = generateProgressiveInsight(
    layerType, 
    dataValue, 
    correlations, 
    updatedProfile
  );
  
  console.log('🧠 Progressive insight generated:', progressiveInsight);
  console.log('🧠 User sophistication level:', updatedProfile.sophisticationLevel);
  
  // Convert to InsightResponse format
  const relatedLayers = Object.keys(correlations)
    .filter(key => key.startsWith(layerType))
    .map(key => key.split('-')[1])
    .slice(0, 3);
  
  const insights: InsightResponse = {
    type: updatedProfile.sophisticationLevel >= 3 ? 'pattern' : 'correlation',
    message: progressiveInsight.message,
    confidence: progressiveInsight.confidence,
    relatedLayers,
    actionSuggestion: progressiveInsight.actionSuggestions[0] || 'Continue exploring patterns'
  };
  
  console.log('🧠 Final insight response:', insights);
  
  return insights;
};

/**
 * Generate data-driven insights using real correlation analysis
 */
const generateDataDrivenInsight = (
  layerType: string, 
  dataValue: any, 
  correlations: Record<string, number>
): InsightResponse => {
  const getCorrelationStrength = (correlation: number): string => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'strong';
    if (abs >= 0.5) return 'moderate';
    if (abs >= 0.3) return 'weak';
    return 'minimal';
  };

  const getCorrelationDirection = (correlation: number): string => {
    return correlation > 0 ? 'positive' : 'negative';
  };

  // Find strongest correlations for this layer
  const layerCorrelations = Object.entries(correlations)
    .filter(([key]) => key.startsWith(layerType))
    .map(([key, value]) => ({
      targetLayer: key.split('-')[1],
      correlation: value,
      strength: getCorrelationStrength(value),
      direction: getCorrelationDirection(value)
    }))
    .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));

  const strongestCorrelation = layerCorrelations[0];

  switch (layerType) {
    case 'mood':
      const moodValue = dataValue?.valence || dataValue?.intensity || 0.5;
      const moodLevel = moodValue > 0.7 ? 'high' : moodValue > 0.4 ? 'moderate' : 'low';
      
      if (strongestCorrelation && Math.abs(strongestCorrelation.correlation) > 0.3) {
        return {
          type: 'correlation',
          message: `Your mood was ${moodLevel} here. This shows a ${strongestCorrelation.strength} ${strongestCorrelation.direction} correlation (${Math.round(strongestCorrelation.correlation * 100)}%) with your ${strongestCorrelation.targetLayer}.`,
          confidence: 0.6 + Math.abs(strongestCorrelation.correlation) * 0.3,
          relatedLayers: [strongestCorrelation.targetLayer],
          actionSuggestion: `Explore how ${strongestCorrelation.targetLayer} patterns might be influencing your mood`
        };
      }
      
      return {
        type: 'reflection',
        message: `Your mood was ${moodLevel} at this time. What factors might have contributed to this?`,
        confidence: 0.6,
        relatedLayers: ['sleep', 'weather', 'mobility'],
        actionSuggestion: 'Look for patterns in surrounding hours'
      };
      
    case 'sleep':
      const sleepValue = dataValue?.quality || dataValue?.intensity || 0.5;
      const sleepQuality = sleepValue > 0.7 ? 'excellent' : sleepValue > 0.4 ? 'moderate' : 'poor';
      
      if (strongestCorrelation && Math.abs(strongestCorrelation.correlation) > 0.3) {
        return {
          type: 'correlation',
          message: `Sleep quality was ${sleepQuality} (${Math.round(sleepValue * 100)}%). Data shows ${strongestCorrelation.strength} correlation (${Math.round(strongestCorrelation.correlation * 100)}%) with ${strongestCorrelation.targetLayer}.`,
          confidence: 0.7 + Math.abs(strongestCorrelation.correlation) * 0.2,
          relatedLayers: [strongestCorrelation.targetLayer],
          actionSuggestion: `Check ${strongestCorrelation.targetLayer} patterns around sleep times`
        };
      }
      
      return {
        type: 'pattern',
        message: `Sleep quality was ${sleepQuality} (${Math.round(sleepValue * 100)}%). How did this affect your next day?`,
        confidence: 0.7,
        relatedLayers: ['mood', 'mobility'],
        actionSuggestion: 'Compare with next day\'s energy and mood'
      };
      
    case 'mobility':
      const mobilityValue = dataValue?.intensity || 0.5;
      const activityLevel = mobilityValue > 0.7 ? 'high' : mobilityValue > 0.4 ? 'moderate' : 'low';
      
      if (strongestCorrelation && Math.abs(strongestCorrelation.correlation) > 0.3) {
        return {
          type: 'correlation',
          message: `Activity was ${activityLevel} here. This correlates ${strongestCorrelation.direction}ly (${Math.round(strongestCorrelation.correlation * 100)}%) with ${strongestCorrelation.targetLayer}.`,
          confidence: 0.6 + Math.abs(strongestCorrelation.correlation) * 0.3,
          relatedLayers: [strongestCorrelation.targetLayer],
          actionSuggestion: `Examine the relationship between activity and ${strongestCorrelation.targetLayer}`
        };
      }
      
      return {
        type: 'reflection',
        message: `Your activity level was ${activityLevel}. What influenced your movement patterns?`,
        confidence: 0.6,
        relatedLayers: ['mood', 'weather'],
        actionSuggestion: 'Look for external factors affecting activity'
      };
      
    case 'weather':
      const weatherCondition = dataValue?.condition || 'unclear';
      const weatherIntensity = dataValue?.intensity || 0.5;
      
      if (strongestCorrelation && Math.abs(strongestCorrelation.correlation) > 0.3) {
        return {
          type: 'correlation',
          message: `Weather was ${weatherCondition}. Shows ${strongestCorrelation.strength} impact (${Math.round(strongestCorrelation.correlation * 100)}%) on your ${strongestCorrelation.targetLayer}.`,
          confidence: 0.5 + Math.abs(strongestCorrelation.correlation) * 0.4,
          relatedLayers: [strongestCorrelation.targetLayer],
          actionSuggestion: `Notice how weather affects your ${strongestCorrelation.targetLayer}`
        };
      }
      
      return {
        type: 'reflection',
        message: `Weather was ${weatherCondition}. How did environmental conditions influence your day?`,
        confidence: 0.5,
        relatedLayers: ['mood', 'mobility'],
        actionSuggestion: 'Track weather impact on wellbeing'
      };
      
    default:
      return {
        type: 'reflection',
        message: 'Interesting data point. What patterns do you notice in this timeframe?',
        confidence: 0.4,
        relatedLayers: layerCorrelations.slice(0, 2).map(c => c.targetLayer),
        actionSuggestion: 'Explore connections with other data layers'
      };
  }
};

/**
 * Generate mock insights based on layer type and data
 * Fallback for when correlation data is unavailable
 */
const generateMockInsight = (layerType: string, dataValue: any): InsightResponse => {
  switch (layerType) {
    case 'mood':
      return {
        type: 'correlation',
        message: `Mood was ${dataValue?.valence > 0.5 ? 'positive' : 'low'} here. Could sleep quality have influenced it?`,
        confidence: 0.7,
        relatedLayers: ['sleep', 'weather'],
        actionSuggestion: 'Check sleep patterns around this time'
      };
      
    case 'sleep':
      return {
        type: 'pattern',
        message: `Sleep quality: ${Math.round((dataValue?.quality || 0.5) * 100)}%. Notice any mood patterns the next day?`,
        confidence: 0.8,
        relatedLayers: ['mood', 'mobility'],
        actionSuggestion: 'Compare with tomorrow\'s energy levels'
      };
      
    case 'weather':
      return {
        type: 'reflection',
        message: `${dataValue?.condition || 'Weather'} day. How did this affect your mobility and mood?`,
        confidence: 0.6,
        relatedLayers: ['mood', 'mobility'],
        actionSuggestion: 'Look for weather-mood connections'
      };
      
    default:
      return {
        type: 'reflection',
        message: `Interesting moment here. What was happening in your life around this time?`,
        confidence: 0.5,
        relatedLayers: [],
        actionSuggestion: 'Explore related time periods'
      };
  }
};

/**
 * Analyze cross-layer correlations for deeper insights
 * Real statistical correlation analysis between data layers
 */
export const analyzeLayerCorrelations = (timeSlices: any[], focusLayer: string) => {
  console.log('🧠 Analyzing correlations for layer:', focusLayer);
  
  if (!timeSlices || timeSlices.length < 2) {
    return {};
  }

  const correlations: Record<string, number> = {};
  
  // Extract data for correlation analysis
  const extractLayerValues = (layer: string): number[] => {
    return timeSlices.map(slice => {
      const data = slice.data?.[layer];
      if (!data) return 0;
      
      switch (layer) {
        case 'mood':
          return data.valence || data.intensity || 0;
        case 'sleep':
          return data.quality || data.intensity || 0;
        case 'mobility':
          return data.intensity || 0;
        case 'weather':
          return data.intensity || 0.5;
        default:
          return data.intensity || data.value || 0;
      }
    });
  };

  // Calculate Pearson correlation coefficient
  const calculateCorrelation = (x: number[], y: number[]): number => {
    if (x.length !== y.length || x.length < 2) return 0;
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    if (denominator === 0) return 0;
    return numerator / denominator;
  };

  // Analyze all layer pairs
  const layers = ['mood', 'sleep', 'mobility', 'weather'];
  const focusData = extractLayerValues(focusLayer);
  
  layers.forEach(otherLayer => {
    if (otherLayer !== focusLayer) {
      const otherData = extractLayerValues(otherLayer);
      const correlation = calculateCorrelation(focusData, otherData);
      correlations[`${focusLayer}-${otherLayer}`] = Math.round(correlation * 100) / 100;
    }
  });

  return correlations;
};

/**
 * Detect patterns across different time scales
 * Analyzes trends, cycles, and anomalies in user data
 */
export const detectTemporalPatterns = (timeSlices: any[], layerType: string, timeScale: 'hour' | 'day' | 'week' = 'day') => {
  if (!timeSlices || timeSlices.length < 3) return null;

  // Extract values for pattern analysis
  const extractValues = (layer: string): { time: number; value: number }[] => {
    return timeSlices.map((slice, index) => ({
      time: index,
      value: (() => {
        const data = slice.data?.[layer];
        if (!data) return 0;
        switch (layer) {
          case 'mood': return data.valence || data.intensity || 0;
          case 'sleep': return data.quality || data.intensity || 0;
          case 'mobility': return data.intensity || 0;
          case 'weather': return data.intensity || 0.5;
          default: return data.intensity || data.value || 0;
        }
      })()
    }));
  };

  const values = extractValues(layerType);
  
  // Calculate trend (linear regression slope)
  const calculateTrend = (data: { time: number; value: number }[]): number => {
    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + d.time, 0);
    const sumY = data.reduce((sum, d) => sum + d.value, 0);
    const sumXY = data.reduce((sum, d) => sum + d.time * d.value, 0);
    const sumX2 = data.reduce((sum, d) => sum + d.time * d.time, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return isNaN(slope) ? 0 : slope;
  };

  // Detect cycles (simple peak detection)
  const detectCycles = (data: { time: number; value: number }[]): { period: number; strength: number } | null => {
    if (data.length < 6) return null;
    
    const findPeaks = (values: number[]): number[] => {
      const peaks: number[] = [];
      for (let i = 1; i < values.length - 1; i++) {
        if (values[i] > values[i-1] && values[i] > values[i+1]) {
          peaks.push(i);
        }
      }
      return peaks;
    };

    const valueArray = data.map(d => d.value);
    const peaks = findPeaks(valueArray);
    
    if (peaks.length < 2) return null;
    
    // Calculate most common interval between peaks
    const intervals = peaks.slice(1).map((peak, i) => peak - peaks[i]);
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    
    return {
      period: Math.round(avgInterval),
      strength: 1 - (Math.std(intervals) / avgInterval || 0)
    };
  };

  // Detect anomalies (values beyond 2 standard deviations)
  const detectAnomalies = (data: { time: number; value: number }[]): number[] => {
    const values = data.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return data
      .map((d, i) => Math.abs(d.value - mean) > 2 * stdDev ? i : -1)
      .filter(i => i !== -1);
  };

  const trend = calculateTrend(values);
  const cycles = detectCycles(values);
  const anomalies = detectAnomalies(values);

  return {
    trend: {
      direction: trend > 0.05 ? 'increasing' : trend < -0.05 ? 'decreasing' : 'stable',
      strength: Math.abs(trend),
      slope: trend
    },
    cycles: cycles || { period: 0, strength: 0 },
    anomalies: {
      count: anomalies.length,
      indices: anomalies,
      percentage: (anomalies.length / values.length) * 100
    },
    timeScale,
    sampleSize: values.length
  };
};

// Add Math.std helper if not available
declare global {
  interface Math {
    std(values: number[]): number;
  }
}

Math.std = function(values: number[]): number {
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
};

/**
 * Generate reflection questions based on interaction patterns and detected patterns
 * Personalized based on user behavior and data trends
 */
export const generateReflectionPrompts = (
  interactionHistory: SliceInsightData[], 
  patterns?: ReturnType<typeof detectTemporalPatterns>
): string => {
  
  if (!interactionHistory || interactionHistory.length === 0) {
    return "What patterns do you notice in your daily rhythms?";
  }

  // Analyze interaction behavior
  const layerFrequency = interactionHistory.reduce((acc, interaction) => {
    acc[interaction.layerType] = (acc[interaction.layerType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostExploredLayer = Object.entries(layerFrequency)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];

  const totalInteractions = interactionHistory.length;
  const recentInteractions = interactionHistory.slice(-5);
  
  // Analyze time patterns in interactions
  const interactionTimes = interactionHistory.map(i => new Date(i.timestamp).getHours());
  const commonHours = interactionTimes.reduce((acc, hour) => {
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const peakInteractionHour = Object.entries(commonHours)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];

  // Generate personalized prompts based on behavior patterns
  const behaviorPrompts: string[] = [];

  // Based on most explored layer
  if (mostExploredLayer) {
    switch (mostExploredLayer) {
      case 'mood':
        behaviorPrompts.push(
          "You've been exploring your mood patterns frequently. What emotional triggers are you most curious about?",
          "Your mood data seems to fascinate you. What have you discovered about your emotional rhythms?",
          "You often check your mood insights. Are there specific times when your emotions feel most unpredictable?"
        );
        break;
      case 'sleep':
        behaviorPrompts.push(
          "Sleep appears to be a key focus for you. How has tracking these patterns changed your bedtime routine?",
          "You frequently explore sleep data. What connections have you noticed with your energy levels?",
          "Your sleep patterns draw your attention often. Are there habits you're trying to optimize?"
        );
        break;
      case 'mobility':
        behaviorPrompts.push(
          "Movement data captures your interest regularly. What activity patterns surprise you most?",
          "You often examine your mobility insights. How does your activity align with your energy goals?",
          "Physical activity seems important to you. What motivates your movement on different days?"
        );
        break;
      case 'weather':
        behaviorPrompts.push(
          "Weather patterns intrigue you. How much do environmental conditions influence your planning?",
          "You frequently check weather correlations. Are you a person who adapts easily to climate changes?",
          "Environmental data draws your attention. What weather conditions bring out your best self?"
        );
        break;
    }
  }

  // Based on interaction frequency
  if (totalInteractions > 10) {
    behaviorPrompts.push(
      "You're a dedicated data explorer! What's the most surprising pattern you've discovered about yourself?",
      "With so much exploration, you're becoming a self-awareness expert. What would you tell someone just starting to track their life?",
      "Your consistent curiosity is impressive. Which insights have actually changed your daily behavior?"
    );
  } else if (totalInteractions > 5) {
    behaviorPrompts.push(
      "You're developing a good habit of self-reflection. What questions are you hoping your data will answer?",
      "Your growing exploration shows real commitment. What patterns are starting to emerge for you?",
      "You're building momentum in understanding yourself. What aspect of your life feels most mysterious still?"
    );
  }

  // Based on time patterns
  if (peakInteractionHour) {
    const hour = parseInt(peakInteractionHour);
    if (hour >= 6 && hour <= 9) {
      behaviorPrompts.push("You often reflect in the morning. How does reviewing your data influence your day ahead?");
    } else if (hour >= 18 && hour <= 22) {
      behaviorPrompts.push("Evening reflection seems natural to you. What helps you process the day's patterns?");
    } else if (hour >= 22 || hour <= 2) {
      behaviorPrompts.push("Late-night exploration of your data - are you a natural night owl, or is something keeping you curious?");
    }
  }

  // Based on detected patterns
  if (patterns) {
    if (patterns.trend.direction === 'increasing') {
      behaviorPrompts.push(`Your ${mostExploredLayer} shows an upward trend. What positive changes might be contributing to this?`);
    } else if (patterns.trend.direction === 'decreasing') {
      behaviorPrompts.push(`There's a declining pattern in your ${mostExploredLayer}. What factors might be influencing this shift?`);
    }
    
    if (patterns.cycles.strength > 0.6) {
      behaviorPrompts.push(`Your data shows strong cyclical patterns. How aware were you of these rhythms before tracking them?`);
    }
    
    if (patterns.anomalies.percentage > 15) {
      behaviorPrompts.push(`You have quite a few data anomalies. Are you someone who thrives on variety, or do these surprise you?`);
    }
  }

  // Recent interaction patterns
  const recentLayers = [...new Set(recentInteractions.map(i => i.layerType))];
  if (recentLayers.length === 1) {
    behaviorPrompts.push(`You've been focused on ${recentLayers[0]} lately. What's drawing your attention to this area?`);
  } else if (recentLayers.length >= 3) {
    behaviorPrompts.push("You're exploring multiple areas recently. Are you looking for connections between different aspects of your life?");
  }

  // Fallback prompts for edge cases
  const fallbackPrompts = [
    "What aspect of your daily rhythm would you most like to understand better?",
    "If you could change one pattern in your life, what would it be?",
    "What external factors have the biggest impact on your wellbeing?",
    "How has tracking your life data changed your self-awareness?",
    "What would your ideal daily rhythm look like?"
  ];

  // Select a prompt
  const allPrompts = behaviorPrompts.length > 0 ? behaviorPrompts : fallbackPrompts;
  const selectedPrompt = allPrompts[Math.floor(Math.random() * allPrompts.length)];
  
  return selectedPrompt;
};

/**
 * Legacy compatibility function for existing code
 * Generate insights for display in orbit rings
 */
export const generateInsights = (data: any): Insight[] => {
  // Mock insights for compatibility with all required fields
  return [
    {
      id: 'mock-1',
      text: 'Sleep quality affects morning mood',
      sourceLayer: 'sleep',
      viewContext: 'day',
      confidence: 0.8,
      position: { angle: 45, radius: 150 },
      triggerCondition: 'hover',
      timeScale: data.timeScale || 'day',
      emotion: 'calm',
      type: 'correlation',
      summary: 'Sleep quality affects morning mood patterns',
      tone: 'analytical',
      correlationStrength: 0.8,
      timeContext: data.timeScale || 'day'
    },
    {
      id: 'mock-2',
      text: 'Weather patterns influence mobility',
      sourceLayer: 'weather',
      viewContext: 'day',
      confidence: 0.7,
      position: { angle: 135, radius: 180 },
      triggerCondition: 'hover',
      timeScale: data.timeScale || 'day',
      emotion: 'neutral',
      type: 'pattern',
      summary: 'Weather patterns influence daily mobility choices',
      tone: 'observational',
      correlationStrength: 0.7,
      timeContext: data.timeScale || 'day'
    }
  ];
};
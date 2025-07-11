/**
 * [Phase: ZIP9-Beta | Lap 4: Interactive Insight & Response Logic]
 * Insight Engine - AI-driven reflection and correlation analysis
 * 
 * Purpose: Generate insights from slice interactions and data patterns
 * Features: Stub for future AI integration, correlation detection, reflection prompts
 * Dependencies: layer-interconnection utils, temporal data structures
 */

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

interface SliceInsightData {
  slice: any;
  layerType: string;
  timestamp: string;
  dataValue: any;
  angle: number;
}

interface InsightResponse {
  type: 'correlation' | 'pattern' | 'anomaly' | 'reflection';
  message: string;
  confidence: number;
  relatedLayers: string[];
  actionSuggestion?: string;
}

/**
 * Trigger insight generation for a clicked slice
 * Uses real correlation analysis and pattern detection
 */
export const triggerInsightPrompt = (sliceData: SliceInsightData, timeSlices?: any[]): InsightResponse => {
  console.log('🧠 Insight Engine triggered:', sliceData);
  
  const { layerType, dataValue, timestamp } = sliceData;
  
  // Get real correlations if we have time slice data
  let correlations: Record<string, number> = {};
  if (timeSlices && timeSlices.length > 1) {
    correlations = analyzeLayerCorrelations(timeSlices, layerType);
  }
  
  // Generate insights using real data analysis
  const insights = generateDataDrivenInsight(layerType, dataValue, correlations);
  
  console.log('🧠 Generated insight:', insights);
  
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
 * Generate reflection questions based on interaction patterns
 * Future: Personalized based on user behavior and data trends
 */
export const generateReflectionPrompts = (interactionHistory: SliceInsightData[]) => {
  const prompts = [
    "What patterns do you notice in your sleep and mood?",
    "How does weather influence your daily activities?",
    "When do you feel most energized during the week?",
    "What external factors affect your wellbeing most?"
  ];
  
  // Future: AI-generated personalized prompts based on data
  return prompts[Math.floor(Math.random() * prompts.length)];
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
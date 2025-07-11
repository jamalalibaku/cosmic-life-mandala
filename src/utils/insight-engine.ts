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
 * Currently returns mock insights - will integrate with AI in future laps
 */
export const triggerInsightPrompt = (sliceData: SliceInsightData): InsightResponse => {
  console.log('🧠 Insight Engine triggered:', sliceData);
  
  const { layerType, dataValue, timestamp } = sliceData;
  
  // Mock insight generation based on layer type and data
  const insights = generateMockInsight(layerType, dataValue);
  
  console.log('🧠 Generated insight:', insights);
  
  return insights;
};

/**
 * Generate mock insights based on layer type and data
 * This will be replaced with actual AI calls in future laps
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
 * Future: Use statistical analysis and ML pattern recognition
 */
export const analyzeLayerCorrelations = (timeSlices: any[], focusLayer: string) => {
  console.log('🧠 Analyzing correlations for layer:', focusLayer);
  
  // Mock correlation analysis
  const correlations = {
    'mood-sleep': 0.65,
    'weather-mobility': 0.48,
    'sleep-energy': 0.72
  };
  
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
export type LifePhase = 
  | 'awakening' 
  | 'building' 
  | 'flowing' 
  | 'deepening' 
  | 'integrating' 
  | 'releasing' 
  | 'renewing';

export interface LifePhaseProfile {
  currentPhase: LifePhase;
  phaseStability: number; // 0-1 confidence
  transitionReadiness: number; // 0-1 curve detection
  phaseHistory: Array<{
    phase: LifePhase;
    startDate: string;
    endDate?: string;
    intensity: number;
  }>;
  emotionalTone: 'gentle' | 'celebratory' | 'contemplative' | 'supportive' | 'encouraging';
  insights: string[];
}

export interface LifePhaseTheme {
  name: string;
  description: string;
  color: string;
  icon: string;
  keywords: string[];
}

export const LifePhaseThemeMap: Record<LifePhase, LifePhaseTheme> = {
  awakening: {
    name: 'Awakening',
    description: 'New awareness is stirring. You\'re becoming conscious of deeper patterns.',
    color: 'hsl(var(--chart-1))',
    icon: '🌅',
    keywords: ['discovery', 'curiosity', 'questions', 'wonder']
  },
  building: {
    name: 'Building',
    description: 'You\'re constructing something meaningful. Each action builds toward your vision.',
    color: 'hsl(var(--chart-2))',
    icon: '🏗️',
    keywords: ['action', 'creation', 'momentum', 'purpose']
  },
  flowing: {
    name: 'Flowing',
    description: 'Trust your intuitive rhythm. You\'re in natural harmony with your patterns.',
    color: 'hsl(var(--chart-3))',
    icon: '🌊',
    keywords: ['ease', 'rhythm', 'natural', 'harmony']
  },
  deepening: {
    name: 'Deepening',
    description: 'Your inward turn is not withdrawal — it\'s preparation for wisdom.',
    color: 'hsl(var(--chart-4))',
    icon: '🔮',
    keywords: ['reflection', 'inner work', 'wisdom', 'contemplation']
  },
  integrating: {
    name: 'Integrating',
    description: 'You\'re weaving together all you\'ve learned into a coherent whole.',
    color: 'hsl(var(--chart-5))',
    icon: '🧬',
    keywords: ['synthesis', 'wholeness', 'connection', 'integration']
  },
  releasing: {
    name: 'Releasing',
    description: 'Letting go creates space for what wants to emerge. Trust the process.',
    color: 'hsl(var(--muted))',
    icon: '🍃',
    keywords: ['letting go', 'transformation', 'space', 'renewal']
  },
  renewing: {
    name: 'Renewing',
    description: 'Fresh energy is returning. You\'re ready for a new cycle of growth.',
    color: 'hsl(var(--primary))',
    icon: '🌱',
    keywords: ['renewal', 'fresh start', 'energy', 'growth']
  }
};

export function detectLifePhase(
  userProfile: any,
  interactions: any[]
): LifePhaseProfile {
  const recentInteractions = interactions.slice(-50); // Last 50 interactions
  const sophisticationLevel = userProfile?.sophisticationLevel || 1;
  
  // Analyze interaction patterns
  const patterns = analyzeInteractionPatterns(recentInteractions);
  const behaviorMetrics = calculateBehaviorMetrics(patterns, userProfile);
  
  // Determine current phase
  const currentPhase = determinePhase(behaviorMetrics, sophisticationLevel);
  
  // Calculate stability and transition readiness
  const phaseStability = calculatePhaseStability(patterns, currentPhase);
  const transitionReadiness = calculateTransitionReadiness(patterns, behaviorMetrics);
  
  // Generate phase history (simplified for now)
  const phaseHistory = generatePhaseHistory(userProfile, currentPhase);
  
  // Determine emotional tone
  const emotionalTone = determineEmotionalTone(currentPhase, behaviorMetrics, sophisticationLevel);
  
  // Generate phase insights
  const insights = generatePhaseInsights(currentPhase, behaviorMetrics, sophisticationLevel);
  
  return {
    currentPhase,
    phaseStability,
    transitionReadiness,
    phaseHistory,
    emotionalTone,
    insights
  };
}

function analyzeInteractionPatterns(interactions: any[]) {
  if (!interactions.length) return { layerPreferences: {}, timePatterns: {}, engagement: 0 };
  
  // Analyze layer preferences
  const layerCounts = interactions.reduce((acc, interaction) => {
    acc[interaction.layerType] = (acc[interaction.layerType] || 0) + 1;
    return acc;
  }, {});
  
  // Analyze time patterns
  const timePatterns = interactions.reduce((acc, interaction) => {
    const hour = new Date(interaction.timestamp).getHours();
    const timeOfDay = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    acc[timeOfDay] = (acc[timeOfDay] || 0) + 1;
    return acc;
  }, {});
  
  // Calculate engagement level
  const avgDuration = interactions.reduce((sum, i) => sum + (i.duration || 30), 0) / interactions.length;
  const engagement = Math.min(avgDuration / 60, 1); // Normalize to 0-1
  
  return {
    layerPreferences: layerCounts,
    timePatterns,
    engagement
  };
}

function calculateBehaviorMetrics(patterns: any, userProfile: any) {
  const layerPrefValues = Object.values(patterns.layerPreferences || {}) as number[];
  const totalInteractions = layerPrefValues.reduce((a, b) => a + b, 0) || 1;
  const introspectionScore = (patterns.layerPreferences?.mood || 0) / totalInteractions;
  const actionScore = (patterns.layerPreferences?.mobility || 0) / totalInteractions;
  const stabilityScore = patterns.engagement || 0;
  const explorationScore = Object.keys(patterns.layerPreferences || {}).length / 5; // Max 5 layers
  
  return {
    introspection: introspectionScore,
    action: actionScore,
    stability: stabilityScore,
    exploration: explorationScore,
    sophistication: userProfile?.sophisticationLevel || 1
  };
}

function determinePhase(metrics: any, sophisticationLevel: number): LifePhase {
  const { introspection, action, stability, exploration } = metrics;
  
  // Phase determination logic based on behavioral patterns
  if (exploration > 0.7 && sophisticationLevel <= 2) return 'awakening';
  if (action > 0.6 && stability > 0.5) return 'building';
  if (stability > 0.7 && introspection < 0.6) return 'flowing';
  if (introspection > 0.6 && sophisticationLevel >= 3) return 'deepening';
  if (exploration > 0.5 && sophisticationLevel >= 4) return 'integrating';
  if (stability < 0.4 && introspection > 0.5) return 'releasing';
  
  return 'renewing'; // Default/transition phase
}

function calculatePhaseStability(patterns: any, currentPhase: LifePhase): number {
  // Simplified stability calculation
  const consistency = patterns.engagement * 0.7 + (Object.keys(patterns.layerPreferences).length > 0 ? 0.3 : 0);
  return Math.min(consistency, 1);
}

function calculateTransitionReadiness(patterns: any, metrics: any): number {
  // Detect if user is ready for phase transition
  const variability = 1 - metrics.stability;
  const exploration = metrics.exploration;
  return Math.min((variability + exploration) / 2, 1);
}

function generatePhaseHistory(userProfile: any, currentPhase: LifePhase) {
  // Return simple mock history - actual persistence will be handled by the component
  return [
    {
      phase: currentPhase,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: undefined,
      intensity: 0.8,
      transitionReason: undefined
    }
  ];
}

function determineEmotionalTone(phase: LifePhase, metrics: any, sophisticationLevel: number): LifePhaseProfile['emotionalTone'] {
  if (phase === 'awakening') return 'encouraging';
  if (phase === 'building') return 'celebratory';
  if (phase === 'flowing') return 'gentle';
  if (phase === 'deepening') return 'contemplative';
  if (phase === 'integrating') return 'supportive';
  if (phase === 'releasing') return 'gentle';
  return 'encouraging'; // renewing
}

function generatePhaseInsights(phase: LifePhase, metrics: any, sophisticationLevel: number): string[] {
  const theme = LifePhaseThemeMap[phase];
  const insights = [];
  
  if (sophisticationLevel <= 2) {
    insights.push(`You're in a ${theme.name.toLowerCase()} phase. ${theme.description}`);
  } else {
    insights.push(`${theme.description}`);
    insights.push(`This ${theme.name.toLowerCase()} energy invites you to honor your ${theme.keywords[0]} and ${theme.keywords[1]}.`);
  }
  
  return insights;
}
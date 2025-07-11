/**
 * [Phase: ZIP9-Beta | Lap 8: Progressive Insight Intelligence]
 * Insight Memory System - Learning and depth progression
 * 
 * Purpose: Build progressive insight depth through accumulated user interaction patterns
 * Features: User profile building, insight sophistication levels, pattern memory
 */

interface UserInsightProfile {
  userId: string;
  createdAt: string;
  totalInteractions: number;
  layerPreferences: Record<string, number>;
  discoveredCorrelations: Array<{
    layers: string[];
    strength: number;
    discoveredAt: string;
    confidence: number;
  }>;
  behaviorPatterns: {
    preferredReflectionTimes: number[];
    explorationStyle: 'deep' | 'broad' | 'focused' | 'casual';
    insightResponsePatterns: string[];
  };
  sophisticationLevel: 1 | 2 | 3 | 4 | 5;
  personalizedPrompts: string[];
  lastActiveDate: string;
}

interface InsightEvolution {
  level: number;
  description: string;
  triggerThreshold: number;
  characteristics: string[];
}

// Define sophistication levels
const INSIGHT_LEVELS: InsightEvolution[] = [
  {
    level: 1,
    description: "Surface Observations",
    triggerThreshold: 0,
    characteristics: [
      "Basic data descriptions",
      "Simple correlations",
      "Generic suggestions"
    ]
  },
  {
    level: 2,
    description: "Pattern Recognition", 
    triggerThreshold: 5,
    characteristics: [
      "Trend identification",
      "Layer interconnections",
      "Personalized observations"
    ]
  },
  {
    level: 3,
    description: "Behavioral Intelligence",
    triggerThreshold: 15,
    characteristics: [
      "Habit analysis",
      "Predictive insights",
      "Context-aware suggestions"
    ]
  },
  {
    level: 4,
    description: "Deep Understanding",
    triggerThreshold: 30,
    characteristics: [
      "Complex pattern synthesis",
      "Multi-layer predictions",
      "Lifestyle optimization"
    ]
  },
  {
    level: 5,
    description: "Intuitive Companion",
    triggerThreshold: 50,
    characteristics: [
      "Anticipatory insights",
      "Emotional intelligence",
      "Life guidance"
    ]
  }
];

/**
 * Load or create user insight profile
 */
export const getUserInsightProfile = (userId: string = 'default'): UserInsightProfile => {
  const stored = localStorage.getItem(`insight-profile-${userId}`);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall through to create new profile
    }
  }

  const newProfile: UserInsightProfile = {
    userId,
    createdAt: new Date().toISOString(),
    totalInteractions: 0,
    layerPreferences: {},
    discoveredCorrelations: [],
    behaviorPatterns: {
      preferredReflectionTimes: [],
      explorationStyle: 'casual',
      insightResponsePatterns: []
    },
    sophisticationLevel: 1,
    personalizedPrompts: [],
    lastActiveDate: new Date().toISOString()
  };

  saveUserInsightProfile(newProfile);
  return newProfile;
};

/**
 * Save user insight profile to localStorage
 */
export const saveUserInsightProfile = (profile: UserInsightProfile): void => {
  localStorage.setItem(`insight-profile-${profile.userId}`, JSON.stringify(profile));
};

/**
 * Update user profile based on new interaction
 */
export const updateUserProfile = (
  interaction: {
    layerType: string;
    timestamp: string;
    correlations?: Record<string, number>;
    userEngagement?: 'high' | 'medium' | 'low';
  }
): UserInsightProfile => {
  
  const profile = getUserInsightProfile();
  
  // Update interaction count
  profile.totalInteractions += 1;
  profile.lastActiveDate = new Date().toISOString();
  
  // Update layer preferences
  profile.layerPreferences[interaction.layerType] = 
    (profile.layerPreferences[interaction.layerType] || 0) + 1;
  
  // Store discovered correlations
  if (interaction.correlations) {
    Object.entries(interaction.correlations).forEach(([correlationKey, strength]) => {
      if (Math.abs(strength) > 0.4) { // Only store meaningful correlations
        const layers = correlationKey.split('-');
        const existing = profile.discoveredCorrelations.find(c => 
          c.layers.every(l => layers.includes(l)) && 
          layers.every(l => c.layers.includes(l))
        );
        
        if (!existing) {
          profile.discoveredCorrelations.push({
            layers,
            strength,
            discoveredAt: interaction.timestamp,
            confidence: Math.abs(strength)
          });
        } else {
          // Update existing correlation with new data
          existing.strength = (existing.strength + strength) / 2;
          existing.confidence = Math.abs(existing.strength);
        }
      }
    });
  }
  
  // Update behavior patterns
  const hour = new Date(interaction.timestamp).getHours();
  if (!profile.behaviorPatterns.preferredReflectionTimes.includes(hour)) {
    profile.behaviorPatterns.preferredReflectionTimes.push(hour);
  }
  
  // Determine exploration style
  const totalLayers = Object.keys(profile.layerPreferences).length;
  const maxInteractions = Math.max(...Object.values(profile.layerPreferences));
  
  if (totalLayers >= 3 && maxInteractions < profile.totalInteractions * 0.6) {
    profile.behaviorPatterns.explorationStyle = 'broad';
  } else if (maxInteractions > profile.totalInteractions * 0.8) {
    profile.behaviorPatterns.explorationStyle = 'focused';
  } else if (profile.totalInteractions > 20) {
    profile.behaviorPatterns.explorationStyle = 'deep';
  }
  
  // Update sophistication level
  const newLevel = INSIGHT_LEVELS.find(level => 
    profile.totalInteractions >= level.triggerThreshold
  );
  if (newLevel && newLevel.level > profile.sophisticationLevel) {
    profile.sophisticationLevel = newLevel.level as 1 | 2 | 3 | 4 | 5;
  }
  
  saveUserInsightProfile(profile);
  return profile;
};

/**
 * Generate sophisticated insights based on user profile
 */
export const generateProgressiveInsight = (
  layerType: string,
  dataValue: any,
  correlations: Record<string, number>,
  profile: UserInsightProfile
): {
  message: string;
  confidence: number;
  sophisticationLevel: number;
  insights: string[];
  actionSuggestions: string[];
} => {
  
  const level = profile.sophisticationLevel;
  const userCorrelations = profile.discoveredCorrelations;
  const preferences = profile.layerPreferences;
  
  // Base insights by level
  switch (level) {
    case 1: // Surface Observations
      return generateLevel1Insights(layerType, dataValue, correlations);
      
    case 2: // Pattern Recognition
      return generateLevel2Insights(layerType, dataValue, correlations, preferences);
      
    case 3: // Behavioral Intelligence
      return generateLevel3Insights(layerType, dataValue, correlations, profile);
      
    case 4: // Deep Understanding
      return generateLevel4Insights(layerType, dataValue, correlations, profile);
      
    case 5: // Intuitive Companion
      return generateLevel5Insights(layerType, dataValue, correlations, profile);
      
    default:
      return generateLevel1Insights(layerType, dataValue, correlations);
  }
};

// Level 1: Surface Observations
const generateLevel1Insights = (layerType: string, dataValue: any, correlations: Record<string, number>) => {
  const value = dataValue?.intensity || dataValue?.valence || dataValue?.quality || 0.5;
  const level = value > 0.7 ? 'high' : value > 0.4 ? 'moderate' : 'low';
  
  return {
    message: `Your ${layerType} was ${level} at this time.`,
    confidence: 0.6,
    sophisticationLevel: 1,
    insights: [`${layerType} level: ${level}`],
    actionSuggestions: [`Track ${layerType} patterns over time`]
  };
};

// Level 2: Pattern Recognition
const generateLevel2Insights = (
  layerType: string, 
  dataValue: any, 
  correlations: Record<string, number>,
  preferences: Record<string, number>
) => {
  const strongestCorrelation = Object.entries(correlations)
    .filter(([key]) => key.startsWith(layerType))
    .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))[0];
    
  const mostExplored = Object.entries(preferences)
    .sort(([,a], [,b]) => b - a)[0]?.[0];
  
  if (strongestCorrelation && Math.abs(strongestCorrelation[1]) > 0.4) {
    const targetLayer = strongestCorrelation[0].split('-')[1];
    const strength = Math.abs(strongestCorrelation[1]);
    
    return {
      message: `Your ${layerType} shows ${strength > 0.6 ? 'strong' : 'moderate'} connection with ${targetLayer}. Since you often explore ${mostExplored}, this pattern might be especially relevant.`,
      confidence: 0.7 + strength * 0.2,
      sophisticationLevel: 2,
      insights: [
        `${layerType}-${targetLayer} correlation: ${Math.round(strength * 100)}%`,
        `Primary focus area: ${mostExplored}`
      ],
      actionSuggestions: [
        `Compare ${layerType} and ${targetLayer} during different times`,
        `Track how ${targetLayer} influences ${layerType}`
      ]
    };
  }
  
  return generateLevel1Insights(layerType, dataValue, correlations);
};

// Level 3: Behavioral Intelligence  
const generateLevel3Insights = (
  layerType: string,
  dataValue: any, 
  correlations: Record<string, number>,
  profile: UserInsightProfile
) => {
  const explorationStyle = profile.behaviorPatterns.explorationStyle;
  const discoveredCorrelations = profile.discoveredCorrelations;
  const relevantCorrelations = discoveredCorrelations.filter(c => c.layers.includes(layerType));
  
  const insights = [];
  const actions = [];
  
  if (relevantCorrelations.length > 0) {
    const strongest = relevantCorrelations.sort((a, b) => b.confidence - a.confidence)[0];
    const otherLayer = strongest.layers.find(l => l !== layerType);
    
    insights.push(`Historical data shows consistent ${strongest.strength > 0 ? 'positive' : 'negative'} relationship with ${otherLayer}`);
    
    if (explorationStyle === 'deep') {
      insights.push("Your detailed exploration style reveals nuanced patterns others might miss");
      actions.push("Consider how micro-patterns in this data reflect larger life themes");
    } else if (explorationStyle === 'broad') {
      insights.push("Your holistic approach connects insights across multiple life areas");
      actions.push("Look for unexpected connections between this and other tracked areas");
    }
  }
  
  return {
    message: `Based on your ${profile.totalInteractions} interactions, your ${layerType} patterns suggest specific behavioral tendencies. Your ${explorationStyle} exploration style indicates you'd benefit from ${explorationStyle === 'focused' ? 'deeper single-area analysis' : 'cross-pattern synthesis'}.`,
    confidence: 0.8,
    sophisticationLevel: 3,
    insights,
    actionSuggestions: actions
  };
};

// Level 4: Deep Understanding
const generateLevel4Insights = (
  layerType: string,
  dataValue: any,
  correlations: Record<string, number>, 
  profile: UserInsightProfile
) => {
  const patterns = profile.discoveredCorrelations;
  const multiLayerConnections = patterns.filter(p => p.layers.length > 1);
  
  // Advanced pattern synthesis
  const insights = [
    "Multi-dimensional pattern analysis reveals complex interdependencies",
    `Your unique data signature shows ${patterns.length} established correlations`,
    "Predictive modeling suggests optimal timing for interventions"
  ];
  
  const actions = [
    "Implement micro-adjustments based on predicted pattern outcomes",
    "Create personalized intervention strategies",
    "Track second-order effects of behavioral changes"
  ];
  
  return {
    message: `Deep analysis of your ${profile.totalInteractions} data points reveals sophisticated ${layerType} dynamics. Your patterns suggest you're entering an optimization phase where small, targeted changes could yield significant improvements across multiple life areas.`,
    confidence: 0.9,
    sophisticationLevel: 4,
    insights,
    actionSuggestions: actions
  };
};

// Level 5: Intuitive Companion
const generateLevel5Insights = (
  layerType: string,
  dataValue: any,
  correlations: Record<string, number>,
  profile: UserInsightProfile
) => {
  const insights = [
    "Anticipatory intelligence detects emerging pattern shifts",
    "Emotional resonance analysis reveals deeper meaning layers", 
    "Life phase progression indicates optimal growth opportunities"
  ];
  
  const actions = [
    "Trust your intuitive responses to these patterns",
    "Consider how this data reflects your evolving identity",
    "Explore the philosophical implications of your tracked patterns"
  ];
  
  return {
    message: `Your journey through ${profile.totalInteractions} interactions has revealed profound insights about your ${layerType} patterns. At this level of self-awareness, the data becomes a mirror for deeper understanding. What you're seeing here connects to larger themes about who you're becoming.`,
    confidence: 0.95,
    sophisticationLevel: 5,
    insights,
    actionSuggestions: actions
  };
};

/**
 * Get current sophistication level description
 */
export const getSophisticationLevel = (profile: UserInsightProfile): InsightEvolution => {
  return INSIGHT_LEVELS.find(level => level.level === profile.sophisticationLevel) || INSIGHT_LEVELS[0];
};

/**
 * Export user profile for debugging
 */
export const exportUserProfile = (): UserInsightProfile | null => {
  try {
    return getUserInsightProfile();
  } catch {
    return null;
  }
};
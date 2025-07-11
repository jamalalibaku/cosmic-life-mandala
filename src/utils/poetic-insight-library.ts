/**
 * [Lap 12 – Enhanced Insight Banner]
 * Poetic Insight Library - Varied messaging for AI awareness notifications
 */

import { LifePhase } from './life-phase-detection';

export interface InsightMessage {
  id: string;
  content: string;
  format: 'haiku' | 'metaphor' | 'affirmation' | 'correlation' | 'poetic';
  tone: 'gentle' | 'playful' | 'analytical' | 'mystical' | 'encouraging';
  triggerContext: 'data_click' | 'correlation_detected' | 'phase_transition' | 'exploration' | 'ambient';
  phaseAlignment?: LifePhase[];
}

export const insightMessageLibrary: InsightMessage[] = [
  // Sleep-related insights
  {
    id: 'sleep-mood-haiku',
    content: 'Deep rest waters\nFlow into morning brightness—\nSleep feeds the soul\'s glow',
    format: 'haiku',
    tone: 'mystical',
    triggerContext: 'correlation_detected',
    phaseAlignment: ['deepening', 'integrating']
  },
  {
    id: 'sleep-metaphor',
    content: 'Your sleep is like soil—the richer it becomes, the more vibrant tomorrow\'s garden grows',
    format: 'metaphor',
    tone: 'gentle',
    triggerContext: 'data_click',
    phaseAlignment: ['awakening', 'flowing']
  },
  {
    id: 'sleep-affirmation',
    content: 'Each hour of rest is an investment in your tomorrow self',
    format: 'affirmation',
    tone: 'encouraging',
    triggerContext: 'exploration'
  },

  // Weather-mobility connections
  {
    id: 'weather-movement-poetic',
    content: 'Rain whispers "stay close to yourself" while sunshine calls "dance with the world"',
    format: 'poetic',
    tone: 'mystical',
    triggerContext: 'correlation_detected',
    phaseAlignment: ['integrating', 'renewing']
  },
  {
    id: 'weather-mobility-correlation',
    content: 'Cloudy skies slow your steps by 23%—your body speaks the language of atmosphere',
    format: 'correlation',
    tone: 'analytical',
    triggerContext: 'data_click',
    phaseAlignment: ['deepening', 'awakening']
  },

  // Mood patterns
  {
    id: 'mood-rhythm-haiku',
    content: 'Emotions spiral\nLike seasons in a single\nDay—all storms pass through',
    format: 'haiku',
    tone: 'gentle',
    triggerContext: 'exploration',
    phaseAlignment: ['integrating', 'renewing']
  },
  {
    id: 'mood-growth-metaphor',
    content: 'Your emotional landscape shifts like dunes—what feels permanent is just the current arrangement of moments',
    format: 'metaphor',
    tone: 'mystical',
    triggerContext: 'phase_transition'
  },

  // Multi-layer correlations
  {
    id: 'holistic-pattern-poetic',
    content: 'Sleep, movement, and mood dance together in your personal constellation of being',
    format: 'poetic',
    tone: 'encouraging',
    triggerContext: 'correlation_detected',
    phaseAlignment: ['integrating', 'flowing']
  },
  {
    id: 'system-awareness-mystical',
    content: 'You are not separate elements but one flowing system—watch how sleep feeds mood, mood shapes movement, movement returns to rest',
    format: 'poetic',
    tone: 'mystical',
    triggerContext: 'ambient'
  },

  // Playful and encouraging
  {
    id: 'exploration-celebration',
    content: 'Your curiosity is mapping the invisible architecture of your days ✨',
    format: 'affirmation',
    tone: 'playful',
    triggerContext: 'exploration',
    phaseAlignment: ['awakening', 'flowing']
  },
  {
    id: 'pattern-recognition-playful',
    content: 'Plot twist: Your Tuesday mood wasn\'t random—it followed last Monday\'s sleep like a faithful shadow',
    format: 'correlation',
    tone: 'playful',
    triggerContext: 'correlation_detected'
  },

  // Phase-specific insights
  {
    id: 'deep-focus-affirmation',
    content: 'In the quietude of focus, your patterns reveal their deepest truths',
    format: 'affirmation',
    tone: 'gentle',
    triggerContext: 'ambient',
    phaseAlignment: ['deepening']
  },
  {
    id: 'creative-synthesis-mystical',
    content: 'Ideas weave\nthrough data streams like light\nthrough forest leaves',
    format: 'haiku',
    tone: 'mystical',
    triggerContext: 'ambient',
    phaseAlignment: ['integrating']
  },
  {
    id: 'social-expansion-encouraging',
    content: 'Your connections ripple outward—see how interaction shapes your inner rhythms',
    format: 'poetic',
    tone: 'encouraging',
    triggerContext: 'exploration',
    phaseAlignment: ['flowing']
  },

  // Ambient wisdom
  {
    id: 'time-spiral-mystical',
    content: 'Time spirals rather than marches—yesterday\'s patterns echo in tomorrow\'s possibilities',
    format: 'metaphor',
    tone: 'mystical',
    triggerContext: 'ambient'
  },
  {
    id: 'data-as-poetry',
    content: 'Your data points are pixels in the artwork of your becoming',
    format: 'poetic',
    tone: 'encouraging',
    triggerContext: 'data_click'
  }
];

export interface InsightSelectionOptions {
  currentPhase?: LifePhase;
  recentTriggers?: string[];
  explorationStyle?: 'gentle' | 'analytical' | 'intuitive' | 'playful';
  excludeRecent?: string[];
}

export function selectInsightMessage(
  triggerContext: InsightMessage['triggerContext'],
  options: InsightSelectionOptions = {}
): InsightMessage | null {
  const { currentPhase, explorationStyle, excludeRecent = [] } = options;
  
  // Filter messages by trigger context
  let candidates = insightMessageLibrary.filter(
    msg => msg.triggerContext === triggerContext && !excludeRecent.includes(msg.id)
  );
  
  // Filter by phase alignment if provided
  if (currentPhase) {
    const phaseAligned = candidates.filter(msg => 
      !msg.phaseAlignment || msg.phaseAlignment.includes(currentPhase)
    );
    
    if (phaseAligned.length > 0) {
      candidates = phaseAligned;
    }
  }
  
  // Prefer tone matching exploration style
  if (explorationStyle) {
    const toneMap: Record<string, InsightMessage['tone'][]> = {
      gentle: ['gentle', 'mystical'],
      analytical: ['analytical', 'encouraging'],
      intuitive: ['mystical', 'gentle'],
      playful: ['playful', 'encouraging']
    };
    
    const preferredTones = toneMap[explorationStyle] || [];
    const toneMatched = candidates.filter(msg => preferredTones.includes(msg.tone));
    
    if (toneMatched.length > 0) {
      candidates = toneMatched;
    }
  }
  
  if (candidates.length === 0) {
    return null;
  }
  
  // Return random selection from filtered candidates
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function formatInsightForDisplay(message: InsightMessage): string {
  switch (message.format) {
    case 'haiku':
      return message.content; // Already formatted with line breaks
    case 'metaphor':
    case 'poetic':
      return message.content;
    case 'affirmation':
      return `💫 ${message.content}`;
    case 'correlation':
      return `🔗 ${message.content}`;
    default:
      return message.content;
  }
}
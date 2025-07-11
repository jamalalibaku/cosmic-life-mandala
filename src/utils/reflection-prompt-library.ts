/**
 * [Lap 12: Future Jamal Features]
 * Reflection Prompt Library - Modular prompt system
 * 
 * Purpose: Generate contextual reflection prompts based on phase, sophistication, recent activity
 * Features: Phase-aware prompts, sophistication levels, interaction history
 */

import { LifePhase } from './life-phase-detection';

export interface ReflectionContext {
  phase?: LifePhase | null;
  sophisticationLevel: number;
  recentInteractions: Array<{
    layerType: string;
    timestamp: string;
    dataValue: any;
  }>;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  sessionDuration?: number; // in minutes
  lastPromptResponse?: string;
}

export interface ReflectionPrompt {
  text: string;
  poeticHint?: string;
  followUpQuestions?: string[];
  category: 'awareness' | 'integration' | 'exploration' | 'wisdom' | 'action';
  sophisticationLevel: number;
  contextTags: string[];
}

// Base prompts for different sophistication levels
const sophisticationPrompts: Record<number, string[]> = {
  1: [
    "What are you noticing right now?",
    "How does this moment feel?",
    "What's drawing your attention?",
    "What do you sense in your body?"
  ],
  2: [
    "What patterns are you becoming aware of?",
    "How has your perspective shifted recently?",
    "What connections are you starting to see?",
    "What's different about your understanding now?"
  ],
  3: [
    "What deeper rhythms are you sensing in your life?",
    "How are different aspects of your experience connecting?",
    "What wisdom is emerging from your observations?",
    "What questions are becoming more important to you?"
  ],
  4: [
    "How are you integrating your growing awareness into daily life?",
    "What subtle influences are you becoming conscious of?",
    "How is your relationship with uncertainty evolving?",
    "What's your relationship with the patterns you've discovered?"
  ],
  5: [
    "How are you embodying your deepest understanding?",
    "What paradoxes are you learning to hold?",
    "How is your awareness informing your choices?",
    "What would you share with someone just beginning this journey?"
  ]
};

// Phase-specific prompt templates
const phasePrompts: Record<LifePhase, {
  core: string[];
  sophisticated: string[];
  poeticHints: string[];
}> = {
  awakening: {
    core: [
      "What new awareness is stirring within you?",
      "What feels different about your perception lately?",
      "What has been calling for your attention?"
    ],
    sophisticated: [
      "How is this awakening reshaping your understanding of yourself?",
      "What old assumptions are being questioned by this new awareness?",
      "How does this emerging consciousness want to express itself?"
    ],
    poeticHints: [
      "Dawn breaks differently when the dreamer awakens...",
      "The first light reveals what was always there...",
      "Something ancient remembers itself in you..."
    ]
  },
  
  building: {
    core: [
      "What are you consciously creating in your life?",
      "How are you directing your energy today?",
      "What foundations are you strengthening?"
    ],
    sophisticated: [
      "How is your intention manifesting through your choices?",
      "What creative tension is driving your current projects?",
      "How are you balancing structure with organic growth?"
    ],
    poeticHints: [
      "Every masterpiece begins with intention and clay...",
      "The architect's vision lives in patient hands...",
      "What you build builds you in return..."
    ]
  },

  flowing: {
    core: [
      "How does your natural rhythm feel today?",
      "What wants to move through you right now?",
      "Where do you feel most in harmony?"
    ],
    sophisticated: [
      "How are you navigating the dance between effort and ease?",
      "What is the quality of your flow when you're not forcing?",
      "How does your inner rhythm align with life's larger patterns?"
    ],
    poeticHints: [
      "The river knows its course without maps...",
      "Grace appears when resistance dissolves...",
      "You are both the dancer and the dance..."
    ]
  },

  deepening: {
    core: [
      "What wisdom is quietly emerging?",
      "How has your understanding deepened lately?",
      "What truth feels ready to surface?"
    ],
    sophisticated: [
      "How are you relating to the mystery that remains unknowable?",
      "What are you learning about the nature of depth itself?",
      "How does contemplation change the quality of your presence?"
    ],
    poeticHints: [
      "The well deepens with each question asked...",
      "Wisdom accumulates like sediment in still water...",
      "The pearl forms in darkness before it shines..."
    ]
  },

  integrating: {
    core: [
      "How are different aspects of your life connecting?",
      "What pieces are coming together for you?",
      "How do you feel your wholeness today?"
    ],
    sophisticated: [
      "How are paradoxes resolving into larger truths?",
      "What is the quality of unity you're experiencing?",
      "How does integration change your relationship to fragmentation?"
    ],
    poeticHints: [
      "The tapestry reveals its pattern to patient eyes...",
      "Harmony emerges from acknowledged diversity...",
      "The circle completes itself in its own time..."
    ]
  },

  releasing: {
    core: [
      "What feels ready to be released?",
      "How does it feel to let go right now?",
      "What are you making space for?"
    ],
    sophisticated: [
      "How are you distinguishing between surrender and abandonment?",
      "What is the wisdom in this particular releasing?",
      "How does letting go reveal what was always free?"
    ],
    poeticHints: [
      "Empty hands can receive the unexpected gift...",
      "The river releases to reach the sea...",
      "In letting go, what was true remains..."
    ]
  },

  renewing: {
    core: [
      "What fresh energy do you notice?",
      "How are you feeling renewed lately?",
      "What new chapter wants to begin?"
    ],
    sophisticated: [
      "How is renewal different from starting over?",
      "What cyclical wisdom are you embodying?",
      "How does this renewal honor what came before?"
    ],
    poeticHints: [
      "Spring begins before winter fully ends...",
      "The spiral returns but never repeats...",
      "Every ending is a beginning in disguise..."
    ]
  }
};

// Context-aware prompt selection
export function getReflectionPrompt(context: ReflectionContext): ReflectionPrompt {
  const { phase, sophisticationLevel, recentInteractions, timeOfDay, sessionDuration } = context;
  
  // Determine prompt category based on context
  let category: ReflectionPrompt['category'] = 'awareness';
  
  if (sophisticationLevel >= 4) {
    category = 'wisdom';
  } else if (sophisticationLevel >= 3) {
    category = 'integration';
  } else if (recentInteractions.length > 3) {
    category = 'exploration';
  }

  // Select base prompt
  let promptText: string;
  let poeticHint: string | undefined;
  let contextTags: string[] = [];

  if (phase && phasePrompts[phase]) {
    const phaseData = phasePrompts[phase];
    const isAdvanced = sophisticationLevel >= 3;
    const prompts = isAdvanced ? phaseData.sophisticated : phaseData.core;
    
    promptText = prompts[Math.floor(Math.random() * prompts.length)];
    poeticHint = phaseData.poeticHints[Math.floor(Math.random() * phaseData.poeticHints.length)];
    contextTags.push(`phase:${phase}`);
  } else {
    const levelPrompts = sophisticationPrompts[Math.min(sophisticationLevel, 5)];
    promptText = levelPrompts[Math.floor(Math.random() * levelPrompts.length)];
  }

  // Add time-based modifications
  if (timeOfDay) {
    contextTags.push(`time:${timeOfDay}`);
    
    if (timeOfDay === 'morning') {
      promptText = promptText.replace(/right now|today/, 'as you begin this day');
    } else if (timeOfDay === 'evening') {
      promptText = promptText.replace(/right now|today/, 'as you reflect on today');
    }
  }

  // Add session-based modifications
  if (sessionDuration && sessionDuration > 30) {
    contextTags.push('session:extended');
    if (Math.random() > 0.7) {
      promptText = "After this time of exploration, " + promptText.toLowerCase();
    }
  }

  // Add interaction-based modifications
  if (recentInteractions.length > 0) {
    const dominantLayer = recentInteractions
      .reduce((acc, interaction) => {
        acc[interaction.layerType] = (acc[interaction.layerType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const mostExplored = Object.entries(dominantLayer)
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    if (mostExplored) {
      contextTags.push(`layer:${mostExplored}`);
    }
  }

  // Generate follow-up questions for higher sophistication levels
  const followUpQuestions: string[] = [];
  if (sophisticationLevel >= 3) {
    followUpQuestions.push("How might this awareness guide your next steps?");
    if (sophisticationLevel >= 4) {
      followUpQuestions.push("What would it look like to embody this understanding?");
    }
  }

  return {
    text: promptText,
    poeticHint,
    followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : undefined,
    category,
    sophisticationLevel,
    contextTags
  };
}

// Get prompts for specific contexts
export function getSessionOpeningPrompt(phase?: LifePhase | null): ReflectionPrompt {
  return getReflectionPrompt({
    phase,
    sophisticationLevel: 1,
    recentInteractions: [],
    timeOfDay: new Date().getHours() < 12 ? 'morning' : 'afternoon'
  });
}

export function getSessionClosingPrompt(phase?: LifePhase | null, sessionDuration?: number): ReflectionPrompt {
  return getReflectionPrompt({
    phase,
    sophisticationLevel: 2,
    recentInteractions: [],
    timeOfDay: 'evening',
    sessionDuration
  });
}

export function getTransitionPrompt(fromPhase: LifePhase, toPhase: LifePhase): ReflectionPrompt {
  const transitionPrompts = {
    text: `As you move from ${fromPhase} to ${toPhase}, what do you notice about this transition?`,
    poeticHint: "Every transition is a doorway between worlds...",
    category: 'integration' as const,
    sophisticationLevel: 3,
    contextTags: [`transition:${fromPhase}-${toPhase}`]
  };

  return transitionPrompts;
}
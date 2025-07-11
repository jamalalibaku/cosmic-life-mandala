import { LifePhase } from './life-phase-detection';

export interface Ritual {
  id: string;
  name: string;
  description: string;
  phase: LifePhase;
  duration: number; // in minutes
  intention: string;
  steps: RitualStep[];
  preparationTime: number;
  completionReward: string;
}

export interface RitualStep {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  guidance: string;
  type: 'breathing' | 'reflection' | 'movement' | 'visualization' | 'writing';
}

export interface RitualSession {
  ritualId: string;
  startTime: string;
  endTime?: string;
  reflection?: string;
  energyBefore: number; // 1-10
  energyAfter?: number; // 1-10
  insights: string[];
  phase: LifePhase;
}

const DAWN_AWAKENING: Ritual = {
  id: 'dawn-awakening',
  name: 'Dawn Awakening',
  description: 'Greet new questions with reverence',
  phase: 'awakening',
  duration: 15,
  intention: 'To honor the stirring of new awareness within you',
  preparationTime: 3,
  completionReward: 'You have honored the dawn of new understanding',
  steps: [
    {
      id: 'centering',
      title: 'Sacred Centering',
      description: 'Place your hands on your heart and breathe with intention',
      duration: 3,
      guidance: 'Feel the quiet stirring of curiosity within. What wants to be known?',
      type: 'breathing'
    },
    {
      id: 'questioning',
      title: 'Sacred Questioning',
      description: 'Ask yourself what is awakening in you today',
      duration: 7,
      guidance: 'Let questions arise without needing answers. Honor the mystery.',
      type: 'reflection'
    },
    {
      id: 'dedication',
      title: 'Dedication to Wonder',
      description: 'Dedicate this day to staying curious',
      duration: 5,
      guidance: 'Set an intention to remain open to what wants to unfold.',
      type: 'visualization'
    }
  ]
};

const FOUNDATION_BLESSING: Ritual = {
  id: 'foundation-blessing',
  name: 'Foundation Blessing',
  description: 'Honor building work, however small',
  phase: 'building',
  duration: 12,
  intention: 'To bless the work of your hands and heart',
  preparationTime: 2,
  completionReward: 'Your work is blessed and witnessed',
  steps: [
    {
      id: 'acknowledgment',
      title: 'Acknowledge Your Work',
      description: 'Name what you are building',
      duration: 4,
      guidance: 'Speak aloud or write what you are creating. Honor its importance.',
      type: 'reflection'
    },
    {
      id: 'blessing',
      title: 'Bless Your Tools',
      description: 'Appreciate the means by which you create',
      duration: 4,
      guidance: 'Your hands, your mind, your tools — all are sacred instruments.',
      type: 'visualization'
    },
    {
      id: 'commitment',
      title: 'Renewed Commitment',
      description: 'Commit to taking one meaningful step',
      duration: 4,
      guidance: 'What is the smallest, most loving action you can take today?',
      type: 'reflection'
    }
  ]
};

const FLOW_ATTUNEMENT: Ritual = {
  id: 'flow-attunement',
  name: 'Flow Attunement',
  description: 'Dance with natural rhythms',
  phase: 'flowing',
  duration: 20,
  intention: 'To align with your natural rhythm and flow',
  preparationTime: 5,
  completionReward: 'You are aligned with your natural rhythm',
  steps: [
    {
      id: 'rhythm-sensing',
      title: 'Sense Your Rhythm',
      description: 'Tune into your natural pace',
      duration: 7,
      guidance: 'What is your body telling you about timing? Fast or slow today?',
      type: 'movement'
    },
    {
      id: 'flow-meditation',
      title: 'Flow Meditation',
      description: 'Let thoughts flow like water',
      duration: 8,
      guidance: 'No forcing, no rushing. Simply be with what is.',
      type: 'breathing'
    },
    {
      id: 'rhythm-commitment',
      title: 'Rhythm Commitment',
      description: 'Commit to honoring your natural pace',
      duration: 5,
      guidance: 'How will you honor your natural rhythm today?',
      type: 'reflection'
    }
  ]
};

const DEPTH_DESCENT: Ritual = {
  id: 'depth-descent',
  name: 'Depth Descent',
  description: 'Journey to the inner well of wisdom',
  phase: 'deepening',
  duration: 25,
  intention: 'To descend into the depths of your wisdom',
  preparationTime: 5,
  completionReward: 'You have touched the deep well of wisdom within',
  steps: [
    {
      id: 'preparation',
      title: 'Sacred Preparation',
      description: 'Create a space for deep listening',
      duration: 5,
      guidance: 'Dim the lights, close your eyes, invite silence.',
      type: 'breathing'
    },
    {
      id: 'descent',
      title: 'The Descent',
      description: 'Journey inward to your center',
      duration: 12,
      guidance: 'Go slowly inward. What wisdom lives in your depths?',
      type: 'visualization'
    },
    {
      id: 'wisdom-gathering',
      title: 'Wisdom Gathering',
      description: 'Receive what your depths offer',
      duration: 8,
      guidance: 'What has your inner wisdom revealed? Receive it with gratitude.',
      type: 'writing'
    }
  ]
};

const INTEGRATION_WEAVING: Ritual = {
  id: 'integration-weaving',
  name: 'Integration Weaving',
  description: 'Bring all aspects into wholeness',
  phase: 'integrating',
  duration: 18,
  intention: 'To weave together all parts of yourself into wholeness',
  preparationTime: 3,
  completionReward: 'You have honored your wholeness',
  steps: [
    {
      id: 'gathering',
      title: 'Gathering the Threads',
      description: 'Acknowledge all parts of yourself',
      duration: 6,
      guidance: 'Your light and shadow, strength and vulnerability — all are welcome.',
      type: 'reflection'
    },
    {
      id: 'weaving',
      title: 'The Weaving',
      description: 'Visualize all parts coming together',
      duration: 8,
      guidance: 'See how each part serves the whole. Nothing is wasted.',
      type: 'visualization'
    },
    {
      id: 'wholeness',
      title: 'Celebrating Wholeness',
      description: 'Honor your integrated self',
      duration: 4,
      guidance: 'You are whole, complete, and beautiful exactly as you are.',
      type: 'reflection'
    }
  ]
};

const SACRED_RELEASE: Ritual = {
  id: 'sacred-release',
  name: 'Sacred Release',
  description: 'The art of holy letting go',
  phase: 'releasing',
  duration: 22,
  intention: 'To release what no longer serves with love and gratitude',
  preparationTime: 5,
  completionReward: 'You have created sacred space through loving release',
  steps: [
    {
      id: 'acknowledgment',
      title: 'Acknowledge What Must Go',
      description: 'Name what you are ready to release',
      duration: 7,
      guidance: 'What patterns, relationships, or beliefs are ready to be lovingly released?',
      type: 'writing'
    },
    {
      id: 'gratitude',
      title: 'Gratitude Practice',
      description: 'Thank what you are releasing',
      duration: 8,
      guidance: 'How did this serve you? What did it teach you? Honor its gift.',
      type: 'reflection'
    },
    {
      id: 'release',
      title: 'The Sacred Release',
      description: 'Let go with love',
      duration: 7,
      guidance: 'Breathe out what no longer serves. Create space for what wants to come.',
      type: 'breathing'
    }
  ]
};

const RENEWAL_CELEBRATION: Ritual = {
  id: 'renewal-celebration',
  name: 'Renewal Celebration',
  description: 'Dance with fresh beginnings',
  phase: 'renewing',
  duration: 16,
  intention: 'To celebrate the fresh energy flowing through you',
  preparationTime: 2,
  completionReward: 'You have celebrated your renewal',
  steps: [
    {
      id: 'energy-appreciation',
      title: 'Appreciate Fresh Energy',
      description: 'Feel the new life force within you',
      duration: 5,
      guidance: 'Where do you feel renewed energy in your body? Celebrate it.',
      type: 'movement'
    },
    {
      id: 'possibility-visioning',
      title: 'Vision New Possibilities',
      description: 'Dream what wants to emerge',
      duration: 7,
      guidance: 'What wants to be born through this fresh energy?',
      type: 'visualization'
    },
    {
      id: 'commitment-celebration',
      title: 'Celebrate Commitment',
      description: 'Commit to nurturing this new energy',
      duration: 4,
      guidance: 'How will you tend this fresh beginning with love?',
      type: 'reflection'
    }
  ]
};

export const RITUAL_LIBRARY: Record<LifePhase, Ritual[]> = {
  awakening: [DAWN_AWAKENING],
  building: [FOUNDATION_BLESSING],
  flowing: [FLOW_ATTUNEMENT],
  deepening: [DEPTH_DESCENT],
  integrating: [INTEGRATION_WEAVING],
  releasing: [SACRED_RELEASE],
  renewing: [RENEWAL_CELEBRATION]
};

export function getRitualsForPhase(phase: LifePhase): Ritual[] {
  return RITUAL_LIBRARY[phase] || [];
}

export function getRitualById(ritualId: string): Ritual | undefined {
  for (const rituals of Object.values(RITUAL_LIBRARY)) {
    const ritual = rituals.find(r => r.id === ritualId);
    if (ritual) return ritual;
  }
  return undefined;
}

// Ritual session management
const RITUAL_SESSIONS_KEY = 'ritualSessions';

export function saveRitualSession(session: RitualSession): void {
  const sessions = loadRitualSessions();
  sessions.push(session);
  localStorage.setItem(RITUAL_SESSIONS_KEY, JSON.stringify(sessions));
}

export function loadRitualSessions(): RitualSession[] {
  try {
    const stored = localStorage.getItem(RITUAL_SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getRecentRitualSessions(days: number = 30): RitualSession[] {
  const sessions = loadRitualSessions();
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return sessions.filter(session => new Date(session.startTime) > cutoff);
}
import { LifePhase, LifePhaseProfile } from './life-phase-detection';

export interface PhaseHistoryEntry {
  phaseId: string;
  phase: LifePhase;
  startDate: string;
  endDate?: string;
  intensity: number;
  stabilityScore: number;
  transitionType?: string;
  transitionReason?: string;
  userReflections: string[];
}

export interface PhaseTransition {
  from: LifePhase;
  to: LifePhase;
  timestamp: string;
  strength: number;
}

const PHASE_HISTORY_KEY = 'lifePhaseHistory';
const CURRENT_PHASE_KEY = 'currentLifePhase';

export function savePhaseHistory(history: PhaseHistoryEntry[]): void {
  localStorage.setItem(PHASE_HISTORY_KEY, JSON.stringify(history));
}

export function loadPhaseHistory(): PhaseHistoryEntry[] {
  try {
    const stored = localStorage.getItem(PHASE_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCurrentPhase(phase: LifePhase): void {
  localStorage.setItem(CURRENT_PHASE_KEY, phase);
}

export function loadCurrentPhase(): LifePhase | null {
  return localStorage.getItem(CURRENT_PHASE_KEY) as LifePhase | null;
}

export function detectPhaseTransition(
  previousPhase: LifePhase | null, 
  currentPhase: LifePhase
): PhaseTransition | null {
  if (!previousPhase || previousPhase === currentPhase) {
    return null;
  }
  
  return {
    from: previousPhase,
    to: currentPhase,
    timestamp: new Date().toISOString(),
    strength: 0.8 // Default strength, could be calculated based on stability changes
  };
}

export function updatePhaseHistory(
  currentPhase: LifePhase,
  phaseStability: number
): { history: PhaseHistoryEntry[]; isNewPhase: boolean; transition?: PhaseTransition } {
  const history = loadPhaseHistory();
  const previousPhase = loadCurrentPhase();
  const now = new Date().toISOString();
  
  // Check if this is a new phase
  const transition = detectPhaseTransition(previousPhase, currentPhase);
  const isNewPhase = !!transition;
  
  if (isNewPhase) {
    // Close the previous phase entry if it exists
    if (history.length > 0 && !history[history.length - 1].endDate) {
      history[history.length - 1].endDate = now;
    }
    
    // Add new phase entry
    const newEntry: PhaseHistoryEntry = {
      phaseId: `${currentPhase}-${Date.now()}`,
      phase: currentPhase,
      startDate: now,
      intensity: phaseStability,
      stabilityScore: phaseStability,
      transitionType: transition ? `${transition.from} → ${transition.to}` : undefined,
      transitionReason: transition ? `Transitioned from ${transition.from}` : undefined,
      userReflections: []
    };
    
    history.push(newEntry);
    savePhaseHistory(history);
    saveCurrentPhase(currentPhase);
  } else {
    // Update current phase intensity if it exists
    if (history.length > 0 && !history[history.length - 1].endDate) {
      history[history.length - 1].intensity = Math.max(
        history[history.length - 1].intensity, 
        phaseStability
      );
      savePhaseHistory(history);
    }
  }
  
  return { history, isNewPhase, transition };
}

export function addPhaseReflection(phaseIndex: number, reflection: string): void {
  const history = loadPhaseHistory();
  if (history[phaseIndex]) {
    history[phaseIndex].userReflections.push(reflection);
    savePhaseHistory(history);
  }
}

export function getPhaseTransitionInsight(transition: PhaseTransition): string {
  const transitionMap: Record<string, string> = {
    'awakening->building': 'Your newfound awareness is ready to take form through conscious action.',
    'building->flowing': 'What you\'ve built now seeks its natural rhythm — trust the flow.',
    'flowing->deepening': 'Your harmony opens the door to profound inner wisdom.',
    'deepening->integrating': 'The insights you\'ve gathered are ready to weave into wholeness.',
    'integrating->releasing': 'In wholeness, you find the courage to release what no longer serves.',
    'releasing->renewing': 'The space you\'ve created calls forth fresh possibility.',
    'renewing->awakening': 'Fresh energy brings new awareness — the spiral continues upward.',
    'building->awakening': 'Sometimes we must return to wonder to rediscover our purpose.',
    'deepening->flowing': 'Inner wisdom seeks expression through natural flow.',
    'integrating->building': 'Your integrated understanding is ready for new creation.'
  };
  
  const key = `${transition.from}->${transition.to}`;
  return transitionMap[key] || 
    `You're transitioning from ${transition.from} to ${transition.to} — a natural evolution of your journey.`;
}

export function exportPhaseHistory(): string {
  const history = loadPhaseHistory();
  const currentPhase = loadCurrentPhase();
  
  const exportData = {
    currentPhase,
    phaseHistory: history,
    exportDate: new Date().toISOString(),
    insights: history.map(entry => ({
      phase: entry.phase,
      duration: entry.endDate 
        ? Math.ceil((new Date(entry.endDate).getTime() - new Date(entry.startDate).getTime()) / (1000 * 60 * 60 * 24))
        : 'ongoing',
      reflection: entry.userReflections.join('; ') || 'No reflection recorded',
      intensity: entry.intensity
    }))
  };
  
  return JSON.stringify(exportData, null, 2);
}
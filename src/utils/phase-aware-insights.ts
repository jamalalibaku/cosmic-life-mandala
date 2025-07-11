import { LifePhase, LifePhaseProfile, LifePhaseThemeMap } from './life-phase-detection';

export interface PhaseAwareInsight {
  message: string;
  tone: LifePhaseProfile['emotionalTone'];
  actionInvitation?: string;
  reflectionPrompt?: string;
}

export function generatePhaseAwareInsight(
  phaseProfile: LifePhaseProfile,
  userProfile: any,
  recentInteractions: any[]
): PhaseAwareInsight {
  const { currentPhase, emotionalTone, phaseStability, transitionReadiness } = phaseProfile;
  const theme = LifePhaseThemeMap[currentPhase];
  const sophisticationLevel = userProfile?.sophisticationLevel || 1;
  
  // Generate phase-specific message
  const message = generatePhaseMessage(currentPhase, phaseStability, transitionReadiness, sophisticationLevel);
  
  // Generate optional action invitation
  const actionInvitation = generateActionInvitation(currentPhase, recentInteractions, sophisticationLevel);
  
  // Generate optional reflection prompt
  const reflectionPrompt = generateReflectionPrompt(currentPhase, phaseStability, sophisticationLevel);
  
  return {
    message,
    tone: emotionalTone,
    actionInvitation,
    reflectionPrompt
  };
}

function generatePhaseMessage(
  phase: LifePhase, 
  stability: number, 
  transitionReadiness: number, 
  sophisticationLevel: number
): string {
  const theme = LifePhaseThemeMap[phase];
  const isStable = stability > 0.7;
  const isTransitioning = transitionReadiness > 0.6;
  
  if (sophisticationLevel <= 2) {
    // Simpler, more direct language for beginners
    if (isTransitioning) {
      return `You're in a ${theme.name.toLowerCase()} phase, and something is shifting. ${theme.description}`;
    }
    return `You're in a ${theme.name.toLowerCase()} phase. ${theme.description}`;
  } else {
    // More nuanced language for advanced users
    if (isTransitioning) {
      return `${theme.description} The edges of this ${theme.name.toLowerCase()} phase are softening — change is stirring.`;
    }
    if (isStable) {
      return `${theme.description} You're deeply anchored in this ${theme.name.toLowerCase()} energy.`;
    }
    return theme.description;
  }
}

function generateActionInvitation(
  phase: LifePhase, 
  recentInteractions: any[], 
  sophisticationLevel: number
): string | undefined {
  const hasLowActivity = recentInteractions.length < 10;
  
  switch (phase) {
    case 'awakening':
      return hasLowActivity ? 
        'Consider exploring different data layers to deepen your awareness.' :
        'Trust your curiosity — each exploration reveals something new.';
        
    case 'building':
      return 'Channel this creative energy into consistent daily practices.';
      
    case 'flowing':
      return 'Follow your natural rhythm without forcing anything.';
      
    case 'deepening':
      return sophisticationLevel >= 3 ? 
        'Honor this inward time — insights are composting in the quiet.' :
        'Take time for reflection and inner listening.';
        
    case 'integrating':
      return 'Look for connections between different areas of your life.';
      
    case 'releasing':
      return 'Make space by letting go of what no longer serves you.';
      
    case 'renewing':
      return 'Welcome the fresh energy — something new wants to be born.';
      
    default:
      return undefined;
  }
}

function generateReflectionPrompt(
  phase: LifePhase, 
  stability: number, 
  sophisticationLevel: number
): string | undefined {
  if (sophisticationLevel < 2) return undefined; // Only offer prompts to more engaged users
  
  switch (phase) {
    case 'awakening':
      return 'What patterns are you noticing for the first time?';
      
    case 'building':
      return 'What are you creating, and how does it reflect your deepest values?';
      
    case 'flowing':
      return 'Where do you feel most in harmony with your natural rhythms?';
      
    case 'deepening':
      return 'What wisdom is emerging from this inward time?';
      
    case 'integrating':
      return 'How are the different parts of your life weaving together?';
      
    case 'releasing':
      return 'What are you ready to let go of, and what space will that create?';
      
    case 'renewing':
      return 'What new energy is stirring, and how do you want to welcome it?';
      
    default:
      return undefined;
  }
}

export function getPhaseTransitionInsight(
  previousPhase: LifePhase, 
  currentPhase: LifePhase, 
  sophisticationLevel: number
): string {
  const transitions: Record<string, string> = {
    'awakening->building': 'Your newfound awareness is ready to take form through action.',
    'building->flowing': 'You\'ve built something beautiful — now let it find its natural rhythm.',
    'flowing->deepening': 'Your harmony invites deeper wisdom to emerge.',
    'deepening->integrating': 'Your inner insights are ready to weave into your whole life.',
    'integrating->releasing': 'You\'ve found wholeness — now make space for what\'s next.',
    'releasing->renewing': 'What you\'ve released has created space for fresh possibility.',
    'renewing->awakening': 'Fresh energy brings new awareness — the spiral continues.',
  };
  
  const key = `${previousPhase}->${currentPhase}`;
  return transitions[key] || `You\'re transitioning from ${previousPhase} to ${currentPhase} — trust this natural flow.`;
}
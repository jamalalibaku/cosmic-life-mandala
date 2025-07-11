import { useEffect, useState, useCallback } from 'react';
import { LifePhase, LifePhaseProfile, detectLifePhase } from '@/utils/life-phase-detection';
import { updatePhaseHistory, PhaseTransition } from '@/utils/phase-history-manager';

export interface AwarenessState {
  lastCheck: number;
  phaseUpdateAvailable: boolean;
  insightOpportunity: boolean;
  currentPhase: LifePhase | null;
  awarenessMessage: string | null;
}

export interface UseAwarenessRhythmOptions {
  checkInterval?: number; // minutes
  userProfile: any;
  recentInteractions: any[];
  onPhaseTransition?: (transition: PhaseTransition) => void;
  onInsightOpportunity?: (insight: string) => void;
}

export function useAwarenessRhythm({
  checkInterval = 15,
  userProfile,
  recentInteractions,
  onPhaseTransition,
  onInsightOpportunity
}: UseAwarenessRhythmOptions) {
  const [awarenessState, setAwarenessState] = useState<AwarenessState>({
    lastCheck: Date.now(),
    phaseUpdateAvailable: false,
    insightOpportunity: false,
    currentPhase: null,
    awarenessMessage: null
  });

  const [lastPhaseProfile, setLastPhaseProfile] = useState<LifePhaseProfile | null>(null);

  const checkForPhaseUpdate = useCallback(() => {
    if (recentInteractions.length === 0) return;

    const currentPhaseProfile = detectLifePhase(userProfile, recentInteractions);
    
    // Check if this is a new phase transition
    if (lastPhaseProfile && currentPhaseProfile.currentPhase !== lastPhaseProfile.currentPhase) {
      const { isNewPhase, transition } = updatePhaseHistory(
        currentPhaseProfile.currentPhase,
        currentPhaseProfile.phaseStability
      );

      if (isNewPhase && transition && onPhaseTransition) {
        onPhaseTransition(transition);
      }

      setAwarenessState(prev => ({
        ...prev,
        phaseUpdateAvailable: true,
        currentPhase: currentPhaseProfile.currentPhase,
        awarenessMessage: `A new rhythm emerges: ${transition?.to}`
      }));
    }

    setLastPhaseProfile(currentPhaseProfile);
  }, [recentInteractions, userProfile, lastPhaseProfile, onPhaseTransition]);

  const checkForInsightOpportunity = useCallback(() => {
    if (recentInteractions.length < 5) return;

    // Check for insight opportunities based on interaction patterns
    const recentLayerTypes = recentInteractions.slice(-5).map(i => i.layerType);
    const uniqueLayers = new Set(recentLayerTypes).size;
    
    // Opportunity for insight if user has been exploring multiple layers
    if (uniqueLayers >= 3 && !awarenessState.insightOpportunity) {
      const insights = [
        "A new thread is stirring in your pattern…",
        "Your explorations are weaving together…",
        "Something is connecting beneath the surface…",
        "A pattern is emerging from your wandering…"
      ];
      
      const randomInsight = insights[Math.floor(Math.random() * insights.length)];
      
      setAwarenessState(prev => ({
        ...prev,
        insightOpportunity: true,
        awarenessMessage: randomInsight
      }));

      if (onInsightOpportunity) {
        onInsightOpportunity(randomInsight);
      }
    }
  }, [recentInteractions, awarenessState.insightOpportunity, onInsightOpportunity]);

  const performAwarenessCheck = useCallback(() => {
    const now = Date.now();
    const timeSinceLastCheck = now - awarenessState.lastCheck;
    const checkIntervalMs = checkInterval * 60 * 1000;

    if (timeSinceLastCheck >= checkIntervalMs) {
      checkForPhaseUpdate();
      checkForInsightOpportunity();
      
      setAwarenessState(prev => ({
        ...prev,
        lastCheck: now
      }));
    }
  }, [awarenessState.lastCheck, checkInterval, checkForPhaseUpdate, checkForInsightOpportunity]);

  // Set up periodic awareness checks
  useEffect(() => {
    const intervalId = setInterval(performAwarenessCheck, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [performAwarenessCheck]);

  // Initial check
  useEffect(() => {
    if (recentInteractions.length > 0) {
      performAwarenessCheck();
    }
  }, [recentInteractions.length, performAwarenessCheck]);

  const clearAwarenessMessage = useCallback(() => {
    setAwarenessState(prev => ({
      ...prev,
      awarenessMessage: null,
      phaseUpdateAvailable: false,
      insightOpportunity: false
    }));
  }, []);

  return {
    awarenessState,
    clearAwarenessMessage,
    performManualCheck: performAwarenessCheck
  };
}
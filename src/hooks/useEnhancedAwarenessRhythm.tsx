/**
 * [Lap 12 – Enhanced Insight Banner]
 * Enhanced Awareness Rhythm Hook - Dynamic insight messaging with varied triggers
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { LifePhase, LifePhaseProfile, detectLifePhase } from '@/utils/life-phase-detection';
import { updatePhaseHistory, PhaseTransition } from '@/utils/phase-history-manager';
import { 
  selectInsightMessage, 
  formatInsightForDisplay, 
  InsightMessage,
  InsightSelectionOptions 
} from '@/utils/poetic-insight-library';

export interface EnhancedAwarenessState {
  lastCheck: number;
  phaseUpdateAvailable: boolean;
  insightOpportunity: boolean;
  currentPhase: LifePhase | null;
  awarenessMessage: string | null;
  currentInsight: InsightMessage | null;
  recentInsightIds: string[];
  lastTriggerTime: number;
}

export interface UseEnhancedAwarenessRhythmOptions {
  checkInterval?: number; // minutes
  userProfile: any;
  recentInteractions: any[];
  explorationStyle?: 'gentle' | 'analytical' | 'intuitive' | 'playful';
  onPhaseTransition?: (transition: PhaseTransition) => void;
  onInsightOpportunity?: (insight: string) => void;
  ambientInsightFrequency?: number; // minutes between ambient insights
}

export function useEnhancedAwarenessRhythm({
  checkInterval = 15,
  userProfile,
  recentInteractions,
  explorationStyle = 'gentle',
  onPhaseTransition,
  onInsightOpportunity,
  ambientInsightFrequency = 30
}: UseEnhancedAwarenessRhythmOptions) {
  const [awarenessState, setAwarenessState] = useState<EnhancedAwarenessState>({
    lastCheck: Date.now(),
    phaseUpdateAvailable: false,
    insightOpportunity: false,
    currentPhase: null,
    awarenessMessage: null,
    currentInsight: null,
    recentInsightIds: [],
    lastTriggerTime: 0
  });

  const [lastPhaseProfile, setLastPhaseProfile] = useState<LifePhaseProfile | null>(null);
  const lastInteractionCount = useRef(0);

  const shouldShowInsight = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTrigger = now - awarenessState.lastTriggerTime;
    const minTimeBetweenInsights = 5 * 60 * 1000; // 5 minutes minimum
    
    return timeSinceLastTrigger >= minTimeBetweenInsights;
  }, [awarenessState.lastTriggerTime]);

  const triggerInsight = useCallback((
    triggerContext: InsightMessage['triggerContext'],
    customMessage?: string
  ) => {
    if (!shouldShowInsight()) return;

    const options: InsightSelectionOptions = {
      currentPhase: awarenessState.currentPhase || undefined,
      explorationStyle,
      excludeRecent: awarenessState.recentInsightIds
    };

    let insight: InsightMessage | null = null;
    let formattedMessage = customMessage;

    if (!customMessage) {
      insight = selectInsightMessage(triggerContext, options);
      if (insight) {
        formattedMessage = formatInsightForDisplay(insight);
      }
    }

    if (formattedMessage) {
      setAwarenessState(prev => ({
        ...prev,
        awarenessMessage: formattedMessage,
        currentInsight: insight,
        lastTriggerTime: Date.now(),
        recentInsightIds: insight 
          ? [...prev.recentInsightIds.slice(-4), insight.id] // Keep last 5
          : prev.recentInsightIds
      }));

      if (onInsightOpportunity) {
        onInsightOpportunity(formattedMessage);
      }
    }
  }, [awarenessState.currentPhase, awarenessState.recentInsightIds, explorationStyle, shouldShowInsight, onInsightOpportunity]);

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

      // Trigger phase transition insight
      if (isNewPhase && transition) {
        const phaseMessages = [
          `A new rhythm emerges: ${transition.to}`,
          `You're entering a ${transition.to} phase—trust this natural progression`,
          `Phase shift detected: welcome to your ${transition.to} season`
        ];
        
        const randomMessage = phaseMessages[Math.floor(Math.random() * phaseMessages.length)];
        triggerInsight('phase_transition', randomMessage);
      }

      setAwarenessState(prev => ({
        ...prev,
        phaseUpdateAvailable: true,
        currentPhase: currentPhaseProfile.currentPhase
      }));
    }

    setLastPhaseProfile(currentPhaseProfile);
  }, [recentInteractions, userProfile, lastPhaseProfile, onPhaseTransition, triggerInsight]);

  const checkForCorrelationInsights = useCallback(() => {
    if (recentInteractions.length < 3) return;

    // Check for multi-layer exploration
    const recentLayerTypes = recentInteractions.slice(-5).map(i => i.layerType);
    const uniqueLayers = new Set(recentLayerTypes).size;
    
    if (uniqueLayers >= 3) {
      triggerInsight('correlation_detected');
    }

    // Check for specific patterns
    const sleepMoodPattern = recentLayerTypes.filter(l => l === 'sleep' || l === 'mood').length;
    if (sleepMoodPattern >= 2) {
      triggerInsight('correlation_detected');
    }
  }, [recentInteractions, triggerInsight]);

  const checkForExplorationInsights = useCallback(() => {
    // Trigger when user starts exploring (new interactions detected)
    if (recentInteractions.length > lastInteractionCount.current) {
      const newInteractionCount = recentInteractions.length - lastInteractionCount.current;
      
      if (newInteractionCount >= 2) { // Multiple new interactions
        triggerInsight('exploration');
      }
      
      lastInteractionCount.current = recentInteractions.length;
    }
  }, [recentInteractions.length, triggerInsight]);

  const checkForAmbientInsights = useCallback(() => {
    const now = Date.now();
    const timeSinceLastInsight = now - awarenessState.lastTriggerTime;
    const ambientInterval = ambientInsightFrequency * 60 * 1000;
    
    // Show ambient insights occasionally when user is not actively exploring
    if (timeSinceLastInsight >= ambientInterval && recentInteractions.length > 0) {
      triggerInsight('ambient');
    }
  }, [awarenessState.lastTriggerTime, ambientInsightFrequency, recentInteractions.length, triggerInsight]);

  const performAwarenessCheck = useCallback(() => {
    const now = Date.now();
    const timeSinceLastCheck = now - awarenessState.lastCheck;
    const checkIntervalMs = checkInterval * 60 * 1000;

    if (timeSinceLastCheck >= checkIntervalMs) {
      checkForPhaseUpdate();
      checkForCorrelationInsights();
      checkForExplorationInsights();
      checkForAmbientInsights();
      
      setAwarenessState(prev => ({
        ...prev,
        lastCheck: now
      }));
    }
  }, [
    awarenessState.lastCheck, 
    checkInterval, 
    checkForPhaseUpdate, 
    checkForCorrelationInsights,
    checkForExplorationInsights,
    checkForAmbientInsights
  ]);

  // Handle data click insights
  const onDataClick = useCallback((layerType: string) => {
    triggerInsight('data_click');
  }, [triggerInsight]);

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
      currentInsight: null,
      phaseUpdateAvailable: false,
      insightOpportunity: false
    }));
  }, []);

  return {
    awarenessState,
    clearAwarenessMessage,
    performManualCheck: performAwarenessCheck,
    onDataClick,
    triggerInsight
  };
}
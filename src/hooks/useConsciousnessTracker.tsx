import { useEffect, useCallback, useRef } from 'react';
import { LifePhase } from '@/utils/life-phase-detection';
import { rippleEngine, ConsciousnessEvent } from '@/utils/ripple-consciousness';

interface UseConsciousnessTrackerProps {
  currentPhase: LifePhase;
  centerX?: number;
  centerY?: number;
  enabled?: boolean;
}

export const useConsciousnessTracker = ({
  currentPhase,
  centerX = 350,
  centerY = 350,
  enabled = true
}: UseConsciousnessTrackerProps) => {
  const lastInteractionTime = useRef<number>(0);
  const interactionCount = useRef<number>(0);

  // Track user interactions with the mandala
  const trackInteraction = useCallback((layerType: string, x?: number, y?: number) => {
    if (!enabled) return;
    
    const now = Date.now();
    const timeSinceLastInteraction = now - lastInteractionTime.current;
    
    // Only create events if interactions are spaced out (prevent spam)
    if (timeSinceLastInteraction > 1000) { // 1 second cooldown
      rippleEngine.createInteractionEvent(
        x || centerX + (Math.random() - 0.5) * 100,
        y || centerY + (Math.random() - 0.5) * 100,
        currentPhase,
        layerType
      );
      
      lastInteractionTime.current = now;
      interactionCount.current++;
      
      // Create awareness events for sustained engagement
      if (interactionCount.current % 5 === 0) {
        setTimeout(() => {
          rippleEngine.createAwarenessEvent(
            centerX + (Math.random() - 0.5) * 200,
            centerY + (Math.random() - 0.5) * 200,
            currentPhase
          );
        }, 500);
      }
    }
  }, [enabled, currentPhase, centerX, centerY]);

  // Track insights discovery
  const trackInsight = useCallback((insight: string) => {
    if (!enabled) return;
    
    rippleEngine.createInsightEvent(
      centerX + (Math.random() - 0.5) * 150,
      centerY + (Math.random() - 0.5) * 150,
      currentPhase,
      insight
    );
  }, [enabled, currentPhase, centerX, centerY]);

  // Track reflective moments
  const trackReflection = useCallback((reflection: string) => {
    if (!enabled) return;
    
    rippleEngine.createReflectionEvent(
      centerX + (Math.random() - 0.5) * 100,
      centerY + (Math.random() - 0.5) * 100,
      currentPhase,
      reflection
    );
  }, [enabled, currentPhase, centerX, centerY]);

  // Track ritual completion
  const trackRitualCompletion = useCallback((ritualId: string) => {
    if (!enabled) return;
    
    rippleEngine.createRitualEvent(centerX, centerY, currentPhase, ritualId);
    
    // Create additional awareness ripple after completion
    setTimeout(() => {
      rippleEngine.createAwarenessEvent(centerX, centerY, currentPhase);
    }, 1000);
  }, [enabled, currentPhase, centerX, centerY]);

  // Track moments of deep awareness/presence
  const trackAwarenessMoment = useCallback(() => {
    if (!enabled) return;
    
    rippleEngine.createAwarenessEvent(centerX, centerY, currentPhase);
  }, [enabled, currentPhase, centerX, centerY]);

  // Auto-detect periods of sustained engagement for awareness moments
  useEffect(() => {
    if (!enabled) return;

    const checkForAwarenessOpportunity = () => {
      const recentEvents = rippleEngine.getRecentEvents(10); // Last 10 minutes
      
      // If there have been multiple types of interactions recently, 
      // create an awareness moment
      const eventTypes = new Set(recentEvents.map(e => e.type));
      if (eventTypes.size >= 3 && recentEvents.length >= 5) {
        trackAwarenessMoment();
      }
    };

    const interval = setInterval(checkForAwarenessOpportunity, 5 * 60 * 1000); // Every 5 minutes
    
    return () => clearInterval(interval);
  }, [enabled, trackAwarenessMoment]);

  // Listen for consciousness events to provide feedback
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = rippleEngine.onEvent((event: ConsciousnessEvent) => {
      // Could trigger UI feedback, notifications, or state updates here
      console.log(`Consciousness event: ${event.type} in ${event.phase} phase`);
    });

    return unsubscribe;
  }, [enabled]);

  return {
    trackInteraction,
    trackInsight,
    trackReflection,
    trackRitualCompletion,
    trackAwarenessMoment,
    getRecentEvents: () => rippleEngine.getRecentEvents(),
    getActiveRipples: () => rippleEngine.getActiveRipples(),
    getResonancePatterns: () => rippleEngine.getResonancePatterns()
  };
};
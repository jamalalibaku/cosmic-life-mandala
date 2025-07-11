import React, { useEffect, useState } from 'react';
import { PhaseTransitionRitual } from './PhaseTransitionRitual';
import { updatePhaseHistory, PhaseTransition } from '@/utils/phase-history-manager';
import { detectLifePhase } from '@/utils/life-phase-detection';
import { useToast } from '@/hooks/use-toast';

interface PhaseTransitionManagerProps {
  userProfile: any;
  recentInteractions: any[];
  children: React.ReactNode;
}

export const PhaseTransitionManager: React.FC<PhaseTransitionManagerProps> = ({
  userProfile,
  recentInteractions,
  children
}) => {
  const { toast } = useToast();
  const [pendingTransition, setPendingTransition] = useState<PhaseTransition | null>(null);
  const [lastCheckedInteractionCount, setLastCheckedInteractionCount] = useState(0);

  useEffect(() => {
    // Only check for transitions when there are new interactions
    if (recentInteractions.length > lastCheckedInteractionCount && recentInteractions.length > 0) {
      const currentPhase = detectLifePhase(userProfile, recentInteractions);
      const { isNewPhase, transition } = updatePhaseHistory(
        currentPhase.currentPhase,
        currentPhase.phaseStability
      );

      if (isNewPhase && transition) {
        // Small delay to let the UI settle before showing transition
        setTimeout(() => {
          setPendingTransition(transition);
        }, 1000);
      }

      setLastCheckedInteractionCount(recentInteractions.length);
    }
  }, [recentInteractions.length, userProfile, lastCheckedInteractionCount]);

  const handleTransitionAcknowledge = (marked: boolean, reflection?: string) => {
    if (marked && reflection) {
      // Could save the reflection to the transition record if needed
      toast({
        title: "Moment Marked",
        description: "Your transition reflection has been saved",
      });
    }
    
    setPendingTransition(null);
  };

  const handleTransitionDismiss = () => {
    setPendingTransition(null);
  };

  return (
    <>
      {children}
      {pendingTransition && (
        <PhaseTransitionRitual
          transition={pendingTransition}
          onAcknowledge={handleTransitionAcknowledge}
          onDismiss={handleTransitionDismiss}
        />
      )}
    </>
  );
};
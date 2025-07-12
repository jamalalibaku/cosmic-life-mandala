/**
 * Insight Aurora Hook - Connects meaningful insights to aurora celebrations
 */

import { useEffect } from 'react';
import { useAuroraEvents } from '@/components/layers/AtmosphericAuroraLayer';

interface InsightAuroraOptions {
  onInsightDiscovery?: () => void;
  onCorrelationFound?: () => void;
  onMilestoneReached?: () => void;
}

export const useInsightAuroras = (options: InsightAuroraOptions = {}) => {
  const { triggerInsightDiscovery, triggerCorrelation, triggerMilestone } = useAuroraEvents();

  // Monitor high-value insights and trigger auroras
  const celebrateInsight = (insightType: 'discovery' | 'correlation' | 'milestone', metadata?: any) => {
    console.log('🌌 Celebrating insight:', insightType, metadata);
    
    switch (insightType) {
      case 'discovery':
        triggerInsightDiscovery();
        options.onInsightDiscovery?.();
        break;
      case 'correlation':
        triggerCorrelation();
        options.onCorrelationFound?.();
        break;
      case 'milestone':
        triggerMilestone();
        options.onMilestoneReached?.();
        break;
    }
  };

  return {
    celebrateInsight,
    triggerInsightDiscovery,
    triggerCorrelation,
    triggerMilestone
  };
};
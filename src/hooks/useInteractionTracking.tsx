/**
 * [Phase: ZIP9-Beta | Lap 8: Interaction Tracking Hook]
 * Real-time interaction tracking for insight intelligence
 * 
 * Purpose: Track user interactions across all components for AI analysis
 * Features: Automatic tracking, context preservation, pattern detection
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { SliceInsightData, triggerInsightPrompt } from '@/utils/insight-engine';
import { updateUserProfile } from '@/utils/insight-memory';

interface TrackedInteraction {
  id: string;
  layerType: string;
  timestamp: string;
  dataValue: any;
  position?: { x: number; y: number };
  context?: string;
  duration?: number;
}

interface UseInteractionTrackingOptions {
  maxHistorySize?: number;
  enableRealTimeAnalysis?: boolean;
  trackMouseMovement?: boolean;
}

export const useInteractionTracking = (
  currentTimeSlices: any[] = [],
  options: UseInteractionTrackingOptions = {}
) => {
  const {
    maxHistorySize = 50,
    enableRealTimeAnalysis = true,
    trackMouseMovement = false
  } = options;

  const [interactions, setInteractions] = useState<TrackedInteraction[]>([]);
  const [currentInsight, setCurrentInsight] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const interactionIdRef = useRef(0);
  const lastAnalysisRef = useRef(0);

  // Generate unique interaction ID
  const generateInteractionId = useCallback(() => {
    interactionIdRef.current += 1;
    return `interaction-${Date.now()}-${interactionIdRef.current}`;
  }, []);

  // Track a new interaction
  const trackInteraction = useCallback((
    layerType: string,
    dataValue: any,
    position?: { x: number; y: number },
    context?: string
  ) => {
    const interaction: TrackedInteraction = {
      id: generateInteractionId(),
      layerType,
      timestamp: new Date().toISOString(),
      dataValue,
      position,
      context,
      duration: 0 // Will be updated if needed
    };

    setInteractions(prev => {
      const updated = [interaction, ...prev].slice(0, maxHistorySize);
      
      // Trigger real-time analysis if enabled
      if (enableRealTimeAnalysis && currentTimeSlices.length > 1) {
        // Debounce analysis to avoid overwhelming
        const now = Date.now();
        if (now - lastAnalysisRef.current > 2000) { // 2 second cooldown
          lastAnalysisRef.current = now;
          analyzeInteraction(interaction);
        }
      }
      
      return updated;
    });

    return interaction.id;
  }, [generateInteractionId, maxHistorySize, enableRealTimeAnalysis, currentTimeSlices]);

  // Analyze an interaction for insights
  const analyzeInteraction = useCallback(async (interaction: TrackedInteraction) => {
    if (!currentTimeSlices || currentTimeSlices.length < 2) return;

    setIsAnalyzing(true);
    
    try {
      const sliceData: SliceInsightData = {
        slice: {},
        layerType: interaction.layerType,
        timestamp: interaction.timestamp,
        dataValue: interaction.dataValue,
        angle: 0 // Could be calculated from position if needed
      };

      const insight = triggerInsightPrompt(sliceData, currentTimeSlices);
      setCurrentInsight(insight);

      // Also update the user profile for learning
      updateUserProfile({
        layerType: interaction.layerType,
        timestamp: interaction.timestamp,
        userEngagement: 'medium' // Could be calculated based on interaction patterns
      });

    } catch (error) {
      console.error('Error analyzing interaction:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentTimeSlices]);

  // Get recent interactions for display
  const getRecentInteractions = useCallback((count: number = 5) => {
    return interactions.slice(0, count).map(interaction => ({
      layerType: interaction.layerType,
      timestamp: interaction.timestamp,
      dataValue: interaction.dataValue
    }));
  }, [interactions]);

  // Get interaction patterns
  const getInteractionPatterns = useCallback(() => {
    if (interactions.length < 3) return null;

    const layerCounts = interactions.reduce((acc, interaction) => {
      acc[interaction.layerType] = (acc[interaction.layerType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const hourCounts = interactions.reduce((acc, interaction) => {
      const hour = new Date(interaction.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const mostActiveLayer = Object.entries(layerCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];

    const mostActiveHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];

    return {
      totalInteractions: interactions.length,
      mostActiveLayer,
      mostActiveHour: mostActiveHour ? parseInt(mostActiveHour) : null,
      layerDistribution: layerCounts,
      hourDistribution: hourCounts,
      averageSessionLength: interactions.length > 1 
        ? (new Date(interactions[0].timestamp).getTime() - new Date(interactions[interactions.length - 1].timestamp).getTime()) / interactions.length
        : 0
    };
  }, [interactions]);

  // Clear insights
  const clearCurrentInsight = useCallback(() => {
    setCurrentInsight(null);
  }, []);

  // Export interaction history
  const exportInteractionHistory = useCallback(() => {
    const exportData = {
      interactions,
      patterns: getInteractionPatterns(),
      exportedAt: new Date().toISOString(),
      sessionInfo: {
        totalInteractions: interactions.length,
        timeRange: interactions.length > 0 ? {
          start: interactions[interactions.length - 1].timestamp,
          end: interactions[0].timestamp
        } : null
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interaction-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [interactions, getInteractionPatterns]);

  // Auto-cleanup old interactions
  useEffect(() => {
    const cleanup = setInterval(() => {
      setInteractions(prev => {
        const cutoff = new Date();
        cutoff.setHours(cutoff.getHours() - 24); // Keep last 24 hours
        
        return prev.filter(interaction => 
          new Date(interaction.timestamp) > cutoff
        );
      });
    }, 60000); // Check every minute

    return () => clearInterval(cleanup);
  }, []);

  return {
    // State
    interactions,
    currentInsight,
    isAnalyzing,
    
    // Actions
    trackInteraction,
    analyzeInteraction,
    clearCurrentInsight,
    
    // Getters
    getRecentInteractions,
    getInteractionPatterns,
    
    // Utils
    exportInteractionHistory
  };
};
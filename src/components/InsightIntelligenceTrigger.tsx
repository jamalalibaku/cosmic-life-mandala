/**
 * [Phase: ZIP9-Beta | Lap 8: Insight Intelligence Trigger]
 * Smart trigger button for accessing the Insight Intelligence Panel
 * 
 * Purpose: Provide contextual access to AI insights with notification system
 * Features: Smart notifications, learning progress indication, contextual triggers
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUserInsightProfile, getSophisticationLevel } from '@/utils/insight-memory';
import { InsightIntelligencePanel } from './InsightIntelligencePanel';

interface InsightIntelligenceTriggerProps {
  currentTimeSlices?: any[];
  recentInteractions?: Array<{
    layerType: string;
    timestamp: string;
    dataValue: any;
  }>;
  className?: string;
}

export const InsightIntelligenceTrigger: React.FC<InsightIntelligenceTriggerProps> = ({
  currentTimeSlices = [],
  recentInteractions = [],
  className = ""
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [profile, setProfile] = useState(getUserInsightProfile());
  const [hasNewInsights, setHasNewInsights] = useState(false);
  const [lastViewedLevel, setLastViewedLevel] = useState(1);

  // Check for new insights or level progression
  useEffect(() => {
    const currentProfile = getUserInsightProfile();
    const currentLevel = getSophisticationLevel(currentProfile);
    const storedLastLevel = localStorage.getItem('last-viewed-insight-level');
    const lastLevel = storedLastLevel ? parseInt(storedLastLevel) : 1;
    
    // Check if user has progressed to a new level
    const hasLevelProgression = currentLevel.level > lastLevel;
    
    // Check if there are new correlations discovered
    const lastCorrelationCount = parseInt(localStorage.getItem('last-correlation-count') || '0');
    const hasNewCorrelations = currentProfile.discoveredCorrelations.length > lastCorrelationCount;
    
    // Check if user has been active recently but hasn't viewed insights
    const daysSinceLastView = new Date().getTime() - new Date(currentProfile.lastActiveDate).getTime();
    const hasRecentActivity = daysSinceLastView < 24 * 60 * 60 * 1000; // Within 24 hours
    const hasSignificantInteractions = currentProfile.totalInteractions >= 5;
    
    setHasNewInsights(hasLevelProgression || hasNewCorrelations || (hasRecentActivity && hasSignificantInteractions));
    setLastViewedLevel(lastLevel);
    setProfile(currentProfile);
  }, [recentInteractions]);

  const handleOpenPanel = () => {
    setIsPanelOpen(true);
    setHasNewInsights(false);
    
    // Update last viewed level and correlation count
    const currentProfile = getUserInsightProfile();
    const currentLevel = getSophisticationLevel(currentProfile);
    localStorage.setItem('last-viewed-insight-level', currentLevel.level.toString());
    localStorage.setItem('last-correlation-count', currentProfile.discoveredCorrelations.length.toString());
  };

  const sophisticationLevel = getSophisticationLevel(profile);
  const nextLevel = sophisticationLevel.level < 5 ? sophisticationLevel.level + 1 : 5;
  const nextLevelThreshold = [0, 5, 15, 30, 50][nextLevel - 1] || 50;
  const progressToNext = nextLevel > sophisticationLevel.level 
    ? Math.min(100, (profile.totalInteractions / nextLevelThreshold) * 100)
    : 100;

  // Determine trigger appearance based on activity
  const getTriggerVariant = () => {
    if (hasNewInsights) return 'default';
    if (profile.totalInteractions >= 10) return 'secondary';
    return 'outline';
  };

  const getTriggerIcon = () => {
    if (hasNewInsights && sophisticationLevel.level > lastViewedLevel) return Award;
    if (hasNewInsights) return Sparkles;
    if (profile.totalInteractions >= 15) return TrendingUp;
    return Brain;
  };

  const TriggerIcon = getTriggerIcon();

  return (
    <>
      <motion.div
        className={`relative ${className}`}
        initial={false}
        animate={hasNewInsights ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ 
          scale: { 
            duration: 2, 
            repeat: hasNewInsights ? Infinity : 0, 
            repeatType: "reverse" 
          }
        }}
      >
        <Button
          variant={getTriggerVariant()}
          size="sm"
          onClick={handleOpenPanel}
          className="relative overflow-hidden group"
        >
          <motion.div
            initial={false}
            animate={hasNewInsights ? { rotate: [0, 5, -5, 0] } : { rotate: 0 }}
            transition={{ 
              duration: 1, 
              repeat: hasNewInsights ? Infinity : 0,
              repeatDelay: 3
            }}
          >
            <TriggerIcon className="w-4 h-4 mr-2" />
          </motion.div>
          
          <span className="relative z-10">
            {sophisticationLevel.level >= 3 ? 'Intelligence' : 'Insights'}
          </span>
          
          {/* Progress indicator */}
          {sophisticationLevel.level < 5 && (
            <div className="absolute bottom-0 left-0 h-0.5 bg-primary/30 transition-all duration-500">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          )}
          
          {/* Glow effect for new insights */}
          <AnimatePresence>
            {hasNewInsights && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.6, scale: 1.2 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-md"
              />
            )}
          </AnimatePresence>
        </Button>
        
        {/* Notification badges */}
        <AnimatePresence>
          {hasNewInsights && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2"
            >
              <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Level badge for advanced users */}
        {sophisticationLevel.level >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
          >
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              L{sophisticationLevel.level}
            </Badge>
          </motion.div>
        )}
      </motion.div>

      {/* Insight Intelligence Panel */}
      <InsightIntelligencePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        currentTimeSlices={currentTimeSlices}
        recentInteractions={recentInteractions}
      />
    </>
  );
};
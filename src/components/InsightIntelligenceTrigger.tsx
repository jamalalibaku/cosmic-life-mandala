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
  const [isHovered, setIsHovered] = useState(false);

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

  const getTriggerIcon = () => {
    if (hasNewInsights && sophisticationLevel.level > lastViewedLevel) return Award;
    if (hasNewInsights) return Sparkles;
    if (profile.totalInteractions >= 15) return TrendingUp;
    return Brain;
  };

  const TriggerIcon = getTriggerIcon();

  const getInsightMessage = () => {
    if (sophisticationLevel.level >= 4) return "🧠 Advanced insights ready!";
    if (sophisticationLevel.level >= 3) return "✨ Pattern connections found!";
    if (hasNewInsights) return "💡 New discoveries await!";
    if (profile.totalInteractions >= 10) return "📊 Intelligence growing...";
    return "🌟 Tap to explore insights!";
  };

  return (
    <>
      <motion.div
        className={`relative ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
        {/* Compact AI Brain Icon */}
        <motion.button
          onClick={handleOpenPanel}
          className="relative w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
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
            <TriggerIcon className="w-5 h-5 text-white drop-shadow-sm" />
          </motion.div>
          
          {/* Notification pulse */}
          <AnimatePresence>
            {hasNewInsights && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-yellow-600 rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Comics-Style Speech Balloon */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
            >
              {/* Balloon Container */}
              <div className="relative">
                {/* Speech Balloon */}
                <div 
                  className="bg-white border-4 border-gray-900 rounded-2xl px-4 py-3 shadow-lg min-w-[200px] max-w-[280px]"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                    borderStyle: 'solid',
                    borderWidth: '3px',
                    borderColor: '#1a1a2e'
                  }}
                >
                  {/* Cartoon-style content */}
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-sm font-bold text-gray-800 mb-2"
                    >
                      {getInsightMessage()}
                    </motion.div>
                    
                    {/* Level indicator */}
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                      <span>Level {sophisticationLevel.level}</span>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressToNext}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                    </div>
                    
                    {/* Interactive stats */}
                    <div className="mt-2 text-xs text-gray-500">
                      {profile.totalInteractions} interactions • {profile.discoveredCorrelations.length} patterns
                    </div>
                  </div>
                </div>
                
                {/* Speech balloon tail */}
                <div 
                  className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1"
                  style={{ zIndex: -1 }}
                >
                  <div 
                    className="w-6 h-6 bg-white border-r-4 border-b-4 border-gray-900 transform rotate-45"
                    style={{
                      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                      borderRightColor: '#1a1a2e',
                      borderBottomColor: '#1a1a2e'
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Optional: Comic-style "POW!" effect for new insights */}
        <AnimatePresence>
          {hasNewInsights && !isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 400 }}
              className="absolute -top-8 -right-8 pointer-events-none"
            >
              <div className="bg-yellow-400 border-3 border-yellow-600 rounded-lg px-2 py-1 text-xs font-black text-yellow-900 shadow-lg transform rotate-12">
                NEW!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
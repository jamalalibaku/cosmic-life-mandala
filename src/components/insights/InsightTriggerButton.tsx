/**
 * (c) 2025 Cosmic Life Mandala – Insight Trigger Button
 * Button to generate and display behavioral insights
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { BehavioralInsightCard } from './BehavioralInsightCard';
import { mockBehavioralInsights, getTodaysRelevantInsights } from '../../data/mock-behavioral-insights';

interface InsightTriggerButtonProps {
  className?: string;
}

export const InsightTriggerButton: React.FC<InsightTriggerButtonProps> = ({
  className = ""
}) => {
  const [showInsights, setShowInsights] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    
    // Simulate insight generation processing
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setIsGenerating(false);
    setShowInsights(true);
  };

  const handleViewDetails = () => {
    console.log('Opening detailed insight view...', mockBehavioralInsights);
    // Future: Navigate to detailed insights page
  };

  const handleDismiss = () => {
    setShowInsights(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleGenerateInsights}
          disabled={isGenerating || showInsights}
          className="bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary shadow-lg"
          size="sm"
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="h-4 w-4 mr-2" />
              </motion.div>
              Analyzing Patterns...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Insights
            </>
          )}
        </Button>
      </motion.div>

      {/* Insight Panel */}
      <AnimatePresence>
        {showInsights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-12 right-0 z-50 w-96 max-w-[90vw]"
          >
            <BehavioralInsightCard
              insights={getTodaysRelevantInsights(6)}
              onViewDetails={handleViewDetails}
              onDismiss={handleDismiss}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
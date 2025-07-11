import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Calendar, Feather } from 'lucide-react';
import { PhaseTransition } from '@/utils/phase-history-manager';
import { LifePhaseThemeMap, LifePhase } from '@/utils/life-phase-detection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PhaseTransitionRitualProps {
  transition: PhaseTransition;
  onAcknowledge: (marked: boolean, reflection?: string) => void;
  onDismiss: () => void;
}

const ritualSuggestions: Record<LifePhase, string[]> = {
  awakening: [
    'Light a candle and sit quietly for 5 minutes, feeling the new awareness stirring',
    'Write down three questions that feel important to explore',
    'Take a walk and notice what catches your attention differently'
  ],
  building: [
    'Create a small altar or sacred space for your creative work',
    'Write your intention on paper and place it somewhere visible',
    'Gather tools or resources that support your building energy'
  ],
  flowing: [
    'Move your body in whatever way feels natural — dance, stretch, or sway',
    'Spend time near water — a bath, shower, or natural body of water',
    'Let yourself do something without a plan or agenda'
  ],
  deepening: [
    'Create a quiet ritual space with soft lighting or candles',
    'Journal about what wisdom is emerging in your solitude',
    'Spend time in meditation or contemplative reading'
  ],
  integrating: [
    'Create something that represents the wholeness you\'re experiencing',
    'Write a letter to yourself about how different parts of your life connect',
    'Arrange your living space to reflect this sense of integration'
  ],
  releasing: [
    'Write what you\'re letting go of on paper, then safely burn or bury it',
    'Clear out physical space — donate items that no longer serve you',
    'Take a cleansing bath with intention to release and make space'
  ],
  renewing: [
    'Plant something new — seeds, a small plant, or tend to existing growth',
    'Set up your space to welcome fresh energy and possibilities',
    'Create a vision board or write about what wants to be born'
  ]
};

export const PhaseTransitionRitual: React.FC<PhaseTransitionRitualProps> = ({
  transition,
  onAcknowledge,
  onDismiss
}) => {
  const [reflection, setReflection] = useState('');
  const [showRituals, setShowRituals] = useState(false);
  
  const fromTheme = LifePhaseThemeMap[transition.from];
  const toTheme = LifePhaseThemeMap[transition.to];
  const suggestions = ritualSuggestions[transition.to] || [];

  const handleMark = () => {
    onAcknowledge(true, reflection.trim() || undefined);
  };

  const handleContinue = () => {
    onAcknowledge(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-background border rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 text-center bg-gradient-to-br from-primary/5 to-primary/10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <h2 className="text-xl font-semibold mb-2">A New Phase Emerges</h2>
            <p className="text-sm text-muted-foreground">
              You've moved from <span className="font-medium">{fromTheme.name}</span> to <span className="font-medium">{toTheme.name}</span>
            </p>
          </div>

          <div className="p-6 space-y-4">
            {/* Phase Transition Visual */}
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl mb-1">{fromTheme.icon}</div>
                <div className="text-xs text-muted-foreground">{fromTheme.name}</div>
              </div>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-primary"
              >
                →
              </motion.div>
              <div className="text-center">
                <div className="text-2xl mb-1">{toTheme.icon}</div>
                <div className="text-xs text-muted-foreground">{toTheme.name}</div>
              </div>
            </div>

            <Separator />

            {/* Phase Description */}
            <Card>
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed text-center">
                  {toTheme.description}
                </p>
              </CardContent>
            </Card>

            {/* Ritual Suggestions Toggle */}
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRituals(!showRituals)}
                className="text-primary hover:text-primary/80"
              >
                <Heart className="w-4 h-4 mr-2" />
                {showRituals ? 'Hide' : 'Show'} Ritual Suggestions
              </Button>
            </div>

            <AnimatePresence>
              {showRituals && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Feather className="w-4 h-4" />
                    Ways to honor this transition:
                  </h4>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-muted/30 rounded-lg text-sm"
                      >
                        {suggestion}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reflection Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Mark this moment (optional):
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="How does this transition feel? What are you noticing?"
                className="w-full px-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleContinue}
                className="flex-1"
              >
                Continue Quietly
              </Button>
              <Button
                onClick={handleMark}
                className="flex-1"
              >
                Mark This Moment
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
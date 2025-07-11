/**
 * [Lap 12: Future Jamal Features]
 * Rhythmic Reflection Card - Gentle UI for awareness prompts
 * 
 * Purpose: Beautiful, dismissible cards for reflection moments
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, BookOpen, X, Send, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ReflectionPrompt } from '@/hooks/useRhythmicReflection';

interface RhythmicReflectionCardProps {
  prompt: ReflectionPrompt | null;
  isVisible: boolean;
  onDismiss: (reflection?: string) => void;
  className?: string;
}

export const RhythmicReflectionCard: React.FC<RhythmicReflectionCardProps> = ({
  prompt,
  isVisible,
  onDismiss,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  if (!prompt || !isVisible) return null;

  const handleReflect = () => {
    setIsExpanded(true);
    setIsWriting(true);
  };

  const handleSaveReflection = () => {
    onDismiss(reflectionText.trim() || undefined);
    setReflectionText('');
    setIsExpanded(false);
    setIsWriting(false);
  };

  const handleQuickDismiss = () => {
    onDismiss();
    setReflectionText('');
    setIsExpanded(false);
    setIsWriting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed bottom-6 right-6 z-50 max-w-sm ${className}`}
      >
        {/* Gentle glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-lg"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <Card className="relative bg-background/95 backdrop-blur-md border border-primary/20 shadow-2xl overflow-hidden">
          {/* Subtle animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          <CardContent className="relative p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Gentle Pause
                  </h3>
                  {prompt.phase && (
                    <p className="text-xs text-muted-foreground/70 capitalize">
                      {prompt.phase} phase
                    </p>
                  )}
                </div>
              </motion.div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleQuickDismiss}
                className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Main prompt */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <p className="text-foreground leading-relaxed">
                {prompt.text}
              </p>
              
              {prompt.poeticHint && (
                <motion.p 
                  className="text-sm text-muted-foreground italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {prompt.poeticHint}
                </motion.p>
              )}
            </motion.div>

            {/* Expanded reflection area */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 border-t pt-4"
                >
                  <Textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="What are you noticing? (optional)"
                    className="resize-none bg-background/50 border-primary/20 focus:border-primary/40"
                    rows={3}
                    autoFocus
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveReflection}
                      size="sm"
                      className="flex-1"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {reflectionText.trim() ? 'Save & Close' : 'Close'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            {!isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-2 pt-2"
              >
                <Button
                  onClick={handleReflect}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-primary/30 hover:border-primary/50"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  Reflect
                </Button>
                <Button
                  onClick={handleQuickDismiss}
                  variant="ghost"
                  size="sm"
                  className="px-3 text-muted-foreground"
                >
                  Later
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
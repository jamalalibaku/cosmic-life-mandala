/**
 * [Lap 12: Future Jamal Features]
 * Phase Journal - Journaling per phase with phase-tagged entries
 * 
 * Purpose: Let users write short entries tagged to their current phase
 * Features: Phase-specific prompts, reflection storage, future self messages
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Pen, Clock, Heart, Send, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LifePhase, LifePhaseThemeMap } from '@/utils/life-phase-detection';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface JournalEntry {
  id: string;
  phase: LifePhase;
  text: string;
  timestamp: string;
  isForFuturePhase?: boolean;
  targetPhase?: LifePhase;
  mood?: string;
  tags?: string[];
}

interface PhaseJournalProps {
  currentPhase?: LifePhase | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PhaseJournal: React.FC<PhaseJournalProps> = ({
  currentPhase,
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntryText, setNewEntryText] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<LifePhase | 'all'>('all');
  const [isFutureMessage, setIsFutureMessage] = useState(false);

  // Load entries from localStorage
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('phase-journal-entries');
      if (stored) {
        try {
          setEntries(JSON.parse(stored));
        } catch (error) {
          console.error('Failed to load journal entries:', error);
          setEntries([]);
        }
      }
    }
  }, [isOpen]);

  // Save entries to localStorage
  const saveEntries = (newEntries: JournalEntry[]) => {
    localStorage.setItem('phase-journal-entries', JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  // Add new journal entry
  const addEntry = () => {
    if (!newEntryText.trim() || !currentPhase) return;

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      phase: currentPhase,
      text: newEntryText.trim(),
      timestamp: new Date().toISOString(),
      isForFuturePhase: isFutureMessage,
      mood: 'contemplative' // Could be enhanced with mood detection
    };

    const updatedEntries = [newEntry, ...entries];
    saveEntries(updatedEntries);

    toast({
      title: isFutureMessage ? "Message for future self saved" : "Journal entry saved",
      description: `Recorded in your ${LifePhaseThemeMap[currentPhase].name} phase`,
    });

    setNewEntryText('');
    setIsWriting(false);
    setIsFutureMessage(false);
  };

  // Delete entry
  const deleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    saveEntries(updatedEntries);
    
    toast({
      title: "Entry deleted",
      description: "Your reflection has been removed",
    });
  };

  // Filter entries
  const filteredEntries = entries.filter(entry => 
    selectedPhaseFilter === 'all' || entry.phase === selectedPhaseFilter
  );

  // Get phase-specific writing prompt
  const getPhasePrompt = (phase: LifePhase): string => {
    const prompts = {
      awakening: "What new awareness is emerging for you?",
      building: "What are you consciously creating in your life?",
      flowing: "How does your natural rhythm feel today?",
      deepening: "What wisdom is quietly surfacing?",
      integrating: "How are different aspects of your life coming together?",
      releasing: "What feels ready to be released or transformed?",
      renewing: "What fresh energy or possibility do you sense?"
    };
    return prompts[phase];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background border rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Phase Journal</h2>
                <p className="text-sm text-muted-foreground">
                  {currentPhase ? `Writing from your ${LifePhaseThemeMap[currentPhase].name} phase` : 'Reflect on your journey'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>

          <div className="flex h-[calc(90vh-80px)]">
            {/* Writing Area */}
            <div className="w-1/2 border-r p-6 space-y-4">
              {currentPhase && (
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-primary/10 to-transparent rounded-lg">
                  <span className="text-lg">{LifePhaseThemeMap[currentPhase].icon}</span>
                  <div>
                    <div className="font-medium text-sm">{LifePhaseThemeMap[currentPhase].name} Phase</div>
                    <div className="text-xs text-muted-foreground">
                      {getPhasePrompt(currentPhase)}
                    </div>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {isWriting ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <Textarea
                      value={newEntryText}
                      onChange={(e) => setNewEntryText(e.target.value)}
                      placeholder={currentPhase ? getPhasePrompt(currentPhase) : "What's on your mind?"}
                      className="min-h-[200px] resize-none"
                      autoFocus
                    />
                    
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={isFutureMessage}
                          onChange={(e) => setIsFutureMessage(e.target.checked)}
                          className="rounded"
                        />
                        Message for future self
                      </label>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={addEntry} disabled={!newEntryText.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Save Entry
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setIsWriting(false);
                        setNewEntryText('');
                        setIsFutureMessage(false);
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Pen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {currentPhase ? "Would you like to leave a reflection for your future self in this phase?" : "Ready to write?"}
                    </p>
                    <Button onClick={() => setIsWriting(true)}>
                      <Pen className="w-4 h-4 mr-2" />
                      Start Writing
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Entries List */}
            <div className="w-1/2 flex flex-col">
              {/* Filter Controls */}
              <div className="p-4 border-b">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedPhaseFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPhaseFilter('all')}
                  >
                    All Phases
                  </Button>
                  {Object.entries(LifePhaseThemeMap).map(([phase, config]) => (
                    <Button
                      key={phase}
                      variant={selectedPhaseFilter === phase ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPhaseFilter(phase as LifePhase)}
                      className="text-xs"
                    >
                      <span className="mr-1">{config.icon}</span>
                      {config.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Entries */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {filteredEntries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No entries yet in this view</p>
                    </div>
                  ) : (
                    filteredEntries.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="relative group">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="secondary"
                                  className="text-xs"
                                  style={{ borderColor: LifePhaseThemeMap[entry.phase].color }}
                                >
                                  <span className="mr-1">{LifePhaseThemeMap[entry.phase].icon}</span>
                                  {LifePhaseThemeMap[entry.phase].name}
                                </Badge>
                                {entry.isForFuturePhase && (
                                  <Badge variant="outline" className="text-xs">
                                    <Heart className="w-3 h-3 mr-1" />
                                    Future Self
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteEntry(entry.id)}
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-sm leading-relaxed mb-3">
                              {entry.text}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}</span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{format(new Date(entry.timestamp), 'h:mm a')}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
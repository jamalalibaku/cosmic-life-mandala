/**
 * [Phase: ZIP9-Beta | Lap 9: Memory Lane View]
 * Temporal narrative interface for insight discovery journey
 * 
 * Purpose: Make time itself readable as a story through insight chronology
 * Features: Radial scroll-back, discovery timeline, emotional chapters, insight archaeology
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  Heart, 
  Lightbulb, 
  BookOpen, 
  Calendar,
  ArrowLeft,
  ArrowRight,
  Eye,
  Sparkles,
  Moon,
  Sun,
  CloudRain,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUserInsightProfile, getSophisticationLevel } from '@/utils/insight-memory';
import { format, differenceInDays, startOfDay, endOfDay } from 'date-fns';

interface MemoryChapter {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  dominantLayer: string;
  emotionalTone: 'curious' | 'focused' | 'exploratory' | 'reflective' | 'intensive';
  discoveries: Array<{
    type: 'correlation' | 'level-up' | 'pattern' | 'insight';
    timestamp: string;
    content: string;
    layersInvolved: string[];
    poeticContent?: string;
  }>;
  interactionCount: number;
  significantMoments: string[];
  userReflections: Array<{
    text: string;
    timestamp: string;
    emotionHint?: string;
  }>;
  aiReflection?: string;
}

interface MemoryLaneViewProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimeSlices?: any[];
  onNavigateToInsights?: () => void;
}

export const MemoryLaneView: React.FC<MemoryLaneViewProps> = ({
  isOpen,
  onClose,
  currentTimeSlices = [],
  onNavigateToInsights
}) => {
  const [profile, setProfile] = useState(getUserInsightProfile());
  const [selectedChapter, setSelectedChapter] = useState<MemoryChapter | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'chapters'>('chapters');
  const [reflectionText, setReflectionText] = useState('');
  const [isAddingReflection, setIsAddingReflection] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Refresh profile data
  useEffect(() => {
    if (isOpen) {
      setProfile(getUserInsightProfile());
    }
  }, [isOpen]);

  // Handle adding reflection
  const handleAddReflection = (chapterId: string) => {
    if (!reflectionText.trim()) return;
    
    // Store reflection in localStorage for now
    const reflections = JSON.parse(localStorage.getItem(`reflections-${chapterId}`) || '[]');
    reflections.push({
      text: reflectionText,
      timestamp: new Date().toISOString(),
      emotionHint: 'contemplative'
    });
    localStorage.setItem(`reflections-${chapterId}`, JSON.stringify(reflections));
    
    setReflectionText('');
    setIsAddingReflection(false);
    
    // Refresh to show new reflection
    setProfile(getUserInsightProfile());
  };

  // Load reflections for chapters
  const loadReflections = (chapterId: string) => {
    return JSON.parse(localStorage.getItem(`reflections-${chapterId}`) || '[]');
  };

  // Generate memory chapters from user interaction history
  const memoryChapters = useMemo(() => {
    const chapters: MemoryChapter[] = [];
    
    if (!profile || profile.totalInteractions === 0) {
        return [{
          id: 'genesis',
          startDate: profile?.createdAt || new Date().toISOString(),
          endDate: new Date().toISOString(),
          title: 'The Beginning',
          description: 'Your first gentle steps into the cosmic spiral of self-awareness',
          dominantLayer: 'exploration',
          emotionalTone: 'curious' as const,
          discoveries: [],
          interactionCount: 0,
          significantMoments: ['First glimpse into the cosmic mandala'],
          userReflections: [],
          aiReflection: 'Every journey begins with a single touch — yours started here, where curiosity met cosmos.'
        }];
    }

    // Create chapters based on interaction patterns and time periods
    const createdDate = new Date(profile.createdAt);
    const now = new Date();
    const daysSinceCreation = differenceInDays(now, createdDate);
    
    // Generate chapters based on activity patterns
    if (profile.totalInteractions <= 5) {
      chapters.push({
        id: 'first-steps',
        startDate: profile.createdAt,
        endDate: new Date().toISOString(),
        title: 'First Steps',
        description: 'Gentle touches and curious wandering through the layers of time',
        dominantLayer: Object.entries(profile.layerPreferences)
          .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'unknown',
        emotionalTone: 'curious',
        discoveries: profile.discoveredCorrelations.map(corr => ({
          type: 'correlation' as const,
          timestamp: corr.discoveredAt,
          content: `Connection discovered between ${corr.layers.join(' and ')}`,
          poeticContent: `A pattern whispered between ${corr.layers.join(' and ')}`,
          layersInvolved: corr.layers
        })),
        interactionCount: profile.totalInteractions,
        significantMoments: [
          'Your first interaction with the temporal spiral', 
          'Patterns beginning to surface from the gentle chaos',
          'The mandala starts to respond to your presence'
        ],
        userReflections: [],
        aiReflection: `You've traced ${profile.totalInteractions} gentle steps along your spiral. Each touch reveals more of the pattern beneath.`
      });
    } else if (profile.totalInteractions <= 15) {
      chapters.push({
        id: 'growing-awareness',
        startDate: profile.createdAt,
        endDate: new Date().toISOString(),
        title: 'Growing Awareness',
        description: 'Patterns begin to emerge from the gentle chaos',
        dominantLayer: Object.entries(profile.layerPreferences)
          .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'mood',
        emotionalTone: 'exploratory',
        discoveries: [
          ...profile.discoveredCorrelations.map(corr => ({
            type: 'correlation' as const,
            timestamp: corr.discoveredAt,
            content: `${corr.layers.join(' ↔ ')} connection revealed`,
            poeticContent: `A deeper rhythm found between ${corr.layers.join(' and ')}`,
            layersInvolved: corr.layers
          })),
          ...(profile.sophisticationLevel > 1 ? [{
            type: 'level-up' as const,
            timestamp: profile.lastActiveDate,
            content: `Advanced to Level ${profile.sophisticationLevel}: ${getSophisticationLevel(profile).description}`,
            poeticContent: `You unlocked a deeper rhythm — Level ${profile.sophisticationLevel} consciousness blooms`,
            layersInvolved: Object.keys(profile.layerPreferences)
          }] : [])
        ],
        interactionCount: profile.totalInteractions,
        significantMoments: [
          'The first meaningful pattern emerged from the noise',
          'Your understanding began to deepen and strengthen',
          profile.sophisticationLevel > 1 ? 'A new level of awareness awakened' : 'Building the foundation of insight'
        ],
        userReflections: [],
        aiReflection: profile.sophisticationLevel > 1 
          ? 'Your awareness has blossomed into new dimensions. The patterns speak to you differently now.'
          : 'You are learning the language of your own rhythms. Trust what emerges.'
      });
    } else {
      // Multiple chapters for advanced users
      const midPoint = Math.floor(profile.totalInteractions / 2);
      
      chapters.push({
        id: 'early-exploration',
        startDate: profile.createdAt,
        endDate: new Date(Date.now() - (daysSinceCreation / 2) * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Early Exploration',
        description: 'The first maps of your inner landscape',
        dominantLayer: Object.entries(profile.layerPreferences)
          .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'mood',
        emotionalTone: 'focused',
        discoveries: profile.discoveredCorrelations.slice(0, Math.ceil(profile.discoveredCorrelations.length / 2))
          .map(corr => ({
            type: 'correlation' as const,
            timestamp: corr.discoveredAt,
            content: `Early pattern: ${corr.layers.join(' influences ')}`,
            layersInvolved: corr.layers
          })),
        interactionCount: midPoint,
        significantMoments: ['First deep dive', 'Pattern recognition begins'],
        userReflections: [],
        aiReflection: 'The first maps of your inner landscape are being drawn. Each step reveals more territory.'
      });

      chapters.push({
        id: 'deepening-understanding',
        startDate: new Date(Date.now() - (daysSinceCreation / 2) * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
        title: 'Deepening Understanding',
        description: 'Where wisdom meets data, where insight becomes companion',
        dominantLayer: profile.behaviorPatterns.explorationStyle === 'deep' ? 'consciousness' : 'integration',
        emotionalTone: profile.sophisticationLevel >= 4 ? 'reflective' : 'intensive',
        discoveries: [
          ...profile.discoveredCorrelations.slice(Math.ceil(profile.discoveredCorrelations.length / 2))
            .map(corr => ({
              type: 'correlation' as const,
              timestamp: corr.discoveredAt,
              content: `Refined understanding: ${corr.layers.join(' ↔ ')}`,
              layersInvolved: corr.layers
            })),
          {
            type: 'level-up' as const,
            timestamp: profile.lastActiveDate,
            content: `Achieved Level ${profile.sophisticationLevel}: ${getSophisticationLevel(profile).description}`,
            layersInvolved: Object.keys(profile.layerPreferences)
          }
        ],
        interactionCount: profile.totalInteractions - midPoint,
        significantMoments: [
          'Advanced pattern synthesis',
          'Behavioral intelligence emerges',
          profile.sophisticationLevel >= 4 ? 'Deep understanding unlocked' : 'Sophisticated analysis begins'
        ],
        userReflections: [],
        aiReflection: profile.sophisticationLevel >= 4 
          ? 'Where wisdom meets data, where insight becomes companion. You have become a student of your own symphony.'
          : 'The patterns grow more sophisticated as your awareness deepens. Each interaction builds upon the last.'
      });
    }

    return chapters;
  }, [profile]);

  const getChapterIcon = (emotionalTone: MemoryChapter['emotionalTone']) => {
    switch (emotionalTone) {
      case 'curious': return Eye;
      case 'focused': return Lightbulb;
      case 'exploratory': return MapPin;
      case 'reflective': return Moon;
      case 'intensive': return Activity;
      default: return BookOpen;
    }
  };

  const getLayerIcon = (layer: string) => {
    switch (layer) {
      case 'mood': return Heart;
      case 'sleep': return Moon;
      case 'weather': return CloudRain;
      case 'mobility': return Activity;
      default: return Sparkles;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const days = differenceInDays(now, date);
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return format(date, 'MMM d, yyyy');
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
          className="bg-background border rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Memory Lane</h2>
                <p className="text-sm text-muted-foreground">
                  Your journey through {memoryChapters.length} chapters of discovery
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'chapters' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('chapters')}
                  className="relative overflow-hidden"
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Chapters
                </Button>
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('timeline')}
                  className="relative overflow-hidden"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Timeline
                </Button>
                {onNavigateToInsights && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNavigateToInsights}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Insights
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ×
                </Button>
              </div>
            </div>
          </div>

          <div className="flex h-[calc(90vh-80px)]">
            {/* Chapter List */}
            <div className="w-1/3 border-r">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {memoryChapters.map((chapter, index) => {
                    const ChapterIcon = getChapterIcon(chapter.emotionalTone);
                    const LayerIcon = getLayerIcon(chapter.dominantLayer);
                    const reflections = loadReflections(chapter.id);
                    
                    return (
                      <motion.div
                        key={chapter.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                      >
                        {/* Gentle glow effect */}
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent opacity-0"
                          animate={{ 
                            opacity: selectedChapter?.id === chapter.id ? 0.6 : 0,
                            scale: selectedChapter?.id === chapter.id ? 1.02 : 1 
                          }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        <Card 
                          className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                            selectedChapter?.id === chapter.id 
                              ? 'border-primary/50 shadow-primary/20 shadow-lg' 
                              : 'border-transparent hover:border-primary/20'
                          }`}
                          onClick={() => setSelectedChapter({ ...chapter, userReflections: reflections })}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <motion.div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                                style={{
                                  background: chapter.emotionalTone === 'curious' 
                                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                                    : chapter.emotionalTone === 'focused'
                                    ? 'linear-gradient(135deg, #10b981, #047857)'
                                    : chapter.emotionalTone === 'exploratory'
                                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                    : chapter.emotionalTone === 'reflective'
                                    ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                                    : 'linear-gradient(135deg, #ef4444, #dc2626)'
                                }}
                                whileHover={{ scale: 1.1 }}
                              >
                                <ChapterIcon className="w-4 h-4 text-white relative z-10" />
                                <motion.div
                                  className="absolute inset-0 bg-white/20"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                                />
                              </motion.div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm mb-1">{chapter.title}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed italic">
                                  {chapter.description}
                                </p>
                                
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-dashed">
                                    <LayerIcon className="w-3 h-3 mr-1" />
                                    {chapter.dominantLayer}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {chapter.interactionCount === 1 
                                      ? "one gentle touch" 
                                      : `${chapter.interactionCount} moments of presence`}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-muted-foreground">
                                    {formatTimeAgo(chapter.startDate)}
                                  </div>
                                  {reflections.length > 0 && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="flex items-center gap-1 text-xs text-primary"
                                    >
                                      <Heart className="w-3 h-3" />
                                      <span>{reflections.length}</span>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Chapter Detail */}
            <div className="flex-1">
              <ScrollArea className="h-full">
                {selectedChapter ? (
                  <div className="p-6">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      {/* Chapter Header */}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                            {React.createElement(getChapterIcon(selectedChapter.emotionalTone), {
                              className: "w-6 h-6 text-white"
                            })}
                          </div>
                          <div>
                            <h2 className="text-2xl font-semibold">{selectedChapter.title}</h2>
                            <p className="text-muted-foreground">{selectedChapter.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(selectedChapter.startDate), 'MMM d')} - {format(new Date(selectedChapter.endDate), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            {selectedChapter.interactionCount} interactions
                          </span>
                        </div>
                      </div>

                      {/* Discoveries */}
                      {selectedChapter.discoveries.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Lightbulb className="w-5 h-5" />
                              Discoveries Made
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {selectedChapter.discoveries.map((discovery, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                              >
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {discovery.type === 'correlation' && <Heart className="w-3 h-3 text-primary" />}
                                  {discovery.type === 'level-up' && <Sparkles className="w-3 h-3 text-primary" />}
                                  {discovery.type === 'pattern' && <Activity className="w-3 h-3 text-primary" />}
                                  {discovery.type === 'insight' && <Lightbulb className="w-3 h-3 text-primary" />}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm">{discovery.content}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      {formatTimeAgo(discovery.timestamp)}
                                    </span>
                                    {discovery.layersInvolved.length > 0 && (
                                      <div className="flex gap-1">
                                        {discovery.layersInvolved.map(layer => (
                                          <Badge key={layer} variant="outline" className="text-xs px-1 py-0">
                                            {layer}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      {/* Significant Moments */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Significant Moments
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedChapter.significantMoments.map((moment, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 text-sm"
                              >
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                {moment}
                              </motion.li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a chapter to explore your journey</p>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
/**
 * [Phase: ZIP9-Beta | Lap 8: Insight Intelligence Panel]
 * Comprehensive insight visualization and interaction system
 * 
 * Purpose: Make the sophisticated insight engine visible and actionable
 * Features: Learning progression, correlation visualization, insight history, recommendations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Clock, 
  BarChart3,
  Eye,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Award,
  Zap
} from 'lucide-react';
import { getUserInsightProfile, getSophisticationLevel, exportUserProfile } from '@/utils/insight-memory';
import { analyzeLayerCorrelations, detectTemporalPatterns, generateReflectionPrompts } from '@/utils/insight-engine';
import { detectLifePhase, LifePhaseProfile, LifePhaseThemeMap } from '@/utils/life-phase-detection';
import { generatePhaseAwareInsight } from '@/utils/phase-aware-insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface InsightIntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimeSlices?: any[];
  recentInteractions?: Array<{
    layerType: string;
    timestamp: string;
    dataValue: any;
  }>;
}

export const InsightIntelligencePanel: React.FC<InsightIntelligencePanelProps> = ({
  isOpen,
  onClose,
  currentTimeSlices = [],
  recentInteractions = []
}) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState(getUserInsightProfile());
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCorrelations, setExpandedCorrelations] = useState<string[]>([]);
  const [lifePhase, setLifePhase] = useState<LifePhaseProfile | null>(null);

  // Refresh profile data
  useEffect(() => {
    if (isOpen) {
      setProfile(getUserInsightProfile());
      // Detect life phase
      const phaseProfile = detectLifePhase(profile, recentInteractions);
      setLifePhase(phaseProfile);
    }
  }, [isOpen, profile, recentInteractions]);

  const sophisticationLevel = getSophisticationLevel(profile);
  const nextLevel = sophisticationLevel.level < 5 ? sophisticationLevel.level + 1 : 5;
  const nextLevelThreshold = [0, 5, 15, 30, 50][nextLevel - 1] || 50;
  const progressToNext = nextLevel > sophisticationLevel.level 
    ? Math.min(100, (profile.totalInteractions / nextLevelThreshold) * 100)
    : 100;

  // Calculate current correlations
  const currentCorrelations = currentTimeSlices.length > 1 
    ? ['mood', 'sleep', 'mobility', 'weather'].reduce((acc, layer) => {
        const correlations = analyzeLayerCorrelations(currentTimeSlices, layer);
        return { ...acc, ...correlations };
      }, {})
    : {};

  // Get recent patterns
  const recentPatterns = currentTimeSlices.length > 3
    ? detectTemporalPatterns(currentTimeSlices, 'mood')
    : null;

  const handleExportProfile = () => {
    const profileData = exportUserProfile();
    if (profileData) {
      const dataStr = JSON.stringify(profileData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `insight-profile-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Profile Exported",
        description: "Your insight profile has been downloaded",
      });
    }
  };

  const toggleCorrelationExpansion = (correlationKey: string) => {
    setExpandedCorrelations(prev => 
      prev.includes(correlationKey)
        ? prev.filter(k => k !== correlationKey)
        : [...prev, correlationKey]
    );
  };

  const getCorrelationColor = (strength: number) => {
    const abs = Math.abs(strength);
    if (abs >= 0.7) return 'bg-emerald-500';
    if (abs >= 0.5) return 'bg-blue-500';
    if (abs >= 0.3) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getCorrelationLabel = (strength: number) => {
    const abs = Math.abs(strength);
    const direction = strength > 0 ? 'Positive' : 'Negative';
    if (abs >= 0.7) return `Strong ${direction}`;
    if (abs >= 0.5) return `Moderate ${direction}`;
    if (abs >= 0.3) return `Weak ${direction}`;
    return 'Minimal';
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
          className="bg-background border rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  Insight Intelligence
                  {lifePhase && (
                    <span className="text-lg" title={`${lifePhase.currentPhase} phase: ${LifePhaseThemeMap[lifePhase.currentPhase].description}`}>
                      {LifePhaseThemeMap[lifePhase.currentPhase].icon}
                    </span>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Level {sophisticationLevel.level}: {sophisticationLevel.description}
                  {lifePhase && (
                    <span className="ml-2">• {LifePhaseThemeMap[lifePhase.currentPhase].name} Phase</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportProfile}>
                Export Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="correlations">Correlations</TabsTrigger>
                <TabsTrigger value="patterns">Patterns</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="overview" className="mt-0 space-y-6">
                  {/* Learning Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Learning Progression
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Level {sophisticationLevel.level}</span>
                        <span className="text-sm text-muted-foreground">
                          {profile.totalInteractions === 1 
                            ? "Your first gentle touch"
                            : `${profile.totalInteractions} moments of curiosity`}
                        </span>
                      </div>
                      <Progress value={progressToNext} className="w-full" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{sophisticationLevel.description}</span>
                        {sophisticationLevel.level < 5 && (
                          <span>
                            {nextLevelThreshold - profile.totalInteractions === 1
                              ? "One more touch to deepen"
                              : `${nextLevelThreshold - profile.totalInteractions} touches until new depths emerge`}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {profile.discoveredCorrelations.length}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {profile.discoveredCorrelations.length === 0
                              ? "Patterns waiting to emerge"
                              : profile.discoveredCorrelations.length === 1
                              ? "One connection revealed"
                              : "Threads of connection"}
                          </div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {Object.keys(profile.layerPreferences).length}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Object.keys(profile.layerPreferences).length <= 1
                              ? "Beginning to wander"
                              : "Realms of exploration"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Exploration Style */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Your Exploration Style
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="secondary" className="capitalize">
                          {profile.behaviorPatterns.explorationStyle}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {profile.behaviorPatterns.explorationStyle === 'deep' 
                            ? 'Soul' 
                            : profile.behaviorPatterns.explorationStyle === 'broad'
                            ? 'Wanderer'
                            : profile.behaviorPatterns.explorationStyle === 'focused'
                            ? 'Seeker'
                            : 'Gentle Visitor'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Where your attention flows:</h4>
                        <div className="space-y-2">
                          {Object.entries(profile.layerPreferences)
                            .sort(([,a], [,b]) => (b as number) - (a as number))
                            .slice(0, 3)
                            .map(([layer, count]) => (
                              <div key={layer} className="flex items-center justify-between">
                                <span className="capitalize text-sm">{layer}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary transition-all"
                                      style={{ 
                                        width: `${Math.min(100, ((count as number) / profile.totalInteractions) * 100)}%` 
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs text-muted-foreground w-8">
                                    {count}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Life Phase */}
                  {lifePhase && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-lg">{LifePhaseThemeMap[lifePhase.currentPhase].icon}</span>
                          Current Life Phase
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="secondary" 
                            className="capitalize"
                            style={{ borderColor: LifePhaseThemeMap[lifePhase.currentPhase].color }}
                          >
                            {LifePhaseThemeMap[lifePhase.currentPhase].name}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: LifePhaseThemeMap[lifePhase.currentPhase].color }} />
                            <span className="text-sm text-muted-foreground">
                              {Math.round(lifePhase.phaseStability * 100)}% stable
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-gradient-to-r from-muted/30 to-muted/10">
                          <p className="text-sm leading-relaxed">
                            {LifePhaseThemeMap[lifePhase.currentPhase].description}
                          </p>
                        </div>
                        
                        {lifePhase.transitionReadiness > 0.6 && (
                          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              Your energy suggests a transition may be emerging. Change is stirring beneath the surface.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-2">
                        Last seen: {new Date(profile.lastActiveDate).toLocaleDateString()}
                      </div>
                      {recentInteractions.length > 0 ? (
                        <div className="space-y-2">
                          {recentInteractions.slice(-3).map((interaction, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                              <div className="w-2 h-2 bg-primary rounded-full" />
                              <span className="capitalize text-sm">{interaction.layerType}</span>
                              <span className="text-xs text-muted-foreground ml-auto">
                                {new Date(interaction.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No recent interactions</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="correlations" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Current Data Correlations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(currentCorrelations).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(currentCorrelations)
                            .sort(([,a], [,b]) => Math.abs(b as number) - Math.abs(a as number))
                            .map(([correlationKey, strength]) => (
                              <div key={correlationKey} className="space-y-2">
                                <div 
                                  className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                  onClick={() => toggleCorrelationExpansion(correlationKey)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className={`w-3 h-3 rounded-full ${getCorrelationColor(strength as number)}`}
                                    />
                                    <span className="font-medium capitalize">
                                      {correlationKey.replace('-', ' → ')}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">
                                      {getCorrelationLabel(strength as number)}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {Math.round(Math.abs(strength as number) * 100)}%
                                    </span>
                                    {expandedCorrelations.includes(correlationKey) ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </div>
                                </div>
                                
                                {expandedCorrelations.includes(correlationKey) && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="px-3 pb-3 text-sm text-muted-foreground"
                                  >
                                    This correlation suggests that changes in{' '}
                                    <span className="capitalize">{correlationKey.split('-')[0]}</span>
                                    {' '}tend to {strength as number > 0 ? 'positively' : 'negatively'} influence{' '}
                                    <span className="capitalize">{correlationKey.split('-')[1]}</span>.
                                    The strength of {Math.abs(strength as number).toFixed(2)} indicates a{' '}
                                    {Math.abs(strength as number) > 0.6 ? 'strong' : 'moderate'} relationship.
                                  </motion.div>
                                )}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No correlations detected. More data points needed for analysis.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Historical Correlations */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Discovered Correlations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {profile.discoveredCorrelations.length > 0 ? (
                        <div className="space-y-2">
                          {profile.discoveredCorrelations
                            .sort((a, b) => b.confidence - a.confidence)
                            .map((correlation, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                <span className="text-sm capitalize">
                                  {correlation.layers.join(' ↔ ')}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    {Math.round(correlation.confidence * 100)}%
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(correlation.discoveredAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Keep exploring to discover correlations between your life patterns.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="patterns" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Temporal Patterns
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recentPatterns ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <div className="text-lg font-semibold capitalize">
                                {recentPatterns.trend.direction}
                              </div>
                              <div className="text-sm text-muted-foreground">Trend</div>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <div className="text-lg font-semibold">
                                {recentPatterns.cycles.period || 'None'}
                              </div>
                              <div className="text-sm text-muted-foreground">Cycle Period</div>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <div className="text-lg font-semibold">
                                {recentPatterns.anomalies.count}
                              </div>
                              <div className="text-sm text-muted-foreground">Anomalies</div>
                            </div>
                          </div>
                          
                          {recentPatterns.trend.strength > 0.1 && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <span className="font-medium">Trend Analysis</span>
                              </div>
                              <p className="text-sm">
                                Your data shows a {recentPatterns.trend.direction} trend with 
                                strength {recentPatterns.trend.strength.toFixed(2)}. This suggests 
                                {recentPatterns.trend.direction === 'increasing' 
                                  ? ' improvement over time.' 
                                  : recentPatterns.trend.direction === 'decreasing'
                                  ? ' a decline that might need attention.'
                                  : ' stability in your patterns.'}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Insufficient data for pattern analysis. Continue tracking to see temporal patterns emerge.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="insights" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Personalized Reflection
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {lifePhase ? (
                        <div className="space-y-4">
                          {/* Phase-Aware Insight */}
                          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
                            <div className="flex items-start gap-3">
                              <span className="text-lg mt-0.5 flex-shrink-0">
                                {LifePhaseThemeMap[lifePhase.currentPhase].icon}
                              </span>
                              <div className="space-y-2">
                                <p className="text-sm leading-relaxed">
                                  {(() => {
                                    const phaseInsight = generatePhaseAwareInsight(lifePhase, profile, recentInteractions);
                                    return phaseInsight.message;
                                  })()}
                                </p>
                                
                                {(() => {
                                  const phaseInsight = generatePhaseAwareInsight(lifePhase, profile, recentInteractions);
                                  return phaseInsight.actionInvitation && (
                                    <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-white/20">
                                      <p className="text-sm text-muted-foreground">
                                        <strong>Gentle invitation:</strong> {phaseInsight.actionInvitation}
                                      </p>
                                    </div>
                                  );
                                })()}
                                
                                {(() => {
                                  const phaseInsight = generatePhaseAwareInsight(lifePhase, profile, recentInteractions);
                                  return phaseInsight.reflectionPrompt && (
                                    <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-white/20">
                                      <p className="text-sm text-muted-foreground">
                                        <strong>Reflection:</strong> {phaseInsight.reflectionPrompt}
                                      </p>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm leading-relaxed">
                                {generateReflectionPrompts(
                                  recentInteractions.map(i => ({
                                    slice: {},
                                    layerType: i.layerType,
                                    timestamp: i.timestamp,
                                    dataValue: i.dataValue,
                                    angle: 0
                                  })),
                                  recentPatterns
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Intelligence Level Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Current Intelligence Level
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Level {sophisticationLevel.level}</span>
                          <Badge variant="outline">{sophisticationLevel.description}</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Capabilities at this level:</h4>
                          <ul className="space-y-1">
                            {sophisticationLevel.characteristics.map((characteristic, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                <ArrowRight className="w-3 h-3" />
                                {characteristic}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {sophisticationLevel.level < 5 && (
                          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">
                              <strong>Next level:</strong> {nextLevelThreshold - profile.totalInteractions} more interactions 
                              to unlock enhanced capabilities.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Sparkles } from 'lucide-react';
import { PhaseHistoryEntry } from '@/utils/phase-history-manager';
import { LifePhaseThemeMap } from '@/utils/life-phase-detection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PhaseTimelineTrackerProps {
  history: PhaseHistoryEntry[];
  onReflectionAdd?: (phaseIndex: number, reflection: string) => void;
}

export const PhaseTimelineTracker: React.FC<PhaseTimelineTrackerProps> = ({
  history,
  onReflectionAdd
}) => {
  const [expandedPhase, setExpandedPhase] = React.useState<number | null>(null);
  const [reflectionText, setReflectionText] = React.useState('');

  const formatDuration = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Just began';
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.ceil(days / 7)} week${Math.ceil(days / 7) > 1 ? 's' : ''}`;
    return `${Math.ceil(days / 30)} month${Math.ceil(days / 30) > 1 ? 's' : ''}`;
  };

  const handleAddReflection = (phaseIndex: number) => {
    if (reflectionText.trim() && onReflectionAdd) {
      onReflectionAdd(phaseIndex, reflectionText.trim());
      setReflectionText('');
      setExpandedPhase(null);
    }
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Phase Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your phase journey will appear here as it unfolds.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Phase Timeline
          <Badge variant="outline">{history.length} chapter{history.length > 1 ? 's' : ''}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.slice().reverse().map((entry, reverseIndex) => {
            const index = history.length - 1 - reverseIndex;
            const theme = LifePhaseThemeMap[entry.phase];
            const isExpanded = expandedPhase === index;
            const isCurrent = !entry.endDate;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reverseIndex * 0.1 }}
                className={`relative p-3 rounded-lg border transition-all ${
                  isCurrent 
                    ? 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20' 
                    : 'bg-muted/30 border-muted'
                }`}
              >
                {/* Timeline connector */}
                {reverseIndex < history.length - 1 && (
                  <div className="absolute left-6 -bottom-3 w-0.5 h-6 bg-muted-foreground/20" />
                )}
                
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedPhase(isExpanded ? null : index)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${theme.color}20`, borderColor: theme.color }}
                    >
                      {theme.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{theme.name}</span>
                        {isCurrent && (
                          <Badge variant="default" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(entry.startDate).toLocaleDateString()}
                          {entry.endDate && ` → ${new Date(entry.endDate).toLocaleDateString()}`}
                        </span>
                        <span>•</span>
                        <span>{formatDuration(entry.startDate, entry.endDate)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-muted-foreground">
                        {Math.round(entry.intensity * 100)}% intensity
                      </div>
                      {entry.userReflection && (
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-muted"
                  >
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {theme.description}
                      </p>
                      
                      {entry.transitionReason && (
                        <div className="text-xs text-muted-foreground italic">
                          {entry.transitionReason}
                        </div>
                      )}
                      
                      {entry.userReflection ? (
                        <div className="p-3 bg-background/80 rounded border border-dashed">
                          <div className="text-xs text-muted-foreground mb-1">Your reflection:</div>
                          <p className="text-sm italic">"{entry.userReflection}"</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">
                            Add a reflection for this phase:
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="What was this time like for you?"
                              value={reflectionText}
                              onChange={(e) => setReflectionText(e.target.value)}
                              className="flex-1 px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddReflection(index);
                                }
                              }}
                            />
                            <Button 
                              size="sm" 
                              onClick={() => handleAddReflection(index)}
                              disabled={!reflectionText.trim()}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
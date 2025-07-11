/**
 * [Lap 12: Future Jamal Features]
 * Phase Transition Constellations - Visual arcs connecting phase transitions
 * 
 * Purpose: Show turning points in life journey as curved constellation lines
 * Features: Transition arcs, hover insights, temporal connections
 */

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Calendar, ArrowRight, Clock } from 'lucide-react';
import { LifePhase, LifePhaseThemeMap } from '@/utils/life-phase-detection';
import { PhaseHistoryEntry, PhaseTransition, loadPhaseHistory, getPhaseTransitionInsight } from '@/utils/phase-history-manager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';

interface TransitionArc {
  id: string;
  fromPhase: LifePhase;
  toPhase: LifePhase;
  timestamp: string;
  insight: string;
  strength: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  controlX: number;
  controlY: number;
}

interface PhaseTransitionConstellationsProps {
  currentPhase?: LifePhase | null;
  className?: string;
  isMinimal?: boolean;
}

export const PhaseTransitionConstellations: React.FC<PhaseTransitionConstellationsProps> = ({
  currentPhase,
  className = '',
  isMinimal = false
}) => {
  const [hoveredTransition, setHoveredTransition] = useState<TransitionArc | null>(null);
  const phaseHistory = loadPhaseHistory();

  const transitionArcs = useMemo((): TransitionArc[] => {
    if (phaseHistory.length < 2) return [];

    const arcs: TransitionArc[] = [];
    const width = 400;
    const height = 200;
    const margin = 50;

    // Create positions for each phase in history
    const phasePositions: Record<string, { x: number; y: number }> = {};
    
    phaseHistory.forEach((entry, index) => {
      const x = margin + (index / Math.max(1, phaseHistory.length - 1)) * (width - 2 * margin);
      const y = height / 2 + Math.sin(index * 0.5) * 30; // Slight wave pattern
      phasePositions[`${entry.phase}-${index}`] = { x, y };
    });

    // Create transition arcs between consecutive phases
    for (let i = 1; i < phaseHistory.length; i++) {
      const fromEntry = phaseHistory[i - 1];
      const toEntry = phaseHistory[i];
      
      if (fromEntry.phase !== toEntry.phase) {
        const fromPos = phasePositions[`${fromEntry.phase}-${i-1}`];
        const toPos = phasePositions[`${toEntry.phase}-${i}`];
        
        // Calculate control point for smooth curve
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = Math.min(fromPos.y, toPos.y) - 40; // Arc upward
        
        const transition: PhaseTransition = {
          from: fromEntry.phase,
          to: toEntry.phase,
          timestamp: toEntry.startDate,
          strength: toEntry.stabilityScore
        };

        arcs.push({
          id: `transition-${i}`,
          fromPhase: fromEntry.phase,
          toPhase: toEntry.phase,
          timestamp: toEntry.startDate,
          insight: getPhaseTransitionInsight(transition),
          strength: toEntry.stabilityScore,
          x1: fromPos.x,
          y1: fromPos.y,
          x2: toPos.x,
          y2: toPos.y,
          controlX: midX,
          controlY: midY
        });
      }
    }

    return arcs;
  }, [phaseHistory]);

  const createCurvePath = (arc: TransitionArc) => {
    return `M ${arc.x1} ${arc.y1} Q ${arc.controlX} ${arc.controlY} ${arc.x2} ${arc.y2}`;
  };

  if (transitionArcs.length === 0) {
    return isMinimal ? null : (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            Transition Constellations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          Phase transitions will appear here as your journey unfolds
        </CardContent>
      </Card>
    );
  }

  if (isMinimal) {
    return (
      <div className={`${className} relative`}>
        <svg width="200" height="60" className="opacity-70">
          {transitionArcs.slice(-3).map((arc, index) => (
            <motion.path
              key={arc.id}
              d={createCurvePath({
                ...arc,
                x1: 20 + index * 60,
                y1: 30,
                x2: 80 + index * 60,
                y2: 30,
                controlX: 50 + index * 60,
                controlY: 15
              })}
              fill="none"
              stroke={LifePhaseThemeMap[arc.toPhase].color}
              strokeWidth="2"
              opacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: index * 0.2 }}
            />
          ))}
        </svg>
      </div>
    );
  }

  return (
    <Card className={`${className} relative overflow-hidden`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4" />
          Transition Constellations
          <span className="text-xs text-muted-foreground ml-auto">
            {transitionArcs.length} transitions
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative">
          {/* SVG Constellation */}
          <svg width="400" height="200" className="w-full">
            {/* Background grid (optional) */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="400" height="200" fill="url(#grid)" />

            {/* Phase points */}
            {phaseHistory.map((entry, index) => {
              const x = 50 + (index / Math.max(1, phaseHistory.length - 1)) * 300;
              const y = 100 + Math.sin(index * 0.5) * 30;
              
              return (
                <motion.g key={`${entry.phase}-${index}`}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={LifePhaseThemeMap[entry.phase].color}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                    className="cursor-pointer"
                    whileHover={{ scale: 1.2, opacity: 1 }}
                  />
                  <motion.text
                    x={x}
                    y={y + 20}
                    textAnchor="middle"
                    fontSize="10"
                    fill="hsl(var(--muted-foreground))"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="select-none"
                  >
                    {LifePhaseThemeMap[entry.phase].icon}
                  </motion.text>
                </motion.g>
              );
            })}

            {/* Transition arcs */}
            {transitionArcs.map((arc, index) => (
              <motion.g key={arc.id}>
                <motion.path
                  d={createCurvePath(arc)}
                  fill="none"
                  stroke={LifePhaseThemeMap[arc.toPhase].color}
                  strokeWidth="2"
                  opacity="0.6"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.5 + index * 0.2,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    opacity: 1,
                    strokeWidth: 3,
                    strokeDasharray: "none"
                  }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredTransition(arc)}
                  onMouseLeave={() => setHoveredTransition(null)}
                />
                
                {/* Arrow marker */}
                <motion.polygon
                  points={`${arc.x2-5},${arc.y2-3} ${arc.x2},${arc.y2} ${arc.x2-5},${arc.y2+3}`}
                  fill={LifePhaseThemeMap[arc.toPhase].color}
                  opacity="0.6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.2 }}
                />
              </motion.g>
            ))}
          </svg>

          {/* Hover tooltip */}
          <AnimatePresence>
            {hoveredTransition && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-4 left-4 right-4 p-4 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    <span className="mr-1">{LifePhaseThemeMap[hoveredTransition.fromPhase].icon}</span>
                    {LifePhaseThemeMap[hoveredTransition.fromPhase].name}
                  </Badge>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    <span className="mr-1">{LifePhaseThemeMap[hoveredTransition.toPhase].icon}</span>
                    {LifePhaseThemeMap[hoveredTransition.toPhase].name}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground italic mb-2">
                  {hoveredTransition.insight}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(hoveredTransition.timestamp), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {Math.round(hoveredTransition.strength * 100)}% stability
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent transitions list */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs font-medium mb-2 text-muted-foreground">Recent Transitions</div>
          <div className="space-y-1">
            {transitionArcs.slice(-2).reverse().map((arc) => (
              <div key={arc.id} className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span>{LifePhaseThemeMap[arc.fromPhase].icon}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <span>{LifePhaseThemeMap[arc.toPhase].icon}</span>
                </div>
                <span className="text-muted-foreground">
                  {format(new Date(arc.timestamp), 'MMM d')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
/**
 * [Lap 12: Future Jamal Features]
 * Life Phase Timeline - Visual ring/radial history of past life phases
 * 
 * Purpose: Show life seasons across time in a beautiful radial format
 * Features: Phase arc segments, hover insights, transition points
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Calendar } from 'lucide-react';
import { LifePhase, LifePhaseThemeMap } from '@/utils/life-phase-detection';
import { PhaseHistoryEntry, loadPhaseHistory } from '@/utils/phase-history-manager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, differenceInDays } from 'date-fns';

interface PhaseArc {
  phase: LifePhase;
  startAngle: number;
  endAngle: number;
  color: string;
  duration: number;
  intensity: number;
  entry: PhaseHistoryEntry;
}

interface LifePhaseTimelineProps {
  currentPhase?: LifePhase | null;
  className?: string;
  onPhaseHover?: (phase: LifePhase | null) => void;
}

export const LifePhaseTimeline: React.FC<LifePhaseTimelineProps> = ({
  currentPhase,
  className = '',
  onPhaseHover
}) => {
  const phaseHistory = loadPhaseHistory();
  
  const phaseArcs = useMemo((): PhaseArc[] => {
    if (phaseHistory.length === 0) return [];

    // Calculate total timeline duration
    const firstEntry = phaseHistory[0];
    const lastEntry = phaseHistory[phaseHistory.length - 1];
    const totalDuration = differenceInDays(
      new Date(lastEntry.endDate || new Date().toISOString()),
      new Date(firstEntry.startDate)
    ) || 1;

    let currentAngle = 0;
    const arcs: PhaseArc[] = [];

    phaseHistory.forEach((entry, index) => {
      const startDate = new Date(entry.startDate);
      const endDate = new Date(entry.endDate || new Date().toISOString());
      const duration = differenceInDays(endDate, startDate) || 1;
      
      // Calculate arc size proportional to duration
      const arcSize = (duration / totalDuration) * 360;
      const endAngle = currentAngle + Math.max(arcSize, 15); // Minimum 15 degrees per phase

      arcs.push({
        phase: entry.phase,
        startAngle: currentAngle,
        endAngle: endAngle,
        color: LifePhaseThemeMap[entry.phase].color,
        duration,
        intensity: entry.intensity,
        entry
      });

      currentAngle = endAngle;
    });

    return arcs;
  }, [phaseHistory]);

  const radius = 80;
  const strokeWidth = 12;
  const center = 100;

  // Create SVG path for arc
  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const startAngleRad = (startAngle - 90) * Math.PI / 180;
    const endAngleRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  if (phaseArcs.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            Phase Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          Your journey timeline will appear here as phases develop
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} relative overflow-hidden`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4" />
          Life Phase Timeline
          <span className="text-xs text-muted-foreground ml-auto">
            {phaseArcs.length} phases
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-6">
        <div className="relative">
          {/* SVG Timeline Ring */}
          <svg width="200" height="200" className="drop-shadow-sm">
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              opacity="0.3"
            />
            
            {/* Phase arcs */}
            {phaseArcs.map((arc, index) => (
              <motion.g key={`${arc.phase}-${index}`}>
                <motion.path
                  d={createArcPath(arc.startAngle, arc.endAngle, radius)}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  opacity={0.8}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    opacity: 1,
                    strokeWidth: strokeWidth + 2,
                    filter: "brightness(1.2)"
                  }}
                  className="cursor-pointer"
                  onMouseEnter={() => onPhaseHover?.(arc.phase)}
                  onMouseLeave={() => onPhaseHover?.(null)}
                />
                
                {/* Phase icon at midpoint */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <circle
                    cx={center + (radius + 15) * Math.cos(((arc.startAngle + arc.endAngle) / 2 - 90) * Math.PI / 180)}
                    cy={center + (radius + 15) * Math.sin(((arc.startAngle + arc.endAngle) / 2 - 90) * Math.PI / 180)}
                    r="8"
                    fill={arc.color}
                    opacity="0.9"
                    className="cursor-pointer"
                    onMouseEnter={() => onPhaseHover?.(arc.phase)}
                    onMouseLeave={() => onPhaseHover?.(null)}
                  />
                  <text
                    x={center + (radius + 15) * Math.cos(((arc.startAngle + arc.endAngle) / 2 - 90) * Math.PI / 180)}
                    y={center + (radius + 15) * Math.sin(((arc.startAngle + arc.endAngle) / 2 - 90) * Math.PI / 180)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="10"
                    fill="white"
                    className="pointer-events-none select-none"
                  >
                    {LifePhaseThemeMap[arc.phase].icon}
                  </text>
                </motion.g>
              </motion.g>
            ))}
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {currentPhase ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-1"
                >
                  <div className="text-lg">{LifePhaseThemeMap[currentPhase].icon}</div>
                  <div className="text-xs font-medium">Now</div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="ml-6 space-y-2 max-w-32">
          <div className="text-xs font-medium mb-2">Recent Phases</div>
          {phaseArcs.slice(-3).reverse().map((arc, index) => (
            <motion.div
              key={`legend-${arc.phase}-${index}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="flex items-center gap-2 text-xs cursor-pointer hover:opacity-80"
              onMouseEnter={() => onPhaseHover?.(arc.phase)}
              onMouseLeave={() => onPhaseHover?.(null)}
            >
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: arc.color }}
              />
              <div className="min-w-0">
                <div className="font-medium truncate">
                  {LifePhaseThemeMap[arc.phase].name}
                </div>
                <div className="text-muted-foreground">
                  {arc.duration === 1 ? '1 day' : `${arc.duration} days`}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
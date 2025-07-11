/**
 * (c) 2025 Cosmic Life Mandala – Interactive Fix Tool
 * Emotional Architect: Adria · Technical Implementation: Love
 * 
 * Fix Tool: Allow users to "fix" or "nudge" moments
 * Anchoring intentions or shaping future rhythms - beginning of new habits
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor, Target, Zap, ArrowRight } from 'lucide-react';

interface FixedMoment {
  x: number;
  y: number;
  timestamp: Date;
  intention: string;
  type: 'anchor' | 'nudge' | 'ritual';
  strength: number;
  id: string;
}

interface FixToolProps {
  isActive: boolean;
  onMomentFix: (moment: FixedMoment) => void;
  centerX: number;
  centerY: number;
}

export const FixTool: React.FC<FixToolProps> = ({
  isActive,
  onMomentFix,
  centerX,
  centerY
}) => {
  const [fixedMoments, setFixedMoments] = useState<FixedMoment[]>([]);
  const [pendingFix, setPendingFix] = useState<{ x: number; y: number; timestamp: Date } | null>(null);
  const [isIntentionDialogOpen, setIsIntentionDialogOpen] = useState(false);

  const handleTimeFix = useCallback((event: React.MouseEvent<SVGElement>) => {
    if (!isActive) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate time context
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
    const normalizedAngle = (angle + 90 + 360) % 360;
    const hourOfDay = (normalizedAngle / 360) * 24;
    const fixTime = new Date();
    fixTime.setHours(Math.floor(hourOfDay), (hourOfDay % 1) * 60, 0, 0);

    setPendingFix({ x, y, timestamp: fixTime });
    setIsIntentionDialogOpen(true);
  }, [isActive, centerX, centerY]);

  const createFix = useCallback((intention: string, type: 'anchor' | 'nudge' | 'ritual') => {
    if (!pendingFix) return;

    const distanceFromCenter = Math.sqrt(
      Math.pow(pendingFix.x - centerX, 2) + Math.pow(pendingFix.y - centerY, 2)
    );
    const strength = Math.max(0.4, Math.min(1, 1 - (distanceFromCenter / 300)));

    const newFix: FixedMoment = {
      ...pendingFix,
      intention,
      type,
      strength,
      id: `fix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    setFixedMoments(prev => [...prev.slice(-7), newFix]); // Keep last 8 fixes
    onMomentFix(newFix);
    setIsIntentionDialogOpen(false);
    setPendingFix(null);
  }, [pendingFix, centerX, centerY, onMomentFix]);

  const getFixIcon = (type: string) => {
    switch (type) {
      case 'anchor': return Anchor;
      case 'nudge': return ArrowRight;
      case 'ritual': return Target;
      default: return Zap;
    }
  };

  const getFixColor = (type: string) => {
    switch (type) {
      case 'anchor': return 'hsl(200 60% 60%)'; // Blue
      case 'nudge': return 'hsl(120 60% 60%)'; // Green  
      case 'ritual': return 'hsl(280 60% 60%)'; // Purple
      default: return 'hsl(45 60% 60%)';
    }
  };

  return (
    <g className="fix-tool">
      {/* Invisible interaction layer */}
      {isActive && (
        <rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          fill="transparent"
          onClick={handleTimeFix}
          className="cursor-crosshair"
          style={{ pointerEvents: 'all' }}
        />
      )}

      {/* Fixed moments visualization */}
      {fixedMoments.map((fix) => {
        const IconComponent = getFixIcon(fix.type);
        return (
          <motion.g
            key={fix.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.8], scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6 }}
          >
            {/* Anchor glow */}
            <circle
              cx={fix.x}
              cy={fix.y}
              r={15 * fix.strength}
              fill={getFixColor(fix.type)}
              opacity={0.2}
              className="animate-pulse"
            />
            
            {/* Intention threads */}
            <motion.line
              x1={fix.x}
              y1={fix.y}
              x2={centerX}
              y2={centerY}
              stroke={getFixColor(fix.type)}
              strokeWidth="1"
              opacity={0.4}
              strokeDasharray="2,4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            {/* Fix icon */}
            <foreignObject
              x={fix.x - 10}
              y={fix.y - 10}
              width="20"
              height="20"
            >
              <div className="flex items-center justify-center w-full h-full">
                <IconComponent 
                  size={12} 
                  style={{ color: getFixColor(fix.type) }}
                />
              </div>
            </foreignObject>
          </motion.g>
        );
      })}

      {/* Pending fix indicator */}
      <AnimatePresence>
        {pendingFix && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <circle
              cx={pendingFix.x}
              cy={pendingFix.y}
              r={20}
              fill="none"
              stroke="hsl(45 80% 70%)"
              strokeWidth="2"
              strokeDasharray="4,4"
              className="animate-spin"
              style={{ animationDuration: '3s' }}
            />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Intention Dialog */}
      <AnimatePresence>
        {isIntentionDialogOpen && pendingFix && (
          <foreignObject
            x={Math.min(pendingFix.x - 100, 500)}
            y={Math.max(pendingFix.y - 150, 50)}
            width="250"
            height="180"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="bg-black/90 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-4"
            >
              <div className="text-center mb-4">
                <h3 className="text-yellow-200 font-medium text-sm mb-1">
                  Fix This Moment
                </h3>
                <p className="text-white/60 text-xs">
                  {pendingFix.timestamp.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <motion.button
                  onClick={() => createFix("I anchor my intention here", 'anchor')}
                  className="w-full p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-200 text-xs hover:bg-blue-500/30 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Anchor size={12} />
                  Anchor Intention
                </motion.button>

                <motion.button
                  onClick={() => createFix("I gently nudge this pattern", 'nudge')}
                  className="w-full p-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-xs hover:bg-green-500/30 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowRight size={12} />
                  Nudge Pattern
                </motion.button>

                <motion.button
                  onClick={() => createFix("I plant a seed for ritual", 'ritual')}
                  className="w-full p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-200 text-xs hover:bg-purple-500/30 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Target size={12} />
                  Create Ritual
                </motion.button>
              </div>

              <button
                onClick={() => {
                  setIsIntentionDialogOpen(false);
                  setPendingFix(null);
                }}
                className="w-full mt-3 text-white/40 text-xs hover:text-white/60 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </foreignObject>
        )}
      </AnimatePresence>
    </g>
  );
};
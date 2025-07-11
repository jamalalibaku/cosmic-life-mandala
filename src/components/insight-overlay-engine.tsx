/**
 * [Phase: ZIP9-Beta | Lap 4: Interactive Insight & Response Logic]
 * Insight Overlay Engine - Orchestrates interaction responses and neural impulses
 * 
 * Purpose: Manage slice interactions, neural impulses, and insight display
 * Features: Click handling, impulse coordination, temporal memory tracking
 * Dependencies: InsightTriggerZone, NeuralImpulse, InsightEngine
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InsightTriggerZone } from '@/components/interactions/InsightTriggerZone';
import { NeuralImpulse } from '@/components/interactions/NeuralImpulse';
import { triggerInsightPrompt } from '@/utils/insight-engine';

interface SliceInteractionData {
  slice: any;
  layerType: string;
  timestamp: string;
  dataValue: any;
  angle: number;
}

interface ActiveImpulse {
  id: string;
  fromRadius: number;
  toRadius: number;
  angle: number;
  type: 'ripple' | 'arc' | 'pulse';
}

interface InsightOverlayEngineProps {
  timeSlices: any[];
  centerX: number;
  centerY: number;
  isActive?: boolean;
}

export const InsightOverlayEngine: React.FC<InsightOverlayEngineProps> = ({
  timeSlices,
  centerX,
  centerY,
  isActive = true
}) => {
  const [reviewedSlices, setReviewedSlices] = useState<Set<string>>(new Set());
  const [activeImpulses, setActiveImpulses] = useState<ActiveImpulse[]>([]);
  const [currentInsight, setCurrentInsight] = useState<string | null>(null);

  const handleSliceInteraction = useCallback((data: SliceInteractionData) => {
    console.log('🧠 Insight Overlay processing interaction:', data);
    
    // Mark slice as reviewed
    const sliceId = `${data.layerType}-${data.slice.id}`;
    setReviewedSlices(prev => new Set([...prev, sliceId]));
    
    // Trigger insight generation
    const insight = triggerInsightPrompt(data);
    setCurrentInsight(insight.message);
    
    // Create neural impulses to related layers
    const layerRadii = {
      sleep: 80,
      mood: 120,
      weather: 160,
      mobility: 200
    };
    
    const sourceRadius = layerRadii[data.layerType as keyof typeof layerRadii] || 120;
    const impulses: ActiveImpulse[] = [];
    
    // Generate impulses to related layers based on insight
    insight.relatedLayers.forEach((targetLayer, index) => {
      const targetRadius = layerRadii[targetLayer as keyof typeof layerRadii];
      if (targetRadius && targetRadius !== sourceRadius) {
        impulses.push({
          id: `${data.layerType}-${targetLayer}-${Date.now()}-${index}`,
          fromRadius: sourceRadius,
          toRadius: targetRadius,
          angle: data.angle,
          type: index % 2 === 0 ? 'pulse' : 'ripple'
        });
      }
    });
    
    setActiveImpulses(impulses);
    
    // Clear impulses after animation
    setTimeout(() => {
      setActiveImpulses([]);
    }, 2000);
    
    // Clear insight after reading time
    setTimeout(() => {
      setCurrentInsight(null);
    }, 5000);
    
  }, []);

  const isSliceReviewed = useCallback((layerType: string, sliceId: string) => {
    return reviewedSlices.has(`${layerType}-${sliceId}`);
  }, [reviewedSlices]);

  if (!isActive) return null;

  return (
    <g>
      {/* Render insight trigger zones for data-bearing slices */}
      {timeSlices.map((slice, index) => {
        // Only render trigger zones for slices with actual data
        const dataLayers = ['sleep', 'mood', 'weather'].filter(layer => slice.data[layer]);
        
        return dataLayers.map(layerType => {
          const layerRadii = {
            sleep: 80,
            mood: 120,
            weather: 160
          };
          
          const radius = layerRadii[layerType as keyof typeof layerRadii];
          const data = slice.data[layerType];
          
          if (!data || !radius) return null;
          
          // Determine color based on layer type and data
          const getColor = () => {
            switch (layerType) {
              case 'sleep':
                return 'hsl(240, 50%, 65%)';
              case 'mood':
                return data.color || 'hsl(280, 60%, 70%)';
              case 'weather':
                return data.color || 'hsl(200, 70%, 60%)';
              default:
                return 'hsl(var(--primary))';
            }
          };
          
          return (
            <InsightTriggerZone
              key={`trigger-${layerType}-${slice.id}`}
              slice={slice}
              layerType={layerType}
              radius={radius}
              angle={slice.angle}
              color={getColor()}
              onSliceInteraction={handleSliceInteraction}
              isReviewed={isSliceReviewed(layerType, slice.id)}
            />
          );
        });
      })}

      {/* Render active neural impulses */}
      {activeImpulses.map(impulse => (
        <NeuralImpulse
          key={impulse.id}
          fromRadius={impulse.fromRadius}
          toRadius={impulse.toRadius}
          angle={impulse.angle}
          impulseType={impulse.type}
          isActive={true}
          onComplete={() => {
            setActiveImpulses(prev => prev.filter(i => i.id !== impulse.id));
          }}
        />
      ))}

      {/* Insight Display Overlay */}
      <AnimatePresence>
        {currentInsight && (
          <motion.g>
            <motion.rect
              x={centerX - 150}
              y={centerY - 250}
              width="300"
              height="60"
              rx="8"
              fill="hsl(var(--background))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.95"
              initial={{ opacity: 0, y: centerY - 260 }}
              animate={{ opacity: 0.95, y: centerY - 250 }}
              exit={{ opacity: 0, y: centerY - 240 }}
              transition={{ duration: 0.3 }}
            />
            <motion.text
              x={centerX}
              y={centerY - 220}
              textAnchor="middle"
              fill="hsl(var(--foreground))"
              fontSize="12"
              fontFamily="Inter, system-ui, sans-serif"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <tspan x={centerX} dy="0">{currentInsight.substring(0, 50)}</tspan>
              {currentInsight.length > 50 && (
                <tspan x={centerX} dy="15">{currentInsight.substring(50, 100)}</tspan>
              )}
            </motion.text>
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
};
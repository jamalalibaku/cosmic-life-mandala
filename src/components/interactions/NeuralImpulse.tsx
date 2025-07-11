/**
 * [Phase: ZIP9-Beta | Lap 4: Interactive Insight & Response Logic]
 * Neural Impulse - Visual signal traveling between layers
 * 
 * Purpose: Simulate cognitive connections and cross-layer influences
 * Features: Animated arcs, pulses, ripples traveling from interaction point
 * Dependencies: Framer Motion, layer radius data
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NeuralImpulseProps {
  fromRadius: number;
  toRadius: number;
  angle: number;
  impulseType: 'ripple' | 'arc' | 'pulse';
  color?: string;
  isActive: boolean;
  onComplete?: () => void;
}

export const NeuralImpulse: React.FC<NeuralImpulseProps> = ({
  fromRadius,
  toRadius,
  angle,
  impulseType,
  color = "hsl(var(--primary))",
  isActive,
  onComplete
}) => {
  const [pathLength, setPathLength] = useState(0);
  
  const radian = (angle * Math.PI) / 180;
  const fromX = fromRadius * Math.cos(radian);
  const fromY = fromRadius * Math.sin(radian);
  const toX = toRadius * Math.cos(radian);
  const toY = toRadius * Math.sin(radian);

  useEffect(() => {
    if (isActive) {
      console.log('🧠 Neural impulse activated:', { fromRadius, toRadius, angle, impulseType });
    }
  }, [isActive, fromRadius, toRadius, angle, impulseType]);

  const renderRipple = () => (
    <motion.circle
      cx={fromX}
      cy={fromY}
      r="1"
      fill="none"
      stroke={color}
      strokeWidth="1"
      opacity="0.6"
      initial={{ r: 1, opacity: 0.8 }}
      animate={{ 
        r: Math.abs(toRadius - fromRadius) + 10,
        opacity: 0,
        strokeWidth: 0.5
      }}
      transition={{
        duration: 1.2,
        ease: "easeOut"
      }}
      onAnimationComplete={onComplete}
    />
  );

  const renderArc = () => {
    const pathData = `M ${fromX} ${fromY} Q ${fromX * 0.5} ${fromY * 0.5} ${toX} ${toY}`;
    
    return (
      <motion.path
        d={pathData}
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.7"
        strokeDasharray="4 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeInOut"
        }}
        onAnimationComplete={onComplete}
      />
    );
  };

  const renderPulse = () => (
    <motion.g>
      {/* Traveling dot */}
      <motion.circle
        cx={fromX}
        cy={fromY}
        r="2"
        fill={color}
        opacity="0.9"
        initial={{ cx: fromX, cy: fromY }}
        animate={{ cx: toX, cy: toY }}
        transition={{
          duration: 0.6,
          ease: "easeInOut"
        }}
        onAnimationComplete={onComplete}
      />
      {/* Trail line */}
      <motion.line
        x1={fromX}
        y1={fromY}
        x2={fromX}
        y2={fromY}
        stroke={color}
        strokeWidth="1"
        opacity="0.4"
        initial={{ x2: fromX, y2: fromY }}
        animate={{ x2: toX, y2: toY }}
        transition={{
          duration: 0.6,
          ease: "easeInOut"
        }}
      />
    </motion.g>
  );

  return (
    <AnimatePresence>
      {isActive && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {impulseType === 'ripple' && renderRipple()}
          {impulseType === 'arc' && renderArc()}
          {impulseType === 'pulse' && renderPulse()}
        </motion.g>
      )}
    </AnimatePresence>
  );
};
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RippleRing, ResonancePattern, rippleEngine } from '@/utils/ripple-consciousness';

interface RippleVisualizationProps {
  centerX?: number;
  centerY?: number;
  className?: string;
}

export const RippleVisualization: React.FC<RippleVisualizationProps> = ({
  centerX = 350,
  centerY = 350,
  className = ""
}) => {
  const [activeRipples, setActiveRipples] = useState<RippleRing[]>([]);
  const [resonancePatterns, setResonancePatterns] = useState<ResonancePattern[]>([]);

  useEffect(() => {
    // Subscribe to ripple updates
    const unsubscribeRipples = rippleEngine.onRippleUpdate((ripples) => {
      setActiveRipples(ripples);
    });

    // Subscribe to consciousness events
    const unsubscribeEvents = rippleEngine.onEvent((event) => {
      // Update resonance patterns when new events occur
      setResonancePatterns(rippleEngine.getResonancePatterns());
    });

    // Initial load
    setActiveRipples(rippleEngine.getActiveRipples());
    setResonancePatterns(rippleEngine.getResonancePatterns());

    return () => {
      unsubscribeRipples();
      unsubscribeEvents();
    };
  }, []);

  return (
    <g className={`ripple-consciousness-layer ${className}`}>
      {/* Ripple rings */}
      {activeRipples.map((ripple) => (
        <motion.circle
          key={ripple.id}
          cx={ripple.centerX}
          cy={ripple.centerY}
          r={ripple.currentRadius}
          fill="none"
          stroke={ripple.color}
          strokeWidth={2}
          opacity={ripple.opacity}
          initial={{ r: 0, opacity: 0.8 }}
          animate={{ 
            r: ripple.currentRadius,
            opacity: ripple.opacity 
          }}
          transition={{ 
            duration: 0.1,
            ease: "easeOut"
          }}
          className={`consciousness-ripple ripple-${ripple.type}`}
        />
      ))}

      {/* Resonance patterns - Standing wave visualizations */}
      {resonancePatterns.map((pattern) => (
        <g key={pattern.id} className="resonance-pattern">
          {/* Central resonance core */}
          <motion.circle
            cx={pattern.centerX}
            cy={pattern.centerY}
            r={pattern.amplitude}
            fill="none"
            stroke="hsl(320 70% 70%)"
            strokeWidth={1}
            opacity={0.6}
            animate={{
              r: [pattern.amplitude * 0.8, pattern.amplitude * 1.2, pattern.amplitude * 0.8],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 1 / pattern.frequency,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Harmonic rings for complex resonance */}
          {pattern.harmonic && (
            <>
              <motion.circle
                cx={pattern.centerX}
                cy={pattern.centerY}
                r={pattern.amplitude * 1.5}
                fill="none"
                stroke="hsl(320 50% 60%)"
                strokeWidth={0.5}
                opacity={0.3}
                animate={{
                  r: [pattern.amplitude * 1.3, pattern.amplitude * 1.7, pattern.amplitude * 1.3],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 2 / pattern.frequency,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.25
                }}
              />
              <motion.circle
                cx={pattern.centerX}
                cy={pattern.centerY}
                r={pattern.amplitude * 2}
                fill="none"
                stroke="hsl(320 30% 50%)"
                strokeWidth={0.25}
                opacity={0.2}
                animate={{
                  r: [pattern.amplitude * 1.8, pattern.amplitude * 2.2, pattern.amplitude * 1.8],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 3 / pattern.frequency,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </>
          )}

          {/* Connection lines between resonant events */}
          {pattern.eventIds.length > 1 && (
            <motion.path
              d={generateResonanceConnections(pattern)}
              fill="none"
              stroke="hsl(320 40% 60%)"
              strokeWidth={0.5}
              opacity={0.3}
              strokeDasharray="2,4"
              animate={{
                strokeDashoffset: [0, -6],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
        </g>
      ))}
    </g>
  );
};

// Helper function to generate connection paths between resonant events
function generateResonanceConnections(pattern: ResonancePattern): string {
  if (pattern.eventIds.length < 2) return '';
  
  // Create a graceful curved path connecting resonant points
  const points = pattern.eventIds.map(() => ({
    x: pattern.centerX + (Math.random() - 0.5) * 60,
    y: pattern.centerY + (Math.random() - 0.5) * 60
  }));
  
  if (points.length === 2) {
    const [p1, p2] = points;
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2 - 20; // Curve upward
    
    return `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;
  }
  
  // For multiple points, create a smooth curve
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const current = points[i];
    const previous = points[i - 1];
    const controlX = (previous.x + current.x) / 2;
    const controlY = (previous.y + current.y) / 2 - 15;
    
    path += ` Q ${controlX} ${controlY} ${current.x} ${current.y}`;
  }
  
  return path;
}

// Export additional helper component for consciousness event indicators
export const ConsciousnessEventIndicator: React.FC<{
  x: number;
  y: number;
  type: 'ritual' | 'insight' | 'reflection' | 'interaction' | 'awareness';
  intensity?: number;
}> = ({ x, y, type, intensity = 0.7 }) => {
  const colors = {
    ritual: 'hsl(280 70% 60%)',
    insight: 'hsl(220 70% 60%)',
    interaction: 'hsl(160 70% 60%)',
    reflection: 'hsl(45 70% 60%)',
    awareness: 'hsl(300 70% 60%)'
  };

  const icons = {
    ritual: '✨',
    insight: '💡',
    interaction: '🤝',
    reflection: '🕯️',
    awareness: '👁️'
  };

  return (
    <g className={`consciousness-indicator indicator-${type}`}>
      <motion.circle
        cx={x}
        cy={y}
        r={4}
        fill={colors[type]}
        opacity={intensity}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: intensity }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.text
        x={x}
        y={y + 1}
        textAnchor="middle"
        fontSize="6"
        fill="white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {icons[type]}
      </motion.text>
    </g>
  );
};
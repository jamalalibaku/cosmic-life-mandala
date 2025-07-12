/**
 * Atmospheric Aurora Layer - Celestial light show for meaningful moments
 * Appears only during significant life events, insights, and milestones
 * Creates a sacred, cosmic celebration of transformation
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuroraEvent {
  id: string;
  type: 'phase-transition' | 'insight-discovery' | 'milestone-reached' | 'correlation-found';
  intensity: number;
  colors: string[];
  duration: number;
  timestamp: number;
}

interface AtmosphericAuroraLayerProps {
  center: { x: number; y: number };
  radius: number;
  events: AuroraEvent[];
  className?: string;
}

export const AtmosphericAuroraLayer: React.FC<AtmosphericAuroraLayerProps> = ({
  center,
  radius,
  events,
  className = ''
}) => {
  const [activeAuroras, setActiveAuroras] = useState<AuroraEvent[]>([]);

  // Process incoming events and trigger auroras
  useEffect(() => {
    events.forEach(event => {
      // Check if this event is already active
      const isAlreadyActive = activeAuroras.some(aurora => aurora.id === event.id);
      
      if (!isAlreadyActive) {
        // Add new aurora
        setActiveAuroras(prev => [...prev, event]);
        
        // Remove after duration
        setTimeout(() => {
          setActiveAuroras(prev => prev.filter(aurora => aurora.id !== event.id));
        }, event.duration);
      }
    });
  }, [events]);

  const generateAuroraPath = (event: AuroraEvent, waveIndex: number): string => {
    const auroraRadius = radius * (1.2 + event.intensity * 0.8);
    const time = Date.now() * 0.001; // Convert to seconds
    const points: string[] = [];
    
    // Generate flowing aurora path
    for (let angle = 0; angle <= 360; angle += 10) {
      const radian = (angle * Math.PI) / 180;
      
      // Create flowing wave motion
      const wave1 = Math.sin(radian * 3 + time * 0.5 + waveIndex) * 8;
      const wave2 = Math.cos(radian * 2 + time * 0.3 + waveIndex * 1.5) * 12;
      const wave3 = Math.sin(radian * 5 + time * 0.8 + waveIndex * 0.7) * 5;
      
      const distortion = (wave1 + wave2 + wave3) * event.intensity;
      const currentRadius = auroraRadius + distortion;
      
      const x = center.x + Math.cos(radian) * currentRadius;
      const y = center.y + Math.sin(radian) * currentRadius;
      
      if (angle === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        points.push(`L ${x} ${y}`);
      }
    }
    
    points.push('Z'); // Close the path
    return points.join(' ');
  };

  const getAuroraColors = (event: AuroraEvent): string => {
    switch (event.type) {
      case 'phase-transition':
        return `
          <stop offset="0%" stopColor="hsl(280 70% 60%)" stopOpacity="0" />
          <stop offset="30%" stopColor="hsl(260 80% 70%)" stopOpacity="${event.intensity * 0.6}" />
          <stop offset="60%" stopColor="hsl(290 75% 65%)" stopOpacity="${event.intensity * 0.8}" />
          <stop offset="100%" stopColor="hsl(310 70% 60%)" stopOpacity="0" />
        `;
      
      case 'insight-discovery':
        return `
          <stop offset="0%" stopColor="hsl(45 80% 70%)" stopOpacity="0" />
          <stop offset="30%" stopColor="hsl(35 85% 75%)" stopOpacity="${event.intensity * 0.7}" />
          <stop offset="60%" stopColor="hsl(55 80% 80%)" stopOpacity="${event.intensity * 0.9}" />
          <stop offset="100%" stopColor="hsl(65 75% 85%)" stopOpacity="0" />
        `;
      
      case 'milestone-reached':
        return `
          <stop offset="0%" stopColor="hsl(120 60% 60%)" stopOpacity="0" />
          <stop offset="30%" stopColor="hsl(140 70% 65%)" stopOpacity="${event.intensity * 0.6}" />
          <stop offset="60%" stopColor="hsl(100 75% 70%)" stopOpacity="${event.intensity * 0.8}" />
          <stop offset="100%" stopColor="hsl(80 70% 75%)" stopOpacity="0" />
        `;
      
      case 'correlation-found':
        return `
          <stop offset="0%" stopColor="hsl(200 70% 65%)" stopOpacity="0" />
          <stop offset="30%" stopColor="hsl(220 75% 70%)" stopOpacity="${event.intensity * 0.6}" />
          <stop offset="60%" stopColor="hsl(180 80% 75%)" stopOpacity="${event.intensity * 0.8}" />
          <stop offset="100%" stopColor="hsl(160 75% 80%)" stopOpacity="0" />
        `;
      
      default:
        return `
          <stop offset="0%" stopColor="hsl(45 70% 70%)" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(45 80% 80%)" stopOpacity="${event.intensity * 0.7}" />
          <stop offset="100%" stopColor="hsl(45 70% 70%)" stopOpacity="0" />
        `;
    }
  };

  return (
    <motion.g className={className}>
      <defs>
        {/* Aurora filters for ethereal glow */}
        <filter id="aurora-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur1"/>
          <feGaussianBlur stdDeviation="4" result="blur2"/>
          <feGaussianBlur stdDeviation="2" result="blur3"/>
          <feMerge>
            <feMergeNode in="blur1"/>
            <feMergeNode in="blur2"/>
            <feMergeNode in="blur3"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Aurora gradients for each active event */}
        {activeAuroras.map(event => (
          <radialGradient
            key={`aurora-gradient-${event.id}`}
            id={`aurora-gradient-${event.id}`}
            cx="50%"
            cy="50%"
            r="60%"
            dangerouslySetInnerHTML={{
              __html: getAuroraColors(event)
            }}
          />
        ))}
      </defs>

      {/* Render active auroras */}
      <AnimatePresence>
        {activeAuroras.map((event, eventIndex) => (
          <motion.g
            key={event.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {/* Multiple aurora waves for depth */}
            {[0, 1, 2].map(waveIndex => (
              <motion.path
                key={`${event.id}-wave-${waveIndex}`}
                d={generateAuroraPath(event, waveIndex)}
                fill={`url(#aurora-gradient-${event.id})`}
                fillOpacity={0.4 - waveIndex * 0.1}
                filter="url(#aurora-glow)"
                animate={{
                  d: [
                    generateAuroraPath(event, waveIndex),
                    generateAuroraPath({ ...event, intensity: event.intensity * 1.2 }, waveIndex),
                    generateAuroraPath(event, waveIndex)
                  ]
                }}
                transition={{
                  duration: 8 + waveIndex * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: waveIndex * 0.5
                }}
                style={{
                  mixBlendMode: 'screen' // Additive blending for aurora effect
                }}
              />
            ))}
            
            {/* Aurora sparkles for magical effect */}
            {Array.from({ length: 20 }, (_, sparkleIndex) => {
              const angle = (sparkleIndex / 20) * 2 * Math.PI;
              const sparkleRadius = radius * (1.1 + event.intensity * 0.5 + Math.sin(Date.now() * 0.002 + sparkleIndex) * 0.2);
              const sparkleX = center.x + Math.cos(angle) * sparkleRadius;
              const sparkleY = center.y + Math.sin(angle) * sparkleRadius;
              
              return (
                <motion.circle
                  key={`${event.id}-sparkle-${sparkleIndex}`}
                  cx={sparkleX}
                  cy={sparkleY}
                  r={1.5}
                  fill={event.colors[0] || 'hsl(45 80% 80%)'}
                  opacity={0}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 2, 0.5],
                    r: [1.5, 3, 1.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: sparkleIndex * 0.2
                  }}
                />
              );
            })}
          </motion.g>
        ))}
      </AnimatePresence>
    </motion.g>
  );
};

// Hook for triggering aurora events from meaningful life moments
export function useAuroraEvents() {
  const [events, setEvents] = useState<AuroraEvent[]>([]);
  
  const triggerAurora = (
    type: AuroraEvent['type'],
    intensity: number = 0.7,
    duration: number = 15000
  ) => {
    const newEvent: AuroraEvent = {
      id: `aurora-${Date.now()}-${Math.random()}`,
      type,
      intensity: Math.min(1, Math.max(0.3, intensity)),
      colors: getEventColors(type),
      duration,
      timestamp: Date.now()
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    // Auto-remove after duration + buffer
    setTimeout(() => {
      setEvents(prev => prev.filter(event => event.id !== newEvent.id));
    }, duration + 2000);
  };
  
  return {
    events,
    triggerAurora,
    triggerPhaseTransition: () => triggerAurora('phase-transition', 0.8, 20000),
    triggerInsightDiscovery: () => triggerAurora('insight-discovery', 0.9, 12000),
    triggerMilestone: () => triggerAurora('milestone-reached', 0.7, 18000),
    triggerCorrelation: () => triggerAurora('correlation-found', 0.6, 10000)
  };
}

function getEventColors(type: AuroraEvent['type']): string[] {
  switch (type) {
    case 'phase-transition':
      return ['hsl(280 70% 60%)', 'hsl(260 80% 70%)', 'hsl(290 75% 65%)'];
    case 'insight-discovery':
      return ['hsl(45 80% 70%)', 'hsl(35 85% 75%)', 'hsl(55 80% 80%)'];
    case 'milestone-reached':
      return ['hsl(120 60% 60%)', 'hsl(140 70% 65%)', 'hsl(100 75% 70%)'];
    case 'correlation-found':
      return ['hsl(200 70% 65%)', 'hsl(220 75% 70%)', 'hsl(180 80% 75%)'];
    default:
      return ['hsl(45 70% 70%)', 'hsl(45 80% 80%)'];
  }
}
/**
 * Orbital Insight Satellites - Replace static quote system with orbiting paper balls
 * 
 * Purpose: Create 3 paper-ball insights that orbit horizontally around the soul core
 * Features: Click to unfold quotes, orbital trails, smooth transitions
 * Design: Elegant orbital motion with quote expansion/collapse
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Quote {
  id: string;
  text: string;
  author?: string;
  type: 'mood' | 'cosmos' | 'insight' | 'reflection';
  timestamp: Date;
}

interface OrbitalInsightSatellitesProps {
  centerX: number;
  centerY: number;
  soulCoreRadius: number;
  quotes?: Quote[];
  maxSatellites?: number;
}

// Curated insight quotes
const insightQuotes: Quote[] = [
  {
    id: '1',
    text: 'In the orbital dance of consciousness, every thought finds its celestial rhythm.',
    type: 'reflection',
    timestamp: new Date()
  },
  {
    id: '2', 
    text: 'Time flows like liquid starlight through the chambers of memory.',
    type: 'cosmos',
    timestamp: new Date()
  },
  {
    id: '3',
    text: 'Your emotions are aurora patterns painted across the sky of awareness.',
    type: 'mood',
    timestamp: new Date()
  }
];

export const OrbitalInsightSatellites: React.FC<OrbitalInsightSatellitesProps> = ({
  centerX,
  centerY,
  soulCoreRadius,
  quotes = insightQuotes,
  maxSatellites = 3
}) => {
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  
  // Orbital parameters
  const orbitRadius = soulCoreRadius * 1.8; // Further from center for breathing space
  
  // Animation loop for orbital motion
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Calculate orbital position for horizontal plane
  const getOrbitalPosition = (index: number, totalSatellites: number) => {
    const baseAngle = (index / totalSatellites) * Math.PI * 2;
    const currentAngle = baseAngle + (time * 0.008); // Slow orbital motion
    
    return {
      x: centerX + orbitRadius * Math.cos(currentAngle),
      y: centerY + orbitRadius * Math.sin(currentAngle) * 0.3, // Flattened orbit
      angle: currentAngle
    };
  };

  // Get icon for quote type
  const getQuoteIcon = (type: Quote['type']) => {
    switch (type) {
      case 'mood': return '💭';
      case 'cosmos': return '✨';
      case 'insight': return '💡';
      case 'reflection': return '🔮';
      default: return '✨';
    }
  };

  return (
    <g style={{ zIndex: 5 }}>
      <defs>
        {/* Orbital trail gradient */}
        <radialGradient id="orbitalTrail">
          <stop offset="0%" stopColor="hsl(45, 60%, 70%)" stopOpacity="0.4" />
          <stop offset="70%" stopColor="hsl(50, 50%, 60%)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="hsl(55, 40%, 50%)" stopOpacity="0" />
        </radialGradient>
        
        {/* Paper ball texture */}
        <filter id="paperBallTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" />
        </filter>
        
        {/* Magical glow */}
        <filter id="magicalGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Orbital path visualization */}
      <motion.ellipse
        cx={centerX}
        cy={centerY}
        rx={orbitRadius}
        ry={orbitRadius * 0.3}
        fill="none"
        stroke="hsl(45, 30%, 60%)"
        strokeWidth="0.3"
        strokeDasharray="2,6"
        opacity="0.2"
        animate={{ strokeDashoffset: [0, -8] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Orbital satellites */}
      {quotes.slice(0, maxSatellites).map((quote, index) => {
        const position = getOrbitalPosition(index, maxSatellites);
        const isExpanded = expandedQuote === quote.id;
        
        return (
          <g key={quote.id}>
            {/* Orbital trail */}
            <motion.circle
              cx={position.x}
              cy={position.y}
              r="8"
              fill="url(#orbitalTrail)"
              opacity="0.3"
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, delay: index * 1.3 }}
            />
            
            {/* Paper ball satellite */}
            <motion.g
              style={{ cursor: 'pointer' }}
              onClick={() => setExpandedQuote(isExpanded ? null : quote.id)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 1.5, 
                ease: [0.175, 0.885, 0.32, 1.275],
                delay: index * 0.5
              }}
            >
              <motion.circle
                cx={position.x}
                cy={position.y}
                r={isExpanded ? 0 : 4}
                fill="hsl(0, 0%, 96%)"
                stroke="hsl(45, 40%, 70%)"
                strokeWidth="0.6"
                filter="url(#paperBallTexture)"
                animate={{
                  r: isExpanded ? 0 : [4, 4.5, 4],
                  opacity: isExpanded ? 0 : 1,
                  scale: isExpanded ? 0 : [1, 1.1, 1]
                }}
                transition={{
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  r: { duration: 0.4 },
                  opacity: { duration: 0.4 }
                }}
              />
              
              {/* Quote type icon */}
              {!isExpanded && (
                <motion.text
                  x={position.x}
                  y={position.y + 1}
                  textAnchor="middle"
                  fontSize="4"
                  opacity="0.8"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {getQuoteIcon(quote.type)}
                </motion.text>
              )}
            </motion.g>

            {/* Expanded quote panel */}
            <AnimatePresence>
              {isExpanded && (
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
                >
                  {/* Magical background with starry glow */}
                  <motion.rect
                    x={position.x - 85}
                    y={position.y - 35}
                    width="170"
                    height="70"
                    rx="12"
                    fill="hsl(45, 15%, 98%)"
                    fillOpacity="0.95"
                    stroke="hsl(45, 50%, 80%)"
                    strokeWidth="1"
                    filter="url(#magicalGlow)"
                    style={{
                      filter: "drop-shadow(0 8px 25px rgba(0,0,0,0.15))"
                    }}
                  />
                  
                  {/* Quote text with elegant typography */}
                  <foreignObject
                    x={position.x - 80}
                    y={position.y - 30}
                    width="160"
                    height="60"
                  >
                    <div
                      style={{
                        fontSize: '9px',
                        lineHeight: '12px',
                        color: 'hsl(220, 15%, 25%)',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: '300',
                        padding: '6px',
                        textAlign: 'center',
                        letterSpacing: '0.3px'
                      }}
                    >
                      "{quote.text}"
                    </div>
                  </foreignObject>
                  
                  {/* Starry glow accent */}
                  <text
                    x={position.x + 75}
                    y={position.y - 25}
                    fontSize="8"
                    opacity="0.7"
                    fill="hsl(45, 60%, 70%)"
                  >
                    {getQuoteIcon(quote.type)}
                  </text>
                  
                  {/* Elegant close button */}
                  <motion.circle
                    cx={position.x + 75}
                    cy={position.y + 25}
                    r="8"
                    fill="hsl(0, 50%, 70%)"
                    opacity="0.8"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedQuote(null);
                    }}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                  />
                  <text
                    x={position.x + 75}
                    y={position.y + 28}
                    textAnchor="middle"
                    fontSize="7"
                    fill="white"
                    style={{ pointerEvents: 'none' }}
                  >
                    ✕
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        );
      })}
    </g>
  );
};
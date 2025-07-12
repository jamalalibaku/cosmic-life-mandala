/**
 * AI Insight Satellite Orbiter - Uranus-style orbital quote system
 * 
 * Purpose: Transform quotes into white crumpled paper balls that orbit the Soul Core
 * Features: Tilted orbital plane, interactive unfold/fold behavior, comet trails
 * Design: Visually layered behind UI buttons, smooth slow motion
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

interface AIInsightOrbiterProps {
  centerX: number;
  centerY: number;
  soulCoreRadius: number;
  quotes: Quote[];
  maxSatellites?: number;
}

// Sample quotes for demonstration
const sampleQuotes: Quote[] = [
  {
    id: '1',
    text: 'Thoughts orbit truth, gathered light from inner skies — each quote finds its place.',
    type: 'reflection',
    timestamp: new Date()
  },
  {
    id: '2', 
    text: 'In the cosmic dance of time, every moment is both eternal and fleeting.',
    type: 'cosmos',
    timestamp: new Date()
  },
  {
    id: '3',
    text: 'Your emotions are weather patterns in the sky of consciousness.',
    type: 'mood',
    timestamp: new Date()
  }
];

export const AIInsightOrbiter: React.FC<AIInsightOrbiterProps> = ({
  centerX,
  centerY,
  soulCoreRadius,
  quotes = sampleQuotes,
  maxSatellites = 3
}) => {
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);
  const [orbitalPositions, setOrbitalPositions] = useState<{ [key: string]: number }>({});
  
  // Orbital parameters
  const orbitRadius = soulCoreRadius * 1.3; // 30% larger than soul core
  const tiltAngle = 15; // Degrees - Uranus-style tilt
  
  // Initialize orbital positions
  useEffect(() => {
    const positions: { [key: string]: number } = {};
    quotes.slice(0, maxSatellites).forEach((quote, index) => {
      positions[quote.id] = (index / maxSatellites) * 360;
    });
    setOrbitalPositions(positions);
  }, [quotes, maxSatellites]);

  // Calculate orbital position with tilt
  const getOrbitalPosition = (angle: number, time: number) => {
    // Add slow orbital motion
    const currentAngle = (angle + time * 0.02) * (Math.PI / 180);
    
    // Apply tilted orbital plane (Uranus-style)
    const tiltRad = tiltAngle * (Math.PI / 180);
    const x = centerX + orbitRadius * Math.cos(currentAngle);
    const y = centerY + orbitRadius * Math.sin(currentAngle) * Math.cos(tiltRad);
    const z = orbitRadius * Math.sin(currentAngle) * Math.sin(tiltRad);
    
    return { x, y, z };
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

  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <g style={{ zIndex: 5 }}> {/* Layer behind UI elements */}
      <defs>
        {/* Comet trail gradient */}
        <radialGradient id="cometTrail" cx="50%" cy="50%">
          <stop offset="0%" stopColor="hsl(200, 80%, 80%)" stopOpacity="0.6" />
          <stop offset="70%" stopColor="hsl(220, 60%, 60%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(240, 40%, 40%)" stopOpacity="0" />
        </radialGradient>
        
        {/* Paper texture filter */}
        <filter id="paperTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
        </filter>
      </defs>

      {/* Orbital satellites */}
      {quotes.slice(0, maxSatellites).map((quote, index) => {
        const position = getOrbitalPosition(orbitalPositions[quote.id] || 0, time);
        const isExpanded = expandedQuote === quote.id;
        
        return (
          <g key={quote.id}>
            {/* Comet trail */}
            <motion.circle
              cx={position.x}
              cy={position.y}
              r="12"
              fill="url(#cometTrail)"
              opacity="0.3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.2 }}
            />
            
            {/* Crumpled paper ball satellite */}
            <motion.g
              style={{ cursor: 'pointer' }}
              onHoverStart={() => !isExpanded && setExpandedQuote(quote.id)}
              onHoverEnd={() => !isExpanded && setExpandedQuote(null)}
              onClick={() => setExpandedQuote(isExpanded ? null : quote.id)}
            >
              <motion.circle
                cx={position.x}
                cy={position.y}
                r={isExpanded ? 0 : 6}
                fill="hsl(0, 0%, 95%)"
                stroke="hsl(0, 0%, 85%)"
                strokeWidth="0.5"
                filter="url(#paperTexture)"
                animate={{
                  r: isExpanded ? 0 : 6,
                  opacity: isExpanded ? 0 : 1,
                  scale: isExpanded ? 0 : [1, 1.1, 1]
                }}
                transition={{
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  r: { duration: 0.3 },
                  opacity: { duration: 0.3 }
                }}
              />
              
              {/* Quote type icon */}
              {!isExpanded && (
                <motion.text
                  x={position.x}
                  y={position.y + 2}
                  textAnchor="middle"
                  fontSize="6"
                  opacity="0.7"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
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
                  transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
                >
                  {/* Quote background */}
                  <motion.rect
                    x={position.x - 80}
                    y={position.y - 30}
                    width="160"
                    height="60"
                    rx="8"
                    fill="hsl(0, 0%, 95%)"
                    fillOpacity="0.95"
                    stroke="hsl(0, 0%, 80%)"
                    strokeWidth="1"
                    filter="drop-shadow(0 4px 12px rgba(0,0,0,0.2))"
                  />
                  
                  {/* Quote text */}
                  <foreignObject
                    x={position.x - 75}
                    y={position.y - 25}
                    width="150"
                    height="50"
                  >
                    <div
                      style={{
                        fontSize: '8px',
                        lineHeight: '10px',
                        color: 'hsl(0, 0%, 20%)',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        padding: '4px',
                        textAlign: 'center',
                        overflow: 'hidden'
                      }}
                    >
                      {quote.text.length > 120 ? `${quote.text.slice(0, 120)}...` : quote.text}
                    </div>
                  </foreignObject>
                  
                  {/* Quote icon */}
                  <text
                    x={position.x + 70}
                    y={position.y - 20}
                    fontSize="8"
                    opacity="0.6"
                  >
                    {getQuoteIcon(quote.type)}
                  </text>
                  
                  {/* Close button */}
                  <motion.circle
                    cx={position.x + 70}
                    cy={position.y + 20}
                    r="6"
                    fill="hsl(0, 60%, 60%)"
                    opacity="0.8"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedQuote(null);
                    }}
                    whileHover={{ scale: 1.1 }}
                  />
                  <text
                    x={position.x + 70}
                    y={position.y + 23}
                    textAnchor="middle"
                    fontSize="6"
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
/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState } from 'react';
import { CircularModal } from '../ui/CircularModal';
import { Brain, Heart, Clock, Sparkles } from 'lucide-react';
import { mockEssenceData } from '../../data/mock-essence-data';

export const CoreCircle = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState<{x: number, y: number}>();

  const handleCoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setModalOpen(true);
  };

  const getCurrentEssence = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return mockEssenceData.find(e => e.day === today) || mockEssenceData[0];
  };

  const currentEssence = getCurrentEssence();
  return (
    <g>
      <defs>
        <filter id="coreGlow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Smoother core gradient with more transition steps */}
        <radialGradient id="coreGradient" cx="50%" cy="50%" r="70%">
          <stop offset="0%" style={{stopColor: 'hsl(var(--core-primary))', stopOpacity: 0.8}} />
          <stop offset="40%" style={{stopColor: 'hsl(var(--core-secondary))', stopOpacity: 0.6}} />
          <stop offset="70%" style={{stopColor: 'hsl(var(--background-subtle))', stopOpacity: 0.4}} />
          <stop offset="90%" style={{stopColor: 'hsl(var(--background))', stopOpacity: 0.2}} />
          <stop offset="100%" style={{stopColor: 'transparent', stopOpacity: 0}} />
        </radialGradient>
        
        {/* Outer transition gradient for seamless blend */}
        <radialGradient id="transitionGradient" cx="50%" cy="50%" r="100%">
          <stop offset="0%" style={{stopColor: 'transparent', stopOpacity: 0}} />
          <stop offset="60%" style={{stopColor: 'hsl(var(--background))', stopOpacity: 0.05}} />
          <stop offset="80%" style={{stopColor: 'hsl(var(--background))', stopOpacity: 0.1}} />
          <stop offset="100%" style={{stopColor: 'hsl(var(--background))', stopOpacity: 0.15}} />
        </radialGradient>
      </defs>
      
      {/* Outer transition zone for smooth background blend */}
      <circle 
        cx={0} cy={0} r={85} 
        fill="url(#transitionGradient)" 
        opacity={0.7}
      />
      
      {/* Clickable Core Circle */}
      <circle 
        cx={0} cy={0} r={45} 
        fill="url(#coreGradient)" 
        filter="url(#coreGlow)"
        opacity={0.85}
        onClick={handleCoreClick}
        className="cursor-pointer hover:opacity-100 transition-opacity duration-300"
      />
      
      {/* Core Essence Indicator */}
      <circle 
        cx={0} cy={0} r={35} 
        fill="none" 
        stroke="hsl(var(--primary))" 
        strokeWidth="1" 
        opacity={0.6}
        style={{
          strokeDasharray: `${(currentEssence.essence / 100) * 220} 220`,
          transform: 'rotate(-90deg)',
          transformOrigin: 'center'
        }}
      />
      
      {/* Center Icon */}
      <foreignObject x={-8} y={-8} width={16} height={16}>
        <Heart 
          className="w-4 h-4 text-primary opacity-70" 
          style={{ filter: 'drop-shadow(0 0 4px hsl(var(--primary)))' }}
        />
      </foreignObject>

      {/* ME Modal */}
      <CircularModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        triggerPosition={clickPosition}
        size="lg"
      >
        <div className="space-y-6 p-4">
          <div className="text-center">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Your Essence</h2>
            <div className="text-3xl font-bold text-primary">{currentEssence.essence}</div>
            <p className="text-sm text-muted-foreground">Today's Inner State</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <span className="text-sm font-medium">Mood:</span>
              <span className="text-sm text-primary">{currentEssence.mood}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <span className="text-sm font-medium">Energy:</span>
              <span className="text-sm text-primary">{currentEssence.energy}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <Clock className="h-4 w-4" />
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground italic">
              "The soul knows its rhythm"
            </p>
          </div>
        </div>
      </CircularModal>
      
      {/* Subtle middle ring for transition */}
      <circle 
        cx={0} cy={0} r={35} 
        stroke="hsl(var(--core-glow))" 
        strokeWidth={0.5} 
        fill="none" 
        opacity={0.3}
      />
      
      {/* Inner pulse ring */}
      <circle 
        cx={0} cy={0} r={25} 
        stroke="hsl(var(--core-glow))" 
        strokeWidth={1} 
        fill="none" 
        opacity={0.5}
      />
      
      {/* NOW text with enhanced glow */}
      <text 
        x={0} y={5} 
        textAnchor="middle" 
        fill="hsl(var(--core-primary))" 
        fontSize={12}
        fontWeight="bold"
        filter="url(#coreGlow)"
        opacity={0.9}
      >
        NOW
      </text>
    </g>
  );
};
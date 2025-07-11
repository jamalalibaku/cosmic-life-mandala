/**
 * (c) 2025 Cosmic Life Mandala – Interactive Touch Tool
 * Emotional Architect: Adria · Technical Implementation: Love
 * 
 * Touch Tool: Let users touch any region of time to expand its meaning
 * A moment blossoms open, sharing context and emotional resonance
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Clock } from 'lucide-react';

interface TouchedMoment {
  x: number;
  y: number;
  timestamp: Date;
  data?: any;
  emotion?: string;
  resonance?: number;
}

interface TouchToolProps {
  isActive: boolean;
  onMomentTouch: (moment: TouchedMoment) => void;
  centerX: number;
  centerY: number;
}

export const TouchTool: React.FC<TouchToolProps> = ({
  isActive,
  onMomentTouch,
  centerX,
  centerY
}) => {
  const [touchedMoments, setTouchedMoments] = useState<TouchedMoment[]>([]);
  const [activeTouch, setActiveTouch] = useState<TouchedMoment | null>(null);

  const handleTimeTouch = useCallback((event: React.MouseEvent<SVGElement>) => {
    if (!isActive) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate distance from center to determine time context
    const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
    
    // Convert position to time context
    const normalizedAngle = (angle + 90 + 360) % 360;
    const hourOfDay = (normalizedAngle / 360) * 24;
    const touchTime = new Date();
    touchTime.setHours(Math.floor(hourOfDay), (hourOfDay % 1) * 60, 0, 0);

    // Determine emotional resonance based on distance and position
    const resonance = Math.max(0.3, Math.min(1, 1 - (distanceFromCenter / 300)));
    
    const newMoment: TouchedMoment = {
      x,
      y,
      timestamp: touchTime,
      emotion: resonance > 0.7 ? 'deep' : resonance > 0.5 ? 'gentle' : 'distant',
      resonance
    };

    setTouchedMoments(prev => [...prev.slice(-4), newMoment]); // Keep last 5 touches
    setActiveTouch(newMoment);
    onMomentTouch(newMoment);

    // Clear active touch after animation
    setTimeout(() => setActiveTouch(null), 2000);
  }, [isActive, centerX, centerY, onMomentTouch]);

  const formatTouchTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getEmotionalMessage = (emotion: string, resonance: number) => {
    const messages = {
      deep: [
        "This moment holds deeper currents...",
        "Your soul recognizes something here",
        "Sacred time touched with intention"
      ],
      gentle: [
        "A gentle ripple through your day",
        "This time whispers softly to you", 
        "Quiet significance emerges"
      ],
      distant: [
        "Time flows at the edges of awareness",
        "Even distant moments carry meaning",
        "The periphery of your life story"
      ]
    };

    const emotionMessages = messages[emotion as keyof typeof messages] || messages.gentle;
    return emotionMessages[Math.floor(Math.random() * emotionMessages.length)];
  };

  return (
    <g className="touch-tool">
      {/* Invisible interaction layer */}
      {isActive && (
        <rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          fill="transparent"
          onClick={handleTimeTouch}
          className="cursor-pointer"
          style={{ pointerEvents: 'all' }}
        />
      )}

      {/* Touch ripples */}
      {touchedMoments.map((moment, index) => (
        <motion.g
          key={`touch-${index}-${moment.timestamp.getTime()}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 2, 4] }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <circle
            cx={moment.x}
            cy={moment.y}
            r={20}
            fill="none"
            stroke={`hsl(${moment.emotion === 'deep' ? '280' : moment.emotion === 'gentle' ? '320' : '200'} 60% 70%)`}
            strokeWidth="2"
            opacity={moment.resonance}
          />
          <circle
            cx={moment.x}
            cy={moment.y}
            r={10}
            fill={`hsl(${moment.emotion === 'deep' ? '280' : moment.emotion === 'gentle' ? '320' : '200'} 60% 70%)`}
            opacity={moment.resonance * 0.6}
          />
        </motion.g>
      ))}

      {/* Active touch bloom */}
      <AnimatePresence>
        {activeTouch && (
          <foreignObject
            x={activeTouch.x - 100}
            y={activeTouch.y - 60}
            width="200"
            height="120"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-black/80 backdrop-blur-lg border border-white/20 rounded-lg p-3 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                {activeTouch.emotion === 'deep' && <Heart className="w-4 h-4 text-purple-400" />}
                {activeTouch.emotion === 'gentle' && <Sparkles className="w-4 h-4 text-pink-400" />}
                {activeTouch.emotion === 'distant' && <Clock className="w-4 h-4 text-blue-400" />}
                <span className="text-white/90 font-medium text-sm">
                  {formatTouchTime(activeTouch.timestamp)}
                </span>
              </div>
              <p className="text-white/70 text-xs italic leading-relaxed">
                {getEmotionalMessage(activeTouch.emotion!, activeTouch.resonance!)}
              </p>
              <div className="mt-2 w-full bg-white/10 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${activeTouch.resonance! * 100}%` }}
                />
              </div>
            </motion.div>
          </foreignObject>
        )}
      </AnimatePresence>
    </g>
  );
};
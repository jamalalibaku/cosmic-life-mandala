/**
 * AI Speech Bubble - Dynamic quote display with character-specific styling
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAICharacter } from '@/hooks/useAICharacter';
import { getRandomQuote, AIQuote } from '@/data/ai-quotes';

interface AISpeechBubbleProps {
  isVisible: boolean;
  onDismiss: () => void;
  triggerPosition: { x: number; y: number };
}

export const AISpeechBubble: React.FC<AISpeechBubbleProps> = ({
  isVisible,
  onDismiss,
  triggerPosition
}) => {
  const { selectedCharacter } = useAICharacter();
  const [currentQuote, setCurrentQuote] = useState<AIQuote | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const dismissTimer = useRef<NodeJS.Timeout>();

  // Generate fresh quote when bubble becomes visible
  useEffect(() => {
    if (isVisible && !currentQuote) {
      const quote = getRandomQuote(selectedCharacter.id);
      setCurrentQuote(quote);
      setIsTyping(true);
      setDisplayedText('');
    }
  }, [isVisible, selectedCharacter.id, currentQuote]);

  // Typing animation effect
  useEffect(() => {
    if (isTyping && currentQuote) {
      const text = currentQuote.text;
      let index = 0;
      
      const typeTimer = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typeTimer);
          
          // Start dismiss timer after typing completes
          dismissTimer.current = setTimeout(() => {
            onDismiss();
          }, 6000);
        }
      }, 30); // Typing speed

      return () => clearInterval(typeTimer);
    }
  }, [isTyping, currentQuote, onDismiss]);

  // Reset state when bubble hides
  useEffect(() => {
    if (!isVisible) {
      setCurrentQuote(null);
      setDisplayedText('');
      setIsTyping(false);
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
      }
    }
  }, [isVisible]);

  // Character-specific styling
  const getCharacterStyles = () => {
    switch (selectedCharacter.id) {
      case 'eminem':
        return {
          bubbleClass: 'bg-black/90 border border-red-500/60 text-red-400',
          textClass: 'font-mono text-sm italic tracking-wide transform -skew-x-1',
          tailColor: 'border-red-500/60'
        };
      
      case 'angrymother':
        return {
          bubbleClass: 'bg-purple-900/90 border border-purple-300/40 text-purple-100',
          textClass: 'font-serif text-sm leading-relaxed',
          tailColor: 'border-purple-300/40'
        };
      
      case 'krusty':
        return {
          bubbleClass: 'bg-yellow-400/95 border border-orange-400 text-orange-900',
          textClass: 'font-bold text-sm tracking-wide comic-font',
          tailColor: 'border-orange-400'
        };
      
      case 'zen':
        return {
          bubbleClass: 'bg-slate-800/95 border border-cyan-400/30 text-cyan-100',
          textClass: 'font-light text-sm leading-loose tracking-wide',
          tailColor: 'border-cyan-400/30'
        };
      
      case 'adria':
        return {
          bubbleClass: 'bg-rose-900/90 border border-rose-300/50 text-rose-100',
          textClass: 'font-medium text-sm leading-relaxed italic',
          tailColor: 'border-rose-300/50'
        };
      
      default:
        return {
          bubbleClass: 'bg-slate-900/95 border border-amber-400/40 text-amber-100',
          textClass: 'font-medium text-sm leading-relaxed',
          tailColor: 'border-amber-400/40'
        };
    }
  };

  const styles = getCharacterStyles();

  // Calculate position to avoid overlap with mandala
  const bubblePosition = {
    x: triggerPosition.x - 200, // Position to the left of the trigger
    y: triggerPosition.y + 60   // Below the trigger
  };

  return (
    <AnimatePresence>
      {isVisible && currentQuote && (
        <motion.div
          className="fixed z-50 pointer-events-none"
          style={{
            left: bubblePosition.x,
            top: bubblePosition.y
          }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -5 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20,
            duration: 0.3 
          }}
        >
          {/* Speech bubble */}
          <div className={`
            relative max-w-xs px-4 py-3 rounded-lg backdrop-blur-xl
            ${styles.bubbleClass}
            shadow-lg
          `}>
            {/* Typing indicator or text */}
            <div className={styles.textClass}>
              {displayedText}
              {isTyping && (
                <motion.span
                  className="inline-block ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  |
                </motion.span>
              )}
            </div>

            {/* Speech bubble tail pointing to AI button */}
            <div 
              className={`
                absolute top-0 right-4 transform -translate-y-2
                w-0 h-0 border-l-8 border-r-8 border-b-8
                border-l-transparent border-r-transparent
                ${styles.tailColor.replace('border-', 'border-b-')}
              `}
            />
          </div>

          {/* Character-specific ambient glow */}
          <motion.div
            className="absolute inset-0 rounded-lg -z-10"
            style={{
              background: `radial-gradient(circle at center, hsl(${selectedCharacter.color} / 0.15) 0%, transparent 70%)`,
              filter: 'blur(8px)'
            }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Hover area to prevent auto-dismiss */}
          <div 
            className="absolute inset-0 -m-4 pointer-events-auto"
            onMouseEnter={() => {
              if (dismissTimer.current) {
                clearTimeout(dismissTimer.current);
              }
            }}
            onMouseLeave={() => {
              if (!isTyping) {
                dismissTimer.current = setTimeout(onDismiss, 2000);
              }
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
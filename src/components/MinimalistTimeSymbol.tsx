/**
 * Minimalist Time Symbol - Elegant "T" representing Time
 * Replaces the large title with subtle cosmic symbolism
 */

import React from 'react';
import { motion } from '@/components/ui/NoAnimationMotion';

interface MinimalistTimeSymbolProps {
  className?: string;
  poetryMode?: boolean;
}

const poeticQuotes = [
  "time flows like cosmic rivers...",
  "moments spiral through infinite space...", 
  "the universe breathes in eternal rhythm...",
  "patterns emerge from temporal chaos...",
  "consciousness dances with cosmic time..."
];

export const MinimalistTimeSymbol: React.FC<MinimalistTimeSymbolProps> = ({
  className = "",
  poetryMode = false
}) => {
  const [currentQuote, setCurrentQuote] = React.useState(0);

  React.useEffect(() => {
    if (!poetryMode) return;
    
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % poeticQuotes.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [poetryMode]);

  return (
    <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-40 text-center ${className}`}>
      {/* Cosmic T Symbol */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div 
          className="text-6xl font-serif font-bold text-transparent bg-clip-text mb-2"
          style={{
            backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
            textShadow: "0 0 20px hsl(var(--primary) / 0.3)"
          }}
        >
          𝒯
        </div>
        
        {/* Subtle glow effect */}
        <div 
          className="absolute inset-0 text-6xl font-serif font-bold blur-sm opacity-20"
          style={{ color: "hsl(var(--primary))" }}
        >
          𝒯
        </div>
      </motion.div>

      {/* Optional poetic line */}
      {poetryMode && (
        <motion.p
          key={currentQuote}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1 }}
          className="text-sm italic text-muted-foreground max-w-xs"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {poeticQuotes[currentQuote]}
        </motion.p>
      )}
    </div>
  );
};
/**
 * AI Character Button - Floating trigger for character selection
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import { useAICharacter } from '@/hooks/useAICharacter';
import { AICharacterMenu } from './AICharacterMenu';

export const AICharacterButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { selectedCharacter } = useAICharacter();

  return (
    <>
      <motion.button
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-4 right-20 z-40 w-12 h-12 rounded-2xl backdrop-blur-xl border transition-all duration-300 group bg-black/60 border-white/20 hover:bg-white/15 hover:border-white/35"
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: `0 0 20px hsl(${selectedCharacter.color} / 0.3)`
        }}
      >
        <motion.div
          className="flex items-center justify-center w-full h-full relative"
          animate={{ 
            color: `hsl(${selectedCharacter.color})`,
          }}
          transition={{ duration: 0.3 }}
        >
          <Bot 
            size={18} 
            className="text-white/80 group-hover:text-white transition-colors duration-300"
          />
          
          {/* Character indicator dot */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white/40"
            style={{
              background: `hsl(${selectedCharacter.color})`
            }}
            animate={{
              boxShadow: `0 0 8px hsl(${selectedCharacter.color} / 0.8)`
            }}
          />
        </motion.div>

        {/* Gentle pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at center, hsl(${selectedCharacter.color} / 0.1) 0%, transparent 70%)`,
            filter: 'blur(1px)'
          }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>

      <AICharacterMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  );
};
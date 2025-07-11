/**
 * (c) 2025 Cosmic Life Mandala – Enhanced Settings Button
 * Elegant, minimal settings trigger with subtle glow
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

interface EnhancedSettingsButtonProps {
  onClick: () => void;
  isOpen?: boolean;
  className?: string;
}

export const EnhancedSettingsButton: React.FC<EnhancedSettingsButtonProps> = ({
  onClick,
  isOpen = false,
  className = ''
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`fixed top-4 right-6 z-50 w-12 h-12 rounded-2xl backdrop-blur-xl border transition-all duration-300 group ${
        isOpen
          ? 'bg-white/20 border-white/40 shadow-xl'
          : 'bg-black/60 border-white/20 hover:bg-white/15 hover:border-white/35'
      } ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center w-full h-full"
      >
        <Settings 
          size={18} 
          className={`transition-all duration-300 ${
            isOpen 
              ? 'text-white drop-shadow-lg' 
              : 'text-white/80 group-hover:text-white'
          }`}
        />
      </motion.div>

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
          filter: 'blur(1px)'
        }}
        animate={{ 
          opacity: isOpen ? [0.3, 0.6, 0.3] : 0
        }}
        transition={{ 
          duration: 2, 
          repeat: isOpen ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
};
/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect } from 'react';
import { useVisualSkin } from './visual-skin-provider';

interface ThemeHaikuDisplayProps {
  onComplete?: () => void;
  duration?: number; // milliseconds
}

export const ThemeHaikuDisplay: React.FC<ThemeHaikuDisplayProps> = ({
  onComplete,
  duration = 4000
}) => {
  const { themeConfig, isTransitioning } = useVisualSkin();
  const [isVisible, setIsVisible] = useState(false);
  const [currentHaiku, setCurrentHaiku] = useState('');

  useEffect(() => {
    if (isTransitioning) {
      // Select random haiku from current theme
      const randomHaiku = themeConfig.haiku[Math.floor(Math.random() * themeConfig.haiku.length)];
      setCurrentHaiku(randomHaiku);
      setIsVisible(true);

      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onComplete?.();
        }, 500); // Wait for fade out
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isTransitioning, themeConfig.haiku, duration, onComplete]);

  if (!isVisible || !isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        style={{
          animation: 'fadeIn 0.5s ease-out'
        }}
      />
      
      {/* Haiku Container */}
      <div 
        className="relative text-center max-w-md mx-4 p-8 rounded-lg border-2"
        style={{
          backgroundColor: `${themeConfig.colors.background}CC`, // Semi-transparent
          borderColor: themeConfig.colors.accent,
          color: themeConfig.colors.text,
          fontFamily: themeConfig.typography.secondary,
          boxShadow: `0 0 30px ${themeConfig.colors.glow}40`,
          animation: 'haikuAppear 0.8s ease-out'
        }}
      >
        {/* Theme name */}
        <div 
          className="text-sm font-light mb-4 opacity-70"
          style={{ color: themeConfig.colors.accent }}
        >
          {themeConfig.name}
        </div>
        
        {/* Haiku text */}
        <div 
          className="text-lg leading-relaxed whitespace-pre-line"
          style={{ 
            color: themeConfig.colors.primary,
            fontSize: themeConfig.typography.size === 'large' ? '1.25rem' : 
                      themeConfig.typography.size === 'small' ? '0.95rem' : '1.1rem'
          }}
        >
          {currentHaiku}
        </div>
        
        {/* Decorative elements based on theme */}
        <div className="absolute -top-2 -right-2 text-2xl opacity-60">
          {themeConfig.icons.time}
        </div>
        
        {/* Theme-specific border decoration */}
        <div 
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: themeConfig.shapes.rings === 'jagged' ? 
              'conic-gradient(from 0deg, transparent 0%, transparent 85%, var(--theme-accent) 90%, transparent 95%)' :
              themeConfig.shapes.rings === 'organic' ?
              'radial-gradient(circle at 20% 80%, var(--theme-glow) 0%, transparent 50%)' :
              undefined,
            opacity: 0.3
          }}
        />
      </div>
      
      {/* Dismiss hint */}
      <div 
        className="absolute bottom-8 text-sm opacity-50"
        style={{ color: themeConfig.colors.text }}
      >
        Click anywhere to continue
      </div>

      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes haikuAppear {
          0% { 
            opacity: 0; 
            transform: scale(0.8) translateY(20px);
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0);
          }
        }
        `}
      </style>
    </div>
  );
};
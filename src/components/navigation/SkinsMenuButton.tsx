/**
 * Consolidated Skins Menu - Elegant pop-up for visual themes
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sparkles, X } from 'lucide-react';
import { useVisualSkin } from '../visual-skin-provider';
import { Theme, themeConfigs } from '@/utils/theme-configs';

interface SkinsMenuButtonProps {
  className?: string;
}

export const SkinsMenuButton: React.FC<SkinsMenuButtonProps> = ({
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const { currentTheme, setTheme } = useVisualSkin();

  const handleThemeSelect = (themeKey: Theme) => {
    setTheme(themeKey);
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 200); // Increased delay to prevent flickering
    setHoverTimeout(timeout);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Skins Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-12 h-12 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/20 text-white/90 hover:text-white hover:bg-black/80 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Visual Themes"
      >
        <Palette size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-12' : ''}`} />
        
        {/* Current theme color indicator */}
        <motion.div
          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white/30"
          style={{ backgroundColor: themeConfigs[currentTheme]?.colors.primary }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Subtle pulse when open */}
        {isOpen && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-white/10"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Pop-up Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full right-0 mb-2 z-50"
          >
            <div 
              className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden min-w-[320px] max-w-[360px]"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette size={16} className="text-white/90" />
                    <span className="text-white/95 font-semibold text-sm">Visual Themes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: themeConfigs[currentTheme]?.colors.primary }}
                    />
                    <span className="text-white/70 text-xs">
                      {themeConfigs[currentTheme]?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {Object.entries(themeConfigs).map(([themeKey, config]) => {
                  const isActive = themeKey === currentTheme;
                  
                  return (
                    <motion.button
                      key={themeKey}
                      onClick={() => handleThemeSelect(themeKey as Theme)}
                      className={`group w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-white/20 border border-white/30 shadow-lg'
                          : 'bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      title={`Switch to ${config.name} theme`}
                    >
                      {/* Theme Color Preview */}
                      <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 overflow-hidden">
                        {/* Primary color */}
                        <div 
                          className="w-6 h-6 rounded-full border border-white/20"
                          style={{ backgroundColor: config.colors.primary }}
                        />
                        {/* Accent color accent */}
                        <div 
                          className="absolute top-1 right-1 w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: config.colors.accent }}
                        />
                        
                        {/* Active sparkle effect */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles size={12} className="text-white/60" />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium text-sm ${
                            isActive ? 'text-white' : 'text-white/90'
                          }`}>
                            {config.name}
                          </span>
                          {isActive && (
                            <div className="text-white/40 text-xs bg-white/10 px-2 py-0.5 rounded-md">
                              Active
                            </div>
                          )}
                        </div>
                        <p className="text-white/60 text-xs leading-relaxed">
                          {config.description}
                        </p>
                        
                        {/* Theme pattern indicator */}
                        <div className="flex items-center gap-1 mt-1">
                          <span 
                            className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded-full"
                          >
                            {config.background.pattern}
                          </span>
                          <span 
                            className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded-full"
                          >
                            {config.animations.style}
                          </span>
                        </div>
                      </div>

                      {/* Active glow effect */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at center, ${config.colors.primary}15 0%, transparent 70%)`,
                            filter: `drop-shadow(0 0 8px ${config.colors.primary}30)`
                          }}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Footer hint */}
              <div className="text-white/30 text-xs text-center py-3 border-t border-white/5">
                <span>🎨 Express your cosmic mood</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
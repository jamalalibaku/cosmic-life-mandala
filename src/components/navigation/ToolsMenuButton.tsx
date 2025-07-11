/**
 * Consolidated Tools Menu - Elegant pop-up for interaction tools
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Hand, Anchor, Waves, X } from 'lucide-react';

type ToolType = 'touch' | 'fix' | 'scale' | null;

interface ToolsMenuButtonProps {
  activeTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  className?: string;
}

const tools = [
  {
    id: 'touch' as const,
    name: 'Touch',
    icon: Hand,
    description: 'Touch moments to expand meaning',
    color: 'hsl(320 60% 70%)',
    hotkey: 'T'
  },
  {
    id: 'fix' as const,
    name: 'Fix',
    icon: Anchor,
    description: 'Anchor intentions & shape rhythms',
    color: 'hsl(200 60% 70%)',
    hotkey: 'F'
  },
  {
    id: 'scale' as const,
    name: 'Scale',
    icon: Waves,
    description: 'Attune focus through temporal flow',
    color: 'hsl(180 60% 70%)',
    hotkey: 'S'
  }
];

export const ToolsMenuButton: React.FC<ToolsMenuButtonProps> = ({
  activeTool,
  onToolSelect,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleToolSelect = (toolId: ToolType) => {
    const newActiveTool = activeTool === toolId ? null : toolId;
    onToolSelect(newActiveTool);
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay to allow moving to menu
    setHoverTimeout(timeout);
  };

  const isAnyToolActive = activeTool !== null;

  return (
    <div className={`relative ${className}`}>
      {/* Main Tools Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-12 h-12 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/20 text-white/90 hover:text-white hover:bg-black/80 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Interaction Tools"
      >
        <Wrench size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        
        {/* Active tool indicator */}
        {isAnyToolActive && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: tools.find(t => t.id === activeTool)?.color }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Subtle pulse when active */}
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
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 z-50"
          >
            <div 
              className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden min-w-[300px]"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench size={16} className="text-white/90" />
                    <span className="text-white/95 font-semibold text-sm">Interaction Tools</span>
                  </div>
                  {activeTool && (
                    <button
                      onClick={() => onToolSelect(null)}
                      className="text-white/40 hover:text-white/80 transition-colors p-1 rounded-md hover:bg-white/10"
                      title="Deactivate all tools"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
                
                {activeTool && (
                  <div className="flex items-center gap-2 mt-2">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: tools.find(t => t.id === activeTool)?.color }}
                    />
                    <span className="text-white/70 text-xs">
                      {tools.find(t => t.id === activeTool)?.name} Active
                    </span>
                  </div>
                )}
              </div>

              {/* Tool Selection */}
              <div className="p-4 space-y-3">
                {tools.map((tool) => {
                  const isActive = tool.id === activeTool;
                  
                  return (
                    <motion.button
                      key={tool.id}
                      onClick={() => handleToolSelect(tool.id)}
                      className={`group w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-white/20 border border-white/30 shadow-lg'
                          : 'bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      title={`${isActive ? 'Deactivate' : 'Activate'} ${tool.name} tool`}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10">
                        <tool.icon 
                          size={18} 
                          style={{ 
                            color: isActive ? tool.color : 'rgba(255,255,255,0.8)'
                          }}
                          className={`transition-all duration-300 ${
                            isActive ? 'drop-shadow-lg' : ''
                          }`}
                        />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium text-sm ${
                            isActive ? 'text-white' : 'text-white/90'
                          }`}>
                            {tool.name}
                          </span>
                          <span className="text-white/40 text-xs font-mono bg-white/10 px-2 py-0.5 rounded-md">
                            Alt+{tool.hotkey}
                          </span>
                        </div>
                        <p className="text-white/60 text-xs leading-relaxed">
                          {tool.description}
                        </p>
                      </div>

                      {/* Active glow effect */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at center, ${tool.color}15 0%, transparent 70%)`,
                            filter: `drop-shadow(0 0 8px ${tool.color}30)`
                          }}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Keyboard hints */}
              <div className="text-white/30 text-xs text-center py-3 border-t border-white/5">
                <span className="font-mono">Alt + T • F • S</span>
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
/**
 * (c) 2025 Cosmic Life Mandala – Behavioral Tools Manager
 * Orchestrates the three sacred interaction tools based on Adria's emotional design
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Anchor, Waves, X } from 'lucide-react';
import { TouchTool } from './TouchTool';
import { FixTool } from './FixTool';
import { ScaleTool } from './ScaleTool';

type ToolType = 'touch' | 'fix' | 'scale' | null;

interface BehavioralToolsProps {
  centerX: number;
  centerY: number;
  currentScale: 'day' | 'week' | 'month' | 'year';
  isVisible?: boolean;
  onToolActivate?: (tool: ToolType) => void;
}

export const BehavioralTools: React.FC<BehavioralToolsProps> = ({
  centerX,
  centerY,
  currentScale,
  isVisible = true,
  onToolActivate
}) => {
  const [activeTool, setActiveTool] = useState<ToolType>(null);

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

  const handleToolSelect = (toolId: ToolType) => {
    const newActiveTool = activeTool === toolId ? null : toolId;
    setActiveTool(newActiveTool);
    onToolActivate?.(newActiveTool);
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case 't':
            handleToolSelect('touch');
            event.preventDefault();
            break;
          case 'f':
            handleToolSelect('fix');
            event.preventDefault();
            break;
          case 's':
            handleToolSelect('scale');
            event.preventDefault();
            break;
          case 'escape':
            handleToolSelect(null);
            event.preventDefault();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTool]);

  if (!isVisible) return null;

  return (
    <>
      {/* Enhanced Tool Palette */}
      <motion.div
        initial={{ opacity: 0, x: -30, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-40"
      >
        {/* Tool Container with unified background */}
        <div className="bg-black/70 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl">
          <div className="space-y-3">
            {tools.map((tool, index) => (
              <motion.button
                key={tool.id}
                onClick={() => handleToolSelect(tool.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group relative w-14 h-14 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                  activeTool === tool.id
                    ? 'bg-white/25 border-white/50 shadow-xl transform scale-105'
                    : 'bg-white/5 border-white/20 hover:bg-white/15 hover:border-white/35 hover:scale-105'
                }`}
                whileHover={{ scale: activeTool === tool.id ? 1.05 : 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <tool.icon 
                    size={20} 
                    style={{ 
                      color: activeTool === tool.id ? tool.color : 'rgba(255,255,255,0.8)'
                    }}
                    className={`transition-all duration-300 ${
                      activeTool === tool.id ? 'drop-shadow-lg' : ''
                    }`}
                  />
                  <span className="text-xs text-white/60 font-medium mt-1">
                    {tool.name}
                  </span>
                </div>
                
                {/* Enhanced tooltip */}
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
                  <div className="bg-black/95 backdrop-blur-sm border border-white/20 rounded-xl p-3 min-w-[200px] shadow-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <tool.icon size={16} style={{ color: tool.color }} />
                      <span className="text-white font-semibold text-sm">{tool.name}</span>
                      <span className="text-white/40 text-xs font-mono bg-white/10 px-2 py-1 rounded-md">
                        Alt+{tool.hotkey}
                      </span>
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Active glow effect */}
                {activeTool === tool.id && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at center, ${tool.color}20 0%, transparent 70%)`,
                      filter: `drop-shadow(0 0 12px ${tool.color}40)`
                    }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Active tool status */}
          <AnimatePresence>
            {activeTool && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 pt-3 border-t border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: tools.find(t => t.id === activeTool)?.color }}
                    />
                    <span className="text-white/90 text-xs font-medium">
                      {tools.find(t => t.id === activeTool)?.name} Active
                    </span>
                  </div>
                  <button
                    onClick={() => handleToolSelect(null)}
                    className="text-white/40 hover:text-white/80 transition-colors p-1 rounded-md hover:bg-white/10"
                  >
                    <X size={12} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Active Tool Overlays */}
      <g className="behavioral-tools-overlay">
        <TouchTool
          isActive={activeTool === 'touch'}
          onMomentTouch={(moment) => {
            console.log('🫧 Moment touched:', moment);
          }}
          centerX={centerX}
          centerY={centerY}
        />

        <FixTool
          isActive={activeTool === 'fix'}
          onMomentFix={(moment) => {
            console.log('🧲 Moment fixed:', moment);
          }}
          centerX={centerX}
          centerY={centerY}
        />

        <ScaleTool
          isActive={activeTool === 'scale'}
          onScaleGesture={(gesture) => {
            console.log('🌀 Scale gesture:', gesture);
          }}
          centerX={centerX}
          centerY={centerY}
          currentScale={currentScale}
        />
      </g>
    </>
  );
};
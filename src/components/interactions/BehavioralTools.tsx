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
      {/* Tool Palette */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 space-y-2"
      >
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            onClick={() => handleToolSelect(tool.id)}
            className={`group relative w-12 h-12 rounded-xl backdrop-blur-sm border transition-all duration-200 ${
              activeTool === tool.id
                ? 'bg-white/20 border-white/40 shadow-lg'
                : 'bg-black/40 border-white/20 hover:bg-white/10 hover:border-white/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <tool.icon 
              size={18} 
              style={{ 
                color: activeTool === tool.id ? tool.color : 'rgba(255,255,255,0.7)'
              }}
              className="mx-auto"
            />
            
            {/* Tool tooltip */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-2 min-w-[160px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium text-sm">{tool.name}</span>
                  <span className="text-white/40 text-xs">Alt+{tool.hotkey}</span>
                </div>
                <p className="text-white/70 text-xs leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}

        {/* Active tool indicator */}
        <AnimatePresence>
          {activeTool && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-2 text-center"
            >
              <div className="text-white/90 text-xs font-medium mb-1">
                {tools.find(t => t.id === activeTool)?.name} Active
              </div>
              <button
                onClick={() => handleToolSelect(null)}
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
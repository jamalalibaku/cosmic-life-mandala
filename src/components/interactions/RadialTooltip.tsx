/**
 * Radial Tooltip System
 * Elegant floating information bubbles for mandala interactions
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipData {
  title: string;
  value?: string;
  emoji?: string;
  description?: string;
  x: number;
  y: number;
}

interface RadialTooltipProps {
  data: TooltipData | null;
  isVisible: boolean;
}

export const RadialTooltip: React.FC<RadialTooltipProps> = ({ data, isVisible }) => {
  if (!data) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            left: data.x + 15,
            top: data.y - 10,
          }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 min-w-max">
            <div className="flex items-center gap-2">
              {data.emoji && (
                <span className="text-sm opacity-90">{data.emoji}</span>
              )}
              <div>
                <div className="text-white/90 text-xs font-light tracking-wide">
                  {data.title}
                </div>
                {data.value && (
                  <div className="text-white text-sm font-medium">
                    {data.value}
                  </div>
                )}
                {data.description && (
                  <div className="text-white/70 text-xs mt-1">
                    {data.description}
                  </div>
                )}
              </div>
            </div>
            
            {/* Elegant arrow */}
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-black/80 border-l border-b border-white/10 rotate-45" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
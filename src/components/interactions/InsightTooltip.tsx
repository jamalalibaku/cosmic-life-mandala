/**
 * Enhanced Insight Tooltip System
 * Context-aware insights with confidence indicators and actionable suggestions
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Moon, Car, Heart, Cloud, Zap, Brain, TrendingUp } from 'lucide-react';

interface InsightTooltipData {
  title: string;
  value?: string;
  insights: string[];
  confidence: number;
  timestamp: string;
  layerType: string;
  x: number;
  y: number;
}

interface InsightTooltipProps {
  data: InsightTooltipData | null;
  isVisible: boolean;
  onClose?: () => void;
}

export const InsightTooltip: React.FC<InsightTooltipProps> = ({ 
  data, 
  isVisible,
  onClose 
}) => {
  if (!data) return null;

  const getLayerIcon = (layerType: string) => {
    switch (layerType.toLowerCase()) {
      case 'sleep': return Moon;
      case 'mood': return Heart;
      case 'mobility': return Car;
      case 'weather': return Cloud;
      case 'plans': return Activity;
      default: return Brain;
    }
  };

  const getLayerColor = (layerType: string) => {
    switch (layerType.toLowerCase()) {
      case 'sleep': return 'hsl(240, 60%, 70%)';
      case 'mood': return 'hsl(340, 70%, 65%)';
      case 'mobility': return 'hsl(120, 60%, 60%)';
      case 'weather': return 'hsl(200, 70%, 65%)';
      case 'plans': return 'hsl(30, 70%, 65%)';
      default: return 'hsl(280, 60%, 70%)';
    }
  };

  const LayerIcon = getLayerIcon(data.layerType);
  const layerColor = getLayerColor(data.layerType);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            left: data.x + 20,
            top: data.y - 80,
          }}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div 
            className="relative max-w-72 rounded-xl border backdrop-blur-md shadow-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, 
                hsla(240, 20%, 8%, 0.95) 0%, 
                hsla(240, 15%, 12%, 0.90) 50%,
                hsla(240, 10%, 6%, 0.95) 100%)`,
              borderColor: layerColor,
              boxShadow: `0 0 30px ${layerColor}30, inset 0 1px 0 hsla(0, 0%, 100%, 0.1)`
            }}
          >
            {/* Animated gradient border */}
            <div 
              className="absolute inset-0 rounded-xl opacity-30"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${layerColor}60, transparent, ${layerColor}60, transparent)`,
                filter: 'blur(1px)'
              }}
            />

            {/* Header */}
            <div className="relative p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ 
                    background: `${layerColor}20`,
                    border: `1px solid ${layerColor}40`
                  }}
                >
                  <LayerIcon 
                    size={16} 
                    style={{ color: layerColor }}
                  />
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-sm font-medium tracking-wide"
                    style={{ color: layerColor }}
                  >
                    {data.title}
                  </h3>
                  {data.value && (
                    <p className="text-white text-lg font-mono font-bold">
                      {data.value}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={12} style={{ color: layerColor }} />
                  <span 
                    className="text-xs font-mono"
                    style={{ color: layerColor }}
                  >
                    {data.confidence}%
                  </span>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="relative p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Brain size={12} className="text-white/60" />
                <span className="text-xs text-white/60 font-medium tracking-wider uppercase">
                  Insights
                </span>
              </div>
              
              {data.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-2 text-sm text-white/80"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div 
                    className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: layerColor }}
                  />
                  <span className="leading-relaxed">{insight}</span>
                </motion.div>
              ))}

              {/* Confidence bar */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-white/50">Confidence</span>
                  <span className="text-xs text-white/70">{data.timestamp}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: layerColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${data.confidence}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {/* Elegant connection line indicator */}
            <div 
              className="absolute -left-2 top-1/2 w-2 h-2 rounded-full transform -translate-y-1/2"
              style={{ 
                backgroundColor: layerColor,
                boxShadow: `0 0 10px ${layerColor}80`
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
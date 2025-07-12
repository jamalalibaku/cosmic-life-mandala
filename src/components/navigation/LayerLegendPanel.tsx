/**
 * Layer Legend Panel
 * Explains the visual language of the mandala system
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Circle, Square, Triangle, Star, Hexagon, Activity, Moon, Car, Heart, Cloud } from 'lucide-react';

interface LayerLegendProps {
  isVisible: boolean;
  onClose: () => void;
}

export const LayerLegendPanel: React.FC<LayerLegendProps> = ({ 
  isVisible, 
  onClose 
}) => {
  const visualElements = [
    {
      category: "Arc Layers",
      description: "Time-based durations and ranges",
      items: [
        { name: "Weather", icon: Cloud, shape: "arc", color: "hsl(200, 70%, 65%)", description: "Temperature, conditions, UV index" },
        { name: "Plans", icon: Activity, shape: "arc", color: "hsl(30, 70%, 65%)", description: "Events and scheduled activities" },
        { name: "Sleep", icon: Moon, shape: "arc", color: "hsl(240, 60%, 70%)", description: "Sleep duration and quality phases" }
      ]
    },
    {
      category: "Marble Layers", 
      description: "Moment-based data points",
      items: [
        { name: "Mood", icon: Heart, shape: "marble", color: "hsl(340, 70%, 65%)", description: "Emotional states and intensity" },
        { name: "Mobility", icon: Car, shape: "marble", color: "hsl(120, 60%, 60%)", description: "Movement and activity moments" }
      ]
    },
    {
      category: "Interactive Elements",
      description: "How to engage with the data",
      items: [
        { name: "Hover", icon: Circle, shape: "interaction", color: "hsl(280, 60%, 70%)", description: "Shows contextual insights and patterns" },
        { name: "Click", icon: Square, shape: "interaction", color: "hsl(45, 70%, 65%)", description: "Opens detailed analysis panels" },
        { name: "Long Press", icon: Triangle, shape: "interaction", color: "hsl(160, 60%, 65%)", description: "Activates layer-specific tools" }
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-2xl w-full bg-black/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-light text-white tracking-wide">
                  Mandala Visual Guide
                </h2>
                <p className="text-sm text-white/60 mt-1">
                  Understanding the cosmic timeline language
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-white/60" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8 max-h-96 overflow-y-auto">
              {visualElements.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">
                      {category.category}
                    </h3>
                    <p className="text-sm text-white/60">
                      {category.description}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {category.items.map((item, itemIndex) => (
                      <motion.div
                        key={item.name}
                        className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (categoryIndex * category.items.length + itemIndex) * 0.05 }}
                      >
                        {/* Visual representation */}
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ 
                              backgroundColor: `${item.color}20`,
                              border: `1px solid ${item.color}40`
                            }}
                          >
                            <item.icon 
                              size={16} 
                              style={{ color: item.color }}
                            />
                          </div>
                          
                          {/* Shape indicator */}
                          <div className="flex items-center gap-2">
                            {item.shape === 'arc' && (
                              <svg width="24" height="16" viewBox="0 0 24 16">
                                <path
                                  d="M 2 14 Q 12 2 22 14"
                                  stroke={item.color}
                                  strokeWidth="2"
                                  fill="none"
                                />
                              </svg>
                            )}
                            {item.shape === 'marble' && (
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ 
                                  backgroundColor: item.color,
                                  boxShadow: `0 0 8px ${item.color}60`
                                }}
                              />
                            )}
                            {item.shape === 'interaction' && (
                              <div 
                                className="w-4 h-4 rounded border-2"
                                style={{ borderColor: item.color }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="flex-1">
                          <h4 
                            className="font-medium text-sm"
                            style={{ color: item.color }}
                          >
                            {item.name}
                          </h4>
                          <p className="text-xs text-white/60 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-white/5">
              <p className="text-xs text-white/50 text-center">
                Hover over any element to see contextual insights • Click for detailed analysis
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
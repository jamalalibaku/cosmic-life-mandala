/**
 * Layer Filter Panel
 * Toggle visibility of individual mandala layers for clarity
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Activity, Moon, Car, Heart, Cloud, MapPin } from 'lucide-react';

interface LayerFilterProps {
  isVisible: boolean;
  onClose: () => void;
  onLayerToggle: (layerId: string, visible: boolean) => void;
  activeLayers: string[];
}

export const LayerFilterPanel: React.FC<LayerFilterProps> = ({ 
  isVisible, 
  onClose,
  onLayerToggle,
  activeLayers
}) => {
  const layers = [
    { id: 'weather', name: 'Weather', icon: Cloud, color: 'hsl(200, 70%, 65%)', description: 'Temperature, conditions, and atmospheric data' },
    { id: 'plans', name: 'Plans', icon: Activity, color: 'hsl(30, 70%, 65%)', description: 'Scheduled events and activities' },
    { id: 'sleep', name: 'Sleep', icon: Moon, color: 'hsl(240, 60%, 70%)', description: 'Sleep patterns and quality metrics' },
    { id: 'mood', name: 'Mood', icon: Heart, color: 'hsl(340, 70%, 65%)', description: 'Emotional states and well-being' },
    { id: 'mobility', name: 'Mobility', icon: Car, color: 'hsl(120, 60%, 60%)', description: 'Movement and transportation' },
    { id: 'places', name: 'Places', icon: MapPin, color: 'hsl(280, 60%, 70%)', description: 'Location data and context' }
  ];

  const handleToggle = (layerId: string) => {
    const isCurrentlyActive = activeLayers.includes(layerId);
    onLayerToggle(layerId, !isCurrentlyActive);
  };

  const toggleAll = () => {
    const allActive = layers.every(layer => activeLayers.includes(layer.id));
    layers.forEach(layer => {
      onLayerToggle(layer.id, !allActive);
    });
  };

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
            className="relative max-w-md w-full bg-black/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-light text-white tracking-wide">
                  Layer Visibility
                </h2>
                <p className="text-sm text-white/60 mt-1">
                  Toggle layers for visual clarity
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
            <div className="p-6 space-y-4">
              {/* Toggle All Button */}
              <motion.button
                onClick={toggleAll}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-white font-medium">
                  {layers.every(layer => activeLayers.includes(layer.id)) ? 'Hide All' : 'Show All'}
                </span>
                {layers.every(layer => activeLayers.includes(layer.id)) ? (
                  <EyeOff size={18} className="text-white/60" />
                ) : (
                  <Eye size={18} className="text-white/60" />
                )}
              </motion.button>

              {/* Individual layer toggles */}
              <div className="space-y-2">
                {layers.map((layer, index) => {
                  const isActive = activeLayers.includes(layer.id);
                  
                  return (
                    <motion.button
                      key={layer.id}
                      onClick={() => handleToggle(layer.id)}
                      className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 border ${
                        isActive 
                          ? 'bg-white/10 border-white/20' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Layer icon */}
                      <div 
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          isActive ? 'opacity-100' : 'opacity-50'
                        }`}
                        style={{ 
                          backgroundColor: isActive ? `${layer.color}20` : 'transparent',
                          border: `1px solid ${isActive ? layer.color + '40' : 'transparent'}`
                        }}
                      >
                        <layer.icon 
                          size={16} 
                          style={{ color: isActive ? layer.color : '#ffffff60' }}
                        />
                      </div>

                      {/* Layer info */}
                      <div className="flex-1 text-left">
                        <h4 
                          className={`font-medium text-sm transition-colors ${
                            isActive ? 'text-white' : 'text-white/60'
                          }`}
                        >
                          {layer.name}
                        </h4>
                        <p className="text-xs text-white/40 mt-1">
                          {layer.description}
                        </p>
                      </div>

                      {/* Visibility indicator */}
                      <div className="flex-shrink-0">
                        {isActive ? (
                          <Eye 
                            size={18} 
                            style={{ color: layer.color }}
                          />
                        ) : (
                          <EyeOff size={18} className="text-white/30" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-white/5">
              <p className="text-xs text-white/50 text-center">
                {activeLayers.length} of {layers.length} layers visible
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
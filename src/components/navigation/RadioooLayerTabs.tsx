/**
 * Radiooooo-Style Layer Tabs - Horizontal tabs with colored orbs
 * Inspired by Radiooooo's elegant tab system
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Briefcase, Calendar, MapPin, Activity, Cloud } from 'lucide-react';

interface LayerTab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  active: boolean;
  dataCount?: number;
}

const LAYER_TABS: LayerTab[] = [
  {
    id: 'mood',
    label: 'Mood',
    icon: Heart,
    color: 'hsl(340, 70%, 65%)',
    active: true,
    dataCount: 24
  },
  {
    id: 'plans',
    label: 'Plans',
    icon: Calendar,
    color: 'hsl(260, 60%, 70%)',
    active: true,
    dataCount: 12
  },
  {
    id: 'places',
    label: 'Places',
    icon: MapPin,
    color: 'hsl(30, 70%, 65%)',
    active: true,
    dataCount: 8
  },
  {
    id: 'mobility',
    label: 'Mobility',
    icon: Activity,
    color: 'hsl(140, 60%, 65%)',
    active: false,
    dataCount: 156
  },
  {
    id: 'weather',
    label: 'Weather',
    icon: Cloud,
    color: 'hsl(200, 60%, 65%)',
    active: true,
    dataCount: 31
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: Briefcase,
    color: 'hsl(45, 70%, 65%)',
    active: false,
    dataCount: 3
  }
];

interface RadioooLayerTabsProps {
  onLayerToggle?: (layerId: string, active: boolean) => void;
  onLayerSelect?: (layerId: string) => void;
}

export const RadioooLayerTabs: React.FC<RadioooLayerTabsProps> = ({
  onLayerToggle,
  onLayerSelect
}) => {
  const [tabs, setTabs] = useState(LAYER_TABS);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const handleTabClick = (tabId: string) => {
    if (selectedTab === tabId) {
      setSelectedTab(null);
    } else {
      setSelectedTab(tabId);
      onLayerSelect?.(tabId);
    }
  };

  const handleToggle = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setTabs(prev => 
      prev.map(tab => 
        tab.id === tabId ? { ...tab, active: !tab.active } : tab
      )
    );
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      onLayerToggle?.(tabId, !tab.active);
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30">
      <div className="space-y-3">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isSelected = selectedTab === tab.id;
          
          return (
            <motion.div
              key={tab.id}
              className="relative"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            >
              {/* Main tab */}
              <motion.div
                className={`flex items-center bg-black/20 backdrop-blur-sm border border-white/10 rounded-full cursor-pointer transition-all duration-300 ${
                  isSelected ? 'bg-black/40 border-white/20' : 'hover:bg-black/30'
                }`}
                onClick={() => handleTabClick(tab.id)}
                whileHover={{ scale: 1.02, x: -4 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  width: isSelected ? 140 : 60,
                  paddingRight: isSelected ? 16 : 8
                }}
              >
                {/* Colored orb with icon */}
                <motion.div
                  className="relative w-12 h-12 rounded-full flex items-center justify-center m-1 overflow-hidden"
                  style={{ backgroundColor: tab.color }}
                  animate={{
                    boxShadow: tab.active 
                      ? `0 0 20px ${tab.color}40` 
                      : `0 0 8px ${tab.color}20`
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  {/* Orb glow effect */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-50 animate-pulse"
                    style={{ backgroundColor: tab.color }}
                  />
                  
                  <Icon 
                    className={`relative z-10 w-5 h-5 transition-colors duration-300 ${
                      tab.active ? 'text-white' : 'text-white/60'
                    }`}
                  />
                  
                  {/* Data count indicator */}
                  {tab.dataCount && tab.dataCount > 0 && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black rounded-full flex items-center justify-center text-xs font-medium"
                      initial={{ scale: 0 }}
                      animate={{ scale: tab.active ? 1 : 0.8 }}
                    >
                      {tab.dataCount > 99 ? '99+' : tab.dataCount}
                    </motion.div>
                  )}
                </motion.div>

                {/* Tab label */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      className="flex items-center space-x-2 overflow-hidden"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-sm font-medium text-white whitespace-nowrap">
                        {tab.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Toggle switch */}
                <motion.button
                  className={`absolute right-2 w-6 h-3 rounded-full transition-colors duration-300 ${
                    tab.active ? 'bg-primary' : 'bg-white/20'
                  }`}
                  onClick={(e) => handleToggle(tab.id, e)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full shadow-sm"
                    animate={{
                      x: tab.active ? 12 : 2,
                      y: 2
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </motion.div>

              {/* Pulse ripple when clicked */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 pointer-events-none"
                  style={{ borderColor: tab.color }}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}

              {/* Tab content panel (placeholder for future) */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    className="absolute right-full top-0 mr-4 w-80 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10 p-4"
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-white">
                      <h3 className="text-lg font-medium mb-2">{tab.label} Insights</h3>
                      <p className="text-sm text-white/70">
                        {tab.dataCount} data points available. Layer is {tab.active ? 'active' : 'inactive'}.
                      </p>
                      
                      {/* Placeholder for layer-specific content */}
                      <div className="mt-4 space-y-2">
                        <div className="h-2 bg-white/10 rounded animate-pulse" />
                        <div className="h-2 bg-white/10 rounded animate-pulse w-3/4" />
                        <div className="h-2 bg-white/10 rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-6 text-xs text-white/40 text-center">
        Click tabs to explore
      </div>
    </div>
  );
};
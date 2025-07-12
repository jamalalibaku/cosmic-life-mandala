/**
 * Unified Navigation Header
 * Consistent navigation across all themes
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Settings, MapPin, Clock } from 'lucide-react';
import { TimeScale } from '@/components/fractal-time-zoom-manager';
import { InsightIntelligenceTrigger } from '@/components/InsightIntelligenceTrigger';
import { InsightTriggerButton } from '@/components/insights/InsightTriggerButton';
import { RadialMenu } from './RadialMenu';

export interface UnifiedNavigationProps {
  currentTimeScale: TimeScale;
  onTimeScaleChange: (scale: TimeScale) => void;
  onSettingsClick: () => void;
  showSettings?: boolean;
  themeConfig: any;
  className?: string;
  currentTimeSlices?: any[];
  recentInteractions?: Array<{
    layerType: string;
    timestamp: string;
    dataValue: any;
  }>;
}

const timeScaleOptions: { value: TimeScale; label: string; icon: string }[] = [
  { value: 'day', label: 'Day', icon: '📅' },
  { value: 'week', label: 'Week', icon: '📊' },
  { value: 'month', label: 'Month', icon: '🗓️' },
  { value: 'year', label: 'Year', icon: '📆' },
  { value: 'side', label: 'Side', icon: '📐' }
];

export const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({
  currentTimeScale,
  onTimeScaleChange,
  onSettingsClick,
  showSettings = true,
  themeConfig,
  className = '',
  currentTimeSlices = [],
  recentInteractions = []
}) => {
  return (
    <motion.div
      className={`fixed top-4 left-4 z-50 flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* View Scale Selector */}
      <div className="flex items-center gap-1 p-1 rounded-lg backdrop-blur-sm"
           style={{
             backgroundColor: `${themeConfig.colors.background}90`,
             border: `1px solid ${themeConfig.colors.accent}40`
           }}>
        {timeScaleOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onTimeScaleChange(option.value)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              option.value === currentTimeScale ? 'opacity-100' : 'opacity-60 hover:opacity-80'
            }`}
            style={{
              backgroundColor: option.value === currentTimeScale 
                ? `${themeConfig.colors.accent}20` 
                : 'transparent',
              color: themeConfig.colors.text,
              border: option.value === currentTimeScale 
                ? `1px solid ${themeConfig.colors.accent}60` 
                : '1px solid transparent'
            }}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {/* NOW Indicator */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm"
           style={{
             backgroundColor: `${themeConfig.colors.primary}20`,
             border: `1px solid ${themeConfig.colors.primary}40`,
             color: themeConfig.colors.primary
           }}>
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Location Indicator */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm"
           style={{
             backgroundColor: `${themeConfig.colors.text}10`,
             border: `1px solid ${themeConfig.colors.text}20`,
             color: themeConfig.colors.text
           }}>
        <MapPin className="w-4 h-4" />
        <span className="text-sm opacity-70">Local</span>
      </div>

      {/* Settings Button */}
      {showSettings && (
        <button
          onClick={onSettingsClick}
          className="p-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: `${themeConfig.colors.accent}20`,
            border: `1px solid ${themeConfig.colors.accent}40`,
            color: themeConfig.colors.accent
          }}
        >
          <Settings className="w-4 h-4" />
        </button>
      )}

      {/* Radial Menu System */}
      <RadialMenu
        onSettingsClick={onSettingsClick}
        onTimeScale={() => console.log('Time scale triggered')}
        onThemeChange={() => console.log('Theme change triggered')}
        onZoomIn={() => console.log('Zoom in')}
        onZoomOut={() => console.log('Zoom out')}
        onLocationToggle={() => console.log('Location toggle')}
      />
      
      {/* Behavioral Correlation Engine */}
      <InsightTriggerButton />
    </motion.div>
  );
};